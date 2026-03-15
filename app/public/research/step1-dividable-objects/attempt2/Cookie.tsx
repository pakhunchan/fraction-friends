"use client";

import { useMemo } from "react";

interface CookieProps {
  size?: number;
  isHalf?: boolean;
  halfSide?: "left" | "right";
  isQuarter?: boolean;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

// Deterministic pseudo-random number generator (mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate jagged break edge points for cookie cuts
function generateJaggedEdge(
  axis: "vertical" | "horizontal",
  length: number,
  centerOffset: number,
  rng: () => number,
  segments: number = 18
): string {
  const points: [number, number][] = [];
  const step = length / segments;

  for (let i = 0; i <= segments; i++) {
    const t = i * step;
    // More jaggedness in the middle, less at edges
    const edgeFactor = Math.sin((i / segments) * Math.PI);
    const jag = (rng() - 0.5) * 3.5 * edgeFactor;

    if (axis === "vertical") {
      points.push([centerOffset + jag, t]);
    } else {
      points.push([t, centerOffset + jag]);
    }
  }
  return points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
}

// Generate crumb particles near break edges
function generateCrumbs(
  axis: "vertical" | "horizontal",
  centerPos: number,
  length: number,
  rng: () => number,
  count: number = 6
): Array<{ cx: number; cy: number; r: number; opacity: number }> {
  const crumbs = [];
  for (let i = 0; i < count; i++) {
    const along = rng() * length;
    const spread = (rng() - 0.5) * 12;
    const r = 0.6 + rng() * 1.2;
    const opacity = 0.4 + rng() * 0.4;

    if (axis === "vertical") {
      crumbs.push({ cx: centerPos + spread, cy: along, r, opacity });
    } else {
      crumbs.push({ cx: along, cy: centerPos + spread, r, opacity });
    }
  }
  return crumbs;
}

// Generate chocolate chip positions (deterministic per variant)
function generateChips(
  rng: () => number,
  count: number = 8,
  bounds: { x: number; y: number; w: number; h: number },
  clipTest?: (x: number, y: number) => boolean
): Array<{ cx: number; cy: number; rx: number; ry: number; rotation: number }> {
  const chips = [];
  let attempts = 0;
  while (chips.length < count && attempts < count * 5) {
    attempts++;
    const cx = bounds.x + rng() * bounds.w;
    const cy = bounds.y + rng() * bounds.h;
    // Check if inside the cookie circle (center 50,50 radius ~44)
    const dx = cx - 50;
    const dy = cy - 50;
    if (dx * dx + dy * dy > 40 * 40) continue;
    // Apply additional clip test (for halves/quarters)
    if (clipTest && !clipTest(cx, cy)) continue;
    // Check distance from other chips
    const tooClose = chips.some((c) => {
      const d2 = (c.cx - cx) ** 2 + (c.cy - cy) ** 2;
      return d2 < 100; // min ~10px apart
    });
    if (tooClose) continue;

    const rx = 3 + rng() * 2.5;
    const ry = 2.5 + rng() * 2;
    const rotation = rng() * 360;
    chips.push({ cx, cy, rx, ry, rotation });
  }
  return chips;
}

// Unique ID counter for SSR-safe filter IDs
let idCounter = 0;

export function Cookie({
  size = 120,
  isHalf = false,
  halfSide = "left",
  isQuarter = false,
  onClick,
  selected = false,
  disabled = false,
}: CookieProps) {
  // Generate a stable unique ID prefix for SVG filters
  const uid = useMemo(() => `ck${++idCounter}`, []);

  // Seed based on variant for deterministic chip placement
  const variantSeed = isQuarter ? 300 : isHalf ? (halfSide === "left" ? 100 : 200) : 42;
  const rng = mulberry32(variantSeed);

  // --- Quarter cookie ---
  if (isQuarter) {
    const qSize = size * 0.6;
    const chips = generateChips(rng, 3, { x: 50, y: 4, w: 44, h: 44 }, (x, y) => {
      // Must be in top-right quadrant inside circle
      return x >= 50 && y <= 50 && (x - 50) ** 2 + (y - 50) ** 2 < 42 * 42;
    });

    // Jagged edges for the two straight cuts
    const jagV = generateJaggedEdge("vertical", 48, 50, mulberry32(301), 14);
    const jagH = generateJaggedEdge("horizontal", 48, 50, mulberry32(302), 14);

    const crumbsV = generateCrumbs("vertical", 50, 48, mulberry32(303), 3);
    const crumbsH = generateCrumbs("horizontal", 50, 48, mulberry32(304), 3);

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
        <svg width={qSize} height={qSize} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Cookie dough texture */}
            <filter id={`${uid}-tex`} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="4" seed="7" result="noise" />
              <feColorMatrix
                type="matrix"
                in="noise"
                values="0 0 0 0 0.83
                        0 0 0 0 0.54
                        0 0 0 0 0.30
                        0 0 0 0.15 0"
                result="colorNoise"
              />
              <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="2" seed="3" result="bumpNoise" />
              <feDisplacementMap in="SourceGraphic" in2="bumpNoise" scale="2" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feBlend in="displaced" in2="colorNoise" mode="overlay" />
            </filter>
            {/* Baked edge darkening */}
            <radialGradient id={`${uid}-qbake`} cx="0.85" cy="0.15" r="0.75">
              <stop offset="0%" stopColor="#d9944e" />
              <stop offset="60%" stopColor="#c57d3a" />
              <stop offset="85%" stopColor="#a05a20" />
              <stop offset="100%" stopColor="#7a4218" />
            </radialGradient>
            {/* Inner shadow for concavity */}
            <filter id={`${uid}-qinner`}>
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
              <feOffset dx="1" dy="1" result="offsetBlur" />
              <feFlood floodColor="#5a3010" floodOpacity="0.35" />
              <feComposite in2="offsetBlur" operator="in" />
              <feComposite in="SourceGraphic" operator="over" />
            </filter>
            {/* Quarter clip path: arc from top to right, then straight edges with jaggedness */}
            <clipPath id={`${uid}-qclip`}>
              <path d="M 50 50 L 50 4 A 46 46 0 0 1 96 50 Z" />
            </clipPath>
          </defs>

          <g transform="translate(-34, -2)" clipPath={`url(#${uid}-qclip)`}>
            {/* Base cookie shape */}
            <circle cx="50" cy="50" r="45" fill={`url(#${uid}-qbake)`} filter={`url(#${uid}-tex)`} />
            <circle cx="50" cy="50" r="45" fill={`url(#${uid}-qbake)`} opacity="0.5" />

            {/* Subtle surface bumps highlight */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="#e8b06a" strokeWidth="0.5" opacity="0.3" />

            {/* Chocolate chips with shadow */}
            {chips.map((chip, i) => (
              <g key={i}>
                {/* chip shadow */}
                <ellipse
                  cx={chip.cx + 0.8}
                  cy={chip.cy + 1}
                  rx={chip.rx + 0.3}
                  ry={chip.ry + 0.3}
                  fill="#3a2010"
                  opacity="0.4"
                  transform={`rotate(${chip.rotation}, ${chip.cx + 0.8}, ${chip.cy + 1})`}
                />
                {/* chip body */}
                <ellipse
                  cx={chip.cx}
                  cy={chip.cy}
                  rx={chip.rx}
                  ry={chip.ry}
                  fill="#3d2314"
                  transform={`rotate(${chip.rotation}, ${chip.cx}, ${chip.cy})`}
                />
                {/* chip highlight */}
                <ellipse
                  cx={chip.cx - 0.5}
                  cy={chip.cy - 0.5}
                  rx={chip.rx * 0.5}
                  ry={chip.ry * 0.4}
                  fill="#5a3a28"
                  opacity="0.6"
                  transform={`rotate(${chip.rotation}, ${chip.cx}, ${chip.cy})`}
                />
              </g>
            ))}

            {/* Inner concavity shadow */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#6b3e1a" strokeWidth="4" opacity="0.15" filter={`url(#${uid}-qinner)`} />
          </g>

          {/* Crumbs near the cut edges */}
          {[...crumbsV, ...crumbsH].map((crumb, i) => (
            <circle
              key={i}
              cx={crumb.cx - 34}
              cy={crumb.cy - 2}
              r={crumb.r}
              fill="#c8864a"
              opacity={crumb.opacity}
            />
          ))}

          {/* Selection indicator */}
          {selected && (
            <path
              d="M 16 48 L 16 2 A 46 46 0 0 1 56 48 Z"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              opacity="0.8"
            />
          )}
        </svg>
      </button>
    );
  }

  // --- Half cookie ---
  if (isHalf) {
    const hWidth = size * 0.45;
    const hHeight = size * 0.8;

    const isLeft = halfSide === "left";
    const chipTest = isLeft
      ? (x: number, _y: number) => x < 50
      : (x: number, _y: number) => x > 50;

    const chips = generateChips(rng, 5, { x: isLeft ? 6 : 52, y: 8, w: 40, h: 84 }, chipTest);

    const jagRng = mulberry32(isLeft ? 111 : 222);
    const crumbRng = mulberry32(isLeft ? 113 : 223);
    const jaggedEdgePath = generateJaggedEdge("vertical", 90, 50, jagRng, 22);
    const crumbs = generateCrumbs("vertical", 50, 90, crumbRng, 5);

    // Viewport: show left or right half of 100x100
    const vx = isLeft ? 0 : 48;
    const vw = 52;

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
        <svg width={hWidth} height={hHeight} viewBox={`${vx} 2 ${vw} 96`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Cookie dough texture */}
            <filter id={`${uid}-htex`} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="5" seed="12" result="noise" />
              <feColorMatrix
                type="matrix"
                in="noise"
                values="0 0 0 0 0.82
                        0 0 0 0 0.55
                        0 0 0 0 0.32
                        0 0 0 0.12 0"
                result="colorNoise"
              />
              <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="3" seed="5" result="bumpNoise" />
              <feDisplacementMap in="SourceGraphic" in2="bumpNoise" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feBlend in="displaced" in2="colorNoise" mode="overlay" />
            </filter>
            {/* Baked edge gradient */}
            <radialGradient id={`${uid}-hbake`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#dda05c" />
              <stop offset="45%" stopColor="#d4944e" />
              <stop offset="70%" stopColor="#c07a35" />
              <stop offset="88%" stopColor="#9e5d22" />
              <stop offset="100%" stopColor="#7a4218" />
            </radialGradient>
            {/* Inner concavity shadow */}
            <filter id={`${uid}-hinner`}>
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
              <feOffset dx={isLeft ? -1 : 1} dy="1" result="offsetBlur" />
              <feFlood floodColor="#5a3010" floodOpacity="0.3" />
              <feComposite in2="offsetBlur" operator="in" />
              <feComposite in="SourceGraphic" operator="over" />
            </filter>
            {/* Half clip: semicircle with jagged cut edge */}
            <clipPath id={`${uid}-hclip`}>
              {isLeft ? (
                <path d={`M 50 5 A 45 45 0 0 0 50 95 ${jaggedEdgePath.replace("M", "L").replace(/L ([^ ]+) ([^ ]+)/, (_, x, y) => `L ${x} ${y}`)} Z`} />
              ) : (
                <path d={`M 50 5 A 45 45 0 0 1 50 95 ${jaggedEdgePath.replace("M", "L")} Z`} />
              )}
            </clipPath>
            {/* Simplified clip for reliable rendering */}
            <clipPath id={`${uid}-hclip2`}>
              {isLeft ? (
                <path d="M 50 4 A 46 46 0 0 0 50 96 L 50 4 Z" />
              ) : (
                <path d="M 50 4 A 46 46 0 0 1 50 96 L 50 4 Z" />
              )}
            </clipPath>
          </defs>

          <g clipPath={`url(#${uid}-hclip2)`}>
            {/* Base cookie body */}
            <circle cx="50" cy="50" r="45" fill={`url(#${uid}-hbake)`} filter={`url(#${uid}-htex)`} />
            <circle cx="50" cy="50" r="45" fill={`url(#${uid}-hbake)`} opacity="0.45" />

            {/* Subtle ring near the baked edge */}
            <circle cx="50" cy="50" r="43" fill="none" stroke="#b06828" strokeWidth="1.5" opacity="0.2" />

            {/* Surface sugar sparkle dots */}
            {Array.from({ length: 6 }, (_, i) => {
              const sparkRng = mulberry32(variantSeed + 500 + i);
              const angle = sparkRng() * Math.PI * 2;
              const dist = 10 + sparkRng() * 28;
              const sx = 50 + Math.cos(angle) * dist;
              const sy = 50 + Math.sin(angle) * dist;
              if (isLeft && sx > 48) return null;
              if (!isLeft && sx < 52) return null;
              return (
                <circle key={i} cx={sx} cy={sy} r={0.4 + sparkRng() * 0.4} fill="#f0d8a8" opacity={0.3 + sparkRng() * 0.3} />
              );
            })}

            {/* Chocolate chips with raised shadow effect */}
            {chips.map((chip, i) => (
              <g key={i}>
                {/* Drop shadow */}
                <ellipse
                  cx={chip.cx + 1}
                  cy={chip.cy + 1.2}
                  rx={chip.rx + 0.4}
                  ry={chip.ry + 0.4}
                  fill="#2a1508"
                  opacity="0.35"
                  transform={`rotate(${chip.rotation}, ${chip.cx + 1}, ${chip.cy + 1.2})`}
                />
                {/* Chip body - dark chocolate */}
                <ellipse
                  cx={chip.cx}
                  cy={chip.cy}
                  rx={chip.rx}
                  ry={chip.ry}
                  fill="#3d2314"
                  transform={`rotate(${chip.rotation}, ${chip.cx}, ${chip.cy})`}
                />
                {/* Melted edge ring */}
                <ellipse
                  cx={chip.cx}
                  cy={chip.cy}
                  rx={chip.rx + 0.6}
                  ry={chip.ry + 0.5}
                  fill="none"
                  stroke="#5a3a20"
                  strokeWidth="0.5"
                  opacity="0.3"
                  transform={`rotate(${chip.rotation}, ${chip.cx}, ${chip.cy})`}
                />
                {/* Glossy highlight */}
                <ellipse
                  cx={chip.cx - 0.6}
                  cy={chip.cy - 0.6}
                  rx={chip.rx * 0.45}
                  ry={chip.ry * 0.35}
                  fill="#6b4a38"
                  opacity="0.5"
                  transform={`rotate(${chip.rotation}, ${chip.cx}, ${chip.cy})`}
                />
              </g>
            ))}

            {/* Inner shadow for concavity/depth on the break face */}
            <line
              x1="50"
              y1="5"
              x2="50"
              y2="95"
              stroke="#7a4a20"
              strokeWidth="3"
              opacity="0.2"
            />
            <line
              x1={isLeft ? 49 : 51}
              y1="5"
              x2={isLeft ? 49 : 51}
              y2="95"
              stroke="#c49050"
              strokeWidth="1"
              opacity="0.25"
            />
          </g>

          {/* Jagged break edge texture line over the cut */}
          <path
            d={jaggedEdgePath}
            fill="none"
            stroke="#a06030"
            strokeWidth="1.2"
            opacity="0.5"
            strokeLinecap="round"
          />

          {/* Crumb particles scattered near the break */}
          {crumbs.map((crumb, i) => (
            <circle
              key={i}
              cx={crumb.cx}
              cy={crumb.cy + 5}
              r={crumb.r}
              fill="#c8864a"
              opacity={crumb.opacity}
            />
          ))}

          {/* Selection indicator */}
          {selected && (
            <>
              {isLeft ? (
                <path
                  d="M 50 5 A 45 45 0 0 0 50 95"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  opacity="0.8"
                />
              ) : (
                <path
                  d="M 50 5 A 45 45 0 0 1 50 95"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  opacity="0.8"
                />
              )}
            </>
          )}
        </svg>
      </button>
    );
  }

  // --- Whole cookie ---
  const chips = generateChips(rng, 8, { x: 8, y: 8, w: 84, h: 84 });

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
      <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Cookie dough texture via feTurbulence */}
          <filter id={`${uid}-tex`} x="-10%" y="-10%" width="120%" height="120%">
            {/* Fine grain noise for surface texture */}
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" seed="8" result="noise" />
            <feColorMatrix
              type="matrix"
              in="noise"
              values="0 0 0 0 0.82
                      0 0 0 0 0.55
                      0 0 0 0 0.32
                      0 0 0 0.1 0"
              result="colorNoise"
            />
            {/* Larger bumps for surface undulation */}
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" seed="3" result="bumpNoise" />
            <feDisplacementMap in="SourceGraphic" in2="bumpNoise" scale="2" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feBlend in="displaced" in2="colorNoise" mode="overlay" />
          </filter>

          {/* Baked edge darkening - radial gradient darker at circumference */}
          <radialGradient id={`${uid}-bake`} cx="0.48" cy="0.46" r="0.5">
            <stop offset="0%" stopColor="#dda05c" />
            <stop offset="40%" stopColor="#d4944e" />
            <stop offset="65%" stopColor="#c47e38" />
            <stop offset="82%" stopColor="#a86025" />
            <stop offset="95%" stopColor="#8a4a1a" />
            <stop offset="100%" stopColor="#7a4218" />
          </radialGradient>

          {/* Subtle top-light highlight for 3D roundness */}
          <radialGradient id={`${uid}-highlight`} cx="0.4" cy="0.35" r="0.45">
            <stop offset="0%" stopColor="#f0d090" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f0d090" stopOpacity="0" />
          </radialGradient>

          {/* Inner shadow for concavity */}
          <filter id={`${uid}-inner`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
            <feOffset dx="0" dy="2" result="offsetBlur" />
            <feFlood floodColor="#5a3010" floodOpacity="0.25" />
            <feComposite in2="offsetBlur" operator="in" result="innerShadow" />
            <feComposite in="SourceGraphic" in2="innerShadow" operator="over" />
          </filter>

          {/* Outer drop shadow for the whole cookie */}
          <filter id={`${uid}-drop`} x="-15%" y="-15%" width="130%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feOffset dx="0" dy="3" result="shadow" />
            <feFlood floodColor="#000000" floodOpacity="0.3" />
            <feComposite in2="shadow" operator="in" result="dropShadow" />
            <feMerge>
              <feMergeNode in="dropShadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#${uid}-drop)`}>
          {/* Outer baked rim (slightly darker, slightly larger) */}
          <circle cx="50" cy="50" r="46" fill="#6e3a14" opacity="0.4" />

          {/* Main cookie body with texture */}
          <circle cx="50" cy="50" r="45" fill={`url(#${uid}-bake)`} filter={`url(#${uid}-tex)`} />

          {/* Overlay to reinforce the gradient since filter can wash it out */}
          <circle cx="50" cy="50" r="45" fill={`url(#${uid}-bake)`} opacity="0.4" />

          {/* Top highlight for 3D dome feel */}
          <circle cx="50" cy="50" r="44" fill={`url(#${uid}-highlight)`} />

          {/* Baked edge ring detail */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#9e5d22" strokeWidth="1.5" opacity="0.2" />
          <circle cx="50" cy="50" r="42.5" fill="none" stroke="#b87a3a" strokeWidth="0.5" opacity="0.15" />

          {/* Sugar sparkle dots scattered on surface */}
          {Array.from({ length: 10 }, (_, i) => {
            const sparkRng = mulberry32(42 + 600 + i);
            const angle = sparkRng() * Math.PI * 2;
            const dist = 8 + sparkRng() * 32;
            const sx = 50 + Math.cos(angle) * dist;
            const sy = 50 + Math.sin(angle) * dist;
            return (
              <circle key={i} cx={sx} cy={sy} r={0.3 + sparkRng() * 0.5} fill="#f5e0b0" opacity={0.25 + sparkRng() * 0.3} />
            );
          })}

          {/* Chocolate chips with raised shadow effect */}
          {chips.map((chip, i) => (
            <g key={i}>
              {/* Drop shadow beneath chip (offset down-right) */}
              <ellipse
                cx={chip.cx + 1}
                cy={chip.cy + 1.4}
                rx={chip.rx + 0.5}
                ry={chip.ry + 0.5}
                fill="#2a1508"
                opacity="0.35"
                transform={`rotate(${chip.rotation}, ${chip.cx + 1}, ${chip.cy + 1.4})`}
              />
              {/* Chip body */}
              <ellipse
                cx={chip.cx}
                cy={chip.cy}
                rx={chip.rx}
                ry={chip.ry}
                fill="#3d2314"
                transform={`rotate(${chip.rotation}, ${chip.cx}, ${chip.cy})`}
              />
              {/* Slightly melted edge ring */}
              <ellipse
                cx={chip.cx}
                cy={chip.cy}
                rx={chip.rx + 0.8}
                ry={chip.ry + 0.6}
                fill="none"
                stroke="#5a3a20"
                strokeWidth="0.5"
                opacity="0.25"
                transform={`rotate(${chip.rotation}, ${chip.cx}, ${chip.cy})`}
              />
              {/* Glossy highlight on chip */}
              <ellipse
                cx={chip.cx - 0.7}
                cy={chip.cy - 0.7}
                rx={chip.rx * 0.45}
                ry={chip.ry * 0.35}
                fill="#6b4a38"
                opacity="0.5"
                transform={`rotate(${chip.rotation}, ${chip.cx}, ${chip.cy})`}
              />
            </g>
          ))}

          {/* Inner shadow overlay for subtle concavity */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#5a3010" strokeWidth="6" opacity="0.08" />
        </g>

        {/* Slice line indicator when selected */}
        {selected && (
          <line
            x1="50"
            y1="4"
            x2="50"
            y2="96"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.7"
          />
        )}
      </svg>
    </button>
  );
}

// Sliced cookie: shows two halves with a gap
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
      {!leftGone && <Cookie size={size} isHalf halfSide="left" onClick={onClickLeft} />}
      {!rightGone && <Cookie size={size} isHalf halfSide="right" onClick={onClickRight} />}
    </div>
  );
}
