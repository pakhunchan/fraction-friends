"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpeakOptions {
  /** Override the default rate for this utterance only. */
  rate?: number;
  /** Override the default pitch for this utterance only. */
  pitch?: number;
  /** If true, skip the queue and interrupt anything currently speaking. */
  interrupt?: boolean;
}

interface SpeechContextValue {
  /** Speak text aloud. Queues if already speaking (unless interrupt option). */
  speak: (text: string, options?: SpeakOptions) => void;
  /** Cancel current speech and clear the queue. */
  stop: () => void;
  /** Whether an utterance is currently being spoken. */
  isSpeaking: boolean;
  /** Whether speech is muted. Muted = speak() calls are silently ignored. */
  isMuted: boolean;
  /** Toggle mute on/off. Persisted to localStorage. */
  toggleMute: () => void;
  /** Current speech rate (0.5 - 2.0). */
  rate: number;
  /** Set the speech rate. */
  setRate: (n: number) => void;
  /** Current pitch (0.5 - 2.0). */
  pitch: number;
  /** Set the pitch. */
  setPitch: (n: number) => void;
  /** Name of the currently selected voice, or null. */
  voiceName: string | null;
  /** Set voice by name. Pass null to revert to auto-selection. */
  setVoice: (name: string | null) => void;
  /** All available voice names (populated asynchronously). */
  availableVoices: string[];
  /** Whether the audio context has been unlocked (relevant on iOS Safari). */
  isUnlocked: boolean;
  /** Number of utterances waiting in the queue. */
  queueLength: number;
}

const SpeechContext = createContext<SpeechContextValue | null>(null);

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY_MUTED = "synthesis-tutor-muted";
const STORAGE_KEY_RATE = "synthesis-tutor-rate";

/** Kid-friendly defaults. */
const DEFAULT_RATE = 0.92;
const DEFAULT_PITCH = 1.08;

/**
 * Voice preference chain. We walk this list in order and pick the first match.
 * After exhausting the explicit list we fall back to heuristic matching.
 */
const VOICE_PREFERENCE: string[] = [
  "Samantha",            // macOS / iOS -- warm, natural
  "Karen",               // macOS Australian English
  "Moira",               // macOS Irish English
  "Tessa",               // macOS South African English
  "Google US English",   // Chrome on desktop
  "Microsoft Zira",      // Windows 10+
  "Microsoft Susan",     // Windows UK English
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readStorageBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === "true";
  } catch {
    return fallback;
  }
}

function readStorageFloat(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota exceeded or private browsing -- ignore.
  }
}

/**
 * Pick the best voice from the available list.
 *
 * Strategy:
 * 1. Walk the explicit VOICE_PREFERENCE list (exact name match).
 * 2. Any en-US female voice (heuristic: name does NOT contain obvious male markers).
 * 3. Any en-* voice.
 * 4. Whatever the browser gives us.
 */
function autoSelectVoice(
  voices: SpeechSynthesisVoice[],
  manualName: string | null
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // If the user manually chose a voice, honour it.
  if (manualName) {
    const manual = voices.find((v) => v.name === manualName);
    if (manual) return manual;
    // If the manual name no longer exists, fall through to auto.
  }

  // 1. Explicit preference list.
  for (const name of VOICE_PREFERENCE) {
    const match = voices.find((v) => v.name === name);
    if (match) return match;
  }

  // 2. en-US voices, preferring ones whose names don't contain male markers.
  const maleMarkers = /\b(David|James|Daniel|Mark|Tom|Fred|Alex|Aaron|Albert)\b/i;
  const enUS = voices.filter((v) => v.lang.startsWith("en-US") || v.lang === "en_US");
  const enUSFemale = enUS.filter((v) => !maleMarkers.test(v.name));
  if (enUSFemale.length > 0) return enUSFemale[0];
  if (enUS.length > 0) return enUS[0];

  // 3. Any English voice.
  const anyEn = voices.filter((v) => v.lang.startsWith("en"));
  const anyEnFemale = anyEn.filter((v) => !maleMarkers.test(v.name));
  if (anyEnFemale.length > 0) return anyEnFemale[0];
  if (anyEn.length > 0) return anyEn[0];

  // 4. Default.
  return voices[0];
}

// ---------------------------------------------------------------------------
// Queue item
// ---------------------------------------------------------------------------

interface QueueItem {
  text: string;
  rate: number;
  pitch: number;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SpeechProvider({ children }: { children: ReactNode }) {
  // ---- State ----
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(() => readStorageBool(STORAGE_KEY_MUTED, false));
  const [rate, setRateRaw] = useState(() => readStorageFloat(STORAGE_KEY_RATE, DEFAULT_RATE));
  const [pitch, setPitch] = useState(DEFAULT_PITCH);
  const [manualVoiceName, setManualVoiceName] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [queueLength, setQueueLength] = useState(0);

  // ---- Refs (mutable state that must not trigger re-renders) ----
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const voicesRawRef = useRef<SpeechSynthesisVoice[]>([]);
  const isMutedRef = useRef(isMuted);
  const queueRef = useRef<QueueItem[]>([]);
  const isProcessingRef = useRef(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const rateRef = useRef(rate);
  const pitchRef = useRef(pitch);
  const unlockedRef = useRef(false);

  // Keep refs in sync.
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { rateRef.current = rate; }, [rate]);
  useEffect(() => { pitchRef.current = pitch; }, [pitch]);

  // ---- Persist mute + rate to localStorage ----
  useEffect(() => { writeStorage(STORAGE_KEY_MUTED, String(isMuted)); }, [isMuted]);
  useEffect(() => { writeStorage(STORAGE_KEY_RATE, String(rate)); }, [rate]);

  // ---- Clamped rate setter ----
  const setRate = useCallback((n: number) => {
    setRateRaw(Math.max(0.5, Math.min(2.0, n)));
  }, []);

  // ---- Voice loading ----
  const loadVoices = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return;

    voicesRawRef.current = voices;
    setAvailableVoices(voices.map((v) => v.name));

    const best = autoSelectVoice(voices, manualVoiceName);
    voiceRef.current = best;
  }, [manualVoiceName]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Try immediately (Chrome populates synchronously on some platforms).
    loadVoices();

    // Also listen for the async event.
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [loadVoices]);

  // Re-select voice when the user changes their preference.
  useEffect(() => {
    const best = autoSelectVoice(voicesRawRef.current, manualVoiceName);
    voiceRef.current = best;
  }, [manualVoiceName]);

  // ---- iOS Safari audio unlock ----
  // iOS requires a user gesture to allow speechSynthesis. We fire an empty,
  // silent utterance on the first user interaction to "unlock" the audio.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      setIsUnlocked(true);

      // Speak an empty utterance to unlock the audio pipeline.
      try {
        const silent = new SpeechSynthesisUtterance("");
        silent.volume = 0;
        silent.rate = 10; // finish instantly
        speechSynthesis.speak(silent);
      } catch {
        // Non-critical.
      }

      // Remove listeners after unlock -- no need to keep them around.
      window.removeEventListener("click", unlock, true);
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };

    // Capture phase so we catch clicks before any stopPropagation.
    window.addEventListener("click", unlock, true);
    window.addEventListener("touchstart", unlock, true);
    window.addEventListener("keydown", unlock, true);

    return () => {
      window.removeEventListener("click", unlock, true);
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };
  }, []);

  // ---- Chrome bug workaround ----
  // Chrome on desktop has a bug where speech pauses after ~15s. The standard
  // workaround is to call speechSynthesis.pause() then resume() on a timer.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Detect Chrome-ish browsers (the bug is Blink-specific).
    const isChromium = /Chrome|Chromium|Edg/i.test(navigator.userAgent);
    if (!isChromium) return;

    const interval = setInterval(() => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 10_000);

    return () => clearInterval(interval);
  }, []);

  // ---- Queue processing ----
  const processQueue = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (isProcessingRef.current) return;
    if (queueRef.current.length === 0) {
      setQueueLength(0);
      setIsSpeaking(false);
      return;
    }
    if (isMutedRef.current) {
      // Drain the queue silently.
      queueRef.current = [];
      setQueueLength(0);
      setIsSpeaking(false);
      return;
    }

    isProcessingRef.current = true;
    const item = queueRef.current.shift()!;
    setQueueLength(queueRef.current.length);

    try {
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.rate = item.rate;
      utterance.pitch = item.pitch;
      utterance.volume = 1;

      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        isProcessingRef.current = false;
        currentUtteranceRef.current = null;
        // Process next item in the queue (if any).
        processQueue();
      };

      utterance.onerror = (e) => {
        // "interrupted" and "canceled" are expected when we call stop().
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.warn("[SpeechProvider] utterance error:", e.error);
        }
        isProcessingRef.current = false;
        currentUtteranceRef.current = null;
        processQueue();
      };

      currentUtteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch {
      isProcessingRef.current = false;
      currentUtteranceRef.current = null;
      processQueue();
    }
  }, []); // stable -- only uses refs

  // ---- Public API: speak ----
  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (isMutedRef.current) return;
      if (!text || text.trim().length === 0) return;

      const r = options?.rate ?? rateRef.current;
      const p = options?.pitch ?? pitchRef.current;

      if (options?.interrupt) {
        // Clear queue and cancel current speech, then enqueue this one.
        queueRef.current = [];
        try { speechSynthesis.cancel(); } catch { /* */ }
        isProcessingRef.current = false;
        currentUtteranceRef.current = null;
      }

      queueRef.current.push({ text, rate: r, pitch: p });
      setQueueLength(queueRef.current.length);
      processQueue();
    },
    [processQueue]
  );

  // ---- Public API: stop ----
  const stop = useCallback(() => {
    queueRef.current = [];
    setQueueLength(0);
    isProcessingRef.current = false;
    currentUtteranceRef.current = null;

    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        speechSynthesis.cancel();
      }
    } catch {
      // Swallow.
    }

    setIsSpeaking(false);
  }, []);

  // ---- Public API: toggleMute ----
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        // Muting: stop everything.
        stop();
      }
      return next;
    });
  }, [stop]);

  // ---- Public API: setVoice ----
  const setVoice = useCallback((name: string | null) => {
    setManualVoiceName(name);
  }, []);

  // ---- Page visibility: pause/resume ----
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handler = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      try {
        if (document.hidden) {
          speechSynthesis.pause();
        } else {
          speechSynthesis.resume();
        }
      } catch {
        // Some browsers throw if there is nothing to pause/resume.
      }
    };

    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // ---- Cleanup on unmount ----
  useEffect(() => {
    return () => {
      try {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          speechSynthesis.cancel();
        }
      } catch { /* */ }
    };
  }, []);

  // ---- Context value (memoized to avoid unnecessary re-renders) ----
  const voiceName = voiceRef.current?.name ?? null;

  const value = useMemo<SpeechContextValue>(
    () => ({
      speak,
      stop,
      isSpeaking,
      isMuted,
      toggleMute,
      rate,
      setRate,
      pitch,
      setPitch,
      voiceName,
      setVoice,
      availableVoices,
      isUnlocked,
      queueLength,
    }),
    [
      speak, stop, isSpeaking, isMuted, toggleMute,
      rate, setRate, pitch, setPitch,
      voiceName, setVoice, availableVoices,
      isUnlocked, queueLength,
    ]
  );

  return (
    <SpeechContext.Provider value={value}>
      {children}
    </SpeechContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access the SpeechContext from any component inside a SpeechProvider.
 *
 * Throws if used outside of a SpeechProvider -- this is intentional so that
 * misuse is caught immediately during development.
 */
export function useSpeech(): SpeechContextValue {
  const ctx = useContext(SpeechContext);
  if (!ctx) {
    throw new Error(
      "useSpeech() must be used inside a <SpeechProvider>. " +
      "Wrap your app (or the relevant subtree) in <SpeechProvider>.</SpeechProvider>."
    );
  }
  return ctx;
}
