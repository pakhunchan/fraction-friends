#!/usr/bin/env tsx
/**
 * Generate animated SVG frame sets for monster characters.
 * 4 monsters × 4 animations × 3 frames = 48 SVG files
 * + preview HTML + TypeScript manifest
 *
 * Run: npx tsx app/public/sprites/generate-sprites.ts
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

type Animation = "idle" | "happy" | "sad" | "thinking";
const ANIMATIONS: Animation[] = ["idle", "happy", "sad", "thinking"];
const FRAME_COUNT = 3;
const MONSTER_COUNT = 4;

/* ── SVG helpers ─────────────────────────────────────── */

function wrap(content: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">\n${content}\n</svg>`;
}

function hl(cx: number, cy: number, r = 1.6): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" opacity="0.9"/>`;
}

function mhl(cx: number, cy: number): string {
  return `<circle cx="${cx + 3}" cy="${cy + 2.5}" r="0.7" fill="white" opacity="0.55"/>`;
}

/* ── Per-animation global frame parameters ───────────── */

interface FP {
  dy: number;   // body translate Y
  ry: number;   // body ry delta (idle breathing)
  arm: number;  // arm rotation delta (happy bounce)
  tear: number; // tear cy delta (sad)
  rot: number;  // body rotation (thinking tilt)
  sx: number;   // sparkle X offset
  tdot: number; // thought-dot opacity
}

const F: Record<Animation, FP[]> = {
  idle: [
    { dy: 1.5, ry: -1, arm: 0, tear: 0, rot: 0, sx: 0, tdot: 0 },
    { dy: 0, ry: 0, arm: 0, tear: 0, rot: 0, sx: 0, tdot: 0 },
    { dy: -1.5, ry: 1, arm: 0, tear: 0, rot: 0, sx: 0, tdot: 0 },
  ],
  happy: [
    { dy: 2, ry: 0, arm: -5, tear: 0, rot: 0, sx: -1, tdot: 0 },
    { dy: 0, ry: 0, arm: 0, tear: 0, rot: 0, sx: 0, tdot: 0 },
    { dy: -3, ry: 0, arm: 5, tear: 0, rot: 0, sx: 1, tdot: 0 },
  ],
  sad: [
    { dy: 1, ry: 0, arm: 0, tear: 0, rot: 0, sx: 0, tdot: 0 },
    { dy: 2, ry: 0, arm: 0, tear: 1.5, rot: 0, sx: 0, tdot: 0 },
    { dy: 3, ry: 0, arm: 0, tear: 3, rot: 0, sx: 0, tdot: 0 },
  ],
  thinking: [
    { dy: 0, ry: 0, arm: 0, tear: 0, rot: -2, sx: 0, tdot: 0.5 },
    { dy: 0, ry: 0, arm: 0, tear: 0, rot: -3, sx: 0, tdot: 0.9 },
    { dy: 0, ry: 0, arm: 0, tear: 0, rot: -4, sx: 0, tdot: 0.5 },
  ],
};

function md(a: Animation): string {
  return a === "idle" ? "neutral" : a;
}

/* ═══════════════════════════════════════════════════════
   MONSTER 0 — Round purple blob
   One giant eye, two tiny horns, fuzzy body, stubby arms
   ═══════════════════════════════════════════════════════ */

function m0(a: Animation, fi: number): string {
  const f = F[a][fi];
  const m = md(a);

  const bc = m === "happy" ? "#a020f0" : m === "sad" ? "#7a5a9a" : "#8b30d0";
  const bd = m === "happy" ? "#6a00c0" : m === "sad" ? "#5a3a7a" : "#5a00a0";

  // Pupil position
  let py = m === "happy" ? 50 : m === "sad" ? 54 : 52;
  let pr = m === "happy" ? 13 : m === "sad" ? 11 : 12;
  let px = 60;
  if (m === "thinking") {
    px = [58, 57, 56][fi];
    py = [50, 49, 48][fi];
  }
  const pir = Math.round(pr * 0.55);

  // Horns
  const hornL =
    m === "happy"
      ? "M 36 28 Q 28 6 32 4 Q 38 2 40 18 Z"
      : m === "sad"
        ? "M 38 30 Q 33 14 36 12 Q 40 12 42 24 Z"
        : "M 37 29 Q 30 10 34 8 Q 39 6 41 21 Z";
  const hornR =
    m === "happy"
      ? "M 84 28 Q 92 6 88 4 Q 82 2 80 18 Z"
      : m === "sad"
        ? "M 82 30 Q 87 14 84 12 Q 80 12 78 24 Z"
        : "M 83 29 Q 90 10 86 8 Q 81 6 79 21 Z";

  // Mouth
  let mouth: string;
  if (m === "happy") {
    mouth = `<path d="M 40 70 Q 60 88 80 70" fill="#4a0070" stroke="#2a004f" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 44 71 Q 60 78 76 71" fill="white" stroke="none"/>
    <rect x="50" y="72" width="6" height="5" rx="1" fill="white"/>
    <rect x="57" y="72" width="6" height="5" rx="1" fill="white"/>
    <rect x="64" y="72" width="6" height="5" rx="1" fill="white"/>`;
  } else if (m === "sad") {
    mouth = `<path d="M 44 78 Q 60 70 76 78" fill="none" stroke="#2a004f" stroke-width="3" stroke-linecap="round"/>`;
  } else if (m === "thinking") {
    mouth = `<path d="M 48 74 Q 54 72 60 74 Q 66 76 72 74" fill="none" stroke="#2a004f" stroke-width="2.5" stroke-linecap="round"/>`;
  } else {
    mouth = `<path d="M 44 72 Q 60 80 76 72" fill="none" stroke="#2a004f" stroke-width="3" stroke-linecap="round"/>`;
  }

  // Eyebrow
  let brow: string;
  if (m === "happy") {
    brow = `<path d="M 44 30 Q 60 24 76 30" fill="none" stroke="#3a005a" stroke-width="2.5" stroke-linecap="round"/>`;
  } else if (m === "sad") {
    brow = `<path d="M 44 36 Q 52 34 60 37" fill="none" stroke="#3a005a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 60 37 Q 68 34 76 36" fill="none" stroke="#3a005a" stroke-width="2.5" stroke-linecap="round"/>`;
  } else if (m === "thinking") {
    brow = `<path d="M 44 30 Q 52 26 60 32" fill="none" stroke="#3a005a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 60 35 Q 68 32 76 36" fill="none" stroke="#3a005a" stroke-width="2.5" stroke-linecap="round"/>`;
  } else {
    brow = `<path d="M 44 34 Q 60 30 76 34" fill="none" stroke="#3a005a" stroke-width="2.5" stroke-linecap="round"/>`;
  }

  // Eyelid
  let lid = "";
  if (m === "sad")
    lid = `<path d="M 40 46 Q 60 41 80 46" fill="none" stroke="#5a005a" stroke-width="2.5" stroke-linecap="round"/>`;
  else if (m === "happy")
    lid = `<path d="M 40 42 Q 60 36 80 42" fill="none" stroke="#5a005a" stroke-width="2" stroke-linecap="round" opacity="0.4"/>`;

  // Tears
  let tears = "";
  if (m === "sad") {
    tears = `<ellipse cx="56" cy="${68 + f.tear}" rx="2.5" ry="3.5" fill="#88ccff" opacity="0.8"/>
    <ellipse cx="64" cy="${70 + f.tear}" rx="2" ry="3" fill="#88ccff" opacity="0.7"/>`;
  }

  // Sparkles
  let sparkles = "";
  if (m === "happy") {
    sparkles = `<g opacity="0.9">
      <path d="M ${26 + f.sx} 42 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z" fill="#ffe066"/>
      <path d="M ${97 + f.sx} 36 l1.5 -4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 Z" fill="#ffe066"/>
      <circle cx="${24 + f.sx}" cy="60" r="2" fill="#ffe066"/>
      <circle cx="${98 + f.sx}" cy="58" r="1.5" fill="#ff99cc"/>
    </g>`;
  }

  // Blush
  let blush = "";
  if (m === "happy") {
    blush = `<ellipse cx="38" cy="68" rx="7" ry="4" fill="#ff88cc" opacity="0.35"/>
    <ellipse cx="82" cy="68" rx="7" ry="4" fill="#ff88cc" opacity="0.35"/>`;
  }

  // Arm rotation
  const armL = m === "thinking" ? -10 : -20 + f.arm;
  const armR = m === "thinking" ? 20 : 20 - f.arm;

  const bodyRy = 44 + f.ry;

  const content = `  <defs>
    <filter id="fuzz" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="42" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <radialGradient id="body-grad" cx="42%" cy="38%" r="58%">
      <stop offset="0%" stop-color="${bc}"/>
      <stop offset="100%" stop-color="${bd}"/>
    </radialGradient>
    <radialGradient id="eye-iris" cx="38%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#22cc88"/>
      <stop offset="100%" stop-color="#008855"/>
    </radialGradient>
    <radialGradient id="sheen" cx="38%" cy="28%" r="40%">
      <stop offset="0%" stop-color="white" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="42" cy="107" rx="10" ry="8" fill="${bd}" filter="url(#fuzz)"/>
  <ellipse cx="78" cy="107" rx="10" ry="8" fill="${bd}" filter="url(#fuzz)"/>
  <path d="M 36 110 Q 38 112 40 110" fill="none" stroke="#3a005a" stroke-width="1.2"/>
  <path d="M 42 111 Q 44 113 46 111" fill="none" stroke="#3a005a" stroke-width="1.2"/>
  <path d="M 72 110 Q 74 112 76 110" fill="none" stroke="#3a005a" stroke-width="1.2"/>
  <path d="M 78 111 Q 80 113 82 111" fill="none" stroke="#3a005a" stroke-width="1.2"/>
  <path d="${hornL}" fill="#d060ff" filter="url(#fuzz)"/>
  <path d="${hornR}" fill="#d060ff" filter="url(#fuzz)"/>
  <path d="${hornL}" fill="none" stroke="#8800cc" stroke-width="0.8" opacity="0.5"/>
  <path d="${hornR}" fill="none" stroke="#8800cc" stroke-width="0.8" opacity="0.5"/>
  <ellipse cx="60" cy="72" rx="46" ry="${bodyRy}" fill="url(#body-grad)" filter="url(#fuzz)"/>
  <ellipse cx="60" cy="72" rx="46" ry="${bodyRy}" fill="url(#sheen)"/>
  <ellipse cx="18" cy="74" rx="8" ry="5" fill="${bc}" transform="rotate(${armL} 18 74)" filter="url(#fuzz)"/>
  <ellipse cx="102" cy="74" rx="8" ry="5" fill="${bc}" transform="rotate(${armR} 102 74)" filter="url(#fuzz)"/>
  <circle cx="11" cy="72" r="2.5" fill="${bd}"/>
  <circle cx="11" cy="78" r="2" fill="${bd}"/>
  <circle cx="109" cy="72" r="2.5" fill="${bd}"/>
  <circle cx="109" cy="78" r="2" fill="${bd}"/>
  <ellipse cx="60" cy="54" rx="22" ry="20" fill="white"/>
  <circle cx="${px}" cy="${py}" r="${pr}" fill="url(#eye-iris)"/>
  <circle cx="${px}" cy="${py}" r="${pir}" fill="#001a00"/>
  ${hl(px - 5, py - 4, 3.5)}
  ${mhl(px - 5, py - 4)}
  <circle cx="${px + 7}" cy="${py + 2}" r="1.2" fill="white" opacity="0.5"/>
  <path d="M 42 38 Q 46 32 52 36" fill="none" stroke="#2a004f" stroke-width="2" stroke-linecap="round"/>
  <path d="M 52 34 Q 60 28 68 34" fill="none" stroke="#2a004f" stroke-width="2" stroke-linecap="round"/>
  <path d="M 68 36 Q 74 32 78 38" fill="none" stroke="#2a004f" stroke-width="2" stroke-linecap="round"/>
  ${lid}
  ${brow}
  <circle cx="32" cy="82" r="4" fill="${bd}" opacity="0.4"/>
  <circle cx="88" cy="78" r="3" fill="${bd}" opacity="0.4"/>
  <circle cx="80" cy="95" r="5" fill="${bd}" opacity="0.3"/>
  ${tears}
  ${sparkles}
  ${mouth}
  ${blush}`;

  // Thought dots (placed outside rotation transform)
  let dots = "";
  if (m === "thinking" && f.tdot > 0) {
    dots = `\n  <circle cx="82" cy="22" r="1.5" fill="#c0b0d0" opacity="${f.tdot}"/>
  <circle cx="88" cy="16" r="2" fill="#c0b0d0" opacity="${f.tdot}"/>
  <circle cx="96" cy="10" r="2.5" fill="#c0b0d0" opacity="${f.tdot}"/>`;
  }

  // Apply global transforms
  let body: string;
  const transforms: string[] = [];
  if (f.dy !== 0) transforms.push(`translate(0,${f.dy})`);
  if (f.rot !== 0) transforms.push(`rotate(${f.rot},60,72)`);

  if (transforms.length > 0) {
    body = `<g transform="${transforms.join(" ")}">\n${content}\n  </g>${dots}`;
  } else {
    body = `${content}${dots}`;
  }

  return wrap(body);
}

/* ═══════════════════════════════════════════════════════
   MONSTER 1 — Tall green monster
   Eye stalks, polka dots, toothy grin, stubby arms
   ═══════════════════════════════════════════════════════ */

function m1(a: Animation, fi: number): string {
  const f = F[a][fi];
  const m = md(a);

  const bc = m === "happy" ? "#22cc44" : m === "sad" ? "#4a8a5a" : "#18a834";
  const bd = m === "happy" ? "#008820" : m === "sad" ? "#2a5a3a" : "#006618";

  // Eye stalks
  let stalkL: string, stalkR: string;
  if (m === "happy") {
    stalkL = "M 42 32 Q 30 14 36 6";
    stalkR = "M 72 30 Q 86 14 80 6";
  } else if (m === "sad") {
    stalkL = "M 42 32 Q 32 22 34 16";
    stalkR = "M 72 30 Q 82 22 80 16";
  } else if (m === "thinking") {
    stalkL = "M 42 32 Q 26 16 30 6";
    stalkR = "M 72 30 Q 86 18 80 10";
  } else {
    stalkL = "M 42 32 Q 30 18 34 10";
    stalkR = "M 72 30 Q 86 18 80 10";
  }

  // Eye positions (follow stalk endpoints)
  let eLx: number, eLy: number, eRx: number, eRy: number;
  if (m === "happy") {
    eLx = 35; eLy = 5; eRx = 81; eRy = 5;
  } else if (m === "sad") {
    eLx = 33; eLy = 15; eRx = 81; eRy = 15;
  } else if (m === "thinking") {
    eLx = 30; eLy = 6; eRx = 81; eRy = 9;
  } else {
    eLx = 34; eLy = 9; eRx = 81; eRy = 9;
  }

  // Thinking pupil offsets (left eye looks up, right stays centered)
  const tpo = [{ x: -1, y: -1 }, { x: -2, y: -2 }, { x: -2.5, y: -2.5 }];
  const iLox = m === "thinking" ? tpo[fi].x : 0;
  const iLoy = m === "thinking" ? tpo[fi].y : 0;

  // Mouth
  let mouth: string;
  if (m === "happy") {
    mouth = `<path d="M 34 80 Q 57 102 84 80" fill="#003300" stroke="#001a00" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 34 80 Q 57 102 84 80 Q 57 88 34 80 Z" fill="#ff5555"/>
    <rect x="40" y="80" width="7" height="8" rx="1.5" fill="white"/>
    <rect x="49" y="80" width="7" height="8" rx="1.5" fill="white"/>
    <rect x="58" y="80" width="7" height="8" rx="1.5" fill="white"/>
    <rect x="67" y="80" width="7" height="8" rx="1.5" fill="white"/>
    <rect x="44" y="88" width="5" height="6" rx="1" fill="white"/>
    <rect x="53" y="89" width="5" height="6" rx="1" fill="white"/>
    <rect x="62" y="89" width="5" height="6" rx="1" fill="white"/>`;
  } else if (m === "sad") {
    mouth = `<path d="M 38 90 Q 57 82 80 90" fill="none" stroke="#003300" stroke-width="3" stroke-linecap="round"/>`;
  } else if (m === "thinking") {
    mouth = `<path d="M 42 86 Q 57 84 74 86" fill="none" stroke="#003300" stroke-width="2.5" stroke-linecap="round"/>`;
  } else {
    mouth = `<path d="M 38 84 Q 57 94 80 84" fill="none" stroke="#003300" stroke-width="3" stroke-linecap="round"/>`;
  }

  // Eyebrow / eye decorations
  let eyeDecor = "";
  if (m === "sad") {
    eyeDecor = `<path d="M ${eLx - 9} ${eLy} Q ${eLx} ${eLy - 4} ${eLx + 9} ${eLy}" fill="none" stroke="#336633" stroke-width="2"/>
    <path d="M ${eRx - 9} ${eRy} Q ${eRx} ${eRy - 4} ${eRx + 9} ${eRy}" fill="none" stroke="#336633" stroke-width="2"/>`;
  } else if (m === "happy") {
    eyeDecor = `<path d="M ${eLx} ${eLy - 3} l1 -3 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 Z" fill="white" opacity="0.9"/>
    <path d="M ${eRx} ${eRy - 3} l1 -3 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 Z" fill="white" opacity="0.9"/>`;
  }

  // Thinking eyebrows (quizzical: left raised, right normal)
  let brow = "";
  if (m === "thinking") {
    brow = `<path d="M ${eLx - 8} ${eLy - 4} Q ${eLx} ${eLy - 10} ${eLx + 8} ${eLy - 2}" fill="none" stroke="#003300" stroke-width="2" stroke-linecap="round"/>
    <path d="M ${eRx - 8} ${eRy - 2} Q ${eRx} ${eRy - 5} ${eRx + 8} ${eRy - 2}" fill="none" stroke="#003300" stroke-width="2" stroke-linecap="round"/>`;
  }

  // Tears
  let tears = "";
  if (m === "sad") {
    tears = `<ellipse cx="${eLx}" cy="${eLy + 10 + f.tear}" rx="2" ry="3" fill="#88ccff" opacity="0.8"/>
    <ellipse cx="${eRx}" cy="${eRy + 10 + f.tear}" rx="2" ry="3" fill="#88ccff" opacity="0.8"/>`;
  }

  // Sparkles
  let sparkles = "";
  if (m === "happy") {
    sparkles = `<path d="M ${12 + f.sx} 50 l1.5 -4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 Z" fill="#ffe066"/>
    <path d="M ${104 + f.sx} 44 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z" fill="#ffe066"/>
    <circle cx="${14 + f.sx}" cy="68" r="1.8" fill="#ff99cc"/>
    <circle cx="${104 + f.sx}" cy="66" r="1.4" fill="#aaffaa"/>`;
  }

  // Blush
  let blush = "";
  if (m === "happy") {
    blush = `<ellipse cx="34" cy="80" rx="7" ry="4" fill="#88ff88" opacity="0.35"/>
    <ellipse cx="80" cy="78" rx="7" ry="4" fill="#88ff88" opacity="0.35"/>`;
  }

  // Arm rotation
  const armL = m === "thinking" ? -20 : -30 + f.arm;
  const armR = m === "thinking" ? 30 : 30 - f.arm;

  const bodyRy = 46 + f.ry;

  const content = `  <defs>
    <filter id="fuzz" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="42" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <radialGradient id="body-grad" cx="40%" cy="36%" r="60%">
      <stop offset="0%" stop-color="${bc}"/>
      <stop offset="100%" stop-color="${bd}"/>
    </radialGradient>
    <radialGradient id="iris" cx="38%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#ffcc00"/>
      <stop offset="100%" stop-color="#cc8800"/>
    </radialGradient>
    <radialGradient id="sheen" cx="35%" cy="25%" r="45%">
      <stop offset="0%" stop-color="white" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="43" cy="113" rx="14" ry="9" fill="${bd}" filter="url(#fuzz)"/>
  <ellipse cx="77" cy="113" rx="14" ry="9" fill="${bd}" filter="url(#fuzz)"/>
  <circle cx="32" cy="112" r="3" fill="#001a00" opacity="0.4"/>
  <circle cx="40" cy="116" r="2.5" fill="#001a00" opacity="0.4"/>
  <circle cx="49" cy="117" r="2.5" fill="#001a00" opacity="0.4"/>
  <circle cx="66" cy="112" r="3" fill="#001a00" opacity="0.4"/>
  <circle cx="74" cy="116" r="2.5" fill="#001a00" opacity="0.4"/>
  <circle cx="83" cy="117" r="2.5" fill="#001a00" opacity="0.4"/>
  <ellipse cx="57" cy="74" rx="36" ry="${bodyRy}" fill="url(#body-grad)" filter="url(#fuzz)"/>
  <ellipse cx="57" cy="74" rx="36" ry="${bodyRy}" fill="url(#sheen)"/>
  <circle cx="42" cy="62" r="5" fill="${bd}" opacity="0.35"/>
  <circle cx="68" cy="55" r="4" fill="${bd}" opacity="0.35"/>
  <circle cx="72" cy="80" r="6" fill="${bd}" opacity="0.3"/>
  <circle cx="44" cy="92" r="5" fill="${bd}" opacity="0.3"/>
  <circle cx="57" cy="110" r="4" fill="${bd}" opacity="0.25"/>
  <ellipse cx="24" cy="76" rx="10" ry="6" fill="${bc}" transform="rotate(${armL} 24 76)" filter="url(#fuzz)"/>
  <ellipse cx="90" cy="76" rx="10" ry="6" fill="${bc}" transform="rotate(${armR} 90 76)" filter="url(#fuzz)"/>
  <circle cx="16" cy="71" r="3" fill="${bd}"/>
  <circle cx="15" cy="78" r="2.5" fill="${bd}"/>
  <circle cx="98" cy="71" r="3" fill="${bd}"/>
  <circle cx="99" cy="78" r="2.5" fill="${bd}"/>
  <path d="${stalkL}" fill="none" stroke="${bd}" stroke-width="5" stroke-linecap="round"/>
  <path d="${stalkR}" fill="none" stroke="${bd}" stroke-width="5" stroke-linecap="round"/>
  <circle cx="${eLx}" cy="${eLy}" r="10" fill="white"/>
  <circle cx="${eLx + iLox}" cy="${eLy + iLoy}" r="6.5" fill="url(#iris)"/>
  <circle cx="${eLx + iLox}" cy="${eLy + iLoy}" r="3.5" fill="#1a0a00"/>
  ${hl(eLx + iLox - 2.5, eLy + iLoy - 3, 2.2)}
  ${mhl(eLx + iLox - 2.5, eLy + iLoy - 3)}
  <circle cx="${eRx}" cy="${eRy}" r="10" fill="white"/>
  <circle cx="${eRx}" cy="${eRy}" r="6.5" fill="url(#iris)"/>
  <circle cx="${eRx}" cy="${eRy}" r="3.5" fill="#1a0a00"/>
  ${hl(eRx - 2.5, eRy - 3, 2.2)}
  ${mhl(eRx - 2.5, eRy - 3)}
  ${eyeDecor}
  ${brow}
  ${tears}
  ${sparkles}
  ${mouth}
  ${blush}`;

  // Thought dots
  let dots = "";
  if (m === "thinking" && f.tdot > 0) {
    dots = `\n  <circle cx="94" cy="22" r="1.5" fill="#8ab090" opacity="${f.tdot}"/>
  <circle cx="100" cy="16" r="2" fill="#8ab090" opacity="${f.tdot}"/>
  <circle cx="108" cy="10" r="2.5" fill="#8ab090" opacity="${f.tdot}"/>`;
  }

  let body: string;
  const transforms: string[] = [];
  if (f.dy !== 0) transforms.push(`translate(0,${f.dy})`);
  if (f.rot !== 0) transforms.push(`rotate(${f.rot},57,74)`);

  if (transforms.length > 0) {
    body = `<g transform="${transforms.join(" ")}">\n${content}\n  </g>${dots}`;
  } else {
    body = `${content}${dots}`;
  }

  return wrap(body);
}

/* ═══════════════════════════════════════════════════════
   MONSTER 2 — Small triangular orange monster
   Three eyes, spiky hair, stubby arms
   ═══════════════════════════════════════════════════════ */

function m2(a: Animation, fi: number): string {
  const f = F[a][fi];
  const m = md(a);

  const bc = m === "happy" ? "#ff8800" : m === "sad" ? "#c08040" : "#e07000";
  const bd = m === "happy" ? "#cc5500" : m === "sad" ? "#8a5020" : "#aa4400";

  const eyeY = m === "sad" ? 64 : 60;
  const centerEyeR = m === "happy" ? 9 : 8;
  const spikeH = m === "happy" ? -4 : m === "sad" ? 4 : 0;

  // Thinking pupil offsets (all 3 eyes shift)
  const tpo = [{ x: -1, y: -1 }, { x: -2, y: -2 }, { x: -2.5, y: -2.5 }];
  const iox = m === "thinking" ? tpo[fi].x : 0;
  const ioy = m === "thinking" ? tpo[fi].y : 0;

  // Triangle apex adjusts for breathing
  const apexY = 18 - f.ry;

  // Mouth
  let mouth: string;
  if (m === "happy") {
    mouth = `<path d="M 36 82 Q 57 100 82 82" fill="#cc4400" stroke="#4a1500" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 40 83 Q 57 91 78 83" fill="white" stroke="none"/>
    <rect x="46" y="83" width="6" height="6" rx="1.5" fill="white"/>
    <rect x="54" y="83" width="6" height="6" rx="1.5" fill="white"/>
    <rect x="62" y="83" width="6" height="6" rx="1.5" fill="white"/>`;
  } else if (m === "sad") {
    mouth = `<path d="M 40 90 Q 57 82 78 90" fill="none" stroke="#4a1500" stroke-width="3" stroke-linecap="round"/>`;
  } else if (m === "thinking") {
    mouth = `<path d="M 44 84 Q 52 82 57 84 Q 62 86 70 84" fill="none" stroke="#4a1500" stroke-width="2.5" stroke-linecap="round"/>`;
  } else {
    mouth = `<path d="M 40 84 Q 57 92 78 84" fill="none" stroke="#4a1500" stroke-width="3" stroke-linecap="round"/>`;
  }

  // Eyebrow
  let brow: string;
  if (m === "happy") {
    brow = `<path d="M 33 50 Q 57 44 81 50" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else if (m === "sad") {
    brow = `<path d="M 33 56 Q 45 53 57 56" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 57 56 Q 69 53 81 56" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else if (m === "thinking") {
    brow = `<path d="M 33 52 Q 45 46 57 54" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 57 56 Q 69 53 81 56" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else {
    brow = `<path d="M 33 54 Q 57 50 81 54" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>`;
  }

  // Eye decorations
  let eyeDecor = "";
  if (m === "sad") {
    eyeDecor = `<path d="M 33 ${eyeY - 5} Q 40 ${eyeY - 8} 47 ${eyeY - 5}" fill="none" stroke="#8a5020" stroke-width="2"/>
    <path d="M 50 ${eyeY - 7} Q 57 ${eyeY - 11} 64 ${eyeY - 7}" fill="none" stroke="#8a5020" stroke-width="2"/>
    <path d="M 67 ${eyeY - 5} Q 74 ${eyeY - 8} 81 ${eyeY - 5}" fill="none" stroke="#8a5020" stroke-width="2"/>`;
  } else if (m === "happy") {
    eyeDecor = `<path d="M 40 ${eyeY - 2} l1 -2.5 l1 2.5 l2.5 1 l-2.5 1 l-1 2.5 l-1 -2.5 l-2.5 -1 Z" fill="white" opacity="0.85"/>
    <path d="M 57 ${eyeY - 4} l1 -2.5 l1 2.5 l2.5 1 l-2.5 1 l-1 2.5 l-1 -2.5 l-2.5 -1 Z" fill="white" opacity="0.85"/>
    <path d="M 74 ${eyeY - 2} l1 -2.5 l1 2.5 l2.5 1 l-2.5 1 l-1 2.5 l-1 -2.5 l-2.5 -1 Z" fill="white" opacity="0.85"/>`;
  }

  // Tears
  let tears = "";
  if (m === "sad") {
    tears = `<ellipse cx="40" cy="${eyeY + 9 + f.tear}" rx="2" ry="3.5" fill="#88ccff" opacity="0.8"/>
    <ellipse cx="57" cy="${eyeY + 10 + f.tear}" rx="2" ry="3" fill="#88ccff" opacity="0.75"/>
    <ellipse cx="74" cy="${eyeY + 9 + f.tear}" rx="2" ry="3.5" fill="#88ccff" opacity="0.8"/>`;
  }

  // Sparkles
  let sparkles = "";
  if (m === "happy") {
    sparkles = `<path d="M ${8 + f.sx} 60 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z" fill="#ffe066"/>
    <path d="M ${106 + f.sx} 54 l1.5 -4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 Z" fill="#ffe066"/>
    <circle cx="${10 + f.sx}" cy="76" r="2" fill="#ffaaff"/>
    <circle cx="${108 + f.sx}" cy="74" r="1.6" fill="#ffcc44"/>`;
  }

  // Blush
  let blush = "";
  if (m === "happy") {
    blush = `<ellipse cx="30" cy="80" rx="7" ry="4" fill="#ffcc88" opacity="0.45"/>
    <ellipse cx="84" cy="80" rx="7" ry="4" fill="#ffcc88" opacity="0.45"/>`;
  }

  // Arm rotation
  const armLRot = m === "thinking" ? -30 : -40 + f.arm;
  const armRRot = m === "thinking" ? 40 : 40 - f.arm;

  const cIrisR = +(centerEyeR * 0.65).toFixed(1);
  const cPupilR = +(centerEyeR * 0.35).toFixed(1);

  const content = `  <defs>
    <filter id="fuzz" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="4" seed="42" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <radialGradient id="body-grad" cx="42%" cy="40%" r="58%">
      <stop offset="0%" stop-color="${bc}"/>
      <stop offset="100%" stop-color="${bd}"/>
    </radialGradient>
    <radialGradient id="iris-l" cx="38%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#ff3366"/>
      <stop offset="100%" stop-color="#cc0044"/>
    </radialGradient>
    <radialGradient id="iris-c" cx="38%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#aa44ff"/>
      <stop offset="100%" stop-color="#6600cc"/>
    </radialGradient>
    <radialGradient id="iris-r" cx="38%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#00ccff"/>
      <stop offset="100%" stop-color="#0066cc"/>
    </radialGradient>
    <radialGradient id="sheen" cx="36%" cy="28%" r="45%">
      <stop offset="0%" stop-color="white" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="45" cy="112" rx="16" ry="9" fill="${bd}" filter="url(#fuzz)"/>
  <ellipse cx="75" cy="112" rx="16" ry="9" fill="${bd}" filter="url(#fuzz)"/>
  <path d="M 57 ${apexY} L 100 108 L 14 108 Z" fill="url(#body-grad)" filter="url(#fuzz)"/>
  <path d="M 57 ${apexY} L 100 108 L 14 108 Z" fill="url(#sheen)"/>
  <ellipse cx="14" cy="80" rx="11" ry="6" fill="${bc}" transform="rotate(${armLRot} 14 80)" filter="url(#fuzz)"/>
  <circle cx="6" cy="72" r="3.5" fill="${bd}"/>
  <circle cx="5" cy="79" r="3" fill="${bd}"/>
  <circle cx="8" cy="86" r="3" fill="${bd}"/>
  <ellipse cx="100" cy="80" rx="11" ry="6" fill="${bc}" transform="rotate(${armRRot} 100 80)" filter="url(#fuzz)"/>
  <circle cx="112" cy="72" r="3.5" fill="${bd}"/>
  <circle cx="113" cy="79" r="3" fill="${bd}"/>
  <circle cx="110" cy="86" r="3" fill="${bd}"/>
  <ellipse cx="57" cy="24" rx="22" ry="12" fill="${bc}" filter="url(#fuzz)"/>
  <path d="M 32 22 L 26 ${4 + spikeH} L 38 18 Z" fill="${bd}" filter="url(#fuzz)"/>
  <path d="M 42 14 L 38 ${-2 + spikeH} L 50 12 Z" fill="${bc}" filter="url(#fuzz)"/>
  <path d="M 57 12 L 55 ${-4 + spikeH} L 63 10 Z" fill="${bd}" filter="url(#fuzz)"/>
  <path d="M 70 14 L 74 ${-2 + spikeH} L 78 16 Z" fill="${bc}" filter="url(#fuzz)"/>
  <path d="M 80 22 L 86 ${4 + spikeH} L 76 20 Z" fill="${bd}" filter="url(#fuzz)"/>
  <circle cx="40" cy="${eyeY}" r="8" fill="white"/>
  <circle cx="${40 + iox}" cy="${eyeY + ioy}" r="5" fill="url(#iris-l)"/>
  <circle cx="${40 + iox}" cy="${eyeY + ioy}" r="2.5" fill="#1a0000"/>
  ${hl(37.5 + iox, eyeY - 2.5 + ioy, 1.8)}
  ${mhl(37.5 + iox, eyeY - 2.5 + ioy)}
  <circle cx="57" cy="${eyeY - 2}" r="${centerEyeR}" fill="white"/>
  <circle cx="${57 + iox}" cy="${eyeY - 2 + ioy}" r="${cIrisR}" fill="url(#iris-c)"/>
  <circle cx="${57 + iox}" cy="${eyeY - 2 + ioy}" r="${cPupilR}" fill="#100020"/>
  ${hl(54.5 + iox, eyeY - 4 + ioy, 2)}
  <circle cx="74" cy="${eyeY}" r="8" fill="white"/>
  <circle cx="${74 + iox}" cy="${eyeY + ioy}" r="5" fill="url(#iris-r)"/>
  <circle cx="${74 + iox}" cy="${eyeY + ioy}" r="2.5" fill="#000a1a"/>
  ${hl(71.5 + iox, eyeY - 2.5 + ioy, 1.8)}
  ${mhl(71.5 + iox, eyeY - 2.5 + ioy)}
  ${eyeDecor}
  ${brow}
  ${tears}
  ${sparkles}
  ${mouth}
  ${blush}`;

  // Thought dots
  let dots = "";
  if (m === "thinking" && f.tdot > 0) {
    dots = `\n  <circle cx="100" cy="22" r="1.5" fill="#d0a878" opacity="${f.tdot}"/>
  <circle cx="106" cy="16" r="2" fill="#d0a878" opacity="${f.tdot}"/>
  <circle cx="112" cy="10" r="2.5" fill="#d0a878" opacity="${f.tdot}"/>`;
  }

  let body: string;
  const transforms: string[] = [];
  if (f.dy !== 0) transforms.push(`translate(0,${f.dy})`);
  if (f.rot !== 0) transforms.push(`rotate(${f.rot},57,63)`);

  if (transforms.length > 0) {
    body = `<g transform="${transforms.join(" ")}">\n${content}\n  </g>${dots}`;
  } else {
    body = `${content}${dots}`;
  }

  return wrap(body);
}

/* ═══════════════════════════════════════════════════════
   MONSTER 3 — Blue cloud monster
   Puffy cloud body, big eyes, tiny wings, curly tail, fangs
   ═══════════════════════════════════════════════════════ */

function m3(a: Animation, fi: number): string {
  const f = F[a][fi];
  const m = md(a);

  const bc = m === "happy" ? "#44aaff" : m === "sad" ? "#5588aa" : "#2288ee";
  const bl = m === "happy" ? "#88ccff" : m === "sad" ? "#7799bb" : "#66aaff";
  const bd = m === "happy" ? "#0066cc" : m === "sad" ? "#336688" : "#0055bb";

  // Wings
  let wingL: string, wingR: string;
  if (m === "happy") {
    wingL = "M 22 58 Q 4 42 8 28 Q 12 16 22 24 Q 16 40 22 58 Z";
    wingR = "M 96 58 Q 114 42 110 28 Q 106 16 96 24 Q 102 40 96 58 Z";
  } else if (m === "sad") {
    wingL = "M 22 62 Q 6 58 8 46 Q 10 36 20 40 Q 14 52 22 62 Z";
    wingR = "M 96 62 Q 112 58 110 46 Q 108 36 98 40 Q 104 52 96 62 Z";
  } else if (m === "thinking") {
    // Left wing slightly raised
    wingL = "M 22 58 Q 4 46 6 32 Q 10 20 20 28 Q 14 42 22 58 Z";
    wingR = "M 96 60 Q 114 50 112 36 Q 108 24 98 32 Q 104 46 96 60 Z";
  } else {
    wingL = "M 22 60 Q 4 50 6 36 Q 10 24 20 32 Q 14 46 22 60 Z";
    wingR = "M 96 60 Q 114 50 112 36 Q 108 24 98 32 Q 104 46 96 60 Z";
  }

  // Tail
  let tail: string;
  if (m === "happy") {
    tail = "M 90 100 Q 106 96 110 84 Q 114 72 104 70 Q 96 68 96 78 Q 96 86 106 84";
  } else if (m === "sad") {
    tail = "M 90 104 Q 100 106 104 100 Q 108 94 100 92";
  } else {
    tail = "M 90 102 Q 108 100 112 88 Q 114 78 106 76 Q 98 74 100 82";
  }

  // Thinking pupil offsets
  const tpo = [{ x: -1.5, y: -1.5 }, { x: -3, y: -3 }, { x: -3.5, y: -3.5 }];
  const iox = m === "thinking" ? tpo[fi].x : 0;
  const ioy = m === "thinking" ? tpo[fi].y : 0;

  // Mouth
  let mouth: string;
  if (m === "happy") {
    mouth = `<path d="M 38 76 Q 57 96 80 76" fill="#3399cc" stroke="#003355" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 42 77 Q 57 85 74 77" fill="white" stroke="none"/>
    <rect x="48" y="77" width="6" height="7" rx="1.5" fill="white"/>
    <rect x="56" y="77" width="6" height="7" rx="1.5" fill="white"/>
    <rect x="64" y="77" width="6" height="7" rx="1.5" fill="white"/>
    <path d="M 44 78 L 42 85 L 48 80" fill="white" stroke="#88bbdd" stroke-width="0.8"/>
    <path d="M 72 78 L 74 85 L 68 80" fill="white" stroke="#88bbdd" stroke-width="0.8"/>`;
  } else if (m === "sad") {
    mouth = `<path d="M 42 84 Q 57 76 74 84" fill="none" stroke="#003355" stroke-width="3" stroke-linecap="round"/>
    <path d="M 46 84 L 44 90 L 50 85" fill="white" stroke="#aaccee" stroke-width="0.8"/>
    <path d="M 70 84 L 72 90 L 66 85" fill="white" stroke="#aaccee" stroke-width="0.8"/>`;
  } else if (m === "thinking") {
    mouth = `<path d="M 46 78 Q 57 76 68 78" fill="none" stroke="#003355" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 48 78 L 46 84 L 52 79" fill="white" stroke="#aaccee" stroke-width="0.8"/>
    <path d="M 66 78 L 68 84 L 62 79" fill="white" stroke="#aaccee" stroke-width="0.8"/>`;
  } else {
    mouth = `<path d="M 42 78 Q 57 86 74 78" fill="none" stroke="#003355" stroke-width="3" stroke-linecap="round"/>
    <path d="M 46 78 L 44 84 L 50 79" fill="white" stroke="#aaccee" stroke-width="0.8"/>
    <path d="M 70 78 L 72 84 L 66 79" fill="white" stroke="#aaccee" stroke-width="0.8"/>`;
  }

  // Eyebrows
  let brow: string;
  if (m === "happy") {
    brow = `<path d="M 35 42 Q 44 36 53 42" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 61 42 Q 70 36 79 42" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else if (m === "sad") {
    brow = `<path d="M 35 48 Q 44 45 53 48" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 61 48 Q 70 45 79 48" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else if (m === "thinking") {
    brow = `<path d="M 35 42 Q 44 36 53 44" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 61 46 Q 70 43 79 46" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else {
    brow = `<path d="M 35 46 Q 44 42 53 46" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 61 46 Q 70 42 79 46" fill="none" stroke="${bd}" stroke-width="2.5" stroke-linecap="round"/>`;
  }

  // Eye decorations
  let eyeDecor = "";
  if (m === "sad") {
    eyeDecor = `<path d="M 33 52 Q 44 46 55 52" fill="none" stroke="${bd}" stroke-width="3" stroke-linecap="round"/>
    <path d="M 59 52 Q 70 46 81 52" fill="none" stroke="${bd}" stroke-width="3" stroke-linecap="round"/>`;
  } else if (m === "happy") {
    eyeDecor = `<path d="M 44 55 l1.2 -3.5 l1.2 3.5 l3.5 1.2 l-3.5 1.2 l-1.2 3.5 l-1.2 -3.5 l-3.5 -1.2 Z" fill="white" opacity="0.9"/>
    <path d="M 70 55 l1.2 -3.5 l1.2 3.5 l3.5 1.2 l-3.5 1.2 l-1.2 3.5 l-1.2 -3.5 l-3.5 -1.2 Z" fill="white" opacity="0.9"/>`;
  }

  // Tears
  let tears = "";
  if (m === "sad") {
    tears = `<ellipse cx="44" cy="${69 + f.tear}" rx="2.5" ry="4" fill="#88ccff" opacity="0.85"/>
    <ellipse cx="70" cy="${70 + f.tear}" rx="2" ry="3.5" fill="#88ccff" opacity="0.8"/>`;
  }

  // Sparkles
  let sparkles = "";
  if (m === "happy") {
    sparkles = `<path d="M ${10 + f.sx} 52 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z" fill="#ffe066"/>
    <path d="M ${104 + f.sx} 46 l1.5 -4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 Z" fill="#ffe066"/>
    <circle cx="${12 + f.sx}" cy="68" r="2" fill="#ccffff"/>
    <circle cx="${106 + f.sx}" cy="66" r="1.8" fill="#aaddff"/>
    <circle cx="${58 + f.sx}" cy="10" r="2.5" fill="#ffffff" opacity="0.8"/>`;
  }

  // Blush
  let blush = "";
  if (m === "happy") {
    blush = `<ellipse cx="32" cy="70" rx="8" ry="5" fill="#88ddff" opacity="0.4"/>
    <ellipse cx="82" cy="70" rx="8" ry="5" fill="#88ddff" opacity="0.4"/>`;
  }

  // Cloud body radius adjustments for breathing
  const topR = 24 + f.ry * 0.5;
  const rectH = 30 + f.ry;

  const content = `  <defs>
    <filter id="fuzz" x="-14%" y="-14%" width="128%" height="128%">
      <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="5" seed="42" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <radialGradient id="body-grad" cx="40%" cy="34%" r="60%">
      <stop offset="0%" stop-color="${bl}"/>
      <stop offset="100%" stop-color="${bc}"/>
    </radialGradient>
    <radialGradient id="iris-l" cx="38%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#66ffaa"/>
      <stop offset="100%" stop-color="#008844"/>
    </radialGradient>
    <radialGradient id="iris-r" cx="38%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#ffcc44"/>
      <stop offset="100%" stop-color="#cc8800"/>
    </radialGradient>
    <radialGradient id="sheen" cx="36%" cy="24%" r="48%">
      <stop offset="0%" stop-color="white" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <path d="${tail}" fill="none" stroke="${bc}" stroke-width="5" stroke-linecap="round" filter="url(#fuzz)"/>
  <path d="${tail}" fill="none" stroke="${bl}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
  <path d="${wingL}" fill="${bl}" stroke="${bd}" stroke-width="1.2" filter="url(#fuzz)" opacity="0.9"/>
  <path d="${wingR}" fill="${bl}" stroke="${bd}" stroke-width="1.2" filter="url(#fuzz)" opacity="0.9"/>
  <path d="${wingL}" fill="none" stroke="${bd}" stroke-width="0.7" opacity="0.3"/>
  <path d="${wingR}" fill="none" stroke="${bd}" stroke-width="0.7" opacity="0.3"/>
  <circle cx="32" cy="64" r="22" fill="url(#body-grad)" filter="url(#fuzz)"/>
  <circle cx="80" cy="64" r="22" fill="url(#body-grad)" filter="url(#fuzz)"/>
  <circle cx="57" cy="48" r="${topR}" fill="url(#body-grad)" filter="url(#fuzz)"/>
  <circle cx="38" cy="56" r="18" fill="url(#body-grad)" filter="url(#fuzz)"/>
  <circle cx="76" cy="56" r="18" fill="url(#body-grad)" filter="url(#fuzz)"/>
  <rect x="24" y="68" width="70" height="${rectH}" rx="8" fill="url(#body-grad)"/>
  <circle cx="57" cy="48" r="${topR}" fill="url(#sheen)"/>
  <circle cx="44" cy="58" r="12" fill="white"/>
  <circle cx="${44 + iox}" cy="${58 + ioy}" r="8" fill="url(#iris-l)"/>
  <circle cx="${44 + iox}" cy="${58 + ioy}" r="4.5" fill="#001a0d"/>
  ${hl(41 + iox, 55 + ioy, 2.8)}
  ${mhl(41 + iox, 55 + ioy)}
  <circle cx="${48 + iox}" cy="${62 + ioy}" r="1.2" fill="white" opacity="0.5"/>
  <circle cx="70" cy="58" r="12" fill="white"/>
  <circle cx="${70 + iox}" cy="${58 + ioy}" r="8" fill="url(#iris-r)"/>
  <circle cx="${70 + iox}" cy="${58 + ioy}" r="4.5" fill="#1a1000"/>
  ${hl(67 + iox, 55 + ioy, 2.8)}
  ${mhl(67 + iox, 55 + ioy)}
  <circle cx="${74 + iox}" cy="${62 + ioy}" r="1.2" fill="white" opacity="0.5"/>
  ${eyeDecor}
  ${brow}
  <ellipse cx="32" cy="68" rx="8" ry="5" fill="${bl}" opacity="0.5"/>
  <ellipse cx="82" cy="68" rx="8" ry="5" fill="${bl}" opacity="0.5"/>
  ${tears}
  ${sparkles}
  ${mouth}
  ${blush}`;

  // Thought dots
  let dots = "";
  if (m === "thinking" && f.tdot > 0) {
    dots = `\n  <circle cx="98" cy="22" r="1.5" fill="#90b8d0" opacity="${f.tdot}"/>
  <circle cx="104" cy="16" r="2" fill="#90b8d0" opacity="${f.tdot}"/>
  <circle cx="112" cy="10" r="2.5" fill="#90b8d0" opacity="${f.tdot}"/>`;
  }

  let body: string;
  const transforms: string[] = [];
  if (f.dy !== 0) transforms.push(`translate(0,${f.dy})`);
  if (f.rot !== 0) transforms.push(`rotate(${f.rot},57,58)`);

  if (transforms.length > 0) {
    body = `<g transform="${transforms.join(" ")}">\n${content}\n  </g>${dots}`;
  } else {
    body = `${content}${dots}`;
  }

  return wrap(body);
}

/* ── Renderers ───────────────────────────────────────── */

const RENDERERS = [m0, m1, m2, m3];

/* ── Preview HTML ────────────────────────────────────── */

function previewHtml(): string {
  let gridCells = "";
  for (let mid = 0; mid < MONSTER_COUNT; mid++) {
    for (const anim of ANIMATIONS) {
      const imgs = [1, 2, 3]
        .map(
          (fr) =>
            `<img src="monster${mid}/${anim}-${fr}.svg" width="80" height="80" alt="${anim}-${fr}"/>`,
        )
        .join("\n          ");
      gridCells += `
      <div class="cell" data-monster="${mid}" data-anim="${anim}">
        <h3>Monster ${mid} — ${anim}</h3>
        <div class="frames">${imgs}</div>
      </div>`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Monster Sprite Preview</title>
<style>
  * { box-sizing: border-box; }
  body { background: #1a1a2e; color: #e0e0f0; font-family: system-ui, sans-serif; padding: 20px; margin: 0; }
  h1, h2 { text-align: center; }
  .controls { text-align: center; margin: 16px 0; }
  button { background: #0f3460; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin: 0 4px; font-size: 14px; }
  button:hover { background: #1a5a9a; }
  button.active { background: #e94560; }
  label { margin-left: 16px; }
  input[type=range] { vertical-align: middle; }
  .player { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin: 24px 0; }
  .player-cell { text-align: center; background: #16213e; border-radius: 10px; padding: 12px; min-width: 140px; }
  .player-cell img { width: 120px; height: 120px; display: block; margin: 0 auto 6px; }
  .player-cell span { font-size: 12px; opacity: 0.7; }
  h2 { margin-top: 32px; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; max-width: 1200px; margin: 0 auto; }
  .cell { text-align: center; background: #16213e; border-radius: 8px; padding: 10px; }
  .cell h3 { margin: 0 0 6px; font-size: 13px; }
  .frames { display: flex; gap: 4px; justify-content: center; }
  .frames img { border: 1px solid #333; border-radius: 4px; }
</style>
</head>
<body>
<h1>Monster Sprite Preview</h1>
<div class="controls">
  <button id="btn-play" onclick="togglePlay()" class="active">Playing</button>
  <label>Speed: <input id="speed" type="range" min="80" max="800" value="250" oninput="setSpeed(this.value)"/> <span id="speed-val">250 ms</span></label>
</div>

<div class="player" id="player"></div>

<h2>All Frames</h2>
<div class="grid">${gridCells}
</div>

<script>
const M = ${MONSTER_COUNT}, anims = ${JSON.stringify(ANIMATIONS)};
let playing = true, speed = 250, seqIdx = 0;
const seq = [0,1,2,1]; // ping-pong: 1→2→3→2→...
let timer;

// Build player cells
const player = document.getElementById('player');
for (let mid = 0; mid < M; mid++) {
  const div = document.createElement('div');
  div.className = 'player-cell';
  div.innerHTML = '<img id="p'+mid+'" src="monster'+mid+'/idle-2.svg"/><span id="l'+mid+'">idle frame 2</span>';
  player.appendChild(div);
}

let currentAnim = 'idle';
function setAnim(a) { currentAnim = a; seqIdx = 0; tick(); }

// Add animation buttons
const ctrl = document.querySelector('.controls');
anims.forEach(a => {
  const b = document.createElement('button');
  b.textContent = a;
  b.onclick = () => setAnim(a);
  ctrl.insertBefore(b, ctrl.querySelector('label'));
});

function tick() {
  const fr = seq[seqIdx % seq.length] + 1;
  for (let mid = 0; mid < M; mid++) {
    document.getElementById('p'+mid).src = 'monster'+mid+'/'+currentAnim+'-'+fr+'.svg';
    document.getElementById('l'+mid).textContent = currentAnim+' frame '+fr;
  }
  seqIdx++;
}

function loop() { if (playing) { tick(); timer = setTimeout(loop, speed); } }
function togglePlay() {
  playing = !playing;
  document.getElementById('btn-play').textContent = playing ? 'Playing' : 'Paused';
  document.getElementById('btn-play').classList.toggle('active', playing);
  if (playing) loop();
}
function setSpeed(v) { speed = +v; document.getElementById('speed-val').textContent = v+' ms'; }
loop();
</script>
</body>
</html>`;
}

/* ── Manifest generator ──────────────────────────────── */

function manifest(): string {
  let entries = "";
  for (let mid = 0; mid < MONSTER_COUNT; mid++) {
    const animEntries = ANIMATIONS.map((a) => {
      const frames = [1, 2, 3]
        .map((fr) => `"/sprites/monster${mid}/${a}-${fr}.svg"`)
        .join(", ");
      return `    ${a}: [${frames}]`;
    }).join(",\n");
    entries += `  ${mid}: {\n${animEntries},\n  },\n`;
  }

  return `export type SpriteAnimation = "idle" | "happy" | "sad" | "thinking";

export const SPRITE_FRAMES: Record<number, Record<SpriteAnimation, string[]>> = {
${entries}};
`;
}

/* ── Main ────────────────────────────────────────────── */

function main() {
  console.log("Generating monster sprite frames...");

  // Create output directories
  for (let mid = 0; mid < MONSTER_COUNT; mid++) {
    const dir = join(__dirname, `monster${mid}`);
    mkdirSync(dir, { recursive: true });
  }

  // Generate 48 SVG files
  let count = 0;
  for (let mid = 0; mid < MONSTER_COUNT; mid++) {
    for (const anim of ANIMATIONS) {
      for (let fi = 0; fi < FRAME_COUNT; fi++) {
        const svgContent = RENDERERS[mid](anim, fi);
        const filename = `${anim}-${fi + 1}.svg`;
        const filepath = join(__dirname, `monster${mid}`, filename);
        writeFileSync(filepath, svgContent, "utf-8");
        count++;
      }
    }
  }
  console.log(`  wrote ${count} SVG files`);

  // Generate preview HTML
  const previewPath = join(__dirname, "preview-sprites.html");
  writeFileSync(previewPath, previewHtml(), "utf-8");
  console.log(`  wrote preview-sprites.html`);

  // Generate TypeScript manifest
  const manifestDir = join(__dirname, "..", "..", "src", "app", "lib");
  mkdirSync(manifestDir, { recursive: true });
  const manifestPath = join(manifestDir, "spriteManifest.ts");
  writeFileSync(manifestPath, manifest(), "utf-8");
  console.log(`  wrote spriteManifest.ts`);

  console.log("Done!");
}

main();
