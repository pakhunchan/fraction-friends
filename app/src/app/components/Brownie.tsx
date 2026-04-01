"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// Brownie — Square Chocolate Brownie
//
// A rich, matte brownie with crackly top surface and crumbly cut edges.
//
// Internal viewport: 80 x 80 user units (square).
// Brownie body: x 4..76, y 4..76 => width 72, height 72.
// No grid lines — brownies don't have snap-apart segments.
//
// Piece types:
//   whole      => full square
//   half-left  => left half (vertical cut)
//   half-right => right half (vertical cut)
//   quarter    => top-left quadrant
//   eighth     => left half of top-left quadrant (tall thin slice)
// ---------------------------------------------------------------------------

export type BrownieType = "whole" | "half-left" | "half-right" | "quarter" | "eighth";

export interface BrownieProps {
  type: BrownieType;
  size?: number;
  selected?: boolean;
  showLabel?: boolean;        // default true
  animationState?: "idle" | "pre-split" | "bounce";
  opacity?: number;
}

// ---- Geometry constants ----------------------------------------------------
const PAD = 4;
const BRW_X = PAD;
const BRW_Y = PAD;
const BRW_W = 72;
const BRW_H = 72;
const BRW_R = 3.5; // outer corner radius — slightly rounded, not perfectly sharp
const MID_X = BRW_X + BRW_W / 2; // 40
const MID_Y = BRW_Y + BRW_H / 2; // 40

// ---- Label data derives from piece type — always in sync with brownie state
const PIECE_LABELS: Record<BrownieType, { num: number; den: number }> = {
  whole:        { num: 1, den: 1 },
  "half-left":  { num: 1, den: 2 },
  "half-right": { num: 1, den: 2 },
  quarter:      { num: 1, den: 4 },
  eighth:       { num: 1, den: 8 },
};

// ---- Piece bounds -----------------------------------------------------------
function getPieceBounds(type: BrownieType): {
  x: number;
  y: number;
  w: number;
  h: number;
} {
  switch (type) {
    case "whole":
      return { x: BRW_X, y: BRW_Y, w: BRW_W, h: BRW_H };
    case "half-left":
      return { x: BRW_X, y: BRW_Y, w: BRW_W / 2, h: BRW_H };
    case "half-right":
      return { x: MID_X, y: BRW_Y, w: BRW_W / 2, h: BRW_H };
    case "quarter":
      return { x: BRW_X, y: BRW_Y, w: BRW_W / 2, h: BRW_H / 2 };
    case "eighth":
      return { x: BRW_X, y: BRW_Y, w: BRW_W / 4, h: BRW_H / 2 };
  }
}

// ---- Rounded rect path (with optional per-corner control) ------------------
function roundedRect(x: number, y: number, w: number, h: number, r: number): string {
  return (
    `M${x + r},${y} ` +
    `L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} ` +
    `L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} ` +
    `L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} ` +
    `L${x},${y + r} Q${x},${y} ${x + r},${y} Z`
  );
}

// ---- Jagged / crumbly edge generators --------------------------------------
// Vertical crumbly edge: slightly irregular, organic-looking cut
function crumbleEdgeV(
  nominalX: number,
  yTop: number,
  yBot: number,
  seed: number
): [number, number][] {
  const pts: [number, number][] = [[nominalX, yTop]];
  const steps = 9;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const y = yTop + t * (yBot - yTop);
    // Deterministic jag: organic irregularity, max +/-2
    const jag = (((i * 5 + seed * 11) % 9) - 4) * 0.55;
    pts.push([nominalX + jag, y]);
  }
  pts.push([nominalX, yBot]);
  return pts;
}

// Horizontal crumbly edge
function crumbleEdgeH(
  nominalY: number,
  xLeft: number,
  xRight: number,
  seed: number
): [number, number][] {
  const pts: [number, number][] = [[xLeft, nominalY]];
  const steps = 9;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const x = xLeft + t * (xRight - xLeft);
    const jag = (((i * 7 + seed * 13) % 9) - 4) * 0.50;
    pts.push([x, nominalY + jag]);
  }
  pts.push([xRight, nominalY]);
  return pts;
}

function ptsToPolyline(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

// ---- Crack line data for the top surface -----------------------------------
// Deterministic crack paths that make the brownie top look crackly/crinkly.
// Defined in user-unit coords relative to the full brownie.
const CRACK_LINES: { d: string; opacity: number; width: number }[] = [
  // Major cracks
  { d: "M12,14 Q20,18 30,15 Q38,12 48,17 Q55,20 62,16", opacity: 0.30, width: 1.1 },
  { d: "M8,32 Q18,29 25,34 Q35,38 45,33 Q52,29 58,35 Q65,40 70,36", opacity: 0.25, width: 1.0 },
  { d: "M10,52 Q22,48 32,54 Q40,58 50,52 Q60,47 68,53", opacity: 0.28, width: 1.0 },
  { d: "M14,68 Q25,64 38,70 Q50,73 60,67 Q68,63 72,66", opacity: 0.22, width: 0.9 },
  // Minor / secondary cracks
  { d: "M18,10 Q22,20 20,30 Q18,38 22,46", opacity: 0.15, width: 0.7 },
  { d: "M42,8 Q45,18 40,28 Q38,35 42,42 Q44,50 40,58", opacity: 0.18, width: 0.7 },
  { d: "M60,12 Q56,22 58,32 Q62,40 58,50 Q55,58 60,66", opacity: 0.15, width: 0.7 },
  // Tiny fissures
  { d: "M28,22 Q32,26 36,24", opacity: 0.12, width: 0.5 },
  { d: "M50,42 Q54,46 58,43", opacity: 0.12, width: 0.5 },
  { d: "M16,60 Q22,56 26,60", opacity: 0.10, width: 0.5 },
  { d: "M48,62 Q52,58 56,62", opacity: 0.10, width: 0.5 },
];

// ---- SVG <defs> block -------------------------------------------------------
function BrownieDefs({
  id,
  type,
}: {
  id: string;
  type: BrownieType;
}) {
  const bounds = getPieceBounds(type);
  return (
    <defs>
      {/* Brownie body: deep chocolate brown, slight diagonal variation */}
      <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A2816" />
        <stop offset="30%" stopColor="#3E2010" />
        <stop offset="60%" stopColor="#35190C" />
        <stop offset="100%" stopColor="#2C1408" />
      </linearGradient>

      {/* Top surface: matte crackly layer, slightly lighter than body */}
      <linearGradient id={`${id}-top`} x1="0%" y1="0%" x2="60%" y2="80%">
        <stop offset="0%" stopColor="#5A3420" stopOpacity="0.50" />
        <stop offset="40%" stopColor="#4A2814" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#3A1C0A" stopOpacity="0.10" />
      </linearGradient>

      {/* Matte surface texture overlay: very subtle, not glossy */}
      <radialGradient id={`${id}-matte`} cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#6B3D24" stopOpacity="0.20" />
        <stop offset="60%" stopColor="#4A2816" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#2C1408" stopOpacity="0" />
      </radialGradient>

      {/* Bevel highlight: top-left edge light */}
      <linearGradient id={`${id}-bvl-hi`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B6040" stopOpacity="0.40" />
        <stop offset="50%" stopColor="#8B6040" stopOpacity="0" />
      </linearGradient>

      {/* Bevel shadow: bottom-right edge */}
      <linearGradient id={`${id}-bvl-sh`} x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#0E0600" stopOpacity="0.40" />
        <stop offset="50%" stopColor="#0E0600" stopOpacity="0" />
      </linearGradient>

      {/* Cut face: lighter caramel/tan, exposed interior */}
      <linearGradient id={`${id}-cut`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#C8915A" />
        <stop offset="30%" stopColor="#B07840" />
        <stop offset="70%" stopColor="#A06830" />
        <stop offset="100%" stopColor="#B88050" />
      </linearGradient>

      {/* Cut face horizontal variant (for top/bottom cuts) */}
      <linearGradient id={`${id}-cut-h`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C8915A" />
        <stop offset="30%" stopColor="#B07840" />
        <stop offset="70%" stopColor="#A06830" />
        <stop offset="100%" stopColor="#B88050" />
      </linearGradient>

      {/* Crumb fill */}
      <radialGradient id={`${id}-crumb`} cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#C8915A" />
        <stop offset="100%" stopColor="#8B5E3C" />
      </radialGradient>

      {/* Drop shadow (non-selected state) */}
      <filter id={`${id}-dshadow`} x="-20%" y="-20%" width="145%" height="155%">
        <feDropShadow
          dx="0"
          dy="3"
          stdDeviation="3"
          floodColor="#1A0800"
          floodOpacity="0.50"
        />
      </filter>

      {/* Warm golden glow for selected state */}
      <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="170%">
        <feGaussianBlur stdDeviation="4.5" result="blur" />
        <feFlood floodColor="#FFD700" floodOpacity="0.90" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Clip to piece bounds */}
      <clipPath id={`${id}-clip`}>
        <rect
          x={bounds.x - 1}
          y={bounds.y - 1}
          width={bounds.w + 2}
          height={bounds.h + 2}
        />
      </clipPath>
    </defs>
  );
}

// ---- Crack lines on the top surface ----------------------------------------
function CrackLines({ id, type }: { id: string; type: BrownieType }) {
  const bounds = getPieceBounds(type);
  return (
    <g clipPath={`url(#${id}-clip)`}>
      {CRACK_LINES.map((crack, i) => (
        <path
          key={`crack-${i}`}
          d={crack.d}
          fill="none"
          stroke="#1A0800"
          strokeWidth={crack.width}
          opacity={crack.opacity}
          strokeLinecap="round"
        />
      ))}
      {/* Light-colored crack highlights (the crackly brownie top has lighter lines in the cracks) */}
      {CRACK_LINES.slice(0, 4).map((crack, i) => (
        <path
          key={`crack-hi-${i}`}
          d={crack.d}
          fill="none"
          stroke="#8B6844"
          strokeWidth={crack.width * 0.6}
          opacity={crack.opacity * 0.5}
          strokeLinecap="round"
          strokeDasharray="2 4"
        />
      ))}
    </g>
  );
}

// ---- Cut (broken) edges ----------------------------------------------------
function CutEdges({ id, type }: { id: string; type: BrownieType }) {
  if (type === "whole") return null;

  const FACE_W = 3.5; // thickness of exposed cut face
  const yTop = BRW_Y;
  const yBot = BRW_Y + BRW_H;
  const xLeft = BRW_X;
  const xRight = BRW_X + BRW_W;

  // Build a cut face path from a vertical edge
  function cutFacePathV(
    nomX: number,
    yT: number,
    yB: number,
    seed: number,
    faceDir: 1 | -1
  ): string {
    const pts = crumbleEdgeV(nomX, yT, yB, seed);
    const forward = pts
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(" ");
    const back = [...pts]
      .reverse()
      .map(([x, y]) => `L${(x + faceDir * FACE_W).toFixed(2)},${y.toFixed(2)}`)
      .join(" ");
    return `${forward} ${back} Z`;
  }

  // Build a cut face path from a horizontal edge
  function cutFacePathH(
    nomY: number,
    xL: number,
    xR: number,
    seed: number,
    faceDir: 1 | -1
  ): string {
    const pts = crumbleEdgeH(nomY, xL, xR, seed);
    const forward = pts
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(" ");
    const back = [...pts]
      .reverse()
      .map(([x, y]) => `L${x.toFixed(2)},${(y + faceDir * FACE_W).toFixed(2)}`)
      .join(" ");
    return `${forward} ${back} Z`;
  }

  // Render a vertical cut
  function renderCutV(nomX: number, seed: number, faceDir: 1 | -1, cutYTop: number, cutYBot: number) {
    const pts = crumbleEdgeV(nomX, cutYTop, cutYBot, seed);
    const faceD = cutFacePathV(nomX, cutYTop, cutYBot, seed, faceDir);
    return (
      <g clipPath={`url(#${id}-clip)`}>
        <path d={faceD} fill={`url(#${id}-cut)`} opacity="0.90" />
        <polyline
          points={ptsToPolyline(pts)}
          fill="none"
          stroke="#3A1800"
          strokeWidth="0.6"
          opacity="0.50"
        />
        <polyline
          points={ptsToPolyline(pts.map(([x, y]) => [x + faceDir * 0.5, y] as [number, number]))}
          fill="none"
          stroke="#D4A870"
          strokeWidth="0.4"
          opacity="0.35"
        />
      </g>
    );
  }

  // Render a horizontal cut
  function renderCutH(nomY: number, seed: number, faceDir: 1 | -1, cutXLeft: number, cutXRight: number) {
    const pts = crumbleEdgeH(nomY, cutXLeft, cutXRight, seed);
    const faceD = cutFacePathH(nomY, cutXLeft, cutXRight, seed, faceDir);
    return (
      <g clipPath={`url(#${id}-clip)`}>
        <path d={faceD} fill={`url(#${id}-cut-h)`} opacity="0.90" />
        <polyline
          points={ptsToPolyline(pts)}
          fill="none"
          stroke="#3A1800"
          strokeWidth="0.6"
          opacity="0.50"
        />
        <polyline
          points={ptsToPolyline(pts.map(([x, y]) => [x, y + faceDir * 0.5] as [number, number]))}
          fill="none"
          stroke="#D4A870"
          strokeWidth="0.4"
          opacity="0.35"
        />
      </g>
    );
  }

  // Crumbs near cut edges
  function renderCrumbs(edges: { x: number; y: number; seed: number }[]) {
    const crumbs: { cx: number; cy: number; size: number; rot: number }[] = [];
    for (const edge of edges) {
      for (let i = 0; i < 3; i++) {
        const hash = (edge.seed * 17 + i * 31) % 100;
        const offsetX = ((hash % 7) - 3) * 1.5;
        const offsetY = ((hash % 5) - 2) * 1.8 + (i * 8);
        const size = 1.0 + (hash % 3) * 0.4;
        const rot = (hash * 7) % 45;
        crumbs.push({
          cx: edge.x + offsetX,
          cy: edge.y + offsetY,
          size,
          rot,
        });
      }
    }
    return (
      <g clipPath={`url(#${id}-clip)`}>
        {crumbs.map((c, i) => (
          <rect
            key={`crumb-${i}`}
            x={c.cx - c.size / 2}
            y={c.cy - c.size / 2}
            width={c.size}
            height={c.size}
            rx={0.2}
            fill={`url(#${id}-crumb)`}
            opacity={0.70}
            transform={`rotate(${c.rot} ${c.cx} ${c.cy})`}
          />
        ))}
      </g>
    );
  }

  const bounds = getPieceBounds(type);

  switch (type) {
    case "half-left":
      // Vertical cut on right edge at MID_X, face extends leftward
      return (
        <>
          {renderCutV(MID_X, 37, -1, yTop, yBot)}
          {renderCrumbs([{ x: MID_X - 4, y: yTop + 10, seed: 37 }])}
        </>
      );
    case "half-right":
      // Vertical cut on left edge at MID_X, face extends rightward
      return (
        <>
          {renderCutV(MID_X, 37, 1, yTop, yBot)}
          {renderCrumbs([{ x: MID_X + 4, y: yTop + 14, seed: 41 }])}
        </>
      );
    case "quarter":
      // Vertical cut on right at MID_X + horizontal cut on bottom at MID_Y
      return (
        <>
          {renderCutV(MID_X, 37, -1, yTop, MID_Y)}
          {renderCutH(MID_Y, 53, -1, xLeft, MID_X)}
          {renderCrumbs([
            { x: MID_X - 4, y: yTop + 8, seed: 37 },
            { x: xLeft + 10, y: MID_Y - 4, seed: 53 },
          ])}
        </>
      );
    case "eighth":
      // Vertical cut on right at BRW_X + BRW_W/4 + horizontal cut on bottom at MID_Y
      {
        const eighthRight = BRW_X + BRW_W / 4; // = 22
        return (
          <>
            {renderCutV(eighthRight, 29, -1, yTop, MID_Y)}
            {renderCutH(MID_Y, 53, -1, xLeft, eighthRight)}
            {renderCrumbs([
              { x: eighthRight - 3, y: yTop + 6, seed: 29 },
              { x: xLeft + 5, y: MID_Y - 3, seed: 53 },
            ])}
          </>
        );
      }
    default:
      return null;
  }
}

// ---- Fraction label rendered at piece center --------------------------------
function FractionLabel({ type, bounds }: { type: BrownieType; bounds: { x: number; y: number; w: number; h: number } }) {
  const label = PIECE_LABELS[type];
  const cx = bounds.x + bounds.w / 2;
  const cy = bounds.y + bounds.h / 2;
  const fontSize = label.den === 1
    ? Math.min(bounds.w, bounds.h) * 0.38
    : Math.min(bounds.w, bounds.h) * 0.28;

  const commonTextProps = {
    textAnchor: "middle" as const,
    fill: "white",
    stroke: "#2C1408",
    strokeWidth: 2.5,
    paintOrder: "stroke" as const,
    fontWeight: "bold" as const,
    fontFamily: "system-ui, sans-serif",
    fontSize,
  };

  if (label.den === 1) {
    return <text x={cx} y={cy} dominantBaseline="central" {...commonTextProps}>1</text>;
  }

  const gap = fontSize * 0.65;
  return (
    <g>
      <text x={cx} y={cy - gap} dominantBaseline="central" {...commonTextProps}>{label.num}</text>
      <line x1={cx - fontSize * 0.5} y1={cy} x2={cx + fontSize * 0.5} y2={cy}
            stroke="#2C1408" strokeWidth={3.5} opacity={0.6} />
      <line x1={cx - fontSize * 0.5} y1={cy} x2={cx + fontSize * 0.5} y2={cy}
            stroke="white" strokeWidth={1.2} />
      <text x={cx} y={cy + gap} dominantBaseline="central" {...commonTextProps}>{label.den}</text>
    </g>
  );
}

// ---- Selection animation CSS -----------------------------------------------
const ANIM_CSS = `
@keyframes brownie-tilt {
  0%   { transform: rotate(-4deg) scale(1.07); }
  25%  { transform: rotate( 4deg) scale(1.09); }
  50%  { transform: rotate(-2deg) scale(1.08); }
  75%  { transform: rotate( 2deg) scale(1.07); }
  100% { transform: rotate(-4deg) scale(1.07); }
}
@keyframes brownie-shine {
  0%   { opacity: 0.08; transform: translateX(-30%); }
  50%  { opacity: 0.30; transform: translateX(10%); }
  100% { opacity: 0.08; transform: translateX(50%); }
}
.brownie-sel {
  animation: brownie-tilt 1.8s ease-in-out infinite;
  transform-origin: 50% 50%;
}
.brownie-shine-rect {
  animation: brownie-shine 2s ease-in-out infinite;
}

/* Pre-split wiggle — subtle horizontal shake signaling imminent split */
@keyframes brownie-wiggle {
  0%   { transform: translateX(0); }
  15%  { transform: translateX(-3px) rotate(-1.5deg); }
  30%  { transform: translateX(3px) rotate(1.5deg); }
  45%  { transform: translateX(-2px) rotate(-0.8deg); }
  60%  { transform: translateX(2px) rotate(0.8deg); }
  75%  { transform: translateX(-1px); }
  100% { transform: translateX(0); }
}
.brownie-wiggle {
  animation: brownie-wiggle 0.35s ease-in-out;
  transform-origin: 50% 50%;
}

/* Click bounce — quick squash-stretch on piece selection */
@keyframes brownie-bounce {
  0%   { transform: scale(1); }
  30%  { transform: scale(0.93, 1.05); }
  60%  { transform: scale(1.03, 0.97); }
  100% { transform: scale(1); }
}
.brownie-bounce {
  animation: brownie-bounce 0.25s ease-out;
  transform-origin: 50% 50%;
}

/* Respect prefers-reduced-motion for all brownie animations */
@media (prefers-reduced-motion: reduce) {
  .brownie-sel, .brownie-wiggle, .brownie-bounce, .brownie-shine-rect {
    animation: none !important;
  }
}
`;

// ---- Main component ---------------------------------------------------------
export function Brownie({
  type,
  size = 120,
  selected = false,
  showLabel = true,
  animationState,
  opacity,
}: BrownieProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  const bounds = getPieceBounds(type);

  // Animation class: pre-split/bounce override selected tilt
  const animClass =
    animationState === "pre-split" ? "brownie-wiggle" :
    animationState === "bounce" ? "brownie-bounce" :
    selected ? "brownie-sel" :
    undefined;
  const wholeBounds = getPieceBounds("whole");

  // ViewBox: each piece gets its own viewBox tightly framing it (with padding),
  // but SVG pixel dimensions are computed so that the SCALE (user-units per pixel)
  // is the same for all piece types. This ensures pieces are proportionally sized:
  // a half piece is visually half the area of a whole at the same `size` prop.
  const VP = 7;

  // Whole brownie's viewBox determines the reference scale
  const wholeVbW = wholeBounds.w + VP * 2;
  const wholeVbH = wholeBounds.h + VP * 2;
  const wholePixelW = size;
  const wholePixelH = Math.round(size * wholeVbH / wholeVbW);

  // This piece's viewBox
  const pieceVbX = bounds.x - VP;
  const pieceVbY = bounds.y - VP;
  const pieceVbW = bounds.w + VP * 2;
  const pieceVbH = bounds.h + VP * 2;

  // Same scale: svgW / pieceVbW = wholePixelW / wholeVbW
  const svgW = Math.round(pieceVbW * wholePixelW / wholeVbW);
  const svgH = Math.round(pieceVbH * wholePixelH / wholeVbH);

  const outerPath = roundedRect(bounds.x, bounds.y, bounds.w, bounds.h, BRW_R);

  return (
    <>
      <style>{ANIM_CSS}</style>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`${pieceVbX} ${pieceVbY} ${pieceVbW} ${pieceVbH}`}
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        className={animClass}
        style={{ display: "block", opacity: opacity ?? 1 }}
        role="img"
        aria-label={`Brownie piece: ${PIECE_LABELS[type].den === 1 ? '1 whole' : `${PIECE_LABELS[type].num}/${PIECE_LABELS[type].den}`}`}
      >
        <BrownieDefs id={id} type={type} />

        {/* ---- Piece body (with shadow or glow) ---- */}
        <g filter={selected ? `url(#${id}-glow)` : `url(#${id}-dshadow)`}>
          {/* Base chocolate fill */}
          <path d={outerPath} fill={`url(#${id}-body)`} />
          {/* Matte surface overlay */}
          <path d={outerPath} fill={`url(#${id}-top)`} />
          {/* Subtle matte radial highlight */}
          <path d={outerPath} fill={`url(#${id}-matte)`} />
        </g>

        {/* ---- Top-left bevel highlight ---- */}
        <g clipPath={`url(#${id}-clip)`}>
          <path
            d={`M${bounds.x + 1.5},${bounds.y + bounds.h - 1.5} L${bounds.x + 1.5},${bounds.y + 1.5} L${bounds.x + bounds.w - 1.5},${bounds.y + 1.5}`}
            fill="none"
            stroke={`url(#${id}-bvl-hi)`}
            strokeWidth="2.0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom-right bevel shadow */}
          <path
            d={`M${bounds.x + 1.5},${bounds.y + bounds.h - 1.5} L${bounds.x + bounds.w - 1.5},${bounds.y + bounds.h - 1.5} L${bounds.x + bounds.w - 1.5},${bounds.y + 1.5}`}
            fill="none"
            stroke={`url(#${id}-bvl-sh)`}
            strokeWidth="2.0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ---- Crack lines on top surface ---- */}
        <CrackLines id={id} type={type} />

        {/* ---- Cut / broken edges ---- */}
        <CutEdges id={id} type={type} />

        {/* ---- Fraction label ---- */}
        {showLabel && <FractionLabel type={type} bounds={bounds} />}

        {/* ---- Outer edge stroke ---- */}
        <path
          d={outerPath}
          fill="none"
          stroke="#1A0800"
          strokeWidth="1.0"
          opacity="0.60"
        />

        {/* ---- Selected: animated shine sweep (subdued for matte look) ---- */}
        {selected && (
          <g clipPath={`url(#${id}-clip)`}>
            <rect
              x={bounds.x - bounds.w * 0.1}
              y={bounds.y}
              width={bounds.w * 0.35}
              height={bounds.h}
              rx="4"
              fill="white"
              opacity="0.12"
              className="brownie-shine-rect"
              style={{ transformOrigin: `${bounds.x + bounds.w / 2}px ${bounds.y + bounds.h / 2}px` }}
            />
          </g>
        )}
      </svg>
    </>
  );
}

export default Brownie;
