"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { lessonSteps, LessonStep } from "../lib/lessonData-equiv";
import { useElevenLabsSpeech } from "../lib/useElevenLabsSpeech";
import { useSoundEffects } from "../lib/useSoundEffects";
import { useBackgroundMusic } from "../lib/useBackgroundMusic";
import { TutorPanel } from "../components/TutorPanel";
import { Workspace, ObjectPiece } from "../components/Workspace";
import { Brownie } from "../components/Brownie";
import { ReportIssue } from "../components/ReportIssue";

const CORRECT_SOUNDS = [
  "boing", "ding", "fanfare", "music-box", "harp-gliss",
  "magic-sparkle", "chest-open", "quest-horn", "victory-fanfare",
] as const;

function randomCorrectSound() {
  return CORRECT_SOUNDS[Math.floor(Math.random() * CORRECT_SOUNDS.length)];
}

function createPieces(count: number): ObjectPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `whole-${i}`,
    type: "whole" as const,
  }));
}

export default function Home() {
  const [stepId, setStepId] = useState("start");
  const [pieces, setPieces] = useState<ObjectPiece[]>(createPieces(0));
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(2);
  const [tool, setTool] = useState<"move" | "knife">("move");
  const [characterMoods, setCharacterMoods] = useState<("neutral" | "happy" | "sad")[]>(["neutral", "neutral"]);
  const [taskHeader, setTaskHeader] = useState<string | undefined>(undefined);
  const [hasInteracted, setHasInteracted] = useState(false);

  const step = lessonSteps[stepId];

  // Keep a ref to the current step so async callbacks always read the latest
  const stepRef = useRef(step);
  stepRef.current = step;

  // ---- Hooks ----
  const tts = useElevenLabsSpeech();
  const sfx = useSoundEffects();
  const music = useBackgroundMusic();

  // Wire up ducking: when SFX plays, duck the background music
  const musicDuckRef = useRef(music.duck);
  musicDuckRef.current = music.duck;

  useEffect(() => {
    sfx.onSfxPlay((durationSec) => {
      musicDuckRef.current(durationSec);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Handle first user interaction (for autoplay policy) ----
  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      // NOTE: Background music is NOT auto-started here. Players found
      // the immediate synth arpeggio startling. Music can be toggled on
      // via the mute/unmute button in the tutor panel instead.
      // Speak the current step's text now — the TTS effect may not
      // re-trigger because the stepId hasn't changed since mount.
      const currentStep = lessonSteps[stepId];
      if (currentStep?.tutorText) {
        prevStepIdRef.current = stepId;
        tts.speak(currentStep.tutorText);
      }
    }
  }, [hasInteracted, stepId, tts]);

  // ---- Speak tutor text and play SFX when step changes ----
  const prevStepIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!step) return;
    if (!hasInteracted) return; // Wait for first user interaction (autoplay policy)
    if (prevStepIdRef.current === stepId) return;
    prevStepIdRef.current = stepId;

    // Speak the tutor text
    if (step.tutorText) {
      tts.speak(step.tutorText);
    }

    // Play step SFX
    if (step.sfx) {
      sfx.play(step.sfx);
    }
  }, [stepId, step, hasInteracted]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Auto-advance narrate/show steps (no tasks, no choices) ----
  const autoAdvanceTypes = ["narrate", "show-number", "show-fraction"];
  const shouldAutoAdvance =
    step &&
    hasInteracted &&
    autoAdvanceTypes.includes(step.type) &&
    step.next &&
    !step.choices;

  useEffect(() => {
    if (!shouldAutoAdvance || !step?.next) return;

    // If TTS is still speaking, wait for it to finish
    if (tts.isSpeaking) return;

    // TTS finished (or was muted/never started) — wait 2s then advance
    const timer = setTimeout(() => {
      tts.stop();
      setStepId(step.next!);
    }, 2000);

    return () => clearTimeout(timer);
  }, [shouldAutoAdvance, tts.isSpeaking, step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Prefetch-ahead: pre-download TTS for upcoming steps ----
  useEffect(() => {
    if (!step) return;

    const textsToPrefetch: string[] = [];

    // Follow the `next` chain up to 3 steps ahead
    let cursor: string | undefined = step.next;
    for (let i = 0; i < 3 && cursor; i++) {
      const nextStep = lessonSteps[cursor];
      if (nextStep?.tutorText) {
        textsToPrefetch.push(nextStep.tutorText);
      }
      cursor = nextStep?.next;
    }

    // Prefetch all choice targets' tutor text
    if (step.choices) {
      for (const choice of step.choices) {
        const targetStep = lessonSteps[choice.next];
        if (targetStep?.tutorText) {
          textsToPrefetch.push(targetStep.tutorText);
        }
      }
    }

    // Fire off prefetch requests (duplicates are handled by the hook)
    for (const text of textsToPrefetch) {
      tts.prefetch(text);
    }
  }, [stepId, step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Setup step state when step changes
  useEffect(() => {
    if (!step) return;

    if (step.taskHeader) {
      setTaskHeader(step.taskHeader);
    }

    // Pick up characterCount from ANY step type that sets it
    if (step.characterCount) {
      setCharacterCount(step.characterCount);
      setCharacterMoods(Array(step.characterCount).fill("neutral"));
    }

    if (step.type === "distribute" && step.objectCount) {
      setPieces(createPieces(step.objectCount));
      setSelectedPiece(null);
      setTool("move");
    } else if (step.type !== "distribute" && step.objectCount) {
      // Non-distribute steps can specify objectCount to update the display
      setPieces(createPieces(step.objectCount));
    }

    if (step.type === "distribute-halves") {
      setSelectedPiece(null);
    }

    if (step.type === "slice") {
      setSelectedPiece(null);
    }
  }, [stepId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reactive fallback: auto-advance distribute steps when all pieces are assigned.
  // This catches cases where the callback-based check in handleAssignToCharacter
  // didn't fire (e.g., timing issues, stale closures).
  useEffect(() => {
    if (!step) return;
    if (step.type !== "distribute" && step.type !== "distribute-halves") return;
    if (!step.next) return;

    const unassigned = pieces.filter((c) => c.assignedTo === undefined);
    if (unassigned.length > 0) return;

    if (step.type === "distribute-halves") {
      // Only advance if distribution is equal: just wait if wrong
      const counts = Array(characterCount).fill(0);
      pieces.forEach((c) => {
        if (c.assignedTo !== undefined) {
          counts[c.assignedTo] += c.type === "whole" ? 1 : c.type === "quarter" ? 0.25 : 0.5;
        }
      });
      const allEqual = counts.every((c) => c === counts[0]);
      if (!allEqual) return; // wrong distribution — just wait, character moods show feedback
      sfx.play(randomCorrectSound());
      const timer = setTimeout(() => setStepId(step.next!), 800);
      return () => clearTimeout(timer);
    }

    if (step.type === "distribute" && step.expectedPerPerson !== undefined) {
      const counts = Array(characterCount).fill(0);
      pieces.forEach((c) => {
        if (c.assignedTo !== undefined) {
          if (step.allowKnife) {
            counts[c.assignedTo] += c.type === "whole" ? 1 : c.type === "quarter" ? 0.25 : 0.5;
          } else if (c.type === "whole") {
            counts[c.assignedTo]++;
          }
        }
      });

      if (step.allowKnife) {
        // Knife steps: all pieces must be assigned AND equal
        if (unassigned.length === 0) {
          const allEqual = counts.every((c) => c === counts[0]);
          if (allEqual) {
            sfx.play(randomCorrectSound());
            const timer = setTimeout(() => setStepId(step.next!), 800);
            return () => clearTimeout(timer);
          }
        }
      } else {
        // Non-knife: advance when each person has expected count
        // (there may be leftover pieces, e.g., 5÷2 leaves 1)
        const allHaveExpected = counts.every((c) => c === step.expectedPerPerson);
        if (allHaveExpected) {
          sfx.play(randomCorrectSound());
          const timer = setTimeout(() => setStepId(step.next!), 800);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [pieces, step, characterCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update character moods based on piece distribution
  const updateMoods = useCallback((updatedPieces: ObjectPiece[]) => {
    const counts = Array(characterCount).fill(0);
    updatedPieces.forEach((c) => {
      if (c.assignedTo !== undefined) {
        counts[c.assignedTo] += c.type === "whole" ? 1 : c.type === "quarter" ? 0.25 : 0.5;
      }
    });

    const maxCount = Math.max(...counts);
    const allAssigned = updatedPieces.every((c) => c.assignedTo !== undefined);
    const allEqual = counts.every((c) => c === counts[0]);

    const hasAnyAssigned = updatedPieces.some((c) => c.assignedTo !== undefined);
    setCharacterMoods(
      counts.map((c) => {
        if (allAssigned && allEqual) return "happy";
        if (c < maxCount && maxCount > 0) return "sad";
        if (c === 0 && hasAnyAssigned) return "sad"; // no pieces yet while others have some
        if (c > 0) return "happy";
        return "neutral";
      })
    );
  }, [characterCount]);

  // Check if distribution is complete
  // Uses stepRef so the callback always reads the *current* step,
  // avoiding stale-closure issues when called from a setTimeout.
  const checkDistributionComplete = useCallback(
    (updatedPieces: ObjectPiece[]) => {
      const currentStep = stepRef.current;
      if (!currentStep) return;

      const unassigned = updatedPieces.filter((c) => c.assignedTo === undefined);

      if (currentStep.type === "distribute" && currentStep.expectedPerPerson !== undefined) {
        if (currentStep.allowKnife) {
          if (unassigned.length === 0 && currentStep.next) {
            const counts = Array(characterCount).fill(0);
            updatedPieces.forEach((c) => {
              if (c.assignedTo !== undefined) {
                counts[c.assignedTo] += c.type === "whole" ? 1 : c.type === "quarter" ? 0.25 : 0.5;
              }
            });
            const allEqual = counts.every((c) => c === counts[0]);
            if (allEqual) {
              sfx.play(randomCorrectSound());
              setTimeout(() => setStepId(currentStep.next!), 800);
            }
          }
        } else {
          const counts = Array(characterCount).fill(0);
          updatedPieces.forEach((c) => {
            if (c.assignedTo !== undefined && c.type === "whole") {
              counts[c.assignedTo]++;
            }
          });

          const allHaveExpected = counts.every((c) => c === currentStep.expectedPerPerson);
          const remainingWholes = unassigned.filter((c) => c.type === "whole");

          if (allHaveExpected && currentStep.next) {
            if (remainingWholes.length > 0 || unassigned.length === 0) {
              sfx.play(randomCorrectSound());
              setTimeout(() => setStepId(currentStep.next!), 800);
            }
          }
        }
      }

      if (currentStep.type === "distribute-halves") {
        if (unassigned.length === 0 && currentStep.next) {
          // Only advance if distribution is equal
          const counts = Array(characterCount).fill(0);
          updatedPieces.forEach((c) => {
            if (c.assignedTo !== undefined) {
              counts[c.assignedTo] += c.type === "whole" ? 1 : c.type === "quarter" ? 0.25 : 0.5;
            }
          });
          const allEqual = counts.every((c) => c === counts[0]);
          if (allEqual) {
            sfx.play(randomCorrectSound());
            setTimeout(() => setStepId(currentStep.next!), 800);
          }
          // If not equal, just wait — character moods show the feedback
        }
      }
    },
    [characterCount, sfx]
  );

  const handleSelectPiece = useCallback((id: string) => {
    setSelectedPiece((prev) => (prev === id ? null : id));
  }, []);

  const handleUnassignPiece = useCallback(
    (id: string) => {
      let updatedPieces: ObjectPiece[] | null = null;
      setPieces((prev) => {
        const updated = prev.map((c) =>
          c.id === id ? { ...c, assignedTo: undefined } : c
        );
        updatedPieces = updated;
        return updated;
      });
      if (updatedPieces) updateMoods(updatedPieces);
      setSelectedPiece(null);
    },
    [updateMoods]
  );

  const handleResetAssignments = useCallback(() => {
    let updatedPieces: ObjectPiece[] | null = null;
    setPieces((prev) => {
      const updated = prev.map((c) => ({ ...c, assignedTo: undefined }));
      updatedPieces = updated;
      return updated;
    });
    if (updatedPieces) updateMoods(updatedPieces);
    setSelectedPiece(null);
  }, [updateMoods]);

  const handleAssignToCharacter = useCallback(
    (charIndex: number) => {
      if (!selectedPiece) return;

      // Play soft bell on piece assignment
      sfx.play("soft-bell");

      let updatedPieces: ObjectPiece[] | null = null;
      setPieces((prev) => {
        const updated = prev.map((c) =>
          c.id === selectedPiece ? { ...c, assignedTo: charIndex } : c
        );
        updatedPieces = updated;
        return updated;
      });

      // Side effects outside the state updater to avoid issues with
      // React strict-mode double-invocation and stale closures.
      // Use a microtask so the state has been committed by React.
      setTimeout(() => {
        if (updatedPieces) {
          updateMoods(updatedPieces);
          checkDistributionComplete(updatedPieces);
        }
      }, 100);
      setSelectedPiece(null);
    },
    [selectedPiece, updateMoods, checkDistributionComplete, sfx]
  );

  const handleSlicePiece = useCallback(
    (id: string) => {
      setPieces((prev) => {
        const piece = prev.find((c) => c.id === id);
        if (!piece) return prev;

        // Slice a whole into halves
        if (piece.type === "whole") {
          const halves: ObjectPiece[] = [
            { id: `${id}-left`, type: "half-left", assignedTo: piece.assignedTo },
            { id: `${id}-right`, type: "half-right", assignedTo: piece.assignedTo },
          ];
          return [...prev.filter((c) => c.id !== id), ...halves];
        }

        // Slice a half into quarters
        if (piece.type === "half-left" || piece.type === "half-right") {
          const quarters: ObjectPiece[] = [
            { id: `${id}-q0`, type: "quarter" as const, assignedTo: piece.assignedTo },
            { id: `${id}-q1`, type: "quarter" as const, assignedTo: piece.assignedTo },
          ];
          return [...prev.filter((c) => c.id !== id), ...quarters];
        }

        // Quarters are the smallest piece — no further slicing
        return prev;
      });

      // Play slice SFX
      sfx.play("gentle-whoosh");
    },
    [sfx]
  );

  // Track piece types at the start of each slice step so we know when slicing is "done"
  const sliceStartTypesRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (step?.type === "slice") {
      sliceStartTypesRef.current = new Set(pieces.map((p) => p.type));
    }
  }, [stepId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance slice steps: when all pieces have been sliced to the same
  // "tier" (e.g., all halves, all quarters) and that tier differs
  // from the starting tier, slicing is complete.
  useEffect(() => {
    if (!step || step.type !== "slice" || !step.next) return;
    if (pieces.length === 0) return;

    // Normalize piece types into tiers for comparison
    // (half-left and half-right are both "half" tier)
    const tierOf = (t: string) => {
      if (t === "half-left" || t === "half-right") return "half";
      return t; // "whole", "quarter"
    };

    const currentTiers = new Set(pieces.map((p) => tierOf(p.type)));
    // Still in the middle of slicing — pieces are at mixed tiers
    if (currentTiers.size > 1) return;

    // All pieces are at the same tier — check if it differs from start
    const startTiers = new Set(
      [...sliceStartTypesRef.current].map(tierOf)
    );
    const currentTier = [...currentTiers][0];
    if (startTiers.has(currentTier) && startTiers.size === 1) {
      // Same tier as starting — haven't sliced anything yet
      return;
    }

    // All pieces are uniformly at a new tier — slicing is done, advance
    const timer = setTimeout(() => setStepId(step.next!), 500);
    return () => clearTimeout(timer);
  }, [pieces, step]);

  const handleChoice = useCallback((nextId: string) => {
    handleFirstInteraction();

    // Determine if this is a correct or wrong choice
    const currentStep = lessonSteps[stepId];
    if (currentStep?.choices) {
      const chosen = currentStep.choices.find((c) => c.next === nextId);
      if (chosen?.correct) {
        sfx.play(randomCorrectSound());
      } else if (chosen && !chosen.correct && chosen.correct !== undefined) {
        sfx.play("wrong");
      }
    }

    // Stop current TTS before advancing
    tts.stop();
    setStepId(nextId);
  }, [stepId, sfx, tts, handleFirstInteraction]);

  const handleContinue = useCallback(() => {
    handleFirstInteraction();

    if (step?.next) {
      // Stop current TTS before advancing
      tts.stop();
      setStepId(step.next);
    }
  }, [step, tts, handleFirstInteraction]);

  if (!step) {
    return (
      <div
        className="h-screen w-screen starfield flex items-center justify-center bg-[#0f1729]"
        onClick={handleFirstInteraction}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h1>
          <p className="text-[#e8ecff] mb-6">You learned about fractions!</p>
          <button
            onClick={() => {
              setStepId("start");
              setPieces(createPieces(4));
              setCharacterCount(2);
              setCharacterMoods(["neutral", "neutral"]);
              setTaskHeader(undefined);
            }}
            className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-medium cursor-pointer"
          >
            Play Again
          </button>
        </div>
        <ReportIssue stepId={stepId} />
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen starfield flex bg-[#0f1729] overflow-hidden"
      onClick={handleFirstInteraction}
    >
      {/* Tap-to-begin overlay */}
      {!hasInteracted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0f1729]/80 backdrop-blur-sm cursor-pointer">
          <div className="text-center animate-pulse">
            <div className="text-5xl mb-4">🌙</div>
            <p className="text-xl text-white/90 font-medium">Tap to begin</p>
          </div>
        </div>
      )}

      {/* Pause button */}
      <button className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-20 cursor-pointer">
        ⏸
      </button>

      {/* Left: Tutor panel */}
      <div className="w-[360px] flex-shrink-0 flex flex-col justify-start">
        <TutorPanel
          step={step}
          onChoice={handleChoice}
          onContinue={handleContinue}
          taskHeader={taskHeader}
          isTtsSpeaking={tts.isSpeaking}
          isTtsMuted={tts.isMuted}
          onToggleTtsMute={tts.toggleMute}
          isMusicMuted={music.isMuted}
          onToggleMusicMute={music.toggleMute}
          isSfxMuted={sfx.isMuted}
          onToggleSfxMute={sfx.toggleMute}
        />
      </div>

      {/* Right: Workspace */}
      <div className="flex-1 flex">
        <Workspace
          step={step}
          pieces={pieces}
          characterCount={characterCount}
          selectedPiece={selectedPiece}
          onSelectPiece={handleSelectPiece}
          onAssignToCharacter={handleAssignToCharacter}
          onSlicePiece={handleSlicePiece}
          onUnassignPiece={handleUnassignPiece}
          onResetAssignments={handleResetAssignments}
          tool={tool}
          onToolChange={setTool}
          characterMoods={characterMoods}
          ObjectComponent={Brownie}
        />
      </div>

      <ReportIssue stepId={stepId} />
    </div>
  );
}
