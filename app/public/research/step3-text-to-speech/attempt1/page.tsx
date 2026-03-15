"use client";

import { useState, useCallback, useEffect } from "react";
import { lessonSteps, LessonStep } from "./lib/lessonData";
import { TutorPanel } from "./components/TutorPanel";
import { CookieWorkspace, CookiePiece } from "./components/CookieWorkspace";
import { useSpeech } from "./hooks/useSpeech";

function createCookies(count: number): CookiePiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `whole-${i}`,
    type: "whole" as const,
  }));
}

export default function Home() {
  const [stepId, setStepId] = useState("start");
  const [cookies, setCookies] = useState<CookiePiece[]>(createCookies(4));
  const [selectedCookie, setSelectedCookie] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(2);
  const [tool, setTool] = useState<"move" | "knife">("move");
  const [characterMoods, setCharacterMoods] = useState<("neutral" | "happy" | "sad")[]>(["neutral", "neutral"]);
  const [taskHeader, setTaskHeader] = useState<string | undefined>("Share 4 cookies.");

  // --- Text-to-speech hook (lives at top level so state is shared) ---
  const { speak, stop, isSpeaking, isMuted, toggleMute } = useSpeech();

  const step = lessonSteps[stepId];

  // Setup step state when step changes
  useEffect(() => {
    if (!step) return;

    if (step.taskHeader) {
      setTaskHeader(step.taskHeader);
    }

    if (step.type === "distribute" && step.cookieCount) {
      setCookies(createCookies(step.cookieCount));
      setSelectedCookie(null);
      setTool("move");
      if (step.characterCount) {
        setCharacterCount(step.characterCount);
        setCharacterMoods(Array(step.characterCount).fill("neutral"));
      }
    }

    if (step.type === "distribute-halves") {
      // Keep existing distributed cookies, only unassigned halves remain
      setSelectedCookie(null);
    }

    if (step.type === "slice") {
      setSelectedCookie(null);
    }
  }, [stepId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update character moods based on cookie distribution
  const updateMoods = useCallback((updatedCookies: CookiePiece[]) => {
    const counts = Array(characterCount).fill(0);
    updatedCookies.forEach((c) => {
      if (c.assignedTo !== undefined) {
        counts[c.assignedTo] += c.type === "whole" ? 1 : c.type === "quarter" ? 0.25 : 0.5;
      }
    });

    const maxCount = Math.max(...counts);
    const allAssigned = updatedCookies.every((c) => c.assignedTo !== undefined);
    const allEqual = counts.every((c) => c === counts[0]);

    setCharacterMoods(
      counts.map((c) => {
        if (allAssigned && allEqual) return "happy";
        if (c < maxCount && maxCount > 0) return "sad";
        if (c > 0) return "happy";
        return "neutral";
      })
    );
  }, [characterCount]);

  // Check if distribution is complete
  const checkDistributionComplete = useCallback(
    (updatedCookies: CookiePiece[]) => {
      if (!step) return;

      const unassigned = updatedCookies.filter((c) => c.assignedTo === undefined);

      if (step.type === "distribute" && step.expectedPerPerson !== undefined) {
        if (step.allowKnife) {
          // For knife-enabled steps, wait until ALL cookies are assigned equally
          if (unassigned.length === 0 && step.next) {
            const counts = Array(characterCount).fill(0);
            updatedCookies.forEach((c) => {
              if (c.assignedTo !== undefined) {
                counts[c.assignedTo] += c.type === "whole" ? 1 : c.type === "quarter" ? 0.25 : 0.5;
              }
            });
            const allEqual = counts.every((c) => c === counts[0]);
            if (allEqual) {
              setTimeout(() => setStepId(step.next!), 800);
            }
          }
        } else {
          // Check if each person has the expected amount of whole cookies
          const counts = Array(characterCount).fill(0);
          updatedCookies.forEach((c) => {
            if (c.assignedTo !== undefined && c.type === "whole") {
              counts[c.assignedTo]++;
            }
          });

          const allHaveExpected = counts.every((c) => c === step.expectedPerPerson);
          const remainingWholes = unassigned.filter((c) => c.type === "whole");

          if (allHaveExpected && step.next) {
            if (remainingWholes.length > 0 || unassigned.length === 0) {
              setTimeout(() => setStepId(step.next!), 800);
            }
          }
        }
      }

      if (step.type === "distribute-halves") {
        if (unassigned.length === 0 && step.next) {
          setTimeout(() => setStepId(step.next!), 800);
        }
      }
    },
    [step, characterCount]
  );

  const handleSelectCookie = useCallback((id: string) => {
    setSelectedCookie((prev) => (prev === id ? null : id));
  }, []);

  const handleAssignToCharacter = useCallback(
    (charIndex: number) => {
      if (!selectedCookie) return;

      setCookies((prev) => {
        const updated = prev.map((c) =>
          c.id === selectedCookie ? { ...c, assignedTo: charIndex } : c
        );
        updateMoods(updated);
        setTimeout(() => checkDistributionComplete(updated), 100);
        return updated;
      });
      setSelectedCookie(null);
    },
    [selectedCookie, updateMoods, checkDistributionComplete]
  );

  const handleSliceCookie = useCallback(
    (id: string) => {
      setCookies((prev) => {
        const cookie = prev.find((c) => c.id === id);
        if (!cookie || cookie.type !== "whole") return prev;

        // For the 5 / 4 scenario, slice into quarters
        if (step?.characterCount === 4) {
          const quarters: CookiePiece[] = Array.from({ length: 4 }, (_, i) => ({
            id: `${id}-q${i}`,
            type: "quarter" as const,
            assignedTo: cookie.assignedTo,
          }));
          return [...prev.filter((c) => c.id !== id), ...quarters];
        }

        // Default: slice in half
        const halves: CookiePiece[] = [
          { id: `${id}-left`, type: "half-left", assignedTo: cookie.assignedTo },
          { id: `${id}-right`, type: "half-right", assignedTo: cookie.assignedTo },
        ];
        return [...prev.filter((c) => c.id !== id), ...halves];
      });

      if (step?.type === "slice" && step.next) {
        setTimeout(() => setStepId(step.next!), 500);
      }
    },
    [step]
  );

  const handleChoice = useCallback((nextId: string) => {
    setStepId(nextId);
  }, []);

  const handleContinue = useCallback(() => {
    if (step?.next) {
      setStepId(step.next);
    }
  }, [step]);

  // Stop any remaining speech when the lesson ends (stepId goes beyond the
  // known steps). This is in a useEffect rather than inline in render to
  // avoid side-effects during the render phase.
  useEffect(() => {
    if (!lessonSteps[stepId]) {
      stop();
    }
  }, [stepId, stop]);

  if (!step) {
    return (
      <div className="h-screen w-screen starfield flex items-center justify-center bg-[#0f1729]">
        <div className="text-center">
          <div className="text-6xl mb-4">&#x1F389;</div>
          <h1 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h1>
          <p className="text-[#e8ecff] mb-6">You learned about fractions!</p>
          <button
            onClick={() => {
              setStepId("start");
              setCookies(createCookies(4));
              setCharacterCount(2);
              setCharacterMoods(["neutral", "neutral"]);
              setTaskHeader("Share 4 cookies.");
            }}
            className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-medium cursor-pointer"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen starfield flex bg-[#0f1729] overflow-hidden">
      {/* Pause button */}
      <button className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-20 cursor-pointer">
        &#x23F8;
      </button>

      {/* Left: Tutor panel */}
      <div className="w-[300px] flex-shrink-0 flex flex-col justify-end">
        <TutorPanel
          step={step}
          onChoice={handleChoice}
          onContinue={handleContinue}
          taskHeader={taskHeader}
          speak={speak}
          stop={stop}
          isSpeaking={isSpeaking}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      </div>

      {/* Right: Cookie workspace */}
      <div className="flex-1 flex">
        <CookieWorkspace
          step={step}
          cookies={cookies}
          characterCount={characterCount}
          selectedCookie={selectedCookie}
          onSelectCookie={handleSelectCookie}
          onAssignToCharacter={handleAssignToCharacter}
          onSliceCookie={handleSliceCookie}
          tool={tool}
          onToolChange={setTool}
          characterMoods={characterMoods}
        />
      </div>
    </div>
  );
}
