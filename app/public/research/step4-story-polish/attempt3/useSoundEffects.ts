"use client";

import { useCallback, useRef, useState } from "react";

type SoundName =
  | "buzzer"
  | "winner-bell"
  | "applause"
  | "drum-roll"
  | "horn-fanfare"
  | "countdown-tick"
  | "whoosh"
  | "sparkle";

/**
 * Procedural sound effect generator using Web Audio API.
 * Game show themed — every sound is fully synthesized, no external files needed.
 *
 * Sounds:
 *   buzzer       — The classic wrong-answer BZZZT
 *   winner-bell  — Ding-ding-ding ascending triple bell
 *   applause     — Filtered noise burst simulating crowd applause
 *   drum-roll    — Rapid low-pitched snare roll building to a hit
 *   horn-fanfare — Triumphant ascending brass-like chord stab
 *   countdown-tick — Single dry click/tick (use repeatedly for countdowns)
 *   whoosh       — Upward frequency sweep (transition / cookie drag)
 *   sparkle      — High glittering shimmer of random sine pings
 */
export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // ------------------------------------------------------------------
  // AudioContext lifecycle
  // ------------------------------------------------------------------

  const getContext = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // ------------------------------------------------------------------
  // Helper: create a white-noise buffer of the given duration
  // ------------------------------------------------------------------

  const makeNoiseBuffer = useCallback(
    (ctx: AudioContext, durationSec: number): AudioBuffer => {
      const sampleRate = ctx.sampleRate;
      const length = Math.floor(sampleRate * durationSec);
      const buffer = ctx.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    },
    []
  );

  // ------------------------------------------------------------------
  // BUZZER — The classic game-show wrong-answer sound.
  // A harsh descending sawtooth buzz, amplitude-modulated for a
  // "wah-wah" feel, then cut off sharply.
  // ------------------------------------------------------------------

  const playBuzzer = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    const duration = 0.55;

    // Carrier: sawtooth for harshness
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(130, t + duration);

    // LFO for wah-wah amplitude modulation
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(18, t);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.4, t);

    // Master gain with fast attack and hard stop
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, t);
    masterGain.gain.linearRampToValueAtTime(0.45, t + 0.02);
    masterGain.gain.setValueAtTime(0.45, t + duration - 0.05);
    masterGain.gain.linearRampToValueAtTime(0.001, t + duration);

    // Lowpass to soften the rawest overtones
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, t);
    filter.Q.setValueAtTime(1.5, t);

    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain); // modulate the gain
    osc.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
    lfo.start(t);
    lfo.stop(t + duration);
  }, []);

  // ------------------------------------------------------------------
  // WINNER BELL — Ascending triple bell ding (C6 - E6 - G6).
  // Each bell is a sine + inharmonic partial for a realistic bell timbre.
  // The final note gets extra sustain and a shimmer tail.
  // ------------------------------------------------------------------

  const playWinnerBell = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    // C6, E6, G6
    const notes = [1046.5, 1318.5, 1568.0];
    const spacing = 0.16;

    notes.forEach((freq, i) => {
      const start = t + i * spacing;
      const isLast = i === notes.length - 1;
      const sustain = isLast ? 1.1 : 0.28;
      const peak = isLast ? 0.38 : 0.28;

      // Fundamental sine
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, start);
      g1.gain.setValueAtTime(0.001, start);
      g1.gain.linearRampToValueAtTime(peak, start + 0.01);
      g1.gain.exponentialRampToValueAtTime(0.001, start + sustain);
      osc1.connect(g1);
      g1.connect(ctx.destination);
      osc1.start(start);
      osc1.stop(start + sustain + 0.05);

      // Inharmonic partial at ~2.76× for bell character
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2.756, start);
      g2.gain.setValueAtTime(0.001, start);
      g2.gain.linearRampToValueAtTime(peak * 0.25, start + 0.01);
      g2.gain.exponentialRampToValueAtTime(0.001, start + sustain * 0.55);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(start);
      osc2.stop(start + sustain);

      // Final note only: high shimmer overtone at 4×
      if (isLast) {
        const osc3 = ctx.createOscillator();
        const g3 = ctx.createGain();
        osc3.type = "sine";
        osc3.frequency.setValueAtTime(freq * 4, start);
        g3.gain.setValueAtTime(0.001, start);
        g3.gain.linearRampToValueAtTime(peak * 0.1, start + 0.01);
        g3.gain.exponentialRampToValueAtTime(0.001, start + sustain * 0.35);
        osc3.connect(g3);
        g3.connect(ctx.destination);
        osc3.start(start);
        osc3.stop(start + sustain);
      }
    });
  }, []);

  // ------------------------------------------------------------------
  // APPLAUSE — Crowd cheer noise burst.
  // Multiple layers of filtered white noise with a slow swell envelope
  // to simulate the crowd building and peaking.
  // ------------------------------------------------------------------

  const playApplause = useCallback(
    (ctx: AudioContext) => {
      const t = ctx.currentTime;
      const totalDuration = 2.0;

      // Layer 1: bandpass around 600 Hz (body of crowd noise)
      const buf1 = makeNoiseBuffer(ctx, totalDuration);
      const n1 = ctx.createBufferSource();
      n1.buffer = buf1;
      const f1 = ctx.createBiquadFilter();
      f1.type = "bandpass";
      f1.frequency.setValueAtTime(600, t);
      f1.Q.setValueAtTime(0.8, t);
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.001, t);
      g1.gain.linearRampToValueAtTime(0.28, t + 0.3);
      g1.gain.setValueAtTime(0.28, t + totalDuration - 0.5);
      g1.gain.exponentialRampToValueAtTime(0.001, t + totalDuration);
      n1.connect(f1);
      f1.connect(g1);
      g1.connect(ctx.destination);
      n1.start(t);
      n1.stop(t + totalDuration);

      // Layer 2: bandpass around 2000 Hz (higher hiss / sibilance)
      const buf2 = makeNoiseBuffer(ctx, totalDuration);
      const n2 = ctx.createBufferSource();
      n2.buffer = buf2;
      const f2 = ctx.createBiquadFilter();
      f2.type = "bandpass";
      f2.frequency.setValueAtTime(2200, t);
      f2.Q.setValueAtTime(1.5, t);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.001, t);
      g2.gain.linearRampToValueAtTime(0.12, t + 0.45);
      g2.gain.setValueAtTime(0.12, t + totalDuration - 0.6);
      g2.gain.exponentialRampToValueAtTime(0.001, t + totalDuration);
      n2.connect(f2);
      f2.connect(g2);
      g2.connect(ctx.destination);
      n2.start(t);
      n2.stop(t + totalDuration);

      // Layer 3: low rumble (120 Hz) for crowd depth
      const buf3 = makeNoiseBuffer(ctx, totalDuration);
      const n3 = ctx.createBufferSource();
      n3.buffer = buf3;
      const f3 = ctx.createBiquadFilter();
      f3.type = "lowpass";
      f3.frequency.setValueAtTime(180, t);
      const g3 = ctx.createGain();
      g3.gain.setValueAtTime(0.001, t);
      g3.gain.linearRampToValueAtTime(0.18, t + 0.2);
      g3.gain.setValueAtTime(0.18, t + totalDuration - 0.7);
      g3.gain.exponentialRampToValueAtTime(0.001, t + totalDuration);
      n3.connect(f3);
      f3.connect(g3);
      g3.connect(ctx.destination);
      n3.start(t);
      n3.stop(t + totalDuration);
    },
    [makeNoiseBuffer]
  );

  // ------------------------------------------------------------------
  // DRUM ROLL — Snare roll that builds in speed and intensity, ending
  // with a big floor-tom "thud" hit for dramatic tension release.
  // Snare = bandpass noise burst; kick = low sine punch.
  // ------------------------------------------------------------------

  const playDrumRoll = useCallback(
    (ctx: AudioContext) => {
      const t = ctx.currentTime;
      const rollDuration = 1.2;

      // Snare hits that accelerate (exponential spacing)
      const hitCount = 22;
      for (let i = 0; i < hitCount; i++) {
        // Exponential time compression: hits get faster toward the end
        const progress = i / (hitCount - 1);
        const hitTime =
          t + rollDuration * (1 - Math.pow(1 - progress, 2.2));

        // Volume swells toward the end
        const hitGain = 0.06 + 0.22 * progress;

        const buf = makeNoiseBuffer(ctx, 0.04);
        const n = ctx.createBufferSource();
        n.buffer = buf;

        const f = ctx.createBiquadFilter();
        f.type = "bandpass";
        f.frequency.setValueAtTime(2200 + 300 * progress, hitTime);
        f.Q.setValueAtTime(4, hitTime);

        const g = ctx.createGain();
        g.gain.setValueAtTime(hitGain, hitTime);
        g.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.035);

        n.connect(f);
        f.connect(g);
        g.connect(ctx.destination);
        n.start(hitTime);
        n.stop(hitTime + 0.05);
      }

      // Big floor-tom finale thud at the very end
      const thudt = t + rollDuration + 0.01;
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = "sine";
      thudOsc.frequency.setValueAtTime(160, thudt);
      thudOsc.frequency.exponentialRampToValueAtTime(60, thudt + 0.15);
      thudGain.gain.setValueAtTime(0.5, thudt);
      thudGain.gain.exponentialRampToValueAtTime(0.001, thudt + 0.35);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(thudt);
      thudOsc.stop(thudt + 0.4);

      // Snare crack on the final hit
      const crackBuf = makeNoiseBuffer(ctx, 0.08);
      const crack = ctx.createBufferSource();
      crack.buffer = crackBuf;
      const crackFilter = ctx.createBiquadFilter();
      crackFilter.type = "highpass";
      crackFilter.frequency.setValueAtTime(3000, thudt);
      const crackGain = ctx.createGain();
      crackGain.gain.setValueAtTime(0.35, thudt);
      crackGain.gain.exponentialRampToValueAtTime(0.001, thudt + 0.07);
      crack.connect(crackFilter);
      crackFilter.connect(crackGain);
      crackGain.connect(ctx.destination);
      crack.start(thudt);
      crack.stop(thudt + 0.09);
    },
    [makeNoiseBuffer]
  );

  // ------------------------------------------------------------------
  // HORN FANFARE — Triumphant brass-like chord stab.
  // Three oscillators (root, fifth, octave) with sawtooth + lowpass
  // for a muted brass timbre. Pitches: C5 - G5 - C6.
  // A short crescendo into the chord, then a sustain + decay.
  // ------------------------------------------------------------------

  const playHornFanfare = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    // Chord: C5 (523 Hz), G5 (784 Hz), C6 (1047 Hz), E6 (1319 Hz)
    const frequencies = [523.25, 784.0, 1046.5, 1318.5];
    const gains = [0.3, 0.22, 0.18, 0.12];
    const totalDuration = 1.4;

    frequencies.forEach((freq, i) => {
      // Stagger entry: root first, upper voices follow quickly
      const entryDelay = i * 0.04;

      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t + entryDelay);
      // Slight upward pitch bend at attack for brass-like swell
      osc.frequency.linearRampToValueAtTime(
        freq * 1.01,
        t + entryDelay + 0.08
      );

      // Lowpass to tame sawtooth harshness and fake brass resonance
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2000 - i * 200, t + entryDelay);
      filter.Q.setValueAtTime(2, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, t + entryDelay);
      gain.gain.linearRampToValueAtTime(
        gains[i],
        t + entryDelay + 0.12
      );
      // Hold then decay
      gain.gain.setValueAtTime(gains[i], t + totalDuration - 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, t + totalDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + entryDelay);
      osc.stop(t + totalDuration + 0.05);
    });
  }, []);

  // ------------------------------------------------------------------
  // COUNTDOWN TICK — A single tight click (for use on repeated calls).
  // A very brief noise burst + high-pitched sine transient.
  // ------------------------------------------------------------------

  const playCountdownTick = useCallback(
    (ctx: AudioContext) => {
      const t = ctx.currentTime;

      // Percussive noise transient
      const buf = makeNoiseBuffer(ctx, 0.025);
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(3500, t);
      filter.Q.setValueAtTime(6, t);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + 0.03);

      // Short sine punch underneath for "weight"
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.018);
      oscGain.gain.setValueAtTime(0.18, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.025);
    },
    [makeNoiseBuffer]
  );

  // ------------------------------------------------------------------
  // WHOOSH — Upward frequency sweep (cookie drag / transition).
  // Bandpass noise that sweeps from low to high fast.
  // ------------------------------------------------------------------

  const playWhoosh = useCallback(
    (ctx: AudioContext) => {
      const t = ctx.currentTime;
      const duration = 0.3;

      const buf = makeNoiseBuffer(ctx, duration);
      const noise = ctx.createBufferSource();
      noise.buffer = buf;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.setValueAtTime(1.5, t);
      filter.frequency.setValueAtTime(300, t);
      filter.frequency.exponentialRampToValueAtTime(5000, t + duration * 0.7);
      filter.frequency.exponentialRampToValueAtTime(2000, t + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.35, t + duration * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + duration + 0.01);
    },
    [makeNoiseBuffer]
  );

  // ------------------------------------------------------------------
  // SPARKLE — High glittering shimmer of random brief sine pings.
  // 20 randomized sine tones in the 2–8 kHz range, scattered over
  // ~0.6 seconds, each with attack + fast decay.
  // ------------------------------------------------------------------

  const playSparkle = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    const count = 20;
    const window = 0.55;

    for (let i = 0; i < count; i++) {
      // Randomize timing, pitch, and gain for organic scatter
      const startOffset = Math.random() * window;
      const freq = 2000 + Math.random() * 6000;
      const peakGain = 0.04 + Math.random() * 0.09;
      const decayTime = 0.04 + Math.random() * 0.12;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + startOffset);

      gain.gain.setValueAtTime(0.001, t + startOffset);
      gain.gain.linearRampToValueAtTime(
        peakGain,
        t + startOffset + 0.008
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        t + startOffset + decayTime
      );

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + startOffset);
      osc.stop(t + startOffset + decayTime + 0.01);
    }
  }, []);

  // ------------------------------------------------------------------
  // Main play dispatcher
  // ------------------------------------------------------------------

  const play = useCallback(
    (name: string) => {
      if (isMuted) return;

      let ctx: AudioContext;
      try {
        ctx = getContext();
      } catch {
        // Web Audio API not available (e.g. SSR or unsupported browser)
        return;
      }

      switch (name as SoundName) {
        case "buzzer":
          playBuzzer(ctx);
          break;
        case "winner-bell":
          playWinnerBell(ctx);
          break;
        case "applause":
          playApplause(ctx);
          break;
        case "drum-roll":
          playDrumRoll(ctx);
          break;
        case "horn-fanfare":
          playHornFanfare(ctx);
          break;
        case "countdown-tick":
          playCountdownTick(ctx);
          break;
        case "whoosh":
          playWhoosh(ctx);
          break;
        case "sparkle":
          playSparkle(ctx);
          break;
        default:
          console.warn(`[useSoundEffects] Unknown sound: "${name}"`);
      }
    },
    [
      isMuted,
      getContext,
      playBuzzer,
      playWinnerBell,
      playApplause,
      playDrumRoll,
      playHornFanfare,
      playCountdownTick,
      playWhoosh,
      playSparkle,
    ]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return { play, isMuted, toggleMute };
}
