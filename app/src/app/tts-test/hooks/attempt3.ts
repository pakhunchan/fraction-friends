"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseSpeechReturn {
  /** Speak text. Interrupts any current speech. */
  speak: (text: string) => void;
  /** Cancel all speech immediately. */
  stop: () => void;
  /** True while an utterance is being spoken. */
  isSpeaking: boolean;
  /** True when muted (speak() calls are silently ignored). */
  isMuted: boolean;
  /** Toggle mute on/off. Persisted to localStorage. */
  toggleMute: () => void;
  /** Speech rate, 0.5–2.0. Persisted to localStorage. */
  rate: number;
  /** Clamp-safe rate setter. */
  setRate: (n: number) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_MUTED = "tts-muted";
const STORAGE_RATE  = "tts-rate";

const DEFAULT_RATE  = 0.9;
const DEFAULT_PITCH = 1.1;

/**
 * Voice preference list.  The first exact-name match wins.
 * After the list we fall through to heuristic selection.
 */
const VOICE_PREFS: readonly string[] = [
  "Samantha",          // macOS / iOS — warm, natural
  "Karen",             // macOS Australian
  "Moira",             // macOS Irish
  "Tessa",             // macOS South African
  "Google US English", // Chrome desktop
  "Microsoft Zira",    // Windows 10+
  "Microsoft Susan",   // Windows UK
];

/**
 * Heuristic male-name markers used to prefer female voices when no explicit
 * preference matches.  This is intentionally conservative.
 */
const MALE_RE = /\b(David|James|Daniel|Mark|Tom|Fred|Alex|Aaron|Albert|George|Lee)\b/i;

// ---------------------------------------------------------------------------
// Text preprocessing
// ---------------------------------------------------------------------------

/**
 * Strip Markdown-ish formatting and expand fraction notation so the TTS
 * engine reads numbers naturally.
 *
 * Examples:
 *   "**Great job!**"      → "Great job!"
 *   "1/2 of the cookie"  → "one half of the cookie"
 *   "3/4 cup"            → "three quarters cup"
 *   "1/3"                → "one third"
 *   "2/3"                → "two thirds"
 *   "5/8"                → "5 eighths"    (unmapped → ordinal fallback)
 */
export function preprocessText(raw: string): string {
  // 1. Strip Markdown bold / italic / inline code.
  let t = raw
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/~~(.+?)~~/g, "$1");

  // 2. Strip Markdown headings (#, ##, …).
  t = t.replace(/^#{1,6}\s+/gm, "");

  // 3. Strip hyperlinks, keep label text.
  t = t.replace(/\[(.+?)\]\(.+?\)/g, "$1");

  // 4. Expand common fraction notations (must run before generic number pass).
  const FRACTIONS: Record<string, string> = {
    "1/2": "one half",
    "1/3": "one third",
    "2/3": "two thirds",
    "1/4": "one quarter",
    "3/4": "three quarters",
    "1/5": "one fifth",
    "2/5": "two fifths",
    "3/5": "three fifths",
    "4/5": "four fifths",
    "1/6": "one sixth",
    "5/6": "five sixths",
    "1/8": "one eighth",
    "3/8": "three eighths",
    "5/8": "five eighths",
    "7/8": "seven eighths",
  };

  // Match fractions that are NOT part of a larger number (e.g. URLs).
  // Pattern: word boundary, digit(s)/digit(s), word boundary.
  t = t.replace(/\b(\d+)\/(\d+)\b/g, (match) => {
    return FRACTIONS[match] ?? match.replace("/", " over ");
  });

  // 5. Collapse excess whitespace.
  t = t.replace(/[ \t]+/g, " ").trim();

  return t;
}

/**
 * Split preprocessed text into sentence-sized chunks for smoother delivery.
 * Splitting on [.!?] followed by whitespace or end-of-string.
 */
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function readBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === "true";
  } catch {
    return fallback;
  }
}

function readFloat(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private browsing / quota — silently ignore.
  }
}

// ---------------------------------------------------------------------------
// Voice selection
// ---------------------------------------------------------------------------

function pickVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // 1. Explicit preference list (exact name match).
  for (const name of VOICE_PREFS) {
    const v = voices.find((v) => v.name === name);
    if (v) return v;
  }

  // 2. en-US female-sounding voices.
  const enUS = voices.filter(
    (v) => v.lang === "en-US" || v.lang === "en_US"
  );
  const enUSF = enUS.filter((v) => !MALE_RE.test(v.name));
  if (enUSF.length) return enUSF[0];
  if (enUS.length)  return enUS[0];

  // 3. Any English voice.
  const enAny = voices.filter((v) => v.lang.startsWith("en"));
  const enAnyF = enAny.filter((v) => !MALE_RE.test(v.name));
  if (enAnyF.length) return enAnyF[0];
  if (enAny.length)  return enAny[0];

  // 4. Absolute fallback.
  return voices[0];
}

// ---------------------------------------------------------------------------
// Exponential-backoff retry helper
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 150;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useSpeech — ultra-minimal, robust text-to-speech hook for a kids' app.
 *
 * Features:
 *  - Graceful degradation (SSR-safe, works when API is absent)
 *  - Smart text preprocessing (strips Markdown, reads fractions naturally)
 *  - Sentence-level splitting for smoother delivery
 *  - Exponential backoff retry on transient errors
 *  - iOS Safari audio-unlock on first interaction
 *  - Chrome 15-second speaking bug workaround
 *  - Page-visibility pause / resume
 *  - mute + rate persisted to localStorage
 */
export function useSpeech(): UseSpeechReturn {
  // ---- Derived-from-localStorage initial state ----
  const [isMuted, setIsMuted] = useState<boolean>(() =>
    readBool(STORAGE_MUTED, false)
  );
  const [rate, setRateState] = useState<number>(() =>
    readFloat(STORAGE_RATE, DEFAULT_RATE)
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ---- Stable refs (never trigger re-renders) ----
  const voiceRef       = useRef<SpeechSynthesisVoice | null>(null);
  const isMutedRef     = useRef(isMuted);
  const rateRef        = useRef(rate);
  const sentenceQueue  = useRef<string[]>([]);
  const isProcessing   = useRef(false);
  const retryCount     = useRef(0);
  const retryTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockedRef    = useRef(false);

  // Keep mutable refs in sync with state.
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { rateRef.current = rate; }, [rate]);

  // ---- Persist preferences ----
  useEffect(() => { persist(STORAGE_MUTED, String(isMuted)); }, [isMuted]);
  useEffect(() => { persist(STORAGE_RATE,  String(rate)); }, [rate]);

  // ---- Voice loading ----
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const load = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length) voiceRef.current = pickVoice(voices);
    };

    load(); // synchronous on some platforms
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  // ---- iOS Safari unlock ----
  // iOS requires a user gesture before speechSynthesis will actually produce
  // audio.  We fire a zero-volume utterance on the first interaction.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      try {
        const silent = new SpeechSynthesisUtterance(" ");
        silent.volume = 0;
        silent.rate = 10;
        speechSynthesis.speak(silent);
      } catch {
        // Non-critical.
      }
      window.removeEventListener("click",      unlock, true);
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("keydown",    unlock, true);
    };

    // Capture phase so we catch events before any stopPropagation.
    window.addEventListener("click",      unlock, true);
    window.addEventListener("touchstart", unlock, true);
    window.addEventListener("keydown",    unlock, true);

    return () => {
      window.removeEventListener("click",      unlock, true);
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("keydown",    unlock, true);
    };
  }, []);

  // ---- Chrome 15-second bug workaround ----
  // Chromium-based browsers stop speaking after ~15 s.  Nudging
  // pause/resume resets the timer without an audible glitch.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (!/Chrome|Chromium|Edg/i.test(navigator.userAgent)) return;

    const id = setInterval(() => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 10_000);

    return () => clearInterval(id);
  }, []);

  // ---- Page visibility: pause / resume ----
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handler = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      try {
        document.hidden ? speechSynthesis.pause() : speechSynthesis.resume();
      } catch {
        // Some browsers throw when there is nothing to pause/resume.
      }
    };

    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // ---- Cleanup on unmount ----
  useEffect(() => {
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
      try {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          speechSynthesis.cancel();
        }
      } catch { /* ignore */ }
    };
  }, []);

  // ---- Internal: speak one sentence, with retry on error ----
  // Defined with useCallback so processQueue can reference it stably.
  const speakSentence = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      isProcessing.current = false;
      setIsSpeaking(false);
      return;
    }

    const trySpeak = () => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate   = rateRef.current;
        utterance.pitch  = DEFAULT_PITCH;
        utterance.volume = 1;
        if (voiceRef.current) utterance.voice = voiceRef.current;

        utterance.onstart = () => setIsSpeaking(true);

        utterance.onend = () => {
          retryCount.current  = 0;
          isProcessing.current = false;
          // Kick off the next sentence.
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          processNextSentence();
        };

        utterance.onerror = (e) => {
          // "interrupted" / "canceled" are expected when stop() is called.
          if (e.error === "interrupted" || e.error === "canceled") {
            retryCount.current  = 0;
            isProcessing.current = false;
            setIsSpeaking(false);
            return;
          }

          // Transient error: retry with exponential backoff.
          if (retryCount.current < MAX_RETRIES) {
            const delay = BACKOFF_BASE_MS * 2 ** retryCount.current;
            retryCount.current += 1;
            retryTimer.current = setTimeout(trySpeak, delay);
          } else {
            // Exhausted retries — skip this sentence, move on.
            retryCount.current  = 0;
            isProcessing.current = false;
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            processNextSentence();
          }
        };

        speechSynthesis.speak(utterance);
      } catch {
        // Unexpected throw — skip sentence, move on gracefully.
        retryCount.current  = 0;
        isProcessing.current = false;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        processNextSentence();
      }
    };

    trySpeak();
  // processNextSentence is defined below and closes over this function,
  // so we accept the forward-reference via the inline eslint disable comments.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Internal: pull next sentence from queue ----
  const processNextSentence = useCallback(() => {
    if (isMutedRef.current) {
      sentenceQueue.current = [];
      isProcessing.current  = false;
      setIsSpeaking(false);
      return;
    }

    const next = sentenceQueue.current.shift();
    if (!next) {
      isProcessing.current = false;
      setIsSpeaking(false);
      return;
    }

    isProcessing.current = true;
    speakSentence(next);
  }, [speakSentence]);

  // ---- Public API: stop ----
  const stop = useCallback(() => {
    if (retryTimer.current) {
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
    }
    sentenceQueue.current = [];
    retryCount.current    = 0;
    isProcessing.current  = false;

    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        speechSynthesis.cancel();
      }
    } catch { /* ignore */ }

    setIsSpeaking(false);
  }, []);

  // ---- Public API: speak ----
  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (isMutedRef.current) return;
      if (!text?.trim()) return;

      // Cancel anything in flight.
      stop();

      // Preprocess and split into sentences.
      const cleaned   = preprocessText(text);
      const sentences = splitSentences(cleaned);
      if (!sentences.length) return;

      sentenceQueue.current = sentences;
      retryCount.current    = 0;
      processNextSentence();
    },
    [stop, processNextSentence]
  );

  // ---- Public API: toggleMute ----
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) stop(); // muting: halt speech immediately
      return next;
    });
  }, [stop]);

  // ---- Public API: setRate ----
  const setRate = useCallback((n: number) => {
    setRateState(Math.max(0.5, Math.min(2.0, n)));
  }, []);

  return { speak, stop, isSpeaking, isMuted, toggleMute, rate, setRate };
}
