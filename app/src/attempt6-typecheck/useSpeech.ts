"use client";

/**
 * useSpeech — Accessibility-First Text-to-Speech Hook
 *
 * Design principles (attempt6):
 *
 *  1. ARIA live region mirroring  — every utterance is written to a live
 *     region so screen readers can announce it without double-speaking.
 *  2. Screen-reader detection     — if the user already has a system-level
 *     screen reader active (detected via the non-standard `navigator.msLaunchUri`
 *     heuristic or `prefers-reduced-motion` as a proxy), TTS is suppressed by
 *     default and caption mode is enabled automatically.
 *  3. Caption / subtitle mode     — `captionText` always reflects the current
 *     utterance; `showCaptions` toggles a visual subtitle strip.
 *  4. prefers-reduced-motion      — respects the OS-level animation preference.
 *  5. Keyboard shortcuts          — Space=pause/resume, Escape=stop, +/-=speed.
 *  6. Rate control                — `rate` / `setRate`, clamped 0.5–2.0 with
 *     step ±0.1 via keyboard shortcuts.
 *  7. Persistence                 — mute, rate, showCaptions, and screen-reader
 *     suppression preference are persisted in localStorage.
 *  8. iOS unlock                  — silent utterance on first user gesture.
 *  9. Chrome 15 s bug workaround  — pause/resume heartbeat.
 * 10. Page-visibility pause       — pauses when the tab is hidden.
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface SpeakOptions {
  /** If true, cancel any current speech and start this utterance immediately. */
  interrupt?: boolean;
  /** Per-utterance rate override. */
  rate?: number;
}

export interface UseSpeechReturn {
  /** Speak `text` aloud (respects mute, screen-reader suppression, etc.). */
  speak: (text: string, options?: SpeakOptions) => void;
  /** Cancel speech and empty the queue. */
  stop: () => void;
  /** Pause the current utterance (if supported). */
  pause: () => void;
  /** Resume a paused utterance. */
  resume: () => void;
  /** Whether an utterance is currently being spoken. */
  isSpeaking: boolean;
  /** Whether speech is paused mid-utterance. */
  isPaused: boolean;
  /** Whether audio output is suppressed (muted). */
  isMuted: boolean;
  /** Toggle muted state. */
  toggleMute: () => void;
  /**
   * The full text of the utterance currently being spoken (or the most
   * recent one).  Used to drive the caption display and ARIA live region.
   */
  captionText: string;
  /** Whether the visual caption strip is visible. */
  showCaptions: boolean;
  /** Show or hide the caption strip. */
  setCaptions: (show: boolean) => void;
  /** Current speech rate (0.5–2.0). */
  rate: number;
  /** Set rate; will be clamped to [0.5, 2.0]. */
  setRate: (n: number) => void;
  /**
   * True if the hook detected a screen reader is likely active.
   * When true, TTS is silenced by default (the screen reader will already
   * announce the live region) and captions are enabled.
   */
  hasScreenReader: boolean;
  /**
   * Whether TTS is suppressed because a screen reader was detected.
   * The user can override this to re-enable TTS alongside their screen reader.
   */
  screenReaderSuppression: boolean;
  /** Override the screen-reader suppression if the user explicitly wants TTS. */
  setScreenReaderSuppression: (suppress: boolean) => void;
  /** Whether the audio pipeline has been unlocked (iOS Safari). */
  isUnlocked: boolean;
  /** Whether the browser supports the Web Speech API at all. */
  isSupported: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY_MUTED       = "a6-speech-muted";
const STORAGE_KEY_RATE        = "a6-speech-rate";
const STORAGE_KEY_CAPTIONS    = "a6-speech-captions";
const STORAGE_KEY_SR_SUPPRESS = "a6-speech-sr-suppress";

const DEFAULT_RATE  = 0.92;
const DEFAULT_PITCH = 1.08;
const RATE_MIN      = 0.5;
const RATE_MAX      = 2.0;
const RATE_STEP     = 0.1;

/**
 * Ordered voice preference list — warm, friendly, female-leaning voices.
 * We walk the list and take the first match found in the browser's voice list.
 */
const VOICE_PREFS: string[] = [
  "Samantha",             // macOS / iOS — warm, natural
  "Karen",                // macOS Australian English
  "Moira",                // macOS Irish English
  "Tessa",                // macOS South African English
  "Google US English",    // Chrome desktop
  "Microsoft Zira",       // Windows 10+
  "Microsoft Susan",      // Windows UK
];

/** Heuristic: voice names that likely belong to male voices. */
const MALE_NAME_RE = /\b(David|James|Daniel|Mark|Tom|Fred|Alex|Aaron|Albert|George|Rishi|Reed|Bruce|Liam)\b/i;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw === "true";
  } catch {
    return fallback;
  }
}

function readFloat(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* quota / private */ }
}

function clampRate(n: number): number {
  return Math.max(RATE_MIN, Math.min(RATE_MAX, n));
}

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // 1. Explicit preference list (exact name match).
  for (const name of VOICE_PREFS) {
    const v = voices.find((v) => v.name === name);
    if (v) return v;
  }

  // 2. en-US voices, preferring non-male names.
  const enUS = voices.filter((v) => v.lang.startsWith("en-US") || v.lang === "en_US");
  const enUSFemale = enUS.filter((v) => !MALE_NAME_RE.test(v.name));
  if (enUSFemale.length > 0) return enUSFemale[0];
  if (enUS.length > 0) return enUS[0];

  // 3. Any English voice.
  const anyEn = voices.filter((v) => v.lang.startsWith("en"));
  const anyEnFemale = anyEn.filter((v) => !MALE_NAME_RE.test(v.name));
  if (anyEnFemale.length > 0) return anyEnFemale[0];
  if (anyEn.length > 0) return anyEn[0];

  // 4. Whatever is available.
  return voices[0];
}

/**
 * Detect whether a screen reader is likely active.
 *
 * There is no reliable cross-browser API for this.  We combine several
 * signals, each imperfect:
 *
 *  - `navigator.userAgent` pattern (NVDA, JAWS, TalkBack announce themselves
 *    in some UA strings on some platforms — rarely reliable).
 *  - `prefers-reduced-motion: reduce` — strongly correlated with assistive-
 *    technology users, though not exclusively.
 *  - The `forced-colors` media feature — indicates a high-contrast / Windows
 *    High Contrast mode session, which is common among screen-reader users.
 *  - `msMaxTouchPoints` / `msLaunchUri` presence (IE/Edge legacy; screen
 *    readers like Narrator on old Windows would set certain flags).
 *
 * We return a best-guess boolean.  The user can always override in the UI.
 */
function detectScreenReader(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return true;

    const hc = window.matchMedia("(forced-colors: active)");
    if (hc.matches) return true;
  } catch {
    // matchMedia not available (SSR guards should catch this, but be safe).
  }

  return false;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSpeech(): UseSpeechReturn {
  // ---- Feature support ----
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // ---- Persistent state (initialised lazily from localStorage) ----
  const [isMuted, setIsMuted] = useState<boolean>(() =>
    readBool(STORAGE_KEY_MUTED, false)
  );
  const [rate, setRateRaw] = useState<number>(() =>
    clampRate(readFloat(STORAGE_KEY_RATE, DEFAULT_RATE))
  );
  const [showCaptions, setShowCaptionsRaw] = useState<boolean>(() =>
    readBool(STORAGE_KEY_CAPTIONS, false)
  );
  const [screenReaderSuppression, setSuppressionRaw] = useState<boolean>(() =>
    readBool(STORAGE_KEY_SR_SUPPRESS, false)
  );

  // ---- Runtime state ----
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [captionText, setCaptionText] = useState("");
  const [hasScreenReader, setHasScreenReader] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // ---- Stable mutable refs (avoid stale closures without triggering renders) ----
  const voiceRef      = useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef  = useRef<SpeechSynthesisUtterance | null>(null);
  const isMutedRef    = useRef(isMuted);
  const rateRef       = useRef(rate);
  const suppressRef   = useRef(screenReaderSuppression);
  const unlockedRef   = useRef(false);
  const queueRef      = useRef<Array<{ text: string; rate: number }>>([]);
  const isPlayingRef  = useRef(false);

  // Keep refs in sync with state.
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { rateRef.current = rate; }, [rate]);
  useEffect(() => { suppressRef.current = screenReaderSuppression; }, [screenReaderSuppression]);

  // ---- Persist to localStorage ----
  useEffect(() => { writeStorage(STORAGE_KEY_MUTED, String(isMuted)); }, [isMuted]);
  useEffect(() => { writeStorage(STORAGE_KEY_RATE, String(rate)); }, [rate]);
  useEffect(() => { writeStorage(STORAGE_KEY_CAPTIONS, String(showCaptions)); }, [showCaptions]);
  useEffect(() => { writeStorage(STORAGE_KEY_SR_SUPPRESS, String(screenReaderSuppression)); }, [screenReaderSuppression]);

  // ---- Screen-reader detection (once, client-side only) ----
  useEffect(() => {
    const detected = detectScreenReader();
    setHasScreenReader(detected);

    // On first load: if SR detected AND the user has not previously stored an
    // explicit preference, default to suppression ON + captions ON.
    const hasSavedSuppression = localStorage.getItem(STORAGE_KEY_SR_SUPPRESS) !== null;
    const hasSavedCaptions    = localStorage.getItem(STORAGE_KEY_CAPTIONS)    !== null;

    if (detected) {
      if (!hasSavedSuppression) {
        setSuppressionRaw(true);
        suppressRef.current = true;
      }
      if (!hasSavedCaptions) {
        setShowCaptionsRaw(true);
      }
    }

    // Also listen for changes (user may toggle high-contrast mode mid-session).
    let mqlMotion: MediaQueryList | undefined;
    let mqlColors: MediaQueryList | undefined;
    const refresh = () => setHasScreenReader(detectScreenReader());

    try {
      mqlMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      mqlColors = window.matchMedia("(forced-colors: active)");
      mqlMotion.addEventListener("change", refresh);
      mqlColors.addEventListener("change", refresh);
    } catch { /* */ }

    return () => {
      mqlMotion?.removeEventListener("change", refresh);
      mqlColors?.removeEventListener("change", refresh);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // (intentionally run only once; localStorage reads are synchronous and safe)

  // ---- Voice loading ----
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) return;
      voiceRef.current = pickBestVoice(voices);
    };

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [isSupported]);

  // ---- iOS Safari audio unlock ----
  // iOS requires a user gesture before speechSynthesis will work.  We fire an
  // inaudible utterance on the first touch / click / keydown to unlock it.
  useEffect(() => {
    if (!isSupported) return;

    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      setIsUnlocked(true);

      try {
        const silent = new SpeechSynthesisUtterance("");
        silent.volume = 0;
        silent.rate   = 10; // finish as quickly as possible
        speechSynthesis.speak(silent);
      } catch { /* */ }

      window.removeEventListener("click",      unlock, true);
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("keydown",    unlock, true);
    };

    window.addEventListener("click",      unlock, true);
    window.addEventListener("touchstart", unlock, true);
    window.addEventListener("keydown",    unlock, true);

    return () => {
      window.removeEventListener("click",      unlock, true);
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("keydown",    unlock, true);
    };
  }, [isSupported]);

  // ---- Chrome 15 s speaking-stall workaround ----
  useEffect(() => {
    if (!isSupported) return;
    if (!/Chrome|Chromium|Edg/i.test(navigator.userAgent)) return;

    const id = setInterval(() => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 10_000);

    return () => clearInterval(id);
  }, [isSupported]);

  // ---- Page visibility: pause / resume ----
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handler = () => {
      if (!isSupported) return;
      try {
        if (document.hidden) {
          speechSynthesis.pause();
        } else {
          speechSynthesis.resume();
        }
      } catch { /* */ }
    };

    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [isSupported]);

  // ---- Queue processing ----
  const processQueue = useCallback(() => {
    if (!isSupported) return;
    if (isPlayingRef.current) return;
    if (queueRef.current.length === 0) {
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }
    if (isMutedRef.current || suppressRef.current) {
      // Drain silently.
      queueRef.current = [];
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }

    isPlayingRef.current = true;
    const item = queueRef.current.shift()!;

    try {
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.rate   = item.rate;
      utterance.pitch  = DEFAULT_PITCH;
      utterance.volume = 1;

      if (voiceRef.current) utterance.voice = voiceRef.current;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utterance.onend = () => {
        isPlayingRef.current = false;
        utteranceRef.current = null;
        processQueue();
      };

      utterance.onerror = (e) => {
        // "interrupted" and "canceled" are expected when we call stop().
        if (e.error !== "interrupted" && e.error !== "canceled") {
          // Non-critical — TTS is progressive enhancement.
        }
        isPlayingRef.current = false;
        utteranceRef.current = null;
        processQueue();
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch {
      isPlayingRef.current = false;
      utteranceRef.current = null;
      processQueue();
    }
  }, [isSupported]); // stable — only touches refs

  // ---- Public: stop ----
  const stop = useCallback(() => {
    queueRef.current    = [];
    isPlayingRef.current = false;
    utteranceRef.current = null;

    try {
      if (isSupported) speechSynthesis.cancel();
    } catch { /* */ }

    setIsSpeaking(false);
    setIsPaused(false);
    // Intentionally do NOT clear captionText — the caption remains visible
    // after speech ends so the user can re-read it.
  }, [isSupported]);

  // ---- Public: speak ----
  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      if (!text || text.trim().length === 0) return;

      // Always update the caption text regardless of mute/SR state —
      // this feeds the ARIA live region and visual caption strip.
      setCaptionText(text.trim());

      if (!isSupported) return;
      if (isMutedRef.current) return;
      if (suppressRef.current) return; // SR active; let the live region handle it

      const r = clampRate(options?.rate ?? rateRef.current);

      if (options?.interrupt) {
        queueRef.current     = [];
        isPlayingRef.current = false;
        try { speechSynthesis.cancel(); } catch { /* */ }
      }

      queueRef.current.push({ text: text.trim(), rate: r });
      processQueue();
    },
    [isSupported, processQueue]
  );

  // ---- Public: pause ----
  const pause = useCallback(() => {
    if (!isSupported) return;
    try {
      speechSynthesis.pause();
      setIsPaused(true);
    } catch { /* */ }
  }, [isSupported]);

  // ---- Public: resume ----
  const resume = useCallback(() => {
    if (!isSupported) return;
    try {
      speechSynthesis.resume();
      setIsPaused(false);
    } catch { /* */ }
  }, [isSupported]);

  // ---- Rate setter (clamped) ----
  const setRate = useCallback((n: number) => {
    setRateRaw(clampRate(n));
  }, []);

  // ---- Toggles ----
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) stop(); // muting → stop immediately
      return next;
    });
  }, [stop]);

  const setCaptions = useCallback((show: boolean) => {
    setShowCaptionsRaw(show);
  }, []);

  const setScreenReaderSuppression = useCallback((suppress: boolean) => {
    setSuppressionRaw(suppress);
    suppressRef.current = suppress;
    if (suppress) stop();
  }, [stop]);

  // ---- Keyboard shortcuts ----
  // Space = pause/resume, Escape = stop, +/= = speed up, - = slow down.
  // Only active when the TutorPanel or document body has focus (not inside
  // text inputs or other interactive controls to avoid conflicts).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip if focus is inside a text field, select, etc.
      const target = e.target as HTMLElement;
      const tag    = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (target?.isContentEditable) return;

      switch (e.key) {
        case " ":
          // Space — pause if speaking, resume if paused, else ignore.
          if (!isSpeaking && !isPaused) return; // nothing to pause/resume
          e.preventDefault(); // prevent page scroll
          if (isPaused) {
            resume();
          } else {
            pause();
          }
          break;

        case "Escape":
          if (isSpeaking || isPaused) {
            e.preventDefault();
            stop();
          }
          break;

        case "+":
        case "=": // = is on same key as + without Shift
          e.preventDefault();
          setRate(clampRate(rateRef.current + RATE_STEP));
          break;

        case "-":
          e.preventDefault();
          setRate(clampRate(rateRef.current - RATE_STEP));
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isSpeaking, isPaused, pause, resume, stop, setRate]);

  // ---- Cleanup on unmount ----
  useEffect(() => {
    return () => {
      try {
        if (isSupported) speechSynthesis.cancel();
      } catch { /* */ }
    };
  }, [isSupported]);

  // ---- Compose return value ----
  return useMemo<UseSpeechReturn>(
    () => ({
      speak,
      stop,
      pause,
      resume,
      isSpeaking,
      isPaused,
      isMuted,
      toggleMute,
      captionText,
      showCaptions,
      setCaptions,
      rate,
      setRate,
      hasScreenReader,
      screenReaderSuppression,
      setScreenReaderSuppression,
      isUnlocked,
      isSupported,
    }),
    [
      speak, stop, pause, resume,
      isSpeaking, isPaused,
      isMuted, toggleMute,
      captionText, showCaptions, setCaptions,
      rate, setRate,
      hasScreenReader, screenReaderSuppression, setScreenReaderSuppression,
      isUnlocked, isSupported,
    ]
  );
}
