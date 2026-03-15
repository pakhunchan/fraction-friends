"use client";

/**
 * TutorPanel — attempt 5
 *
 * Wires the useNarration hook into the tutor UI. Features:
 *   - Auto-narrates each step's tutorText (supports narration markup in the text).
 *   - Progress bar that fills as the utterance plays.
 *   - Word-highlight display: each word lights up as it is spoken.
 *   - Mute / unmute button with animated speaker waves.
 *   - Speed toggle (tortoise / rabbit) — updates the base rate.
 *   - Pre-flight check on first render so we can surface an "audio unavailable"
 *     notice gracefully instead of silently failing.
 *
 * Compatible with the same LessonStep / page.tsx patterns used in attempts 1 & 2.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useNarration } from "./useNarration";

// =============================================================================
// LessonStep type (copied from the shared lessonData shape so this file is
// self-contained and does not depend on a specific import path).
// =============================================================================

export interface LessonStep {
  id: string;
  type: "narrate" | "show-number" | "show-fraction" | "choice";
  tutorText?: string;
  next?: string;
  choices?: Array<{ label: string; next: string }>;
}

// =============================================================================
// Props
// =============================================================================

export interface TutorPanelProps {
  step: LessonStep;
  onChoice: (nextId: string) => void;
  onContinue: () => void;
  taskHeader?: string;
}

// =============================================================================
// SVG icon sub-components
// =============================================================================

function SpeakerBody() {
  return <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />;
}

function SpeakerWaves({ animate }: { animate: boolean }) {
  return (
    <>
      <path
        d="M15.54 8.46a5 5 0 0 1 0 7.07"
        style={
          animate
            ? { animation: "wave-pulse-1 1.2s ease-in-out infinite" }
            : undefined
        }
      />
      <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14"
        style={
          animate
            ? { animation: "wave-pulse-2 1.2s ease-in-out infinite" }
            : undefined
        }
      />
    </>
  );
}

function SpeakerMutedX() {
  return (
    <>
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </>
  );
}

function TortoiseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 18 C5 12 8 8 12 8 C16 8 19 12 19 18" />
      <ellipse cx="12" cy="14" rx="7" ry="5" />
      <line x1="7" y1="18" x2="6" y2="21" />
      <line x1="17" y1="18" x2="18" y2="21" />
      <circle cx="19" cy="10" r="1.5" />
    </svg>
  );
}

function RabbitIcon() {
  return (
    <svg
      width="18"
      height="18"
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

// =============================================================================
// Word highlight display
// =============================================================================

/**
 * Renders a list of words with the currently-spoken word highlighted.
 * Falls back to plain-text rendering if scriptWords is empty.
 */
function WordHighlightText({
  plainText,
  scriptWords,
  currentWord,
  isSpeaking,
}: {
  plainText: string;
  scriptWords: string[];
  currentWord: number;
  isSpeaking: boolean;
}) {
  // If we have word data and are (or recently were) speaking, show highlights.
  const showHighlight = scriptWords.length > 0 && isSpeaking;

  if (!showHighlight || scriptWords.length === 0) {
    // Plain-text fallback — always visible, no highlight.
    return (
      <p className="text-base leading-relaxed text-[#e8ecff]">{plainText}</p>
    );
  }

  return (
    <p
      className="text-base leading-relaxed text-[#e8ecff]"
      aria-label={plainText}
      role="status"
      aria-live="off"
    >
      {scriptWords.map((word, i) => {
        const isActive = i === currentWord;
        const isPast = i < currentWord;

        return (
          <span
            key={i}
            style={{
              display: "inline",
              marginRight: "0.25em",
              transition: "color 0.1s ease, background-color 0.1s ease",
              borderRadius: "3px",
              padding: isActive ? "0 2px" : undefined,
              backgroundColor: isActive
                ? "rgba(99, 179, 237, 0.35)"
                : undefined,
              color: isActive
                ? "#93c5fd"           // bright blue — the "current" word
                : isPast
                ? "rgba(232,236,255,0.45)"  // dimmed — already spoken
                : "#e8ecff",          // normal — not yet spoken
              fontWeight: isActive ? 600 : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
}

// =============================================================================
// Progress bar
// =============================================================================

function ProgressBar({ value, visible }: { value: number; visible: boolean }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={visible ? value : 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Speech progress"
      style={{
        height: "3px",
        borderRadius: "2px",
        background: "rgba(255,255,255,0.1)",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
          borderRadius: "2px",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

// =============================================================================
// Pre-flight banner
// =============================================================================

function AudioUnavailableBanner() {
  return (
    <div
      style={{
        background: "rgba(251, 191, 36, 0.15)",
        border: "1px solid rgba(251, 191, 36, 0.35)",
        borderRadius: "10px",
        padding: "8px 12px",
        fontSize: "0.75rem",
        color: "#fcd34d",
        marginBottom: "12px",
      }}
    >
      Audio unavailable in this browser. The lesson will work without sound.
    </div>
  );
}

// =============================================================================
// Main component
// =============================================================================

export function TutorPanel({
  step,
  onChoice,
  onContinue,
  taskHeader,
}: TutorPanelProps) {
  const {
    narrate,
    stop,
    pause,
    resume,
    isSpeaking,
    progress,
    currentWord,
    isMuted,
    toggleMute,
    rate,
    setRate,
    preflight,
    scriptWords,
  } = useNarration();

  // ---------------------------------------------------------------------------
  // Pre-flight
  // ---------------------------------------------------------------------------

  const [audioAvailable, setAudioAvailable] = useState<boolean | null>(null); // null = checking

  useEffect(() => {
    preflight(3000).then((ok) => setAudioAvailable(ok));
  }, [preflight]);

  // ---------------------------------------------------------------------------
  // Auto-narrate on step change
  // ---------------------------------------------------------------------------

  const prevStepIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (step.id === prevStepIdRef.current) return;
    prevStepIdRef.current = step.id;

    if (step.tutorText) {
      // Use the step id as the named queue entry so we can cancel it later.
      narrate(step.tutorText, step.id, { interrupt: true });
    }
  }, [step.id, step.tutorText, narrate]);

  // ---------------------------------------------------------------------------
  // Derived UI flags
  // ---------------------------------------------------------------------------

  const showContinue =
    step.type === "narrate" ||
    step.type === "show-number" ||
    step.type === "show-fraction";
  const showChoices = step.type === "choice" && step.choices;
  const isSlow = rate < 0.8;

  // ---------------------------------------------------------------------------
  // Pause / resume toggle (for the pause button)
  // ---------------------------------------------------------------------------

  const [isPaused, setIsPaused] = useState(false);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      resume();
      setIsPaused(false);
    } else {
      pause();
      setIsPaused(true);
    }
  }, [isPaused, pause, resume]);

  // Reset pause state when speech ends.
  useEffect(() => {
    if (!isSpeaking) setIsPaused(false);
  }, [isSpeaking]);

  // ---------------------------------------------------------------------------
  // Navigation handlers
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
    setRate(isSlow ? 0.9 : 0.65);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col h-full p-6 pt-20 max-w-[300px]">
      {/* Inline keyframe styles for speaker wave animations */}
      <style>{`
        @keyframes wave-pulse-1 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes wave-pulse-2 {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Task header */}
      {taskHeader && (
        <div className="bg-white/10 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <span className="text-sm text-blue-300">{taskHeader}</span>
          <span className="text-xl" aria-hidden="true">&#x1F44B;</span>
        </div>
      )}

      {/* Audio unavailable notice (shown only after preflight fails) */}
      {audioAvailable === false && <AudioUnavailableBanner />}

      <div className="flex-1" />

      {/* Progress bar — visible while speaking */}
      <ProgressBar value={progress} visible={isSpeaking} />

      {/* Tutor text with word highlighting */}
      <div className="mb-4">
        <WordHighlightText
          plainText={step.tutorText ?? ""}
          scriptWords={scriptWords}
          currentWord={currentWord}
          isSpeaking={isSpeaking}
        />
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
          aria-label="Continue to next step"
          className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-400 active:bg-blue-600
            flex items-center justify-center transition-colors cursor-pointer mt-2 mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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

      {/* Bottom toolbar: mute, pause/resume, speed */}
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
            aria-hidden="true"
          >
            <SpeakerBody />
            {isMuted ? (
              <SpeakerMutedX />
            ) : (
              <SpeakerWaves animate={isSpeaking && !isPaused} />
            )}
          </svg>
        </button>

        {/* Pause / Resume — only show when speech is playing or paused */}
        {isSpeaking && (
          <button
            onClick={handlePauseResume}
            aria-label={isPaused ? "Resume narration" : "Pause narration"}
            title={isPaused ? "Resume" : "Pause"}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center
              text-white transition-colors cursor-pointer"
          >
            {isPaused ? (
              /* Play triangle */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            ) : (
              /* Pause bars */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            )}
          </button>
        )}

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
          {isSlow ? <TortoiseIcon /> : <RabbitIcon />}
        </button>
      </div>
    </div>
  );
}
