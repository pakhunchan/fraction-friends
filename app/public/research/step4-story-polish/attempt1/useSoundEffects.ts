"use client";

import { useCallback, useRef, useState } from "react";

type SoundName = "pop" | "slice" | "ding" | "boing" | "woosh" | "fanfare";

/**
 * Procedural sound effect generator using Web Audio API.
 * No external audio files needed -- every sound is synthesized on the fly.
 */
export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    // Resume if suspended (browsers require a user gesture first)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // ---- Individual sound generators ----

  const playPop = useCallback((ctx: AudioContext) => {
    // Short bright pop: high-frequency sine burst with rapid decay
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  const playSlice = useCallback((ctx: AudioContext) => {
    // Quick downward frequency sweep (swoosh)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(2000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(4000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }, []);

  const playDing = useCallback((ctx: AudioContext) => {
    // Pleasant bell tone: sine wave with medium sustain, slight harmonic
    const t = ctx.currentTime;

    // Fundamental
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, t); // A5
    gain1.gain.setValueAtTime(0.3, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.6);

    // Harmonic overtone for bell-like quality
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880 * 2.756, t); // inharmonic partial for bell character
    gain2.gain.setValueAtTime(0.08, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.4);
  }, []);

  const playBoing = useCallback((ctx: AudioContext) => {
    // Bouncy spring: frequency modulation giving a wobbly feel
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Start low, spring up, then settle
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(600, t + 0.05);
    osc.frequency.linearRampToValueAtTime(200, t + 0.12);
    osc.frequency.linearRampToValueAtTime(500, t + 0.18);
    osc.frequency.linearRampToValueAtTime(250, t + 0.25);
    osc.frequency.linearRampToValueAtTime(400, t + 0.30);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.4);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }, []);

  const playWoosh = useCallback((ctx: AudioContext) => {
    // Noise burst with bandpass filter sweep
    const t = ctx.currentTime;
    const duration = 0.25;

    // Create white noise via a buffer
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(2, t);
    filter.frequency.setValueAtTime(500, t);
    filter.frequency.exponentialRampToValueAtTime(4000, t + duration * 0.4);
    filter.frequency.exponentialRampToValueAtTime(800, t + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.3, t + duration * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + duration);
  }, []);

  const playFanfare = useCallback((ctx: AudioContext) => {
    // Ascending three-note sequence: C5 - E5 - G5
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const noteSpacing = 0.18;
    const t = ctx.currentTime;

    notes.forEach((freq, i) => {
      const start = t + i * noteSpacing;

      // Main tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      // Last note rings longer
      const noteDuration = i === notes.length - 1 ? 0.6 : 0.22;
      const peakGain = i === notes.length - 1 ? 0.35 : 0.25;

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(peakGain, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + noteDuration);

      // Add a soft octave-up harmonic for shimmer
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2, start);
      gain2.gain.setValueAtTime(0.001, start);
      gain2.gain.linearRampToValueAtTime(peakGain * 0.2, start + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, start + noteDuration * 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(start);
      osc2.stop(start + noteDuration);
    });
  }, []);

  // ---- Main play function ----

  const play = useCallback(
    (name: string) => {
      if (isMuted) return;

      let ctx: AudioContext;
      try {
        ctx = getContext();
      } catch {
        // Web Audio API not available (e.g. SSR)
        return;
      }

      switch (name as SoundName) {
        case "pop":
          playPop(ctx);
          break;
        case "slice":
          playSlice(ctx);
          break;
        case "ding":
          playDing(ctx);
          break;
        case "boing":
          playBoing(ctx);
          break;
        case "woosh":
          playWoosh(ctx);
          break;
        case "fanfare":
          playFanfare(ctx);
          break;
        default:
          console.warn(`[useSoundEffects] Unknown sound: "${name}"`);
      }
    },
    [isMuted, getContext, playPop, playSlice, playDing, playBoing, playWoosh, playFanfare]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return { play, isMuted, toggleMute };
}
