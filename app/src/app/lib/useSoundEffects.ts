"use client";

// =============================================================================
// useSoundEffects.ts — Custom Mix
// Merged from multiple attempts:
//   - Boing (attempt 1): FM synthesis spring/bounce
//   - Ding, Fanfare, Wrong (attempt 2): glockenspiel, 4-note fanfare, gentle wrong
//   - Music Box, Harp Gliss, Chime, Warm Pad, Soft Bell, Xylophone,
//     Gentle Whoosh, Sparkle (attempt 4): warm PBS-style sounds
//   - Magic Sparkle, Chest Open, Quest Horn, Victory Fanfare (attempt 6): epic sounds
//
// All sounds synthesized procedurally via Web Audio API. No audio files.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SfxName =
  // From attempt 4 (Gentle Professor story SFX palette)
  | "chime"
  | "harp-gliss"
  | "warm-pad"
  | "soft-bell"
  | "xylophone"
  | "music-box"
  | "gentle-whoosh"
  | "sparkle"
  // From attempt 1
  | "boing"
  // From attempt 2
  | "ding"
  | "fanfare"
  | "wrong"
  // From attempt 6
  | "magic-sparkle"
  | "chest-open"
  | "quest-horn"
  | "victory-fanfare";

export interface SoundEffectsControls {
  play: (name: SfxName | string) => void;
  isMuted: boolean;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  /** Register a callback that fires when any SFX starts playing.
   *  Returns approximate duration in seconds. Used for audio ducking. */
  onSfxPlay: (cb: ((durationSec: number) => void) | null) => void;
}

// ---------------------------------------------------------------------------
// Utility: MIDI note to Hz
// ---------------------------------------------------------------------------

function midi(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function midiToFreq(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

// Note constants
const C4 = 60, D4 = 62, E4 = 64, F4 = 65, G4 = 67, A4 = 69, B4 = 71;
const C5 = 72, D5 = 74, E5 = 76, G5 = 79, A5 = 81, B5 = 83;
const C6 = 84, D6 = 86, E6 = 88;
const G3 = 55, B3 = 59, D3 = 50;
const C3 = 48, E3 = 52;

// Suppress unused warnings
void [C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, G5, A5, B5, C6, D6, E6, G3, B3, D3, C3, E3];

// NOTE map for attempt 2
const NOTE: Record<string, number> = {
  C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, B4: 71,
  C5: 72, D5: 74, E5: 76, F5: 77, G5: 79,
  C3: 48, E3: 52, G3: 55,
};

// ---------------------------------------------------------------------------
// Helper: amplitude envelope
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
// Helper: bell-like tone (from attempt 4)
// ---------------------------------------------------------------------------

function bellTone(
  ctx: AudioContext,
  dest: AudioNode,
  freqHz: number,
  peakGain: number,
  decaySeconds: number,
  startTime: number,
  partialRatio = 2.756
): void {
  const t = startTime;
  const attack = 0.004;

  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = freqHz;
  const env1 = makeEnv(ctx, dest, peakGain, attack, decaySeconds, t);
  osc1.connect(env1);
  osc1.start(t);
  osc1.stop(t + attack + decaySeconds + 0.05);

  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = freqHz * partialRatio;
  const env2 = makeEnv(ctx, dest, peakGain * 0.22, attack, decaySeconds * 0.45, t);
  osc2.connect(env2);
  osc2.start(t);
  osc2.stop(t + attack + decaySeconds * 0.5 + 0.05);
}

// ---------------------------------------------------------------------------
// Helper: procedural reverb (from attempt 6)
// ---------------------------------------------------------------------------

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
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = impulse;
  return conv;
}

function makeNoise(ctx: AudioContext, duration: number): AudioBufferSourceNode {
  const size = Math.floor(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  return src;
}

function makeGain(ctx: AudioContext, value: number): GainNode {
  const g = ctx.createGain();
  g.gain.setValueAtTime(value, ctx.currentTime);
  return g;
}

// =============================================================================
// ATTEMPT 4 SOUNDS: Chime, Harp Gliss, Warm Pad, Soft Bell, Xylophone,
//                    Music Box, Gentle Whoosh, Sparkle
// =============================================================================

function playChime(ctx: AudioContext, dest: AudioNode): void {
  bellTone(ctx, dest, midi(A5), 0.18, 1.4, ctx.currentTime);
}

function playHarpGliss(ctx: AudioContext, dest: AudioNode): void {
  const glissNotes = [C4, D4, E4, G4, A4, C5, D5, E5];
  const spacing = 0.07;
  const now = ctx.currentTime;
  glissNotes.forEach((note, i) => {
    const t = now + i * spacing;
    const gain = 0.10 + i * 0.008;
    bellTone(ctx, dest, midi(note), gain, 0.7, t, 2.1);
  });
}

function playWarmPad(ctx: AudioContext, dest: AudioNode): void {
  const padNotes = [D3, G3, B3, D4, F4];
  const now = ctx.currentTime;
  const attack = 1.6;
  const sustain = 2.0;
  const release = 2.5;

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 900;
  lpf.Q.value = 0.5;
  lpf.connect(dest);

  for (const note of padNotes) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = midi(note);

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.25 + Math.random() * 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.8;
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

function playSoftBell(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 1800;
  lpf.Q.value = 0.5;
  lpf.connect(dest);
  bellTone(ctx, lpf, midi(E4), 0.20, 1.1, now, 1.9);
  bellTone(ctx, lpf, midi(E5), 0.06, 0.5, now, 1.9);
}

function playXylophone(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
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

function playMusicBox(ctx: AudioContext, dest: AudioNode): void {
  const melody = [C5, E5, G5, E5, C5, D5, E5, C5];
  const durations = [0.14, 0.14, 0.20, 0.14, 0.14, 0.14, 0.14, 0.40];
  const now = ctx.currentTime;
  let t = now;
  for (let i = 0; i < melody.length; i++) {
    const freq = midi(melody[i]);
    bellTone(ctx, dest, freq, 0.14, 0.55, t, 3.5);
    t += durations[i];
  }
}

function playGentleWhoosh(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
  const duration = 0.55;

  const bufferSize = Math.ceil(ctx.sampleRate * duration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.Q.value = 1.2;
  bpf.frequency.setValueAtTime(600, now);
  bpf.frequency.linearRampToValueAtTime(1200, now + duration * 0.5);
  bpf.frequency.linearRampToValueAtTime(800, now + duration);

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 3000;
  lpf.connect(dest);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, now);
  env.gain.linearRampToValueAtTime(0.12, now + duration * 0.3);
  env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(bpf).connect(env).connect(lpf);
  noise.start(now);
  noise.stop(now + duration + 0.05);
}

function playSparkle(ctx: AudioContext, dest: AudioNode): void {
  const sparkleNotes = [C6, D6, E6, G5, A5, B5];
  const now = ctx.currentTime;

  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 1500;
  hpf.Q.value = 0.5;
  hpf.connect(dest);

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 8000;
  lpf.Q.value = 0.5;
  lpf.connect(hpf);

  sparkleNotes.forEach((note, i) => {
    const t = now + i * 0.013 + Math.random() * 0.02;
    const centOffset = (Math.random() - 0.5) * 10;
    const freq = midi(note) * Math.pow(2, centOffset / 1200);
    const gain = 0.08 + Math.random() * 0.04;
    const decay = 0.6 + Math.random() * 0.3;
    bellTone(ctx, lpf, freq, gain, decay, t, 2.1 + Math.random() * 0.4);
  });
}

// =============================================================================
// ATTEMPT 1 SOUND: Boing
// =============================================================================

function playBoing(ctx: AudioContext, dest: AudioNode): void {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
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
  gain.connect(dest);
  osc.start(t);
  osc.stop(t + 0.5);
}

// =============================================================================
// ATTEMPT 2 SOUNDS: Ding, Fanfare, Wrong
// =============================================================================

function playDing(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
  const notes = [NOTE.E5, NOTE.G5];
  const offsets = [0, 0.12];

  for (let i = 0; i < notes.length; i++) {
    const freq = midiToFreq(notes[i]);
    const t = now + offsets[i];

    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = freq;
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2.76;

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

function playFanfare(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
  const melody = [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5];
  const noteSpacing = 0.15;
  const noteDuration = 0.45;

  const delay = ctx.createDelay(0.5);
  delay.delayTime.value = 0.18;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.25;
  const dryGain = ctx.createGain();
  dryGain.gain.value = 1.0;
  const wetGain = ctx.createGain();
  wetGain.gain.value = 0.3;

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

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq;

    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.value = freq * 4;
    lpf.Q.value = 0.7;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.15, t + 0.01);
    const releaseTime = i === melody.length - 1 ? noteDuration * 1.8 : noteDuration;
    env.gain.exponentialRampToValueAtTime(0.001, t + releaseTime);

    osc.connect(lpf).connect(env).connect(mixNode);
    osc.start(t);
    osc.stop(t + releaseTime + 0.1);
  }
}

function playWrong(ctx: AudioContext, dest: AudioNode): void {
  const now = ctx.currentTime;
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

// =============================================================================
// ATTEMPT 6 SOUNDS: Magic Sparkle, Chest Open, Quest Horn, Victory Fanfare
// =============================================================================

function playMagicSparkle(ctx: AudioContext, dest: AudioNode): void {
  const t = ctx.currentTime;
  const freqs = [880, 1108, 1318, 1760, 2093, 2637, 3136, 4186];
  const spacing = 0.07;

  const reverb = createReverb(ctx, 1.2, 5);
  const reverbGain = makeGain(ctx, 0.4);
  reverb.connect(reverbGain);
  reverbGain.connect(dest);

  freqs.forEach((freq, i) => {
    const start = t + i * spacing;
    const noteDur = 0.55 - i * 0.02;

    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, start);
    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.001, start);
    g1.gain.linearRampToValueAtTime(0.22, start + 0.008);
    g1.gain.exponentialRampToValueAtTime(0.001, start + noteDur);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2.756, start);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.001, start);
    g2.gain.linearRampToValueAtTime(0.07, start + 0.006);
    g2.gain.exponentialRampToValueAtTime(0.001, start + noteDur * 0.5);

    osc1.connect(g1);
    osc2.connect(g2);
    g1.connect(dest);
    g2.connect(dest);
    g1.connect(reverb);
    g2.connect(reverb);

    osc1.start(start);
    osc1.stop(start + noteDur + 0.05);
    osc2.start(start);
    osc2.stop(start + noteDur + 0.05);
  });
}

function playChestOpen(ctx: AudioContext, dest: AudioNode): void {
  const t = ctx.currentTime;

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
  creakGain.connect(dest);
  creakNoise.start(t);
  creakNoise.stop(t + 0.35);

  const shimmerFreqs = [523, 659, 784, 1047, 1319, 1568, 2093, 2637, 3136, 4186];
  const shimmerStart = t + 0.22;

  const reverb = createReverb(ctx, 1.0, 4);
  const reverbGain = makeGain(ctx, 0.5);
  reverb.connect(reverbGain);
  reverbGain.connect(dest);

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

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2.756, onset);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.001, onset);
    g2.gain.linearRampToValueAtTime(0.05, onset + 0.008);
    g2.gain.exponentialRampToValueAtTime(0.001, onset + dur * 0.4);

    osc.connect(g);
    osc2.connect(g2);
    g.connect(dest);
    g2.connect(dest);
    g.connect(reverb);

    osc.start(onset);
    osc.stop(onset + dur + 0.1);
    osc2.start(onset);
    osc2.stop(onset + dur * 0.5);
  });
}

function playQuestHorn(ctx: AudioContext, dest: AudioNode): void {
  const t = ctx.currentTime;

  const hornNotes = [
    { freq: 392.0, dur: 0.18, start: 0.0 },
    { freq: 523.25, dur: 0.18, start: 0.22 },
    { freq: 659.25, dur: 0.18, start: 0.44 },
    { freq: 784.0, dur: 0.65, start: 0.66 },
  ];

  const reverb = createReverb(ctx, 2.0, 4);
  const reverbGain = makeGain(ctx, 0.5);
  reverb.connect(reverbGain);
  reverbGain.connect(dest);

  hornNotes.forEach(({ freq, dur, start }) => {
    const onset = t + start;

    const sq = ctx.createOscillator();
    sq.type = "square";
    sq.frequency.setValueAtTime(freq, onset);
    sq.frequency.linearRampToValueAtTime(freq * 1.015, onset + 0.04);
    sq.frequency.setValueAtTime(freq, onset + 0.06);

    const saw = ctx.createOscillator();
    saw.type = "sawtooth";
    saw.frequency.setValueAtTime(freq * 1.006, onset);

    const sqGain = makeGain(ctx, 0.0);
    sqGain.gain.linearRampToValueAtTime(0.22, onset + 0.025);
    sqGain.gain.setValueAtTime(0.22, onset + dur - 0.05);
    sqGain.gain.linearRampToValueAtTime(0.0, onset + dur);

    const sawGain = makeGain(ctx, 0.0);
    sawGain.gain.linearRampToValueAtTime(0.12, onset + 0.03);
    sawGain.gain.setValueAtTime(0.12, onset + dur - 0.05);
    sawGain.gain.linearRampToValueAtTime(0.0, onset + dur);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, onset);
    filter.Q.setValueAtTime(0.8, onset);

    sq.connect(sqGain);
    saw.connect(sawGain);
    sqGain.connect(filter);
    sawGain.connect(filter);
    filter.connect(dest);
    filter.connect(reverb);

    sq.start(onset);
    sq.stop(onset + dur + 0.05);
    saw.start(onset);
    saw.stop(onset + dur + 0.05);
  });
}

function playVictoryFanfare(ctx: AudioContext, dest: AudioNode): void {
  const t = ctx.currentTime;

  const reverb = createReverb(ctx, 2.5, 3.5);
  const reverbGain = makeGain(ctx, 0.55);
  reverb.connect(reverbGain);
  reverbGain.connect(dest);

  const chordFreqs = [261.63, 329.63, 392.0, 523.25];
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
    g.connect(dest);
    g.connect(reverb);
    osc.start(t);
    osc.stop(t + 0.35);
  });

  const runNotes = [
    523.25, 587.33, 659.25, 698.46, 783.99, 880.0,
    987.77, 1046.5, 1174.66, 1318.51, 1568.0, 2093.0,
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
    g.connect(dest);
    g2.connect(dest);
    g.connect(reverb);

    osc.start(onset);
    osc.stop(onset + dur + 0.05);
    osc2.start(onset);
    osc2.stop(onset + dur * 0.7);
  });

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
    g.connect(dest);
    g.connect(reverb);
    osc.start(onset);
    osc.stop(onset + 0.6);
  });
}

// =============================================================================
// Approximate durations (seconds) for ducking callback
// =============================================================================

const SFX_DURATIONS: Record<string, number> = {
  "chime": 1.5,
  "harp-gliss": 1.0,
  "warm-pad": 6.0,
  "soft-bell": 1.2,
  "xylophone": 0.4,
  "music-box": 2.0,
  "gentle-whoosh": 0.6,
  "sparkle": 1.0,
  "boing": 0.5,
  "ding": 1.0,
  "fanfare": 1.5,
  "wrong": 0.6,
  "magic-sparkle": 1.2,
  "chest-open": 1.5,
  "quest-horn": 1.8,
  "victory-fanfare": 3.0,
};

// =============================================================================
// Hook
// =============================================================================

export function useSoundEffects(): SoundEffectsControls {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const volumeRef = useRef(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const onSfxPlayRef = useRef<((durationSec: number) => void) | null>(null);

  const getCtx = useCallback((): { ctx: AudioContext; dest: AudioNode } | null => {
    if (typeof window === "undefined") return null;

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

      // Notify ducking callback
      const duration = SFX_DURATIONS[name] || 1.0;
      onSfxPlayRef.current?.(duration);

      switch (name as SfxName) {
        // Attempt 4 sounds
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
        // Attempt 1
        case "boing":
          playBoing(ctx, dest);
          break;
        // Attempt 2
        case "ding":
          playDing(ctx, dest);
          break;
        case "fanfare":
          playFanfare(ctx, dest);
          break;
        case "wrong":
          playWrong(ctx, dest);
          break;
        // Attempt 6
        case "magic-sparkle":
          playMagicSparkle(ctx, dest);
          break;
        case "chest-open":
          playChestOpen(ctx, dest);
          break;
        case "quest-horn":
          playQuestHorn(ctx, dest);
          break;
        case "victory-fanfare":
          playVictoryFanfare(ctx, dest);
          break;
        default:
          // Unknown SFX names are silently ignored
          break;
      }
    },
    [getCtx]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
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
    if (!isMutedRef.current && masterGainRef.current) {
      const ctx = masterGainRef.current.context as AudioContext;
      masterGainRef.current.gain.setValueAtTime(clamped, ctx.currentTime);
    }
  }, []);

  const onSfxPlay = useCallback((cb: ((durationSec: number) => void) | null) => {
    onSfxPlayRef.current = cb;
  }, []);

  return { play, isMuted, toggleMute, setVolume, onSfxPlay };
}
