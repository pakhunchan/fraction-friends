"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// DividableObject — Chocolate Bar
//
// A rich brown 2x4 Hershey-style chocolate bar with snap-apart segments.
//
// Internal viewport: 100 x 60 user units (landscape bar).
// Bar body: x 4..96, y 4..56 => width 92, height 52.
// Grid: 4 cols x 2 rows, 2px grooves between segments.
//   seg width  = (92 - 3*2) / 4 = 21.5
//   seg height = (52 - 1*2) / 2 = 25
//
// Segment col/row indices (0-based):
//   whole      => cols 0-3, rows 0-1
//   half-left  => cols 0-1, rows 0-1
//   half-right => cols 2-3, rows 0-1
//   quarter    => col 0,    rows 0-1  (a 1x2 = 2-segment piece)
// ---------------------------------------------------------------------------

export type DividableObjectType = "whole" | "half-left" | "half-right" | "quarter" | "eighth";

export interface DividableObjectProps {
  type: DividableObjectType;
  size?: number; // pixel width of the whole bar (pieces scale proportionally)
  selected?: boolean;
  showLabel?: boolean;           // unused, for interface compat with Brownie
  animationState?: "idle" | "pre-split" | "bounce"; // unused, for interface compat
}

// ---- Geometry constants ----------------------------------------------------
const PAD = 4;
const BAR_X = PAD;
const BAR_Y = PAD;
const BAR_W = 92;
const BAR_H = 52;
const GROOVE = 2;
const COLS = 4;
const ROWS = 2;
const SEG_W = (BAR_W - (COLS - 1) * GROOVE) / COLS; // 21.5
const SEG_H = (BAR_H - (ROWS - 1) * GROOVE) / ROWS; // 25
const BAR_R = 3; // outer corner radius

// Top-left corner x/y of segment (col, row)
function segX(col: number): number {
  return BAR_X + col * (SEG_W + GROOVE);
}
function segY(row: number): number {
  return BAR_Y + row * (SEG_H + GROOVE);
}

// ---- Rounded rect path -----------------------------------------------------
function roundedRect(x: number, y: number, w: number, h: number, r: number): string {
  return (
    `M${x + r},${y} ` +
    `L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} ` +
    `L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} ` +
    `L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} ` +
    `L${x},${y + r} Q${x},${y} ${x + r},${y} Z`
  );
}

// ---- Snap / jagged edge generators -----------------------------------------
// Returns an array of [x, y] points for a vertical jagged edge.
// x is the nominal break x; jags go ±2 units side to side.
function snapEdgeV(
  nominalX: number,
  yTop: number,
  yBot: number,
  seed: number
): [number, number][] {
  const pts: [number, number][] = [[nominalX, yTop]];
  const steps = 7;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const y = yTop + t * (yBot - yTop);
    // Deterministic jag: varies left/right, max ±2.5
    const jag = (((i * 3 + seed * 7) % 7) - 3) * 0.85;
    pts.push([nominalX + jag, y]);
  }
  pts.push([nominalX, yBot]);
  return pts;
}

function ptsToPolyline(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

// ---- Piece bounds -----------------------------------------------------------
function getPieceBounds(type: DividableObjectType): {
  x: number;
  y: number;
  w: number;
  h: number;
} {
  switch (type) {
    case "whole":
      return { x: BAR_X, y: BAR_Y, w: BAR_W, h: BAR_H };
    case "half-left":
      // cols 0-1 + the groove between them; right edge = segX(2) - GROOVE
      return { x: BAR_X, y: BAR_Y, w: SEG_W * 2 + GROOVE, h: BAR_H };
    case "half-right":
      // cols 2-3; left edge = segX(2)
      return { x: segX(2), y: BAR_Y, w: SEG_W * 2 + GROOVE, h: BAR_H };
    case "quarter":
      // col 0 only
      return { x: BAR_X, y: BAR_Y, w: SEG_W, h: BAR_H };
    case "eighth":
      // Fallback: treat like quarter (chocolate bar doesn't natively support eighth)
      return { x: BAR_X, y: BAR_Y, w: SEG_W, h: BAR_H };
  }
}

// ---- Segment list per type -------------------------------------------------
function getSegmentList(
  type: DividableObjectType
): { col: number; row: number }[] {
  switch (type) {
    case "whole":
      return [0, 1, 2, 3].flatMap(col =>
        [0, 1].map(row => ({ col, row }))
      );
    case "half-left":
      return [0, 1].flatMap(col => [0, 1].map(row => ({ col, row })));
    case "half-right":
      return [2, 3].flatMap(col => [0, 1].map(row => ({ col, row })));
    case "quarter":
      return [0, 1].map(row => ({ col: 0, row }));
    case "eighth":
      // Fallback: treat like quarter (chocolate bar doesn't natively support eighth)
      return [0, 1].map(row => ({ col: 0, row }));
  }
}

// ---- SVG <defs> block -------------------------------------------------------
function ChocoDefs({
  id,
  type,
}: {
  id: string;
  type: DividableObjectType;
}) {
  const bounds = getPieceBounds(type);
  return (
    <defs>
      {/* Chocolate base: warm dark brown, diagonal top-left to bottom-right */}
      <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B4513" />
        <stop offset="25%" stopColor="#7A3A0E" />
        <stop offset="60%" stopColor="#6B3000" />
        <stop offset="100%" stopColor="#4A1F00" />
      </linearGradient>

      {/* Gloss sheen: bright streak top-left fading out */}
      <linearGradient id={`${id}-sheen`} x1="0%" y1="0%" x2="55%" y2="90%">
        <stop offset="0%" stopColor="#D4893A" stopOpacity="0.60" />
        <stop offset="35%" stopColor="#B06828" stopOpacity="0.20" />
        <stop offset="100%" stopColor="#7A3A0E" stopOpacity="0" />
      </linearGradient>

      {/* Segment top-left bevel highlight */}
      <linearGradient id={`${id}-bvl-hi`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0A060" stopOpacity="0.50" />
        <stop offset="55%" stopColor="#E0A060" stopOpacity="0" />
        <stop offset="100%" stopColor="#E0A060" stopOpacity="0" />
      </linearGradient>

      {/* Segment bottom-right bevel shadow */}
      <linearGradient id={`${id}-bvl-sh`} x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#1A0800" stopOpacity="0.45" />
        <stop offset="50%" stopColor="#1A0800" stopOpacity="0" />
        <stop offset="100%" stopColor="#1A0800" stopOpacity="0" />
      </linearGradient>

      {/* Groove fill: dark center, lighter edges to look recessed */}
      <linearGradient id={`${id}-groove-v`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2A0E00" stopOpacity="0.55" />
        <stop offset="50%" stopColor="#1A0800" stopOpacity="0.80" />
        <stop offset="100%" stopColor="#2A0E00" stopOpacity="0.55" />
      </linearGradient>

      <linearGradient id={`${id}-groove-h`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2A0E00" stopOpacity="0.55" />
        <stop offset="50%" stopColor="#1A0800" stopOpacity="0.80" />
        <stop offset="100%" stopColor="#2A0E00" stopOpacity="0.55" />
      </linearGradient>

      {/* Snap face: light caramel crumble exposed by breaking */}
      <linearGradient id={`${id}-snap`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F0B87A" />
        <stop offset="40%" stopColor="#D08840" />
        <stop offset="100%" stopColor="#E8A060" />
      </linearGradient>

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

      {/* Clip to piece bounds so snap face doesn't overflow outward.
          Add 1px inset on the snap side to constrain the face just inside. */}
      <clipPath id={`${id}-clip`}>
        <rect
          x={bounds.x}
          y={bounds.y - 1}
          width={bounds.w}
          height={bounds.h + 2}
        />
      </clipPath>
    </defs>
  );
}

// ---- Groove lines between segments -----------------------------------------
function GrooveLines({ id, type }: { id: string; type: DividableObjectType }) {
  const segs = getSegmentList(type);
  const colSet = new Set(segs.map(s => s.col));
  const rowSet = new Set(segs.map(s => s.row));
  const cols = Array.from(colSet).sort((a, b) => a - b);
  const rows = Array.from(rowSet).sort((a, b) => a - b);

  return (
    <g>
      {/* Vertical grooves between consecutive columns */}
      {cols.slice(0, -1).map((col, i) => {
        if (cols[i + 1] !== col + 1) return null;
        const gx = segX(col) + SEG_W;
        const yTop = segY(rows[0]);
        const yBot = segY(rows[rows.length - 1]) + SEG_H;
        return (
          <rect
            key={`vg-${col}`}
            x={gx}
            y={yTop}
            width={GROOVE}
            height={yBot - yTop}
            fill={`url(#${id}-groove-v)`}
          />
        );
      })}

      {/* Horizontal groove between row 0 and row 1 */}
      {rows.length > 1 && (() => {
        const gy = segY(rows[0]) + SEG_H;
        const xLeft = segX(cols[0]);
        const xRight = segX(cols[cols.length - 1]) + SEG_W;
        return (
          <rect
            key="hg"
            x={xLeft}
            y={gy}
            width={xRight - xLeft}
            height={GROOVE}
            fill={`url(#${id}-groove-h)`}
          />
        );
      })()}
    </g>
  );
}

// ---- Per-segment bevel highlights ------------------------------------------
function SegmentBevels({ id, type }: { id: string; type: DividableObjectType }) {
  const segs = getSegmentList(type);
  return (
    <g>
      {segs.map(({ col, row }) => {
        const x = segX(col);
        const y = segY(row);
        const w = SEG_W;
        const h = SEG_H;
        const in1 = 1.2; // inset from segment edge
        return (
          <g key={`bvl-${col}-${row}`}>
            {/* Top + left highlight */}
            <path
              d={`M${x + in1},${y + h - in1} L${x + in1},${y + in1} L${x + w - in1},${y + in1}`}
              fill="none"
              stroke={`url(#${id}-bvl-hi)`}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bottom + right shadow */}
            <path
              d={`M${x + in1},${y + h - in1} L${x + w - in1},${y + h - in1} L${x + w - in1},${y + in1}`}
              fill="none"
              stroke={`url(#${id}-bvl-sh)`}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </g>
  );
}

// ---- Snap (broken) edges ---------------------------------------------------
// Renders the jagged cross-section where the bar was snapped.
// The crumble face always extends INWARD into the piece (so it's visible and clipped).
// For half-left:  snap at x=49 (right edge), face extends leftward
// For half-right: snap at x=51 (left edge),  face extends rightward
// For quarter:    snap at x=25.5 (right edge), face extends leftward
function SnapEdges({ id, type }: { id: string; type: DividableObjectType }) {
  if (type === "whole") return null;

  const FACE_W = 3; // thickness of the exposed crumble face

  // Generate snap face path for a vertical break
  function snapFacePath(
    nomX: number,
    yTop: number,
    yBot: number,
    seed: number,
    faceDir: 1 | -1   // +1 = face extends rightward, -1 = leftward
  ): string {
    const pts = snapEdgeV(nomX, yTop, yBot, seed);
    const forward = pts
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(" ");
    const back = [...pts]
      .reverse()
      .map(([x, y]) => `L${(x + faceDir * FACE_W).toFixed(2)},${y.toFixed(2)}`)
      .join(" ");
    return `${forward} ${back} Z`;
  }

  const yTop = BAR_Y;
  const yBot = BAR_Y + BAR_H;

  // Helper to render a snap edge group
  function renderSnapEdge(nomX: number, seed: number, faceDir: 1 | -1, highlightShift: number) {
    const pts = snapEdgeV(nomX, yTop, yBot, seed);
    const faceD = snapFacePath(nomX, yTop, yBot, seed, faceDir);
    return (
      <g clipPath={`url(#${id}-clip)`}>
        {/* Crumble face fill */}
        <path d={faceD} fill={`url(#${id}-snap)`} opacity="0.92" />
        {/* Snap line */}
        <polyline
          points={ptsToPolyline(pts)}
          fill="none"
          stroke="#3A1800"
          strokeWidth="0.7"
          opacity="0.55"
        />
        {/* Thin highlight along snap edge */}
        <polyline
          points={ptsToPolyline(pts.map(([x, y]) => [x + highlightShift, y] as [number, number]))}
          fill="none"
          stroke="#F0C080"
          strokeWidth="0.5"
          opacity="0.40"
        />
      </g>
    );
  }

  if (type === "half-left") {
    // Snap on right edge of the piece.
    // Right edge of half-left = segX(1) + SEG_W = 4 + 23.5 + 21.5 = 49.
    // The crumble face extends INWARD (leftward, faceDir=-1).
    const nomX = segX(1) + SEG_W; // = 49
    return renderSnapEdge(nomX, 42, -1, -0.6);
  }

  if (type === "half-right") {
    // Snap on left edge of the piece.
    // Left edge of half-right = segX(2) = 51.
    // The crumble face extends INWARD (rightward, faceDir=+1).
    const nomX = segX(2); // = 51
    return renderSnapEdge(nomX, 42, 1, 0.6);
  }

  if (type === "quarter") {
    // Snap on right edge: segX(0) + SEG_W = 4 + 21.5 = 25.5.
    // The crumble face extends INWARD (leftward, faceDir=-1).
    const nomX = segX(0) + SEG_W; // = 25.5
    return renderSnapEdge(nomX, 42, -1, -0.6);
  }

  return null;
}

// ---- Selection animation CSS -----------------------------------------------
const ANIM_CSS = `
@keyframes choco-tilt {
  0%   { transform: rotate(-4deg) scale(1.07); }
  25%  { transform: rotate( 4deg) scale(1.09); }
  50%  { transform: rotate(-2deg) scale(1.08); }
  75%  { transform: rotate( 2deg) scale(1.07); }
  100% { transform: rotate(-4deg) scale(1.07); }
}
@keyframes choco-shine {
  0%   { opacity: 0.10; transform: translateX(-30%); }
  50%  { opacity: 0.45; transform: translateX(10%); }
  100% { opacity: 0.10; transform: translateX(50%); }
}
.choco-sel {
  animation: choco-tilt 1.8s ease-in-out infinite;
  transform-origin: 50% 50%;
}
.choco-shine-rect {
  animation: choco-shine 2s ease-in-out infinite;
}
`;

// ---- Main component ---------------------------------------------------------
export function DividableObject({
  type,
  size = 160,
  selected = false,
}: DividableObjectProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  const bounds = getPieceBounds(type);
  const wholeBounds = getPieceBounds("whole");
  const segs = getSegmentList(type);

  // ViewBox: add padding around the piece for shadow/glow room.
  // Each piece gets its own viewBox tightly framing it, but pixel dimensions
  // are computed so the user-unit-to-pixel scale is the same for all piece types.
  // This ensures pieces are proportionally sized: a half is visually half the
  // width of a whole at the same `size` prop.
  const VP = 7;

  // Whole bar's viewBox determines the reference scale
  const wholeVbW = wholeBounds.w + VP * 2;
  const wholeVbH = wholeBounds.h + VP * 2;
  const wholePixelW = size;
  const wholePixelH = Math.round(size * wholeVbH / wholeVbW);

  // This piece's viewBox
  const vbX = bounds.x - VP;
  const vbY = bounds.y - VP;
  const vbW = bounds.w + VP * 2;
  const vbH = bounds.h + VP * 2;

  // Same scale: svgW / vbW = wholePixelW / wholeVbW
  const svgW = Math.round(vbW * wholePixelW / wholeVbW);
  const svgH = Math.round(vbH * wholePixelH / wholeVbH);

  const outerPath = roundedRect(bounds.x, bounds.y, bounds.w, bounds.h, BAR_R);

  return (
    <>
      <style>{ANIM_CSS}</style>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        className={selected ? "choco-sel" : undefined}
        style={{ display: "block" }}
        role="img"
        aria-label={`Chocolate bar piece: ${type}`}
      >
        <ChocoDefs id={id} type={type} />

        {/* ---- Piece body: fill + sheen (with shadow or glow) ---- */}
        <g filter={selected ? `url(#${id}-glow)` : `url(#${id}-dshadow)`}>
          {/* Base chocolate fill */}
          <path d={outerPath} fill={`url(#${id}-body)`} />
          {/* Gloss sheen overlay */}
          <path d={outerPath} fill={`url(#${id}-sheen)`} />
        </g>

        {/* ---- Segment surface highlights (subtle raised look) ---- */}
        {segs.map(({ col, row }) => (
          <rect
            key={`seg-${col}-${row}`}
            x={segX(col) + 0.5}
            y={segY(row) + 0.5}
            width={SEG_W - 1}
            height={SEG_H - 1}
            rx="1.2"
            fill="#A05018"
            opacity="0.18"
          />
        ))}

        {/* ---- Groove lines ---- */}
        <GrooveLines id={id} type={type} />

        {/* ---- Per-segment bevel edges ---- */}
        <SegmentBevels id={id} type={type} />

        {/* ---- Snap / broken edges ---- */}
        <SnapEdges id={id} type={type} />

        {/* ---- Outer bar edge stroke ---- */}
        <path
          d={outerPath}
          fill="none"
          stroke="#2A0E00"
          strokeWidth="1.2"
          opacity="0.65"
        />

        {/* ---- Selected: animated shine sweep ---- */}
        {selected && (
          <g clipPath={`url(#${id}-clip)`}>
            <rect
              x={bounds.x - bounds.w * 0.1}
              y={bounds.y}
              width={bounds.w * 0.35}
              height={bounds.h}
              rx="4"
              fill="white"
              opacity="0.18"
              className="choco-shine-rect"
              style={{ transformOrigin: `${bounds.x + bounds.w / 2}px ${bounds.y + bounds.h / 2}px` }}
            />
          </g>
        )}
      </svg>
    </>
  );
}

export default DividableObject;
