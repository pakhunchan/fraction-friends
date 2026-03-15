"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// Brownie — Chocolate brownie for a kids' fraction-teaching app
//
// Props:
//   type     - "whole" | "half-left" | "half-right" | "quarter" | "eighth"
//   size     - rendered pixel size (default 120)
//   selected - show a glowing/bouncing selected state
//
// All views use a 100x100 coordinate space internally.
//
// Whole       -> square brownie, top-down view with crackly crust
// half-left   -> left vertical half, cut edge visible
// half-right  -> right vertical half, cut edge visible
// quarter     -> top-right quadrant
// eighth      -> thin rectangle (half of a quarter, top-right eighth)
// ---------------------------------------------------------------------------

export type BrownieType =
  | "whole"
  | "half-left"
  | "half-right"
  | "quarter"
  | "eighth";

export interface BrownieProps {
  type: BrownieType;
  size?: number; // default 120
  selected?: boolean; // glow effect when selected
}

// ---------------------------------------------------------------------------
// Geometry constants -- all in 100x100 viewBox
// ---------------------------------------------------------------------------
const PAD = 8; // padding from edge
const LEFT = PAD;
const TOP = PAD;
const W = 100 - PAD * 2; // brownie width = 84
const H = 100 - PAD * 2; // brownie height = 84
const R = 5; // corner radius

// Colors
const CRUST_DARK = "#3b1e0a"; // darkest crust
const CRUST_MID = "#5a2d0e"; // medium crust
const CRUST_LIGHT = "#6b3a14"; // lighter crust highlight
const INTERIOR = "#8b5e3c"; // cakey interior on cut edges
const INTERIOR_LIGHT = "#a47250"; // lighter interior
const CHIP_DARK = "#2a1508"; // chocolate chips
const CHIP_LIGHT = "#4a2a12"; // lighter chips

// ---------------------------------------------------------------------------
// SVG Defs
// ---------------------------------------------------------------------------
function BrownieDefs({
  id,
  type,
}: {
  id: string;
  type: BrownieType;
}) {
  return (
    <defs>
      {/* Top surface gradient -- dark chocolate with subtle variation */}
      <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4a2810" />
        <stop offset="30%" stopColor="#3b1e0a" />
        <stop offset="60%" stopColor="#4e2c12" />
        <stop offset="100%" stopColor="#3a1c08" />
      </linearGradient>

      {/* Interior gradient for cut edges */}
      <linearGradient id={`${id}-interior`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={CRUST_DARK} />
        <stop offset="8%" stopColor={INTERIOR} />
        <stop offset="50%" stopColor={INTERIOR_LIGHT} />
        <stop offset="92%" stopColor={INTERIOR} />
        <stop offset="100%" stopColor="#6b4020" />
      </linearGradient>

      {/* Interior gradient horizontal */}
      <linearGradient id={`${id}-interior-h`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={CRUST_DARK} />
        <stop offset="8%" stopColor={INTERIOR} />
        <stop offset="50%" stopColor={INTERIOR_LIGHT} />
        <stop offset="92%" stopColor={INTERIOR} />
        <stop offset="100%" stopColor="#6b4020" />
      </linearGradient>

      {/* Top highlight */}
      <radialGradient id={`${id}-sheen`} cx="35%" cy="30%" r="50%">
        <stop offset="0%" stopColor="white" stopOpacity="0.12" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>

      {/* Brownie texture -- feTurbulence for surface roughness */}
      <filter
        id={`${id}-tex`}
        x="-5%"
        y="-5%"
        width="110%"
        height="110%"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.08 0.08"
          numOctaves="5"
          seed="42"
          result="noise"
        />
        <feColorMatrix
          type="saturate"
          values="0"
          in="noise"
          result="gray"
        />
        <feBlend
          in="SourceGraphic"
          in2="gray"
          mode="multiply"
          result="blended"
        />
        <feComponentTransfer in="blended">
          <feFuncR type="linear" slope="1.1" intercept="0.02" />
          <feFuncG type="linear" slope="1.0" intercept="0.01" />
          <feFuncB type="linear" slope="0.9" intercept="0" />
        </feComponentTransfer>
      </filter>

      {/* Drop shadow */}
      <filter
        id={`${id}-shadow`}
        x="-15%"
        y="-10%"
        width="130%"
        height="140%"
      >
        <feDropShadow
          dx="0"
          dy="3"
          stdDeviation="3.5"
          floodColor="#1a0a00"
          floodOpacity="0.45"
        />
      </filter>

      {/* Selected glow */}
      <filter
        id={`${id}-glow`}
        x="-30%"
        y="-30%"
        width="160%"
        height="160%"
      >
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feFlood floodColor="#ffc040" floodOpacity="0.85" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Clip paths for piece types */}
      {type === "half-left" && (
        <clipPath id={`${id}-clip`}>
          <rect x="0" y="0" width="52" height="100" />
        </clipPath>
      )}
      {type === "half-right" && (
        <clipPath id={`${id}-clip`}>
          <rect x="48" y="0" width="52" height="100" />
        </clipPath>
      )}
      {type === "quarter" && (
        <clipPath id={`${id}-clip`}>
          <rect x="48" y="0" width="52" height="52" />
        </clipPath>
      )}
      {type === "eighth" && (
        <clipPath id={`${id}-clip`}>
          <rect x="69" y="0" width="31" height="52" />
        </clipPath>
      )}
    </defs>
  );
}

// ---------------------------------------------------------------------------
// Crack lines on the brownie surface
// ---------------------------------------------------------------------------
function CrackLines() {
  return (
    <g opacity="0.4" stroke={CRUST_DARK} strokeWidth="0.8" fill="none" strokeLinecap="round">
      {/* Main cracks radiating from center */}
      <path d="M 35 35 Q 42 40 50 38 Q 58 36 65 40" />
      <path d="M 30 55 Q 40 50 50 52 Q 58 54 68 48" />
      <path d="M 42 28 Q 45 38 48 50 Q 50 58 52 68" />
      <path d="M 55 25 Q 52 35 56 45" />
      <path d="M 25 42 Q 32 44 38 48" />
      <path d="M 60 55 Q 66 58 72 54" />
      {/* Smaller secondary cracks */}
      <path d="M 38 65 Q 44 62 48 66" opacity="0.6" strokeWidth="0.5" />
      <path d="M 58 30 Q 62 34 60 38" opacity="0.6" strokeWidth="0.5" />
      <path d="M 28 32 Q 33 36 35 40" opacity="0.6" strokeWidth="0.5" />
      <path d="M 65 62 Q 70 65 72 68" opacity="0.6" strokeWidth="0.5" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Chocolate chips and crumbs on surface
// ---------------------------------------------------------------------------
function ChocolateChips() {
  const chips: [number, number, number, number, number][] = [
    // [cx, cy, rx, ry, rotation]
    [28, 30, 3.5, 2.5, 15],
    [62, 26, 3, 2.2, -20],
    [45, 55, 3.2, 2.4, 35],
    [72, 50, 2.8, 2, -10],
    [35, 72, 3, 2.3, 45],
    [58, 68, 2.5, 2, 5],
    [22, 58, 2.8, 2.1, -30],
    [75, 35, 2.6, 2, 20],
  ];

  const crumbs: [number, number][] = [
    [30, 45], [55, 42], [40, 32], [68, 58],
    [48, 75], [25, 68], [78, 28], [65, 75],
    [32, 18], [70, 18], [18, 45], [82, 60],
  ];

  return (
    <g>
      {/* Chocolate chips */}
      {chips.map(([cx, cy, rx, ry, rot], i) => (
        <ellipse
          key={`chip-${i}`}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill={i % 2 === 0 ? CHIP_DARK : CHIP_LIGHT}
          transform={`rotate(${rot} ${cx} ${cy})`}
          opacity="0.7"
        />
      ))}
      {/* Tiny crumbs */}
      <g opacity="0.35">
        {crumbs.map(([cx, cy], i) => (
          <circle
            key={`crumb-${i}`}
            cx={cx}
            cy={cy}
            r={1 + (i % 3) * 0.4}
            fill={CRUST_MID}
          />
        ))}
      </g>
    </g>
  );
}

// ---------------------------------------------------------------------------
// The brownie top surface (whole square)
// ---------------------------------------------------------------------------
function BrownieTop({ id }: { id: string }) {
  return (
    <g>
      {/* Base brownie shape */}
      <rect
        x={LEFT}
        y={TOP}
        width={W}
        height={H}
        rx={R}
        fill={`url(#${id}-top)`}
      />

      {/* Texture overlay */}
      <rect
        x={LEFT}
        y={TOP}
        width={W}
        height={H}
        rx={R}
        fill={`url(#${id}-top)`}
        filter={`url(#${id}-tex)`}
        opacity="0.5"
      />

      {/* Crack pattern */}
      <CrackLines />

      {/* Chocolate chips and crumbs */}
      <ChocolateChips />

      {/* Sheen/highlight */}
      <rect
        x={LEFT}
        y={TOP}
        width={W}
        height={H}
        rx={R}
        fill={`url(#${id}-sheen)`}
      />

    </g>
  );
}

// ---------------------------------------------------------------------------
// Cut edge band (the lighter interior visible on a cut face)
// ---------------------------------------------------------------------------
function CutEdgeVertical({
  x,
  id,
}: {
  x: number;
  id: string;
}) {
  const edgeWidth = 5;
  return (
    <g>
      <rect
        x={x - edgeWidth / 2}
        y={TOP}
        width={edgeWidth}
        height={H}
        fill={`url(#${id}-interior)`}
      />
      {/* Thin dark line at cut surface */}
      <line
        x1={x}
        y1={TOP}
        x2={x}
        y2={TOP + H}
        stroke={INTERIOR}
        strokeWidth="0.8"
        opacity="0.5"
      />
      {/* Crumb dots along cut edge */}
      {[0.15, 0.3, 0.5, 0.65, 0.8].map((f, i) => (
        <circle
          key={i}
          cx={x + (i % 2 === 0 ? 1 : -1)}
          cy={TOP + H * f}
          r="0.8"
          fill={INTERIOR_LIGHT}
          opacity="0.5"
        />
      ))}
    </g>
  );
}

function CutEdgeHorizontal({
  y,
  id,
}: {
  y: number;
  id: string;
}) {
  const edgeWidth = 5;
  return (
    <g>
      <rect
        x={LEFT}
        y={y - edgeWidth / 2}
        width={W}
        height={edgeWidth}
        fill={`url(#${id}-interior-h)`}
      />
      <line
        x1={LEFT}
        y1={y}
        x2={LEFT + W}
        y2={y}
        stroke={INTERIOR}
        strokeWidth="0.8"
        opacity="0.5"
      />
      {[0.15, 0.3, 0.5, 0.65, 0.8].map((f, i) => (
        <circle
          key={i}
          cx={LEFT + W * f}
          cy={y + (i % 2 === 0 ? 1 : -1)}
          r="0.8"
          fill={INTERIOR_LIGHT}
          opacity="0.5"
        />
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// ViewBox and size calculations per type
// ---------------------------------------------------------------------------
function getViewBoxAndSize(
  type: BrownieType,
  size: number
): { viewBox: string; width: number; height: number } {
  switch (type) {
    case "whole":
      return {
        viewBox: "2 2 96 96",
        width: size,
        height: size,
      };
    case "half-left":
      return {
        viewBox: "2 2 50 96",
        width: size * 0.52,
        height: size,
      };
    case "half-right":
      return {
        viewBox: "48 2 50 96",
        width: size * 0.52,
        height: size,
      };
    case "quarter":
      return {
        viewBox: "48 2 50 50",
        width: size * 0.52,
        height: size * 0.52,
      };
    case "eighth":
      // Eighth is a thin slice: right half of top-right quarter
      // Brownie spans x=8..92, y=8..92. Eighth = x=69..92, y=8..50
      return {
        viewBox: "67 2 30 50",
        width: size * 0.32,
        height: size * 0.52,
      };
  }
}

// ---------------------------------------------------------------------------
// Main Brownie component
// ---------------------------------------------------------------------------
export function Brownie({
  type,
  size = 120,
  selected = false,
}: BrownieProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  const { viewBox, width, height } = getViewBoxAndSize(type, size);

  const filterAttr = selected
    ? `url(#${id}-glow)`
    : `url(#${id}-shadow)`;

  // Determine which cut edges to show
  const showVerticalCut =
    type === "half-left" ||
    type === "half-right" ||
    type === "quarter" ||
    type === "eighth";
  const showHorizontalCut =
    type === "quarter" || type === "eighth";
  const showEighthCut = type === "eighth";

  // Vertical cut is at the center (x=50)
  const verticalCutX = 50;
  // Horizontal cut is at the center (y=50)
  const horizontalCutY = 50;
  // Eighth cut is at x=75 (midpoint of right half)
  const eighthCutX = 71;

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      style={
        selected
          ? {
              animation:
                "brownieBounce 0.6s ease-in-out infinite alternate",
            }
          : undefined
      }
    >
      <style>{`
        @keyframes brownieBounce {
          from { transform: translateY(0px); }
          to   { transform: translateY(-4px); }
        }
      `}</style>
      <BrownieDefs id={id} type={type} />

      <g filter={filterAttr}>
        {/* Main brownie body, clipped if needed */}
        {type === "whole" ? (
          <BrownieTop id={id} />
        ) : (
          <g clipPath={`url(#${id}-clip)`}>
            <BrownieTop id={id} />
          </g>
        )}

        {/* Cut edges */}
        {showVerticalCut && (
          <CutEdgeVertical x={verticalCutX} id={id} />
        )}
        {showHorizontalCut && (
          <CutEdgeHorizontal y={horizontalCutY} id={id} />
        )}
        {showEighthCut && (
          <CutEdgeVertical x={eighthCutX} id={id} />
        )}
      </g>
    </svg>
  );
}

export default Brownie;
