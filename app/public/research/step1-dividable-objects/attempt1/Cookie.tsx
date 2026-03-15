"use client";

import { useId } from "react";

interface CookieProps {
  size?: number;
  isHalf?: boolean;
  halfSide?: "left" | "right";
  isQuarter?: boolean;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

// -------------------------------------------------------------------
// Cookie edge path — a slightly wobbly circle for organic feel.
// Center (50,50), nominal radius 45. Defined as a closed cubic bezier
// loop with small perturbations so it doesn't look machine-perfect.
// -------------------------------------------------------------------
const COOKIE_EDGE =
  "M50,4 C62,3.5 75,9 83,17 C91,25 96,38 96.5,50 " +
  "C97,62 92,76 84,84 C76,92 63,97 50,96.5 " +
  "C37,96 24,91 16,83 C8,75 3,62 3.5,50 " +
  "C4,38 9,25 17,17 C25,9 38,4.5 50,4 Z";

// Half-cookie edges. These trace the curved side of the cookie and then
// come back along the straight cut line (x = 50).
const HALF_LEFT_EDGE =
  "M50,4 C38,4.5 25,9 17,17 C9,25 4,38 3.5,50 " +
  "C3,62 8,75 16,83 C24,91 37,96 50,96.5 Z";

const HALF_RIGHT_EDGE =
  "M50,4 C62,3.5 75,9 83,17 C91,25 96,38 96.5,50 " +
  "C97,62 92,76 84,84 C76,92 63,97 50,96.5 Z";

// Quarter cookie: upper-right quadrant wedge from center (50,50).
const QUARTER_EDGE =
  "M50,50 L50,4 C62,3.5 75,9 83,17 C91,25 96,38 96.5,50 Z";

// -------------------------------------------------------------------
// Chocolate chip positions — irregular placement with varied sizes
// Each chip: [cx, cy, rx, ry, rotation]
// -------------------------------------------------------------------
const CHIPS: [number, number, number, number, number][] = [
  [30, 32, 5.5, 4.5, -15],
  [56, 24, 4.5, 5, 10],
  [72, 38, 5, 4, 25],
  [22, 58, 4, 5, -5],
  [44, 52, 5.5, 4.5, 35],
  [65, 62, 4.5, 5.5, -20],
  [36, 76, 5, 4, 15],
  [58, 78, 4, 4.5, -30],
  [78, 58, 4.5, 4, 5],
  [42, 36, 3.5, 4, 40],
];

function isChipInRegion(
  cx: number,
  cy: number,
  mode: "whole" | "left" | "right" | "quarter"
): boolean {
  // For half/quarter, decide which chips are visible
  switch (mode) {
    case "whole":
      return true;
    case "left":
      return cx <= 52; // slight overlap tolerance at cut line
    case "right":
      return cx >= 48;
    case "quarter":
      return cx >= 48 && cy <= 52;
  }
}

// -------------------------------------------------------------------
// SVG Defs block — gradients, filters, clip paths
// -------------------------------------------------------------------
function CookieDefs({ id, mode }: { id: string; mode: "whole" | "left" | "right" | "quarter" }) {
  return (
    <defs>
      {/* Main cookie body gradient — radial, lighter center, darker edges */}
      <radialGradient id={`${id}-body`} cx="45%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#eab06a" />
        <stop offset="45%" stopColor="#d4894e" />
        <stop offset="85%" stopColor="#c07a3e" />
        <stop offset="100%" stopColor="#a86830" />
      </radialGradient>

      {/* Highlight on top-left for a subtle 3D dome effect */}
      <radialGradient id={`${id}-highlight`} cx="35%" cy="30%" r="40%">
        <stop offset="0%" stopColor="white" stopOpacity="0.30" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>

      {/* Shadow on bottom for depth */}
      <radialGradient id={`${id}-shadow`} cx="55%" cy="65%" r="50%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="60%" stopColor="transparent" />
        <stop offset="100%" stopColor="#5a3010" stopOpacity="0.25" />
      </radialGradient>

      {/* Subtle texture noise filter */}
      <filter id={`${id}-texture`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
        <feColorMatrix
          type="saturate"
          values="0"
          in="noise"
          result="grayNoise"
        />
        <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="textured" />
        <feComponentTransfer in="textured">
          <feFuncA type="linear" slope="1" />
        </feComponentTransfer>
      </filter>

      {/* Drop shadow filter for overall cookie */}
      <filter id={`${id}-dropshadow`} x="-15%" y="-10%" width="130%" height="135%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3a1a00" floodOpacity="0.35" />
      </filter>

      {/* Chocolate chip gradient */}
      <radialGradient id={`${id}-chip`} cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#5a3820" />
        <stop offset="50%" stopColor="#3d2314" />
        <stop offset="100%" stopColor="#2a1508" />
      </radialGradient>

      {/* Chip highlight */}
      <radialGradient id={`${id}-chipHighlight`} cx="35%" cy="30%" r="45%">
        <stop offset="0%" stopColor="white" stopOpacity="0.22" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>

      {/* Cut edge gradient — lighter "crumb" color */}
      <linearGradient id={`${id}-cutEdge`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#e8c088" />
        <stop offset="50%" stopColor="#dbb478" />
        <stop offset="100%" stopColor="#e8c088" />
      </linearGradient>

      {/* Selected glow filter */}
      <filter id={`${id}-glow`} x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feFlood floodColor="#60a5fa" floodOpacity="0.7" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Clip paths for half and quarter views */}
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

// -------------------------------------------------------------------
// Cookie body: the main shape, texture, chips, highlights
// -------------------------------------------------------------------
function CookieBody({
  id,
  mode,
  selected,
}: {
  id: string;
  mode: "whole" | "left" | "right" | "quarter";
  selected: boolean;
}) {
  const edgePath =
    mode === "whole"
      ? COOKIE_EDGE
      : mode === "left"
        ? HALF_LEFT_EDGE
        : mode === "right"
          ? HALF_RIGHT_EDGE
          : QUARTER_EDGE;

  const showCutEdge = mode !== "whole";

  return (
    <g filter={selected ? `url(#${id}-glow)` : `url(#${id}-dropshadow)`}>
      {/* Main cookie shape with gradient */}
      <path d={edgePath} fill={`url(#${id}-body)`} />

      {/* Subtle texture overlay */}
      <path d={edgePath} fill={`url(#${id}-body)`} filter={`url(#${id}-texture)`} opacity="0.35" />

      {/* Small dimples / surface detail — tiny circles scattered */}
      <g opacity="0.12">
        {[
          [25, 25], [40, 18], [60, 35], [75, 50],
          [20, 50], [55, 45], [35, 70], [65, 75],
          [45, 60], [30, 85], [70, 25], [80, 68],
        ]
          .filter(([cx, cy]) => isChipInRegion(cx, cy, mode))
          .map(([cx, cy], i) => (
            <circle key={`dimple-${i}`} cx={cx} cy={cy} r="1.8" fill="#a06020" />
          ))}
      </g>

      {/* Chocolate chips */}
      <g>
        {CHIPS.filter(([cx, cy]) => isChipInRegion(cx, cy, mode)).map(
          ([cx, cy, rx, ry, rot], i) => (
            <g key={`chip-${i}`} transform={`rotate(${rot} ${cx} ${cy})`}>
              {/* Chip shadow */}
              <ellipse cx={cx + 0.5} cy={cy + 1} rx={rx} ry={ry} fill="#1a0a00" opacity="0.25" />
              {/* Chip body */}
              <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-chip)`} />
              {/* Chip highlight */}
              <ellipse cx={cx} cy={cy} rx={rx * 0.8} ry={ry * 0.8} fill={`url(#${id}-chipHighlight)`} />
            </g>
          )
        )}
      </g>

      {/* Top highlight for dome/3D effect */}
      <path d={edgePath} fill={`url(#${id}-highlight)`} />

      {/* Bottom shadow for depth */}
      <path d={edgePath} fill={`url(#${id}-shadow)`} />

      {/* Cut edge — a thin strip along the straight side */}
      {showCutEdge && mode === "left" && (
        <line
          x1="50" y1="5" x2="50" y2="96"
          stroke={`url(#${id}-cutEdge)`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {showCutEdge && mode === "right" && (
        <line
          x1="50" y1="5" x2="50" y2="96"
          stroke={`url(#${id}-cutEdge)`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {showCutEdge && mode === "quarter" && (
        <>
          <line
            x1="50" y1="5" x2="50" y2="50"
            stroke={`url(#${id}-cutEdge)`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="50" y1="50" x2="96" y2="50"
            stroke={`url(#${id}-cutEdge)`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Edge darkening — a slightly darker stroke around the outer curved edge */}
      <path
        d={edgePath}
        fill="none"
        stroke="#8b5a2a"
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* Dashed slice indicator when selected on a whole cookie */}
      {selected && mode === "whole" && (
        <line
          x1="50" y1="4" x2="50" y2="96"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.7"
        />
      )}
    </g>
  );
}

// -------------------------------------------------------------------
// Main Cookie component
// -------------------------------------------------------------------
export function Cookie({
  size = 120,
  isHalf = false,
  halfSide = "left",
  isQuarter = false,
  onClick,
  selected = false,
  disabled = false,
}: CookieProps) {
  // useId is stable across server/client renders, avoiding hydration mismatches.
  // We strip colons since they are not valid in SVG ID references.
  const id = useId().replace(/:/g, "");

  // Quarter cookie
  if (isQuarter) {
    const qSize = size * 0.6;
    return (
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`cookie-drop transition-transform ${
          selected ? "ring-4 ring-blue-400 scale-110" : ""
        } ${!disabled && onClick ? "cursor-pointer hover:scale-105 active:scale-95" : ""} ${
          disabled ? "opacity-80" : ""
        }`}
        style={{ width: qSize, height: qSize, background: "none", border: "none", padding: 0 }}
      >
        <svg
          width={qSize}
          height={qSize}
          viewBox="44 -2 56 56"
          xmlns="http://www.w3.org/2000/svg"
        >
          <CookieDefs id={id} mode="quarter" />
          <CookieBody id={id} mode="quarter" selected={selected} />
        </svg>
      </button>
    );
  }

  // Half cookie
  if (isHalf) {
    const hWidth = size * 0.45;
    const hHeight = size * 0.85;
    const mode = halfSide === "left" ? "left" : "right";
    const viewBox =
      mode === "left" ? "-2 -2 56 104" : "46 -2 56 104";

    return (
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`cookie-drop transition-transform ${
          selected ? "ring-4 ring-blue-400 scale-110" : ""
        } ${!disabled && onClick ? "cursor-pointer hover:scale-105 active:scale-95" : ""} ${
          disabled ? "opacity-80" : ""
        }`}
        style={{ width: hWidth, height: hHeight, background: "none", border: "none", padding: 0 }}
      >
        <svg
          width={hWidth}
          height={hHeight}
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
        >
          <CookieDefs id={id} mode={mode} />
          <CookieBody id={id} mode={mode} selected={selected} />
        </svg>
      </button>
    );
  }

  // Whole cookie
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`cookie-drop transition-transform ${
        selected ? "ring-4 ring-blue-400 rounded-full scale-110" : ""
      } ${!disabled && onClick ? "cursor-pointer hover:scale-105 active:scale-95" : ""} ${
        disabled ? "opacity-80" : ""
      }`}
      style={{ width: size, height: size, background: "none", border: "none", padding: 0 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="-2 -2 104 104"
        xmlns="http://www.w3.org/2000/svg"
      >
        <CookieDefs id={id} mode="whole" />
        <CookieBody id={id} mode="whole" selected={selected} />
      </svg>
    </button>
  );
}

// -------------------------------------------------------------------
// SlicedCookie — shows two halves side by side with a gap
// -------------------------------------------------------------------
export function SlicedCookie({
  size = 120,
  onClickLeft,
  onClickRight,
  leftGone,
  rightGone,
}: {
  size?: number;
  onClickLeft?: () => void;
  onClickRight?: () => void;
  leftGone?: boolean;
  rightGone?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 cookie-slice">
      {!leftGone && (
        <Cookie size={size} isHalf halfSide="left" onClick={onClickLeft} />
      )}
      {!rightGone && (
        <Cookie size={size} isHalf halfSide="right" onClick={onClickRight} />
      )}
    </div>
  );
}
