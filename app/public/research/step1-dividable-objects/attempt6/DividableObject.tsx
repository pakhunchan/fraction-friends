"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// DividableObject — Orange (citrus fruit) for a kids' fraction-teaching app
//
// Props:
//   type     – "whole" | "half-left" | "half-right" | "quarter"
//   size     – rendered pixel size (default 120, clamp 32-200)
//   selected – show a glowing/bouncing selected state
//
// All views use a 100×100 coordinate space internally.
//
// Whole   → top-down exterior view: dimpled peel, feTurbulence texture, stem+leaf
// Halves  → cross-section: peel arc + white pith ring + radial citrus segments
// Quarter → cross-section quadrant: 2-3 visible segments, peel arc, pith
// ---------------------------------------------------------------------------

export interface DividableObjectProps {
  type: "whole" | "half-left" | "half-right" | "quarter";
  size?: number;
  selected?: boolean;
}

// ---------------------------------------------------------------------------
// Geometry constants — all in 100×100 viewBox
// ---------------------------------------------------------------------------

// Center of the orange
const CX = 50;
const CY = 50;

// Radii
const R_PEEL = 46;       // outer peel edge
const R_PITH = 39;       // inner edge of white pith (outer edge of flesh)
const R_CORE = 7;        // central pithy core circle
// Number of citrus segments
const NUM_SEGMENTS = 10;

// Segment shade pairs [fill, stroke/vein] — alternating slightly different oranges
const SEGMENT_COLORS: [string, string][] = [
  ["#ff9a2e", "#e8781a"],
  ["#ffaa3a", "#f08a20"],
  ["#ff9228", "#e87218"],
  ["#ffb040", "#f09228"],
  ["#ff9830", "#e87a1e"],
  ["#ffa535", "#ed8520"],
  ["#ff9030", "#e87018"],
  ["#ffac3c", "#f08c24"],
  ["#ff9630", "#e8761c"],
  ["#ffa838", "#f08828"],
];

// ---------------------------------------------------------------------------
// Helper: polar-to-cartesian
// ---------------------------------------------------------------------------
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

// ---------------------------------------------------------------------------
// Build the SVG path for one citrus segment (pie wedge with slight inset)
// ---------------------------------------------------------------------------
function segmentPath(index: number, total: number): string {
  const step = 360 / total;
  const startAngle = index * step;
  const endAngle = startAngle + step;

  // Outer arc (at flesh radius, slightly inset from pith)
  const outerR = R_PITH - 1.5;
  // Inner point (core)
  const innerR = R_CORE + 1;

  const p1 = polar(CX, CY, innerR, startAngle);
  const p2 = polar(CX, CY, outerR, startAngle);
  const p3 = polar(CX, CY, outerR, endAngle);
  const p4 = polar(CX, CY, innerR, endAngle);

  const largeArc = step > 180 ? 1 : 0;

  return [
    `M ${p1.x.toFixed(3)} ${p1.y.toFixed(3)}`,
    `L ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p3.x.toFixed(3)} ${p3.y.toFixed(3)}`,
    `L ${p4.x.toFixed(3)} ${p4.y.toFixed(3)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p1.x.toFixed(3)} ${p1.y.toFixed(3)}`,
    "Z",
  ].join(" ");
}

// ---------------------------------------------------------------------------
// Dividing line between segments (vein line from core out)
// ---------------------------------------------------------------------------
function segmentVeinPath(index: number, total: number): string {
  const step = 360 / total;
  const angle = index * step;
  const inner = polar(CX, CY, R_CORE + 1, angle);
  const outer = polar(CX, CY, R_PITH - 1.5, angle);
  return `M ${inner.x.toFixed(3)} ${inner.y.toFixed(3)} L ${outer.x.toFixed(3)} ${outer.y.toFixed(3)}`;
}

// ---------------------------------------------------------------------------
// SVG Defs — gradients, filters, clip paths
// ---------------------------------------------------------------------------
function OrangeDefs({
  id,
  mode,
}: {
  id: string;
  mode: "whole" | "left" | "right" | "quarter";
}) {
  return (
    <defs>
      {/* ---- Peel exterior gradient (whole view) ---- */}
      <radialGradient id={`${id}-peel`} cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#ffce6b" />
        <stop offset="30%" stopColor="#ffa833" />
        <stop offset="70%" stopColor="#f07e10" />
        <stop offset="100%" stopColor="#c85c00" />
      </radialGradient>

      {/* ---- Peel cross-section gradient (shown on cut sides) ---- */}
      <linearGradient id={`${id}-peel-band`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f07020" />
        <stop offset="50%" stopColor="#ff8c28" />
        <stop offset="100%" stopColor="#f07020" />
      </linearGradient>

      {/* ---- White pith gradient ---- */}
      <radialGradient id={`${id}-pith`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff8f0" />
        <stop offset="80%" stopColor="#ffe8d0" />
        <stop offset="100%" stopColor="#f8d8b8" />
      </radialGradient>

      {/* ---- Central core gradient ---- */}
      <radialGradient id={`${id}-core`} cx="45%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#ffe0a0" />
        <stop offset="100%" stopColor="#f0a840" />
      </radialGradient>

      {/* ---- Flesh base fill (behind segments) ---- */}
      <radialGradient id={`${id}-flesh`} cx="45%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffcc60" />
        <stop offset="60%" stopColor="#ff9a28" />
        <stop offset="100%" stopColor="#e07010" />
      </radialGradient>

      {/* ---- Highlight over cut face ---- */}
      <radialGradient id={`${id}-face-highlight`} cx="40%" cy="35%" r="50%">
        <stop offset="0%" stopColor="white" stopOpacity="0.25" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>

      {/* ---- Peel texture: feTurbulence dimpled surface ---- */}
      <filter id={`${id}-peel-tex`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="turbulence"
          baseFrequency="0.18 0.18"
          numOctaves="4"
          seed="7"
          result="turbNoise"
        />
        <feColorMatrix
          type="saturate"
          values="0"
          in="turbNoise"
          result="grayNoise"
        />
        <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
        <feComponentTransfer in="blended">
          <feFuncR type="linear" slope="1.05" intercept="-0.02" />
          <feFuncG type="linear" slope="0.95" intercept="0.01" />
          <feFuncB type="linear" slope="0.85" intercept="0" />
        </feComponentTransfer>
      </filter>

      {/* ---- Drop shadow ---- */}
      <filter id={`${id}-shadow`} x="-20%" y="-15%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="3"
          stdDeviation="4"
          floodColor="#7a3800"
          floodOpacity="0.35"
        />
      </filter>

      {/* ---- Selected glow ---- */}
      <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feFlood floodColor="#ffb830" floodOpacity="0.85" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* ---- Segment juice-sac texture ---- */}
      <filter id={`${id}-juice`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.55"
          numOctaves="2"
          seed="3"
          result="noise"
        />
        <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
        <feBlend in="SourceGraphic" in2="gray" mode="softLight" />
      </filter>

      {/* ---- Clip paths ---- */}
      {mode === "left" && (
        <clipPath id={`${id}-clip`}>
          <rect x="0" y="0" width="51" height="100" />
        </clipPath>
      )}
      {mode === "right" && (
        <clipPath id={`${id}-clip`}>
          <rect x="49" y="0" width="51" height="100" />
        </clipPath>
      )}
      {mode === "quarter" && (
        <clipPath id={`${id}-clip`}>
          <rect x="49" y="0" width="51" height="51" />
        </clipPath>
      )}
    </defs>
  );
}

// ---------------------------------------------------------------------------
// Whole orange — top-down exterior view with peel texture + stem/leaf
// ---------------------------------------------------------------------------
function WholeOrange({
  id,
  selected,
}: {
  id: string;
  selected: boolean;
}) {
  return (
    <g filter={selected ? `url(#${id}-glow)` : `url(#${id}-shadow)`}>
      {/* Peel base */}
      <circle cx={CX} cy={CY} r={R_PEEL} fill={`url(#${id}-peel)`} />

      {/* Peel texture overlay */}
      <circle
        cx={CX}
        cy={CY}
        r={R_PEEL}
        fill={`url(#${id}-peel)`}
        filter={`url(#${id}-peel-tex)`}
        opacity="0.55"
      />

      {/* Subtle dimple dots scattered on peel surface */}
      <g opacity="0.18">
        {[
          [40, 25], [58, 22], [70, 35], [75, 52], [68, 68],
          [52, 75], [36, 70], [24, 58], [22, 40], [30, 28],
          [50, 35], [64, 48], [42, 62], [32, 48], [56, 60],
          [46, 18], [72, 44], [28, 62], [60, 30], [38, 78],
        ].map(([dx, dy], i) => (
          <circle key={i} cx={dx} cy={dy} r="1.5" fill="#b84800" />
        ))}
      </g>

      {/* Highlight — top-left dome sheen */}
      <ellipse
        cx={41}
        cy={37}
        rx={16}
        ry={12}
        fill="white"
        opacity="0.22"
        transform="rotate(-25 41 37)"
      />

      {/* Outer edge darkening */}
      <circle
        cx={CX}
        cy={CY}
        r={R_PEEL}
        fill="none"
        stroke="#c05800"
        strokeWidth="2"
        opacity="0.5"
      />

      {/* Navel scar at bottom center — small rough circle */}
      <ellipse
        cx={CX}
        cy={CY + 30}
        rx={5}
        ry={4}
        fill="none"
        stroke="#d06808"
        strokeWidth="1.2"
        opacity="0.6"
      />
      <ellipse
        cx={CX}
        cy={CY + 30}
        rx={2.5}
        ry={2}
        fill="#e07818"
        opacity="0.5"
      />

      {/* Stem — short brown rectangle at top */}
      <rect
        x={CX - 2}
        y={CY - R_PEEL - 5}
        width={4}
        height={6}
        rx={1.5}
        fill="#5a3a10"
      />

      {/* Leaf — simple ellipse rotated */}
      <ellipse
        cx={CX + 7}
        cy={CY - R_PEEL - 5}
        rx={8}
        ry={4}
        fill="#3a8a20"
        transform={`rotate(-30 ${CX + 7} ${CY - R_PEEL - 5})`}
      />
      {/* Leaf midvein */}
      <line
        x1={CX + 1}
        y1={CY - R_PEEL - 7}
        x2={CX + 13}
        y2={CY - R_PEEL - 3}
        stroke="#2a6a12"
        strokeWidth="0.8"
        opacity="0.7"
        transform={`rotate(-30 ${CX + 7} ${CY - R_PEEL - 5})`}
      />

      {/* Selected: dashed cut indicator */}
      {selected && (
        <line
          x1={CX}
          y1={CY - R_PEEL + 2}
          x2={CX}
          y2={CY + R_PEEL - 2}
          stroke="white"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.75"
        />
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Cross-section interior — segments, pith ring, core
// The full circle cross-section is drawn, then clipped to the correct region
// ---------------------------------------------------------------------------
function OrangeInterior({ id }: { id: string }) {
  return (
    <g>
      {/* Background flesh color */}
      <circle cx={CX} cy={CY} r={R_PITH - 1} fill={`url(#${id}-flesh)`} />

      {/* Individual segments */}
      <g filter={`url(#${id}-juice)`}>
        {Array.from({ length: NUM_SEGMENTS }, (_, i) => (
          <path
            key={i}
            d={segmentPath(i, NUM_SEGMENTS)}
            fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length][0]}
            stroke={SEGMENT_COLORS[i % SEGMENT_COLORS.length][1]}
            strokeWidth="0.4"
          />
        ))}
      </g>

      {/* Segment vein lines (white pith membrane between segments) */}
      <g>
        {Array.from({ length: NUM_SEGMENTS }, (_, i) => (
          <path
            key={i}
            d={segmentVeinPath(i, NUM_SEGMENTS)}
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.9"
            fill="none"
          />
        ))}
      </g>

      {/* Central core circle */}
      <circle cx={CX} cy={CY} r={R_CORE} fill={`url(#${id}-core)`} />
      <circle
        cx={CX}
        cy={CY}
        r={R_CORE}
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.8"
      />

      {/* White pith ring */}
      <circle
        cx={CX}
        cy={CY}
        r={R_PITH}
        fill="none"
        stroke={`url(#${id}-pith)`}
        strokeWidth="6"
      />

      {/* Inner pith edge fine line */}
      <circle
        cx={CX}
        cy={CY}
        r={R_PITH - 3.5}
        fill="none"
        stroke="rgba(255,240,220,0.6)"
        strokeWidth="0.6"
      />

      {/* Face highlight */}
      <circle
        cx={CX}
        cy={CY}
        r={R_PITH - 1}
        fill={`url(#${id}-face-highlight)`}
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Peel exterior arc (for cut views) — drawn as a thick stroke arc / annulus
// For half/quarter, we show the peel as an orange arc band on the outside
// ---------------------------------------------------------------------------
function PeelExterior({ id }: { id: string }) {
  return (
    <g>
      {/* Outer peel band */}
      <circle
        cx={CX}
        cy={CY}
        r={R_PEEL - 3.5}
        fill="none"
        stroke="#f07820"
        strokeWidth="7"
        filter={`url(#${id}-peel-tex)`}
        opacity="0.95"
      />
      {/* Outer edge line */}
      <circle
        cx={CX}
        cy={CY}
        r={R_PEEL}
        fill="none"
        stroke="#c05000"
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* Inner peel edge (transitions to pith) */}
      <circle
        cx={CX}
        cy={CY}
        r={R_PEEL - 7}
        fill="none"
        stroke="#e07018"
        strokeWidth="0.8"
        opacity="0.5"
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Cut edge — the flat sawn face on halves and quarters
// Orange peel cross-section color along the straight edges
// ---------------------------------------------------------------------------
function CutEdge({
  mode,
  id,
}: {
  mode: "left" | "right" | "quarter";
  id: string;
}) {
  if (mode === "left") {
    return (
      <line
        x1={CX}
        y1={CY - R_PEEL}
        x2={CX}
        y2={CY + R_PEEL}
        stroke={`url(#${id}-peel-band)`}
        strokeWidth="3"
        strokeLinecap="round"
      />
    );
  }
  if (mode === "right") {
    return (
      <line
        x1={CX}
        y1={CY - R_PEEL}
        x2={CX}
        y2={CY + R_PEEL}
        stroke={`url(#${id}-peel-band)`}
        strokeWidth="3"
        strokeLinecap="round"
      />
    );
  }
  // quarter
  return (
    <>
      <line
        x1={CX}
        y1={CY - R_PEEL}
        x2={CX}
        y2={CY}
        stroke={`url(#${id}-peel-band)`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1={CX}
        y1={CY}
        x2={CX + R_PEEL}
        y2={CY}
        stroke={`url(#${id}-peel-band)`}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Half orange cross-section
// ---------------------------------------------------------------------------
function HalfOrange({
  id,
  mode,
  selected,
}: {
  id: string;
  mode: "left" | "right";
  selected: boolean;
}) {
  return (
    <g
      clipPath={`url(#${id}-clip)`}
      filter={selected ? `url(#${id}-glow)` : `url(#${id}-shadow)`}
    >
      <OrangeInterior id={id} />
      <PeelExterior id={id} />
      <CutEdge mode={mode} id={id} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Quarter orange cross-section
// ---------------------------------------------------------------------------
function QuarterOrange({
  id,
  selected,
}: {
  id: string;
  selected: boolean;
}) {
  return (
    <g
      clipPath={`url(#${id}-clip)`}
      filter={selected ? `url(#${id}-glow)` : `url(#${id}-shadow)`}
    >
      <OrangeInterior id={id} />
      <PeelExterior id={id} />
      <CutEdge mode="quarter" id={id} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Main DividableObject component
// ---------------------------------------------------------------------------
export function DividableObject({
  type,
  size = 120,
  selected = false,
}: DividableObjectProps) {
  const rawId = useId();
  // Strip colons — invalid in SVG ID references
  const id = rawId.replace(/:/g, "");

  const clampedSize = Math.max(32, Math.min(200, size));

  // ---- Whole ----
  if (type === "whole") {
    return (
      <svg
        width={clampedSize}
        height={clampedSize}
        viewBox="-4 -12 108 116"
        xmlns="http://www.w3.org/2000/svg"
        style={
          selected
            ? {
                animation: "orangeBounce 0.6s ease-in-out infinite alternate",
              }
            : undefined
        }
      >
        <style>{`
          @keyframes orangeBounce {
            from { transform: translateY(0px); }
            to   { transform: translateY(-4px); }
          }
        `}</style>
        <OrangeDefs id={id} mode="whole" />
        <WholeOrange id={id} selected={selected} />
      </svg>
    );
  }

  // ---- Half Left ----
  if (type === "half-left") {
    const w = clampedSize * 0.52;
    const h = clampedSize * 0.96;
    return (
      <svg
        width={w}
        height={h}
        viewBox="-5 2 57 96"
        xmlns="http://www.w3.org/2000/svg"
        style={
          selected
            ? { animation: "orangeBounce 0.6s ease-in-out infinite alternate" }
            : undefined
        }
      >
        <style>{`
          @keyframes orangeBounce {
            from { transform: translateY(0px); }
            to   { transform: translateY(-4px); }
          }
        `}</style>
        <OrangeDefs id={id} mode="left" />
        <HalfOrange id={id} mode="left" selected={selected} />
      </svg>
    );
  }

  // ---- Half Right ----
  if (type === "half-right") {
    const w = clampedSize * 0.52;
    const h = clampedSize * 0.96;
    return (
      <svg
        width={w}
        height={h}
        viewBox="48 2 57 96"
        xmlns="http://www.w3.org/2000/svg"
        style={
          selected
            ? { animation: "orangeBounce 0.6s ease-in-out infinite alternate" }
            : undefined
        }
      >
        <style>{`
          @keyframes orangeBounce {
            from { transform: translateY(0px); }
            to   { transform: translateY(-4px); }
          }
        `}</style>
        <OrangeDefs id={id} mode="right" />
        <HalfOrange id={id} mode="right" selected={selected} />
      </svg>
    );
  }

  // ---- Quarter ----
  const qSize = clampedSize * 0.58;
  return (
    <svg
      width={qSize}
      height={qSize}
      viewBox="48 2 54 52"
      xmlns="http://www.w3.org/2000/svg"
      style={
        selected
          ? { animation: "orangeBounce 0.6s ease-in-out infinite alternate" }
          : undefined
      }
    >
      <style>{`
        @keyframes orangeBounce {
          from { transform: translateY(0px); }
          to   { transform: translateY(-4px); }
        }
      `}</style>
      <OrangeDefs id={id} mode="quarter" />
      <QuarterOrange id={id} selected={selected} />
    </svg>
  );
}

export default DividableObject;
