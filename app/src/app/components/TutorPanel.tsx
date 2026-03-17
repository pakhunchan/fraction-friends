"use client";

import { useState } from "react";
import { LessonStep } from "../lib/lessonData-storyB";

interface TutorPanelProps {
  step: LessonStep;
  onChoice: (nextId: string) => void;
  onContinue: () => void;
  taskHeader?: string;
  isTtsSpeaking?: boolean;
  isTtsMuted?: boolean;
  onToggleTtsMute?: () => void;
  isMusicMuted?: boolean;
  onToggleMusicMute?: () => void;
  isSfxMuted?: boolean;
  onToggleSfxMute?: () => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

export function TutorPanel({
  step,
  onChoice,
  onContinue,
  taskHeader,
  isTtsSpeaking = false,
  isTtsMuted = false,
  onToggleTtsMute,
  isMusicMuted = false,
  onToggleMusicMute,
  isSfxMuted = false,
  onToggleSfxMute,
  isPaused = false,
  onTogglePause,
}: TutorPanelProps) {
  const showContinue =
    step.type === "narrate" ||
    step.type === "show-number" ||
    step.type === "show-fraction" ||
    step.type === "cheer";
  const showChoices = step.type === "choice" && step.choices;

  return (
    <div className="flex flex-col h-full p-6 pt-8 max-w-[300px]">
      {/* Task header */}
      {taskHeader && (
        <div className="bg-white/10 rounded-xl px-4 py-3 mb-6">
          <span className="text-lg text-blue-300">{taskHeader}</span>
        </div>
      )}

      {/* Tutor text */}
      <div className="mb-6">
        <p className="text-2xl leading-relaxed text-[#e8ecff]">
          {step.tutorText}
        </p>
        {/* Speaking indicator — always rendered to reserve space and prevent layout shift */}
        <div className={`flex items-center gap-1.5 mt-2 transition-opacity ${isTtsSpeaking ? "opacity-100" : "opacity-0"}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs text-blue-300 opacity-70">Speaking...</span>
        </div>
      </div>

      {/* Choices */}
      {showChoices && (
        <div className="flex flex-col gap-3 mb-4">
          {step.choices!.map((choice) => (
            <button
              key={choice.label}
              onClick={() => onChoice(choice.next)}
              className="px-5 py-4 rounded-xl bg-white/10 text-[#e8ecff] text-xl font-medium
                hover:bg-white/20 active:bg-white/25 transition-colors cursor-pointer text-left"
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}

      {/* Continue button */}
      {showContinue && step.next && (
        <button
          onClick={onContinue}
          className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-400 active:bg-blue-600
            flex items-center justify-center transition-colors cursor-pointer mt-2 mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4L10 16M10 16L4 10M10 16L16 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Audio controls row */}
      <div className="flex items-center gap-3 mt-auto pt-2 pb-2">
        {/* Pause button */}
        {onTogglePause && (
          <button
            onClick={onTogglePause}
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-white transition-colors cursor-pointer ${
              isPaused ? "bg-white/20 text-blue-400" : "bg-white/10 hover:bg-white/20"
            }`}
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            )}
          </button>
        )}

        {/* TTS mute button */}
        {onToggleTtsMute && (
          <button
            onClick={onToggleTtsMute}
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg transition-colors cursor-pointer ${
              isTtsMuted ? "bg-white/5 text-white/30" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
            title={isTtsMuted ? "Unmute voice" : "Mute voice"}
          >
            {isTtsMuted ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
              </svg>
            )}
          </button>
        )}

        {/* SFX mute button */}
        {onToggleSfxMute && (
          <button
            onClick={onToggleSfxMute}
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-base transition-colors cursor-pointer ${
              isSfxMuted ? "bg-white/5 text-white/30" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
            title={isSfxMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isSfxMuted ? "SFX" : "SFX"}
          </button>
        )}

        {/* Music mute button */}
        {onToggleMusicMute && (
          <button
            onClick={onToggleMusicMute}
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg transition-colors cursor-pointer ${
              isMusicMuted ? "bg-white/5 text-white/30" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
            title={isMusicMuted ? "Unmute music" : "Mute music"}
          >
            {isMusicMuted ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /><line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
