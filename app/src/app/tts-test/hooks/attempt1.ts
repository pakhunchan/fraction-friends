"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * A React hook for browser-native text-to-speech via the Web Speech API.
 *
 * Returns controls for speaking text aloud, stopping speech, and
 * toggling a mute state. Handles voice selection, page visibility
 * changes, and cleanup on unmount.
 */
export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isMutedRef = useRef(isMuted);

  // Keep the ref in sync so callbacks always see the latest value.
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // ---------------------------------------------------------------------------
  // Voice selection
  // ---------------------------------------------------------------------------

  const pickVoice = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return;

    // Priority list -- we prefer a warm, friendly female voice.
    // "Samantha" is the default high-quality macOS / iOS voice.
    const preferred = [
      "Samantha",          // macOS / iOS
      "Karen",             // macOS Australian English
      "Google US English",
      "Microsoft Zira",    // Windows
    ];

    for (const name of preferred) {
      const match = voices.find((v) => v.name === name);
      if (match) {
        setVoice(match);
        return;
      }
    }

    // Fallback: any English voice, prefer female-sounding ones (heuristic:
    // voice names that do NOT contain common male-name markers).
    const english = voices.filter((v) => v.lang.startsWith("en"));
    if (english.length > 0) {
      setVoice(english[0]);
      return;
    }

    // Last resort: whatever the browser gives us.
    setVoice(voices[0]);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Voices may already be loaded (Chrome loads them synchronously on some
    // platforms), so try immediately.
    pickVoice();

    // On most browsers the voice list is populated asynchronously.
    const handler = () => pickVoice();
    speechSynthesis.addEventListener("voiceschanged", handler);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", handler);
    };
  }, [pickVoice]);

  // ---------------------------------------------------------------------------
  // Core speak / stop
  // ---------------------------------------------------------------------------

  const stop = useCallback(() => {
    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        speechSynthesis.cancel();
      }
    } catch {
      // Swallow -- the API can throw in odd edge-cases.
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (isMutedRef.current) return;
      if (!text || text.trim().length === 0) return;

      // Cancel anything currently playing.
      stop();

      try {
        const utterance = new SpeechSynthesisUtterance(text);

        // Warm, kid-friendly tuning.
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;

        if (voice) {
          utterance.voice = voice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          utteranceRef.current = null;
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          utteranceRef.current = null;
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      } catch {
        // If something goes wrong just silently fail -- speech is a
        // progressive enhancement, not critical.
        setIsSpeaking(false);
      }
    },
    [voice, stop]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        // Muting -- stop any ongoing speech immediately.
        stop();
      }
      return next;
    });
  }, [stop]);

  // ---------------------------------------------------------------------------
  // Page visibility: pause / resume speech when the tab goes to background.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibility = () => {
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

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Cleanup on unmount -- cancel any outstanding speech.
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
    };
  }, []);

  return { speak, stop, isSpeaking, isMuted, toggleMute } as const;
}
