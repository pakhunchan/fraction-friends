"use client";

import React, { useMemo } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PizzaType = "whole" | "half-left" | "half-right" | "quarter";

interface DividableObjectProps {
  type: PizzaType;
  size?: number;
  selected?: boolean;
}

// ---------------------------------------------------------------------------
// Deterministic PRNG — mulberry32
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seed per type so toppings are stable and different per slice variant
const TYPE_SEEDS: Record<PizzaType, number> = {
  whole: 42,
  "half-left": 101,
  "half-right": 202,
  quarter: 303,
};

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

// Returns true if a point (cx,cy) is inside the pizza circle (center 50,50, r~44)
function inPizzaCircle(cx: number, cy: number, r = 43): boolean {
  return (cx - 50) ** 2 + (cy - 50) ** 2 <= r * r;
}

function inRegion(cx: number, cy: number, type: PizzaType): boolean {
  if (!inPizzaCircle(cx, cy)) return false;
  switch (type) {
    case "whole":
      return true;
    case "half-left":
      return cx <= 51;
    case "half-right":
      return cx >= 49;
    case "quarter":
      // upper-right quadrant
      return cx >= 49 && cy <= 51;
    default:
      return true;
  }
}

// ---------------------------------------------------------------------------
// Topping generation
// ---------------------------------------------------------------------------

type Pepperoni = { cx: number; cy: number; r: number };
type Mushroom = { cx: number; cy: number; angle: number };
type Olive = { cx: number; cy: number };
type Pepper = { cx: number; cy: number; angle: number };

function generateToppings(type: PizzaType) {
  const seed = TYPE_SEEDS[type];
  const rng = mulberry32(seed);

  // Candidate positions — try to place inside pizza area
  function candidatePoint(innerR = 10, outerR = 38): [number, number] {
    const angle = rng() * Math.PI * 2;
    const dist = innerR + rng() * (outerR - innerR);
    return [50 + Math.cos(angle) * dist, 50 + Math.sin(angle) * dist];
  }

  const pepperoni: Pepperoni[] = [];
  for (let i = 0; i < 9; i++) {
    const [cx, cy] = candidatePoint(8, 36);
    if (inRegion(cx, cy, type)) {
      pepperoni.push({ cx, cy, r: 4.5 + rng() * 1.5 });
    } else {
      // Consume rng anyway
      rng();
    }
  }

  const mushrooms: Mushroom[] = [];
  for (let i = 0; i < 6; i++) {
    const [cx, cy] = candidatePoint(12, 40);
    if (inRegion(cx, cy, type)) {
      mushrooms.push({ cx, cy, angle: rng() * 360 });
    } else {
      rng();
    }
  }

  const olives: Olive[] = [];
  for (let i = 0; i < 5; i++) {
    const [cx, cy] = candidatePoint(10, 38);
    if (inRegion(cx, cy, type)) {
      olives.push({ cx, cy });
    } else {
      rng();
    }
  }

  const peppers: Pepper[] = [];
  for (let i = 0; i < 5; i++) {
    const [cx, cy] = candidatePoint(10, 38);
    if (inRegion(cx, cy, type)) {
      peppers.push({ cx, cy, angle: rng() * 360 });
    } else {
      rng();
    }
  }

  return { pepperoni, mushrooms, olives, peppers };
}

// ---------------------------------------------------------------------------
// Cheese string path for cut edges
// ---------------------------------------------------------------------------
// Generates a wiggly path simulating melted cheese draping off the cut edge.
// axis: "vertical" means the cut is vertical (half-left/right), at x=50
//       "horizontal" means the cut is horizontal (quarter bottom edge), at y=50

function cheeseStrings(
  axis: "vertical" | "horizontal",
  cutPos: number,
  start: number,
  end: number,
  rng: () => number,
  count = 5
): string[] {
  const paths: string[] = [];
  for (let i = 0; i < count; i++) {
    const along = start + ((end - start) * (i + 0.5 + (rng() - 0.5) * 0.4)) / count;
    const dripLen = 2 + rng() * 3.5;
    const wobble = (rng() - 0.5) * 2;

    if (axis === "vertical") {
      // drips going left (towards cut face)
      const x0 = cutPos;
      const y0 = along;
      const x1 = cutPos - dripLen;
      const y1 = y0 + wobble;
      paths.push(`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${y0 + wobble * 0.5} ${x1} ${y1}`);
    } else {
      const x0 = along;
      const y0 = cutPos;
      const x1 = x0 + wobble;
      const y1 = cutPos + dripLen;
      paths.push(`M ${x0} ${y0} Q ${x0 + wobble * 0.5} ${(y0 + y1) / 2} ${x1} ${y1}`);
    }
  }
  return paths;
}

// ---------------------------------------------------------------------------
// ID counter (SSR-safe)
// ---------------------------------------------------------------------------

let _idCounter = 0;

// ---------------------------------------------------------------------------
// SVG Defs
// ---------------------------------------------------------------------------

function PizzaDefs({ uid, type }: { uid: string; type: PizzaType }) {
  return (
    <defs>
      {/* ---- Gradients ---- */}

      {/* Crust outer ring — golden brown linear from top-left to bottom-right */}
      <linearGradient id={`${uid}-crust`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f0c070" />
        <stop offset="30%" stopColor="#e8a84a" />
        <stop offset="65%" stopColor="#d4813a" />
        <stop offset="100%" stopColor="#b86020" />
      </linearGradient>

      {/* Crust edge darkening — radial, darker at circumference */}
      <radialGradient id={`${uid}-crustRim`} cx="50%" cy="50%" r="50%">
        <stop offset="72%" stopColor="transparent" />
        <stop offset="88%" stopColor="#c87830" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#8a4510" stopOpacity="0.7" />
      </radialGradient>

      {/* Sauce — deep red radial, slightly off-center highlight */}
      <radialGradient id={`${uid}-sauce`} cx="42%" cy="38%" r="55%">
        <stop offset="0%" stopColor="#e84030" />
        <stop offset="40%" stopColor="#cc2a1a" />
        <stop offset="80%" stopColor="#b01e12" />
        <stop offset="100%" stopColor="#8a1408" />
      </radialGradient>

      {/* Cheese — warm yellow radial, bright center */}
      <radialGradient id={`${uid}-cheese`} cx="48%" cy="45%" r="52%">
        <stop offset="0%" stopColor="#fdf0a0" />
        <stop offset="35%" stopColor="#f5d85a" />
        <stop offset="70%" stopColor="#e8c035" />
        <stop offset="100%" stopColor="#d4a820" />
      </radialGradient>

      {/* Cheese highlight — top-left sheen */}
      <radialGradient id={`${uid}-cheeseShine`} cx="35%" cy="30%" r="40%">
        <stop offset="0%" stopColor="white" stopOpacity="0.28" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>

      {/* Cut-face cheese color — lighter edge */}
      <linearGradient id={`${uid}-cheeseCut`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fce878" />
        <stop offset="50%" stopColor="#fff3a8" />
        <stop offset="100%" stopColor="#fce878" />
      </linearGradient>

      {/* Pepperoni base gradient */}
      <radialGradient id={`${uid}-pepp`} cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#d44030" />
        <stop offset="50%" stopColor="#b82818" />
        <stop offset="100%" stopColor="#8a1508" />
      </radialGradient>

      {/* Pepperoni grease shine */}
      <radialGradient id={`${uid}-peppShine`} cx="35%" cy="30%" r="50%">
        <stop offset="0%" stopColor="#ff8070" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ff8070" stopOpacity="0" />
      </radialGradient>

      {/* Olive gradient */}
      <radialGradient id={`${uid}-olive`} cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="60%" stopColor="#282828" />
        <stop offset="100%" stopColor="#111111" />
      </radialGradient>

      {/* Drop shadow */}
      <filter id={`${uid}-drop`} x="-15%" y="-10%" width="130%" height="135%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
        <feOffset dx="0" dy="3" result="shadow" />
        <feFlood floodColor="#000000" floodOpacity="0.28" />
        <feComposite in2="shadow" operator="in" result="ds" />
        <feMerge>
          <feMergeNode in="ds" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Cheese texture via feTurbulence */}
      <filter id={`${uid}-cheeseTex`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.055"
          numOctaves="3"
          seed="17"
          result="noise"
        />
        <feColorMatrix
          type="matrix"
          in="noise"
          values="0 0 0 0 0.95
                  0 0 0 0 0.82
                  0 0 0 0 0.20
                  0 0 0 0.10 0"
          result="colorNoise"
        />
        <feBlend in="SourceGraphic" in2="colorNoise" mode="overlay" />
      </filter>

      {/* Crust surface texture */}
      <filter id={`${uid}-crustTex`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="4" seed="5" result="noise" />
        <feColorMatrix
          type="matrix"
          in="noise"
          values="0 0 0 0 0.82
                  0 0 0 0 0.55
                  0 0 0 0 0.22
                  0 0 0 0.12 0"
          result="colorNoise"
        />
        <feBlend in="SourceGraphic" in2="colorNoise" mode="multiply" />
      </filter>

      {/* Selection glow */}
      <filter id={`${uid}-glow`} x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feFlood floodColor="#fbbf24" floodOpacity="0.75" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Clip paths */}
      {type === "half-left" && (
        <clipPath id={`${uid}-clip`}>
          <rect x="0" y="0" width="51" height="100" />
        </clipPath>
      )}
      {type === "half-right" && (
        <clipPath id={`${uid}-clip`}>
          <rect x="49" y="0" width="51" height="100" />
        </clipPath>
      )}
      {type === "quarter" && (
        <clipPath id={`${uid}-clip`}>
          <rect x="49" y="0" width="51" height="51" />
        </clipPath>
      )}
    </defs>
  );
}

// ---------------------------------------------------------------------------
// Topping renderers
// ---------------------------------------------------------------------------

function PepperoniTopping({ p, uid }: { p: { cx: number; cy: number; r: number }; uid: string }) {
  return (
    <g>
      {/* Shadow beneath pepperoni */}
      <circle cx={p.cx + 0.8} cy={p.cy + 1} r={p.r + 0.5} fill="#4a0800" opacity="0.3" />
      {/* Main body */}
      <circle cx={p.cx} cy={p.cy} r={p.r} fill={`url(#${uid}-pepp)`} />
      {/* Greasy shine */}
      <circle cx={p.cx} cy={p.cy} r={p.r * 0.85} fill={`url(#${uid}-peppShine)`} />
      {/* Edge crisping */}
      <circle cx={p.cx} cy={p.cy} r={p.r} fill="none" stroke="#7a1008" strokeWidth="0.6" opacity="0.5" />
      {/* Small blistered bubbles */}
      <circle cx={p.cx - p.r * 0.3} cy={p.cy - p.r * 0.35} r={p.r * 0.15} fill="#c83020" opacity="0.6" />
      <circle cx={p.cx + p.r * 0.2} cy={p.cy + p.r * 0.25} r={p.r * 0.1} fill="#c83020" opacity="0.5" />
    </g>
  );
}

function MushroomTopping({ m }: { m: { cx: number; cy: number; angle: number } }) {
  // Simple mushroom: dome cap + stem
  return (
    <g transform={`rotate(${m.angle} ${m.cx} ${m.cy})`}>
      {/* Shadow */}
      <ellipse cx={m.cx + 0.5} cy={m.cy + 0.8} rx="4.5" ry="3" fill="#2a1a08" opacity="0.25" />
      {/* Cap */}
      <ellipse cx={m.cx} cy={m.cy - 1} rx="4.2" ry="2.6" fill="#d4b88a" />
      <ellipse cx={m.cx} cy={m.cy - 1} rx="4.2" ry="2.6" fill="none" stroke="#b09060" strokeWidth="0.4" opacity="0.7" />
      {/* Cap underside gills line */}
      <line x1={m.cx - 3.5} y1={m.cy + 0.8} x2={m.cx + 3.5} y2={m.cy + 0.8} stroke="#c8a070" strokeWidth="0.5" opacity="0.6" />
      {/* Stem */}
      <rect x={m.cx - 1.5} y={m.cy + 0.5} width="3" height="3.5" rx="0.8" fill="#e8d0a8" />
      <rect x={m.cx - 1.5} y={m.cy + 0.5} width="3" height="3.5" rx="0.8" fill="none" stroke="#c8a870" strokeWidth="0.3" opacity="0.5" />
    </g>
  );
}

function OliveTopping({ o, uid }: { o: { cx: number; cy: number }; uid: string }) {
  return (
    <g>
      {/* Shadow */}
      <ellipse cx={o.cx + 0.5} cy={o.cy + 0.8} rx="4.5" ry="3" fill="#080808" opacity="0.3" />
      {/* Olive body */}
      <ellipse cx={o.cx} cy={o.cy} rx="4" ry="2.8" fill={`url(#${uid}-olive)`} />
      {/* Red pimento center */}
      <ellipse cx={o.cx} cy={o.cy} rx="1.5" ry="1.2" fill="#e03020" />
      {/* Shine */}
      <ellipse cx={o.cx - 1} cy={o.cy - 0.8} rx="1.2" ry="0.7" fill="white" opacity="0.18" />
    </g>
  );
}

function PepperTopping({ p }: { p: { cx: number; cy: number; angle: number } }) {
  // A small curved pepper strip
  return (
    <g transform={`rotate(${p.angle} ${p.cx} ${p.cy})`}>
      {/* Shadow */}
      <path
        d={`M ${p.cx - 4} ${p.cy + 1} Q ${p.cx} ${p.cy + 2.5} ${p.cx + 4} ${p.cy + 1}`}
        fill="none"
        stroke="#1a0808"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.25"
      />
      {/* Pepper strip — curved path */}
      <path
        d={`M ${p.cx - 4} ${p.cy} Q ${p.cx} ${p.cy + 2} ${p.cx + 4} ${p.cy}`}
        fill="none"
        stroke="#22bb22"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Highlight */}
      <path
        d={`M ${p.cx - 3} ${p.cy - 0.3} Q ${p.cx} ${p.cy + 1.2} ${p.cx + 3} ${p.cy - 0.3}`}
        fill="none"
        stroke="#55ee55"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.6"
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Pizza body (all layers composited, clipped to shape)
// ---------------------------------------------------------------------------

function PizzaBody({
  uid,
  type,
  selected,
  toppings,
}: {
  uid: string;
  type: PizzaType;
  selected: boolean;
  toppings: ReturnType<typeof generateToppings>;
}) {
  const isWhole = type === "whole";
  const hasClip = !isWhole;
  const clipAttr = hasClip ? { clipPath: `url(#${uid}-clip)` } : {};

  // Crust outer radius, sauce inner radius, cheese inner radius
  const CRUST_R = 46;
  const SAUCE_R = 40;
  const CHEESE_R = 37;

  // Cheese-string rng instances (deterministic)
  const cheeseRngV = mulberry32(TYPE_SEEDS[type] + 900);
  const cheeseRngH = mulberry32(TYPE_SEEDS[type] + 950);

  return (
    <g filter={selected ? `url(#${uid}-glow)` : `url(#${uid}-drop)`}>
      {/* ---- Main pizza disc (all layers clipped) ---- */}
      <g {...clipAttr}>
        {/* 1. Crust ring (full circle, will be partially covered by sauce) */}
        <circle cx="50" cy="50" r={CRUST_R} fill={`url(#${uid}-crust)`} filter={`url(#${uid}-crustTex)`} />
        <circle cx="50" cy="50" r={CRUST_R} fill={`url(#${uid}-crust)`} opacity="0.4" />
        {/* Crust rim darkening */}
        <circle cx="50" cy="50" r={CRUST_R} fill={`url(#${uid}-crustRim)`} />
        {/* Crust bumpy texture — ring of small arcs */}
        {Array.from({ length: 18 }, (_, i) => {
          const a = (i / 18) * Math.PI * 2;
          const bumpR = mulberry32(TYPE_SEEDS[type] + 800 + i);
          const bumpOff = 1 + bumpR() * 1.2;
          const bx = 50 + Math.cos(a) * (CRUST_R - bumpOff);
          const by = 50 + Math.sin(a) * (CRUST_R - bumpOff);
          return (
            <circle
              key={i}
              cx={bx}
              cy={by}
              r={1 + bumpR() * 0.8}
              fill="#d4813a"
              opacity="0.22"
            />
          );
        })}
        {/* Crust highlight arc (top-left) */}
        <path
          d="M 14 30 A 44 44 0 0 1 30 14"
          fill="none"
          stroke="#f5d880"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* 2. Tomato sauce layer */}
        <circle cx="50" cy="50" r={SAUCE_R} fill={`url(#${uid}-sauce)`} />
        {/* Sauce bubbles / texture */}
        {Array.from({ length: 7 }, (_, i) => {
          const brng = mulberry32(TYPE_SEEDS[type] + 700 + i);
          const a = brng() * Math.PI * 2;
          const d = 4 + brng() * 28;
          const bx = 50 + Math.cos(a) * d;
          const by = 50 + Math.sin(a) * d;
          if (!inRegion(bx, by, type)) return null;
          if ((bx - 50) ** 2 + (by - 50) ** 2 > SAUCE_R * SAUCE_R) return null;
          return (
            <circle key={i} cx={bx} cy={by} r={1.2 + brng() * 1.5} fill="#e83820" opacity="0.4" />
          );
        })}

        {/* 3. Cheese layer */}
        <circle
          cx="50"
          cy="50"
          r={CHEESE_R}
          fill={`url(#${uid}-cheese)`}
          filter={`url(#${uid}-cheeseTex)`}
        />
        <circle cx="50" cy="50" r={CHEESE_R} fill={`url(#${uid}-cheese)`} opacity="0.45" />
        {/* Cheese blobs / irregular edge */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2 + 0.2;
          const dr = mulberry32(TYPE_SEEDS[type] + 600 + i)() * 5 - 1;
          const br = CHEESE_R + dr;
          const bx = 50 + Math.cos(a) * br;
          const by = 50 + Math.sin(a) * br;
          if (!inRegion(bx, by, type)) return null;
          if ((bx - 50) ** 2 + (by - 50) ** 2 > CRUST_R * CRUST_R - 4) return null;
          return (
            <circle
              key={i}
              cx={bx}
              cy={by}
              r={3.5 + mulberry32(TYPE_SEEDS[type] + 610 + i)() * 2}
              fill="#f0d050"
              opacity="0.65"
            />
          );
        })}
        {/* Cheese shine */}
        <circle cx="50" cy="50" r={CHEESE_R} fill={`url(#${uid}-cheeseShine)`} />
        {/* Cheese burnt spots */}
        {Array.from({ length: 4 }, (_, i) => {
          const brng = mulberry32(TYPE_SEEDS[type] + 650 + i);
          const a = brng() * Math.PI * 2;
          const d = 10 + brng() * 20;
          const bx = 50 + Math.cos(a) * d;
          const by = 50 + Math.sin(a) * d;
          if (!inRegion(bx, by, type)) return null;
          if ((bx - 50) ** 2 + (by - 50) ** 2 > CHEESE_R * CHEESE_R) return null;
          return (
            <ellipse
              key={i}
              cx={bx}
              cy={by}
              rx={2 + brng() * 3}
              ry={1.5 + brng() * 2}
              fill="#c8900a"
              opacity="0.35"
              transform={`rotate(${brng() * 180} ${bx} ${by})`}
            />
          );
        })}

        {/* 4. Toppings */}
        {/* Peppers (under pepperoni) */}
        {toppings.peppers.map((p, i) => (
          <PepperTopping key={`pepp-${i}`} p={p} />
        ))}
        {/* Mushrooms */}
        {toppings.mushrooms.map((m, i) => (
          <MushroomTopping key={`mush-${i}`} m={m} />
        ))}
        {/* Olives */}
        {toppings.olives.map((o, i) => (
          <OliveTopping key={`olive-${i}`} o={o} uid={uid} />
        ))}
        {/* Pepperoni (top-most topping layer) */}
        {toppings.pepperoni.map((p, i) => (
          <PepperoniTopping key={`pepp-${i}`} p={p} uid={uid} />
        ))}

        {/* 5. Overall top-light highlight */}
        <circle cx="50" cy="50" r={CRUST_R} fill="none" stroke="white" strokeWidth="1" opacity="0.08" />
      </g>

      {/* ---- Cut-edge cheese strings (drawn outside clip so they drape over the cut line) ---- */}
      {(type === "half-left" || type === "half-right") && (() => {
        const drips = cheeseStrings("vertical", 50, 11, 89, cheeseRngV, 6);
        return (
          <g opacity="0.9">
            {drips.map((d, i) => {
              // Mirror horizontal direction for half-right
              const flipped = type === "half-right"
                ? d.replace(/Q ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+)/, (_, qx, qy, ex, ey) =>
                    `Q ${100 - parseFloat(qx)} ${qy} ${100 - parseFloat(ex)} ${ey}`
                  ).replace(/M ([^ ]+) ([^ ]+)/, (_, mx, my) =>
                    `M ${100 - parseFloat(mx)} ${my}`
                  )
                : d;
              return (
                <path
                  key={i}
                  d={flipped}
                  fill="none"
                  stroke="#fce050"
                  strokeWidth={1.2 + mulberry32(TYPE_SEEDS[type] + 910 + i)() * 0.8}
                  strokeLinecap="round"
                  opacity={0.7 + mulberry32(TYPE_SEEDS[type] + 920 + i)() * 0.3}
                />
              );
            })}
          </g>
        );
      })()}

      {type === "quarter" && (() => {
        const dripsV = cheeseStrings("vertical", 50, 11, 49, cheeseRngV, 3);
        const dripsH = cheeseStrings("horizontal", 50, 51, 89, cheeseRngH, 3);
        return (
          <g opacity="0.9">
            {dripsV.map((d, i) => (
              <path
                key={`v${i}`}
                d={d}
                fill="none"
                stroke="#fce050"
                strokeWidth={1.2 + mulberry32(TYPE_SEEDS[type] + 910 + i)() * 0.8}
                strokeLinecap="round"
                opacity="0.85"
              />
            ))}
            {dripsH.map((d, i) => (
              <path
                key={`h${i}`}
                d={d}
                fill="none"
                stroke="#fce050"
                strokeWidth={1.2 + mulberry32(TYPE_SEEDS[type] + 960 + i)() * 0.8}
                strokeLinecap="round"
                opacity="0.85"
              />
            ))}
          </g>
        );
      })()}

      {/* ---- Cut-edge visible cheese face ---- */}
      {type === "half-left" && (
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke={`url(#${uid}-cheeseCut)`}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      )}
      {type === "half-right" && (
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke={`url(#${uid}-cheeseCut)`}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      )}
      {type === "quarter" && (
        <>
          <line
            x1="50"
            y1="10"
            x2="50"
            y2="50"
            stroke={`url(#${uid}-cheeseCut)`}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <line
            x1="50"
            y1="50"
            x2="90"
            y2="50"
            stroke={`url(#${uid}-cheeseCut)`}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </>
      )}

      {/* ---- Selected slice indicator (dashed line on whole pizza) ---- */}
      {selected && type === "whole" && (
        <line
          x1="50"
          y1="5"
          x2="50"
          y2="95"
          stroke="white"
          strokeWidth="1.8"
          strokeDasharray="5 4"
          opacity="0.75"
        />
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

// Selected animation style (inject once via a style tag in the SVG)
const BOUNCE_ANIM = `
  @keyframes pizza-bounce {
    0%, 100% { transform: scale(1); }
    30% { transform: scale(1.08) rotate(-2deg); }
    60% { transform: scale(1.05) rotate(1deg); }
  }
`;

export function DividableObject({ type, size = 120, selected = false }: DividableObjectProps) {
  const uid = useMemo(() => `pz${++_idCounter}`, []);
  const toppings = useMemo(() => generateToppings(type), [type]);

  // --- Viewport & display size calculations ---
  //
  // All pizza art lives in a 100×100 internal coordinate space.
  // We expose different viewBox windows depending on the cut:
  //   whole      → full 100×100 (with slight padding)
  //   half-left  → left half  (x 0..52, y 2..98)
  //   half-right → right half (x 48..100, y 2..98)
  //   quarter    → top-right  (x 48..100, y 2..52)

  const containerStyle: React.CSSProperties = {
    display: "inline-block",
    animation: selected ? "pizza-bounce 0.6s ease-in-out" : "none",
    transformOrigin: "center center",
  };

  if (type === "whole") {
    return (
      <div style={containerStyle}>
        <svg
          width={size}
          height={size}
          viewBox="-3 -3 106 106"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <style>{BOUNCE_ANIM}</style>
          <PizzaDefs uid={uid} type={type} />
          <PizzaBody uid={uid} type={type} selected={selected} toppings={toppings} />
        </svg>
      </div>
    );
  }

  if (type === "half-left") {
    const w = size * 0.5;
    const h = size * 0.96;
    return (
      <div style={containerStyle}>
        <svg
          width={w}
          height={h}
          viewBox="-3 2 55 96"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <style>{BOUNCE_ANIM}</style>
          <PizzaDefs uid={uid} type={type} />
          <PizzaBody uid={uid} type={type} selected={selected} toppings={toppings} />
        </svg>
      </div>
    );
  }

  if (type === "half-right") {
    const w = size * 0.5;
    const h = size * 0.96;
    return (
      <div style={containerStyle}>
        <svg
          width={w}
          height={h}
          viewBox="48 2 55 96"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <style>{BOUNCE_ANIM}</style>
          <PizzaDefs uid={uid} type={type} />
          <PizzaBody uid={uid} type={type} selected={selected} toppings={toppings} />
        </svg>
      </div>
    );
  }

  // quarter — upper-right wedge
  const q = size * 0.52;
  return (
    <div style={containerStyle}>
      <svg
        width={q}
        height={q}
        viewBox="48 2 55 52"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <style>{BOUNCE_ANIM}</style>
        <PizzaDefs uid={uid} type={type} />
        <PizzaBody uid={uid} type={type} selected={selected} toppings={toppings} />
      </svg>
    </div>
  );
}

// Named + default export
export default DividableObject;
