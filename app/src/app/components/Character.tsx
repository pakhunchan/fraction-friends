"use client";

/*
  Fuzzy Monsters character set (from step2-character-graphics attempt5)
  ────────────────────────────────────────────────────────────────────
  0  Round purple blob  · one big eye, tiny horns, fuzzy
  1  Tall green monster · eye-stalks, spots, wide grin
  2  Small orange tri   · three eyes, spiky hair, stubby arms
  3  Blue cloud monster · big eyes, tiny wings, curly tail
*/

type Mood = "neutral" | "happy" | "sad";

interface CharacterProps {
  id: number;
  mood?: Mood;
  onClick?: () => void;
  highlighted?: boolean;
  size?: number;
}

/* ─── tiny shared helpers ─────────────────────────────────────────── */

function Highlight({ cx, cy, r = 1.6 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="white" opacity={0.9} />;
}

function MiniHighlight({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx + 3} cy={cy + 2.5} r={0.7} fill="white" opacity={0.55} />;
}

/* ═══════════════════════════════════════════════════════════════════
   CHARACTER 0
   Round purple blob monster — one giant central eye, two tiny horns,
   fuzzy body edge, stubby legs
   viewBox "0 0 120 120"
   ═══════════════════════════════════════════════════════════════════ */

function Monster0({ mood, uid }: { mood: Mood; uid: string }) {
  const pupilY  = mood === "happy" ? 50 : mood === "sad" ? 54 : 52;
  const pupilR  = mood === "happy" ? 13  : mood === "sad" ? 11  : 12;

  const hornL = mood === "happy"
    ? "M 36 28 Q 28 6  32 4  Q 38 2  40 18 Z"
    : mood === "sad"
    ? "M 38 30 Q 33 14 36 12 Q 40 12 42 24 Z"
    : "M 37 29 Q 30 10 34 8  Q 39 6  41 21 Z";

  const hornR = mood === "happy"
    ? "M 84 28 Q 92 6  88 4  Q 82 2  80 18 Z"
    : mood === "sad"
    ? "M 82 30 Q 87 14 84 12 Q 80 12 78 24 Z"
    : "M 83 29 Q 90 10 86 8  Q 81 6  79 21 Z";

  const mouth = {
    neutral: (
      <path d="M 44 72 Q 60 80 76 72"
        fill="none" stroke="#2a004f" strokeWidth="3" strokeLinecap="round" />
    ),
    happy: (
      <g>
        <path d="M 40 70 Q 60 88 80 70"
          fill="#4a0070" stroke="#2a004f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 44 71 Q 60 78 76 71" fill="white" stroke="none" />
        <rect x="50" y="72" width="6"  height="5" rx="1" fill="white" />
        <rect x="57" y="72" width="6"  height="5" rx="1" fill="white" />
        <rect x="64" y="72" width="6"  height="5" rx="1" fill="white" />
      </g>
    ),
    sad: (
      <path d="M 44 78 Q 60 70 76 78"
        fill="none" stroke="#2a004f" strokeWidth="3" strokeLinecap="round" />
    ),
  }[mood];

  const sparkles = mood === "happy" ? (
    <g opacity={0.9}>
      <path d="M 26 42 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z" fill="#ffe066" />
      <path d="M 97 36 l1.5 -4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 Z" fill="#ffe066" />
      <circle cx="24" cy="60" r="2" fill="#ffe066" />
      <circle cx="98" cy="58" r="1.5" fill="#ff99cc" />
    </g>
  ) : null;

  const tears = mood === "sad" ? (
    <g>
      <ellipse cx="56" cy="68" rx="2.5" ry="3.5" fill="#88ccff" opacity={0.8} />
      <ellipse cx="64" cy="70" rx="2" ry="3" fill="#88ccff" opacity={0.7} />
    </g>
  ) : null;

  const bodyColor = mood === "happy" ? "#a020f0" : mood === "sad" ? "#7a5a9a" : "#8b30d0";
  const bodyDark  = mood === "happy" ? "#6a00c0" : mood === "sad" ? "#5a3a7a" : "#5a00a0";

  return (
    <>
      <defs>
        <filter id={`${uid}-fuzz`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id={`${uid}-body`} cx="42%" cy="38%" r="58%">
          <stop offset="0%"   stopColor={bodyColor} />
          <stop offset="100%" stopColor={bodyDark}  />
        </radialGradient>
        <radialGradient id={`${uid}-eye-iris`} cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#22cc88" />
          <stop offset="100%" stopColor="#008855" />
        </radialGradient>
        <radialGradient id={`${uid}-sheen`} cx="38%" cy="28%" r="40%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.22" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="42" cy="107" rx="10" ry="8" fill={bodyDark} filter={`url(#${uid}-fuzz)`} />
      <ellipse cx="78" cy="107" rx="10" ry="8" fill={bodyDark} filter={`url(#${uid}-fuzz)`} />
      <path d="M 36 110 Q 38 112 40 110" fill="none" stroke="#3a005a" strokeWidth="1.2" />
      <path d="M 42 111 Q 44 113 46 111" fill="none" stroke="#3a005a" strokeWidth="1.2" />
      <path d="M 72 110 Q 74 112 76 110" fill="none" stroke="#3a005a" strokeWidth="1.2" />
      <path d="M 78 111 Q 80 113 82 111" fill="none" stroke="#3a005a" strokeWidth="1.2" />

      <path d={hornL} fill="#d060ff" filter={`url(#${uid}-fuzz)`} />
      <path d={hornR} fill="#d060ff" filter={`url(#${uid}-fuzz)`} />
      <path d={hornL} fill="none" stroke="#8800cc" strokeWidth="0.8" opacity={0.5} />
      <path d={hornR} fill="none" stroke="#8800cc" strokeWidth="0.8" opacity={0.5} />

      <ellipse cx="60" cy="72" rx="46" ry="44"
        fill={`url(#${uid}-body)`} filter={`url(#${uid}-fuzz)`} />
      <ellipse cx="60" cy="72" rx="46" ry="44" fill={`url(#${uid}-sheen)`} />

      <ellipse cx="18" cy="74" rx="8" ry="5" fill={bodyColor}
        transform="rotate(-20 18 74)" filter={`url(#${uid}-fuzz)`} />
      <ellipse cx="102" cy="74" rx="8" ry="5" fill={bodyColor}
        transform="rotate(20 102 74)" filter={`url(#${uid}-fuzz)`} />
      <circle cx="11" cy="72" r="2.5" fill={bodyDark} />
      <circle cx="11" cy="78" r="2"   fill={bodyDark} />
      <circle cx="109" cy="72" r="2.5" fill={bodyDark} />
      <circle cx="109" cy="78" r="2"   fill={bodyDark} />

      <ellipse cx="60" cy="54" rx="22" ry="20" fill="white" />
      <circle  cx="60" cy={pupilY} r={pupilR} fill={`url(#${uid}-eye-iris)`} />
      <circle  cx="60" cy={pupilY} r={Math.round(pupilR * 0.55)} fill="#001a00" />
      <Highlight cx={55} cy={pupilY - 4} r={3.5} />
      <MiniHighlight cx={55} cy={pupilY - 4} />
      <circle cx="67" cy={pupilY + 2} r="1.2" fill="white" opacity={0.5} />

      {mood === "sad" && (
        <path d="M 40 46 Q 60 41 80 46"
          fill="none" stroke="#5a005a" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {mood === "happy" && (
        <path d="M 40 42 Q 60 36 80 42"
          fill="none" stroke="#5a005a" strokeWidth="2" strokeLinecap="round" opacity={0.4} />
      )}

      <path d="M 42 38 Q 46 32 52 36" fill="none" stroke="#2a004f" strokeWidth="2" strokeLinecap="round" />
      <path d="M 52 34 Q 60 28 68 34" fill="none" stroke="#2a004f" strokeWidth="2" strokeLinecap="round" />
      <path d="M 68 36 Q 74 32 78 38" fill="none" stroke="#2a004f" strokeWidth="2" strokeLinecap="round" />

      {mood === "neutral" && (
        <path d="M 44 34 Q 60 30 76 34"
          fill="none" stroke="#3a005a" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {mood === "happy" && (
        <path d="M 44 30 Q 60 24 76 30"
          fill="none" stroke="#3a005a" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {mood === "sad" && (
        <>
          <path d="M 44 36 Q 52 34 60 37"
            fill="none" stroke="#3a005a" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 60 37 Q 68 34 76 36"
            fill="none" stroke="#3a005a" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      <circle cx="32" cy="82" r="4" fill={bodyDark} opacity={0.4} />
      <circle cx="88" cy="78" r="3" fill={bodyDark} opacity={0.4} />
      <circle cx="80" cy="95" r="5" fill={bodyDark} opacity={0.3} />

      {tears}
      {sparkles}
      {mouth}

      {mood === "happy" && (
        <>
          <ellipse cx="38" cy="68" rx="7" ry="4" fill="#ff88cc" opacity={0.35} />
          <ellipse cx="82" cy="68" rx="7" ry="4" fill="#ff88cc" opacity={0.35} />
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CHARACTER 1
   Tall green monster — eyes on wobbly stalks, polka-dot body, huge
   toothy grin, two stubby arms, pair of round feet
   ═══════════════════════════════════════════════════════════════════ */

function Monster1({ mood, uid }: { mood: Mood; uid: string }) {
  const stalkL = mood === "happy"
    ? "M 42 32 Q 30 14 36 6"
    : mood === "sad"
    ? "M 42 32 Q 32 22 34 16"
    : "M 42 32 Q 30 18 34 10";

  const stalkR = mood === "happy"
    ? "M 72 30 Q 86 14 80 6"
    : mood === "sad"
    ? "M 72 30 Q 82 22 80 16"
    : "M 72 30 Q 86 18 80 10";

  const eyeLCx = mood === "happy" ? 35 : mood === "sad" ? 33 : 34;
  const eyeLCy = mood === "happy" ? 5  : mood === "sad" ? 15 : 9;
  const eyeRCx = mood === "happy" ? 81 : mood === "sad" ? 81 : 81;
  const eyeRCy = mood === "happy" ? 5  : mood === "sad" ? 15 : 9;

  const mouth = {
    neutral: (
      <path d="M 38 84 Q 57 94 80 84"
        fill="none" stroke="#003300" strokeWidth="3" strokeLinecap="round" />
    ),
    happy: (
      <g>
        <path d="M 34 80 Q 57 102 84 80"
          fill="#003300" stroke="#001a00" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 34 80 Q 57 102 84 80 Q 57 88 34 80 Z" fill="#ff5555" />
        <rect x="40" y="80" width="7" height="8" rx="1.5" fill="white" />
        <rect x="49" y="80" width="7" height="8" rx="1.5" fill="white" />
        <rect x="58" y="80" width="7" height="8" rx="1.5" fill="white" />
        <rect x="67" y="80" width="7" height="8" rx="1.5" fill="white" />
        <rect x="44" y="88" width="5" height="6" rx="1" fill="white" />
        <rect x="53" y="89" width="5" height="6" rx="1" fill="white" />
        <rect x="62" y="89" width="5" height="6" rx="1" fill="white" />
      </g>
    ),
    sad: (
      <path d="M 38 90 Q 57 82 80 90"
        fill="none" stroke="#003300" strokeWidth="3" strokeLinecap="round" />
    ),
  }[mood];

  const bodyColor = mood === "happy" ? "#22cc44" : mood === "sad" ? "#4a8a5a" : "#18a834";
  const bodyDark  = mood === "happy" ? "#008820" : mood === "sad" ? "#2a5a3a" : "#006618";

  const sparkles = mood === "happy" ? (
    <g>
      <path d="M 12 50 l1.5 -4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 Z" fill="#ffe066" />
      <path d="M 104 44 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z" fill="#ffe066" />
      <circle cx="14" cy="68" r="1.8" fill="#ff99cc" />
      <circle cx="104" cy="66" r="1.4" fill="#aaffaa" />
    </g>
  ) : null;

  const tears = mood === "sad" ? (
    <g>
      <ellipse cx={eyeLCx} cy={eyeLCy + 10} rx="2" ry="3" fill="#88ccff" opacity={0.8} />
      <ellipse cx={eyeRCx} cy={eyeRCy + 10} rx="2" ry="3" fill="#88ccff" opacity={0.8} />
    </g>
  ) : null;

  return (
    <>
      <defs>
        <filter id={`${uid}-fuzz`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id={`${uid}-body`} cx="40%" cy="36%" r="60%">
          <stop offset="0%"   stopColor={bodyColor} />
          <stop offset="100%" stopColor={bodyDark} />
        </radialGradient>
        <radialGradient id={`${uid}-iris`} cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#ffcc00" />
          <stop offset="100%" stopColor="#cc8800" />
        </radialGradient>
        <radialGradient id={`${uid}-sheen`} cx="35%" cy="25%" r="45%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="43" cy="113" rx="14" ry="9" fill={bodyDark} filter={`url(#${uid}-fuzz)`} />
      <ellipse cx="77" cy="113" rx="14" ry="9" fill={bodyDark} filter={`url(#${uid}-fuzz)`} />
      <circle cx="32" cy="112" r="3" fill="#001a00" opacity={0.4} />
      <circle cx="40" cy="116" r="2.5" fill="#001a00" opacity={0.4} />
      <circle cx="49" cy="117" r="2.5" fill="#001a00" opacity={0.4} />
      <circle cx="66" cy="112" r="3" fill="#001a00" opacity={0.4} />
      <circle cx="74" cy="116" r="2.5" fill="#001a00" opacity={0.4} />
      <circle cx="83" cy="117" r="2.5" fill="#001a00" opacity={0.4} />

      <ellipse cx="57" cy="74" rx="36" ry="46"
        fill={`url(#${uid}-body)`} filter={`url(#${uid}-fuzz)`} />
      <ellipse cx="57" cy="74" rx="36" ry="46" fill={`url(#${uid}-sheen)`} />

      <circle cx="42" cy="62" r="5" fill={bodyDark} opacity={0.35} />
      <circle cx="68" cy="55" r="4" fill={bodyDark} opacity={0.35} />
      <circle cx="72" cy="80" r="6" fill={bodyDark} opacity={0.3} />
      <circle cx="44" cy="92" r="5" fill={bodyDark} opacity={0.3} />
      <circle cx="57" cy="110" r="4" fill={bodyDark} opacity={0.25} />

      <ellipse cx="24" cy="76" rx="10" ry="6" fill={bodyColor}
        transform="rotate(-30 24 76)" filter={`url(#${uid}-fuzz)`} />
      <ellipse cx="90" cy="76" rx="10" ry="6" fill={bodyColor}
        transform="rotate(30 90 76)" filter={`url(#${uid}-fuzz)`} />
      <circle cx="16" cy="71" r="3" fill={bodyDark} />
      <circle cx="15" cy="78" r="2.5" fill={bodyDark} />
      <circle cx="98" cy="71" r="3" fill={bodyDark} />
      <circle cx="99" cy="78" r="2.5" fill={bodyDark} />

      <path d={stalkL} fill="none" stroke={bodyDark} strokeWidth="5" strokeLinecap="round" />
      <path d={stalkR} fill="none" stroke={bodyDark} strokeWidth="5" strokeLinecap="round" />

      <circle cx={eyeLCx} cy={eyeLCy} r="10" fill="white" />
      <circle cx={eyeLCx} cy={eyeLCy} r="6.5" fill={`url(#${uid}-iris)`} />
      <circle cx={eyeLCx} cy={eyeLCy} r="3.5" fill="#1a0a00" />
      <Highlight cx={eyeLCx - 2.5} cy={eyeLCy - 3} r={2.2} />
      <MiniHighlight cx={eyeLCx - 2.5} cy={eyeLCy - 3} />

      <circle cx={eyeRCx} cy={eyeRCy} r="10" fill="white" />
      <circle cx={eyeRCx} cy={eyeRCy} r="6.5" fill={`url(#${uid}-iris)`} />
      <circle cx={eyeRCx} cy={eyeRCy} r="3.5" fill="#1a0a00" />
      <Highlight cx={eyeRCx - 2.5} cy={eyeRCy - 3} r={2.2} />
      <MiniHighlight cx={eyeRCx - 2.5} cy={eyeRCy - 3} />

      {mood === "sad" && (
        <>
          <path d={`M ${eyeLCx - 9} ${eyeLCy} Q ${eyeLCx} ${eyeLCy - 4} ${eyeLCx + 9} ${eyeLCy}`}
            fill="none" stroke="#336633" strokeWidth="2" />
          <path d={`M ${eyeRCx - 9} ${eyeRCy} Q ${eyeRCx} ${eyeRCy - 4} ${eyeRCx + 9} ${eyeRCy}`}
            fill="none" stroke="#336633" strokeWidth="2" />
        </>
      )}
      {mood === "happy" && (
        <>
          <path d={`M ${eyeLCx} ${eyeLCy - 3} l1 -3 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 Z`}
            fill="white" opacity={0.9} />
          <path d={`M ${eyeRCx} ${eyeRCy - 3} l1 -3 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 Z`}
            fill="white" opacity={0.9} />
        </>
      )}

      {tears}
      {sparkles}
      {mouth}

      {mood === "happy" && (
        <>
          <ellipse cx="34" cy="80" rx="7" ry="4" fill="#88ff88" opacity={0.35} />
          <ellipse cx="80" cy="78" rx="7" ry="4" fill="#88ff88" opacity={0.35} />
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CHARACTER 2
   Small triangular orange monster — three eyes in a row, spiky hair
   crown, stubby arms splayed out, wide rooted feet
   ═══════════════════════════════════════════════════════════════════ */

function Monster2({ mood, uid }: { mood: Mood; uid: string }) {
  const eyeY   = mood === "sad" ? 64 : 60;
  const centerEyeR = mood === "happy" ? 9 : 8;
  const spikeH = mood === "happy" ? -4 : mood === "sad" ? 4 : 0;

  const mouth = {
    neutral: (
      <path d="M 40 84 Q 57 92 78 84"
        fill="none" stroke="#4a1500" strokeWidth="3" strokeLinecap="round" />
    ),
    happy: (
      <g>
        <path d="M 36 82 Q 57 100 82 82"
          fill="#cc4400" stroke="#4a1500" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 40 83 Q 57 91 78 83" fill="white" stroke="none" />
        <rect x="46" y="83" width="6" height="6" rx="1.5" fill="white" />
        <rect x="54" y="83" width="6" height="6" rx="1.5" fill="white" />
        <rect x="62" y="83" width="6" height="6" rx="1.5" fill="white" />
      </g>
    ),
    sad: (
      <path d="M 40 90 Q 57 82 78 90"
        fill="none" stroke="#4a1500" strokeWidth="3" strokeLinecap="round" />
    ),
  }[mood];

  const bodyColor = mood === "happy" ? "#ff8800" : mood === "sad" ? "#c08040" : "#e07000";
  const bodyDark  = mood === "happy" ? "#cc5500" : mood === "sad" ? "#8a5020" : "#aa4400";

  const sparkles = mood === "happy" ? (
    <g>
      <path d="M 8 60 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z" fill="#ffe066" />
      <path d="M 106 54 l1.5 -4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 Z" fill="#ffe066" />
      <circle cx="10" cy="76" r="2" fill="#ffaaff" />
      <circle cx="108" cy="74" r="1.6" fill="#ffcc44" />
    </g>
  ) : null;

  const tears = mood === "sad" ? (
    <g>
      <ellipse cx="40" cy={eyeY + 9} rx="2" ry="3.5" fill="#88ccff" opacity={0.8} />
      <ellipse cx="57" cy={eyeY + 10} rx="2" ry="3" fill="#88ccff" opacity={0.75} />
      <ellipse cx="74" cy={eyeY + 9} rx="2" ry="3.5" fill="#88ccff" opacity={0.8} />
    </g>
  ) : null;

  return (
    <>
      <defs>
        <filter id={`${uid}-fuzz`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id={`${uid}-body`} cx="42%" cy="40%" r="58%">
          <stop offset="0%"   stopColor={bodyColor} />
          <stop offset="100%" stopColor={bodyDark}  />
        </radialGradient>
        <radialGradient id={`${uid}-iris-l`} cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#ff3366" />
          <stop offset="100%" stopColor="#cc0044" />
        </radialGradient>
        <radialGradient id={`${uid}-iris-c`} cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#aa44ff" />
          <stop offset="100%" stopColor="#6600cc" />
        </radialGradient>
        <radialGradient id={`${uid}-iris-r`} cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#00ccff" />
          <stop offset="100%" stopColor="#0066cc" />
        </radialGradient>
        <radialGradient id={`${uid}-sheen`} cx="36%" cy="28%" r="45%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="45" cy="112" rx="16" ry="9" fill={bodyDark} filter={`url(#${uid}-fuzz)`} />
      <ellipse cx="75" cy="112" rx="16" ry="9" fill={bodyDark} filter={`url(#${uid}-fuzz)`} />

      <path d="M 57 18 L 100 108 L 14 108 Z"
        fill={`url(#${uid}-body)`} filter={`url(#${uid}-fuzz)`} />
      <path d="M 57 18 L 100 108 L 14 108 Z" fill={`url(#${uid}-sheen)`} />

      <ellipse cx="14" cy="80" rx="11" ry="6" fill={bodyColor}
        transform="rotate(-40 14 80)" filter={`url(#${uid}-fuzz)`} />
      <circle cx="6" cy="72" r="3.5" fill={bodyDark} />
      <circle cx="5" cy="79" r="3" fill={bodyDark} />
      <circle cx="8" cy="86" r="3" fill={bodyDark} />
      <ellipse cx="100" cy="80" rx="11" ry="6" fill={bodyColor}
        transform="rotate(40 100 80)" filter={`url(#${uid}-fuzz)`} />
      <circle cx="112" cy="72" r="3.5" fill={bodyDark} />
      <circle cx="113" cy="79" r="3" fill={bodyDark} />
      <circle cx="110" cy="86" r="3" fill={bodyDark} />

      <ellipse cx="57" cy="24" rx="22" ry="12" fill={bodyColor} filter={`url(#${uid}-fuzz)`} />
      <path d={`M 32 22 L 26 ${4 + spikeH} L 38 18 Z`} fill={bodyDark} filter={`url(#${uid}-fuzz)`} />
      <path d={`M 42 14 L 38 ${-2 + spikeH} L 50 12 Z`} fill={bodyColor} filter={`url(#${uid}-fuzz)`} />
      <path d={`M 57 12 L 55 ${-4 + spikeH} L 63 10 Z`} fill={bodyDark} filter={`url(#${uid}-fuzz)`} />
      <path d={`M 70 14 L 74 ${-2 + spikeH} L 78 16 Z`} fill={bodyColor} filter={`url(#${uid}-fuzz)`} />
      <path d={`M 80 22 L 86 ${4 + spikeH} L 76 20 Z`} fill={bodyDark} filter={`url(#${uid}-fuzz)`} />

      <circle cx="40" cy={eyeY} r="8" fill="white" />
      <circle cx="40" cy={eyeY} r="5" fill={`url(#${uid}-iris-l)`} />
      <circle cx="40" cy={eyeY} r="2.5" fill="#1a0000" />
      <Highlight cx={37.5} cy={eyeY - 2.5} r={1.8} />
      <MiniHighlight cx={37.5} cy={eyeY - 2.5} />

      <circle cx="57" cy={eyeY - 2} r={centerEyeR} fill="white" />
      <circle cx="57" cy={eyeY - 2} r={centerEyeR * 0.65} fill={`url(#${uid}-iris-c)`} />
      <circle cx="57" cy={eyeY - 2} r={centerEyeR * 0.35} fill="#100020" />
      <Highlight cx={54.5} cy={eyeY - 4} r={2} />

      <circle cx="74" cy={eyeY} r="8" fill="white" />
      <circle cx="74" cy={eyeY} r="5" fill={`url(#${uid}-iris-r)`} />
      <circle cx="74" cy={eyeY} r="2.5" fill="#000a1a" />
      <Highlight cx={71.5} cy={eyeY - 2.5} r={1.8} />
      <MiniHighlight cx={71.5} cy={eyeY - 2.5} />

      {mood === "sad" && (
        <>
          <path d={`M 33 ${eyeY - 5} Q 40 ${eyeY - 8} 47 ${eyeY - 5}`}
            fill="none" stroke="#8a5020" strokeWidth="2" />
          <path d={`M 50 ${eyeY - 7} Q 57 ${eyeY - 11} 64 ${eyeY - 7}`}
            fill="none" stroke="#8a5020" strokeWidth="2" />
          <path d={`M 67 ${eyeY - 5} Q 74 ${eyeY - 8} 81 ${eyeY - 5}`}
            fill="none" stroke="#8a5020" strokeWidth="2" />
        </>
      )}
      {mood === "happy" && (
        <>
          <path d={`M 40 ${eyeY - 2} l1 -2.5 l1 2.5 l2.5 1 l-2.5 1 l-1 2.5 l-1 -2.5 l-2.5 -1 Z`}
            fill="white" opacity={0.85} />
          <path d={`M 57 ${eyeY - 4} l1 -2.5 l1 2.5 l2.5 1 l-2.5 1 l-1 2.5 l-1 -2.5 l-2.5 -1 Z`}
            fill="white" opacity={0.85} />
          <path d={`M 74 ${eyeY - 2} l1 -2.5 l1 2.5 l2.5 1 l-2.5 1 l-1 2.5 l-1 -2.5 l-2.5 -1 Z`}
            fill="white" opacity={0.85} />
        </>
      )}

      {mood === "neutral" && (
        <path d="M 33 54 Q 57 50 81 54"
          fill="none" stroke={bodyDark} strokeWidth="2.5" strokeLinecap="round" />
      )}
      {mood === "happy" && (
        <path d="M 33 50 Q 57 44 81 50"
          fill="none" stroke={bodyDark} strokeWidth="2.5" strokeLinecap="round" />
      )}
      {mood === "sad" && (
        <>
          <path d="M 33 56 Q 45 53 57 56" fill="none" stroke={bodyDark} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 57 56 Q 69 53 81 56" fill="none" stroke={bodyDark} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {tears}
      {sparkles}
      {mouth}

      {mood === "happy" && (
        <>
          <ellipse cx="30" cy="80" rx="7" ry="4" fill="#ffcc88" opacity={0.45} />
          <ellipse cx="84" cy="80" rx="7" ry="4" fill="#ffcc88" opacity={0.45} />
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CHARACTER 3
   Blue cloud monster — soft puffy cloud silhouette, two big round
   eyes, tiny feathery wings on sides, curly tail bottom-right,
   tiny fangs visible in mouth
   ═══════════════════════════════════════════════════════════════════ */

function Monster3({ mood, uid }: { mood: Mood; uid: string }) {
  const wingLPath = mood === "happy"
    ? "M 22 58 Q 4 42 8 28 Q 12 16 22 24 Q 16 40 22 58 Z"
    : mood === "sad"
    ? "M 22 62 Q 6 58 8 46 Q 10 36 20 40 Q 14 52 22 62 Z"
    : "M 22 60 Q 4 50 6 36 Q 10 24 20 32 Q 14 46 22 60 Z";

  const wingRPath = mood === "happy"
    ? "M 96 58 Q 114 42 110 28 Q 106 16 96 24 Q 102 40 96 58 Z"
    : mood === "sad"
    ? "M 96 62 Q 112 58 110 46 Q 108 36 98 40 Q 104 52 96 62 Z"
    : "M 96 60 Q 114 50 112 36 Q 108 24 98 32 Q 104 46 96 60 Z";

  const tailPath = mood === "happy"
    ? "M 90 100 Q 106 96 110 84 Q 114 72 104 70 Q 96 68 96 78 Q 96 86 106 84"
    : mood === "sad"
    ? "M 90 104 Q 100 106 104 100 Q 108 94 100 92"
    : "M 90 102 Q 108 100 112 88 Q 114 78 106 76 Q 98 74 100 82";

  const mouth = {
    neutral: (
      <g>
        <path d="M 42 78 Q 57 86 74 78"
          fill="none" stroke="#003355" strokeWidth="3" strokeLinecap="round" />
        <path d="M 46 78 L 44 84 L 50 79" fill="white" stroke="#aaccee" strokeWidth="0.8" />
        <path d="M 70 78 L 72 84 L 66 79" fill="white" stroke="#aaccee" strokeWidth="0.8" />
      </g>
    ),
    happy: (
      <g>
        <path d="M 38 76 Q 57 96 80 76"
          fill="#3399cc" stroke="#003355" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 42 77 Q 57 85 74 77" fill="white" stroke="none" />
        <rect x="48" y="77" width="6" height="7" rx="1.5" fill="white" />
        <rect x="56" y="77" width="6" height="7" rx="1.5" fill="white" />
        <rect x="64" y="77" width="6" height="7" rx="1.5" fill="white" />
        <path d="M 44 78 L 42 85 L 48 80" fill="white" stroke="#88bbdd" strokeWidth="0.8" />
        <path d="M 72 78 L 74 85 L 68 80" fill="white" stroke="#88bbdd" strokeWidth="0.8" />
      </g>
    ),
    sad: (
      <g>
        <path d="M 42 84 Q 57 76 74 84"
          fill="none" stroke="#003355" strokeWidth="3" strokeLinecap="round" />
        <path d="M 46 84 L 44 90 L 50 85" fill="white" stroke="#aaccee" strokeWidth="0.8" />
        <path d="M 70 84 L 72 90 L 66 85" fill="white" stroke="#aaccee" strokeWidth="0.8" />
      </g>
    ),
  }[mood];

  const bodyColor = mood === "happy" ? "#44aaff" : mood === "sad" ? "#5588aa" : "#2288ee";
  const bodyLight = mood === "happy" ? "#88ccff" : mood === "sad" ? "#7799bb" : "#66aaff";
  const bodyDark  = mood === "happy" ? "#0066cc" : mood === "sad" ? "#336688" : "#0055bb";

  const sparkles = mood === "happy" ? (
    <g>
      <path d="M 10 52 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z" fill="#ffe066" />
      <path d="M 104 46 l1.5 -4 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 Z" fill="#ffe066" />
      <circle cx="12" cy="68" r="2" fill="#ccffff" />
      <circle cx="106" cy="66" r="1.8" fill="#aaddff" />
      <circle cx="58" cy="10" r="2.5" fill="#ffffff" opacity={0.8} />
    </g>
  ) : null;

  const tears = mood === "sad" ? (
    <g>
      <ellipse cx="44" cy="69" rx="2.5" ry="4" fill="#88ccff" opacity={0.85} />
      <ellipse cx="70" cy="70" rx="2" ry="3.5" fill="#88ccff" opacity={0.8} />
    </g>
  ) : null;

  return (
    <>
      <defs>
        <filter id={`${uid}-fuzz`} x="-14%" y="-14%" width="128%" height="128%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id={`${uid}-body`} cx="40%" cy="34%" r="60%">
          <stop offset="0%"   stopColor={bodyLight} />
          <stop offset="100%" stopColor={bodyColor}  />
        </radialGradient>
        <radialGradient id={`${uid}-iris-l`} cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#66ffaa" />
          <stop offset="100%" stopColor="#008844" />
        </radialGradient>
        <radialGradient id={`${uid}-iris-r`} cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#ffcc44" />
          <stop offset="100%" stopColor="#cc8800" />
        </radialGradient>
        <radialGradient id={`${uid}-sheen`} cx="36%" cy="24%" r="48%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.28" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path d={tailPath}
        fill="none" stroke={bodyColor} strokeWidth="5" strokeLinecap="round"
        filter={`url(#${uid}-fuzz)`} />
      <path d={tailPath}
        fill="none" stroke={bodyLight} strokeWidth="2.5" strokeLinecap="round"
        opacity={0.6} />

      <path d={wingLPath} fill={bodyLight} stroke={bodyDark} strokeWidth="1.2"
        filter={`url(#${uid}-fuzz)`} opacity={0.9} />
      <path d={wingRPath} fill={bodyLight} stroke={bodyDark} strokeWidth="1.2"
        filter={`url(#${uid}-fuzz)`} opacity={0.9} />
      <path d={wingLPath} fill="none" stroke={bodyDark} strokeWidth="0.7" opacity={0.3} />
      <path d={wingRPath} fill="none" stroke={bodyDark} strokeWidth="0.7" opacity={0.3} />

      <circle cx="32" cy="64" r="22" fill={`url(#${uid}-body)`} filter={`url(#${uid}-fuzz)`} />
      <circle cx="80" cy="64" r="22" fill={`url(#${uid}-body)`} filter={`url(#${uid}-fuzz)`} />
      <circle cx="57" cy="48" r="24" fill={`url(#${uid}-body)`} filter={`url(#${uid}-fuzz)`} />
      <circle cx="38" cy="56" r="18" fill={`url(#${uid}-body)`} filter={`url(#${uid}-fuzz)`} />
      <circle cx="76" cy="56" r="18" fill={`url(#${uid}-body)`} filter={`url(#${uid}-fuzz)`} />
      <rect x="24" y="68" width="70" height="30" rx="8" fill={`url(#${uid}-body)`} />
      <circle cx="57" cy="48" r="24" fill={`url(#${uid}-sheen)`} />

      <circle cx="44" cy="58" r="12" fill="white" />
      <circle cx="44" cy="58" r="8" fill={`url(#${uid}-iris-l)`} />
      <circle cx="44" cy="58" r="4.5" fill="#001a0d" />
      <Highlight cx={41} cy={55} r={2.8} />
      <MiniHighlight cx={41} cy={55} />
      <circle cx="48" cy="62" r="1.2" fill="white" opacity={0.5} />

      <circle cx="70" cy="58" r="12" fill="white" />
      <circle cx="70" cy="58" r="8" fill={`url(#${uid}-iris-r)`} />
      <circle cx="70" cy="58" r="4.5" fill="#1a1000" />
      <Highlight cx={67} cy={55} r={2.8} />
      <MiniHighlight cx={67} cy={55} />
      <circle cx="74" cy="62" r="1.2" fill="white" opacity={0.5} />

      {mood === "sad" && (
        <>
          <path d="M 33 52 Q 44 46 55 52"
            fill="none" stroke={bodyDark} strokeWidth="3" strokeLinecap="round" />
          <path d="M 59 52 Q 70 46 81 52"
            fill="none" stroke={bodyDark} strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {mood === "happy" && (
        <>
          <path d="M 44 55 l1.2 -3.5 l1.2 3.5 l3.5 1.2 l-3.5 1.2 l-1.2 3.5 l-1.2 -3.5 l-3.5 -1.2 Z"
            fill="white" opacity={0.9} />
          <path d="M 70 55 l1.2 -3.5 l1.2 3.5 l3.5 1.2 l-3.5 1.2 l-1.2 3.5 l-1.2 -3.5 l-3.5 -1.2 Z"
            fill="white" opacity={0.9} />
        </>
      )}

      {mood === "neutral" && (
        <>
          <path d="M 35 46 Q 44 42 53 46"
            fill="none" stroke={bodyDark} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 61 46 Q 70 42 79 46"
            fill="none" stroke={bodyDark} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {mood === "happy" && (
        <>
          <path d="M 35 42 Q 44 36 53 42"
            fill="none" stroke={bodyDark} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 61 42 Q 70 36 79 42"
            fill="none" stroke={bodyDark} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {mood === "sad" && (
        <>
          <path d="M 35 48 Q 44 45 53 48"
            fill="none" stroke={bodyDark} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 61 48 Q 70 45 79 48"
            fill="none" stroke={bodyDark} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      <ellipse cx="32" cy="68" rx="8" ry="5" fill={bodyLight} opacity={0.5} />
      <ellipse cx="82" cy="68" rx="8" ry="5" fill={bodyLight} opacity={0.5} />

      {tears}
      {sparkles}
      {mouth}

      {mood === "happy" && (
        <>
          <ellipse cx="32" cy="70" rx="8" ry="5" fill="#88ddff" opacity={0.4} />
          <ellipse cx="82" cy="70" rx="8" ry="5" fill="#88ddff" opacity={0.4} />
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main export — matches the app's existing CharacterProps interface:
   { id: number, mood, onClick, highlighted }
   ═══════════════════════════════════════════════════════════════════ */

const MONSTERS = [Monster0, Monster1, Monster2, Monster3] as const;

export function Character({ id, mood = "neutral", onClick, highlighted = false, size = 150 }: CharacterProps) {
  const Monster = MONSTERS[id % MONSTERS.length];
  // Unique ID prefix for SVG defs (filters/gradients) to avoid clashes
  // when multiple characters are rendered on the same page
  const uid = `m${id % MONSTERS.length}`;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center transition-all ${
        highlighted ? "bg-white/10 rounded-xl p-1" : "p-1"
      } ${onClick ? "cursor-pointer hover:scale-105" : ""}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        <Monster mood={mood} uid={uid} />
      </svg>
    </button>
  );
}
