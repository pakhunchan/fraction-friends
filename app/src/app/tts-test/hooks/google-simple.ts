"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const MUTE_KEY = "google-tts-muted";

/**
 * Simple Google Cloud TTS hook.
 *
 * Calls our own API route (`/api/tts/google`) which proxies to the
 * Google Cloud Text-to-Speech REST API, then plays the returned audio
 * via an `Audio` element.
 *
 * Interface mirrors the existing OpenAI / ElevenLabs hooks:
 *   { speak, stop, isSpeaking, isMuted, toggleMute }
 */
export function useGoogleSpeech() {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

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

  // Keep ref in sync so callbacks always see latest mute value.
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // ---------------------------------------------------------------------------
  // Cleanup helpers
  // ---------------------------------------------------------------------------

  /** Revoke the current blob URL (if any) to free memory. */
  const revokeBlobUrl = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  /** Tear down the current Audio element cleanly. */
  const destroyAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load(); // release internal resources
      audioRef.current = null;
    }
    revokeBlobUrl();
  }, [revokeBlobUrl]);

  // ---------------------------------------------------------------------------
  // stop
  // ---------------------------------------------------------------------------

  const stop = useCallback(() => {
    // Abort any in-flight fetch.
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    destroyAudio();
    setIsSpeaking(false);
  }, [destroyAudio]);

  // ---------------------------------------------------------------------------
  // speak
  // ---------------------------------------------------------------------------

  const speak = useCallback(
    async (text: string) => {
      if (typeof window === "undefined") return;
      if (isMutedRef.current) return;
      if (!text || text.trim().length === 0) return;

      // Cancel anything currently playing.
      stop();

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/tts/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errBody = await response.text().catch(() => "");
          console.warn(`Google TTS failed: ${response.status}`, errBody);
          setIsSpeaking(false);
          return;
        }

        const blob = await response.blob();
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
          // Fetch was intentionally cancelled -- not an error.
          return;
        }
        console.warn("Google TTS error:", err);
        setIsSpeaking(false);
      }
    },
    [stop, destroyAudio],
  );

  // ---------------------------------------------------------------------------
  // toggleMute
  // ---------------------------------------------------------------------------

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(MUTE_KEY, String(next));
      } catch {
        // localStorage may be unavailable -- ignore.
      }
      if (next) {
        // Muting -- stop any ongoing speech immediately.
        stop();
      }
      return next;
    });
  }, [stop]);

  // ---------------------------------------------------------------------------
  // Cleanup on unmount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      abortRef.current?.abort();
      destroyAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  return { speak, stop, isSpeaking, isMuted, toggleMute } as const;
}
