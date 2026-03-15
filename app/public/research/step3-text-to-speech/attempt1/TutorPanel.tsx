"use client";

import { useEffect, useRef } from "react";
import { LessonStep } from "../lib/lessonData";

interface TutorPanelProps {
  step: LessonStep;
  onChoice: (nextId: string) => void;
  onContinue: () => void;
  taskHeader?: string;
  // Speech props -- passed in from page so the hook lives at the top level.
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isMuted: boolean;
  toggleMute: () => void;
}

export function TutorPanel({
  step,
  onChoice,
  onContinue,
  taskHeader,
  speak,
  stop,
  isSpeaking,
  isMuted,
  toggleMute,
}: TutorPanelProps) {
  const showContinue =
    step.type === "narrate" ||
    step.type === "show-number" ||
    step.type === "show-fraction";
  const showChoices = step.type === "choice" && step.choices;

  // -------------------------------------------------------------------------
  // Speak the tutor text whenever the step changes.
  // -------------------------------------------------------------------------

  const prevStepIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (step.id === prevStepIdRef.current) return; // same step, no re-speak
    prevStepIdRef.current = step.id;

    if (step.tutorText) {
      speak(step.tutorText);
    }
  }, [step.id, step.tutorText, speak]);

  // -------------------------------------------------------------------------
  // Handlers that stop speech before transitioning.
  // -------------------------------------------------------------------------

  const handleChoice = (nextId: string) => {
    stop();
    onChoice(nextId);
  };

  const handleContinue = () => {
    stop();
    onContinue();
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="flex flex-col h-full p-6 pt-20 max-w-[300px]">
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

      {/* Mute / unmute toggle */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute tutor" : "Mute tutor"}
        title={isMuted ? "Unmute tutor" : "Mute tutor"}
        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center
          text-white transition-colors cursor-pointer mt-auto"
      >
        {isMuted ? (
          /* Speaker-off icon */
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
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          /* Speaker-on icon (with optional "speaking" pulse) */
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isSpeaking ? "animate-pulse" : ""}
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </div>
  );
}
