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
 * ElevenLabs TTS hook.
 *
 * Calls our own API route (`/api/tts/elevenlabs`) which proxies to the
 * ElevenLabs REST API, then plays the returned audio via an `Audio` element.
 *
 * Interface:
 *   { speak, stop, prefetch, isSpeaking, isMuted, toggleMute }
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const revokeBlobUrl = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  const destroyAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    }
    revokeBlobUrl();
  }, [revokeBlobUrl]);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    destroyAudio();
    setIsSpeaking(false);
  }, [destroyAudio]);

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
      if (isMutedRef.current) return;
      if (!text || text.trim().length === 0) return;

      stop();

      // Mark as speaking immediately so that callers (e.g. auto-advance
      // effects) know TTS is in progress even while the audio is loading.
      setIsSpeaking(true);

      const trimmed = text.trim();

      // Check client-side in-memory cache first
      const cachedBlob = blobCache.get(trimmed);
      if (cachedBlob) {
        try {
          const url = URL.createObjectURL(cachedBlob);
          blobUrlRef.current = url;

          const audio = new Audio(url);
          audioRef.current = audio;

          audio.addEventListener("play", () => setIsSpeaking(true));
          audio.addEventListener("ended", () => {
            setIsSpeaking(false);
            destroyAudio();
          });
          audio.addEventListener("pause", () => setIsSpeaking(false));
          audio.addEventListener("error", () => {
            console.warn("Audio playback error");
            setIsSpeaking(false);
            destroyAudio();
          });

          await audio.play();
          return;
        } catch (err: unknown) {
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
          console.warn("ElevenLabs TTS cached playback error:", err);
          setIsSpeaking(false);
          // Fall through to fetch if cached blob playback fails
        }
      }

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
          setIsSpeaking(false);
          return;
        }

        const blob = await response.blob();

        // Store in client-side cache for potential future replays
        blobCache.set(trimmed, blob);

        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.addEventListener("play", () => setIsSpeaking(true));
        audio.addEventListener("ended", () => {
          setIsSpeaking(false);
          destroyAudio();
        });
        audio.addEventListener("pause", () => setIsSpeaking(false));
        audio.addEventListener("error", () => {
          console.warn("Audio playback error");
          setIsSpeaking(false);
          destroyAudio();
        });

        await audio.play();
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.warn("ElevenLabs TTS error:", err);
        setIsSpeaking(false);
      }
    },
    [stop, destroyAudio],
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
      destroyAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { speak, stop, prefetch, isSpeaking, isMuted, toggleMute } as const;
}
