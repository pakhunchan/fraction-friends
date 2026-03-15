"use client";

/* ============================================================
   Character.tsx — Friendly Robot Theme (attempt4)
   4 unique geometric robots × 3 moods = 12 illustrations
   Props: { index: 0|1|2|3, mood: "neutral"|"happy"|"sad", size?: number }
   ViewBox: 0 0 120 160  (portrait, head + body)
   ============================================================ */

type Mood = "neutral" | "happy" | "sad";

interface CharacterProps {
  index: 0 | 1 | 2 | 3;
  mood?: Mood;
  size?: number;
}

/* ------------------------------------------------------------------ */
/*  Shared gradient / filter defs (inlined per robot to avoid id clash)*/
/* ------------------------------------------------------------------ */

/* LED eye helpers */
function EyeNeutral({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  // Simple round LED dot
  return (
    <>
      <circle cx={cx} cy={cy} r={5} fill={color} opacity={0.9} />
      <circle cx={cx} cy={cy} r={5} fill="none" stroke={color} strokeWidth={1} opacity={0.5} />
      <circle cx={cx - 1.5} cy={cy - 1.5} r={1.4} fill="white" opacity={0.5} />
    </>
  );
}

function EyeHappy({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  // Arc "^" shape — robot smiling through eyes
  return (
    <>
      <path
        d={`M ${cx - 5} ${cy + 1} Q ${cx} ${cy - 6} ${cx + 5} ${cy + 1}`}
        fill={color}
        opacity={0.9}
      />
      <path
        d={`M ${cx - 5} ${cy + 1} Q ${cx} ${cy - 6} ${cx + 5} ${cy + 1}`}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.6}
      />
    </>
  );
}

function EyeSad({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  // Downward arc "v" droopy LED
  return (
    <>
      <path
        d={`M ${cx - 5} ${cy - 2} Q ${cx} ${cy + 5} ${cx + 5} ${cy - 2}`}
        fill={color}
        opacity={0.85}
      />
      <circle cx={cx - 2} cy={cy + 7} r={1.2} fill={color} opacity={0.6} />
    </>
  );
}

/* Mouth screen display helpers */
function MouthNeutral({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  // Flat line on screen
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={3} fill="#0a0a1a" stroke={color} strokeWidth={1.2} opacity={0.9} />
      <line x1={x + 4} y1={y + h / 2} x2={x + w - 4} y2={y + h / 2} stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.9} />
    </>
  );
}

function MouthHappy({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  // Upward curve "smile" on screen + small sparkles
  const mx = x + w / 2;
  const my = y + h / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={3} fill="#0a0a1a" stroke={color} strokeWidth={1.2} opacity={0.9} />
      <path
        d={`M ${x + 4} ${my + 1} Q ${mx} ${my + 7} ${x + w - 4} ${my + 1}`}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        opacity={0.95}
      />
      <circle cx={x + 6} cy={y + 4} r={1} fill={color} opacity={0.7} />
      <circle cx={x + w - 6} cy={y + 4} r={1} fill={color} opacity={0.7} />
    </>
  );
}

function MouthSad({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  // Downward curve on screen + small tear dot
  const mx = x + w / 2;
  const my = y + h / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={3} fill="#0a0a1a" stroke={color} strokeWidth={1.2} opacity={0.9} />
      <path
        d={`M ${x + 4} ${my + 3} Q ${mx} ${my - 4} ${x + w - 4} ${my + 3}`}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        opacity={0.95}
      />
      {/* small tear drops */}
      <ellipse cx={x + w / 2 - 6} cy={y + h + 3} rx={1.2} ry={2} fill="#88ccff" opacity={0.7} />
      <ellipse cx={x + w / 2 + 6} cy={y + h + 4} rx={1.2} ry={2} fill="#88ccff" opacity={0.7} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Character 0 — ROUND BOT                                           */
/*  Spherical head, warm gold/amber, ball-tip antenna, glowing warmth */
/* ------------------------------------------------------------------ */

function RoundBot({ mood }: { mood: Mood }) {
  const primary = "#f5c842";
  const dark = "#b8860b";
  const mid = "#e6a800";
  const eyeColor = "#ff6b00";
  const bodyColor = "#d4a017";
  const glowColor = mood === "happy" ? "#ffdd55" : mood === "sad" ? "#aaaaaa" : "#f5c842";
  const glowOpacity = mood === "happy" ? 0.45 : mood === "sad" ? 0.15 : 0.28;

  // Antenna position: perky up = happy, drooped = sad, straight = neutral
  const antennaPath =
    mood === "happy"
      ? "M 60 22 C 62 14 64 10 63 6"
      : mood === "sad"
      ? "M 60 22 C 61 18 56 14 55 12"
      : "M 60 22 C 61 16 62 12 62 8";
  const antennaBall =
    mood === "happy" ? { cx: 63, cy: 5 } : mood === "sad" ? { cx: 55, cy: 11 } : { cx: 62, cy: 7 };

  const EyeComp = mood === "happy" ? EyeHappy : mood === "sad" ? EyeSad : EyeNeutral;

  return (
    <>
      <defs>
        {/* Head gradient — warm metallic gold sphere */}
        <radialGradient id="rbot-head" cx="38%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffe87a" />
          <stop offset="45%" stopColor="#f5c842" />
          <stop offset="100%" stopColor="#a07000" />
        </radialGradient>
        {/* Body gradient */}
        <radialGradient id="rbot-body" cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#e8b820" />
          <stop offset="100%" stopColor="#8a6000" />
        </radialGradient>
        {/* Glow filter */}
        <filter id="rbot-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* === BODY === */}
      {/* Body glow */}
      <ellipse cx="60" cy="130" rx="28" ry="22" fill={glowColor} opacity={glowOpacity} filter="url(#rbot-glow)" />

      {/* Main body trapezoid */}
      <path d="M 36 110 L 32 152 L 88 152 L 84 110 Z" fill="url(#rbot-body)" rx={6} />
      {/* Body outline */}
      <path d="M 36 110 L 32 152 L 88 152 L 84 110 Z" fill="none" stroke={dark} strokeWidth={1.5} />

      {/* Panel lines */}
      <line x1={44} y1={115} x2={42} y2={148} stroke={dark} strokeWidth={0.8} opacity={0.5} />
      <line x1={76} y1={115} x2={78} y2={148} stroke={dark} strokeWidth={0.8} opacity={0.5} />
      <line x1={40} y1={132} x2={80} y2={132} stroke={dark} strokeWidth={0.8} opacity={0.4} />

      {/* Chest LED strip */}
      <rect x={48} y={120} width={24} height={7} rx={3} fill="#0a0a1a" stroke={mid} strokeWidth={1} />
      <circle cx={54} cy={123.5} r={2} fill={eyeColor} opacity={0.9} />
      <circle cx={60} cy={123.5} r={2} fill={primary} opacity={0.9} />
      <circle cx={66} cy={123.5} r={2} fill={eyeColor} opacity={0.9} />

      {/* Belly detail — control dial */}
      <circle cx="60" cy="140" r={5} fill="#0a0a1a" stroke={mid} strokeWidth={1} />
      <circle cx="60" cy="140" r={2.5} fill={mid} opacity={0.8} />

      {/* Rivets */}
      <circle cx={38} cy={112} r={1.5} fill={dark} />
      <circle cx={82} cy={112} r={1.5} fill={dark} />
      <circle cx={35} cy={148} r={1.5} fill={dark} />
      <circle cx={85} cy={148} r={1.5} fill={dark} />

      {/* Arms */}
      <rect x={16} y={112} width={18} height={10} rx={5} fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <circle cx={16} cy={117} r={5} fill={bodyColor} stroke={dark} strokeWidth={1} />
      <rect x={86} y={112} width={18} height={10} rx={5} fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <circle cx={104} cy={117} r={5} fill={bodyColor} stroke={dark} strokeWidth={1} />

      {/* === NECK === */}
      <rect x={52} y={102} width={16} height={10} rx={3} fill={mid} stroke={dark} strokeWidth={1} />
      {/* Neck segments */}
      <line x1={52} y1={105} x2={68} y2={105} stroke={dark} strokeWidth={0.8} opacity={0.6} />
      <line x1={52} y1={108} x2={68} y2={108} stroke={dark} strokeWidth={0.8} opacity={0.6} />

      {/* === HEAD — big circle === */}
      {/* Head glow aura */}
      <circle cx="60" cy="65" r={46} fill={glowColor} opacity={glowOpacity * 0.8} filter="url(#rbot-glow)" />

      {/* Main head sphere */}
      <circle cx="60" cy="65" r={38} fill="url(#rbot-head)" />
      {/* Head outline */}
      <circle cx="60" cy="65" r={38} fill="none" stroke={dark} strokeWidth={1.8} />

      {/* Ear-discs (side details) */}
      <circle cx={22} cy={65} r={8} fill={mid} stroke={dark} strokeWidth={1.2} />
      <circle cx={22} cy={65} r={3.5} fill="#0a0a1a" stroke={mid} strokeWidth={0.8} />
      <circle cx={98} cy={65} r={8} fill={mid} stroke={dark} strokeWidth={1.2} />
      <circle cx={98} cy={65} r={3.5} fill="#0a0a1a" stroke={mid} strokeWidth={0.8} />

      {/* Panel detail on head */}
      <path d="M 30 50 Q 60 44 90 50" fill="none" stroke={dark} strokeWidth={0.8} opacity={0.4} />
      <path d="M 28 70 Q 60 74 92 70" fill="none" stroke={dark} strokeWidth={0.8} opacity={0.3} />

      {/* === EYES (LED style) === */}
      <EyeComp cx={47} cy={63} color={eyeColor} />
      <EyeComp cx={73} cy={63} color={eyeColor} />

      {/* === MOUTH SCREEN === */}
      <MouthNeutral x={44} y={74} w={32} h={14} color={primary} />
      {mood === "happy" && <MouthHappy x={44} y={74} w={32} h={14} color={primary} />}
      {mood === "sad" && <MouthSad x={44} y={74} w={32} h={14} color={primary} />}
      {mood === "neutral" && <MouthNeutral x={44} y={74} w={32} h={14} color={primary} />}

      {/* === ANTENNA === */}
      {/* Antenna base ring */}
      <circle cx={60} cy={27} r={3.5} fill={mid} stroke={dark} strokeWidth={1} />
      {/* Antenna stem */}
      <path d={antennaPath} fill="none" stroke={dark} strokeWidth={2.5} strokeLinecap="round" />
      <path d={antennaPath} fill="none" stroke={mid} strokeWidth={1.5} strokeLinecap="round" />
      {/* Antenna ball */}
      <circle cx={antennaBall.cx} cy={antennaBall.cy} r={4.5} fill={primary} stroke={dark} strokeWidth={1.2} />
      <circle cx={antennaBall.cx - 1.5} cy={antennaBall.cy - 1.5} r={1.5} fill="white" opacity={0.6} />
      {/* Ball glow */}
      <circle cx={antennaBall.cx} cy={antennaBall.cy} r={4.5} fill={glowColor} opacity={0.4} filter="url(#rbot-glow)" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Character 1 — SQUARE BOT                                          */
/*  Boxy head, cool blue/steel, spring antenna, sharp panel design    */
/* ------------------------------------------------------------------ */

function SquareBot({ mood }: { mood: Mood }) {
  const primary = "#4fc3f7";
  const dark = "#0d47a1";
  const mid = "#1976d2";
  const eyeColor = "#00e5ff";
  const bodyColor = "#1565c0";
  const glowColor = mood === "happy" ? "#00e5ff" : mood === "sad" ? "#607d8b" : "#4fc3f7";
  const glowOpacity = mood === "happy" ? 0.4 : mood === "sad" ? 0.15 : 0.25;

  // Spring antenna: coils compress when sad, stretch when happy
  const springY = mood === "happy" ? 4 : mood === "sad" ? 12 : 8;
  const springCoils =
    mood === "happy"
      ? "M 60 25 C 55 22 65 19 60 16 C 55 13 65 10 60 7"
      : mood === "sad"
      ? "M 60 25 C 56 23 64 21 60 19 C 56 17 64 15 60 13"
      : "M 60 25 C 55 22 65 19 60 16 C 55 13 65 10 60 8";

  const EyeComp = mood === "happy" ? EyeHappy : mood === "sad" ? EyeSad : EyeNeutral;

  return (
    <>
      <defs>
        {/* Metallic blue gradient for head */}
        <linearGradient id="sbot-head" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b3e5fc" />
          <stop offset="40%" stopColor="#4fc3f7" />
          <stop offset="100%" stopColor="#0d47a1" />
        </linearGradient>
        {/* Body gradient */}
        <linearGradient id="sbot-body" x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#42a5f5" />
          <stop offset="100%" stopColor="#0d47a1" />
        </linearGradient>
        <filter id="sbot-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* === BODY === */}
      <rect x={32} y={108} width={56} height={44} rx={5} fill="url(#sbot-body)" />
      <rect x={32} y={108} width={56} height={44} rx={5} fill="none" stroke={dark} strokeWidth={1.5} />

      {/* Panel lines */}
      <line x1={44} y1={108} x2={44} y2={152} stroke={dark} strokeWidth={0.8} opacity={0.4} />
      <line x1={76} y1={108} x2={76} y2={152} stroke={dark} strokeWidth={0.8} opacity={0.4} />
      <line x1={32} y1={128} x2={88} y2={128} stroke={dark} strokeWidth={0.8} opacity={0.4} />

      {/* Body glow */}
      <rect x={32} y={108} width={56} height={44} rx={5} fill={glowColor} opacity={glowOpacity * 0.5} filter="url(#sbot-glow)" />

      {/* Chest panel — speaker grill */}
      <rect x={44} y={115} width={32} height={10} rx={2} fill="#0a0a1a" stroke={mid} strokeWidth={1} />
      {[0, 4, 8, 12, 16, 20, 24, 28].map((offset) => (
        <line key={offset} x1={46 + offset} y1={116} x2={46 + offset} y2={124} stroke={primary} strokeWidth={0.8} opacity={0.7} />
      ))}

      {/* Belly indicator lights */}
      <rect x={46} y={132} width={28} height={8} rx={3} fill="#0a0a1a" stroke={mid} strokeWidth={0.8} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={51 + i * 7} cy={136} r={2} fill={i === 1 ? primary : i === 2 ? eyeColor : "#1a3a5a"} opacity={0.9} />
      ))}

      {/* Corner rivets */}
      {[[34, 110], [86, 110], [34, 150], [86, 150]].map(([rx2, ry2], i) => (
        <circle key={i} cx={rx2} cy={ry2} r={1.5} fill={dark} />
      ))}

      {/* Arms */}
      <rect x={12} y={110} width={18} height={12} rx={4} fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <rect x={12} y={120} width={10} height={8} rx={3} fill={mid} stroke={dark} strokeWidth={1} />
      <rect x={90} y={110} width={18} height={12} rx={4} fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <rect x={98} y={120} width={10} height={8} rx={3} fill={mid} stroke={dark} strokeWidth={1} />

      {/* === NECK === */}
      <rect x={50} y={100} width={20} height={10} rx={2} fill={mid} stroke={dark} strokeWidth={1} />
      <line x1={50} y1={103} x2={70} y2={103} stroke={dark} strokeWidth={0.8} opacity={0.5} />
      <line x1={50} y1={107} x2={70} y2={107} stroke={dark} strokeWidth={0.8} opacity={0.5} />

      {/* === HEAD — rectangle with rounded corners === */}
      {/* Head glow */}
      <rect x={20} y={28} width={80} height={74} rx={10} fill={glowColor} opacity={glowOpacity} filter="url(#sbot-glow)" />
      {/* Main head box */}
      <rect x={22} y={30} width={76} height={72} rx={8} fill="url(#sbot-head)" />
      <rect x={22} y={30} width={76} height={72} rx={8} fill="none" stroke={dark} strokeWidth={1.8} />

      {/* Panel detail top strip */}
      <rect x={22} y={30} width={76} height={14} rx={8} fill={dark} opacity={0.3} />
      <rect x={22} y={30} width={76} height={8} rx={8} fill="none" stroke={primary} strokeWidth={0.6} opacity={0.4} />

      {/* Side ear squares */}
      <rect x={10} y={52} width={12} height={22} rx={4} fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <rect x={13} y={58} width={6} height={10} rx={2} fill="#0a0a1a" stroke={mid} strokeWidth={0.8} />
      <rect x={98} y={52} width={12} height={22} rx={4} fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <rect x={101} y={58} width={6} height={10} rx={2} fill="#0a0a1a" stroke={mid} strokeWidth={0.8} />

      {/* === EYES === */}
      <EyeComp cx={45} cy={60} color={eyeColor} />
      <EyeComp cx={75} cy={60} color={eyeColor} />

      {/* === MOUTH SCREEN === */}
      {mood === "happy" && <MouthHappy x={38} y={73} w={44} h={16} color={primary} />}
      {mood === "sad" && <MouthSad x={38} y={73} w={44} h={16} color={primary} />}
      {mood === "neutral" && <MouthNeutral x={38} y={73} w={44} h={16} color={primary} />}

      {/* === SPRING ANTENNA === */}
      {/* Base */}
      <rect x={56} y={22} width={8} height={6} rx={2} fill={mid} stroke={dark} strokeWidth={1} />
      {/* Spring coil */}
      <path d={springCoils} fill="none" stroke={dark} strokeWidth={2.5} strokeLinecap="round" />
      <path d={springCoils} fill="none" stroke={primary} strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
      {/* Top disc */}
      <ellipse cx={60} cy={springY} rx={5} ry={3} fill={mid} stroke={dark} strokeWidth={1} />
      <ellipse cx={60} cy={springY} rx={5} ry={3} fill={glowColor} opacity={0.5} filter="url(#sbot-glow)" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Character 2 — TRIANGLE BOT                                        */
/*  Angular triangular head, vibrant green, radar dish antenna        */
/* ------------------------------------------------------------------ */

function TriangleBot({ mood }: { mood: Mood }) {
  const primary = "#66bb6a";
  const dark = "#1b5e20";
  const mid = "#388e3c";
  const eyeColor = "#76ff03";
  const bodyColor = "#2e7d32";
  const glowColor = mood === "happy" ? "#76ff03" : mood === "sad" ? "#546e7a" : "#66bb6a";
  const glowOpacity = mood === "happy" ? 0.4 : mood === "sad" ? 0.15 : 0.25;

  // Head is a rounded triangle shape
  // Radar dish: spins up when happy, droops when sad
  const dishCx = mood === "happy" ? 60 : mood === "sad" ? 56 : 60;
  const dishCy = mood === "happy" ? 6 : mood === "sad" ? 12 : 8;
  const dishRx = mood === "happy" ? 12 : mood === "sad" ? 8 : 10;
  const dishRy = mood === "happy" ? 4 : mood === "sad" ? 2.5 : 3;
  const dishRotate = mood === "happy" ? -15 : mood === "sad" ? 25 : 0;

  const stemPath =
    mood === "happy"
      ? "M 60 30 L 62 16"
      : mood === "sad"
      ? "M 60 30 L 57 18"
      : "M 60 30 L 60 14";

  const EyeComp = mood === "happy" ? EyeHappy : mood === "sad" ? EyeSad : EyeNeutral;

  return (
    <>
      <defs>
        {/* Metallic green gradient */}
        <linearGradient id="tbot-head" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#a5d6a7" />
          <stop offset="50%" stopColor="#66bb6a" />
          <stop offset="100%" stopColor="#1b5e20" />
        </linearGradient>
        <linearGradient id="tbot-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#81c784" />
          <stop offset="100%" stopColor="#1b5e20" />
        </linearGradient>
        <filter id="tbot-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* === BODY — angular trapezoid === */}
      <path d="M 30 107 L 24 152 L 96 152 L 90 107 Z" fill="url(#tbot-body)" />
      <path d="M 30 107 L 24 152 L 96 152 L 90 107 Z" fill="none" stroke={dark} strokeWidth={1.5} />
      <path d="M 30 107 L 24 152 L 96 152 L 90 107 Z" fill={glowColor} opacity={glowOpacity * 0.4} filter="url(#tbot-glow)" />

      {/* Diagonal panel lines */}
      <line x1={42} y1={107} x2={38} y2={152} stroke={dark} strokeWidth={0.8} opacity={0.4} />
      <line x1={78} y1={107} x2={82} y2={152} stroke={dark} strokeWidth={0.8} opacity={0.4} />
      <line x1={28} y1={130} x2={92} y2={130} stroke={dark} strokeWidth={0.8} opacity={0.4} />

      {/* Chest display — hex-shaped panel */}
      <polygon points="60,112 72,118 72,130 60,136 48,130 48,118" fill="#0a0a1a" stroke={mid} strokeWidth={1.2} />
      {/* HEX inner glow */}
      <polygon points="60,114 70,119 70,129 60,134 50,129 50,119" fill={glowColor} opacity={mood === "happy" ? 0.5 : 0.2} />
      <polygon points="60,116 68,120 68,128 60,132 52,128 52,120" fill="#0a0a1a" opacity={0.6} />

      {/* Corner bolts */}
      {[[32, 109], [88, 109], [26, 150], [94, 150]].map(([bx, by], i) => (
        <circle key={i} cx={bx} cy={by} r={2} fill={dark} stroke={mid} strokeWidth={0.6} />
      ))}

      {/* Arms — angular */}
      <path d="M 10 112 L 28 108 L 30 120 L 12 124 Z" fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <circle cx={10} cy={118} r={5} fill={bodyColor} stroke={dark} strokeWidth={1} />
      <path d="M 110 112 L 92 108 L 90 120 L 108 124 Z" fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <circle cx={110} cy={118} r={5} fill={bodyColor} stroke={dark} strokeWidth={1} />

      {/* === NECK === */}
      <rect x={50} y={99} width={20} height={10} rx={3} fill={mid} stroke={dark} strokeWidth={1} />

      {/* === HEAD — triangle with rounded corners === */}
      {/* The triangle head: wide at bottom, pointed toward top-center */}
      {/* Drawn as a path with rounded joins */}
      {/* Glow */}
      <path
        d="M 60 22 L 96 96 Q 96 100 92 100 L 28 100 Q 24 100 24 96 Z"
        fill={glowColor}
        opacity={glowOpacity}
        filter="url(#tbot-glow)"
      />
      {/* Main triangle head */}
      <path
        d="M 60 24 L 92 96 Q 92 100 88 100 L 32 100 Q 28 100 28 96 Z"
        fill="url(#tbot-head)"
      />
      <path
        d="M 60 24 L 92 96 Q 92 100 88 100 L 32 100 Q 28 100 28 96 Z"
        fill="none"
        stroke={dark}
        strokeWidth={1.8}
      />

      {/* Side sensor nubs */}
      <circle cx={27} cy={78} r={6} fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <circle cx={27} cy={78} r={2.5} fill={eyeColor} opacity={0.6} />
      <circle cx={93} cy={78} r={6} fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <circle cx={93} cy={78} r={2.5} fill={eyeColor} opacity={0.6} />

      {/* Head panel lines */}
      <path d="M 38 75 Q 60 70 82 75" fill="none" stroke={dark} strokeWidth={0.7} opacity={0.4} />

      {/* === EYES === */}
      <EyeComp cx={47} cy={68} color={eyeColor} />
      <EyeComp cx={73} cy={68} color={eyeColor} />

      {/* === MOUTH SCREEN === */}
      {mood === "happy" && <MouthHappy x={41} y={80} w={38} h={14} color={primary} />}
      {mood === "sad" && <MouthSad x={41} y={80} w={38} h={14} color={primary} />}
      {mood === "neutral" && <MouthNeutral x={41} y={80} w={38} h={14} color={primary} />}

      {/* === RADAR DISH ANTENNA === */}
      {/* Stem */}
      <path d={stemPath} fill="none" stroke={dark} strokeWidth={2.5} strokeLinecap="round" />
      <path d={stemPath} fill="none" stroke={mid} strokeWidth={1.2} strokeLinecap="round" />
      {/* Dish */}
      <ellipse
        cx={dishCx}
        cy={dishCy}
        rx={dishRx}
        ry={dishRy}
        fill={mid}
        stroke={dark}
        strokeWidth={1.2}
        transform={`rotate(${dishRotate} ${dishCx} ${dishCy})`}
      />
      <ellipse
        cx={dishCx}
        cy={dishCy}
        rx={dishRx}
        ry={dishRy}
        fill={glowColor}
        opacity={0.45}
        filter="url(#tbot-glow)"
        transform={`rotate(${dishRotate} ${dishCx} ${dishCy})`}
      />
      {/* Dish center dot */}
      <circle cx={dishCx} cy={dishCy} r={1.8} fill={eyeColor} opacity={0.9} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Character 3 — STAR BOT                                            */
/*  Star-shaped head, pink/purple, heart antenna, sparkly personality */
/* ------------------------------------------------------------------ */

function StarBot({ mood }: { mood: Mood }) {
  const primary = "#f48fb1";
  const dark = "#880e4f";
  const mid = "#c2185b";
  const eyeColor = "#ff80ab";
  const bodyColor = "#ad1457";
  const accentColor = "#ce93d8";
  const glowColor = mood === "happy" ? "#ff80ab" : mood === "sad" ? "#9c6490" : "#f48fb1";
  const glowOpacity = mood === "happy" ? 0.45 : mood === "sad" ? 0.15 : 0.28;

  // Heart antenna tip
  const heartCx = mood === "happy" ? 60 : mood === "sad" ? 57 : 60;
  const heartCy = mood === "happy" ? 4 : mood === "sad" ? 9 : 6;
  const heartPath = `M ${heartCx} ${heartCy + 4} C ${heartCx - 8} ${heartCy - 4} ${heartCx - 14} ${heartCy + 6} ${heartCx} ${heartCy + 12} C ${heartCx + 14} ${heartCy + 6} ${heartCx + 8} ${heartCy - 4} ${heartCx} ${heartCy + 4} Z`;
  const stemEnd = mood === "happy" ? `M 60 30 C 58 22 58 14 ${heartCx} ${heartCy + 12}` : mood === "sad" ? `M 60 30 C 59 24 58 18 ${heartCx} ${heartCy + 12}` : `M 60 30 C 60 22 60 16 ${heartCx} ${heartCy + 12}`;

  // Star polygon points: 5-pointed star, cx=60, cy=65, outerR=40, innerR=17
  function starPoints(cx: number, cy: number, outerR: number, innerR: number, points = 5): string {
    const arr: string[] = [];
    for (let i = 0; i < points * 2; i++) {
      const angle = (Math.PI / points) * i - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      arr.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return arr.join(" ");
  }

  const EyeComp = mood === "happy" ? EyeHappy : mood === "sad" ? EyeSad : EyeNeutral;

  return (
    <>
      <defs>
        {/* Metallic pink/purple gradient */}
        <radialGradient id="starbot-head" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fce4ec" />
          <stop offset="45%" stopColor="#f48fb1" />
          <stop offset="100%" stopColor="#880e4f" />
        </radialGradient>
        <linearGradient id="starbot-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f06292" />
          <stop offset="100%" stopColor="#880e4f" />
        </linearGradient>
        <filter id="starbot-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* === BODY — rounded with curves === */}
      <path d="M 34 108 Q 26 108 24 116 L 22 152 L 98 152 L 96 116 Q 94 108 86 108 Z" fill="url(#starbot-body)" />
      <path d="M 34 108 Q 26 108 24 116 L 22 152 L 98 152 L 96 116 Q 94 108 86 108 Z" fill="none" stroke={dark} strokeWidth={1.5} />
      <path d="M 34 108 Q 26 108 24 116 L 22 152 L 98 152 L 96 116 Q 94 108 86 108 Z" fill={glowColor} opacity={glowOpacity * 0.35} filter="url(#starbot-glow)" />

      {/* Panel accents — diagonal stripes */}
      <line x1={40} y1={108} x2={38} y2={152} stroke={dark} strokeWidth={0.8} opacity={0.4} />
      <line x1={80} y1={108} x2={82} y2={152} stroke={dark} strokeWidth={0.8} opacity={0.4} />
      <line x1={25} y1={130} x2={95} y2={130} stroke={dark} strokeWidth={0.8} opacity={0.4} />

      {/* Chest — star badge display */}
      <polygon points={starPoints(60, 122, 12, 5)} fill="#0a0a1a" stroke={mid} strokeWidth={1} />
      <polygon points={starPoints(60, 122, 10, 4)} fill={glowColor} opacity={mood === "happy" ? 0.7 : 0.3} />
      <circle cx={60} cy={122} r={3} fill={eyeColor} opacity={0.9} />

      {/* Sparkle decorations on body */}
      {mood === "happy" && (
        <>
          <text x={34} y={142} fontSize="8" fill={accentColor} opacity={0.8}>✦</text>
          <text x={76} y={145} fontSize="6" fill={accentColor} opacity={0.7}>✦</text>
          <text x={28} y={120} fontSize="5" fill={primary} opacity={0.6}>★</text>
        </>
      )}

      {/* Belly lights */}
      <rect x={46} y={135} width={28} height={8} rx={3} fill="#0a0a1a" stroke={mid} strokeWidth={0.8} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={52 + i * 8} cy={139} r={2.2} fill={i === 1 ? eyeColor : accentColor} opacity={0.85} />
      ))}

      {/* Rivets */}
      {[[26, 110], [94, 110], [24, 150], [96, 150]].map(([rx2, ry2], i) => (
        <circle key={i} cx={rx2} cy={ry2} r={1.5} fill={dark} />
      ))}

      {/* Arms — rounded and bubbly */}
      <ellipse cx={18} cy={118} rx={10} ry={7} fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <circle cx={12} cy={116} r={4} fill={bodyColor} stroke={dark} strokeWidth={1} />
      <ellipse cx={102} cy={118} rx={10} ry={7} fill={bodyColor} stroke={dark} strokeWidth={1.2} />
      <circle cx={108} cy={116} r={4} fill={bodyColor} stroke={dark} strokeWidth={1} />

      {/* === NECK === */}
      <rect x={50} y={100} width={20} height={10} rx={3} fill={mid} stroke={dark} strokeWidth={1} />
      <line x1={50} y1={104} x2={70} y2={104} stroke={dark} strokeWidth={0.8} opacity={0.5} />
      <line x1={50} y1={107} x2={70} y2={107} stroke={dark} strokeWidth={0.8} opacity={0.5} />

      {/* === HEAD — star shape === */}
      {/* Glow around star */}
      <polygon
        points={starPoints(60, 62, 44, 20)}
        fill={glowColor}
        opacity={glowOpacity}
        filter="url(#starbot-glow)"
      />
      {/* Main star head */}
      <polygon
        points={starPoints(60, 62, 40, 18)}
        fill="url(#starbot-head)"
      />
      <polygon
        points={starPoints(60, 62, 40, 18)}
        fill="none"
        stroke={dark}
        strokeWidth={1.8}
      />

      {/* Cheek blush circles (on star points) */}
      {mood !== "sad" && (
        <>
          <circle cx={35} cy={72} r={5} fill="#ff6090" opacity={mood === "happy" ? 0.35 : 0.15} />
          <circle cx={85} cy={72} r={5} fill="#ff6090" opacity={mood === "happy" ? 0.35 : 0.15} />
        </>
      )}

      {/* Inner star highlight */}
      <polygon
        points={starPoints(60, 62, 24, 11)}
        fill="none"
        stroke={primary}
        strokeWidth={0.8}
        opacity={0.4}
      />

      {/* === EYES === */}
      <EyeComp cx={48} cy={60} color={eyeColor} />
      <EyeComp cx={72} cy={60} color={eyeColor} />

      {/* === MOUTH SCREEN === */}
      {mood === "happy" && <MouthHappy x={42} y={72} w={36} h={14} color={primary} />}
      {mood === "sad" && <MouthSad x={42} y={72} w={36} h={14} color={primary} />}
      {mood === "neutral" && <MouthNeutral x={42} y={72} w={36} h={14} color={primary} />}

      {/* === HEART ANTENNA === */}
      {/* Stem */}
      <path d={stemEnd} fill="none" stroke={dark} strokeWidth={2.5} strokeLinecap="round" />
      <path d={stemEnd} fill="none" stroke={mid} strokeWidth={1.2} strokeLinecap="round" />
      {/* Heart */}
      <path d={heartPath} fill={mid} stroke={dark} strokeWidth={1.2} />
      <path d={heartPath} fill={glowColor} opacity={0.5} filter="url(#starbot-glow)" />
      {/* Heart highlight */}
      <circle cx={heartCx - 3} cy={heartCy + 3} r={2} fill="white" opacity={0.4} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

const robotRenderers = [RoundBot, SquareBot, TriangleBot, StarBot];

export function Character({ index, mood = "neutral", size = 120 }: CharacterProps) {
  const Robot = robotRenderers[index % robotRenderers.length];

  return (
    <svg
      width={size}
      height={Math.round(size * (160 / 120))}
      viewBox="0 0 120 160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <Robot mood={mood} />
    </svg>
  );
}
