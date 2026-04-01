"use client";

import { ComponentType, useState, useRef } from "react";
import { DividableObject } from "./DividableObject";
import { Character } from "./Character";
import { BigFraction } from "./Fraction";
import { LessonStep } from "../lib/lessonData-storyB";

// ---------------------------------------------------------------------------
// Cheer screens — motivational displays between quiz questions
// ---------------------------------------------------------------------------

function CheerScreen({ style }: { style?: string }) {
  switch (style) {
    case "sparkle-rally":
      return (
        <>
          <style>{`
            @keyframes glow-pulse { 0%, 100% { text-shadow: 0 0 20px #fbbf24, 0 0 40px #f59e0b; } 50% { text-shadow: 0 0 30px #fbbf24, 0 0 60px #f59e0b, 0 0 90px #d97706; } }
            @keyframes monster-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
          `}</style>
          <div className="flex flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center" style={{ animation: "glow-pulse 2s ease-in-out infinite" }}>
              You&apos;ve Got This!
            </h1>
            <div className="flex items-end gap-4 flex-wrap justify-center">
              {[0, 1, 2, 3].map((id) => (
                <div key={id} style={{ animation: `monster-bounce 1.2s ${id * 0.15}s ease-in-out infinite` }}>
                  <Character id={id} mood="happy" size={100} />
                </div>
              ))}
            </div>
            <p className="text-lg text-white/80 text-center">Time for the quiz — show us what you learned!</p>
          </div>
        </>
      );

    case "gentle-encouragement":
      return (
        <div className="flex flex-col items-center justify-center gap-10 p-4">
          <div className="text-3xl md:text-4xl font-bold text-center" style={{ color: "#f5e6b8" }}>Ready for a Fun Quiz?</div>
          <div className="flex items-end gap-5 flex-wrap justify-center">
            {[0, 1, 2, 3].map((id) => <Character key={id} id={id} mood="happy" size={100} />)}
          </div>
          <div className="text-lg text-[#a8b8d0] text-center">Don&apos;t worry — your friends are cheering for you!</div>
        </div>
      );

    case "cheerleader-squad":
      return (
        <>
          <style>{`@keyframes cheerWave { 0% { transform: translateY(0); } 100% { transform: translateY(-8px) rotate(3deg); } }`}</style>
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <div className="text-center">
              <span className="text-2xl font-bold" style={{ color: "#ffd93d" }}>Go, </span>
              <span className="text-3xl font-extrabold" style={{ color: "#ff9f43" }}>Go, </span>
              <span className="text-5xl font-black" style={{ color: "#ff6b9d", textShadow: "0 0 18px rgba(255,107,157,0.6)" }}>GO!</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex justify-center gap-14 -mb-1">
                <div style={{ animation: "cheerWave 0.8s ease-in-out infinite alternate" }}><Character id={1} mood="happy" size={100} /></div>
                <div style={{ animation: "cheerWave 0.8s 0.4s ease-in-out infinite alternate" }}><Character id={3} mood="happy" size={100} /></div>
              </div>
              <div className="flex justify-center gap-4">
                <div style={{ animation: "cheerWave 0.8s 0.2s ease-in-out infinite alternate" }}><Character id={0} mood="happy" size={75} /></div>
                <div style={{ animation: "cheerWave 0.8s 0.6s ease-in-out infinite alternate" }}><Character id={2} mood="happy" size={75} /></div>
              </div>
            </div>
            <div className="text-lg font-semibold text-[#c8dafa] text-center">Your monster friends believe in you!</div>
          </div>
        </>
      );

    case "trophy-room":
      return (
        <>
          <style>{`@keyframes trophy-glow { 0%, 100% { filter: drop-shadow(0 4px 12px rgba(255,215,0,0.5)); } 50% { filter: drop-shadow(0 4px 24px rgba(255,215,0,0.8)); } }`}</style>
          <div className="flex flex-col items-center justify-center gap-5 p-4">
            <div className="text-7xl" style={{ animation: "trophy-glow 2s ease-in-out infinite" }}>🏆</div>
            <div className="text-3xl md:text-4xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(255,215,0,0.4)" }}>Almost There!</div>
            <div className="flex items-end gap-3 flex-wrap justify-center">
              <div style={{ transform: "translateY(-4px)" }}><Character id={0} mood="happy" size={100} /></div>
              <div style={{ transform: "translateY(-10px)" }}><Character id={1} mood="happy" size={100} /></div>
              <div style={{ transform: "translateY(-10px)" }}><Character id={2} mood="happy" size={100} /></div>
              <div style={{ transform: "translateY(-4px)" }}><Character id={3} mood="happy" size={100} /></div>
            </div>
            <div className="text-lg font-semibold text-center" style={{ color: "#ffd700" }}>Answer the quiz to earn your Fraction Trophy!</div>
          </div>
        </>
      );

    case "dance-party":
      return (
        <>
          <style>{`@keyframes danceBounce { 0%, 100% { transform: translateY(0) rotate(var(--tilt)); } 50% { transform: translateY(-10px) rotate(var(--tilt)); } }`}</style>
          <div className="flex flex-col items-center justify-center gap-5 p-4">
            <div className="text-4xl md:text-5xl font-black text-center" style={{ background: "linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #b44dff, #ff6bd6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Time to Shine!</div>
            <p className="text-lg text-[#d0d8e8] text-center">Dance your way through this quiz!</p>
            <div className="flex gap-4 items-end flex-wrap justify-center">
              {[0, 1, 2, 3].map((id) => (
                <div key={id} style={{ ["--tilt" as string]: `${id % 2 === 0 ? -8 : 8}deg`, transform: `rotate(${id % 2 === 0 ? -8 : 8}deg)`, animation: `danceBounce 0.6s ${id * 0.15}s ease-in-out infinite` }}>
                  <Character id={id} mood="happy" size={100} />
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "warm-hug":
      return (
        <>
          <style>{`@keyframes gentlePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }`}</style>
          <div className="flex flex-col items-center justify-center gap-5 p-4">
            <div className="text-6xl" style={{ animation: "gentlePulse 2s ease-in-out infinite" }}>❤️</div>
            <div className="text-2xl md:text-3xl font-bold text-white text-center">We&apos;re So Proud of You!</div>
            <div className="flex items-end justify-center">
              <div style={{ marginRight: "-14px", zIndex: 1 }}><Character id={0} mood="happy" size={85} /></div>
              <div style={{ marginRight: "-14px", zIndex: 2, marginBottom: "6px" }}><Character id={1} mood="happy" size={85} /></div>
              <div style={{ marginRight: "-14px", zIndex: 2, marginBottom: "6px" }}><Character id={2} mood="happy" size={85} /></div>
              <div style={{ zIndex: 1 }}><Character id={3} mood="happy" size={85} /></div>
            </div>
            <div className="text-lg text-white/85 text-center">Let&apos;s finish strong with a little quiz!</div>
          </div>
        </>
      );

    default:
      return null;
  }
}

export type ObjectPieceType = "whole" | "half-left" | "half-right" | "quarter" | "eighth";

export type ObjectPiece = {
  id: string;
  type: ObjectPieceType;
  assignedTo?: number; // character index
};

export interface ObjectComponentProps {
  type: ObjectPieceType;
  size?: number; // pixel width of the whole object (pieces scale proportionally)
  selected?: boolean;
  showLabel?: boolean;
  animationState?: "idle" | "pre-split" | "bounce";
  opacity?: number;
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
  pieceAnimations?: Record<string, "idle" | "pre-split" | "bounce">;
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
  pieceAnimations,
}: WorkspaceProps) {
  const [bounceId, setBounceId] = useState<string | null>(null);
  const bounceTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const unassigned = pieces.filter((c) => c.assignedTo === undefined);
  const characters = Array.from({ length: characterCount }, (_, i) => i);

  // Check if this is a "show" step (big number/fraction)
  const isShowStep = step.type === "show-number" || step.type === "show-fraction";
  const isCheerStep = step.type === "cheer";
  const isVisualCompare = step.type === "visual-compare";

  // Check if this is a distribute step (for showing the reset button)
  const isDistributeStep = step.type === "distribute" || step.type === "distribute-halves";

  // Bars are only interactive during distribute, distribute-halves, and slice steps
  const isInteractive = isDistributeStep || step.type === "slice";
  const hasAnyAssigned = pieces.some((c) => c.assignedTo !== undefined);

  // Hide the bottom shelf (characters + table) when there's nothing to interact
  // with and no objects on display — quiz, cheer, show, and finale stages
  const hideShelf = isShowStep || isCheerStep || (!isInteractive && unassigned.length === 0 && !step.objectCount);

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

    // Trigger bounce animation on selection
    clearTimeout(bounceTimerRef.current);
    setBounceId(piece.id);
    bounceTimerRef.current = setTimeout(() => setBounceId(null), 250);
  };

  return (
    <div className="flex-1 flex flex-col items-center h-full pt-8 px-4 relative bg-[#1e2d4a] rounded-l-2xl">
      {/* Visual-compare animations */}
      <style>{`
        @keyframes slide-together-left {
          from { transform: translateX(-20px); }
          to   { transform: translateX(0); }
        }
        @keyframes slide-together-right {
          from { transform: translateX(20px); }
          to   { transform: translateX(0); }
        }
        @keyframes slide-together-up {
          from { transform: translateY(-20px); }
          to   { transform: translateY(0); }
        }
        @keyframes slide-together-down {
          from { transform: translateY(20px); }
          to   { transform: translateY(0); }
        }
        @keyframes ghost-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ghost-pulse {
          0%, 100% { opacity: 0.85; }
          50%      { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .slide-together-left, .slide-together-right,
          .slide-together-up, .slide-together-down { animation: none !important; }
        }
      `}</style>
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

      {/* Cheer/motivational display */}
      {isCheerStep && (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <CheerScreen style={step.cheerStyle} />
        </div>
      )}

      {/* Visual-compare: ghost overlay + grouped pieces */}
      {isVisualCompare && (() => {
        const compareCount = step.compareCount ?? 2;
        const grouped = unassigned.slice(0, compareCount);
        const remaining = unassigned.slice(compareCount);
        // Half pieces → row (side by side), quarter pieces → column (stacked)
        const isHalfPieces = grouped.some((p) => p.type === "half-left" || p.type === "half-right");
        const direction = isHalfPieces ? "flex-row" : "flex-col";
        // Slide animation names depend on direction
        const slideAnims = isHalfPieces
          ? ["slide-together-left", "slide-together-right"]
          : ["slide-together-up", "slide-together-down"];

        return (
          <div className="flex-1 flex flex-col items-center justify-center pb-[280px] gap-6">
            {/* Comparison group with ghost overlay */}
            <div className="relative inline-flex items-center justify-center">
              {/* Ghost overlay — absolutely positioned behind grouped pieces */}
              {step.ghostPiece && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                     style={{ animation: "ghost-fade-in 0.6s ease-in forwards, ghost-pulse 2s 0.6s ease-in-out infinite" }}>
                  <div style={{ filter: "drop-shadow(0 0 8px rgba(255,215,0,0.4))" }}>
                    <ObjectComponent
                      type={step.ghostPiece}
                      size={160}
                      showLabel={false}
                      opacity={0.35}
                    />
                  </div>
                </div>
              )}
              {/* Grouped pieces sliding together */}
              <div className={`flex ${direction} gap-0 relative z-10`}>
                {grouped.map((piece, i) => (
                  <div key={piece.id}
                       style={{ animation: `${slideAnims[i % slideAnims.length]} 0.5s ease-out forwards` }}>
                    <ObjectComponent
                      type={piece.type}
                      size={160}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Remaining pieces (dimmed) */}
            {remaining.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 opacity-40">
                {remaining.map((piece) => (
                  <div key={piece.id}>
                    <ObjectComponent
                      type={piece.type}
                      size={100}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Unassigned pieces area */}
      {!isShowStep && !isCheerStep && !isVisualCompare && (
        <div className={`flex-1 flex items-center justify-center ${hideShelf ? "" : "pb-[280px]"}`}>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-full">
            {unassigned.map((piece) => (
              isInteractive ? (
                <button
                  key={piece.id}
                  onClick={() => handlePieceClick(piece)}
                  className="cursor-pointer bg-transparent border-none p-0"
                >
                  <ObjectComponent
                    type={piece.type}
                    size={160}
                    selected={selectedPiece === piece.id}
                    animationState={pieceAnimations?.[piece.id] ?? (bounceId === piece.id ? "bounce" : undefined)}
                  />
                </button>
              ) : (
                <div key={piece.id} className="p-0">
                  <ObjectComponent
                    type={piece.type}
                    size={160}
                    animationState={pieceAnimations?.[piece.id]}
                  />
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Characters + table — pinned to bottom, hidden when not needed */}
      <div className={`absolute bottom-0 left-0 right-0 px-4 pb-2 ${hideShelf ? "hidden" : ""}`}>
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

        {/* Wood table + distributed pieces between the legs */}
        <div className="w-full max-w-full mx-auto px-2 relative">
          <svg viewBox="0 0 1000 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block relative z-10 pointer-events-none">
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

          {/* Distributed pieces — positioned between the table legs, only during interactive steps */}
          <div
            className={`absolute left-0 right-0 z-0 px-2 gap-2 md:gap-4 lg:gap-6 ${!isInteractive ? "hidden" : ""}`}
            style={{
              top: "28%",
              bottom: "5%",
              display: "grid",
              gridTemplateColumns: `repeat(${characterCount}, 1fr)`,
            }}
          >
            {characters.map((i) => {
              const charPieces = getCharacterPieces(i);
              return (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-center gap-1"
                >
                  {charPieces.map((c) =>
                    isInteractive ? (
                      <button
                        key={c.id}
                        onClick={() => onUnassignPiece(c.id)}
                        className="cursor-pointer bg-transparent border-none p-0 relative z-20"
                      >
                        <ObjectComponent
                          type={c.type}
                          size={80}
                          animationState={pieceAnimations?.[c.id]}
                        />
                      </button>
                    ) : (
                      <div key={c.id} className="p-0">
                        <ObjectComponent
                          type={c.type}
                          size={80}
                          animationState={pieceAnimations?.[c.id]}
                        />
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset button — always reserve space to prevent layout shift */}
        <div className="flex justify-center mt-2">
          <button
            onClick={onResetAssignments}
            className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
              isDistributeStep && hasAnyAssigned
                ? "bg-white/10 hover:bg-white/20 text-white/60 hover:text-white"
                : "invisible"
            }`}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
