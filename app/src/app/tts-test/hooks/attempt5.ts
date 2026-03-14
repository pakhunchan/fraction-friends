"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// =============================================================================
// Script markup language
// =============================================================================
//
// Supported tags inside a narration script string:
//
//   {pause:500}        — silent pause of 500 ms (any integer ms value)
//   {slow}…{/slow}     — speak enclosed text at 0.65× the base rate
//   {fast}…{/fast}     — speak enclosed text at 1.35× the base rate
//   {emphasis}…{/emphasis} — slightly slower (0.85×) + higher pitch (+0.15)
//   {whisper}…{/whisper}   — quiet, slow, low pitch (volume 0.4, rate 0.7)
//
// Everything else is treated as plain text and spoken at the base rate.
//
// Example:
//   "Great! {pause:300} Now let's try {slow}one half{/slow}."

// =============================================================================
// Types
// =============================================================================

/** A single parsed token from a narration script. */
type ScriptToken =
  | { kind: "text"; text: string; rate: number; pitch: number; volume: number }
  | { kind: "pause"; ms: number };

/**
 * A named entry in the narration queue.
 * `name` is optional — unnamed entries use a generated id.
 */
export interface NarrationEntry {
  id: string;
  script: string;
  /** Called once this entry begins speaking its first token. */
  onStart?: () => void;
  /** Called once all tokens in this entry have finished. */
  onEnd?: () => void;
}

/** State exposed to the consuming component. */
export interface NarrationState {
  /**
   * Enqueue a narration script. Supports markup (see top of file).
   *
   * @param script  The narration string (may contain markup).
   * @param name    Optional stable name — lets you cancel a specific entry.
   *                Defaults to an auto-generated id.
   * @param opts    Per-entry callbacks and an `interrupt` flag.
   */
  narrate: (
    script: string,
    name?: string,
    opts?: { interrupt?: boolean; onStart?: () => void; onEnd?: () => void }
  ) => void;

  /** Stop all speech and clear the queue entirely. */
  stop: () => void;

  /** Pause the current utterance (no-op if not speaking). */
  pause: () => void;

  /** Resume a paused utterance (no-op if not paused). */
  resume: () => void;

  /** True while any speech is actively playing or paused. */
  isSpeaking: boolean;

  /**
   * Progress of the current utterance, 0–100.
   * Updated from `onboundary` events when available, otherwise estimated
   * using a time-based interpolation.
   */
  progress: number;

  /**
   * Index of the current word within the *full reconstructed script text*
   * (all plain-text segments concatenated). -1 when not speaking.
   * Useful for word-highlight UIs.
   */
  currentWord: number;

  /** True when audio is muted (speak calls are no-op). */
  isMuted: boolean;

  /** Toggle mute state. Persists to localStorage. */
  toggleMute: () => void;

  /**
   * Base speech rate (0.5–2.0). Individual markup tags multiply against this.
   * Defaults to 0.9 (slightly slower — better for kids).
   */
  rate: number;

  /** Set the base speech rate. Clamped to [0.5, 2.0]. */
  setRate: (r: number) => void;

  /**
   * Run a silent pre-flight check.
   * Resolves `true` when the API is available and a voice has been selected.
   * Resolves `false` on any error, or after `timeoutMs` (default 3000).
   *
   * Call this before the lesson starts to surface a graceful "no audio"
   * message rather than silently failing mid-lesson.
   */
  preflight: (timeoutMs?: number) => Promise<boolean>;

  /**
   * Number of named entries currently waiting in the queue
   * (does not count the actively-playing entry).
   */
  queueLength: number;

  /**
   * Cancel a specific named entry from the queue, or stop it if it is
   * currently playing. Has no effect if the name is not found.
   */
  cancelNamed: (name: string) => void;

  /** All words extracted from the most-recently-started entry, for rendering. */
  scriptWords: string[];
}

// =============================================================================
// Internal types
// =============================================================================

/** One "job" in the internal queue: a parsed list of tokens + metadata. */
interface Job {
  id: string;
  name: string;
  tokens: ScriptToken[];
  /** Plain-text words (for word highlighting). */
  words: string[];
  onStart?: () => void;
  onEnd?: () => void;
}

// =============================================================================
// Constants
// =============================================================================

const STORAGE_KEY_MUTED = "narration-muted";
const STORAGE_KEY_RATE = "narration-rate";

const DEFAULT_RATE = 0.9;
const DEFAULT_PITCH = 1.08;

// Pause tag: {pause:500}
const PAUSE_RE = /\{pause:(\d+)\}/g;
// Block tag: {slow}…{/slow}, {fast}…{/fast}, {emphasis}…{/emphasis}, {whisper}…{/whisper}
const BLOCK_RE = /\{(slow|fast|emphasis|whisper)\}([\s\S]*?)\{\/(slow|fast|emphasis|whisper)\}/g;

const VOICE_PREFERENCE: string[] = [
  "Samantha",           // macOS / iOS — warm, natural
  "Karen",              // macOS Australian
  "Moira",              // macOS Irish
  "Tessa",              // macOS South African
  "Google US English",  // Chrome desktop
  "Microsoft Zira",     // Windows 10+
  "Microsoft Susan",    // Windows UK
];

// =============================================================================
// Helpers
// =============================================================================

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
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota exceeded / private browsing — ignore.
  }
}

function autoSelectVoice(
  voices: SpeechSynthesisVoice[],
  manualName: string | null
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  if (manualName) {
    const m = voices.find((v) => v.name === manualName);
    if (m) return m;
  }

  for (const name of VOICE_PREFERENCE) {
    const m = voices.find((v) => v.name === name);
    if (m) return m;
  }

  const maleMarkers =
    /\b(David|James|Daniel|Mark|Tom|Fred|Alex|Aaron|Albert)\b/i;
  const enUS = voices.filter(
    (v) => v.lang.startsWith("en-US") || v.lang === "en_US"
  );
  const enUSF = enUS.filter((v) => !maleMarkers.test(v.name));
  if (enUSF.length > 0) return enUSF[0];
  if (enUS.length > 0) return enUS[0];

  const anyEn = voices.filter((v) => v.lang.startsWith("en"));
  const anyEnF = anyEn.filter((v) => !maleMarkers.test(v.name));
  if (anyEnF.length > 0) return anyEnF[0];
  if (anyEn.length > 0) return anyEn[0];

  return voices[0];
}

/** Extract plain words from a script string after stripping all markup. */
function extractWords(script: string): string[] {
  // Remove all markup tags.
  const plain = script
    .replace(PAUSE_RE, " ")
    .replace(BLOCK_RE, " $2 ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.split(/\s+/).filter(Boolean);
}

// =============================================================================
// Script parser
// =============================================================================
//
// Converts a script string like:
//   "Hello {pause:400} world! {slow}Take your time{/slow}."
// into a flat array of ScriptToken values.

function parseScript(script: string, baseRate: number): ScriptToken[] {
  // Strategy: walk through the script string collecting tokens. We handle
  // block tags and pause tags by splitting on them. The remainder is plain text.

  // First, replace block tags with sentinel markers so we can split cleanly.
  // We build a list of segments: each segment is either a pause, a rate-
  // modified text span, or plain text.

  const tokens: ScriptToken[] = [];

  // We'll parse by iterating through the string, handling both block tags and
  // pause tags in one pass. We track a cursor position and collect plain text
  // between matches.

  // Build a unified regex that matches either a pause tag or any block open-tag.
  const UNIFIED_RE =
    /\{pause:(\d+)\}|\{(slow|fast|emphasis|whisper)\}([\s\S]*?)\{\/(slow|fast|emphasis|whisper)\}/g;

  let lastIndex = 0;

  for (const match of script.matchAll(UNIFIED_RE)) {
    const matchStart = match.index!;

    // Flush any plain text before this match.
    if (matchStart > lastIndex) {
      const plain = script.slice(lastIndex, matchStart).trim();
      if (plain) {
        tokens.push({
          kind: "text",
          text: plain,
          rate: baseRate,
          pitch: DEFAULT_PITCH,
          volume: 1,
        });
      }
    }

    if (match[1] !== undefined) {
      // Pause tag.
      tokens.push({ kind: "pause", ms: parseInt(match[1], 10) });
    } else {
      // Block tag.
      const tag = match[2] as "slow" | "fast" | "emphasis" | "whisper";
      const inner = match[3].trim();

      if (inner) {
        let rate = baseRate;
        let pitch = DEFAULT_PITCH;
        let volume = 1;

        switch (tag) {
          case "slow":
            rate = baseRate * 0.65;
            break;
          case "fast":
            rate = baseRate * 1.35;
            break;
          case "emphasis":
            rate = baseRate * 0.85;
            pitch = DEFAULT_PITCH + 0.15;
            break;
          case "whisper":
            rate = baseRate * 0.7;
            pitch = DEFAULT_PITCH - 0.25;
            volume = 0.4;
            break;
        }

        tokens.push({ kind: "text", text: inner, rate, pitch, volume });
      }
    }

    lastIndex = matchStart + match[0].length;
  }

  // Flush remaining plain text.
  const tail = script.slice(lastIndex).trim();
  if (tail) {
    tokens.push({
      kind: "text",
      text: tail,
      rate: baseRate,
      pitch: DEFAULT_PITCH,
      volume: 1,
    });
  }

  return tokens;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * useNarration — a rich narration engine with timeline control.
 *
 * Parses narration scripts with timing markup, exposes word-boundary progress,
 * a cancellable named queue, and a pre-flight API readiness check.
 */
export function useNarration(): NarrationState {
  // ---------------------------------------------------------------------------
  // Persisted state
  // ---------------------------------------------------------------------------

  const [isMuted, setIsMuted] = useState(() =>
    readStorageBool(STORAGE_KEY_MUTED, false)
  );
  const [rate, setRateRaw] = useState(() =>
    readStorageFloat(STORAGE_KEY_RATE, DEFAULT_RATE)
  );

  // ---------------------------------------------------------------------------
  // Reactive state
  // ---------------------------------------------------------------------------

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentWord, setCurrentWord] = useState(-1);
  const [queueLength, setQueueLength] = useState(0);
  const [scriptWords, setScriptWords] = useState<string[]>([]);

  // ---------------------------------------------------------------------------
  // Refs — mutable runtime state that must not trigger re-renders
  // ---------------------------------------------------------------------------

  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const voicesRawRef = useRef<SpeechSynthesisVoice[]>([]);
  const manualVoiceNameRef = useRef<string | null>(null);

  const isMutedRef = useRef(isMuted);
  const rateRef = useRef(rate);

  /**
   * The queue of Jobs waiting to be spoken.
   * The actively-playing job is NOT in this array — it is in activeJobRef.
   */
  const queueRef = useRef<Job[]>([]);

  /** The job currently being spoken (may have multiple tokens). */
  const activeJobRef = useRef<Job | null>(null);

  /** Index of the token within activeJobRef.current.tokens that is playing. */
  const activeTokenIndexRef = useRef(0);

  /** The active SpeechSynthesisUtterance, if any. */
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  /**
   * Timer id for an active {pause:N} token.
   * Stored separately so stop() and interrupt can cancel it cleanly.
   */
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Whether the engine is currently busy processing (between cancel and start). */
  const isProcessingRef = useRef(false);

  /**
   * Word offset tracking within the active job.
   * We accumulate words as tokens complete, so onboundary word indices are
   * relative to the current token but we report them globally.
   */
  const wordOffsetRef = useRef(0);

  /**
   * Total word count for the current token (for progress estimation fallback).
   */
  const tokenWordCountRef = useRef(0);

  // Progress tracking via wall-clock (fallback for browsers that don't fire
  // onboundary reliably, such as older Safari versions).
  const progressRafRef = useRef<number | null>(null);
  const utteranceStartTimeRef = useRef<number>(0);
  // Estimated duration of the current token in ms (rough: ~150ms per word).
  const utteranceDurationEstRef = useRef<number>(0);

  // Keep refs in sync with state.
  useEffect(() => {
    isMutedRef.current = isMuted;
    writeStorage(STORAGE_KEY_MUTED, String(isMuted));
  }, [isMuted]);

  useEffect(() => {
    rateRef.current = rate;
    writeStorage(STORAGE_KEY_RATE, String(rate));
  }, [rate]);

  // ---------------------------------------------------------------------------
  // Voice loading
  // ---------------------------------------------------------------------------

  const loadVoices = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return;
    voicesRawRef.current = voices;
    voiceRef.current = autoSelectVoice(voices, manualVoiceNameRef.current);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [loadVoices]);

  // ---------------------------------------------------------------------------
  // iOS Safari audio unlock
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    let unlocked = false;

    const unlock = () => {
      if (unlocked) return;
      unlocked = true;

      try {
        const silent = new SpeechSynthesisUtterance("");
        silent.volume = 0;
        silent.rate = 10;
        speechSynthesis.speak(silent);
      } catch {
        // Non-critical.
      }

      window.removeEventListener("click", unlock, true);
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };

    window.addEventListener("click", unlock, true);
    window.addEventListener("touchstart", unlock, true);
    window.addEventListener("keydown", unlock, true);

    return () => {
      window.removeEventListener("click", unlock, true);
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Chrome 15-second pause bug workaround
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
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

  // ---------------------------------------------------------------------------
  // Page visibility: auto-pause / resume
  // ---------------------------------------------------------------------------

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
        // Some browsers throw if nothing is playing.
      }
    };

    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // ---------------------------------------------------------------------------
  // Progress animation (RAF-based fallback for browsers without onboundary)
  // ---------------------------------------------------------------------------

  const stopProgressRaf = useCallback(() => {
    if (progressRafRef.current !== null) {
      cancelAnimationFrame(progressRafRef.current);
      progressRafRef.current = null;
    }
  }, []);

  const startProgressRaf = useCallback(() => {
    stopProgressRaf();

    const tick = () => {
      const elapsed = performance.now() - utteranceStartTimeRef.current;
      const est = utteranceDurationEstRef.current;
      if (est > 0) {
        const pct = Math.min(100, Math.round((elapsed / est) * 100));
        setProgress(pct);
      }
      progressRafRef.current = requestAnimationFrame(tick);
    };

    progressRafRef.current = requestAnimationFrame(tick);
  }, [stopProgressRaf]);

  // ---------------------------------------------------------------------------
  // Core: speak a single token
  // ---------------------------------------------------------------------------

  /**
   * Returns a rough ms estimate for how long a text segment will take to speak.
   * We use ~150ms per word as a baseline; the actual rate modifier is applied.
   */
  const estimateDuration = (text: string, tokenRate: number): number => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    // ~150ms per word at rate 1.0; scale inversely with rate.
    return Math.max(300, (words * 150) / tokenRate);
  };

  // Forward declaration — speakToken calls processQueue via callbacks.
  // We use a ref to break the circular dependency without stale closures.
  const processQueueRef = useRef<() => void>(() => {});

  const speakToken = useCallback(
    (token: ScriptToken, wordOffsetAtStart: number) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      if (token.kind === "pause") {
        // Simulate a pause using setTimeout. SSML is not universally supported
        // via the Web Speech API, and a silent-utterance approach can be
        // unreliable on some platforms.
        isProcessingRef.current = true;
        activeUtteranceRef.current = null;

        pauseTimerRef.current = setTimeout(() => {
          pauseTimerRef.current = null;
          isProcessingRef.current = false;
          processQueueRef.current();
        }, token.ms);

        return;
      }

      // Text token.
      const { text, rate: tokenRate, pitch, volume } = token;

      if (!text.trim()) {
        // Empty text — skip directly to next token.
        isProcessingRef.current = false;
        processQueueRef.current();
        return;
      }

      isProcessingRef.current = true;

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = Math.max(0.1, Math.min(10, tokenRate));
        utterance.pitch = pitch;
        utterance.volume = volume;

        if (voiceRef.current) {
          utterance.voice = voiceRef.current;
        }

        const tokenWords = text.trim().split(/\s+/).filter(Boolean);
        tokenWordCountRef.current = tokenWords.length;

        // Word-boundary tracking: onboundary fires with charIndex into the
        // utterance text. We map that to a word index.
        utterance.onboundary = (event: SpeechSynthesisEvent) => {
          if (event.name !== "word") return;

          const charIndex = event.charIndex;
          // Count words up to this charIndex.
          let wordIdx = 0;
          let pos = 0;
          for (const word of tokenWords) {
            const start = text.indexOf(word, pos);
            if (start > charIndex) break;
            wordIdx++;
            pos = start + word.length;
          }

          // Global word index = accumulated offset + local word index.
          setCurrentWord(wordOffsetAtStart + wordIdx - 1);

          // Progress: what fraction of the token's words have been reached?
          const tokenProgress =
            tokenWords.length > 0
              ? Math.round((wordIdx / tokenWords.length) * 100)
              : 0;
          setProgress(tokenProgress);

          // Once we have real onboundary events, stop the RAF fallback.
          stopProgressRaf();
        };

        utterance.onstart = () => {
          utteranceStartTimeRef.current = performance.now();
          utteranceDurationEstRef.current = estimateDuration(
            text,
            tokenRate
          );
          setIsSpeaking(true);
          startProgressRaf();
        };

        utterance.onend = () => {
          stopProgressRaf();
          // Advance word offset by the words in this token.
          wordOffsetRef.current += tokenWordCountRef.current;
          isProcessingRef.current = false;
          activeUtteranceRef.current = null;
          processQueueRef.current();
        };

        utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
          if (e.error !== "interrupted" && e.error !== "canceled") {
            console.warn("[useNarration] utterance error:", e.error);
          }
          stopProgressRaf();
          isProcessingRef.current = false;
          activeUtteranceRef.current = null;
          processQueueRef.current();
        };

        activeUtteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      } catch {
        isProcessingRef.current = false;
        activeUtteranceRef.current = null;
        processQueueRef.current();
      }
    },
    [startProgressRaf, stopProgressRaf]
  );

  // ---------------------------------------------------------------------------
  // Core: process queue
  // ---------------------------------------------------------------------------

  const processQueue = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (isMutedRef.current) {
      // Silently drain everything.
      queueRef.current = [];
      activeJobRef.current = null;
      activeTokenIndexRef.current = 0;
      setQueueLength(0);
      setIsSpeaking(false);
      setProgress(0);
      setCurrentWord(-1);
      return;
    }
    if (isProcessingRef.current) return;

    // If there is an active job with more tokens, play the next token.
    const job = activeJobRef.current;
    if (job) {
      const tokenIdx = activeTokenIndexRef.current;
      if (tokenIdx < job.tokens.length) {
        activeTokenIndexRef.current = tokenIdx + 1;
        speakToken(job.tokens[tokenIdx], wordOffsetRef.current);
        return;
      }

      // All tokens in this job are done.
      job.onEnd?.();
      activeJobRef.current = null;
      activeTokenIndexRef.current = 0;
      wordOffsetRef.current = 0;
    }

    // Pull the next job from the queue.
    if (queueRef.current.length === 0) {
      setQueueLength(0);
      setIsSpeaking(false);
      setProgress(0);
      setCurrentWord(-1);
      return;
    }

    const nextJob = queueRef.current.shift()!;
    setQueueLength(queueRef.current.length);
    activeJobRef.current = nextJob;
    activeTokenIndexRef.current = 0;
    wordOffsetRef.current = 0;

    // Expose the word list for the new job.
    setScriptWords(nextJob.words);

    // Guard against empty token lists (e.g. a script that parsed to nothing).
    if (nextJob.tokens.length === 0) {
      nextJob.onStart?.();
      nextJob.onEnd?.();
      activeJobRef.current = null;
      // Defer to avoid synchronous recursion.
      setTimeout(() => processQueueRef.current(), 0);
      return;
    }

    // Fire onStart before audio begins so the UI can update immediately.
    nextJob.onStart?.();

    // Speak the first token.
    activeTokenIndexRef.current = 1;
    speakToken(nextJob.tokens[0], 0);
  }, [speakToken]);

  // Wire the ref so speakToken can call processQueue without a stale closure.
  useEffect(() => {
    processQueueRef.current = processQueue;
  }, [processQueue]);

  // ---------------------------------------------------------------------------
  // Public: narrate
  // ---------------------------------------------------------------------------

  const narrate = useCallback(
    (
      script: string,
      name?: string,
      opts?: {
        interrupt?: boolean;
        onStart?: () => void;
        onEnd?: () => void;
      }
    ) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (isMutedRef.current) return;
      if (!script || script.trim().length === 0) return;

      const id = name ?? `narration-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const tokens = parseScript(script, rateRef.current);
      const words = extractWords(script);

      const job: Job = {
        id,
        name: name ?? id,
        tokens,
        words,
        onStart: opts?.onStart,
        onEnd: opts?.onEnd,
      };

      if (opts?.interrupt) {
        // Cancel everything and start fresh.
        try {
          speechSynthesis.cancel();
        } catch {
          // Swallow.
        }
        stopProgressRaf();

        // Cancel any pending pause timer.
        if (pauseTimerRef.current !== null) {
          clearTimeout(pauseTimerRef.current);
          pauseTimerRef.current = null;
        }

        queueRef.current = [];
        activeJobRef.current = null;
        activeTokenIndexRef.current = 0;
        wordOffsetRef.current = 0;
        isProcessingRef.current = false;
        activeUtteranceRef.current = null;

        setProgress(0);
        setCurrentWord(-1);
      }

      queueRef.current.push(job);
      setQueueLength(queueRef.current.length);
      processQueue();
    },
    [processQueue, stopProgressRaf]
  );

  // ---------------------------------------------------------------------------
  // Public: stop
  // ---------------------------------------------------------------------------

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        speechSynthesis.cancel();
      } catch {
        // Swallow.
      }
    }

    stopProgressRaf();

    if (pauseTimerRef.current !== null) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    queueRef.current = [];
    activeJobRef.current = null;
    activeTokenIndexRef.current = 0;
    wordOffsetRef.current = 0;
    isProcessingRef.current = false;
    activeUtteranceRef.current = null;

    setIsSpeaking(false);
    setProgress(0);
    setCurrentWord(-1);
    setQueueLength(0);
  }, [stopProgressRaf]);

  // ---------------------------------------------------------------------------
  // Public: pause / resume
  // ---------------------------------------------------------------------------

  const pause = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      speechSynthesis.pause();
    } catch {
      // Swallow.
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      speechSynthesis.resume();
    } catch {
      // Swallow.
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Public: cancelNamed
  // ---------------------------------------------------------------------------

  const cancelNamed = useCallback(
    (name: string) => {
      // Check if the active job matches.
      if (activeJobRef.current?.name === name) {
        stop();
        return;
      }

      // Remove from the queue if it is waiting.
      const before = queueRef.current.length;
      queueRef.current = queueRef.current.filter((j) => j.name !== name);
      if (queueRef.current.length !== before) {
        setQueueLength(queueRef.current.length);
      }
    },
    [stop]
  );

  // ---------------------------------------------------------------------------
  // Public: toggleMute
  // ---------------------------------------------------------------------------

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        // Muting — stop everything immediately.
        stop();
      }
      return next;
    });
  }, [stop]);

  // ---------------------------------------------------------------------------
  // Public: setRate
  // ---------------------------------------------------------------------------

  const setRate = useCallback((r: number) => {
    setRateRaw(Math.max(0.5, Math.min(2.0, r)));
  }, []);

  // ---------------------------------------------------------------------------
  // Public: preflight
  // ---------------------------------------------------------------------------

  const preflight = useCallback((timeoutMs = 3000): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        resolve(false);
        return;
      }

      const timer = setTimeout(() => resolve(false), timeoutMs);

      // If voices are already loaded, resolve immediately.
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        clearTimeout(timer);
        const v = autoSelectVoice(voices, manualVoiceNameRef.current);
        resolve(v !== null);
        return;
      }

      // Wait for voiceschanged.
      const handler = () => {
        clearTimeout(timer);
        const v = speechSynthesis.getVoices();
        speechSynthesis.removeEventListener("voiceschanged", handler);
        const picked = autoSelectVoice(v, manualVoiceNameRef.current);
        resolve(picked !== null);
      };

      speechSynthesis.addEventListener("voiceschanged", handler);
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Cleanup on unmount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      try {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          speechSynthesis.cancel();
        }
      } catch {
        // Ignore.
      }
      stopProgressRaf();
    };
  }, [stopProgressRaf]);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return useMemo<NarrationState>(
    () => ({
      narrate,
      stop,
      pause,
      resume,
      isSpeaking,
      progress,
      currentWord,
      isMuted,
      toggleMute,
      rate,
      setRate,
      preflight,
      queueLength,
      cancelNamed,
      scriptWords,
    }),
    [
      narrate,
      stop,
      pause,
      resume,
      isSpeaking,
      progress,
      currentWord,
      isMuted,
      toggleMute,
      rate,
      setRate,
      preflight,
      queueLength,
      cancelNamed,
      scriptWords,
    ]
  );
}
