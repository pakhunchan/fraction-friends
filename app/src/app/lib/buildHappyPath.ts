import type { LessonStep, Choice } from "./lessonData-storyB";

/**
 * Walk the lesson step graph from "start", following `next` pointers and
 * correct choices. Returns an ordered array of step IDs (the "happy path").
 */
export function buildHappyPath(
  steps: Record<string, LessonStep>,
): string[] {
  const path: string[] = [];
  let cursor: string | undefined = "start";
  const visited = new Set<string>();

  while (cursor && !visited.has(cursor)) {
    visited.add(cursor);
    const step: LessonStep | undefined = steps[cursor];
    if (!step) break;
    path.push(cursor);

    if (step.choices) {
      const choices: Choice[] = step.choices;
      const match: Choice | undefined = choices.find((c) => c.correct);
      cursor = match ? match.next : choices[0]?.next;
    } else {
      cursor = step.next;
    }
  }

  return path;
}
