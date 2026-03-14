"use client";

/**
 * useElevenLabsMultiVoice — Multi-character ElevenLabs TTS hook
 *
 * Provides a character-driven TTS experience for a kids' fractions tutor app.
 * Each character (tutor, four kids, system narrator) is mapped to a distinct
 * ElevenLabs voice, creating an immersive audio experience.
 *
 * Features:
 *  - Role-to-voice mapping with six distinct characters
 *  - Tagged text parsing: [tutor]Hello![/tutor] [char0]Hi![/char0]
 *  - FIFO queue with sequential playback via HTML Audio elements
 *  - Blob URL lifecycle management (created on fetch, revoked after play)
 *  - localStorage mute persistence
 *  - Graceful error handling with automatic queue advancement
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// =============================================================================
// Voice configuration
// =============================================================================

/**
 * Each entry maps a role name to an ElevenLabs voice.
 * Voice IDs are from the ElevenLabs voice library.
 */
interface VoiceConfig {
  voiceId: string;
  name: string;
  description: string;
}

const VOICE_MAP: Record<string, VoiceConfig> = {
  tutor: {
    voiceId: "cgSgspJ2msm6clMCkdW9",
    name: "Jessica",
    description: "Playful, Bright, Warm (Cookie the tutor)",
  },
  char0: {
    voiceId: "bIHbv24MWmeRgasZH58o",
    name: "Will",
    description: "Relaxed Optimist (Marcus)",
  },
  char1: {
    voiceId: "FGY2WhTYpPnrIDTdsKH5",
    name: "Laura",
    description: "Enthusiast, Quirky Attitude (Sophie)",
  },
  char2: {
    voiceId: "TX3LPaxmHKxFdv7VOQHJ",
    name: "Liam",
    description: "Energetic, Social Media Creator (Kai)",
  },
  char3: {
    voiceId: "Xb7hH8MSUJpSbSDYk0k2",
    name: "Alice",
    description: "Clear, Engaging Educator (Priya)",
  },
  system: {
    voiceId: "SAz9YHcvj6GT2YYXdXww",
    name: "River",
    description: "Relaxed, Neutral, Informative (system narrator)",
  },
};

/** All available role names. */
const ALL_ROLES = Object.keys(VOICE_MAP);

/** Default role when none is specified. */
const DEFAULT_ROLE = "tutor";

// =============================================================================
// Tagged text parser
// =============================================================================

/** A segment parsed from tagged text. */
interface TaggedSegment {
  role: string;
  text: string;
}

/**
 * Parses tagged text like:
 *   [tutor]Let's share![/tutor] [char0]I want some![/char0]
 *
 * Returns an array of { role, text } segments. Text between tags (or with no
 * tags at all) is attributed to the default role ("tutor").
 *
 * Supports nested whitespace and handles edge cases like empty tags,
 * back-to-back tags, and untagged text at the start/end.
 */
function parseTaggedText(input: string): TaggedSegment[] {
  const segments: TaggedSegment[] = [];

  // Build a regex that matches any [role]...[/role] block.
  // The role names are dynamically derived from VOICE_MAP keys.
  const rolePattern = ALL_ROLES.map(escapeRegExp).join("|");
  const tagRegex = new RegExp(
    `\\[(${rolePattern})\\]([\\s\\S]*?)\\[\\/\\1\\]`,
    "g"
  );

  let lastIndex = 0;

  for (const match of input.matchAll(tagRegex)) {
    const matchStart = match.index!;

    // Capture any untagged text before this match.
    if (matchStart > lastIndex) {
      const plain = input.slice(lastIndex, matchStart).trim();
      if (plain) {
        segments.push({ role: DEFAULT_ROLE, text: plain });
      }
    }

    const role = match[1];
    const text = match[2].trim();
    if (text) {
      segments.push({ role, text });
    }

    lastIndex = matchStart + match[0].length;
  }

  // Capture any trailing untagged text.
  if (lastIndex < input.length) {
    const tail = input.slice(lastIndex).trim();
    if (tail) {
      segments.push({ role: DEFAULT_ROLE, text: tail });
    }
  }

  return segments;
}

/** Escapes special regex characters in a string. */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// =============================================================================
// localStorage helpers
// =============================================================================

const STORAGE_KEY_MUTED = "elevenlabs-multivoice-muted";

function readMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY_MUTED) === "true";
  } catch {
    return false;
  }
}

function writeMuted(muted: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_MUTED, String(muted));
  } catch {
    // Quota exceeded or private browsing — ignore.
  }
}

// =============================================================================
// Types
// =============================================================================

/** A single item in the playback queue. */
interface QueueItem {
  text: string;
  role: string;
  voiceId: string;
}

/** The public interface returned by the hook. */
export interface UseElevenLabsMultiVoiceReturn {
  /** Speak text using the specified role's voice. Defaults to "tutor". */
  speak: (text: string, role?: string) => void;

  /**
   * Parse tagged text and queue each segment with the appropriate voice.
   * Tags use the format: [role]text[/role]
   * Example: [tutor]Let's share![/tutor] [char0]I want some![/char0]
   */
  speakTagged: (text: string) => void;

  /** Stop all audio and clear the queue. */
  stop: () => void;

  /** Whether audio is currently playing. */
  isSpeaking: boolean;

  /** Whether audio output is muted. Persisted to localStorage. */
  isMuted: boolean;

  /** Toggle mute state. When muting, stops current audio and clears queue. */
  toggleMute: () => void;

  /** List of available role names (e.g., ["tutor", "char0", ...]). */
  voices: string[];

  /** Returns the human-readable voice name for a given role. */
  getVoiceForRole: (role: string) => string;

  /** Number of items waiting in the playback queue (not counting current). */
  queueLength: number;
}

// =============================================================================
// API fetch helper
// =============================================================================

const API_ENDPOINT = "/api/tts/elevenlabs";

/**
 * Fetches audio from the ElevenLabs TTS API route.
 * Returns a Blob URL string on success, or null on failure.
 */
async function fetchAudio(
  text: string,
  voiceId: string,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voiceId }),
      signal,
    });

    if (!response.ok) {
      console.warn(
        `[useElevenLabsMultiVoice] API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err: unknown) {
    // AbortError is expected when we cancel in-flight requests.
    if (err instanceof DOMException && err.name === "AbortError") {
      return null;
    }
    console.warn("[useElevenLabsMultiVoice] fetch error:", err);
    return null;
  }
}

// =============================================================================
// Hook
// =============================================================================

export function useElevenLabsMultiVoice(): UseElevenLabsMultiVoiceReturn {
  // ---------------------------------------------------------------------------
  // Reactive state
  // ---------------------------------------------------------------------------

  const [isMuted, setIsMuted] = useState<boolean>(readMuted);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [queueLength, setQueueLength] = useState(0);

  // ---------------------------------------------------------------------------
  // Refs — mutable state that must not trigger re-renders
  // ---------------------------------------------------------------------------

  /** The FIFO playback queue. */
  const queueRef = useRef<QueueItem[]>([]);

  /** Whether the queue processor is currently active (fetching or playing). */
  const isProcessingRef = useRef(false);

  /** The currently playing Audio element, if any. */
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /** Blob URLs that have been created and need cleanup. */
  const blobUrlsRef = useRef<Set<string>>(new Set());

  /** AbortController for the current in-flight fetch. */
  const abortControllerRef = useRef<AbortController | null>(null);

  /** Ref to keep isMuted accessible in callbacks without stale closures. */
  const isMutedRef = useRef(isMuted);

  /** Ref for processQueue to break circular dependency. */
  const processQueueRef = useRef<() => void>(() => {});

  // Keep isMuted ref in sync.
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // ---------------------------------------------------------------------------
  // Blob URL cleanup
  // ---------------------------------------------------------------------------

  /** Revoke a single blob URL and remove it from the tracking set. */
  const revokeBlobUrl = useCallback((url: string) => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore — URL may have already been revoked.
    }
    blobUrlsRef.current.delete(url);
  }, []);

  /** Revoke ALL tracked blob URLs. Used on stop() and unmount. */
  const revokeAllBlobUrls = useCallback(() => {
    for (const url of blobUrlsRef.current) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Ignore.
      }
    }
    blobUrlsRef.current.clear();
  }, []);

  // ---------------------------------------------------------------------------
  // Core: process the next item in the queue
  // ---------------------------------------------------------------------------

  const processQueue = useCallback(() => {
    // Guard: if already processing, let the current chain finish.
    if (isProcessingRef.current) return;

    // Guard: if muted, drain the queue silently.
    if (isMutedRef.current) {
      queueRef.current = [];
      setQueueLength(0);
      setIsSpeaking(false);
      return;
    }

    // Nothing left to play.
    if (queueRef.current.length === 0) {
      setIsSpeaking(false);
      setQueueLength(0);
      return;
    }

    isProcessingRef.current = true;
    setIsSpeaking(true);

    const item = queueRef.current.shift()!;
    setQueueLength(queueRef.current.length);

    // Create an AbortController so stop() can cancel the fetch.
    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetchAudio(item.text, item.voiceId, controller.signal).then((blobUrl) => {
      abortControllerRef.current = null;

      // If the fetch was aborted or failed, advance the queue.
      if (!blobUrl) {
        isProcessingRef.current = false;
        processQueueRef.current();
        return;
      }

      // Track the blob URL for cleanup.
      blobUrlsRef.current.add(blobUrl);

      // Create and play an Audio element.
      const audio = new Audio(blobUrl);
      audioRef.current = audio;

      audio.addEventListener(
        "ended",
        () => {
          audioRef.current = null;
          revokeBlobUrl(blobUrl);
          isProcessingRef.current = false;
          processQueueRef.current();
        },
        { once: true }
      );

      audio.addEventListener(
        "error",
        () => {
          console.warn(
            "[useElevenLabsMultiVoice] Audio playback error for role:",
            item.role
          );
          audioRef.current = null;
          revokeBlobUrl(blobUrl);
          isProcessingRef.current = false;
          processQueueRef.current();
        },
        { once: true }
      );

      // Start playback. The play() promise can reject if the browser blocks
      // autoplay — handle it gracefully.
      audio.play().catch((err) => {
        console.warn("[useElevenLabsMultiVoice] play() rejected:", err);
        audioRef.current = null;
        revokeBlobUrl(blobUrl);
        isProcessingRef.current = false;
        processQueueRef.current();
      });
    });
  }, [revokeBlobUrl]);

  // Wire the ref so callbacks can call processQueue without stale closures.
  useEffect(() => {
    processQueueRef.current = processQueue;
  }, [processQueue]);

  // ---------------------------------------------------------------------------
  // Public: speak
  // ---------------------------------------------------------------------------

  const speak = useCallback(
    (text: string, role?: string) => {
      if (!text || text.trim().length === 0) return;
      if (isMutedRef.current) return;

      const resolvedRole = role && role in VOICE_MAP ? role : DEFAULT_ROLE;
      const voiceConfig = VOICE_MAP[resolvedRole];

      queueRef.current.push({
        text: text.trim(),
        role: resolvedRole,
        voiceId: voiceConfig.voiceId,
      });
      setQueueLength(queueRef.current.length);

      processQueue();
    },
    [processQueue]
  );

  // ---------------------------------------------------------------------------
  // Public: speakTagged
  // ---------------------------------------------------------------------------

  const speakTagged = useCallback(
    (text: string) => {
      if (!text || text.trim().length === 0) return;
      if (isMutedRef.current) return;

      const segments = parseTaggedText(text);

      for (const segment of segments) {
        const resolvedRole =
          segment.role in VOICE_MAP ? segment.role : DEFAULT_ROLE;
        const voiceConfig = VOICE_MAP[resolvedRole];

        queueRef.current.push({
          text: segment.text,
          role: resolvedRole,
          voiceId: voiceConfig.voiceId,
        });
      }

      setQueueLength(queueRef.current.length);
      processQueue();
    },
    [processQueue]
  );

  // ---------------------------------------------------------------------------
  // Public: stop
  // ---------------------------------------------------------------------------

  const stop = useCallback(() => {
    // Abort any in-flight fetch.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Stop and discard the current Audio element.
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load(); // release the media resource
      } catch {
        // Ignore.
      }
      audioRef.current = null;
    }

    // Drain the queue.
    queueRef.current = [];
    isProcessingRef.current = false;

    // Clean up all blob URLs.
    revokeAllBlobUrls();

    setIsSpeaking(false);
    setQueueLength(0);
  }, [revokeAllBlobUrls]);

  // ---------------------------------------------------------------------------
  // Public: toggleMute
  // ---------------------------------------------------------------------------

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      writeMuted(next);

      if (next) {
        // Muting: stop everything immediately.
        stop();
      }

      return next;
    });
  }, [stop]);

  // ---------------------------------------------------------------------------
  // Public: getVoiceForRole
  // ---------------------------------------------------------------------------

  const getVoiceForRole = useCallback((role: string): string => {
    const config = VOICE_MAP[role];
    return config ? config.name : "Unknown";
  }, []);

  // ---------------------------------------------------------------------------
  // Stable voices array
  // ---------------------------------------------------------------------------

  const voices = useMemo(() => ALL_ROLES, []);

  // ---------------------------------------------------------------------------
  // Cleanup on unmount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      // Abort any in-flight fetch.
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      // Stop any playing audio.
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.removeAttribute("src");
          audioRef.current.load();
        } catch {
          // Ignore.
        }
        audioRef.current = null;
      }

      // Clean up all blob URLs.
      for (const url of blobUrlsRef.current) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore.
        }
      }
      blobUrlsRef.current.clear();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return useMemo<UseElevenLabsMultiVoiceReturn>(
    () => ({
      speak,
      speakTagged,
      stop,
      isSpeaking,
      isMuted,
      toggleMute,
      voices,
      getVoiceForRole,
      queueLength,
    }),
    [
      speak,
      speakTagged,
      stop,
      isSpeaking,
      isMuted,
      toggleMute,
      voices,
      getVoiceForRole,
      queueLength,
    ]
  );
}
