"use client";

import { ComponentType } from "react";
import { DividableObject } from "./DividableObject";
import { Character } from "./Character";
import { BigFraction } from "./Fraction";
import { LessonStep } from "../lib/lessonData-storyB";

export type ObjectPieceType = "whole" | "half-left" | "half-right" | "quarter" | "eighth";

export type ObjectPiece = {
  id: string;
  type: ObjectPieceType;
  assignedTo?: number; // character index
};

export interface ObjectComponentProps {
  type: ObjectPieceType;
  size?: number;
  selected?: boolean;
}

interface WorkspaceProps {
  step: LessonStep;
  pieces: ObjectPiece[];
  characterCount: number;
  selectedPiece: string | null;
  onSelectPiece: (id: string) => void;
  onAssignToCharacter: (charIndex: number) => void;
  onSlicePiece: (id: string) => void;
  onUnassignPiece: (id: string) => void;
  onResetAssignments: () => void;
  tool: "move" | "knife";
  onToolChange: (tool: "move" | "knife") => void;
  characterMoods: ("neutral" | "happy" | "sad")[];
  ObjectComponent?: ComponentType<ObjectComponentProps>;
}

export function Workspace({
  step,
  pieces,
  characterCount,
  selectedPiece,
  onSelectPiece,
  onAssignToCharacter,
  onSlicePiece,
  onUnassignPiece,
  onResetAssignments,
  tool,
  onToolChange,
  characterMoods,
  ObjectComponent = DividableObject,
}: WorkspaceProps) {
  const unassigned = pieces.filter((c) => c.assignedTo === undefined);
  const characters = Array.from({ length: characterCount }, (_, i) => i);

  // Check if this is a "show" step (big number/fraction)
  const isShowStep = step.type === "show-number" || step.type === "show-fraction";

  // Check if this is a distribute step (for showing the reset button)
  const isDistributeStep = step.type === "distribute" || step.type === "distribute-halves";

  // Bars are only interactive during distribute, distribute-halves, and slice steps
  const isInteractive = isDistributeStep || step.type === "slice";
  const hasAnyAssigned = pieces.some((c) => c.assignedTo !== undefined);

  // Get pieces assigned to each character
  const getCharacterPieces = (charIndex: number) =>
    pieces.filter((c) => c.assignedTo === charIndex);

  // Handle clicking on a piece in the workspace
  const handlePieceClick = (piece: ObjectPiece) => {
    if (step.type === "slice") {
      // During slice steps, pieces can be sliced up to the target tier.
      // sliceTo controls the maximum: "half" means only whole→halves,
      // "quarter" means whole→halves and halves→quarters, etc.
      const sliceTo = step.sliceTo;
      const canSlice =
        piece.type === "quarter" ? false :
        (piece.type === "half-left" || piece.type === "half-right") ? sliceTo !== "half" :
        piece.type === "whole" ? true :
        false;
      if (canSlice) {
        onSlicePiece(piece.id);
        return;
      }
    }
    if (tool === "knife" && piece.type === "whole") {
      onSlicePiece(piece.id);
      return;
    }
    onSelectPiece(piece.id);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between h-full py-8 px-4 relative bg-[#1e2d4a] rounded-l-2xl">
      {/* Tool switcher */}
      {step.allowKnife && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex bg-[#1a2540] rounded-full p-1 gap-1 z-10">
          <button
            onClick={() => onToolChange("move")}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors cursor-pointer ${
              tool === "move" ? "bg-orange-500" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            ✥
          </button>
          <button
            onClick={() => onToolChange("knife")}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors cursor-pointer ${
              tool === "knife" ? "bg-orange-500" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            🔪
          </button>
        </div>
      )}

      {/* Big number/fraction display */}
      {isShowStep && (
        <div className="flex-1 flex items-center justify-center">
          {step.type === "show-number" && step.showNumber && (
            <div className="number-appear text-[10rem] font-bold text-white leading-none">
              {step.showNumber}
            </div>
          )}
          {step.type === "show-fraction" && step.showFractionNum !== undefined && step.showFractionDen !== undefined && (
            <BigFraction
              whole={step.wholeNumber}
              num={step.showFractionNum}
              den={step.showFractionDen}
            />
          )}
        </div>
      )}

      {/* Unassigned pieces area */}
      {!isShowStep && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-4 max-w-[700px]">
            {unassigned.map((piece) =>
              isInteractive ? (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece)}
                  className="cursor-pointer bg-transparent border-none p-0"
                >
                  <ObjectComponent
                    type={piece.type}
                    size={step.type === "slice" ? 200 : 180}
                    selected={selectedPiece === piece.id}
                  />
                </button>
              ) : (
                <div key={piece.id} className="p-0">
                  <ObjectComponent
                    type={piece.type}
                    size={180}
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Characters and their pieces */}
      <div className="w-full pb-6">
        {/* Shared grid for characters and their distributed pieces */}
        <div
          className="mx-auto max-w-[900px] w-full gap-4 md:gap-6 px-2"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${characterCount}, 1fr)`,
          }}
        >
          {/* Shelf row — characters */}
          {characters.map((i) => (
            <div key={i} className="flex items-end justify-center mb-2">
              <Character
                id={i}
                mood={characterMoods[i] || "neutral"}
                onClick={selectedPiece ? () => onAssignToCharacter(i) : undefined}
                highlighted={selectedPiece !== null}
                size={characterCount > 2 ? 120 : 150}
              />
            </div>
          ))}
        </div>

        {/* Shelf bar */}
        <div className="w-full max-w-[900px] mx-auto h-3 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full mb-3" />

        {/* Distributed pieces — same grid layout */}
        <div
          className="mx-auto max-w-[900px] w-full gap-4 md:gap-6 px-2"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${characterCount}, 1fr)`,
          }}
        >
          {characters.map((i) => {
            const charPieces = getCharacterPieces(i);
            return (
              <div
                key={i}
                className="flex flex-wrap items-center justify-center gap-1 min-h-[50px]"
              >
                {charPieces.map((c) =>
                  isInteractive ? (
                    <button
                      key={c.id}
                      onClick={() => onUnassignPiece(c.id)}
                      className="cursor-pointer bg-transparent border-none p-0"
                    >
                      <ObjectComponent
                        type={c.type}
                        size={96}
                      />
                    </button>
                  ) : (
                    <div key={c.id} className="p-0">
                      <ObjectComponent
                        type={c.type}
                        size={96}
                      />
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* Reset button — only during distribute steps */}
        {isDistributeStep && hasAnyAssigned && (
          <div className="flex justify-center mt-2">
            <button
              onClick={onResetAssignments}
              className="px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
