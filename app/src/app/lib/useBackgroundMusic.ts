"use client";

// =============================================================================
// useBackgroundMusic.ts — Cheerful Classroom
// Simple upbeat piano-like arpeggio in C major. Lively but not distracting.
// Extracted from background-sampler.html track #8 (id: 'classroom').
//
// Features:
//   - Loops continuously via scheduled pattern repetition
//   - Audio ducking: volume dips to ~25% when SFX plays, smoothly returns
//   - Mute/unmute and volume controls
//   - Starts on user interaction (browser autoplay policy)
// =============================================================================

import { useCallback, useEffect, useRef, useState } from "react";

const MUTE_KEY = "bg-music-muted";

function midiToFreq(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function makeReverb(ctx: AudioContext, seconds: number, decay: number): ConvolverNode {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const imp = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = imp.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = imp;
  return conv;
}

export interface BackgroundMusicControls {
  /** Start playback (requires user interaction context). */
  start: () => void;
  /** Stop playback. */
  stop: () => void;
  /** Whether music is currently playing. */
  isPlaying: boolean;
  /** Whether music is muted. */
  isMuted: boolean;
  /** Toggle mute. */
  toggleMute: () => void;
  /** Set volume 0-1. */
  setVolume: (v: number) => void;
  /** Call this when an SFX starts playing. Duration is approximate seconds.
   *  The background music will duck (lower volume) for that duration. */
  duck: (durationSec: number) => void;
}

export function useBackgroundMusic(): BackgroundMusicControls {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return localStorage.getItem(MUTE_KEY) === "true"; } catch { return false; }
  });
  const isMutedRef = useRef(isMuted);
  const volumeRef = useRef(0.25); // background music default volume (quiet)
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const duckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      try {
        const Ctor = window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        ctxRef.current = new Ctor();
      } catch { return null; }
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  // Pattern index ref — persists across schedule calls
  const patternIndexRef = useRef(0);

  const schedulePattern = useCallback(() => {
    if (!isPlayingRef.current) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const masterGain = masterGainRef.current;
    if (!masterGain) return;
    const reverb = reverbRef.current;
    if (!reverb) return;

    const bpm = 96;
    const beat = 60 / bpm;
    const eighth = beat / 2;

    // C major patterns: I, IV, ii, V
    const patterns = [
      [60, 64, 67, 72, 67, 64],  // C major
      [65, 69, 72, 77, 72, 69],  // F major
      [62, 65, 69, 74, 69, 65],  // Dm
      [67, 71, 74, 79, 74, 71],  // G major
    ];

    const t = ctx.currentTime;
    const pat = patterns[patternIndexRef.current % patterns.length];
    patternIndexRef.current++;

    pat.forEach((note, i) => {
      const noteT = t + i * eighth;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = midiToFreq(note);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, noteT);
      env.gain.linearRampToValueAtTime(0.22, noteT + 0.006);
      env.gain.exponentialRampToValueAtTime(0.0001, noteT + 0.28);
      osc.connect(env);
      env.connect(reverb);
      osc.start(noteT);
      osc.stop(noteT + 0.32);
    });

    const dur = pat.length * eighth;
    const delay = (dur - 0.05) * 1000;
    const h = setTimeout(schedulePattern, delay);
    timeoutIdsRef.current.push(h);
  }, []);

  const start = useCallback(() => {
    if (isPlayingRef.current) return;
    if (isMutedRef.current) return;

    const ctx = getCtx();
    if (!ctx) return;

    // Create master gain
    if (!masterGainRef.current) {
      masterGainRef.current = ctx.createGain();
      masterGainRef.current.gain.value = volumeRef.current;
      masterGainRef.current.connect(ctx.destination);
    }

    // Create reverb
    if (!reverbRef.current) {
      reverbRef.current = makeReverb(ctx, 1.0, 3);
      reverbRef.current.connect(masterGainRef.current);
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    patternIndexRef.current = 0;
    schedulePattern();
  }, [getCtx, schedulePattern]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    // Clear all scheduled timeouts
    for (const h of timeoutIdsRef.current) {
      clearTimeout(h);
    }
    timeoutIdsRef.current = [];

    // Fade out master gain
    if (masterGainRef.current && ctxRef.current) {
      const ctx = ctxRef.current;
      const g = masterGainRef.current;
      g.gain.cancelScheduledValues(ctx.currentTime);
      g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => {
        try {
          masterGainRef.current?.disconnect();
          reverbRef.current?.disconnect();
        } catch { /* already disconnected */ }
        masterGainRef.current = null;
        reverbRef.current = null;
      }, 500);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      isMutedRef.current = next;
      try { localStorage.setItem(MUTE_KEY, String(next)); } catch { /* ok */ }

      if (next) {
        // Muting — stop playback
        stop();
      } else {
        // Unmuting — start playback
        start();
      }
      return next;
    });
  }, [stop, start]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    volumeRef.current = clamped;
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setValueAtTime(clamped, ctxRef.current.currentTime);
    }
  }, []);

  // Audio ducking: temporarily lower volume when SFX plays
  const duck = useCallback((durationSec: number) => {
    if (!masterGainRef.current || !ctxRef.current) return;
    if (!isPlayingRef.current) return;

    const ctx = ctxRef.current;
    const g = masterGainRef.current;
    const duckedVolume = volumeRef.current * 0.25; // duck to 25%
    const normalVolume = volumeRef.current;

    // Cancel any pending unduck
    if (duckTimeoutRef.current) {
      clearTimeout(duckTimeoutRef.current);
    }

    // Duck down quickly (100ms)
    g.gain.cancelScheduledValues(ctx.currentTime);
    g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
    g.gain.linearRampToValueAtTime(duckedVolume, ctx.currentTime + 0.1);

    // Schedule return to normal volume after SFX duration
    duckTimeoutRef.current = setTimeout(() => {
      if (!masterGainRef.current || !ctxRef.current) return;
      const ctx2 = ctxRef.current;
      const g2 = masterGainRef.current;
      g2.gain.cancelScheduledValues(ctx2.currentTime);
      g2.gain.setValueAtTime(g2.gain.value, ctx2.currentTime);
      g2.gain.linearRampToValueAtTime(normalVolume, ctx2.currentTime + 0.5);
      duckTimeoutRef.current = null;
    }, durationSec * 1000);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      for (const h of timeoutIdsRef.current) clearTimeout(h);
      if (duckTimeoutRef.current) clearTimeout(duckTimeoutRef.current);
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
      masterGainRef.current = null;
      reverbRef.current = null;
    };
  }, []);

  return { start, stop, isPlaying, isMuted, toggleMute, setVolume, duck };
}
