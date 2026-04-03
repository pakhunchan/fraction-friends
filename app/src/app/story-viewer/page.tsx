"use client";

import { useState, useMemo } from "react";
import { lessonSteps as lessonStepsBasic } from "../lib/lessonData-storyB";
import { lessonSteps as lessonStepsEquiv } from "../lib/lessonData-equiv";
import { lessonSteps as lessonStepsEquivV2 } from "../lib/lessonData-equiv-v2";
import type { LessonStep } from "../lib/lessonData-storyB";
import { buildHappyPath } from "../lib/buildHappyPath";
import { resolveStepState } from "../lib/resolveStepState";
import { Workspace, type ObjectPiece } from "../components/Workspace";
import { Brownie } from "../components/Brownie";
import type { ComponentType } from "react";
import type { ObjectComponentProps } from "../components/Workspace";

// ---------------------------------------------------------------------------
// Lesson configs
// ---------------------------------------------------------------------------

const LESSONS: Record<
  string,
  {
    label: string;
    steps: Record<string, LessonStep>;
    ObjectComponent?: ComponentType<ObjectComponentProps>;
  }
> = {
  basic: {
    label: "Basic Fractions",
    steps: lessonStepsBasic,
  },
  equivalence: {
    label: "Fraction Equivalence",
    steps: lessonStepsEquiv as Record<string, LessonStep>,
    ObjectComponent: Brownie,
  },
  "equivalence-v2": {
    label: "Fractional Equivalence V2",
    steps: lessonStepsEquivV2 as Record<string, LessonStep>,
    ObjectComponent: Brownie,
  },
};

// ---------------------------------------------------------------------------
// No-op handlers — Workspace is read-only in this view
// ---------------------------------------------------------------------------

const noop = () => {};
const noopStr = (_: string) => {};

// ---------------------------------------------------------------------------
// Step type → badge colour
// ---------------------------------------------------------------------------

const TYPE_COLORS: Record<string, string> = {
  narrate: "bg-blue-500/30 text-blue-300",
  choice: "bg-amber-500/30 text-amber-300",
  distribute: "bg-green-500/30 text-green-300",
  slice: "bg-red-500/30 text-red-300",
  "distribute-halves": "bg-emerald-500/30 text-emerald-300",
  "show-number": "bg-purple-500/30 text-purple-300",
  "show-fraction": "bg-violet-500/30 text-violet-300",
  cheer: "bg-pink-500/30 text-pink-300",
};

// ---------------------------------------------------------------------------
// WorkspacePreview — renders Workspace in a scaled-down container
// ---------------------------------------------------------------------------

function WorkspacePreview({
  step,
  pieces,
  characterCount,
  ObjectComponent,
}: {
  step: LessonStep;
  pieces: ObjectPiece[];
  characterCount: number;
  ObjectComponent?: ComponentType<ObjectComponentProps>;
}) {
  const moods = useMemo(
    () => Array(characterCount).fill("neutral") as ("neutral" | "happy" | "sad")[],
    [characterCount],
  );

  return (
    <div
      className="rounded-lg overflow-hidden flex-shrink-0 border border-white/10"
      style={{ width: 360, height: 225 }}
    >
      <div
        style={{
          width: 800,
          height: 500,
          transform: "scale(0.45)",
          transformOrigin: "top left",
          pointerEvents: "none",
        }}
      >
        <Workspace
          step={step}
          pieces={pieces}
          characterCount={characterCount}
          selectedPiece={null}
          onSelectPiece={noopStr}
          onAssignToCharacter={noop}
          onSlicePiece={noopStr}
          onUnassignPiece={noopStr}
          onResetAssignments={noop}
          tool="move"
          onToolChange={noop}
          characterMoods={moods}
          ObjectComponent={ObjectComponent}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StepCard — metadata panel + workspace preview
// ---------------------------------------------------------------------------

function StepCard({
  index,
  stepId,
  step,
  pieces,
  characterCount,
  ObjectComponent,
  allSteps,
}: {
  index: number;
  stepId: string;
  step: LessonStep;
  pieces: ObjectPiece[];
  characterCount: number;
  ObjectComponent?: ComponentType<ObjectComponentProps>;
  allSteps: Record<string, LessonStep>;
}) {
  const badgeClass = TYPE_COLORS[step.type] || "bg-gray-500/30 text-gray-300";

  return (
    <div
      className="flex gap-4 rounded-xl bg-white/5 p-4 border border-white/10"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 245px" }}
    >
      {/* Left — metadata */}
      <div className="flex-1 min-w-0 space-y-2 text-sm">
        {/* Step number + id */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/40 font-mono text-xs">#{index + 1}</span>
          <code className="text-white/60 text-xs bg-white/5 px-1.5 py-0.5 rounded">
            {stepId}
          </code>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>
            {step.type}
          </span>
        </div>

        {/* Task header */}
        {step.taskHeader && (
          <div className="text-yellow-300/80 text-xs font-semibold">
            {step.taskHeader}
          </div>
        )}

        {/* Tutor text + TTS text */}
        {step.tutorText && (
          step.ttsText?.trim() ? (
            <div className="space-y-1">
              <p className="text-white/80 leading-relaxed">
                <span className="text-white/40 font-medium text-xs mr-1.5">Display:</span>
                {step.tutorText}
              </p>
              <p className="text-cyan-300/70 leading-relaxed">
                <span className="text-cyan-400/50 font-medium text-xs mr-1.5">TTS:</span>
                {step.ttsText}
              </p>
            </div>
          ) : (
            <p className="text-white/80 leading-relaxed">{step.tutorText}</p>
          )
        )}

        {/* Choices */}
        {step.choices && (
          <div className="space-y-1 pt-1">
            {step.choices.map((c, i) => (
              <div key={i}>
                <div
                  className={`text-xs px-2 py-1 rounded ${
                    c.correct
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/10 text-red-300/60"
                  }`}
                >
                  {c.correct ? "✓" : "✗"} {c.label}{" "}
                  <span className="text-white/30">→ {c.next}</span>
                </div>
                {/* Show wrong-answer path steps inline */}
                {!c.correct && allSteps[c.next] && (() => {
                  const wrongSteps: LessonStep[] = [];
                  let cursor = c.next;
                  const visited = new Set<string>();
                  while (cursor && !visited.has(cursor) && allSteps[cursor]) {
                    visited.add(cursor);
                    const ws = allSteps[cursor];
                    wrongSteps.push(ws);
                    // Stop when it loops back to the parent question
                    if (ws.next === stepId) break;
                    cursor = ws.next!;
                  }
                  return (
                    <div className="ml-4 mt-1 mb-2 pl-3 border-l-2 border-red-500/20 space-y-1">
                      {wrongSteps.map((ws, j) => (
                        <div key={j} className="text-xs">
                          <span className="text-white/25 font-mono mr-1.5">{ws.id}</span>
                          <span className="text-red-200/50 leading-relaxed">
                            {ws.tutorText}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        )}

        {/* SFX */}
        {step.sfx && (
          <div className="text-white/30 text-xs">
            sfx: <span className="text-white/50">{step.sfx}</span>
          </div>
        )}

        {/* Cheer style */}
        {step.cheerStyle && (
          <div className="text-white/30 text-xs">
            cheer: <span className="text-pink-300/60">{step.cheerStyle}</span>
          </div>
        )}

        {/* Show number / fraction info */}
        {step.showNumber && (
          <div className="text-white/30 text-xs">
            showNumber: <span className="text-purple-300/60">{step.showNumber}</span>
          </div>
        )}
        {step.showFractionNum !== undefined && (
          <div className="text-white/30 text-xs">
            fraction:{" "}
            <span className="text-violet-300/60">
              {step.wholeNumber ? `${step.wholeNumber} ` : ""}
              {step.showFractionNum}/{step.showFractionDen}
            </span>
          </div>
        )}
      </div>

      {/* Right — workspace preview */}
      <WorkspacePreview
        step={step}
        pieces={pieces}
        characterCount={characterCount}
        ObjectComponent={ObjectComponent}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function StoryViewerPage() {
  const [activeLesson, setActiveLesson] = useState("basic");
  const lesson = LESSONS[activeLesson];

  const happyPath = useMemo(
    () => buildHappyPath(lesson.steps),
    [lesson.steps],
  );

  const stepStates = useMemo(
    () =>
      happyPath.map((id) => ({
        id,
        step: lesson.steps[id],
        ...resolveStepState(lesson.steps, id),
      })),
    [happyPath, lesson.steps],
  );

  return (
    <div className="min-h-screen bg-[#0f1729] text-white">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-[#0f1729]/95 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center gap-4">
        <h1 className="text-lg font-semibold tracking-tight mr-4">
          Story Viewer
        </h1>
        <div className="flex gap-1">
          {Object.entries(LESSONS).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setActiveLesson(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeLesson === key
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-white/30 text-xs">
          {stepStates.length} steps
        </span>
      </header>

      {/* Step list */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {stepStates.map((s, i) => (
          <StepCard
            key={s.id}
            index={i}
            stepId={s.id}
            step={s.step}
            pieces={s.pieces}
            characterCount={s.characterCount}
            ObjectComponent={lesson.ObjectComponent}
            allSteps={lesson.steps}
          />
        ))}
      </main>
    </div>
  );
}
