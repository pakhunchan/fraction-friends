"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// DividableObject — Watermelon variant
// Props:
//   type: "whole" | "half-left" | "half-right" | "quarter"
//   size?: number  (default 120, scales 32-200)
//   selected?: boolean
// ---------------------------------------------------------------------------

export interface DividableObjectProps {
  type: "whole" | "half-left" | "half-right" | "quarter";
  size?: number;
  selected?: boolean;
}

// ---------------------------------------------------------------------------
// Seed positions — [cx, cy, rx, ry, rotation]
// Coordinates in the 0-100 space. Seeds are placed in the "flesh" area
// (roughly radius 10..40 from center 50,50) and used by all cut views.
// ---------------------------------------------------------------------------
const SEEDS: [number, number, number, number, number][] = [
  [62, 38,  3.5, 2.0, -30],
  [72, 52,  3.0, 1.8,  20],
  [58, 64,  3.2, 1.9, -10],
  [44, 60,  2.8, 1.7,  35],
  [36, 45,  3.0, 1.8, -25],
  [52, 42,  2.6, 1.6,  15],
  [66, 70,  3.4, 2.0, -40],
  [42, 72,  2.9, 1.7,  25],
  [76, 38,  2.7, 1.6, -15],
  [55, 76,  3.1, 1.9,  10],
  [34, 62,  2.5, 1.5, -35],
  [68, 60,  3.3, 2.0,  30],
];

// ---------------------------------------------------------------------------
// Stripe angles for the whole top-down view (dark green over lighter green).
// Each stripe is a thin arc/band rotated across the circle.
// We'll draw them as rotated rect clips inside the circle.
// Stripe widths & positions in angle space (degrees of the full circle).
// ---------------------------------------------------------------------------
const STRIPE_ANGLES = [0, 51, 102, 153, 204, 255, 306]; // evenly spaced ~51° apart

// ---------------------------------------------------------------------------
// Helper — is a seed's center within the visible region?
// ---------------------------------------------------------------------------
function isSeedVisible(
  cx: number,
  cy: number,
  mode: "whole" | "left" | "right" | "quarter"
): boolean {
  switch (mode) {
    case "whole":
      // In top-down view we don't show seeds (rind exterior only)
      return false;
    case "left":
      return cx <= 52;
    case "right":
      return cx >= 48;
    case "quarter":
      // upper-right quadrant from center 50,50
      return cx >= 48 && cy <= 52;
  }
}

// ---------------------------------------------------------------------------
// SVG <defs> — all gradients, filters, clip paths
// ---------------------------------------------------------------------------
function WatermelonDefs({
  id,
  mode,
}: {
  id: string;
  mode: "whole" | "left" | "right" | "quarter";
}) {
  return (
    <defs>
      {/* ---- WHOLE (top-down rind) gradients ---- */}

      {/* Outer rind — deep green with radial depth */}
      <radialGradient id={`${id}-rind-outer`} cx="42%" cy="38%" r="58%">
        <stop offset="0%"   stopColor="#4a8c3f" />
        <stop offset="40%"  stopColor="#2d6b28" />
        <stop offset="80%"  stopColor="#1e4f1b" />
        <stop offset="100%" stopColor="#163d13" />
      </radialGradient>

      {/* Light stripe color for whole view */}
      <radialGradient id={`${id}-rind-stripe`} cx="42%" cy="38%" r="58%">
        <stop offset="0%"   stopColor="#7dc46e" />
        <stop offset="45%"  stopColor="#5aaa4a" />
        <stop offset="85%"  stopColor="#3d8833" />
        <stop offset="100%" stopColor="#2d6b28" />
      </radialGradient>

      {/* Top highlight for dome feel */}
      <radialGradient id={`${id}-whole-highlight`} cx="36%" cy="30%" r="42%">
        <stop offset="0%"   stopColor="white" stopOpacity="0.28" />
        <stop offset="60%"  stopColor="white" stopOpacity="0.06" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>

      {/* Bottom shadow */}
      <radialGradient id={`${id}-whole-shadow`} cx="54%" cy="64%" r="50%">
        <stop offset="0%"   stopColor="black" stopOpacity="0" />
        <stop offset="55%"  stopColor="black" stopOpacity="0" />
        <stop offset="100%" stopColor="black" stopOpacity="0.22" />
      </radialGradient>

      {/* ---- CUT FACE gradients (left/right/quarter) ---- */}

      {/* Flesh — radial pink/red from center outward */}
      <radialGradient id={`${id}-flesh`} cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#ff6b8a" />
        <stop offset="35%"  stopColor="#f53b60" />
        <stop offset="65%"  stopColor="#e0284e" />
        <stop offset="85%"  stopColor="#c91f40" />
        <stop offset="100%" stopColor="#b01535" />
      </radialGradient>

      {/* White rind layer (inner rind ring) */}
      <radialGradient id={`${id}-white-rind`} cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#f0f8ec" />
        <stop offset="70%"  stopColor="#e8f5e0" />
        <stop offset="100%" stopColor="#d5ecc8" />
      </radialGradient>

      {/* Green rind edge (outer ring on cut face) */}
      <radialGradient id={`${id}-green-rind`} cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#3d8833" />
        <stop offset="50%"  stopColor="#2d6b28" />
        <stop offset="100%" stopColor="#1e4f1b" />
      </radialGradient>

      {/* Cut face highlight */}
      <radialGradient id={`${id}-cut-highlight`} cx="38%" cy="35%" r="45%">
        <stop offset="0%"   stopColor="white" stopOpacity="0.32" />
        <stop offset="55%"  stopColor="white" stopOpacity="0.08" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>

      {/* Cut face overall wetness/sheen */}
      <radialGradient id={`${id}-sheen`} cx="48%" cy="45%" r="52%">
        <stop offset="0%"   stopColor="#ffb3c4" stopOpacity="0.35" />
        <stop offset="50%"  stopColor="#ff8fa6" stopOpacity="0.10" />
        <stop offset="100%" stopColor="#ff6b8a" stopOpacity="0" />
      </radialGradient>

      {/* ---- SEED gradient ---- */}
      <radialGradient id={`${id}-seed`} cx="38%" cy="32%" r="62%">
        <stop offset="0%"   stopColor="#3a2c1a" />
        <stop offset="50%"  stopColor="#1a1108" />
        <stop offset="100%" stopColor="#0d0804" />
      </radialGradient>

      {/* Seed highlight */}
      <radialGradient id={`${id}-seed-hl`} cx="32%" cy="28%" r="50%">
        <stop offset="0%"   stopColor="white" stopOpacity="0.28" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>

      {/* ---- SELECTED GLOW ---- */}
      <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feFlood floodColor="#34d399" floodOpacity="0.75" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* ---- DROP SHADOW ---- */}
      <filter id={`${id}-shadow`} x="-18%" y="-12%" width="136%" height="140%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" floodColor="#0a2e08" floodOpacity="0.40" />
      </filter>

      {/* ---- CLIP PATHS ---- */}
      {/* Full circle clip (used internally for stripe masking) */}
      <clipPath id={`${id}-circle-clip`}>
        <circle cx="50" cy="50" r="47" />
      </clipPath>

      {mode === "left" && (
        <clipPath id={`${id}-shape-clip`}>
          <rect x="0" y="0" width="51" height="100" />
        </clipPath>
      )}
      {mode === "right" && (
        <clipPath id={`${id}-shape-clip`}>
          <rect x="49" y="0" width="51" height="100" />
        </clipPath>
      )}
      {mode === "quarter" && (
        <clipPath id={`${id}-shape-clip`}>
          <rect x="49" y="0" width="51" height="51" />
        </clipPath>
      )}

      {/* Stripe clip — clips stripes to the circle */}
      {mode === "whole" &&
        STRIPE_ANGLES.map((angle, i) => (
          <clipPath key={`sc-${i}`} id={`${id}-stripe-${i}`}>
            <rect
              x="41"
              y="3"
              width="9"
              height="94"
              transform={`rotate(${angle} 50 50)`}
            />
          </clipPath>
        ))}
    </defs>
  );
}

// ---------------------------------------------------------------------------
// Seeds rendered onto a cut face
// ---------------------------------------------------------------------------
function Seeds({
  id,
  mode,
}: {
  id: string;
  mode: "whole" | "left" | "right" | "quarter";
}) {
  const visible = SEEDS.filter(([cx, cy]) => isSeedVisible(cx, cy, mode));
  return (
    <g>
      {visible.map(([cx, cy, rx, ry, rot], i) => (
        <g key={`seed-${i}`} transform={`rotate(${rot} ${cx} ${cy})`}>
          {/* Tiny drop shadow */}
          <ellipse
            cx={cx + 0.6}
            cy={cy + 0.8}
            rx={rx}
            ry={ry}
            fill="#000"
            opacity="0.30"
          />
          {/* Seed body */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill={`url(#${id}-seed)`}
          />
          {/* Seed highlight */}
          <ellipse
            cx={cx - rx * 0.2}
            cy={cy - ry * 0.25}
            rx={rx * 0.55}
            ry={ry * 0.50}
            fill={`url(#${id}-seed-hl)`}
          />
        </g>
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// CUT FACE — the internal cross-section shown on half-left, half-right, quarter
// Layers from outside in: dark-green rind → white rind → pink/red flesh
// Full circle geometry; clipping is applied by the parent <g>.
// ---------------------------------------------------------------------------
function CutFace({ id }: { id: string }) {
  return (
    <g>
      {/* Green outer rind ring (full circle radius 47) */}
      <circle cx="50" cy="50" r="47" fill={`url(#${id}-green-rind)`} />
      {/* White inner rind ring (radius 41) */}
      <circle cx="50" cy="50" r="41" fill={`url(#${id}-white-rind)`} />
      {/* Pink/red flesh (radius 36) */}
      <circle cx="50" cy="50" r="36" fill={`url(#${id}-flesh)`} />
      {/* Sheen on flesh */}
      <circle cx="50" cy="50" r="36" fill={`url(#${id}-sheen)`} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// WHOLE WATERMELON — top-down view
// ---------------------------------------------------------------------------
function WholeBody({
  id,
  selected,
}: {
  id: string;
  selected: boolean;
}) {
  return (
    <g filter={selected ? `url(#${id}-glow)` : `url(#${id}-shadow)`}>
      {/* Base dark green circle */}
      <circle cx="50" cy="50" r="47" fill={`url(#${id}-rind-outer)`} />

      {/* Light green stripes — vertical bands rotated around center */}
      <g clipPath={`url(#${id}-circle-clip)`}>
        {STRIPE_ANGLES.map((angle, i) => (
          <rect
            key={`stripe-${i}`}
            x="41"
            y="3"
            width="9"
            height="94"
            fill={`url(#${id}-rind-stripe)`}
            opacity="0.82"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </g>

      {/* Subtle stem nub at top */}
      <ellipse
        cx="50"
        cy="5.5"
        rx="3.5"
        ry="2.2"
        fill="#3a6e1a"
        opacity="0.85"
      />
      <ellipse
        cx="50"
        cy="5.2"
        rx="2.0"
        ry="1.3"
        fill="#5aaa4a"
        opacity="0.55"
      />

      {/* Top highlight for 3D dome feel */}
      <circle cx="50" cy="50" r="47" fill={`url(#${id}-whole-highlight)`} />

      {/* Bottom edge shadow for depth */}
      <circle cx="50" cy="50" r="47" fill={`url(#${id}-whole-shadow)`} />

      {/* Thin dark green outline */}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="#163d13"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// HALF BODY (left or right) — semicircle showing cut cross-section
// ---------------------------------------------------------------------------
function HalfBody({
  id,
  mode,
  selected,
}: {
  id: string;
  mode: "left" | "right";
  selected: boolean;
}) {
  // The straight cut edge runs vertically at x=50
  // Cut edge gradient: green → white → pink (left-to-right for left half, right-to-left for right half)
  const cutEdgeX = 50;

  return (
    <g
      clipPath={`url(#${id}-shape-clip)`}
      filter={selected ? `url(#${id}-glow)` : `url(#${id}-shadow)`}
    >
      {/* Cut cross-section face */}
      <CutFace id={id} />

      {/* Seeds on the flesh */}
      <Seeds id={id} mode={mode} />

      {/* Cut highlight on flesh */}
      <circle cx="50" cy="50" r="47" fill={`url(#${id}-cut-highlight)`} />

      {/* Outer edge outline (curved side) */}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="#163d13"
        strokeWidth="1.5"
        opacity="0.65"
      />

      {/* Cut edge — the flat straight side showing rind layers */}
      {/* This re-draws the three rind layers as a thin vertical strip */}
      <line
        x1={cutEdgeX}
        y1="3"
        x2={cutEdgeX}
        y2="97"
        stroke="#1e4f1b"
        strokeWidth="2"
        opacity="0.5"
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// QUARTER BODY — upper-right quadrant wedge
// ---------------------------------------------------------------------------
function QuarterBody({
  id,
  selected,
}: {
  id: string;
  selected: boolean;
}) {
  return (
    <g
      clipPath={`url(#${id}-shape-clip)`}
      filter={selected ? `url(#${id}-glow)` : `url(#${id}-shadow)`}
    >
      {/* Cut cross-section face */}
      <CutFace id={id} />

      {/* Seeds */}
      <Seeds id={id} mode="quarter" />

      {/* Highlight */}
      <circle cx="50" cy="50" r="47" fill={`url(#${id}-cut-highlight)`} />

      {/* Outer curved edge */}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="#163d13"
        strokeWidth="1.5"
        opacity="0.65"
      />

      {/* Cut lines at the two straight edges */}
      {/* Vertical cut (left edge of quarter) */}
      <line
        x1="50"
        y1="3"
        x2="50"
        y2="50"
        stroke="#1e4f1b"
        strokeWidth="2"
        opacity="0.50"
      />
      {/* Horizontal cut (bottom edge of quarter) */}
      <line
        x1="50"
        y1="50"
        x2="97"
        y2="50"
        stroke="#1e4f1b"
        strokeWidth="2"
        opacity="0.50"
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------
export function DividableObject({
  type,
  size = 120,
  selected = false,
}: DividableObjectProps) {
  // useId gives a stable, unique prefix; strip colons for valid SVG IDs.
  const rawId = useId();
  const id = `wm${rawId.replace(/:/g, "")}`;

  // ---- WHOLE ----
  if (type === "whole") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Whole watermelon"
        style={{ display: "block", overflow: "visible" }}
      >
        <WatermelonDefs id={id} mode="whole" />
        <WholeBody id={id} selected={selected} />

        {/* Selected: dashed vertical slice indicator */}
        {selected && (
          <line
            x1="50"
            y1="4"
            x2="50"
            y2="96"
            stroke="white"
            strokeWidth="1.8"
            strokeDasharray="4.5 3.5"
            opacity="0.80"
          />
        )}
      </svg>
    );
  }

  // ---- HALF-LEFT ----
  if (type === "half-left") {
    // Viewbox: left half of the 100×100 circle, slight padding
    return (
      <svg
        width={size * 0.52}
        height={size}
        viewBox="-2 0 53 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Left half of watermelon"
        style={{ display: "block", overflow: "visible" }}
      >
        <WatermelonDefs id={id} mode="left" />
        <HalfBody id={id} mode="left" selected={selected} />
      </svg>
    );
  }

  // ---- HALF-RIGHT ----
  if (type === "half-right") {
    return (
      <svg
        width={size * 0.52}
        height={size}
        viewBox="49 0 53 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Right half of watermelon"
        style={{ display: "block", overflow: "visible" }}
      >
        <WatermelonDefs id={id} mode="right" />
        <HalfBody id={id} mode="right" selected={selected} />
      </svg>
    );
  }

  // ---- QUARTER ----
  // viewBox: upper-right quadrant from center
  return (
    <svg
      width={size * 0.55}
      height={size * 0.55}
      viewBox="48 -2 54 54"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Quarter of watermelon"
      style={{ display: "block", overflow: "visible" }}
    >
      <WatermelonDefs id={id} mode="quarter" />
      <QuarterBody id={id} selected={selected} />
    </svg>
  );
}

export default DividableObject;
