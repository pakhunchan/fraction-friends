"use client";

import { useCallback, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SfxName =
  | "pop"
  | "slice"
  | "ding"
  | "boing"
  | "woosh"
  | "fanfare"
  | "wrong"
  | "ambient";

interface SoundEffectsControls {
  /** Play a named sound effect. No-op if muted. */
  play: (name: SfxName) => void;
  /** Stop a currently-looping sound (e.g. ambient). */
  stop: (name: SfxName) => void;
  /** Set master gain (0-1). Persists across plays. */
  setVolume: (v: number) => void;
  /** Mute or unmute all output. */
  setMuted: (m: boolean) => void;
  /** Current muted state. (Read via ref so it's always fresh.) */
  isMuted: () => boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Concert pitch A4 = 440 Hz. Returns frequency for a given MIDI note. */
function midiToFreq(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

// Note name -> MIDI note number mapping for readability
const NOTE: Record<string, number> = {
  C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, B4: 71,
  C5: 72, D5: 74, E5: 76, F5: 77, G5: 79,
  C3: 48, E3: 52, G3: 55,
  Bb3: 58, Ab3: 56,
};

// ---------------------------------------------------------------------------
// Individual synth patches
// ---------------------------------------------------------------------------

/**
 * "pop" -- Major chord pluck (C4 + E4 + G4).
 * Short percussive envelope with fast decay. Satisfying cookie-placement sound.
 */
function playPop(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
  const notes = [NOTE.C4, NOTE.E4, NOTE.G4];

  for (const midi of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(midiToFreq(midi), now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.008); // fast attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25); // short decay

    osc.connect(gain).connect(dest);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

/**
 * "slice" -- Descending chromatic glissando with noise burst.
 * Models a quick knife slash across something crunchy.
 */
function playSlice(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
  const duration = 0.35;

  // --- Tonal component: fast descending glissando ---
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(2400, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + duration);
  oscGain.gain.setValueAtTime(0.12, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(oscGain).connect(dest);
  osc.start(now);
  osc.stop(now + duration + 0.05);

  // --- Noise component: short burst for "crunchy" texture ---
  const bufferSize = ctx.sampleRate * 0.15;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.6;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const noiseFilt = ctx.createBiquadFilter();
  noiseFilt.type = "bandpass";
  noiseFilt.frequency.setValueAtTime(3000, now);
  noiseFilt.frequency.exponentialRampToValueAtTime(800, now + 0.15);
  noiseFilt.Q.value = 1.5;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.25, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  noise.connect(noiseFilt).connect(noiseGain).connect(dest);
  noise.start(now);
  noise.stop(now + 0.2);
}

/**
 * "ding" -- Glockenspiel-style bell, two ascending notes.
 * The "correct!" chime: bright, metallic, cheerful.
 */
function playDing(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
  const notes = [NOTE.E5, NOTE.G5]; // ascending major third
  const offsets = [0, 0.12]; // slight stagger

  for (let i = 0; i < notes.length; i++) {
    const freq = midiToFreq(notes[i]);
    const t = now + offsets[i];

    // Fundamental
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = freq;

    // Harmonic partial for bell shimmer
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2.76; // inharmonic partial for bell timbre

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(0.2, t + 0.005);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.07, t + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc1.connect(gain1).connect(dest);
    osc2.connect(gain2).connect(dest);

    osc1.start(t);
    osc1.stop(t + 1.0);
    osc2.start(t);
    osc2.stop(t + 0.6);
  }
}

/**
 * "boing" -- FM synthesis spring/bounce.
 * Pitch bends up then settles. Cartoony and fun.
 */
function playBoing(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;

  // Carrier oscillator
  const carrier = ctx.createOscillator();
  carrier.type = "sine";
  carrier.frequency.setValueAtTime(180, now);
  carrier.frequency.exponentialRampToValueAtTime(600, now + 0.06); // spring up
  carrier.frequency.exponentialRampToValueAtTime(280, now + 0.18); // settle back
  carrier.frequency.exponentialRampToValueAtTime(220, now + 0.4);  // final rest

  // Modulator for FM wobble
  const modulator = ctx.createOscillator();
  modulator.type = "sine";
  modulator.frequency.setValueAtTime(45, now);
  modulator.frequency.linearRampToValueAtTime(8, now + 0.4);

  const modGain = ctx.createGain();
  modGain.gain.setValueAtTime(300, now);
  modGain.gain.exponentialRampToValueAtTime(10, now + 0.4);

  modulator.connect(modGain).connect(carrier.frequency);

  // Output envelope
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(0.22, now + 0.01);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  carrier.connect(env).connect(dest);

  carrier.start(now);
  carrier.stop(now + 0.55);
  modulator.start(now);
  modulator.stop(now + 0.55);
}

/**
 * "woosh" -- Filtered noise sweep.
 * Band-pass filter sweeps from low to high. Brief wind-like sound.
 */
function playWoosh(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
  const duration = 0.5;

  // Create noise buffer
  const bufferSize = Math.ceil(ctx.sampleRate * duration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  // Sweeping bandpass filter
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 2.0;
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.exponentialRampToValueAtTime(4000, now + duration * 0.6);
  filter.frequency.exponentialRampToValueAtTime(1500, now + duration);

  // Volume envelope -- crescendo then fade
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.2, now + duration * 0.4);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Stereo panning: sweep left to right
  let outputNode: AudioNode = gain;
  if (typeof ctx.createStereoPanner === "function") {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(-0.8, now);
    panner.pan.linearRampToValueAtTime(0.8, now + duration);
    gain.connect(panner);
    outputNode = panner;
  }

  noise.connect(filter).connect(gain);
  outputNode.connect(dest);

  noise.start(now);
  noise.stop(now + duration + 0.05);
}

/**
 * "fanfare" -- 4-note ascending melody C4-E4-G4-C5 with delay-based reverb.
 * Triumphant, bright, celebratory. Square wave with harmonics for a brassy feel.
 */
function playFanfare(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
  const melody = [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5];
  const noteSpacing = 0.15;
  const noteDuration = 0.45;

  // Simple delay for reverb-like tail
  const delay = ctx.createDelay(0.5);
  delay.delayTime.value = 0.18;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.25;
  const dryGain = ctx.createGain();
  dryGain.gain.value = 1.0;
  const wetGain = ctx.createGain();
  wetGain.gain.value = 0.3;

  // Delay feedback loop
  delay.connect(feedback).connect(delay);
  delay.connect(wetGain).connect(dest);
  dryGain.connect(dest);

  const mixNode = ctx.createGain();
  mixNode.gain.value = 1.0;
  mixNode.connect(dryGain);
  mixNode.connect(delay);

  for (let i = 0; i < melody.length; i++) {
    const t = now + i * noteSpacing;
    const freq = midiToFreq(melody[i]);

    // Main tone -- square wave, slightly detuned for warmth
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq;

    // Soften the square wave with a lowpass
    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.value = freq * 4;
    lpf.Q.value = 0.7;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.15, t + 0.01);
    // Last note sustains longer
    const releaseTime = i === melody.length - 1 ? noteDuration * 1.8 : noteDuration;
    env.gain.exponentialRampToValueAtTime(0.001, t + releaseTime);

    osc.connect(lpf).connect(env).connect(mixNode);
    osc.start(t);
    osc.stop(t + releaseTime + 0.1);
  }
}

/**
 * "wrong" -- Gentle two-note descending "uh-oh."
 * Soft sine tones, not harsh or punishing. Just a little "oops."
 */
function playWrong(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
  // Descending minor third: E4 -> C4 (cute "uh-oh")
  const notes = [NOTE.E4, NOTE.C4];
  const offsets = [0, 0.18];

  for (let i = 0; i < notes.length; i++) {
    const t = now + offsets[i];
    const freq = midiToFreq(notes[i]);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.14, t + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(env).connect(dest);
    osc.start(t);
    osc.stop(t + 0.5);
  }
}

/**
 * "ambient" -- Soft warm pad drone (very quiet).
 * Returns a stop function. Loops indefinitely until stopped.
 * Major triad with slow gentle vibrato. Very low gain so it sits in background.
 */
function startAmbient(
  ctx: AudioContext,
  dest: AudioNode
): { stop: () => void } {
  const now = ctx.currentTime;
  const notes = [NOTE.C3, NOTE.E3, NOTE.G3]; // C major triad, low register
  const oscillators: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  // Master gain for the pad -- very quiet
  const padGain = ctx.createGain();
  padGain.gain.setValueAtTime(0, now);
  padGain.gain.linearRampToValueAtTime(0.04, now + 2.0); // slow fade in
  padGain.connect(dest);

  for (const midi of notes) {
    const freq = midiToFreq(midi);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    // Gentle vibrato via LFO
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.3 + Math.random() * 0.2; // slightly different per voice
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 1.5; // subtle pitch modulation in Hz
    lfo.connect(lfoGain).connect(osc.frequency);

    const voiceGain = ctx.createGain();
    voiceGain.gain.value = 0.35;

    osc.connect(voiceGain).connect(padGain);

    osc.start(now);
    lfo.start(now);

    oscillators.push(osc, lfo);
    gains.push(voiceGain);
  }

  return {
    stop() {
      const t = ctx.currentTime;
      padGain.gain.setValueAtTime(padGain.gain.value, t);
      padGain.gain.linearRampToValueAtTime(0, t + 1.0); // fade out over 1s
      setTimeout(() => {
        for (const osc of oscillators) {
          try { osc.stop(); } catch { /* already stopped */ }
        }
      }, 1200);
    },
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSoundEffects(): SoundEffectsControls {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const mutedRef = useRef(false);
  const volumeRef = useRef(0.7);
  const ambientRef = useRef<{ stop: () => void } | null>(null);

  // Lazily initialise AudioContext on first interaction (browser policy).
  const getCtx = useCallback((): { ctx: AudioContext; dest: AudioNode } | null => {
    if (typeof window === "undefined") return null;

    if (!ctxRef.current) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return null;
        ctxRef.current = new AudioCtx();
      } catch {
        return null;
      }
    }

    const ctx = ctxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    if (!masterGainRef.current) {
      masterGainRef.current = ctx.createGain();
      masterGainRef.current.gain.value = volumeRef.current;
      masterGainRef.current.connect(ctx.destination);
    }

    return { ctx, dest: masterGainRef.current };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ambientRef.current) {
        ambientRef.current.stop();
        ambientRef.current = null;
      }
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
        masterGainRef.current = null;
      }
    };
  }, []);

  const play = useCallback(
    (name: SfxName) => {
      if (mutedRef.current) return;
      const result = getCtx();
      if (!result) return;
      const { ctx, dest } = result;

      switch (name) {
        case "pop":
          playPop(ctx, dest);
          break;
        case "slice":
          playSlice(ctx, dest);
          break;
        case "ding":
          playDing(ctx, dest);
          break;
        case "boing":
          playBoing(ctx, dest);
          break;
        case "woosh":
          playWoosh(ctx, dest);
          break;
        case "fanfare":
          playFanfare(ctx, dest);
          break;
        case "wrong":
          playWrong(ctx, dest);
          break;
        case "ambient":
          // Stop any existing ambient before starting a new one
          if (ambientRef.current) {
            ambientRef.current.stop();
          }
          ambientRef.current = startAmbient(ctx, dest);
          break;
      }
    },
    [getCtx]
  );

  const stop = useCallback(
    (name: SfxName) => {
      if (name === "ambient" && ambientRef.current) {
        ambientRef.current.stop();
        ambientRef.current = null;
      }
      // Other sounds are fire-and-forget; they self-terminate.
    },
    []
  );

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    volumeRef.current = clamped;
    if (masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        clamped,
        masterGainRef.current.context.currentTime
      );
    }
  }, []);

  const setMuted = useCallback((m: boolean) => {
    mutedRef.current = m;
    if (masterGainRef.current) {
      const ctx = masterGainRef.current.context as AudioContext;
      masterGainRef.current.gain.setValueAtTime(
        m ? 0 : volumeRef.current,
        ctx.currentTime
      );
    }
    // If muting, stop ambient
    if (m && ambientRef.current) {
      ambientRef.current.stop();
      ambientRef.current = null;
    }
  }, []);

  const isMuted = useCallback(() => mutedRef.current, []);

  return { play, stop, setVolume, setMuted, isMuted };
}
