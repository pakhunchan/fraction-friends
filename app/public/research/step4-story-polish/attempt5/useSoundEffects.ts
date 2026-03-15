"use client";

import { useCallback, useRef, useState } from "react";

// ─── Sound catalogue ──────────────────────────────────────────────────────────
// Cartoon/vaudeville-style sounds, all synthesized via Web Audio API.
// No external files needed — every sound is built from oscillators and noise.
//
//   pop          – bright bubble pop (cookie placed on a plate)
//   slice        – crisp knife-swipe (cookie being cut)
//   ding         – warm bell chime (correct answer)
//   fanfare      – ascending trumpet lick (level complete / big win)
//   boing        – springy cartoon boing (wrong answer bounce-back)
//   slide-whistle – classic upward-then-downward slide whistle
//   rimshot      – ba-dum-tss snare + cymbal (punchline landing)
//   sad-trombone – descending wah-wah (wrong answer / disappointment)
//   raspberry    – wet lip-flapping splat (ridiculous wrong answer)
//   giggle       – three quick ascending pips (tutor laughing / silliness)
//   woosh        – rising air rush (cookie flying to a character)
// ─────────────────────────────────────────────────────────────────────────────

export type SoundName =
  | "pop"
  | "slice"
  | "ding"
  | "fanfare"
  | "boing"
  | "slide-whistle"
  | "rimshot"
  | "sad-trombone"
  | "raspberry"
  | "giggle"
  | "woosh";

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // ── AudioContext lifecycle ────────────────────────────────────────────────

  const getContext = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    // Browsers suspend context until a user gesture has occurred.
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Create a white-noise BufferSource of the given duration (seconds). */
  function makeNoise(ctx: AudioContext, duration: number): AudioBufferSourceNode {
    const sampleCount = Math.ceil(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    return src;
  }

  /** Fire-and-forget: connect a node chain to the destination and schedule start/stop. */
  function fire(
    ctx: AudioContext,
    source: AudioScheduledSourceNode,
    output: AudioNode,
    startTime: number,
    stopTime: number
  ) {
    output.connect(ctx.destination);
    source.start(startTime);
    source.stop(stopTime);
  }

  // ── Individual sound generators ───────────────────────────────────────────

  // pop — bright, short balloon-style pop (C6 sine descends quickly)
  const playPop = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1046, t);          // C6
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.07);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    fire(ctx, osc, gain, t, t + 0.1);
  }, []);

  // slice — sharp sawtooth knife-swipe with lowpass sweep
  const playSlice = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(2400, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.14);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(5000, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.14);
    filter.Q.value = 1.5;

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    fire(ctx, osc, gain, t, t + 0.2);
  }, []);

  // ding — warm bell chime: fundamental + two inharmonic partials
  const playDing = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;

    const partials: [freq: number, gainPeak: number, decay: number][] = [
      [880, 0.30, 0.70],          // A5 — fundamental
      [880 * 2.756, 0.09, 0.38],  // classic bell inharmonic
      [880 * 5.404, 0.04, 0.20],  // higher shimmer
    ];

    for (const [freq, gainPeak, decay] of partials) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(gainPeak, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + decay);
      osc.connect(gain);
      fire(ctx, osc, gain, t, t + decay + 0.05);
    }
  }, []);

  // fanfare — triumphant five-note trumpet lick (C4 E4 G4 C5 E5)
  // Each note uses a square wave (horn-like) with a soft sine overtone.
  const playFanfare = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4 E4 G4 C5 E5
    const spacing = 0.14;

    notes.forEach((freq, i) => {
      const start = t + i * spacing;
      const isLast = i === notes.length - 1;
      const noteDur = isLast ? 0.65 : 0.18;
      const peak = isLast ? 0.28 : 0.20;

      // Square wave — brassy, horn-like
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = "square";
      osc1.frequency.setValueAtTime(freq, start);
      g1.gain.setValueAtTime(0.001, start);
      g1.gain.linearRampToValueAtTime(peak, start + 0.015);
      g1.gain.exponentialRampToValueAtTime(0.001, start + noteDur);
      osc1.connect(g1);
      fire(ctx, osc1, g1, start, start + noteDur + 0.05);

      // Sine octave up — shimmer
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2, start);
      g2.gain.setValueAtTime(0.001, start);
      g2.gain.linearRampToValueAtTime(peak * 0.18, start + 0.015);
      g2.gain.exponentialRampToValueAtTime(0.001, start + noteDur * 0.6);
      osc2.connect(g2);
      fire(ctx, osc2, g2, start, start + noteDur);
    });
  }, []);

  // boing — classic cartoon spring: wobbling sine frequency that decays
  const playBoing = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Rapid initial spring-up, then oscillate and settle
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.linearRampToValueAtTime(700, t + 0.04);
    osc.frequency.linearRampToValueAtTime(210, t + 0.10);
    osc.frequency.linearRampToValueAtTime(580, t + 0.16);
    osc.frequency.linearRampToValueAtTime(260, t + 0.22);
    osc.frequency.linearRampToValueAtTime(490, t + 0.27);
    osc.frequency.linearRampToValueAtTime(300, t + 0.32);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.44);

    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

    osc.connect(gain);
    fire(ctx, osc, gain, t, t + 0.5);
  }, []);

  // slide-whistle — upward then downward pitch sweep (sine glide)
  const playSlideWhistle = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Sweep up
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.linearRampToValueAtTime(1800, t + 0.35);
    // Hold briefly
    osc.frequency.setValueAtTime(1800, t + 0.38);
    // Slide back down
    osc.frequency.linearRampToValueAtTime(250, t + 0.80);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.04);
    gain.gain.setValueAtTime(0.28, t + 0.75);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

    osc.connect(gain);
    fire(ctx, osc, gain, t, t + 0.9);
  }, []);

  // rimshot — snare crack (noise transient) + hi-hat sizzle + bass thud
  // Rhythm: CRACK ... tss  (ba-dum-tss, ~0.12s apart)
  const playRimshot = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;

    // --- Snare crack (filtered noise) ---
    const snare = makeNoise(ctx, 0.12);
    const snareFilter = ctx.createBiquadFilter();
    snareFilter.type = "bandpass";
    snareFilter.frequency.value = 2200;
    snareFilter.Q.value = 0.8;
    const snareGain = ctx.createGain();
    snareGain.gain.setValueAtTime(0.6, t);
    snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
    snare.connect(snareFilter);
    snareFilter.connect(snareGain);
    fire(ctx, snare, snareGain, t, t + 0.12);

    // --- Bass "dum" thud (sine 90 Hz, very short) ---
    const bass = ctx.createOscillator();
    bass.type = "sine";
    const bassGain = ctx.createGain();
    bass.frequency.setValueAtTime(90, t + 0.12);
    bass.frequency.exponentialRampToValueAtTime(40, t + 0.20);
    bassGain.gain.setValueAtTime(0.35, t + 0.12);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    bass.connect(bassGain);
    fire(ctx, bass, bassGain, t + 0.12, t + 0.24);

    // --- Cymbal "tss" (high noise, very short) ---
    const cym = makeNoise(ctx, 0.10);
    const cymFilter = ctx.createBiquadFilter();
    cymFilter.type = "highpass";
    cymFilter.frequency.value = 7000;
    const cymGain = ctx.createGain();
    cymGain.gain.setValueAtTime(0.18, t + 0.24);
    cymGain.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
    cym.connect(cymFilter);
    cymFilter.connect(cymGain);
    fire(ctx, cym, cymGain, t + 0.24, t + 0.36);
  }, []);

  // sad-trombone — descending wah-wah: four falling semitones on a sawtooth
  const playSadTrombone = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;

    // Wah-wah is a bandpass filter that sweeps down with the pitch
    const notes = [
      { freq: 311.13, start: 0.00 },  // Eb4
      { freq: 277.18, start: 0.18 },  // C#4
      { freq: 246.94, start: 0.36 },  // B3
      { freq: 207.65, start: 0.54 },  // Ab3
    ];

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";

    const wahFilter = ctx.createBiquadFilter();
    wahFilter.type = "bandpass";
    wahFilter.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
    gain.gain.setValueAtTime(0.22, t + 0.70);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.82);

    notes.forEach(({ freq, start }) => {
      const noteStart = t + start;
      osc.frequency.setValueAtTime(freq, noteStart);
      // wah filter tracks pitch but with slight lag for "wah" character
      wahFilter.frequency.setValueAtTime(freq * 2.8, noteStart);
      wahFilter.frequency.exponentialRampToValueAtTime(freq * 0.9, noteStart + 0.16);
    });

    osc.connect(wahFilter);
    wahFilter.connect(gain);
    fire(ctx, osc, gain, t, t + 0.85);
  }, []);

  // raspberry — lip-flapping wet splat: amplitude-modulated noise burst
  const playRaspberry = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    const dur = 0.5;

    const noise = makeNoise(ctx, dur);

    // Lowpass to keep it bassy and flatulent
    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.setValueAtTime(600, t);
    lpf.Q.value = 1.0;

    // LFO-style gain modulation (the "flap") — achieved via a fast oscillator on gain
    const modOsc = ctx.createOscillator();
    modOsc.type = "square";
    modOsc.frequency.setValueAtTime(55, t);  // ~55 Hz flapping rate

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(0.5, t);

    // Carrier gain envelope
    const outGain = ctx.createGain();
    outGain.gain.setValueAtTime(0.001, t);
    outGain.gain.linearRampToValueAtTime(0.35, t + 0.03);
    outGain.gain.setValueAtTime(0.35, t + 0.40);
    outGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    // The mod oscillator multiplies into the noise via gain node
    noise.connect(lpf);
    lpf.connect(outGain);
    modOsc.connect(modGain);
    modGain.connect(outGain.gain); // AudioParam modulation

    outGain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + dur);
    modOsc.start(t);
    modOsc.stop(t + dur);
  }, []);

  // giggle — three cheerful ascending chirps (sine pips, staccato)
  const playGiggle = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    const pips: [freq: number, offset: number][] = [
      [600, 0.00],
      [750, 0.12],
      [950, 0.24],
    ];

    for (const [freq, offset] of pips) {
      const start = t + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.linearRampToValueAtTime(freq * 1.15, start + 0.07);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.28, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.10);
      osc.connect(gain);
      fire(ctx, osc, gain, start, start + 0.12);
    }
  }, []);

  // woosh — rising filtered-noise air rush (cookie flying through the air)
  const playWoosh = useCallback((ctx: AudioContext) => {
    const t = ctx.currentTime;
    const dur = 0.28;

    const noise = makeNoise(ctx, dur);
    const bpf = ctx.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.Q.value = 1.8;
    bpf.frequency.setValueAtTime(350, t);
    bpf.frequency.exponentialRampToValueAtTime(5000, t + dur * 0.5);
    bpf.frequency.exponentialRampToValueAtTime(900, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.30, t + dur * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(bpf);
    bpf.connect(gain);
    fire(ctx, noise, gain, t, t + dur + 0.02);
  }, []);

  // ── Main play dispatcher ──────────────────────────────────────────────────

  const play = useCallback(
    (name: string) => {
      if (isMuted) return;

      let ctx: AudioContext;
      try {
        ctx = getContext();
      } catch {
        // Web Audio API unavailable (e.g. SSR / test environment)
        return;
      }

      switch (name as SoundName) {
        case "pop":           playPop(ctx);          break;
        case "slice":         playSlice(ctx);        break;
        case "ding":          playDing(ctx);         break;
        case "fanfare":       playFanfare(ctx);      break;
        case "boing":         playBoing(ctx);        break;
        case "slide-whistle": playSlideWhistle(ctx); break;
        case "rimshot":       playRimshot(ctx);      break;
        case "sad-trombone":  playSadTrombone(ctx);  break;
        case "raspberry":     playRaspberry(ctx);    break;
        case "giggle":        playGiggle(ctx);       break;
        case "woosh":         playWoosh(ctx);        break;
        default:
          console.warn(`[useSoundEffects] Unknown sound: "${name}"`);
      }
    },
    [
      isMuted, getContext,
      playPop, playSlice, playDing, playFanfare,
      playBoing, playSlideWhistle, playRimshot,
      playSadTrombone, playRaspberry, playGiggle, playWoosh,
    ]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return { play, isMuted, toggleMute };
}
