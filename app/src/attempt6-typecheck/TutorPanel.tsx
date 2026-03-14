"use client";

/**
 * TutorPanel — Accessibility-First (attempt6)
 *
 * Accessibility checklist implemented here:
 *
 *  [x] ARIA live region (`aria-live="polite"`) mirrors every spoken utterance
 *      so screen readers announce it without double-reading.
 *  [x] Screen-reader detection: when a SR is detected, TTS is suppressed and
 *      the user is offered a control to opt back in.
 *  [x] Caption / subtitle strip — always visible when showCaptions is true.
 *  [x] Keyboard shortcuts panel — visible legend for Space/Esc/+/-.
 *  [x] prefers-reduced-motion — all CSS animations are wrapped in a
 *      @media (prefers-reduced-motion: no-preference) guard; this component
 *      also reads the preference and disables the speaking-pulse indicator.
 *  [x] High-contrast visual indicators for each speech state
 *      (speaking / paused / muted / captions-only).
 *  [x] Full aria-label, aria-pressed, aria-describedby on every control.
 *  [x] role="status" on the caption strip so it is announced politely.
 *  [x] Visible focus styles (ring) on all interactive controls.
 *  [x] All SVG icons have aria-hidden="true" with label text elsewhere.
 *  [x] rate = 0.5–2.0 with +/- keyboard shortcuts and explicit step buttons.
 */

import { useEffect, useRef, useState } from "react";
import { useSpeech } from "./useSpeech";

// ---------------------------------------------------------------------------
// Type (mirrors the existing lesson-data shape)
// ---------------------------------------------------------------------------

export interface LessonStep {
  id: string;
  type: "narrate" | "show-number" | "show-fraction" | "choice";
  tutorText?: string;
  next?: string;
  choices?: Array<{ label: string; next: string }>;
}

export interface TutorPanelProps {
  step: LessonStep;
  onChoice: (nextId: string) => void;
  onContinue: () => void;
  taskHeader?: string;
}

// ---------------------------------------------------------------------------
// Small SVG icon components — all aria-hidden so surrounding labels carry
// the semantic meaning.
// ---------------------------------------------------------------------------

function IconSpeakerOn({ pulsing }: { pulsing: boolean }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={pulsing ? "speaking-pulse" : ""}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" className="wave wave-1" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" className="wave wave-2" />
    </svg>
  );
}

function IconSpeakerMuted() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
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
  );
}

function IconPause() {
  return (
    <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function IconStop() {
  return (
    <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

function IconCaptions() {
  return (
    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M7 13h4M15 13h2M7 17h2M13 17h4" />
    </svg>
  );
}

function IconKeyboard() {
  return (
    <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M8 13h.01M12 13h.01M16 13h.01M7 17h10" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconArrowDown() {
  return (
    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4L10 16M10 16L4 10M10 16L16 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Keyboard shortcut legend (tooltip panel)
// ---------------------------------------------------------------------------

function ShortcutLegend({ visible }: { visible: boolean }) {
  if (!visible) return null;

  const shortcuts: Array<{ keys: string[]; desc: string }> = [
    { keys: ["Space"],  desc: "Pause / Resume speech" },
    { keys: ["Esc"],    desc: "Stop speech" },
    { keys: ["+"],      desc: "Speed up" },
    { keys: ["−"],      desc: "Slow down" },
  ];

  return (
    <div
      role="tooltip"
      id="shortcut-legend"
      className="shortcut-legend"
    >
      <p className="shortcut-legend__title">Keyboard shortcuts</p>
      <dl className="shortcut-legend__list">
        {shortcuts.map(({ keys, desc }) => (
          <div key={desc} className="shortcut-legend__row">
            <dt>
              {keys.map((k) => (
                <kbd key={k} className="shortcut-legend__kbd">{k}</kbd>
              ))}
            </dt>
            <dd>{desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ---------------------------------------------------------------------------
// State badge (high-contrast indicator of current speech state)
// ---------------------------------------------------------------------------

type SpeechState = "muted" | "speaking" | "paused" | "idle";

function SpeechStateBadge({ state, hasScreenReader }: { state: SpeechState; hasScreenReader: boolean }) {
  const labels: Record<SpeechState, string> = {
    muted:    "Muted",
    speaking: "Speaking",
    paused:   "Paused",
    idle:     hasScreenReader ? "Screen reader mode" : "Ready",
  };

  const colorClass: Record<SpeechState, string> = {
    muted:    "badge--muted",
    speaking: "badge--speaking",
    paused:   "badge--paused",
    idle:     "badge--idle",
  };

  return (
    <span className={`badge ${colorClass[state]}`} aria-hidden="true">
      {labels[state]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Screen-reader notice banner
// ---------------------------------------------------------------------------

function ScreenReaderNotice({
  suppression,
  onOverride,
}: {
  suppression: boolean;
  onOverride: () => void;
}) {
  return (
    <div role="note" className="sr-notice" aria-label="Screen reader detected notice">
      <p className="sr-notice__text">
        Screen reader detected. Audio speech is off to avoid double-speaking.
      </p>
      <button
        onClick={onOverride}
        className="sr-notice__btn"
        aria-pressed={!suppression}
      >
        {suppression ? "Enable speech alongside screen reader" : "Disable speech (recommended)"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rate control
// ---------------------------------------------------------------------------

function RateControl({
  rate,
  onIncrease,
  onDecrease,
}: {
  rate: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const label = rate < 0.75 ? "Slow" : rate < 1.1 ? "Normal" : "Fast";

  return (
    <div className="rate-control" role="group" aria-label="Speech rate">
      <button
        onClick={onDecrease}
        aria-label="Slow down speech (keyboard: minus)"
        className="rate-btn"
        aria-describedby="rate-display"
      >
        <span aria-hidden="true">−</span>
      </button>

      <span id="rate-display" className="rate-display" aria-live="polite" aria-atomic="true">
        <span aria-hidden="true">{label}</span>
        <span className="sr-only">{`Speech rate: ${Math.round(rate * 100)}%`}</span>
      </span>

      <button
        onClick={onIncrease}
        aria-label="Speed up speech (keyboard: plus)"
        className="rate-btn"
        aria-describedby="rate-display"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Caption strip
// ---------------------------------------------------------------------------

function CaptionStrip({ text }: { text: string }) {
  return (
    <div
      role="status"
      aria-label="Current speech caption"
      className="caption-strip"
    >
      <span aria-hidden="true" className="caption-strip__label">CC</span>
      <p className="caption-strip__text">{text || "\u00A0"}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function TutorPanel({ step, onChoice, onContinue, taskHeader }: TutorPanelProps) {
  const {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isMuted,
    toggleMute,
    captionText,
    showCaptions,
    setCaptions,
    rate,
    setRate,
    hasScreenReader,
    screenReaderSuppression,
    setScreenReaderSuppression,
  } = useSpeech();

  const [showShortcuts, setShowShortcuts] = useState(false);

  // Whether the OS prefers reduced motion (affects the pulse indicator).
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // ---- Auto-speak on step change ----
  const prevStepIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (step.id === prevStepIdRef.current) return;
    prevStepIdRef.current = step.id;
    if (step.tutorText) {
      speak(step.tutorText, { interrupt: true });
    }
  }, [step.id, step.tutorText, speak]);

  // ---- Derive speech state for badge / aria ----
  const speechState: SpeechState = isMuted
    ? "muted"
    : isPaused
    ? "paused"
    : isSpeaking
    ? "speaking"
    : "idle";

  // ---- Handlers that stop speech before navigation ----
  const handleChoice = (nextId: string) => {
    stop();
    onChoice(nextId);
  };
  const handleContinue = () => {
    stop();
    onContinue();
  };

  // ---- Derived render flags ----
  const showContinue = step.type === "narrate" || step.type === "show-number" || step.type === "show-fraction";
  const showChoices  = step.type === "choice" && step.choices;

  // ---- Rate helpers ----
  const increaseRate = () => setRate(Math.min(2.0, Math.round((rate + 0.1) * 10) / 10));
  const decreaseRate = () => setRate(Math.max(0.5, Math.round((rate - 0.1) * 10) / 10));

  // ---- Unique IDs for ARIA relationships ----
  const liveRegionId  = "tutor-live-region";
  const tutorTextId   = "tutor-text";
  const shortcutsBtnId = "shortcuts-btn";

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Scoped styles                                                        */}
      {/* ------------------------------------------------------------------ */}
      <style>{`
        /* ---- Speaking pulse (respects reduced-motion) ---- */
        @media (prefers-reduced-motion: no-preference) {
          .speaking-pulse {
            animation: speaker-glow 1.4s ease-in-out infinite;
          }
          @keyframes speaker-glow {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.45; }
          }
          .wave-1 {
            animation: wave-fade 1.4s ease-in-out infinite;
          }
          .wave-2 {
            animation: wave-fade 1.4s ease-in-out infinite 0.35s;
          }
          @keyframes wave-fade {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.2; }
          }
        }

        /* ---- High-contrast state badges ---- */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 1.5px solid transparent;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .badge--speaking {
          background: #16a34a;
          color: #f0fdf4;
          border-color: #4ade80;
        }
        .badge--paused {
          background: #d97706;
          color: #fffbeb;
          border-color: #fcd34d;
        }
        .badge--muted {
          background: #374151;
          color: #d1d5db;
          border-color: #6b7280;
        }
        .badge--idle {
          background: #1e3a5f;
          color: #93c5fd;
          border-color: #2563eb;
        }

        /* ---- Caption strip ---- */
        .caption-strip {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: rgba(0,0,0,0.75);
          border: 1.5px solid rgba(255,255,255,0.18);
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 10px;
          backdrop-filter: blur(4px);
        }
        .caption-strip__label {
          flex-shrink: 0;
          background: #2563eb;
          color: #fff;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 2px 5px;
          border-radius: 4px;
          margin-top: 2px;
        }
        .caption-strip__text {
          color: #f9fafb;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
        }

        /* ---- Shortcut legend ---- */
        .shortcut-legend {
          background: rgba(15, 23, 42, 0.95);
          border: 1.5px solid rgba(99, 102, 241, 0.4);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 8px;
        }
        .shortcut-legend__title {
          color: #a5b4fc;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 0 0 8px 0;
        }
        .shortcut-legend__list {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .shortcut-legend__row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .shortcut-legend__row dt {
          display: flex;
          gap: 3px;
          min-width: 52px;
        }
        .shortcut-legend__row dd {
          color: #d1d5db;
          font-size: 0.78rem;
          margin: 0;
        }
        .shortcut-legend__kbd {
          display: inline-block;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 4px;
          padding: 1px 5px;
          font-family: ui-monospace, monospace;
          font-size: 0.72rem;
          color: #e2e8f0;
        }

        /* ---- Screen-reader notice ---- */
        .sr-notice {
          background: rgba(37, 99, 235, 0.15);
          border: 1.5px solid rgba(59, 130, 246, 0.4);
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 10px;
        }
        .sr-notice__text {
          color: #93c5fd;
          font-size: 0.78rem;
          line-height: 1.4;
          margin: 0 0 6px 0;
        }
        .sr-notice__btn {
          background: rgba(59, 130, 246, 0.25);
          border: 1px solid rgba(59, 130, 246, 0.5);
          border-radius: 6px;
          color: #bfdbfe;
          font-size: 0.72rem;
          padding: 4px 10px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .sr-notice__btn:hover { background: rgba(59, 130, 246, 0.4); }
        .sr-notice__btn:focus-visible {
          outline: 2px solid #60a5fa;
          outline-offset: 2px;
        }

        /* ---- Rate control ---- */
        .rate-control {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rate-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: #e2e8f0;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .rate-btn:hover { background: rgba(255,255,255,0.2); }
        .rate-btn:focus-visible {
          outline: 2px solid #60a5fa;
          outline-offset: 2px;
        }
        .rate-display {
          min-width: 48px;
          text-align: center;
          color: #93c5fd;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        /* ---- Toolbar buttons (shared base) ---- */
        .toolbar-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: #e2e8f0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          position: relative;
        }
        .toolbar-btn:hover  { background: rgba(255,255,255,0.2); }
        .toolbar-btn:focus-visible {
          outline: 2px solid #60a5fa;
          outline-offset: 2px;
        }
        .toolbar-btn--active {
          background: rgba(251, 191, 36, 0.2);
          color: #fcd34d;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }
        .toolbar-btn--muted {
          background: rgba(55, 65, 81, 0.5);
          color: #9ca3af;
          border: 1px solid rgba(107, 114, 128, 0.4);
        }

        /* ---- Visually hidden (screen-reader only) ---- */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* ---- Choice / continue buttons ---- */
        .choice-btn {
          padding: 10px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: #e8ecff;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }
        .choice-btn:hover  { background: rgba(255,255,255,0.2); }
        .choice-btn:focus-visible {
          outline: 2px solid #60a5fa;
          outline-offset: 2px;
        }

        .continue-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #3b82f6;
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          margin-bottom: 16px;
        }
        .continue-btn:hover  { background: #60a5fa; }
        .continue-btn:active { background: #1d4ed8; }
        .continue-btn:focus-visible {
          outline: 2px solid #60a5fa;
          outline-offset: 3px;
        }
      `}</style>

      {/* ------------------------------------------------------------------ */}
      {/* ARIA live region — invisible, mirrors every spoken utterance.        */}
      {/* Screen readers (VoiceOver, NVDA, JAWS) will announce this text      */}
      {/* when it changes, giving an equivalent experience to audio TTS.      */}
      {/* ------------------------------------------------------------------ */}
      <div
        id={liveRegionId}
        aria-live="polite"
        aria-atomic="true"
        aria-label="Tutor speech"
        className="sr-only"
      >
        {captionText}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Panel layout                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex flex-col h-full p-6 pt-20 max-w-[300px]"
        aria-label="Tutor panel"
      >
        {/* Task header */}
        {taskHeader && (
          <div
            className="bg-white/10 rounded-xl px-4 py-3 mb-6 flex items-center justify-between"
            aria-label={`Task: ${taskHeader}`}
          >
            <span className="text-sm text-blue-300">{taskHeader}</span>
            <span aria-hidden="true" className="text-xl">&#x1F44B;</span>
          </div>
        )}

        <div className="flex-1" />

        {/* Screen-reader notice */}
        {hasScreenReader && (
          <ScreenReaderNotice
            suppression={screenReaderSuppression}
            onOverride={() => setScreenReaderSuppression(!screenReaderSuppression)}
          />
        )}

        {/* Shortcut legend */}
        <ShortcutLegend visible={showShortcuts} />

        {/* Caption strip */}
        {showCaptions && <CaptionStrip text={captionText} />}

        {/* Tutor text */}
        <div className="mb-4" aria-labelledby={tutorTextId}>
          {/* Speech-state badge */}
          <div className="flex items-center gap-2 mb-2">
            <SpeechStateBadge state={speechState} hasScreenReader={hasScreenReader} />
          </div>

          <p
            id={tutorTextId}
            className="text-base leading-relaxed text-[#e8ecff]"
            aria-describedby={liveRegionId}
          >
            {step.tutorText}
          </p>
        </div>

        {/* Choices */}
        {showChoices && (
          <div
            role="group"
            aria-label="Answer choices"
            className="flex flex-wrap gap-2 mb-4"
          >
            {step.choices!.map((choice) => (
              <button
                key={choice.label}
                onClick={() => handleChoice(choice.next)}
                className="choice-btn"
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
            className="continue-btn"
          >
            <IconArrowDown />
          </button>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Bottom toolbar                                                     */}
        {/* ---------------------------------------------------------------- */}
        <div
          role="toolbar"
          aria-label="Speech controls"
          className="flex items-center gap-2 mt-auto flex-wrap"
        >
          {/* Mute / unmute */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute tutor voice (currently muted)" : "Mute tutor voice"}
            aria-pressed={isMuted}
            className={`toolbar-btn ${isMuted ? "toolbar-btn--muted" : ""}`}
          >
            {isMuted ? <IconSpeakerMuted /> : (
              <IconSpeakerOn pulsing={isSpeaking && !prefersReducedMotion} />
            )}
          </button>

          {/* Pause / resume (only meaningful when speaking or paused) */}
          <button
            onClick={isPaused ? resume : pause}
            aria-label={isPaused ? "Resume speech (keyboard: Space)" : "Pause speech (keyboard: Space)"}
            aria-disabled={!isSpeaking && !isPaused}
            className={`toolbar-btn ${isPaused ? "toolbar-btn--active" : ""}`}
          >
            {isPaused ? <IconPlay /> : <IconPause />}
          </button>

          {/* Stop */}
          <button
            onClick={stop}
            aria-label="Stop speech (keyboard: Escape)"
            aria-disabled={!isSpeaking && !isPaused}
            className="toolbar-btn"
          >
            <IconStop />
          </button>

          {/* Rate control */}
          <RateControl
            rate={rate}
            onIncrease={increaseRate}
            onDecrease={decreaseRate}
          />

          {/* Caption toggle */}
          <button
            onClick={() => setCaptions(!showCaptions)}
            aria-label={showCaptions ? "Hide captions" : "Show captions (subtitle mode)"}
            aria-pressed={showCaptions}
            className={`toolbar-btn ${showCaptions ? "toolbar-btn--active" : ""}`}
          >
            <IconCaptions />
          </button>

          {/* Keyboard shortcuts toggle */}
          <button
            id={shortcutsBtnId}
            onClick={() => setShowShortcuts((s) => !s)}
            aria-label={showShortcuts ? "Hide keyboard shortcuts" : "Show keyboard shortcuts"}
            aria-expanded={showShortcuts}
            aria-controls="shortcut-legend"
            className={`toolbar-btn ${showShortcuts ? "toolbar-btn--active" : ""}`}
          >
            <IconKeyboard />
            <IconChevronDown />
          </button>
        </div>
      </div>
    </>
  );
}
