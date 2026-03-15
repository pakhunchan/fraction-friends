"use client";

import { useEffect, useRef } from "react";
import { LessonStep } from "../lib/lessonData";
import { useSpeech } from "./SpeechContext";

// ---------------------------------------------------------------------------
// Animated speaker icon SVGs
// ---------------------------------------------------------------------------

/** Speaker body (the trapezoid + cone shared by both muted and unmuted). */
function SpeakerBody() {
  return <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />;
}

/** Sound-wave arcs shown when unmuted. Each arc gets a staggered CSS animation. */
function SpeakerWaves({ animate }: { animate: boolean }) {
  return (
    <>
      <path
        d="M15.54 8.46a5 5 0 0 1 0 7.07"
        className={animate ? "animate-wave-1" : ""}
      />
      <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14"
        className={animate ? "animate-wave-2" : ""}
      />
    </>
  );
}

/** X mark shown when muted. */
function SpeakerMutedX() {
  return (
    <>
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </>
  );
}

// ---------------------------------------------------------------------------
// Speed toggle icons
// ---------------------------------------------------------------------------

function TortoiseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Simplified tortoise: shell + legs + head */}
      <path d="M5 18 C5 12 8 8 12 8 C16 8 19 12 19 18" />
      <ellipse cx="12" cy="14" rx="7" ry="5" />
      <line x1="7" y1="18" x2="6" y2="21" />
      <line x1="17" y1="18" x2="18" y2="21" />
      <circle cx="19" cy="10" r="1.5" />
    </svg>
  );
}

function RabbitIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Simplified rabbit: body + ears + tail */}
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
// Component props
// ---------------------------------------------------------------------------

interface TutorPanelProps {
  step: LessonStep;
  onChoice: (nextId: string) => void;
  onContinue: () => void;
  taskHeader?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TutorPanel({ step, onChoice, onContinue, taskHeader }: TutorPanelProps) {
  const { speak, stop, isSpeaking, isMuted, toggleMute, rate, setRate } = useSpeech();

  const showContinue =
    step.type === "narrate" ||
    step.type === "show-number" ||
    step.type === "show-fraction";
  const showChoices = step.type === "choice" && step.choices;

  const isSlow = rate < 0.8;

  // ---------------------------------------------------------------------------
  // Auto-speak tutor text on step change
  // ---------------------------------------------------------------------------

  const prevStepIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (step.id === prevStepIdRef.current) return;
    prevStepIdRef.current = step.id;

    if (step.tutorText) {
      // Interrupt any ongoing speech from a previous step and speak the new text.
      speak(step.tutorText, { interrupt: true });
    }
  }, [step.id, step.tutorText, speak]);

  // ---------------------------------------------------------------------------
  // Handlers that stop speech before transitioning
  // ---------------------------------------------------------------------------

  const handleChoice = (nextId: string) => {
    stop();
    onChoice(nextId);
  };

  const handleContinue = () => {
    stop();
    onContinue();
  };

  const handleSpeedToggle = () => {
    if (isSlow) {
      setRate(0.92); // normal
    } else {
      setRate(0.65); // slow -- easier for younger kids
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col h-full p-6 pt-20 max-w-[300px]">
      {/* Inline keyframe styles for the speaker wave animations */}
      <style>{`
        @keyframes wave-pulse-1 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes wave-pulse-2 {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-wave-1 {
          animation: wave-pulse-1 1.2s ease-in-out infinite;
        }
        .animate-wave-2 {
          animation: wave-pulse-2 1.2s ease-in-out infinite;
        }
      `}</style>

      {/* Task header */}
      {taskHeader && (
        <div className="bg-white/10 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <span className="text-sm text-blue-300">{taskHeader}</span>
          <span className="text-xl">&#x1F44B;</span>
        </div>
      )}

      <div className="flex-1" />

      {/* Tutor text */}
      <div className="mb-4">
        <p className="text-base leading-relaxed text-[#e8ecff]">
          {step.tutorText}
        </p>
      </div>

      {/* Choices */}
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

      {/* Continue button */}
      {showContinue && step.next && (
        <button
          onClick={handleContinue}
          className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-400 active:bg-blue-600
            flex items-center justify-center transition-colors cursor-pointer mt-2 mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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

      {/* Bottom toolbar: mute + speed controls */}
      <div className="flex items-center gap-2 mt-auto">
        {/* Mute / unmute */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute tutor" : "Mute tutor"}
          title={isMuted ? "Unmute" : "Mute"}
          className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center
            text-white transition-colors cursor-pointer"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <SpeakerBody />
            {isMuted ? <SpeakerMutedX /> : <SpeakerWaves animate={isSpeaking} />}
          </svg>
        </button>

        {/* Speed toggle: tortoise (slow) / rabbit (normal) */}
        <button
          onClick={handleSpeedToggle}
          aria-label={isSlow ? "Switch to normal speed" : "Switch to slow speed"}
          title={isSlow ? "Normal speed" : "Slow speed"}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            isSlow
              ? "bg-amber-500/30 hover:bg-amber-500/40 text-amber-300"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
        >
          {isSlow ? (
            <TortoiseIcon />
          ) : (
            <RabbitIcon />
          )}
        </button>
      </div>
    </div>
  );
}
