"use client";

import { useEffect, useRef } from "react";
import { LessonStep } from "../../app/src/app/lib/lessonData";
import { useSpeech } from "./useSpeech";

// ---------------------------------------------------------------------------
// Icon primitives  (inline SVG — no icon library needed)
// ---------------------------------------------------------------------------

/**
 * Speaker icon that morphs between three states:
 *   muted     — speaker body + X
 *   speaking  — speaker body + animated waves
 *   idle      — speaker body + static waves
 */
function SpeakerIcon({
  muted,
  speaking,
}: {
  muted: boolean;
  speaking: boolean;
}) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Speaker body */}
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />

      {muted ? (
        /* X — muted */
        <>
          <line x1="23" y1="9"  x2="17" y2="15" />
          <line x1="17" y1="9"  x2="23" y2="15" />
        </>
      ) : (
        /* Sound waves — animate when actively speaking */
        <>
          <path
            d="M15.54 8.46a5 5 0 0 1 0 7.07"
            style={speaking ? { animation: "tts-wave1 1.2s ease-in-out infinite" } : undefined}
          />
          <path
            d="M19.07 4.93a10 10 0 0 1 0 14.14"
            style={speaking ? { animation: "tts-wave2 1.2s ease-in-out infinite" } : undefined}
          />
        </>
      )}
    </svg>
  );
}

/**
 * Speed indicator: tortoise when rate is slow, rabbit when normal/fast.
 * These are deliberately simple geometric shapes — legible at 18 px.
 */
function SpeedIcon({ slow }: { slow: boolean }) {
  return slow ? (
    // Tortoise
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="14" rx="7" ry="5" />
      <path d="M5 18c0-6 3-10 7-10s7 4 7 10" />
      <line x1="7"  y1="18" x2="6"  y2="21" />
      <line x1="17" y1="18" x2="18" y2="21" />
      <circle cx="19" cy="10" r="1.5" />
    </svg>
  ) : (
    // Rabbit
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="16" rx="6" ry="5" />
      <path d="M9 11 L7 3" />
      <path d="M15 11 L17 3" />
      <circle cx="10" cy="15" r="0.8" fill="currentColor" />
      <circle cx="14" cy="15" r="0.8" fill="currentColor" />
      <circle cx="20" cy="14" r="2" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Rate steps: the three positions the speed knob cycles through
// ---------------------------------------------------------------------------

/** Rate presets, in ascending order. */
const RATE_STEPS = [0.65, 0.9, 1.2] as const;
type RateStep = (typeof RATE_STEPS)[number];

/** Snap an arbitrary rate to the nearest preset. */
function snapRate(r: number): RateStep {
  return RATE_STEPS.reduce((best, step) =>
    Math.abs(step - r) < Math.abs(best - r) ? step : best
  );
}

/** Cycle to the next preset, wrapping around. */
function nextRate(current: number): RateStep {
  const snapped = snapRate(current);
  const idx = RATE_STEPS.indexOf(snapped);
  return RATE_STEPS[(idx + 1) % RATE_STEPS.length];
}

function rateLabel(r: number): string {
  const s = snapRate(r);
  if (s <= 0.65) return "Slow";
  if (s >= 1.2)  return "Fast";
  return "Normal";
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TutorPanelProps {
  step: LessonStep;
  onChoice: (nextId: string) => void;
  onContinue: () => void;
  taskHeader?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * TutorPanel — attempt3
 *
 * Self-contained: owns its own useSpeech() instance (or can be refactored to
 * receive speech props from the parent — see note below).
 *
 * Auto-speaks `step.tutorText` every time `step.id` changes.
 * Bottom toolbar: mute toggle + three-position speed cycle.
 *
 * Note on hook placement: useSpeech() is called directly inside this component
 * which is the simplest wiring model (no Provider needed).  If you need shared
 * speech state across multiple components, hoist the hook to `page.tsx` and
 * pass `{ speak, stop, isSpeaking, isMuted, toggleMute, rate, setRate }` as
 * props instead.
 */
export function TutorPanel({
  step,
  onChoice,
  onContinue,
  taskHeader,
}: TutorPanelProps) {
  const { speak, stop, isSpeaking, isMuted, toggleMute, rate, setRate } =
    useSpeech();

  const showContinue =
    step.type === "narrate" ||
    step.type === "show-number" ||
    step.type === "show-fraction";
  const showChoices = step.type === "choice" && step.choices;

  // ---- Auto-speak on step change ----------------------------------------

  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (step.id === prevIdRef.current) return; // guard against re-renders
    prevIdRef.current = step.id;

    if (step.tutorText) {
      speak(step.tutorText);
    }
  }, [step.id, step.tutorText, speak]);

  // ---- Navigation handlers (always stop speech before transitioning) ------

  const handleChoice = (nextId: string) => {
    stop();
    onChoice(nextId);
  };

  const handleContinue = () => {
    stop();
    onContinue();
  };

  // ---- Speed controls -----------------------------------------------------

  const handleCycleSpeed = () => {
    setRate(nextRate(rate));
  };

  const isSlow = snapRate(rate) === 0.65;
  const speedLabel = rateLabel(rate);

  // ---- Render -------------------------------------------------------------

  return (
    <>
      {/*
        Keyframe definitions for the speaking wave animation.
        Scoped to this component via unique animation names.
        Using <style> inside the component avoids a Tailwind dependency.
      */}
      <style>{`
        @keyframes tts-wave1 {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.2; }
        }
        @keyframes tts-wave2 {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 1;   }
        }
      `}</style>

      <div className="flex flex-col h-full p-6 pt-20 max-w-[300px]">
        {/* Task header ---------------------------------------------------- */}
        {taskHeader && (
          <div className="bg-white/10 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
            <span className="text-sm text-blue-300">{taskHeader}</span>
            <span className="text-xl" aria-hidden="true">
              &#x1F44B;
            </span>
          </div>
        )}

        {/* Push content to bottom ---------------------------------------- */}
        <div className="flex-1" />

        {/* Tutor text ----------------------------------------------------- */}
        <div className="mb-4">
          <p className="text-base leading-relaxed text-[#e8ecff]">
            {step.tutorText}
          </p>
        </div>

        {/* Multiple-choice buttons ---------------------------------------- */}
        {showChoices && (
          <div className="flex flex-wrap gap-2 mb-4">
            {step.choices!.map((choice) => (
              <button
                key={choice.label}
                onClick={() => handleChoice(choice.next)}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-[#e8ecff] text-sm font-medium
                  hover:bg-white/20 active:bg-white/25 transition-colors cursor-pointer"
              >
                {choice.label}
              </button>
            ))}
          </div>
        )}

        {/* Continue button (down-arrow) ----------------------------------- */}
        {showContinue && step.next && (
          <button
            onClick={handleContinue}
            aria-label="Continue"
            className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-400 active:bg-blue-600
              flex items-center justify-center transition-colors cursor-pointer mt-2 mb-4"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 4L10 16M10 16L4 10M10 16L16 10"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Bottom toolbar: mute + speed ----------------------------------- */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute tutor voice" : "Mute tutor voice"}
            title={isMuted ? "Unmute" : "Mute"}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              transition-colors cursor-pointer
              ${isMuted
                ? "bg-red-500/30 hover:bg-red-500/40 text-red-300"
                : "bg-white/10 hover:bg-white/20 text-white"}
            `}
          >
            <SpeakerIcon muted={isMuted} speaking={isSpeaking} />
          </button>

          {/*
            Speed cycle button.
            Three positions: Slow → Normal → Fast → Slow …
            The icon flips between tortoise (slow) and rabbit (normal/fast).
          */}
          <button
            onClick={handleCycleSpeed}
            aria-label={`Speech speed: ${speedLabel}. Click to change.`}
            title={`Speed: ${speedLabel}`}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              transition-colors cursor-pointer
              ${isSlow
                ? "bg-amber-500/30 hover:bg-amber-500/40 text-amber-300"
                : "bg-white/10 hover:bg-white/20 text-white"}
            `}
          >
            <SpeedIcon slow={isSlow} />
          </button>

          {/* Speed label (small, subtle, for legibility) */}
          <span className="text-xs text-white/40 select-none">{speedLabel}</span>
        </div>
      </div>
    </>
  );
}
