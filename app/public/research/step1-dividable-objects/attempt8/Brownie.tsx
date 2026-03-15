"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// Brownie — Kawaii/cute stylized brownie piece for a kids' fraction-teaching app
//
// Props:
//   type     – "whole" | "half-left" | "half-right" | "quarter" | "eighth"
//   size     – rendered pixel size (default 120, clamp 32-200)
//   selected – show a golden glow + wobble animation
//
// All views use a 100x100 coordinate space internally.
// Uses a slight isometric/3D perspective: top face + front face + right face.
// ---------------------------------------------------------------------------

export type BrownieType =
  | "whole"
  | "half-left"
  | "half-right"
  | "quarter"
  | "eighth";

export interface BrownieProps {
  type: BrownieType;
  size?: number;
  selected?: boolean;
}

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------
const FROSTING_DARK = "#2C1810";
const FROSTING_MID = "#3D2317";
const FROSTING_LIGHT = "#4A2C17";
const CAKE_LIGHT = "#D4A574";
const CAKE_MID = "#C49A6C";
const CAKE_DARK = "#B08860";
const CAKE_CRUMB = "#E0B88A";
const SIDE_SHADOW = "#2E1A0E";

// Sprinkle colors — pastel kawaii palette
const SPRINKLE_COLORS = ["#FFB6C1", "#FFE4A0", "#A8D8EA", "#C3B1E1", "#FFDAB9"];

// ---------------------------------------------------------------------------
// Sprinkle positions (x, y, rotation, colorIndex) on the top face
// Coordinates relative to top-face polygon, roughly 0-100 range
// ---------------------------------------------------------------------------
interface Sprinkle {
  x: number;
  y: number;
  rot: number;
  ci: number;
  len: number; // length of the sprinkle dash
}

const WHOLE_SPRINKLES: Sprinkle[] = [
  { x: 28, y: 30, rot: 35, ci: 0, len: 6 },
  { x: 55, y: 22, rot: -20, ci: 1, len: 5 },
  { x: 72, y: 38, rot: 60, ci: 2, len: 7 },
  { x: 40, y: 48, rot: -45, ci: 3, len: 5 },
  { x: 62, y: 55, rot: 15, ci: 4, len: 6 },
  { x: 20, y: 52, rot: 80, ci: 0, len: 5 },
];

// ---------------------------------------------------------------------------
// Isometric brownie geometry
//
// The brownie is drawn in a pseudo-isometric view:
//   - Top face: a parallelogram (the frosting surface)
//   - Front face: the front side showing cake layers
//   - Right face: the right side (narrower, in shadow)
//
// Whole brownie top-face corners (in 100x100 viewBox):
//   TL = (15, 25)   TR = (75, 15)
//   BL = (10, 55)   BR = (70, 45)
//
// Front face extends down from BL-BR:
//   FL = (10, 75)    FR = (70, 65)
//
// Right face extends down from BR-TR:
//   RB = (70, 65)    RT = (75, 15)  (same as TR)
//   But we need the right-side bottom: (85, 55)
// ---------------------------------------------------------------------------

// Whole brownie vertices
const W = {
  // Top face
  tl: [15, 25],
  tr: [75, 15],
  bl: [10, 55],
  br: [70, 45],
  // Front face bottom
  fl: [10, 78],
  fr: [70, 68],
  // Right face
  rr: [85, 38],
  rb: [85, 58],
};

// Frosting layer thickness on front face (in viewBox units)
const FROST_THICK = 6;

function pts(points: number[][]): string {
  return points.map((p) => p.join(",")).join(" ");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Brownie({
  type = "whole",
  size = 120,
  selected = false,
}: BrownieProps) {
  const uid = useId().replace(/:/g, "");
  const id = `brownie-${uid}`;
  const sz = Math.max(32, Math.min(200, size));

  // Build geometry based on type
  const geom = buildGeometry(type);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={sz}
      height={sz}
      role="img"
      aria-label={`Brownie piece: ${type}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Frosting gradient — top face */}
        <linearGradient id={`${id}-frost`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={FROSTING_LIGHT} />
          <stop offset="50%" stopColor={FROSTING_MID} />
          <stop offset="100%" stopColor={FROSTING_DARK} />
        </linearGradient>

        {/* Glossy shine on frosting */}
        <linearGradient id={`${id}-shine`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Cake interior gradient — front face */}
        <linearGradient id={`${id}-cake`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={CAKE_LIGHT} />
          <stop offset="60%" stopColor={CAKE_MID} />
          <stop offset="100%" stopColor={CAKE_DARK} />
        </linearGradient>

        {/* Cut face gradient (exposed interior) */}
        <linearGradient id={`${id}-cut`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={CAKE_CRUMB} />
          <stop offset="40%" stopColor={CAKE_LIGHT} />
          <stop offset="100%" stopColor={CAKE_MID} />
        </linearGradient>

        {/* Drop shadow filter */}
        <filter id={`${id}-shadow`} x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow
            dx="1.5"
            dy="3"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity="0.35"
          />
        </filter>

        {/* Selected glow filter */}
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="5"
            floodColor="#FFD700"
            floodOpacity="0.7"
          />
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="2"
            floodColor="#FFAA00"
            floodOpacity="0.5"
          />
        </filter>
      </defs>

      {/* Wobble animation style for selected state */}
      {selected && (
        <style>{`
          @keyframes brownie-wobble-${uid} {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
          }
        `}</style>
      )}

      <g
        filter={`url(#${id}-${selected ? "glow" : "shadow"})`}
        style={
          selected
            ? {
                transformOrigin: "50px 50px",
                animation: `brownie-wobble-${uid} 1.2s ease-in-out infinite`,
              }
            : undefined
        }
      >
        {/* Right side face (if visible) */}
        {geom.rightFace && (
          <polygon
            points={pts(geom.rightFace)}
            fill={SIDE_SHADOW}
            stroke={FROSTING_DARK}
            strokeWidth="0.5"
          />
        )}

        {/* Front face — cake interior */}
        {geom.frontFace && (
          <>
            <polygon
              points={pts(geom.frontFace)}
              fill={`url(#${id}-cake)`}
              stroke={FROSTING_DARK}
              strokeWidth="0.5"
            />
            {/* Frosting strip along top of front face */}
            {geom.frostStrip && (
              <polygon
                points={pts(geom.frostStrip)}
                fill={FROSTING_DARK}
                stroke={FROSTING_DARK}
                strokeWidth="0.3"
              />
            )}
            {/* Crumb texture dots on front face */}
            {geom.crumbs.map((c, i) => (
              <circle
                key={`crumb-${i}`}
                cx={c[0]}
                cy={c[1]}
                r={1}
                fill={CAKE_CRUMB}
                opacity={0.5}
              />
            ))}
          </>
        )}

        {/* Cut face (exposed interior for halves/quarters/eighths) */}
        {geom.cutFace && (
          <>
            <polygon
              points={pts(geom.cutFace)}
              fill={`url(#${id}-cut)`}
              stroke={CAKE_DARK}
              strokeWidth="0.5"
            />
            {/* Frosting strip on top of cut face */}
            {geom.cutFrostStrip && (
              <polygon
                points={pts(geom.cutFrostStrip)}
                fill={FROSTING_DARK}
                stroke={FROSTING_DARK}
                strokeWidth="0.3"
              />
            )}
            {/* Crumb dots on cut face */}
            {geom.cutCrumbs.map((c, i) => (
              <circle
                key={`cut-crumb-${i}`}
                cx={c[0]}
                cy={c[1]}
                r={0.9}
                fill={CAKE_CRUMB}
                opacity={0.45}
              />
            ))}
          </>
        )}

        {/* Top face — frosting */}
        <polygon
          points={pts(geom.topFace)}
          fill={`url(#${id}-frost)`}
          stroke={FROSTING_DARK}
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Glossy shine overlay on top face */}
        <polygon
          points={pts(geom.topFace)}
          fill={`url(#${id}-shine)`}
        />

        {/* Frosting drip / puffy edge along front of top */}
        {geom.puffyEdge && (
          <path
            d={geom.puffyEdge}
            fill={FROSTING_MID}
            stroke={FROSTING_DARK}
            strokeWidth="0.4"
            opacity={0.8}
          />
        )}

        {/* Sprinkles on top face */}
        {geom.sprinkles.map((s, i) => (
          <line
            key={`spr-${i}`}
            x1={s.x - (Math.cos((s.rot * Math.PI) / 180) * s.len) / 2}
            y1={s.y - (Math.sin((s.rot * Math.PI) / 180) * s.len) / 2}
            x2={s.x + (Math.cos((s.rot * Math.PI) / 180) * s.len) / 2}
            y2={s.y + (Math.sin((s.rot * Math.PI) / 180) * s.len) / 2}
            stroke={SPRINKLE_COLORS[s.ci % SPRINKLE_COLORS.length]}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        ))}

        {/* Highlight dot — the kawaii shine spot */}
        {geom.shineSpot && (
          <ellipse
            cx={geom.shineSpot[0]}
            cy={geom.shineSpot[1]}
            rx={4}
            ry={2.5}
            fill="white"
            opacity={0.3}
            transform={`rotate(-25, ${geom.shineSpot[0]}, ${geom.shineSpot[1]})`}
          />
        )}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Geometry builder for each type
// ---------------------------------------------------------------------------
interface BrownieGeometry {
  topFace: number[][];
  frontFace: number[][] | null;
  rightFace: number[][] | null;
  cutFace: number[][] | null;
  frostStrip: number[][] | null;
  cutFrostStrip: number[][] | null;
  puffyEdge: string | null;
  sprinkles: Sprinkle[];
  crumbs: number[][];
  cutCrumbs: number[][];
  shineSpot: number[] | null;
}

function buildGeometry(type: BrownieType): BrownieGeometry {
  switch (type) {
    case "whole":
      return wholeGeometry();
    case "half-left":
      return halfLeftGeometry();
    case "half-right":
      return halfRightGeometry();
    case "quarter":
      return quarterGeometry();
    case "eighth":
      return eighthGeometry();
  }
}

function wholeGeometry(): BrownieGeometry {
  const topFace = [W.tl, W.tr, W.br, W.bl];
  const frontFace = [W.bl, W.br, W.fr, W.fl];
  const rightFace = [W.br, W.tr, W.rr, W.rb];
  const frostStrip = [
    W.bl,
    W.br,
    [W.br[0], W.br[1] + FROST_THICK],
    [W.bl[0], W.bl[1] + FROST_THICK],
  ];

  const puffyEdge = buildPuffyEdge(W.bl, W.br, 3);

  const crumbs = [
    [25, 65],
    [45, 62],
    [58, 70],
    [35, 72],
    [50, 58],
  ];

  return {
    topFace,
    frontFace,
    rightFace,
    cutFace: null,
    frostStrip,
    cutFrostStrip: null,
    puffyEdge,
    sprinkles: WHOLE_SPRINKLES,
    crumbs,
    cutCrumbs: [],
    shineSpot: [30, 30],
  };
}

function halfLeftGeometry(): BrownieGeometry {
  // Left half — cut down the middle vertically
  const midTop = midpoint(W.tl, W.tr);
  const midBot = midpoint(W.bl, W.br);
  const midFBot = midpoint(W.fl, W.fr);

  const topFace = [W.tl, midTop, midBot, W.bl];
  const frontFace = [W.bl, midBot, midFBot, W.fl];
  const frostStrip = [
    W.bl,
    midBot,
    [midBot[0], midBot[1] + FROST_THICK],
    [W.bl[0], W.bl[1] + FROST_THICK],
  ];

  // Cut face on the right side (where it was cut)
  const cutFace = [midTop, [midTop[0] + 8, midTop[1] + 7], [midBot[0] + 8, midBot[1] + 7], midBot];
  // Actually, the cut face should show the interior — it replaces the right side face
  const cutFaceReal = [midTop, midBot, midFBot, [midTop[0], midTop[1] + (midFBot[1] - midBot[1])]];
  const cutFrostStrip = [
    midTop,
    midBot,
    [midBot[0], midBot[1] + FROST_THICK],
    [midTop[0], midTop[1] + FROST_THICK],
  ];

  const puffyEdge = buildPuffyEdge(W.bl, midBot, 3);

  const sprinkles = WHOLE_SPRINKLES.filter((s) => s.x < 50).map((s) => ({
    ...s,
    x: s.x - 2,
  }));

  return {
    topFace,
    frontFace,
    rightFace: null,
    cutFace: cutFaceReal,
    frostStrip,
    cutFrostStrip,
    puffyEdge,
    sprinkles,
    crumbs: [
      [20, 65],
      [32, 70],
      [25, 73],
    ],
    cutCrumbs: [
      [midTop[0] - 2, midTop[1] + 18],
      [midTop[0] - 3, midTop[1] + 30],
      [midTop[0] - 1, midTop[1] + 42],
    ],
    shineSpot: [25, 32],
  };
}

function halfRightGeometry(): BrownieGeometry {
  const midTop = midpoint(W.tl, W.tr);
  const midBot = midpoint(W.bl, W.br);
  const midFBot = midpoint(W.fl, W.fr);

  const topFace = [midTop, W.tr, W.br, midBot];
  const frontFace = [midBot, W.br, W.fr, midFBot];
  const rightFace = [W.br, W.tr, W.rr, W.rb];
  const frostStrip = [
    midBot,
    W.br,
    [W.br[0], W.br[1] + FROST_THICK],
    [midBot[0], midBot[1] + FROST_THICK],
  ];

  // Cut face on the left (where it was cut)
  const cutFace = [
    midTop,
    midBot,
    midFBot,
    [midTop[0] - 8, midTop[1] + (midFBot[1] - midBot[1])],
  ];
  const cutFrostStrip = [
    midTop,
    midBot,
    [midBot[0], midBot[1] + FROST_THICK],
    [midTop[0], midTop[1] + FROST_THICK],
  ];

  const puffyEdge = buildPuffyEdge(midBot, W.br, 3);

  const sprinkles = WHOLE_SPRINKLES.filter((s) => s.x >= 45).map((s) => ({
    ...s,
    x: s.x + 2,
  }));

  return {
    topFace,
    frontFace,
    rightFace,
    cutFace,
    frostStrip,
    cutFrostStrip,
    puffyEdge,
    sprinkles,
    crumbs: [
      [50, 62],
      [60, 68],
      [55, 74],
    ],
    cutCrumbs: [
      [midTop[0] + 2, midTop[1] + 16],
      [midTop[0] + 3, midTop[1] + 28],
      [midTop[0] + 1, midTop[1] + 40],
    ],
    shineSpot: [55, 25],
  };
}

function quarterGeometry(): BrownieGeometry {
  // Top-left quarter of the brownie
  const midTopH = midpoint(W.tl, W.tr);
  const midBotH = midpoint(W.bl, W.br);
  const midTopV = midpoint(W.tl, W.bl);
  const midBotV = midpoint(midTopH, midBotH);
  // center point
  const center = midpoint(midTopV, midBotV);

  // Quarter is the top-left quadrant
  const topFace = [W.tl, midTopH, center, midTopV];

  // Front face (bottom edge of the quarter)
  const frontH = 20; // front face height
  const frontFace = [
    midTopV,
    center,
    [center[0], center[1] + frontH],
    [midTopV[0], midTopV[1] + frontH],
  ];
  const frostStrip = [
    midTopV,
    center,
    [center[0], center[1] + FROST_THICK],
    [midTopV[0], midTopV[1] + FROST_THICK],
  ];

  // Cut face on the right
  const cutFace = [
    midTopH,
    center,
    [center[0], center[1] + frontH],
    [midTopH[0], midTopH[1] + frontH],
  ];
  const cutFrostStrip = [
    midTopH,
    center,
    [center[0], center[1] + FROST_THICK],
    [midTopH[0], midTopH[1] + FROST_THICK],
  ];

  const puffyEdge = buildPuffyEdge(midTopV, center, 2.5);

  const sprinkles: Sprinkle[] = [
    { x: 25, y: 32, rot: 30, ci: 0, len: 5 },
    { x: 38, y: 28, rot: -40, ci: 2, len: 5 },
    { x: 22, y: 42, rot: 70, ci: 4, len: 4 },
  ];

  return {
    topFace,
    frontFace,
    rightFace: null,
    cutFace,
    frostStrip,
    cutFrostStrip,
    puffyEdge,
    sprinkles,
    crumbs: [
      [18, center[1] + 8],
      [28, center[1] + 14],
    ],
    cutCrumbs: [
      [midTopH[0] - 2, midTopH[1] + 10],
      [midTopH[0] - 1, midTopH[1] + 18],
    ],
    shineSpot: [25, 30],
  };
}

function eighthGeometry(): BrownieGeometry {
  // An eighth — a small triangular-ish wedge (half of a quarter, cut diagonally)
  // We'll make it a thin rectangular sliver: half of the quarter, cut horizontally
  const midTopH = midpoint(W.tl, W.tr);
  const midTopV = midpoint(W.tl, W.bl);
  const midBotH = midpoint(W.bl, W.br);
  const center = midpoint(midpoint(W.tl, W.br), midpoint(W.tr, W.bl));

  // Eighth = top-left half of the quarter (upper triangle-ish strip)
  // Let's make it a narrow rectangle: top strip of the quarter
  const midLeft = midpoint(W.tl, midTopV);
  const midRight = midpoint(midTopH, center);

  const topFace = [W.tl, midTopH, midRight, midLeft];

  const frontH = 18;
  const frontFace = [
    midLeft,
    midRight,
    [midRight[0], midRight[1] + frontH],
    [midLeft[0], midLeft[1] + frontH],
  ];
  const frostStrip = [
    midLeft,
    midRight,
    [midRight[0], midRight[1] + FROST_THICK],
    [midLeft[0], midLeft[1] + FROST_THICK],
  ];

  // Cut face on the right
  const cutFace = [
    midTopH,
    midRight,
    [midRight[0], midRight[1] + frontH],
    [midTopH[0], midTopH[1] + frontH],
  ];
  const cutFrostStrip = [
    midTopH,
    midRight,
    [midRight[0], midRight[1] + FROST_THICK],
    [midTopH[0], midTopH[1] + FROST_THICK],
  ];

  const puffyEdge = buildPuffyEdge(midLeft, midRight, 2);

  const sprinkles: Sprinkle[] = [
    { x: 30, y: 26, rot: 25, ci: 1, len: 4 },
    { x: 42, y: 22, rot: -30, ci: 3, len: 4 },
  ];

  return {
    topFace,
    frontFace,
    rightFace: null,
    cutFace,
    frostStrip,
    cutFrostStrip,
    puffyEdge,
    sprinkles,
    crumbs: [
      [22, midLeft[1] + 10],
      [35, midLeft[1] + 14],
    ],
    cutCrumbs: [
      [midTopH[0] - 2, midTopH[1] + 10],
    ],
    shineSpot: [30, 24],
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function midpoint(a: number[], b: number[]): number[] {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

function buildPuffyEdge(left: number[], right: number[], amplitude: number): string {
  // A wavy/puffy path along the bottom front edge of the frosting
  const steps = 5;
  const dx = (right[0] - left[0]) / steps;
  const dy = (right[1] - left[1]) / steps;

  let d = `M ${left[0]},${left[1]}`;
  for (let i = 0; i < steps; i++) {
    const x1 = left[0] + dx * i + dx * 0.3;
    const y1 = left[1] + dy * i + dy * 0.3 + amplitude;
    const x2 = left[0] + dx * i + dx * 0.7;
    const y2 = left[1] + dy * i + dy * 0.7 + amplitude;
    const x3 = left[0] + dx * (i + 1);
    const y3 = left[1] + dy * (i + 1);
    d += ` C ${x1},${y1} ${x2},${y2} ${x3},${y3}`;
  }
  // Close back along the straight edge
  d += ` L ${left[0]},${left[1]} Z`;
  return d;
}
