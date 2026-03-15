"use client";

import { useCallback, useRef, useState } from "react";

// =============================================================================
// useSoundEffects.ts — EPIC ADVENTURE QUEST Edition
// Attempt 6 · All sounds synthesized via Web Audio API
//
// Sound palette:
//   sword-whoosh   — metallic blade unsheathing: sawtooth + noise sweep
//   magic-sparkle  — ascending glittering chime cascade: sine partials
//   stone-grind    — low rumbling scrape: filtered noise + sub oscillator
//   chest-open     — treasure chest creak + shimmer: noise + rising sparkle
//   quest-horn     — heroic horn call: four-note fanfare with square + odd harmonics
//   victory-fanfare— full triumphant flourish: chord + ascending run + shimmer
//   rumble         — ominous low tremor: sub-bass oscillator + noise
//   footsteps      — rhythmic dull thuds: noise bursts with short decay
// =============================================================================

export type SoundName =
  | "sword-whoosh"
  | "magic-sparkle"
  | "stone-grind"
  | "chest-open"
  | "quest-horn"
  | "victory-fanfare"
  | "rumble"
  | "footsteps"
  // Legacy names from attempt1 — kept for drop-in compatibility
  | "pop"
  | "slice"
  | "ding"
  | "boing"
  | "woosh"
  | "fanfare";

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/** Create and connect a gain node, return it */
function makeGain(ctx: AudioContext, value: number): GainNode {
  const g = ctx.createGain();
  g.gain.setValueAtTime(value, ctx.currentTime);
  return g;
}

/** Convolution reverb: impulse response generated procedurally */
function createReverb(
  ctx: AudioContext,
  seconds: number,
  decay: number
): ConvolverNode {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * seconds);
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] =
        (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = impulse;
  return conv;
}

/** Generate a white-noise buffer source of given duration */
function makeNoise(ctx: AudioContext, duration: number): AudioBufferSourceNode {
  const size = Math.floor(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  return src;
}

// =============================================================================
// Individual sound synthesizers
// =============================================================================

/**
 * SWORD-WHOOSH
 * Metallic blade singing through air.
 * Technique: sawtooth oscillator pitched sharply downward + bandpass-filtered
 * noise rising to a cutoff, blended together. Short reverb tail for stone-hall
 * spaciousness.
 */
function playSwordWhoosh(ctx: AudioContext): void {
  const t = ctx.currentTime;
  const duration = 0.45;

  const masterGain = makeGain(ctx, 0.0);
  masterGain.gain.linearRampToValueAtTime(0.5, t + 0.02);
  masterGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  // Sawtooth blade tone — high to low
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(2800, t);
  osc.frequency.exponentialRampToValueAtTime(180, t + duration * 0.7);

  const oscFilter = ctx.createBiquadFilter();
  oscFilter.type = "bandpass";
  oscFilter.frequency.setValueAtTime(2200, t);
  oscFilter.frequency.exponentialRampToValueAtTime(400, t + duration);
  oscFilter.Q.setValueAtTime(3, t);

  const oscGain = makeGain(ctx, 0.4);

  // Noise air component
  const noise = makeNoise(ctx, duration);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(800, t);
  noiseFilter.frequency.exponentialRampToValueAtTime(3500, t + 0.08);
  noiseFilter.frequency.exponentialRampToValueAtTime(200, t + duration);
  noiseFilter.Q.setValueAtTime(1.5, t);
  const noiseGain = makeGain(ctx, 0.5);

  // Metallic shimmer — high sine ping at onset
  const ping = ctx.createOscillator();
  ping.type = "sine";
  ping.frequency.setValueAtTime(5400, t);
  ping.frequency.exponentialRampToValueAtTime(1200, t + 0.12);
  const pingGain = makeGain(ctx, 0.2);
  pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

  // Reverb for hall effect
  const reverb = createReverb(ctx, 0.6, 4);
  const reverbGain = makeGain(ctx, 0.25);

  osc.connect(oscFilter);
  oscFilter.connect(oscGain);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  ping.connect(pingGain);

  // Dry path
  oscGain.connect(masterGain);
  noiseGain.connect(masterGain);
  pingGain.connect(masterGain);

  // Wet reverb path
  oscGain.connect(reverb);
  noiseGain.connect(reverb);
  reverb.connect(reverbGain);
  reverbGain.connect(masterGain);

  masterGain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + duration + 0.1);
  ping.start(t);
  ping.stop(t + 0.2);
  noise.start(t);
  noise.stop(t + duration);
}

/**
 * MAGIC-SPARKLE
 * Ascending cascade of bell-like chime partials — glittering, crystalline.
 * Technique: 8 sine oscillators staggered in time, each with inharmonic
 * partial for bell character. Frequency rises across the cascade.
 */
function playMagicSparkle(ctx: AudioContext): void {
  const t = ctx.currentTime;

  // Base frequencies for the sparkle cascade (pentatonic-ish, wide range)
  const freqs = [880, 1108, 1318, 1760, 2093, 2637, 3136, 4186];
  const spacing = 0.07; // seconds between each sparkle

  const reverb = createReverb(ctx, 1.2, 5);
  const reverbGain = makeGain(ctx, 0.4);
  reverb.connect(reverbGain);
  reverbGain.connect(ctx.destination);

  freqs.forEach((freq, i) => {
    const start = t + i * spacing;
    const noteDur = 0.55 - i * 0.02;

    // Fundamental
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, start);
    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.001, start);
    g1.gain.linearRampToValueAtTime(0.22, start + 0.008);
    g1.gain.exponentialRampToValueAtTime(0.001, start + noteDur);

    // Inharmonic partial for bell timbre
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2.756, start);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.001, start);
    g2.gain.linearRampToValueAtTime(0.07, start + 0.006);
    g2.gain.exponentialRampToValueAtTime(0.001, start + noteDur * 0.5);

    osc1.connect(g1);
    osc2.connect(g2);
    g1.connect(ctx.destination);
    g2.connect(ctx.destination);
    g1.connect(reverb);
    g2.connect(reverb);

    osc1.start(start);
    osc1.stop(start + noteDur + 0.05);
    osc2.start(start);
    osc2.stop(start + noteDur + 0.05);
  });
}

/**
 * STONE-GRIND
 * Low, grating rumble of a massive stone door moving.
 * Technique: low-frequency sawtooth + noise filtered through slowly sweeping
 * lowpass. Sub-bass thud at onset for physical weight. Long reverb.
 */
function playStoneGrind(ctx: AudioContext): void {
  const t = ctx.currentTime;
  const duration = 1.4;

  const masterGain = makeGain(ctx, 0.6);
  masterGain.connect(ctx.destination);

  // Sub-bass oscillator — the weight of stone
  const subOsc = ctx.createOscillator();
  subOsc.type = "sawtooth";
  subOsc.frequency.setValueAtTime(55, t);
  subOsc.frequency.linearRampToValueAtTime(38, t + duration);
  const subGain = makeGain(ctx, 0.0);
  subGain.gain.linearRampToValueAtTime(0.5, t + 0.1);
  subGain.gain.setValueAtTime(0.5, t + duration - 0.2);
  subGain.gain.linearRampToValueAtTime(0.0, t + duration);

  // High-register scrape — noise with lowpass sweep
  const noise = makeNoise(ctx, duration);
  const scrapeFilter = ctx.createBiquadFilter();
  scrapeFilter.type = "lowpass";
  scrapeFilter.frequency.setValueAtTime(200, t);
  scrapeFilter.frequency.linearRampToValueAtTime(600, t + duration * 0.5);
  scrapeFilter.frequency.linearRampToValueAtTime(120, t + duration);
  scrapeFilter.Q.setValueAtTime(8, t);
  const scrapeGain = makeGain(ctx, 0.0);
  scrapeGain.gain.linearRampToValueAtTime(0.6, t + 0.08);
  scrapeGain.gain.setValueAtTime(0.6, t + duration - 0.25);
  scrapeGain.gain.linearRampToValueAtTime(0.0, t + duration);

  // Rumble modulation — tremolo via LFO
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(18, t);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(0.15, t);
  lfo.connect(lfoGain);
  lfoGain.connect(subGain.gain);

  // Reverb tail
  const reverb = createReverb(ctx, 1.5, 3);
  const reverbGain = makeGain(ctx, 0.5);
  reverb.connect(reverbGain);
  reverbGain.connect(ctx.destination);

  subOsc.connect(subGain);
  subGain.connect(masterGain);
  subGain.connect(reverb);

  noise.connect(scrapeFilter);
  scrapeFilter.connect(scrapeGain);
  scrapeGain.connect(masterGain);
  scrapeGain.connect(reverb);

  lfo.start(t);
  lfo.stop(t + duration + 0.1);
  subOsc.start(t);
  subOsc.stop(t + duration + 0.1);
  noise.start(t);
  noise.stop(t + duration);
}

/**
 * CHEST-OPEN
 * Wooden creak + explosion of magical shimmer.
 * Technique: low noise burst (creak), then ascending sparkle cascade (magic
 * treasure reveal). Two-stage sound: mechanical first, then wondrous.
 */
function playChestOpen(ctx: AudioContext): void {
  const t = ctx.currentTime;

  // --- Stage 1: wooden creak (0–0.3s) ---
  const creakNoise = makeNoise(ctx, 0.3);
  const creakFilter = ctx.createBiquadFilter();
  creakFilter.type = "bandpass";
  creakFilter.frequency.setValueAtTime(120, t);
  creakFilter.frequency.linearRampToValueAtTime(600, t + 0.15);
  creakFilter.frequency.linearRampToValueAtTime(80, t + 0.3);
  creakFilter.Q.setValueAtTime(6, t);
  const creakGain = makeGain(ctx, 0.0);
  creakGain.gain.linearRampToValueAtTime(0.45, t + 0.02);
  creakGain.gain.setValueAtTime(0.45, t + 0.2);
  creakGain.gain.linearRampToValueAtTime(0.0, t + 0.3);

  creakNoise.connect(creakFilter);
  creakFilter.connect(creakGain);
  creakGain.connect(ctx.destination);
  creakNoise.start(t);
  creakNoise.stop(t + 0.35);

  // --- Stage 2: treasure shimmer (0.2s onward) ---
  // Bright ascending shimmer — 10 sine tones spread over 0.8s
  const shimmerFreqs = [523, 659, 784, 1047, 1319, 1568, 2093, 2637, 3136, 4186];
  const shimmerStart = t + 0.22;

  const reverb = createReverb(ctx, 1.0, 4);
  const reverbGain = makeGain(ctx, 0.5);
  reverb.connect(reverbGain);
  reverbGain.connect(ctx.destination);

  shimmerFreqs.forEach((freq, i) => {
    const onset = shimmerStart + i * 0.065;
    const dur = 0.7 - i * 0.03;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, onset);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, onset);
    g.gain.linearRampToValueAtTime(0.18, onset + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, onset + dur);

    // Inharmonic for sparkle
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2.756, onset);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.001, onset);
    g2.gain.linearRampToValueAtTime(0.05, onset + 0.008);
    g2.gain.exponentialRampToValueAtTime(0.001, onset + dur * 0.4);

    osc.connect(g);
    osc2.connect(g2);
    g.connect(ctx.destination);
    g2.connect(ctx.destination);
    g.connect(reverb);

    osc.start(onset);
    osc.stop(onset + dur + 0.1);
    osc2.start(onset);
    osc2.stop(onset + dur * 0.5);
  });
}

/**
 * QUEST-HORN
 * A heroic four-note horn call — bold, reverberant, epic.
 * Technique: square + sawtooth blend (brass-like timbre), detuned unison
 * for thickness, long hall reverb. Classic "da-da-da-DAAA" motif.
 */
function playQuestHorn(ctx: AudioContext): void {
  const t = ctx.currentTime;

  // Heroic horn motif — G4, C5, E5, G5 (rising perfect intervals)
  const hornNotes = [
    { freq: 392.0, dur: 0.18, start: 0.0 },   // G4
    { freq: 523.25, dur: 0.18, start: 0.22 },  // C5
    { freq: 659.25, dur: 0.18, start: 0.44 },  // E5
    { freq: 784.0, dur: 0.65, start: 0.66 },   // G5 — long hold
  ];

  const reverb = createReverb(ctx, 2.0, 4);
  const reverbGain = makeGain(ctx, 0.5);
  reverb.connect(reverbGain);
  reverbGain.connect(ctx.destination);

  hornNotes.forEach(({ freq, dur, start }) => {
    const onset = t + start;

    // Square wave — brass body
    const sq = ctx.createOscillator();
    sq.type = "square";
    sq.frequency.setValueAtTime(freq, onset);
    // Slight pitch rise at onset (lip pressure effect)
    sq.frequency.linearRampToValueAtTime(freq * 1.015, onset + 0.04);
    sq.frequency.setValueAtTime(freq, onset + 0.06);

    // Sawtooth — adds buzz
    const saw = ctx.createOscillator();
    saw.type = "sawtooth";
    saw.frequency.setValueAtTime(freq * 1.006, onset); // slight detune for chorus

    const sqGain = makeGain(ctx, 0.0);
    sqGain.gain.linearRampToValueAtTime(0.22, onset + 0.025);
    sqGain.gain.setValueAtTime(0.22, onset + dur - 0.05);
    sqGain.gain.linearRampToValueAtTime(0.0, onset + dur);

    const sawGain = makeGain(ctx, 0.0);
    sawGain.gain.linearRampToValueAtTime(0.12, onset + 0.03);
    sawGain.gain.setValueAtTime(0.12, onset + dur - 0.05);
    sawGain.gain.linearRampToValueAtTime(0.0, onset + dur);

    // Lowpass to tame harshness — gives warm brass tone
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, onset);
    filter.Q.setValueAtTime(0.8, onset);

    sq.connect(sqGain);
    saw.connect(sawGain);
    sqGain.connect(filter);
    sawGain.connect(filter);
    filter.connect(ctx.destination);
    filter.connect(reverb);

    sq.start(onset);
    sq.stop(onset + dur + 0.05);
    saw.start(onset);
    saw.stop(onset + dur + 0.05);
  });
}

/**
 * VICTORY-FANFARE
 * Full triumphant flourish — a multi-voice orchestral moment.
 * Technique: layered chord + ascending melodic run + sparkle shimmer.
 * Three phases: chord stab, ascending run (C major scale up two octaves),
 * final ringing chord with shimmer. Long reverb throughout.
 */
function playVictoryFanfare(ctx: AudioContext): void {
  const t = ctx.currentTime;

  const reverb = createReverb(ctx, 2.5, 3.5);
  const reverbGain = makeGain(ctx, 0.55);
  reverb.connect(reverbGain);
  reverbGain.connect(ctx.destination);

  // --- Phase 1: Opening chord stab (C major) ---
  const chordFreqs = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
  chordFreqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(2000, t);

    osc.connect(filt);
    filt.connect(g);
    g.connect(ctx.destination);
    g.connect(reverb);
    osc.start(t);
    osc.stop(t + 0.35);
  });

  // --- Phase 2: Ascending melodic run (C5 to C7) ---
  const runNotes = [
    523.25,  // C5
    587.33,  // D5
    659.25,  // E5
    698.46,  // F5
    783.99,  // G5
    880.0,   // A5
    987.77,  // B5
    1046.5,  // C6
    1174.66, // D6
    1318.51, // E6
    1568.0,  // G6
    2093.0,  // C7
  ];
  const runStart = t + 0.32;
  const noteLen = 0.09;

  runNotes.forEach((freq, i) => {
    const onset = runStart + i * noteLen;
    const isLast = i === runNotes.length - 1;
    const dur = isLast ? 0.9 : noteLen + 0.02;
    const peak = isLast ? 0.35 : 0.2;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, onset);

    // Overtone for shimmer
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2, onset);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, onset);
    g.gain.linearRampToValueAtTime(peak, onset + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, onset + dur);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.001, onset);
    g2.gain.linearRampToValueAtTime(peak * 0.15, onset + 0.01);
    g2.gain.exponentialRampToValueAtTime(0.001, onset + dur * 0.6);

    osc.connect(g);
    osc2.connect(g2);
    g.connect(ctx.destination);
    g2.connect(ctx.destination);
    g.connect(reverb);

    osc.start(onset);
    osc.stop(onset + dur + 0.05);
    osc2.start(onset);
    osc2.stop(onset + dur * 0.7);
  });

  // --- Phase 3: Final sparkle burst at climax ---
  const sparkleStart = runStart + runNotes.length * noteLen + 0.05;
  const sparkleFreqs = [2093, 2637, 3136, 4186];
  sparkleFreqs.forEach((freq, i) => {
    const onset = sparkleStart + i * 0.07;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, onset);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, onset);
    g.gain.linearRampToValueAtTime(0.15, onset + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, onset + 0.5);

    osc.connect(g);
    g.connect(ctx.destination);
    g.connect(reverb);
    osc.start(onset);
    osc.stop(onset + 0.6);
  });
}

/**
 * RUMBLE
 * Ominous low-frequency tremor — the Fraction Dragon stirs.
 * Technique: sub-bass sine + filtered noise, amplitude modulated by slow
 * LFO for a breathing/growling quality. Slight pitch instability.
 */
function playRumble(ctx: AudioContext): void {
  const t = ctx.currentTime;
  const duration = 1.1;

  // Sub-bass — the dragon's heartbeat
  const sub = ctx.createOscillator();
  sub.type = "sine";
  sub.frequency.setValueAtTime(42, t);
  sub.frequency.linearRampToValueAtTime(36, t + duration);

  // Slight wobble on pitch
  const pitchLfo = ctx.createOscillator();
  pitchLfo.type = "sine";
  pitchLfo.frequency.setValueAtTime(3.5, t);
  const pitchLfoGain = ctx.createGain();
  pitchLfoGain.gain.setValueAtTime(4, t);
  pitchLfo.connect(pitchLfoGain);
  pitchLfoGain.connect(sub.frequency);

  const subGain = makeGain(ctx, 0.0);
  subGain.gain.linearRampToValueAtTime(0.55, t + 0.08);
  subGain.gain.setValueAtTime(0.55, t + duration - 0.15);
  subGain.gain.linearRampToValueAtTime(0.0, t + duration);

  // Amplitude tremolo — makes it feel alive
  const ampLfo = ctx.createOscillator();
  ampLfo.type = "sine";
  ampLfo.frequency.setValueAtTime(12, t);
  const ampLfoGain = ctx.createGain();
  ampLfoGain.gain.setValueAtTime(0.12, t);
  ampLfo.connect(ampLfoGain);
  ampLfoGain.connect(subGain.gain);

  // Low rumble noise layer
  const noise = makeNoise(ctx, duration);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.setValueAtTime(80, t);
  noiseFilter.frequency.linearRampToValueAtTime(140, t + duration * 0.5);
  noiseFilter.frequency.linearRampToValueAtTime(60, t + duration);
  noiseFilter.Q.setValueAtTime(2, t);
  const noiseGain = makeGain(ctx, 0.0);
  noiseGain.gain.linearRampToValueAtTime(0.4, t + 0.05);
  noiseGain.gain.setValueAtTime(0.4, t + duration - 0.1);
  noiseGain.gain.linearRampToValueAtTime(0.0, t + duration);

  // Reverb
  const reverb = createReverb(ctx, 1.0, 2.5);
  const reverbGain = makeGain(ctx, 0.4);
  reverb.connect(reverbGain);
  reverbGain.connect(ctx.destination);

  sub.connect(subGain);
  subGain.connect(ctx.destination);
  subGain.connect(reverb);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseGain.connect(reverb);

  sub.start(t);
  sub.stop(t + duration + 0.1);
  pitchLfo.start(t);
  pitchLfo.stop(t + duration + 0.1);
  ampLfo.start(t);
  ampLfo.stop(t + duration + 0.1);
  noise.start(t);
  noise.stop(t + duration);
}

/**
 * FOOTSTEPS
 * Rhythmic heavy thuds of boots on stone.
 * Technique: 3 noise bursts with sharp onset and quick decay, each with
 * a bandpass filter centered on low-mid thumpy frequencies.
 * Slight pitch variation between left/right feet.
 */
function playFootsteps(ctx: AudioContext): void {
  const t = ctx.currentTime;

  // Three steps: left, right, left — spaced 0.25s apart
  const steps = [
    { time: 0.0, freq: 90 },
    { time: 0.25, freq: 75 },
    { time: 0.5, freq: 88 },
  ];

  steps.forEach(({ time, freq }) => {
    const onset = t + time;
    const dur = 0.08;

    const noise = makeNoise(ctx, dur + 0.04);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq, onset);
    filter.Q.setValueAtTime(4, onset);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0, onset);
    g.gain.linearRampToValueAtTime(0.6, onset + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, onset + dur);

    // Sub thud — felt in the chest
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(freq * 1.2, onset);
    sub.frequency.exponentialRampToValueAtTime(freq * 0.5, onset + dur);
    const subGain = makeGain(ctx, 0.0);
    subGain.gain.linearRampToValueAtTime(0.4, onset + 0.003);
    subGain.gain.exponentialRampToValueAtTime(0.001, onset + dur * 0.8);

    noise.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    sub.connect(subGain);
    subGain.connect(ctx.destination);

    noise.start(onset);
    noise.stop(onset + dur + 0.05);
    sub.start(onset);
    sub.stop(onset + dur + 0.02);
  });
}

// =============================================================================
// Legacy sound aliases (attempt1 compatibility)
// =============================================================================

function playLegacyPop(ctx: AudioContext): void {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.08);
  gain.gain.setValueAtTime(0.35, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.12);
}

function playLegacyBoing(ctx: AudioContext): void {
  // Map "boing" (wrong answer) to a short rumble stab
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.linearRampToValueAtTime(90, t + 0.25);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.3, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.35);
}

// =============================================================================
// Hook
// =============================================================================

/**
 * useSoundEffects — Epic Adventure Quest edition.
 *
 * All sounds synthesized procedurally via Web Audio API.
 * No external files, no latency from network, no licensing.
 *
 * Usage:
 *   const { play, isMuted, toggleMute } = useSoundEffects();
 *   play("sword-whoosh");
 *   play("victory-fanfare");
 */
export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const getContext = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (name: string) => {
      if (isMuted) return;

      let ctx: AudioContext;
      try {
        ctx = getContext();
      } catch {
        // Web Audio API not available (SSR, old browser)
        return;
      }

      switch (name as SoundName) {
        // --- Epic adventure sounds ---
        case "sword-whoosh":
          playSwordWhoosh(ctx);
          break;
        case "magic-sparkle":
          playMagicSparkle(ctx);
          break;
        case "stone-grind":
          playStoneGrind(ctx);
          break;
        case "chest-open":
          playChestOpen(ctx);
          break;
        case "quest-horn":
          playQuestHorn(ctx);
          break;
        case "victory-fanfare":
          playVictoryFanfare(ctx);
          break;
        case "rumble":
          playRumble(ctx);
          break;
        case "footsteps":
          playFootsteps(ctx);
          break;
        // --- Legacy aliases (attempt1 compatibility) ---
        case "pop":
          playLegacyPop(ctx);
          break;
        case "slice":
          playSwordWhoosh(ctx); // sword whoosh feels right for slicing
          break;
        case "ding":
          playMagicSparkle(ctx); // sparkle replaces the plain ding
          break;
        case "boing":
          playLegacyBoing(ctx);
          break;
        case "woosh":
          playSwordWhoosh(ctx);
          break;
        case "fanfare":
          playVictoryFanfare(ctx);
          break;
        default:
          console.warn(`[useSoundEffects] Unknown sound: "${name}"`);
      }
    },
    [isMuted, getContext]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return { play, isMuted, toggleMute };
}
