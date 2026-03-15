"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ---------------------------------------------------------------------------
// Voice role types
// ---------------------------------------------------------------------------

/**
 * Named roles that map to distinct voice profiles.
 *
 * - tutor   : warm, medium pace — the main narrator
 * - char0   : character 0 (e.g. Zara)   — higher pitch, slightly faster
 * - char1   : character 1 (e.g. Leo)    — lower pitch, standard rate
 * - char2   : character 2 (e.g. Maya)   — bright, fast
 * - char3   : character 3 (e.g. Oscar)  — deep, slower
 * - system  : UI instructions — crisp, slightly faster, neutral pitch
 */
export type VoiceRole = "tutor" | "char0" | "char1" | "char2" | "char3" | "system";

/** Complete parameterisation of how a role is spoken. */
export interface VoiceProfile {
  /** Speech rate multiplier (0.5 – 2.0). */
  rate: number;
  /** Pitch multiplier (0 – 2.0). */
  pitch: number;
  /**
   * Ordered list of preferred voice *names* for this role.
   * First match found in the browser's voice list is used.
   * Falls back to the shared role-agnostic selection logic when empty or no
   * match is found.
   */
  preferredVoiceNames: string[];
  /**
   * When the browser does not have enough distinct voices to give each role a
   * unique one, this flag tells the resolver to allow sharing with another
   * role rather than going silent.
   */
  allowSharedVoice: boolean;
}

/** Profiles keyed by role — the source of truth for voice personality. */
export type VoiceProfiles = Record<VoiceRole, VoiceProfile>;

// ---------------------------------------------------------------------------
// Public API surface returned by the hook
// ---------------------------------------------------------------------------

export interface UseSpeechReturn {
  /**
   * Speak `text` using the `tutor` role (default).
   * Interrupts any currently playing speech.
   */
  speak: (text: string) => void;

  /**
   * Speak `text` as a specific role.
   * Also supports inline role-tagged strings such as:
   *   "[tutor]Hello![/tutor] [char0]Hi there![/char0]"
   * When tags are detected the text is split and each segment is queued with
   * the appropriate voice.
   */
  speakAs: (role: VoiceRole, text: string) => void;

  /**
   * Parse a tagged string and queue each segment under its role.
   * Untagged text is spoken as `tutor`.
   */
  speakTagged: (taggedText: string) => void;

  /** Cancel all queued and current speech. */
  stop: () => void;

  /** Whether any utterance is currently being spoken. */
  isSpeaking: boolean;

  /** Whether speech output is muted. */
  isMuted: boolean;

  /** Toggle mute state. Persisted to localStorage. */
  toggleMute: () => void;

  /** All voice names reported by the browser (populated async). */
  voices: string[];

  /**
   * Manually assign a specific browser voice to a role.
   * Pass `null` to revert to automatic selection for that role.
   */
  assignVoice: (role: VoiceRole, voiceName: string | null) => void;

  /** Read the current resolved voice name for a role (or null if not yet loaded). */
  getVoiceForRole: (role: VoiceRole) => string | null;

  /** Current mutable profiles (useful for debug UI). */
  profiles: VoiceProfiles;

  /** Update one or more fields of a role's profile at runtime. */
  updateProfile: (role: VoiceRole, patch: Partial<VoiceProfile>) => void;

  /** Number of utterances waiting in the queue. */
  queueLength: number;
}

// ---------------------------------------------------------------------------
// Default profiles
// ---------------------------------------------------------------------------

/**
 * Default voice personality per role.
 * The `preferredVoiceNames` lists are tried in order; the first name found in
 * the browser's voice catalogue wins.
 */
const DEFAULT_PROFILES: VoiceProfiles = {
  tutor: {
    rate: 0.9,
    pitch: 1.1,
    preferredVoiceNames: [
      "Samantha",          // macOS / iOS — warm, clear
      "Karen",             // macOS Australian
      "Moira",             // macOS Irish
      "Google US English",
      "Microsoft Zira",
    ],
    allowSharedVoice: false,
  },
  char0: {
    // Zara — bright, lively
    rate: 1.05,
    pitch: 1.35,
    preferredVoiceNames: [
      "Tessa",             // macOS South African — distinctive
      "Veena",             // macOS Indian English
      "Google UK English Female",
    ],
    allowSharedVoice: true,
  },
  char1: {
    // Leo — calm, lower pitch
    rate: 0.85,
    pitch: 0.78,
    preferredVoiceNames: [
      "Daniel",            // macOS British male
      "Tom",               // macOS US male
      "Fred",              // macOS US male
      "Microsoft David",
      "Google UK English Male",
    ],
    allowSharedVoice: true,
  },
  char2: {
    // Maya — fast, cheerful
    rate: 1.15,
    pitch: 1.5,
    preferredVoiceNames: [
      "Fiona",             // macOS Scottish
      "Kate",              // Windows
      "Google US English",
    ],
    allowSharedVoice: true,
  },
  char3: {
    // Oscar — deep, thoughtful
    rate: 0.78,
    pitch: 0.6,
    preferredVoiceNames: [
      "Alex",              // macOS US deep
      "Albert",            // macOS novelty deep voice
      "Microsoft Mark",
    ],
    allowSharedVoice: true,
  },
  system: {
    // UI instructions — crisp, neutral
    rate: 1.1,
    pitch: 1.0,
    preferredVoiceNames: [
      "Samantha",
      "Google US English",
      "Microsoft Zira",
    ],
    allowSharedVoice: false,
  },
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY_MUTED = "synthesis-tutor-muted-v4";

/** Regex that matches [role]…[/role] tags where role is a VoiceRole name. */
const TAG_RE = /\[(tutor|char0|char1|char2|char3|system)\]([\s\S]*?)\[\/\1\]/g;

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

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota exceeded or private browsing — ignore.
  }
}

/**
 * Represents a single piece of work in the speech queue.
 */
interface QueueItem {
  text: string;
  rate: number;
  pitch: number;
  voice: SpeechSynthesisVoice | null;
}

/**
 * Segment produced by parsing a tagged string.
 */
interface TaggedSegment {
  role: VoiceRole;
  text: string;
}

/**
 * Parse a tagged string into ordered segments.
 *
 * "[tutor]Hello![/tutor] [char0]Hi![/char0]"
 * ->
 * [{ role: "tutor", text: "Hello!" }, { role: "char0", text: "Hi!" }]
 *
 * Any text outside of tags is attributed to `tutor`.
 */
function parseTaggedText(input: string): TaggedSegment[] {
  const segments: TaggedSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset the global regex state before each use.
  TAG_RE.lastIndex = 0;

  while ((match = TAG_RE.exec(input)) !== null) {
    const before = input.slice(lastIndex, match.index).trim();
    if (before) {
      segments.push({ role: "tutor", text: before });
    }
    segments.push({ role: match[1] as VoiceRole, text: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }

  // Trailing untagged text.
  const remainder = input.slice(lastIndex).trim();
  if (remainder) {
    segments.push({ role: "tutor", text: remainder });
  }

  // If no tags found, treat the whole string as tutor.
  if (segments.length === 0 && input.trim()) {
    segments.push({ role: "tutor", text: input.trim() });
  }

  return segments;
}

// ---------------------------------------------------------------------------
// Voice resolution
// ---------------------------------------------------------------------------

/**
 * Pick the best SpeechSynthesisVoice for a role from the available list.
 *
 * Priority:
 * 1. Manual override set by assignVoice().
 * 2. First match from the profile's preferredVoiceNames list.
 * 3. Heuristic fallback: English voice whose name pattern roughly fits the
 *    expected gender/type for the role.
 * 4. Any English voice.
 * 5. First voice in the list.
 */
function resolveVoice(
  role: VoiceRole,
  profile: VoiceProfile,
  availableVoices: SpeechSynthesisVoice[],
  manualOverride: string | null,
  alreadyAssigned: Set<string>
): SpeechSynthesisVoice | null {
  if (availableVoices.length === 0) return null;

  // 1. Manual override.
  if (manualOverride) {
    const v = availableVoices.find((v) => v.name === manualOverride);
    if (v) return v;
    // If the manual name is gone, fall through to auto.
  }

  // 2. Walk the preferred-name list.
  for (const name of profile.preferredVoiceNames) {
    const v = availableVoices.find((v) => v.name === name);
    if (v) {
      // Only skip if another role is already using this voice AND this role
      // does not allow sharing.
      if (!profile.allowSharedVoice && alreadyAssigned.has(v.name)) {
        continue; // try the next preferred name
      }
      return v;
    }
  }

  // 3 & 4. Heuristic fallback.
  const maleMarkers = /\b(David|James|Daniel|Mark|Tom|Fred|Alex|Aaron|Albert|Oscar|Leo)\b/i;
  const englishVoices = availableVoices.filter((v) => v.lang.startsWith("en"));

  // For character roles that want a lower/male pitch, prefer voices with male markers.
  const wantsMale = role === "char1" || role === "char3";
  if (wantsMale) {
    const male = englishVoices.filter((v) => maleMarkers.test(v.name));
    if (male.length > 0) return male[0];
  } else {
    const female = englishVoices.filter((v) => !maleMarkers.test(v.name));
    if (female.length > 0) return female[0];
  }

  if (englishVoices.length > 0) return englishVoices[0];

  // 5. Last resort.
  return availableVoices[0];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useSpeech — multi-voice text-to-speech hook for the fraction-teaching app.
 *
 * Manages a per-role voice assignment system on top of the Web Speech API.
 * Each of the 4 lesson characters, the tutor, and the system UI can speak in
 * a distinct voice with unique pitch/rate settings.
 *
 * Supports inline role tags:
 *   "[tutor]Let's learn fractions![/tutor] [char0]Yay![/char0]"
 *
 * Falls back gracefully when the browser does not have enough voices — roles
 * will share voices but maintain their pitch/rate personality differences.
 */
export function useSpeech(): UseSpeechReturn {
  // ---- Mute state (persisted) ----
  const [isMuted, setIsMuted] = useState<boolean>(() =>
    readStorageBool(STORAGE_KEY_MUTED, false)
  );
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);
  useEffect(() => {
    writeStorage(STORAGE_KEY_MUTED, String(isMuted));
  }, [isMuted]);

  // ---- Voice profiles (mutable, triggers re-render for UI binding) ----
  const [profiles, setProfiles] = useState<VoiceProfiles>(() =>
    // Deep-clone defaults so mutations don't touch the original.
    JSON.parse(JSON.stringify(DEFAULT_PROFILES)) as VoiceProfiles
  );
  const profilesRef = useRef(profiles);
  useEffect(() => {
    profilesRef.current = profiles;
  }, [profiles]);

  // ---- Manual overrides: role -> voice name | null ----
  const [manualOverrides, setManualOverrides] = useState<
    Partial<Record<VoiceRole, string | null>>
  >({});
  const manualOverridesRef = useRef(manualOverrides);
  useEffect(() => {
    manualOverridesRef.current = manualOverrides;
  }, [manualOverrides]);

  // ---- Raw browser voices ----
  const [voiceNames, setVoiceNames] = useState<string[]>([]);
  const voicesRawRef = useRef<SpeechSynthesisVoice[]>([]);

  // ---- Resolved voice per role (ref-only, updated when voices load) ----
  // Map<VoiceRole, SpeechSynthesisVoice | null>
  const resolvedVoicesRef = useRef<Map<VoiceRole, SpeechSynthesisVoice | null>>(
    new Map()
  );

  // ---- Queue state ----
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const queueRef = useRef<QueueItem[]>([]);
  const isProcessingRef = useRef(false);

  // ---- iOS unlock ----
  const unlockedRef = useRef(false);

  // ---------------------------------------------------------------------------
  // Voice resolution — called whenever voices or overrides change
  // ---------------------------------------------------------------------------

  const resolveAllVoices = useCallback(() => {
    const available = voicesRawRef.current;
    const overrides = manualOverridesRef.current;
    const profs = profilesRef.current;

    const assigned = new Set<string>();
    const roles: VoiceRole[] = ["tutor", "system", "char0", "char1", "char2", "char3"];

    for (const role of roles) {
      const voice = resolveVoice(
        role,
        profs[role],
        available,
        overrides[role] ?? null,
        assigned
      );
      resolvedVoicesRef.current.set(role, voice);
      if (voice) assigned.add(voice.name);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Voice loading
  // ---------------------------------------------------------------------------

  const loadVoices = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;

    voicesRawRef.current = voices;
    setVoiceNames(voices.map((v) => v.name));
    resolveAllVoices();
  }, [resolveAllVoices]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [loadVoices]);

  // Re-resolve whenever overrides or profiles change.
  useEffect(() => {
    resolveAllVoices();
  }, [manualOverrides, profiles, resolveAllVoices]);

  // ---------------------------------------------------------------------------
  // iOS Safari audio unlock
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      try {
        const silent = new SpeechSynthesisUtterance("");
        silent.volume = 0;
        silent.rate = 10;
        window.speechSynthesis.speak(silent);
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
  // Chrome 15-second speech bug workaround
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const isChromium = /Chrome|Chromium|Edg/i.test(navigator.userAgent);
    if (!isChromium) return;

    const interval = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10_000);

    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------------------------
  // Page visibility: pause / resume
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handler = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      try {
        if (document.hidden) {
          window.speechSynthesis.pause();
        } else {
          window.speechSynthesis.resume();
        }
      } catch {
        // Some browsers throw if nothing is playing.
      }
    };

    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // ---------------------------------------------------------------------------
  // Queue processing
  // ---------------------------------------------------------------------------

  // processQueue is written as a ref-based self-contained function so it can
  // call itself recursively (via the onend callback) without going stale.
  const processQueueRef = useRef<() => void>(() => {});

  processQueueRef.current = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (isProcessingRef.current) return;
    if (queueRef.current.length === 0) {
      setQueueLength(0);
      setIsSpeaking(false);
      return;
    }
    if (isMutedRef.current) {
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

      if (item.voice) {
        utterance.voice = item.voice;
      }

      utterance.onstart = () => setIsSpeaking(true);

      utterance.onend = () => {
        isProcessingRef.current = false;
        processQueueRef.current();
      };

      utterance.onerror = (e) => {
        // "interrupted" / "canceled" are expected on stop().
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.warn("[useSpeech] utterance error:", e.error);
        }
        isProcessingRef.current = false;
        processQueueRef.current();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      isProcessingRef.current = false;
      processQueueRef.current();
    }
  };

  const processQueue = useCallback(() => {
    processQueueRef.current();
  }, []);

  // ---------------------------------------------------------------------------
  // Internal: cancel + clear
  // ---------------------------------------------------------------------------

  const cancelAll = useCallback(() => {
    queueRef.current = [];
    isProcessingRef.current = false;
    setQueueLength(0);
    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // Swallow.
    }
    setIsSpeaking(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Internal: enqueue a single segment
  // ---------------------------------------------------------------------------

  const enqueueSegment = useCallback(
    (role: VoiceRole, text: string) => {
      const profile = profilesRef.current[role];
      const voice = resolvedVoicesRef.current.get(role) ?? null;

      queueRef.current.push({
        text,
        rate: profile.rate,
        pitch: profile.pitch,
        voice,
      });
      setQueueLength(queueRef.current.length);
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /** Speak as the tutor role, interrupting current speech. */
  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (isMutedRef.current) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      cancelAll();
      enqueueSegment("tutor", trimmed);
      processQueue();
    },
    [cancelAll, enqueueSegment, processQueue]
  );

  /** Speak text as a specific role, interrupting current speech. */
  const speakAs = useCallback(
    (role: VoiceRole, text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (isMutedRef.current) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      cancelAll();
      enqueueSegment(role, trimmed);
      processQueue();
    },
    [cancelAll, enqueueSegment, processQueue]
  );

  /**
   * Parse a tagged string and queue each segment with the correct role voice.
   * Interrupts current speech before queuing.
   *
   * Example input:
   *   "[tutor]Let me explain.[/tutor] [char0]I get it![/char0]"
   */
  const speakTagged = useCallback(
    (taggedText: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (isMutedRef.current) return;
      if (!taggedText.trim()) return;

      const segments = parseTaggedText(taggedText);
      if (segments.length === 0) return;

      cancelAll();
      for (const seg of segments) {
        enqueueSegment(seg.role, seg.text);
      }
      processQueue();
    },
    [cancelAll, enqueueSegment, processQueue]
  );

  const stop = useCallback(() => {
    cancelAll();
  }, [cancelAll]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        // Muting — clear everything immediately.
        cancelAll();
      }
      return next;
    });
  }, [cancelAll]);

  /**
   * Assign a specific browser voice (by name) to a role.
   * Pass `null` to revert to automatic selection.
   */
  const assignVoice = useCallback(
    (role: VoiceRole, voiceName: string | null) => {
      setManualOverrides((prev) => ({ ...prev, [role]: voiceName }));
    },
    []
  );

  /**
   * Get the currently resolved voice name for a role.
   * Returns null if voices have not loaded yet or no voice was found.
   */
  const getVoiceForRole = useCallback((role: VoiceRole): string | null => {
    return resolvedVoicesRef.current.get(role)?.name ?? null;
  }, []);

  /**
   * Patch one or more fields of a role's profile at runtime.
   * Useful for a settings UI where kids / parents can tweak voices.
   */
  const updateProfile = useCallback(
    (role: VoiceRole, patch: Partial<VoiceProfile>) => {
      setProfiles((prev) => ({
        ...prev,
        [role]: { ...prev[role], ...patch },
      }));
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Cleanup on unmount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      try {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch {
        // Ignore.
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Return value (stable shape — useMemo on primitives / stable callbacks)
  // ---------------------------------------------------------------------------

  return useMemo<UseSpeechReturn>(
    () => ({
      speak,
      speakAs,
      speakTagged,
      stop,
      isSpeaking,
      isMuted,
      toggleMute,
      voices: voiceNames,
      assignVoice,
      getVoiceForRole,
      profiles,
      updateProfile,
      queueLength,
    }),
    [
      speak, speakAs, speakTagged, stop,
      isSpeaking, isMuted, toggleMute,
      voiceNames, assignVoice, getVoiceForRole,
      profiles, updateProfile, queueLength,
    ]
  );
}
