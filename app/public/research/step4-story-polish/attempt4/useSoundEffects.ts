"use client";

// useSoundEffects.ts — attempt4
// Sound design direction: warm, soft, never startling.
// Every sound should feel like something you'd hear in a cozy children's PBS program.
// Timbres: sine waves, light triangle waves, low-amplitude filtered noise.
// No sawtooth harshness, no loud transients, no jarring frequencies.
//
// Sounds:
//   chime        — single soft high chime (correct answer, insight moment)
//   harp-gliss   — gentle ascending harp glissando (transitions, reveals)
//   warm-pad     — slow chord swell with vibrato (opening, title)
//   soft-bell    — single mellow bell (cookie placement)
//   xylophone    — single bright-but-warm xylophone note (small win, action)
//   music-box    — a short tinkling music-box phrase (celebration)
//   gentle-whoosh — filtered noise breath (page transitions)
//   sparkle      — high glittery shimmer (fraction reveal)

import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SfxName =
  | "chime"
  | "harp-gliss"
  | "warm-pad"
  | "soft-bell"
  | "xylophone"
  | "music-box"
  | "gentle-whoosh"
  | "sparkle";

export interface SoundEffectsControls {
  /** Play a named sound. No-op when muted. */
  play: (name: SfxName | string) => void;
  /** Muted state (reactive). */
  isMuted: boolean;
  /** Toggle mute. */
  toggleMute: () => void;
  /** Programmatic volume control 0–1. */
  setVolume: (v: number) => void;
}

// ---------------------------------------------------------------------------
// Utility: MIDI note to Hz
// ---------------------------------------------------------------------------

function midi(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

// Readable note constants (MIDI numbers)
const C4 = 60, D4 = 62, E4 = 64, F4 = 65, G4 = 67, A4 = 69, B4 = 71;
const C5 = 72, D5 = 74, E5 = 76, F5 = 77, G5 = 79, A5 = 81, B5 = 83;
const C6 = 84, D6 = 86, E6 = 88;
const G3 = 55, B3 = 59, D3 = 50;

// Suppress "unused variable" warnings — all constants are available for synth patches
void [C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, F5, G5, A5, B5, C6, D6, E6, G3, B3, D3];

// ---------------------------------------------------------------------------
// Helper: create a standard soft attack / slow decay amplitude envelope
// ---------------------------------------------------------------------------

function makeEnv(
  ctx: AudioContext,
  dest: AudioNode,
  peakGain: number,
  attackTime: number,
  decayTime: number,
  startTime: number
): GainNode {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, startTime);
  g.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + attackTime + decayTime);
  g.connect(dest);
  return g;
}

// ---------------------------------------------------------------------------
// Helper: bell-like tone (sine fundamental + inharmonic partial)
// Gives a metallic warmth without being harsh.
// ---------------------------------------------------------------------------

function bellTone(
  ctx: AudioContext,
  dest: AudioNode,
  freqHz: number,
  peakGain: number,
  decaySeconds: number,
  startTime: number,
  partialRatio = 2.756  // classic inharmonic bell partial
): void {
  const t = startTime;
  const attack = 0.004; // near-instant attack for plucked bell character

  // Fundamental
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = freqHz;
  const env1 = makeEnv(ctx, dest, peakGain, attack, decaySeconds, t);
  osc1.connect(env1);
  osc1.start(t);
  osc1.stop(t + attack + decaySeconds + 0.05);

  // Inharmonic partial — quieter, shorter
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = freqHz * partialRatio;
  const env2 = makeEnv(ctx, dest, peakGain * 0.22, attack, decaySeconds * 0.45, t);
  osc2.connect(env2);
  osc2.start(t);
  osc2.stop(t + attack + decaySeconds * 0.5 + 0.05);
}

// ---------------------------------------------------------------------------
// Individual sound synthesizers
// ---------------------------------------------------------------------------

/**
 * chime — A single high, pure bell chime.
 * Used for: correct answer, moment of insight.
 * Character: clean, quiet, resonant. Like a tiny crystal bell.
 */
function playChime(ctx: AudioContext, dest: AudioNode): void {
  // A5 — bright but not piercing
  bellTone(ctx, dest, midi(A5), 0.18, 1.4, ctx.currentTime);
}

/**
 * harp-gliss — Ascending pentatonic glissando, 6 notes, very soft.
 * Used for: page transitions, reveals.
 * Character: flowing, airy, unhurried.
 */
function playHarpGliss(ctx: AudioContext, dest: AudioNode): void {
  // Pentatonic scale ascending: C D E G A in two octaves
  const glissNotes = [C4, D4, E4, G4, A4, C5, D5, E5];
  const spacing = 0.07; // seconds between each note
  const now = ctx.currentTime;

  glissNotes.forEach((note, i) => {
    const t = now + i * spacing;
    // Each note gets quieter as it rises (gentle fade up)
    const gain = 0.10 + i * 0.008;
    bellTone(ctx, dest, midi(note), gain, 0.7, t, 2.1);
  });
}

/**
 * warm-pad — A slow-swell major-seventh chord (C E G B).
 * Used for: opening / title moment, ambient backdrop.
 * Character: warm, enveloping, dreamy. Like a soft string quartet from far away.
 */
function playWarmPad(ctx: AudioContext, dest: AudioNode): void {
  // C major 7: C3 E3 G3 B3 (very low register for warmth)
  const padNotes = [D3, G3, B3, D4, F4]; // Gmaj7 voicing — open and airy
  const now = ctx.currentTime;
  const attack = 1.6;
  const sustain = 2.0;
  const release = 2.5;

  // Low-pass filter to keep it soft and round
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 900;
  lpf.Q.value = 0.5;
  lpf.connect(dest);

  for (const note of padNotes) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = midi(note);

    // Very gentle vibrato
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.25 + Math.random() * 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.8; // ± 0.8 Hz pitch deviation — extremely subtle
    lfo.connect(lfoGain).connect(osc.frequency);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.06, now + attack);
    env.gain.setValueAtTime(0.06, now + attack + sustain);
    env.gain.exponentialRampToValueAtTime(0.0001, now + attack + sustain + release);

    osc.connect(env).connect(lpf);
    osc.start(now);
    osc.stop(now + attack + sustain + release + 0.1);
    lfo.start(now);
    lfo.stop(now + attack + sustain + release + 0.1);
  }
}

/**
 * soft-bell — A single mellow, round bell tone.
 * Used for: cookie placement, gentle confirmations.
 * Character: warm, round, not bright. Like a wooden wind chime.
 */
function playSoftBell(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;

  // Low-pass filter rounds out any harshness
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 1800;
  lpf.Q.value = 0.5;
  lpf.connect(dest);

  // E4 — warm mid-range
  bellTone(ctx, lpf, midi(E4), 0.20, 1.1, now, 1.9);
  // Add a quiet octave above for a bit of shimmer
  bellTone(ctx, lpf, midi(E5), 0.06, 0.5, now, 1.9);
}

/**
 * xylophone — A single bright-but-warm xylophone note.
 * Used for: cookie half placement, small action confirmations.
 * Character: percussive, slightly wooden, cheerful without being jarring.
 */
function playXylophone(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;

  // Xylophone modeled as triangle wave (softer than sine for percussive use)
  // plus a higher harmonic partial with faster decay
  const freq = midi(G5);

  const osc1 = ctx.createOscillator();
  osc1.type = "triangle";
  osc1.frequency.value = freq;

  const env1 = ctx.createGain();
  env1.gain.setValueAtTime(0.0001, now);
  env1.gain.linearRampToValueAtTime(0.22, now + 0.003);
  env1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  osc1.connect(env1).connect(dest);
  osc1.start(now);
  osc1.stop(now + 0.4);

  // Inharmonic partial for wooden body resonance
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = freq * 3.0;
  const env2 = ctx.createGain();
  env2.gain.setValueAtTime(0.0001, now);
  env2.gain.linearRampToValueAtTime(0.06, now + 0.002);
  env2.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  osc2.connect(env2).connect(dest);
  osc2.start(now);
  osc2.stop(now + 0.15);
}

/**
 * music-box — A short pentatonic music-box melody, 8 notes.
 * Used for: celebration, lesson complete.
 * Character: delicate, tinkling, nostalgic. Like a treasured old music box.
 *
 * Melody: C5 E5 G5 E5 | C5 D5 E5 C5 (gentle arching phrase)
 */
function playMusicBox(ctx: AudioContext, dest: AudioNode): void {
  const melody = [C5, E5, G5, E5, C5, D5, E5, C5];
  const durations = [0.14, 0.14, 0.20, 0.14, 0.14, 0.14, 0.14, 0.40];
  const now = ctx.currentTime;
  let t = now;

  for (let i = 0; i < melody.length; i++) {
    const freq = midi(melody[i]);
    // Music box: very fast attack, long resonant tail, quiet
    // Model as sine + high partial ratio
    bellTone(ctx, dest, freq, 0.14, 0.55, t, 3.5);
    t += durations[i];
  }
}

/**
 * gentle-whoosh — A soft, short breath of filtered noise.
 * Used for: page transitions, "let's look at this another way."
 * Character: airy, non-alarming, like a gentle exhalation or a page turning.
 */
function playGentleWhoosh(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
  const duration = 0.55;

  // Noise buffer
  const bufferSize = Math.ceil(ctx.sampleRate * duration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  // Narrow bandpass — filters out harsh high and low frequencies
  // giving just a soft mid-range breath sound
  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.Q.value = 1.2;
  // Sweep gently upward like a sigh
  bpf.frequency.setValueAtTime(600, now);
  bpf.frequency.linearRampToValueAtTime(1200, now + duration * 0.5);
  bpf.frequency.linearRampToValueAtTime(800, now + duration);

  // Low-pass on top to remove any remaining harshness
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 3000;
  lpf.connect(dest);

  // Very gentle gain envelope — crescendo then soft fade
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, now);
  env.gain.linearRampToValueAtTime(0.12, now + duration * 0.3);
  env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(bpf).connect(env).connect(lpf);
  noise.start(now);
  noise.stop(now + duration + 0.05);
}

/**
 * sparkle — A cluster of high, shimmering bell partials.
 * Used for: fraction reveal, "here's something new."
 * Character: glittery, ethereal, magical-but-gentle. Like starlight.
 *
 * Achieved by playing 5–6 high bell tones with slight random timing and
 * slight random pitch deviation within a pentatonic cluster.
 */
function playSparkle(ctx: AudioContext, dest: AudioNode): void {
  // Pentatonic cluster in the upper register
  const sparkleNotes = [C6, D6, E6, G5, A5, B5];
  const now = ctx.currentTime;

  // High-pass filter to keep only the shimmery high frequencies
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 1500;
  hpf.Q.value = 0.5;
  hpf.connect(dest);

  // Low-pass to remove any truly harsh very-high content
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 8000;
  lpf.Q.value = 0.5;
  lpf.connect(hpf);

  sparkleNotes.forEach((note, i) => {
    // Stagger each sparkle note slightly: 0 to ~80ms
    const t = now + i * 0.013 + Math.random() * 0.02;
    // Tiny random pitch variation (± up to 5 cents) for a shimmery chorus effect
    const centOffset = (Math.random() - 0.5) * 10;
    const freq = midi(note) * Math.pow(2, centOffset / 1200);
    const gain = 0.08 + Math.random() * 0.04;
    const decay = 0.6 + Math.random() * 0.3;
    bellTone(ctx, lpf, freq, gain, decay, t, 2.1 + Math.random() * 0.4);
  });
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSoundEffects(): SoundEffectsControls {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const volumeRef = useRef(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false); // keeps play() in sync without re-render dep

  // Lazily initialise the AudioContext.
  // Browsers require a user gesture before creating an AudioContext,
  // so we wait until play() is first called.
  const getCtx = useCallback((): { ctx: AudioContext; dest: AudioNode } | null => {
    if (typeof window === "undefined") return null; // SSR guard

    if (!ctxRef.current) {
      try {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) return null;
        ctxRef.current = new Ctor();
      } catch {
        return null;
      }
    }

    const ctx = ctxRef.current;

    // Resume if the browser suspended the context (autoplay policy)
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Create master gain node once
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
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
      masterGainRef.current = null;
    };
  }, []);

  const play = useCallback(
    (name: SfxName | string) => {
      if (isMutedRef.current) return;
      const result = getCtx();
      if (!result) return;
      const { ctx, dest } = result;

      switch (name as SfxName) {
        case "chime":
          playChime(ctx, dest);
          break;
        case "harp-gliss":
          playHarpGliss(ctx, dest);
          break;
        case "warm-pad":
          playWarmPad(ctx, dest);
          break;
        case "soft-bell":
          playSoftBell(ctx, dest);
          break;
        case "xylophone":
          playXylophone(ctx, dest);
          break;
        case "music-box":
          playMusicBox(ctx, dest);
          break;
        case "gentle-whoosh":
          playGentleWhoosh(ctx, dest);
          break;
        case "sparkle":
          playSparkle(ctx, dest);
          break;
        default:
          // Unknown SFX names are silently ignored — graceful degradation.
          // (Allows lessonData to reference sfx names without crashing
          //  if they haven't been implemented yet.)
          break;
      }
    },
    [getCtx]
    // Note: isMuted state intentionally not in deps — we read isMutedRef instead,
    // so play() never needs to be re-created on every mute toggle.
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;

      // Immediately silence or restore master gain
      if (masterGainRef.current) {
        const ctx = masterGainRef.current.context as AudioContext;
        masterGainRef.current.gain.setValueAtTime(
          next ? 0 : volumeRef.current,
          ctx.currentTime
        );
      }

      return next;
    });
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    volumeRef.current = clamped;
    // Only apply if currently unmuted
    if (!isMutedRef.current && masterGainRef.current) {
      const ctx = masterGainRef.current.context as AudioContext;
      masterGainRef.current.gain.setValueAtTime(clamped, ctx.currentTime);
    }
  }, []);

  return { play, isMuted, toggleMute, setVolume };
}
