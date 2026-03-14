"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const MUTE_KEY = "elevenlabs-streaming-tts-muted";

/**
 * Check whether the browser supports MediaSource with audio/mpeg.
 * Returns true if we can use the progressive-playback path.
 */
function supportsMediaSourceMpeg(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof MediaSource === "undefined") return false;
  return MediaSource.isTypeSupported("audio/mpeg");
}

/**
 * Streaming ElevenLabs TTS hook -- optimised for lowest time-to-first-audio.
 *
 * Uses our `/api/tts/elevenlabs-stream` proxy which streams audio/mpeg chunks
 * from ElevenLabs.  On browsers that support `MediaSource` with audio/mpeg
 * (Chrome, Edge) the audio begins playing as soon as the first chunk arrives.
 * On browsers without that support (Safari, Firefox) we fall back to buffering
 * the entire response into a Blob and playing it once complete.
 *
 * Interface mirrors the other TTS hooks:
 *   { speak, stop, isSpeaking, isMuted, toggleMute }
 */
export function useElevenLabsStreaming() {
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
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isMutedRef = useRef(isMuted);

  // Queue of chunks waiting to be appended while the SourceBuffer is busy.
  const pendingChunksRef = useRef<Uint8Array[]>([]);

  // Keep ref in sync so callbacks always see latest mute value.
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // ---------------------------------------------------------------------------
  // Cleanup helpers
  // ---------------------------------------------------------------------------

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

    // Clean up MediaSource resources.
    if (
      mediaSourceRef.current &&
      mediaSourceRef.current.readyState === "open"
    ) {
      try {
        mediaSourceRef.current.endOfStream();
      } catch {
        // May throw if already ended or detached -- safe to ignore.
      }
    }
    mediaSourceRef.current = null;
    sourceBufferRef.current = null;
    pendingChunksRef.current = [];

    revokeBlobUrl();
  }, [revokeBlobUrl]);

  // ---------------------------------------------------------------------------
  // stop
  // ---------------------------------------------------------------------------

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    destroyAudio();
    setIsSpeaking(false);
  }, [destroyAudio]);

  // ---------------------------------------------------------------------------
  // Internal: progressive playback via MediaSource
  // ---------------------------------------------------------------------------

  const playWithMediaSource = useCallback(
    async (response: Response, signal: AbortSignal) => {
      const mediaSource = new MediaSource();
      mediaSourceRef.current = mediaSource;

      const audio = new Audio();
      audioRef.current = audio;

      const objectUrl = URL.createObjectURL(mediaSource);
      blobUrlRef.current = objectUrl;
      audio.src = objectUrl;

      // Wire up audio events.
      audio.addEventListener("play", () => setIsSpeaking(true));
      audio.addEventListener("pause", () => {
        // Only mark not-speaking if we truly finished (not just buffering).
        if (audio.ended) {
          setIsSpeaking(false);
        }
      });
      audio.addEventListener("ended", () => {
        setIsSpeaking(false);
        destroyAudio();
      });
      audio.addEventListener("error", () => {
        console.warn("Streaming audio playback error");
        setIsSpeaking(false);
        destroyAudio();
      });

      // Wait for MediaSource to be ready before adding a SourceBuffer.
      await new Promise<void>((resolve) => {
        if (mediaSource.readyState === "open") {
          resolve();
        } else {
          mediaSource.addEventListener("sourceopen", () => resolve(), {
            once: true,
          });
        }
      });

      // Check abort after the async gap.
      if (signal.aborted) return;

      const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
      sourceBufferRef.current = sourceBuffer;

      /**
       * Flush the pending-chunks queue into the SourceBuffer one at a time.
       * SourceBuffer only accepts one appendBuffer at a time; each subsequent
       * append must wait for the `updateend` event.
       */
      const flushQueue = () => {
        if (
          sourceBuffer.updating ||
          pendingChunksRef.current.length === 0
        ) {
          return;
        }
        const next = pendingChunksRef.current.shift();
        if (next) {
          try {
            sourceBuffer.appendBuffer(next.buffer as ArrayBuffer);
          } catch (err) {
            console.warn("appendBuffer error:", err);
          }
        }
      };

      sourceBuffer.addEventListener("updateend", flushQueue);

      // Start reading the fetch stream.
      const reader = response.body!.getReader();
      let playStarted = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (signal.aborted) return;

          if (done) {
            // All chunks received. Wait for the queue to drain, then signal
            // end-of-stream so the audio element knows the duration.
            const waitForDrain = () =>
              new Promise<void>((resolve) => {
                const check = () => {
                  if (
                    pendingChunksRef.current.length === 0 &&
                    !sourceBuffer.updating
                  ) {
                    resolve();
                  } else {
                    sourceBuffer.addEventListener("updateend", check, {
                      once: true,
                    });
                  }
                };
                check();
              });

            await waitForDrain();
            if (
              mediaSource.readyState === "open" &&
              !sourceBuffer.updating
            ) {
              try {
                mediaSource.endOfStream();
              } catch {
                // Ignore if already ended.
              }
            }
            break;
          }

          // Enqueue the chunk and kick the flush loop.
          pendingChunksRef.current.push(value);
          flushQueue();

          // Start playback as soon as the first chunk is being appended.
          if (!playStarted) {
            playStarted = true;
            // Small delay to let the first chunk land in the buffer.
            audio.play().catch((err) => {
              console.warn("play() rejected:", err);
            });
          }
        }
      } catch (err: unknown) {
        if (signal.aborted) return;
        console.warn("Error reading stream:", err);
        setIsSpeaking(false);
        destroyAudio();
      }
    },
    [destroyAudio],
  );

  // ---------------------------------------------------------------------------
  // Internal: fallback playback by buffering the whole response
  // ---------------------------------------------------------------------------

  const playWithBlobFallback = useCallback(
    async (response: Response, signal: AbortSignal) => {
      const reader = response.body!.getReader();
      const chunks: Uint8Array[] = [];

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (signal.aborted) return;
          if (done) break;
          chunks.push(value);
        }
      } catch (err: unknown) {
        if (signal.aborted) return;
        console.warn("Error reading stream (fallback):", err);
        setIsSpeaking(false);
        return;
      }

      if (signal.aborted) return;

      const blob = new Blob(chunks.map(c => c.buffer as ArrayBuffer), { type: "audio/mpeg" });
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
        console.warn("Audio playback error (fallback)");
        setIsSpeaking(false);
        destroyAudio();
      });

      await audio.play();
    },
    [destroyAudio],
  );

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
        const response = await fetch("/api/tts/elevenlabs-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errBody = await response.text().catch(() => "");
          console.warn(
            `ElevenLabs streaming TTS failed: ${response.status}`,
            errBody,
          );
          setIsSpeaking(false);
          return;
        }

        if (!response.body) {
          console.warn("ElevenLabs streaming response has no body");
          setIsSpeaking(false);
          return;
        }

        // Choose the best playback strategy for this browser.
        if (supportsMediaSourceMpeg()) {
          await playWithMediaSource(response, controller.signal);
        } else {
          await playWithBlobFallback(response, controller.signal);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Fetch was intentionally cancelled -- not an error.
          return;
        }
        console.warn("ElevenLabs streaming TTS error:", err);
        setIsSpeaking(false);
      }
    },
    [stop, playWithMediaSource, playWithBlobFallback],
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
