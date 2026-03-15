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
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-full">
            {unassigned.map((piece) => {
              // Responsive piece sizing: shrink when many pieces on narrow screens
              const baseSize = step.type === "slice" ? 200 : 180;
              const pieceSize = unassigned.length > 3 ? Math.min(baseSize, 120) : baseSize;
              return isInteractive ? (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece)}
                  className="cursor-pointer bg-transparent border-none p-0"
                >
                  <ObjectComponent
                    type={piece.type}
                    size={pieceSize}
                    selected={selectedPiece === piece.id}
                  />
                </button>
              ) : (
                <div key={piece.id} className="p-0">
                  <ObjectComponent
                    type={piece.type}
                    size={pieceSize}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Characters and their pieces */}
      <div className="w-full pb-6">
        {/* Shared grid for characters and their distributed pieces */}
        <div
          className="mx-auto max-w-full w-full gap-2 md:gap-4 lg:gap-6 px-2"
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
                size={characterCount > 2 ? 100 : 130}
              />
            </div>
          ))}
        </div>

        {/* Wood table */}
        <div className="w-full max-w-full mx-auto px-2 -mb-1">
          <svg viewBox="0 0 1000 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <defs>
              <linearGradient id="ws-tabletopGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8862A"/>
                <stop offset="30%" stopColor="#A0722A"/>
                <stop offset="70%" stopColor="#926520"/>
                <stop offset="100%" stopColor="#7A5518"/>
              </linearGradient>
              <linearGradient id="ws-edgeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A5518"/>
                <stop offset="100%" stopColor="#6B4A14"/>
              </linearGradient>
              <linearGradient id="ws-legGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7A5518"/>
                <stop offset="30%" stopColor="#8B6514"/>
                <stop offset="70%" stopColor="#8B6514"/>
                <stop offset="100%" stopColor="#6B4A14"/>
              </linearGradient>
              <filter id="ws-shadow" x="-2%" y="-10%" width="104%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.35"/>
              </filter>
              <pattern id="ws-grain" patternUnits="userSpaceOnUse" width="1000" height="24" patternTransform="rotate(0)">
                <line x1="0" y1="5" x2="1000" y2="5.5" stroke="#6B4A14" strokeWidth="0.6" opacity="0.25"/>
                <line x1="0" y1="10" x2="1000" y2="9.5" stroke="#6B4A14" strokeWidth="0.4" opacity="0.18"/>
                <line x1="0" y1="16" x2="1000" y2="16.8" stroke="#6B4A14" strokeWidth="0.7" opacity="0.2"/>
                <line x1="0" y1="21" x2="1000" y2="20.5" stroke="#6B4A14" strokeWidth="0.35" opacity="0.15"/>
                <ellipse cx="320" cy="12" rx="8" ry="4" fill="none" stroke="#6B4A14" strokeWidth="0.5" opacity="0.15"/>
                <ellipse cx="710" cy="14" rx="6" ry="3" fill="none" stroke="#6B4A14" strokeWidth="0.5" opacity="0.12"/>
              </pattern>
            </defs>
            {/* Shadow under tabletop */}
            <rect x="10" y="28" width="980" height="10" rx="2" fill="#000" opacity="0.2" filter="url(#ws-shadow)"/>
            {/* Left leg */}
            <path d="M 60,35 L 55,155 L 73,155 L 78,35 Z" fill="url(#ws-legGrad)"/>
            <path d="M 63,35 L 58,155 L 63,155 L 68,35 Z" fill="#A07228" opacity="0.3"/>
            {/* Right leg */}
            <path d="M 922,35 L 927,155 L 945,155 L 940,35 Z" fill="url(#ws-legGrad)"/>
            <path d="M 932,35 L 937,155 L 932,155 L 927,35 Z" fill="#A07228" opacity="0.3"/>
            {/* Tabletop front edge */}
            <rect x="5" y="26" width="990" height="10" rx="1" fill="url(#ws-edgeGrad)"/>
            {/* Tabletop surface */}
            <rect x="5" y="4" width="990" height="24" rx="3" fill="url(#ws-tabletopGrad)"/>
            {/* Wood grain overlay */}
            <rect x="5" y="4" width="990" height="24" rx="3" fill="url(#ws-grain)"/>
            {/* Top edge highlight */}
            <line x1="8" y1="5.5" x2="992" y2="5.5" stroke="#D4A84B" strokeWidth="0.8" opacity="0.3"/>
            {/* Border */}
            <rect x="5" y="4" width="990" height="24" rx="3" fill="none" stroke="#5C3D10" strokeWidth="0.8" opacity="0.2"/>
          </svg>
        </div>

        {/* Distributed pieces — same grid layout */}
        <div
          className="mx-auto max-w-full w-full gap-2 md:gap-4 lg:gap-6 px-2"
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
