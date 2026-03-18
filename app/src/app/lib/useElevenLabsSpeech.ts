"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const MUTE_KEY = "elevenlabs-tts-muted";

/**
 * In-memory client-side cache for prefetched TTS audio blobs.
 * Shared across all instances of the hook (module-level singleton).
 */
const blobCache = new Map<string, Blob>();

/**
 * Set of texts currently being prefetched, to avoid duplicate in-flight requests.
 */
const prefetchInFlight = new Set<string>();

/**
 * Persistent Audio element — created once during the first user gesture so
 * Safari keeps autoplay permission on it. Reused for all subsequent TTS by
 * swapping its src. Module-level so it survives React re-renders.
 */
let sharedAudio: HTMLAudioElement | null = null;

/**
 * ElevenLabs TTS hook.
 *
 * Calls our own API route (`/api/tts/elevenlabs`) which proxies to the
 * ElevenLabs REST API, then plays the returned audio via a persistent
 * Audio element (reused to satisfy Safari's autoplay policy).
 *
 * Interface:
 *   { speak, stop, prefetch, isSpeaking, isSpeakingRef, didPlayRef, isMuted, toggleMute, warmup }
 */
export function useElevenLabsSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(MUTE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const blobUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isMutedRef = useRef(isMuted);

  // Synchronous refs for cross-effect coordination (no render-cycle delay)
  const isSpeakingRef = useRef(false);
  const didPlayRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const revokeBlobUrl = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  /**
   * Call during a user gesture (e.g. "Tap to begin") to create and bless
   * the shared Audio element. Safari requires the element to be created
   * in a user-gesture call stack to allow future .play() calls.
   */
  const warmup = useCallback(() => {
    if (sharedAudio) return;
    sharedAudio = new Audio();
    // Play + immediately pause to "bless" the element on Safari.
    // Use a silent data URI so nothing is audible.
    sharedAudio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
    sharedAudio.play().then(() => sharedAudio?.pause()).catch(() => {});
  }, []);

  const stopAudio = useCallback(() => {
    if (sharedAudio) {
      sharedAudio.pause();
      sharedAudio.removeAttribute("src");
      sharedAudio.load();
    }
    revokeBlobUrl();
  }, [revokeBlobUrl]);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    stopAudio();
    isSpeakingRef.current = false;
    setIsSpeaking(false);
  }, [stopAudio]);

  /**
   * Prefetch audio for the given text without playing it.
   * Stores the blob in an in-memory cache so that a later speak() call
   * can use it instantly without another network round-trip.
   */
  const prefetch = useCallback((text: string) => {
    if (typeof window === "undefined") return;
    if (!text || text.trim().length === 0) return;

    const trimmed = text.trim();

    // Already cached or already in-flight — skip
    if (blobCache.has(trimmed) || prefetchInFlight.has(trimmed)) return;

    prefetchInFlight.add(trimmed);

    fetch("/api/tts/elevenlabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`TTS prefetch failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        blobCache.set(trimmed, blob);
      })
      .catch((err) => {
        console.warn("TTS prefetch error:", err);
      })
      .finally(() => {
        prefetchInFlight.delete(trimmed);
      });
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (typeof window === "undefined") return;

      // Reset didPlay before any early return — callers check this to know
      // whether audio actually played for the current utterance.
      didPlayRef.current = false;

      if (isMutedRef.current) return;
      if (!text || text.trim().length === 0) return;

      stop();

      // Ensure the shared audio element exists (fallback if warmup wasn't called)
      if (!sharedAudio) {
        sharedAudio = new Audio();
      }

      // Mark as speaking immediately (both ref and state) so that callers
      // (e.g. auto-advance effects) know TTS is in progress even while loading.
      isSpeakingRef.current = true;
      setIsSpeaking(true);

      const trimmed = text.trim();

      // Wire up event handlers on the shared element for this utterance.
      // Remove previous listeners by replacing with fresh ones via onX properties.
      const audio = sharedAudio;

      audio.onplay = () => {
        isSpeakingRef.current = true;
        didPlayRef.current = true;
        setIsSpeaking(true);
      };
      audio.onended = () => {
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        revokeBlobUrl();
      };
      audio.onpause = () => {
        isSpeakingRef.current = false;
        setIsSpeaking(false);
      };
      audio.onerror = () => {
        console.warn("Audio playback error");
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        revokeBlobUrl();
      };

      // Try to play from client-side blob cache first
      const cachedBlob = blobCache.get(trimmed);
      if (cachedBlob) {
        try {
          revokeBlobUrl();
          const url = URL.createObjectURL(cachedBlob);
          blobUrlRef.current = url;
          audio.src = url;
          await audio.play();
          return;
        } catch (err: unknown) {
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
          console.warn("ElevenLabs TTS cached playback error:", err);
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          // Fall through to fetch if cached blob playback fails
        }
      }

      // Fetch from server (S3 cache)
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/tts/elevenlabs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errBody = await response.text().catch(() => "");
          console.warn(
            `ElevenLabs TTS failed: ${response.status}`,
            errBody,
          );
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          return;
        }

        const blob = await response.blob();

        // Store in client-side cache for potential future replays
        blobCache.set(trimmed, blob);

        revokeBlobUrl();
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        audio.src = url;
        await audio.play();
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.warn("ElevenLabs TTS error:", err);
        isSpeakingRef.current = false;
        setIsSpeaking(false);
      }
    },
    [stop, revokeBlobUrl],
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(MUTE_KEY, String(next));
      } catch {
        // ok
      }
      if (next) {
        stop();
      }
      return next;
    });
  }, [stop]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      abortRef.current?.abort();
      stopAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { speak, stop, prefetch, warmup, isSpeaking, isSpeakingRef, didPlayRef, isMuted, toggleMute } as const;
}
