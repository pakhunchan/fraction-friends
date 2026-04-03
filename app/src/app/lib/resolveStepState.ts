import type { LessonStep } from "./lessonData-storyB";
import type { ObjectPiece } from "../components/Workspace";

/**
 * Walk the happy path from "start" to `targetStepId`, accumulating workspace
 * state (pieces, characterCount, taskHeader) as if the player had played
 * through perfectly. This lets us jump to any mid-lesson step via URL param
 * and have the correct pieces/characters already in place.
 */
export function resolveStepState(
  steps: Record<string, LessonStep>,
  targetStepId: string
): { pieces: ObjectPiece[]; characterCount: number; taskHeader?: string } {
  let objectCount = 0;
  let characterCount = 0;
  let taskHeader: string | undefined;
  let pieces: ObjectPiece[] = [];
  // Track whether we've passed through a slice step and what it sliced to
  let slicedTo: "half" | "quarter" | null = null;

  // Walk the happy path: follow `next` pointers, and for choice steps follow
  // the `correct: true` option (or first option if none marked correct).
  let cursor = "start";
  const visited = new Set<string>();

  while (cursor && !visited.has(cursor)) {
    visited.add(cursor);
    const step = steps[cursor];
    if (!step) break;

    // --- Accumulate state from this step ---

    if (step.taskHeader) {
      taskHeader = step.taskHeader;
    }

    if (step.characterCount) {
      characterCount = step.characterCount;
    }

    if (step.objectCount) {
      objectCount = step.objectCount;
      // Fresh pieces — reset slice state since we got new objects
      pieces = Array.from({ length: objectCount }, (_, i) => ({
        id: `whole-${i}`,
        type: "whole" as const,
      }));
      slicedTo = null;
    }

    // Distribute step: mark whole pieces as assigned up to expectedPerPerson
    if (step.type === "distribute" && step.expectedPerPerson !== undefined) {
      const perPerson = step.expectedPerPerson;
      let assigned = 0;
      pieces = pieces.map((p) => {
        if (p.type === "whole" && p.assignedTo === undefined) {
          const charIndex = Math.floor(assigned / perPerson);
          if (charIndex < characterCount) {
            assigned++;
            return { ...p, assignedTo: charIndex };
          }
        }
        return p;
      });
    }

    // Slice step: transform unassigned wholes into halves (or halves into quarters)
    // Skip if this is the target step — the user hasn't interacted yet.
    if (step.type === "slice" && cursor !== targetStepId) {
      const target = step.sliceTo || "half";
      if (target === "quarter") {
        // First pass: wholes → halves
        let expanded: ObjectPiece[] = [];
        for (const p of pieces) {
          if (p.type === "whole" && p.assignedTo === undefined) {
            expanded.push(
              { id: `${p.id}-left`, type: "half-left", assignedTo: p.assignedTo },
              { id: `${p.id}-right`, type: "half-right", assignedTo: p.assignedTo },
            );
          } else {
            expanded.push(p);
          }
        }
        // Second pass: halves → quarters
        const final: ObjectPiece[] = [];
        for (const p of expanded) {
          if ((p.type === "half-left" || p.type === "half-right") && p.assignedTo === undefined) {
            final.push(
              { id: `${p.id}-q0`, type: "quarter", assignedTo: p.assignedTo },
              { id: `${p.id}-q1`, type: "quarter", assignedTo: p.assignedTo },
            );
          } else {
            final.push(p);
          }
        }
        pieces = final;
        slicedTo = "quarter";
      } else {
        // Wholes → halves only
        const expanded: ObjectPiece[] = [];
        for (const p of pieces) {
          if (p.type === "whole" && p.assignedTo === undefined) {
            expanded.push(
              { id: `${p.id}-left`, type: "half-left", assignedTo: p.assignedTo },
              { id: `${p.id}-right`, type: "half-right", assignedTo: p.assignedTo },
            );
          } else {
            expanded.push(p);
          }
        }
        pieces = expanded;
        slicedTo = "half";
      }
    }

    // Distribute-halves step: assign unassigned fractional pieces equally
    if (step.type === "distribute-halves") {
      let charIdx = 0;
      pieces = pieces.map((p) => {
        if (p.assignedTo === undefined && p.type !== "whole") {
          const result = { ...p, assignedTo: charIdx };
          charIdx = (charIdx + 1) % characterCount;
          return result;
        }
        return p;
      });
    }

    // --- Stop if we've reached the target ---
    if (cursor === targetStepId) break;

    // --- Advance to next step ---
    if (step.choices) {
      // Follow the correct choice, or first choice as fallback
      const correct = step.choices.find((c) => c.correct);
      cursor = (correct || step.choices[0]).next;
    } else if (step.next) {
      cursor = step.next;
    } else {
      break;
    }
  }

  return { pieces, characterCount, taskHeader };
}
