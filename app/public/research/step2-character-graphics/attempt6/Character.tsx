"use client";

/* ============================================================
   Superhero Kids — Character SVG Component
   attempt6 — Diverse kids in superhero costumes

   Characters (bust portrait, head + shoulders + cape):
     0: Blaze  — red cape, flame mask, warm brown skin, curly dark hair
     1: Frost  — blue cape, snowflake tiara, light skin, blonde pigtails
     2: Bolt   — yellow cape, lightning mask, medium-brown skin, spiky hair
     3: Ivy    — green cape, leaf crown, deep brown skin, long braids

   Mood effects:
     • happy  → cape billows wide, eyes crinkle, big smile, blush
     • neutral → cape hangs naturally, relaxed expression
     • sad    → cape droops inward, puppy eyes, frown, single tear
   ============================================================ */

type Mood = "neutral" | "happy" | "sad";

interface CharacterProps {
  index: 0 | 1 | 2 | 3;
  mood: "neutral" | "happy" | "sad";
  size?: number;
}

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                      */
/* ------------------------------------------------------------------ */

function eyeShine(cx: number, cy: number, key?: string) {
  return (
    <>
      <circle key={key ? key + "a" : undefined} cx={cx} cy={cy} r={1.5} fill="white" opacity={0.95} />
      <circle key={key ? key + "b" : undefined} cx={cx + 2.8} cy={cy + 2} r={0.7} fill="white" opacity={0.6} />
    </>
  );
}

function tear(cx: number, cy: number) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={1.4}
      ry={2.2}
      fill="#a8d8f0"
      opacity={0.85}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  BLAZE — Character 0                                                 */
/*  Red cape, flame mask, warm brown skin, curly dark hair             */
/* ------------------------------------------------------------------ */

function Blaze({ mood }: { mood: Mood }) {
  /* Cape shape varies by mood */
  const cape =
    mood === "happy" ? (
      /* billowing wide */
      <path
        d="M 50 78
           C 30 74, 4 70, 2 90
           L 2 130 L 98 130 L 98 90
           C 96 70, 70 74, 50 78 Z"
        fill="url(#blazeCape)"
        stroke="#8b0000"
        strokeWidth="1.2"
      />
    ) : mood === "sad" ? (
      /* drooping inward */
      <path
        d="M 50 78
           C 38 80, 18 88, 20 110
           L 20 130 L 80 130 L 80 110
           C 82 88, 62 80, 50 78 Z"
        fill="url(#blazeCape)"
        stroke="#8b0000"
        strokeWidth="1.2"
      />
    ) : (
      /* neutral — hangs naturally */
      <path
        d="M 50 78
           C 35 76, 10 78, 8 100
           L 8 130 L 92 130 L 92 100
           C 90 78, 65 76, 50 78 Z"
        fill="url(#blazeCape)"
        stroke="#8b0000"
        strokeWidth="1.2"
      />
    );

  /* Flame mask — around eyes */
  const mask = (
    <>
      {/* Main mask band */}
      <path
        d="M 22 40 C 22 34, 34 30, 40 33 L 40 48 C 34 50, 22 46, 22 40 Z"
        fill="url(#blazeMask)"
      />
      <path
        d="M 78 40 C 78 34, 66 30, 60 33 L 60 48 C 66 50, 78 46, 78 40 Z"
        fill="url(#blazeMask)"
      />
      {/* Bridge */}
      <rect x="40" y="33" width="20" height="14" fill="url(#blazeMask)" />
      {/* Flame tips on top */}
      <path d="M 26 33 C 26 25, 31 20, 30 15 C 33 21, 36 18, 35 14 C 38 20, 38 26, 38 30" fill="url(#blazeFlame)" />
      <path d="M 54 31 C 54 23, 58 18, 57 13 C 60 20, 63 17, 62 12 C 65 19, 65 25, 64 29" fill="url(#blazeFlame)" />
      <path d="M 67 33 C 68 25, 72 21, 71 16 C 74 22, 76 19, 75 15 C 78 21, 77 27, 74 31" fill="url(#blazeFlame)" />
    </>
  );

  /* Eyes in mask holes */
  const eyes =
    mood === "happy" ? (
      <>
        {/* Happy squinted arcs */}
        <path d="M 30 40 Q 36 34 42 40" fill="none" stroke="#1a0800" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 58 40 Q 64 34 70 40" fill="none" stroke="#1a0800" strokeWidth="2.4" strokeLinecap="round" />
      </>
    ) : mood === "sad" ? (
      <>
        <ellipse cx="36" cy="40" rx="5.5" ry="6" fill="white" />
        <ellipse cx="64" cy="40" rx="5.5" ry="6" fill="white" />
        <path d="M 30 37 Q 36 35 42 38" fill="none" stroke="#1a0800" strokeWidth="1.2" />
        <path d="M 58 38 Q 64 35 70 37" fill="none" stroke="#1a0800" strokeWidth="1.2" />
        <ellipse cx="36" cy="41.5" rx="3.2" ry="3.6" fill="#3d2010" />
        <ellipse cx="64" cy="41.5" rx="3.2" ry="3.6" fill="#3d2010" />
        <circle cx="36" cy="41.5" r="1.8" fill="#0a0500" />
        <circle cx="64" cy="41.5" r="1.8" fill="#0a0500" />
        {eyeShine(34.5, 39.5)}
        {eyeShine(62.5, 39.5)}
        {tear(36, 49)}
        {tear(64, 49)}
      </>
    ) : (
      <>
        <ellipse cx="36" cy="40" rx="5.5" ry="6" fill="white" />
        <ellipse cx="64" cy="40" rx="5.5" ry="6" fill="white" />
        <ellipse cx="36" cy="40.5" rx="3.2" ry="3.6" fill="#3d2010" />
        <ellipse cx="64" cy="40.5" rx="3.2" ry="3.6" fill="#3d2010" />
        <circle cx="36" cy="40.5" r="1.8" fill="#0a0500" />
        <circle cx="64" cy="40.5" r="1.8" fill="#0a0500" />
        {eyeShine(34.5, 38.8)}
        {eyeShine(62.5, 38.8)}
      </>
    );

  const brows =
    mood === "happy" ? (
      <>
        <path d="M 30 33 Q 36 29 42 32" fill="none" stroke="#1a0800" strokeWidth="2" strokeLinecap="round" />
        <path d="M 58 32 Q 64 29 70 33" fill="none" stroke="#1a0800" strokeWidth="2" strokeLinecap="round" />
      </>
    ) : mood === "sad" ? (
      <>
        <path d="M 30 32 Q 36 35 42 34" fill="none" stroke="#1a0800" strokeWidth="2" strokeLinecap="round" />
        <path d="M 58 34 Q 64 35 70 32" fill="none" stroke="#1a0800" strokeWidth="2" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M 30 33 Q 36 31 42 33" fill="none" stroke="#1a0800" strokeWidth="2" strokeLinecap="round" />
        <path d="M 58 33 Q 64 31 70 33" fill="none" stroke="#1a0800" strokeWidth="2" strokeLinecap="round" />
      </>
    );

  const mouth =
    mood === "happy" ? (
      <>
        <path d="M 37 55 Q 50 66 63 55" fill="#c0392b" stroke="#7b1a1a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 40 56 Q 50 60 60 56" fill="white" stroke="none" />
      </>
    ) : mood === "sad" ? (
      <path d="M 40 60 Q 50 54 60 60" fill="none" stroke="#7b1a1a" strokeWidth="2.2" strokeLinecap="round" />
    ) : (
      <path d="M 40 56 Q 50 61 60 56" fill="none" stroke="#7b1a1a" strokeWidth="2" strokeLinecap="round" />
    );

  const blush =
    mood === "happy" ? (
      <>
        <ellipse cx="26" cy="50" rx="5" ry="3" fill="#e8604a" opacity={0.4} />
        <ellipse cx="74" cy="50" rx="5" ry="3" fill="#e8604a" opacity={0.4} />
      </>
    ) : null;

  return (
    <>
      <defs>
        {/* Skin — warm brown */}
        <radialGradient id="blazeSkin" cx="48%" cy="38%" r="56%">
          <stop offset="0%" stopColor="#c8804a" />
          <stop offset="100%" stopColor="#9a5a28" />
        </radialGradient>
        {/* Cape */}
        <linearGradient id="blazeCape" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cc1414" />
          <stop offset="50%" stopColor="#e83030" />
          <stop offset="100%" stopColor="#cc1414" />
        </linearGradient>
        {/* Costume body */}
        <linearGradient id="blazeBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bb1010" />
          <stop offset="100%" stopColor="#880808" />
        </linearGradient>
        {/* Mask */}
        <linearGradient id="blazeMask" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cc2200" />
          <stop offset="100%" stopColor="#881100" />
        </linearGradient>
        {/* Flame tips */}
        <linearGradient id="blazeFlame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff6600" />
          <stop offset="60%" stopColor="#ffcc00" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
        </linearGradient>
        {/* Hair — dark curly */}
        <radialGradient id="blazeHair" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#3a2010" />
          <stop offset="100%" stopColor="#150a04" />
        </radialGradient>
        {/* Drop shadow filter */}
        <filter id="blazeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#00000055" />
        </filter>
      </defs>

      {/* ===== CAPE (behind everything) ===== */}
      {cape}

      {/* ===== COSTUME SHOULDERS / BODY ===== */}
      <path
        d="M 18 80 Q 18 68 50 66 Q 82 68 82 80 L 82 130 L 18 130 Z"
        fill="url(#blazeBody)"
        filter="url(#blazeShadow)"
      />
      {/* Chest emblem — flame bolt */}
      <path
        d="M 50 72 L 46 82 L 50 80 L 46 92 L 54 79 L 50 81 Z"
        fill="#ff8800"
        stroke="#ffcc00"
        strokeWidth="0.6"
      />
      {/* Collar ridge */}
      <path d="M 28 73 Q 50 68 72 73" fill="none" stroke="#ff3300" strokeWidth="1.4" strokeLinecap="round" />

      {/* ===== CURLY HAIR (behind head, peek-around sides) ===== */}
      <ellipse cx="50" cy="28" rx="28" ry="23" fill="url(#blazeHair)" />
      {/* Curl bumps on top */}
      <circle cx="30" cy="22" r="7" fill="url(#blazeHair)" />
      <circle cx="40" cy="14" r="7.5" fill="url(#blazeHair)" />
      <circle cx="50" cy="11" r="7.5" fill="url(#blazeHair)" />
      <circle cx="60" cy="14" r="7.5" fill="url(#blazeHair)" />
      <circle cx="70" cy="22" r="7" fill="url(#blazeHair)" />
      {/* Side peek-out curls under mask */}
      <circle cx="22" cy="34" r="6" fill="url(#blazeHair)" />
      <circle cx="78" cy="34" r="6" fill="url(#blazeHair)" />

      {/* ===== FACE ===== */}
      <ellipse cx="50" cy="44" rx="25" ry="26" fill="url(#blazeSkin)" filter="url(#blazeShadow)" />

      {/* Ears */}
      <ellipse cx="25" cy="44" rx="4.5" ry="5.5" fill="url(#blazeSkin)" />
      <ellipse cx="75" cy="44" rx="4.5" ry="5.5" fill="url(#blazeSkin)" />

      {/* Nose */}
      <ellipse cx="50" cy="50" rx="2.5" ry="1.8" fill="#8a5020" opacity={0.55} />

      {/* ===== FLAME MASK ===== */}
      {mask}

      {/* ===== EXPRESSIONS ===== */}
      {brows}
      {eyes}
      {mouth}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  FROST — Character 1                                                 */
/*  Blue cape, snowflake tiara, light skin, blonde pigtails            */
/* ------------------------------------------------------------------ */

function Frost({ mood }: { mood: Mood }) {
  const cape =
    mood === "happy" ? (
      <path
        d="M 50 78
           C 28 74, 2 68, 1 90
           L 1 130 L 99 130 L 99 90
           C 98 68, 72 74, 50 78 Z"
        fill="url(#frostCape)"
        stroke="#003a8c"
        strokeWidth="1.2"
      />
    ) : mood === "sad" ? (
      <path
        d="M 50 78
           C 38 81, 20 90, 22 112
           L 22 130 L 78 130 L 78 112
           C 80 90, 62 81, 50 78 Z"
        fill="url(#frostCape)"
        stroke="#003a8c"
        strokeWidth="1.2"
      />
    ) : (
      <path
        d="M 50 78
           C 34 76, 10 80, 9 102
           L 9 130 L 91 130 L 91 102
           C 90 80, 66 76, 50 78 Z"
        fill="url(#frostCape)"
        stroke="#003a8c"
        strokeWidth="1.2"
      />
    );

  /* Snowflake tiara */
  const tiara = (
    <>
      {/* Tiara band */}
      <path
        d="M 24 28 Q 50 20 76 28"
        fill="none"
        stroke="url(#frostTiara)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Center snowflake gem */}
      <circle cx="50" cy="23" r="5" fill="url(#frostGem)" stroke="white" strokeWidth="0.8" />
      {/* Snowflake lines */}
      <line x1="50" y1="18" x2="50" y2="28" stroke="white" strokeWidth="0.8" />
      <line x1="45" y1="20.7" x2="55" y2="25.3" stroke="white" strokeWidth="0.8" />
      <line x1="45" y1="25.3" x2="55" y2="20.7" stroke="white" strokeWidth="0.8" />
      {/* Tiara accent gems */}
      <circle cx="36" cy="26.5" r="2.5" fill="url(#frostGem)" stroke="white" strokeWidth="0.6" />
      <circle cx="64" cy="26.5" r="2.5" fill="url(#frostGem)" stroke="white" strokeWidth="0.6" />
    </>
  );

  const eyes =
    mood === "happy" ? (
      <>
        {/* Happy crinkled eyes */}
        <path d="M 30 41 Q 37 35 44 41" fill="none" stroke="#1a2a3a" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 56 41 Q 63 35 70 41" fill="none" stroke="#1a2a3a" strokeWidth="2.4" strokeLinecap="round" />
        {/* Lower lash line */}
        <path d="M 30 41 Q 37 45 44 41" fill="none" stroke="#5a8ab0" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 56 41 Q 63 45 70 41" fill="none" stroke="#5a8ab0" strokeWidth="1.2" strokeLinecap="round" />
      </>
    ) : mood === "sad" ? (
      <>
        <ellipse cx="37" cy="41" rx="6" ry="6.5" fill="white" />
        <ellipse cx="63" cy="41" rx="6" ry="6.5" fill="white" />
        <path d="M 31 38 Q 37 36 43 39" fill="none" stroke="#1a2a3a" strokeWidth="1.2" />
        <path d="M 57 39 Q 63 36 69 38" fill="none" stroke="#1a2a3a" strokeWidth="1.2" />
        <ellipse cx="37" cy="42.5" rx="3.5" ry="4" fill="#5a9ac8" />
        <ellipse cx="63" cy="42.5" rx="3.5" ry="4" fill="#5a9ac8" />
        <circle cx="37" cy="42.5" r="2" fill="#0a1828" />
        <circle cx="63" cy="42.5" r="2" fill="#0a1828" />
        {eyeShine(35, 40.5)}
        {eyeShine(61, 40.5)}
        {tear(37, 50)}
        {tear(63, 50)}
      </>
    ) : (
      <>
        <ellipse cx="37" cy="41" rx="6" ry="6.5" fill="white" />
        <ellipse cx="63" cy="41" rx="6" ry="6.5" fill="white" />
        <ellipse cx="37" cy="41.5" rx="3.5" ry="4" fill="#5a9ac8" />
        <ellipse cx="63" cy="41.5" rx="3.5" ry="4" fill="#5a9ac8" />
        <circle cx="37" cy="41.5" r="2" fill="#0a1828" />
        <circle cx="63" cy="41.5" r="2" fill="#0a1828" />
        {eyeShine(35, 39.8)}
        {eyeShine(61, 39.8)}
        {/* Eyelashes */}
        <path d="M 31 38.5 Q 32 36 34.5 37.5" fill="none" stroke="#8ab0cc" strokeWidth="0.9" strokeLinecap="round" />
        <path d="M 69 38.5 Q 68 36 65.5 37.5" fill="none" stroke="#8ab0cc" strokeWidth="0.9" strokeLinecap="round" />
      </>
    );

  const brows =
    mood === "happy" ? (
      <>
        <path d="M 31 34 Q 37 30 43 33" fill="none" stroke="#8a6a30" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 57 33 Q 63 30 69 34" fill="none" stroke="#8a6a30" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ) : mood === "sad" ? (
      <>
        <path d="M 31 33 Q 37 36 43 35" fill="none" stroke="#8a6a30" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 57 35 Q 63 36 69 33" fill="none" stroke="#8a6a30" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M 31 33 Q 37 31 43 33" fill="none" stroke="#8a6a30" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 57 33 Q 63 31 69 33" fill="none" stroke="#8a6a30" strokeWidth="1.5" strokeLinecap="round" />
      </>
    );

  const mouth =
    mood === "happy" ? (
      <>
        <path d="M 38 56 Q 50 67 62 56" fill="#e87090" stroke="#a04060" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 41 57 Q 50 61 59 57" fill="white" stroke="none" />
      </>
    ) : mood === "sad" ? (
      <path d="M 41 62 Q 50 56 59 62" fill="none" stroke="#a04060" strokeWidth="2.2" strokeLinecap="round" />
    ) : (
      <path d="M 41 57 Q 50 62 59 57" fill="none" stroke="#a04060" strokeWidth="2" strokeLinecap="round" />
    );

  const blush =
    mood === "happy" ? (
      <>
        <ellipse cx="26" cy="50" rx="5.5" ry="3.2" fill="#f0a0c0" opacity={0.45} />
        <ellipse cx="74" cy="50" rx="5.5" ry="3.2" fill="#f0a0c0" opacity={0.45} />
      </>
    ) : null;

  return (
    <>
      <defs>
        {/* Skin — light/fair */}
        <radialGradient id="frostSkin" cx="48%" cy="38%" r="56%">
          <stop offset="0%" stopColor="#fdeee0" />
          <stop offset="100%" stopColor="#f0d0b0" />
        </radialGradient>
        {/* Cape */}
        <linearGradient id="frostCape" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1464cc" />
          <stop offset="50%" stopColor="#3080e8" />
          <stop offset="100%" stopColor="#1464cc" />
        </linearGradient>
        {/* Body suit */}
        <linearGradient id="frostBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1255bb" />
          <stop offset="100%" stopColor="#0a3a88" />
        </linearGradient>
        {/* Tiara */}
        <linearGradient id="frostTiara" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8d8ff" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#a8d8ff" />
        </linearGradient>
        {/* Gem */}
        <radialGradient id="frostGem" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#60c0ff" />
          <stop offset="100%" stopColor="#0060c0" />
        </radialGradient>
        {/* Blonde hair */}
        <linearGradient id="frostHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fce080" />
          <stop offset="100%" stopColor="#d4a820" />
        </linearGradient>
        <filter id="frostShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#00004488" />
        </filter>
        <filter id="frostGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#80d0ff" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* ===== CAPE ===== */}
      {cape}

      {/* ===== COSTUME BODY ===== */}
      <path
        d="M 18 80 Q 18 68 50 66 Q 82 68 82 80 L 82 130 L 18 130 Z"
        fill="url(#frostBody)"
        filter="url(#frostShadow)"
      />
      {/* Frost crystal chest emblem */}
      <g filter="url(#frostGlow)">
        <line x1="50" y1="72" x2="50" y2="85" stroke="#a0e0ff" strokeWidth="1.2" />
        <line x1="43.5" y1="74.5" x2="56.5" y2="82.5" stroke="#a0e0ff" strokeWidth="1.2" />
        <line x1="43.5" y1="82.5" x2="56.5" y2="74.5" stroke="#a0e0ff" strokeWidth="1.2" />
        <circle cx="50" cy="78.5" r="2.5" fill="#d0f0ff" />
      </g>
      {/* Collar */}
      <path d="M 28 73 Q 50 68 72 73" fill="none" stroke="#4090dd" strokeWidth="1.6" strokeLinecap="round" />

      {/* ===== BLONDE PIGTAILS (behind head) ===== */}
      {/* Left pigtail braid */}
      <ellipse cx="19" cy="44" rx="8" ry="20" fill="url(#frostHair)" transform="rotate(-10 19 44)" />
      <ellipse cx="17" cy="62" rx="5.5" ry="8" fill="url(#frostHair)" transform="rotate(-14 17 62)" />
      {/* Right pigtail braid */}
      <ellipse cx="81" cy="44" rx="8" ry="20" fill="url(#frostHair)" transform="rotate(10 81 44)" />
      <ellipse cx="83" cy="62" rx="5.5" ry="8" fill="url(#frostHair)" transform="rotate(14 83 62)" />
      {/* Pigtail ties — icy blue bows */}
      <ellipse cx="24" cy="31" rx="4" ry="2.5" fill="#60c0ff" stroke="white" strokeWidth="0.5" />
      <ellipse cx="76" cy="31" rx="4" ry="2.5" fill="#60c0ff" stroke="white" strokeWidth="0.5" />

      {/* Main hair volume */}
      <ellipse cx="50" cy="30" rx="30" ry="22" fill="url(#frostHair)" />
      {/* Wispy bangs */}
      <path
        d="M 28 30 Q 32 38 36 29 Q 39 22 43 31 Q 47 22 50 31 Q 53 22 57 31 Q 61 22 64 29 Q 68 38 72 30"
        fill="url(#frostHair)"
      />

      {/* ===== FACE ===== */}
      <ellipse cx="50" cy="45" rx="25" ry="26" fill="url(#frostSkin)" filter="url(#frostShadow)" />

      {/* Ears */}
      <ellipse cx="25" cy="45" rx="4" ry="5" fill="url(#frostSkin)" />
      <ellipse cx="75" cy="45" rx="4" ry="5" fill="url(#frostSkin)" />

      {/* Nose */}
      <path d="M 48.5 50 Q 50 52.5 51.5 50" fill="none" stroke="#d4b090" strokeWidth="1.3" strokeLinecap="round" />

      {/* ===== TIARA ===== */}
      {tiara}

      {/* ===== EXPRESSIONS ===== */}
      {brows}
      {eyes}
      {mouth}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  BOLT — Character 2                                                  */
/*  Yellow cape, lightning mask, medium-brown skin, spiky hair         */
/* ------------------------------------------------------------------ */

function Bolt({ mood }: { mood: Mood }) {
  const cape =
    mood === "happy" ? (
      <path
        d="M 50 78
           C 26 72, 1 66, 0 89
           L 0 130 L 100 130 L 100 89
           C 99 66, 74 72, 50 78 Z"
        fill="url(#boltCape)"
        stroke="#a07800"
        strokeWidth="1.2"
      />
    ) : mood === "sad" ? (
      <path
        d="M 50 78
           C 39 82, 21 92, 23 114
           L 23 130 L 77 130 L 77 114
           C 79 92, 61 82, 50 78 Z"
        fill="url(#boltCape)"
        stroke="#a07800"
        strokeWidth="1.2"
      />
    ) : (
      <path
        d="M 50 78
           C 35 77, 11 81, 10 103
           L 10 130 L 90 130 L 90 103
           C 89 81, 65 77, 50 78 Z"
        fill="url(#boltCape)"
        stroke="#a07800"
        strokeWidth="1.2"
      />
    );

  /* Lightning-bolt shaped mask around eyes */
  const mask = (
    <>
      {/* Left eye mask — zigzag lightning shape */}
      <path
        d="M 22 35 L 32 33 L 28 39 L 38 37 L 34 43 L 22 43 Z"
        fill="url(#boltMask)"
        stroke="#886600"
        strokeWidth="0.6"
      />
      {/* Right eye mask */}
      <path
        d="M 78 35 L 68 33 L 72 39 L 62 37 L 66 43 L 78 43 Z"
        fill="url(#boltMask)"
        stroke="#886600"
        strokeWidth="0.6"
      />
      {/* Lightning bolt nose bridge accent */}
      <path d="M 46 38 L 50 36 L 54 38 L 52 41 L 56 41 L 48 48 L 52 44 L 48 44 Z" fill="#ffdd00" opacity={0.6} />
    </>
  );

  const eyes =
    mood === "happy" ? (
      <>
        <path d="M 24 39 Q 30 33 36 39" fill="none" stroke="#1a1500" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 64 39 Q 70 33 76 39" fill="none" stroke="#1a1500" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ) : mood === "sad" ? (
      <>
        <ellipse cx="30" cy="39" rx="5.5" ry="5.5" fill="white" />
        <ellipse cx="70" cy="39" rx="5.5" ry="5.5" fill="white" />
        <path d="M 24 36 Q 30 34 36 37" fill="none" stroke="#1a1500" strokeWidth="1.2" />
        <path d="M 64 37 Q 70 34 76 36" fill="none" stroke="#1a1500" strokeWidth="1.2" />
        <ellipse cx="30" cy="40" rx="3.2" ry="3.2" fill="#5a4020" />
        <ellipse cx="70" cy="40" rx="3.2" ry="3.2" fill="#5a4020" />
        <circle cx="30" cy="40" r="1.8" fill="#0d0800" />
        <circle cx="70" cy="40" r="1.8" fill="#0d0800" />
        {eyeShine(28.5, 38)}
        {eyeShine(68.5, 38)}
        {tear(30, 48)}
        {tear(70, 48)}
      </>
    ) : (
      <>
        <ellipse cx="30" cy="39" rx="5.5" ry="5.5" fill="white" />
        <ellipse cx="70" cy="39" rx="5.5" ry="5.5" fill="white" />
        <ellipse cx="30" cy="39.5" rx="3.2" ry="3.2" fill="#5a4020" />
        <ellipse cx="70" cy="39.5" rx="3.2" ry="3.2" fill="#5a4020" />
        <circle cx="30" cy="39.5" r="1.8" fill="#0d0800" />
        <circle cx="70" cy="39.5" r="1.8" fill="#0d0800" />
        {eyeShine(28.5, 38)}
        {eyeShine(68.5, 38)}
      </>
    );

  const brows =
    mood === "happy" ? (
      <>
        <path d="M 24 32 Q 30 28 36 31" fill="none" stroke="#1a1000" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 64 31 Q 70 28 76 32" fill="none" stroke="#1a1000" strokeWidth="2.2" strokeLinecap="round" />
      </>
    ) : mood === "sad" ? (
      <>
        <path d="M 24 31 Q 30 34 36 33" fill="none" stroke="#1a1000" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 64 33 Q 70 34 76 31" fill="none" stroke="#1a1000" strokeWidth="2.2" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M 24 32 Q 30 30 36 32" fill="none" stroke="#1a1000" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 64 32 Q 70 30 76 32" fill="none" stroke="#1a1000" strokeWidth="2.2" strokeLinecap="round" />
      </>
    );

  const mouth =
    mood === "happy" ? (
      <>
        <path d="M 36 57 Q 50 69 64 57" fill="#c85010" stroke="#8a3000" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 40 58 Q 50 63 60 58" fill="white" stroke="none" />
      </>
    ) : mood === "sad" ? (
      <path d="M 39 63 Q 50 57 61 63" fill="none" stroke="#8a3000" strokeWidth="2.2" strokeLinecap="round" />
    ) : (
      <path d="M 39 58 Q 50 63 61 58" fill="none" stroke="#8a3000" strokeWidth="2" strokeLinecap="round" />
    );

  const blush =
    mood === "happy" ? (
      <>
        <ellipse cx="24" cy="50" rx="5.5" ry="3" fill="#e08040" opacity={0.4} />
        <ellipse cx="76" cy="50" rx="5.5" ry="3" fill="#e08040" opacity={0.4} />
      </>
    ) : null;

  return (
    <>
      <defs>
        {/* Skin — medium brown */}
        <radialGradient id="boltSkin" cx="48%" cy="38%" r="56%">
          <stop offset="0%" stopColor="#c8905a" />
          <stop offset="100%" stopColor="#9a6030" />
        </radialGradient>
        {/* Cape */}
        <linearGradient id="boltCape" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8c000" />
          <stop offset="50%" stopColor="#ffe840" />
          <stop offset="100%" stopColor="#e8c000" />
        </linearGradient>
        {/* Body suit */}
        <linearGradient id="boltBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4aa00" />
          <stop offset="100%" stopColor="#8a7000" />
        </linearGradient>
        {/* Mask */}
        <linearGradient id="boltMask" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffee22" />
          <stop offset="100%" stopColor="#cc9900" />
        </linearGradient>
        {/* Hair — dark spiky */}
        <linearGradient id="boltHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#282010" />
          <stop offset="100%" stopColor="#0e0a04" />
        </linearGradient>
        <filter id="boltShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#00000055" />
        </filter>
        <filter id="boltGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffe840" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* ===== CAPE ===== */}
      {cape}

      {/* ===== COSTUME BODY ===== */}
      <path
        d="M 18 80 Q 18 68 50 66 Q 82 68 82 80 L 82 130 L 18 130 Z"
        fill="url(#boltBody)"
        filter="url(#boltShadow)"
      />
      {/* Lightning bolt chest emblem */}
      <g filter="url(#boltGlow)">
        <path
          d="M 54 70 L 47 80 L 52 80 L 46 92 L 57 78 L 51 78 L 57 70 Z"
          fill="#ffe840"
          stroke="#ffffff"
          strokeWidth="0.5"
        />
      </g>
      {/* Collar */}
      <path d="M 28 73 Q 50 68 72 73" fill="none" stroke="#ffe840" strokeWidth="1.4" strokeLinecap="round" />

      {/* ===== SPIKY HAIR ===== */}
      <ellipse cx="50" cy="28" rx="25" ry="20" fill="url(#boltHair)" />
      {/* Spikes */}
      <path d="M 32 20 L 27 5 L 35 19 Z" fill="url(#boltHair)" />
      <path d="M 40 15 L 37 0 L 45 13 Z" fill="url(#boltHair)" />
      <path d="M 50 13 L 50 -1 L 56 13 Z" fill="url(#boltHair)" />
      <path d="M 59 15 L 65 1 L 64 14 Z" fill="url(#boltHair)" />
      <path d="M 68 20 L 76 6 L 71 20 Z" fill="url(#boltHair)" />
      {/* Side spikes */}
      <path d="M 25 28 L 14 20 L 25 24 Z" fill="url(#boltHair)" />
      <path d="M 75 28 L 86 20 L 75 24 Z" fill="url(#boltHair)" />

      {/* ===== FACE ===== */}
      <ellipse cx="50" cy="44" rx="26" ry="27" fill="url(#boltSkin)" filter="url(#boltShadow)" />

      {/* Ears */}
      <ellipse cx="24" cy="44" rx="4.5" ry="5.5" fill="url(#boltSkin)" />
      <ellipse cx="76" cy="44" rx="4.5" ry="5.5" fill="url(#boltSkin)" />

      {/* Nose */}
      <ellipse cx="50" cy="51" rx="2.5" ry="1.8" fill="#8a5820" opacity={0.5} />

      {/* ===== LIGHTNING MASK ===== */}
      {mask}

      {/* ===== EXPRESSIONS ===== */}
      {brows}
      {eyes}
      {mouth}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  IVY — Character 3                                                   */
/*  Green cape, leaf crown, deep brown skin, long braids               */
/* ------------------------------------------------------------------ */

function Ivy({ mood }: { mood: Mood }) {
  const cape =
    mood === "happy" ? (
      <path
        d="M 50 78
           C 27 73, 2 67, 1 90
           L 1 130 L 99 130 L 99 90
           C 98 67, 73 73, 50 78 Z"
        fill="url(#ivyCape)"
        stroke="#004400"
        strokeWidth="1.2"
      />
    ) : mood === "sad" ? (
      <path
        d="M 50 78
           C 38 82, 20 91, 22 113
           L 22 130 L 78 130 L 78 113
           C 80 91, 62 82, 50 78 Z"
        fill="url(#ivyCape)"
        stroke="#004400"
        strokeWidth="1.2"
      />
    ) : (
      <path
        d="M 50 78
           C 34 76, 10 80, 9 102
           L 9 130 L 91 130 L 91 102
           C 90 80, 66 76, 50 78 Z"
        fill="url(#ivyCape)"
        stroke="#004400"
        strokeWidth="1.2"
      />
    );

  /* Leaf crown */
  const crown = (
    <>
      {/* Crown base band */}
      <path
        d="M 22 32 Q 50 24 78 32"
        fill="none"
        stroke="url(#ivyCrown)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Leaf shapes pointing up */}
      <ellipse cx="50" cy="21" rx="5" ry="9" fill="#228833" transform="rotate(-5 50 21)" />
      <ellipse cx="50" cy="21" rx="3" ry="9" fill="#44cc55" transform="rotate(-5 50 21)" />
      <ellipse cx="36" cy="25" rx="4" ry="8" fill="#228833" transform="rotate(-20 36 25)" />
      <ellipse cx="36" cy="25" rx="2.5" ry="8" fill="#44cc55" transform="rotate(-20 36 25)" />
      <ellipse cx="64" cy="25" rx="4" ry="8" fill="#228833" transform="rotate(20 64 25)" />
      <ellipse cx="64" cy="25" rx="2.5" ry="8" fill="#44cc55" transform="rotate(20 64 25)" />
      <ellipse cx="25" cy="31" rx="3.5" ry="7" fill="#228833" transform="rotate(-35 25 31)" />
      <ellipse cx="75" cy="31" rx="3.5" ry="7" fill="#228833" transform="rotate(35 75 31)" />
      {/* Leaf veins */}
      <line x1="50" y1="13" x2="50" y2="30" stroke="#004422" strokeWidth="0.7" />
      <line x1="36" y1="18" x2="36" y2="33" stroke="#004422" strokeWidth="0.7" transform="rotate(-20 36 25)" />
      <line x1="64" y1="18" x2="64" y2="33" stroke="#004422" strokeWidth="0.7" transform="rotate(20 64 25)" />
      {/* Small berry accents */}
      <circle cx="43" cy="22" r="2" fill="#cc2244" />
      <circle cx="57" cy="22" r="2" fill="#cc2244" />
      <circle cx="50" cy="17" r="2" fill="#ee3366" />
    </>
  );

  const eyes =
    mood === "happy" ? (
      <>
        <path d="M 31 41 Q 38 35 45 41" fill="none" stroke="#0a1a0a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 55 41 Q 62 35 69 41" fill="none" stroke="#0a1a0a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 31 41 Q 38 45 45 41" fill="none" stroke="#4a8a5a" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M 55 41 Q 62 45 69 41" fill="none" stroke="#4a8a5a" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ) : mood === "sad" ? (
      <>
        <ellipse cx="38" cy="41" rx="6" ry="6.5" fill="white" />
        <ellipse cx="62" cy="41" rx="6" ry="6.5" fill="white" />
        <path d="M 32 38 Q 38 36 44 39" fill="none" stroke="#0a1a0a" strokeWidth="1.2" />
        <path d="M 56 39 Q 62 36 68 38" fill="none" stroke="#0a1a0a" strokeWidth="1.2" />
        <ellipse cx="38" cy="42.5" rx="3.5" ry="4" fill="#4a7a30" />
        <ellipse cx="62" cy="42.5" rx="3.5" ry="4" fill="#4a7a30" />
        <circle cx="38" cy="42.5" r="2" fill="#0a1a0a" />
        <circle cx="62" cy="42.5" r="2" fill="#0a1a0a" />
        {eyeShine(36, 40.5)}
        {eyeShine(60, 40.5)}
        {tear(38, 51)}
        {tear(62, 51)}
      </>
    ) : (
      <>
        <ellipse cx="38" cy="41" rx="6" ry="6.5" fill="white" />
        <ellipse cx="62" cy="41" rx="6" ry="6.5" fill="white" />
        <ellipse cx="38" cy="41.5" rx="3.5" ry="4" fill="#4a7a30" />
        <ellipse cx="62" cy="41.5" rx="3.5" ry="4" fill="#4a7a30" />
        <circle cx="38" cy="41.5" r="2" fill="#0a1a0a" />
        <circle cx="62" cy="41.5" r="2" fill="#0a1a0a" />
        {eyeShine(36, 39.8)}
        {eyeShine(60, 39.8)}
        {/* Long lashes */}
        <path d="M 32 38 Q 33 35.5 36 37" fill="none" stroke="#0a1a0a" strokeWidth="1" strokeLinecap="round" />
        <path d="M 68 38 Q 67 35.5 64 37" fill="none" stroke="#0a1a0a" strokeWidth="1" strokeLinecap="round" />
        <path d="M 35 36.5 Q 37 34 39 36" fill="none" stroke="#0a1a0a" strokeWidth="0.9" strokeLinecap="round" />
        <path d="M 65 36.5 Q 63 34 61 36" fill="none" stroke="#0a1a0a" strokeWidth="0.9" strokeLinecap="round" />
      </>
    );

  const brows =
    mood === "happy" ? (
      <>
        <path d="M 31 34 Q 38 30 45 33" fill="none" stroke="#1a0e00" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 55 33 Q 62 30 69 34" fill="none" stroke="#1a0e00" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ) : mood === "sad" ? (
      <>
        <path d="M 31 33 Q 38 36 45 35" fill="none" stroke="#1a0e00" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 55 35 Q 62 36 69 33" fill="none" stroke="#1a0e00" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M 31 34 Q 38 31 45 34" fill="none" stroke="#1a0e00" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 55 34 Q 62 31 69 34" fill="none" stroke="#1a0e00" strokeWidth="1.8" strokeLinecap="round" />
      </>
    );

  const mouth =
    mood === "happy" ? (
      <>
        <path d="M 37 56 Q 50 68 63 56" fill="#c04060" stroke="#882040" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 40 57 Q 50 62 60 57" fill="white" stroke="none" />
      </>
    ) : mood === "sad" ? (
      <path d="M 40 62 Q 50 56 60 62" fill="none" stroke="#882040" strokeWidth="2.2" strokeLinecap="round" />
    ) : (
      <path d="M 40 57 Q 50 62 60 57" fill="none" stroke="#882040" strokeWidth="2" strokeLinecap="round" />
    );

  const blush =
    mood === "happy" ? (
      <>
        <ellipse cx="27" cy="51" rx="5.5" ry="3.2" fill="#e06080" opacity={0.38} />
        <ellipse cx="73" cy="51" rx="5.5" ry="3.2" fill="#e06080" opacity={0.38} />
      </>
    ) : null;

  return (
    <>
      <defs>
        {/* Skin — deep warm brown */}
        <radialGradient id="ivySkin" cx="48%" cy="38%" r="56%">
          <stop offset="0%" stopColor="#8a4a20" />
          <stop offset="100%" stopColor="#5a2e10" />
        </radialGradient>
        {/* Cape */}
        <linearGradient id="ivyCape" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0e6618" />
          <stop offset="50%" stopColor="#22a030" />
          <stop offset="100%" stopColor="#0e6618" />
        </linearGradient>
        {/* Body suit */}
        <linearGradient id="ivyBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d5c14" />
          <stop offset="100%" stopColor="#073c0c" />
        </linearGradient>
        {/* Crown band */}
        <linearGradient id="ivyCrown" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a8820" />
          <stop offset="50%" stopColor="#66cc33" />
          <stop offset="100%" stopColor="#4a8820" />
        </linearGradient>
        {/* Hair — very dark */}
        <linearGradient id="ivyHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c0e04" />
          <stop offset="100%" stopColor="#0a0502" />
        </linearGradient>
        {/* Hair highlight for braids */}
        <linearGradient id="ivyBraid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1c0e04" />
          <stop offset="40%" stopColor="#3a1e08" />
          <stop offset="100%" stopColor="#1c0e04" />
        </linearGradient>
        <filter id="ivyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#00000060" />
        </filter>
        <filter id="ivyGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#44cc44" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* ===== CAPE ===== */}
      {cape}

      {/* ===== COSTUME BODY ===== */}
      <path
        d="M 18 80 Q 18 68 50 66 Q 82 68 82 80 L 82 130 L 18 130 Z"
        fill="url(#ivyBody)"
        filter="url(#ivyShadow)"
      />
      {/* Leaf chest emblem */}
      <g filter="url(#ivyGlow)">
        <ellipse cx="50" cy="79" rx="7" ry="11" fill="#22cc44" opacity={0.9} />
        <ellipse cx="50" cy="79" rx="4" ry="11" fill="#44ee66" opacity={0.7} />
        <line x1="50" y1="68" x2="50" y2="90" stroke="#006622" strokeWidth="1" />
        <line x1="46" y1="74" x2="54" y2="74" stroke="#006622" strokeWidth="0.8" />
        <line x1="45" y1="79" x2="55" y2="79" stroke="#006622" strokeWidth="0.8" />
        <line x1="46" y1="84" x2="54" y2="84" stroke="#006622" strokeWidth="0.8" />
      </g>
      {/* Collar with vine motif */}
      <path d="M 28 73 Q 50 68 72 73" fill="none" stroke="#33aa44" strokeWidth="1.6" strokeLinecap="round" />

      {/* ===== LONG BRAIDS (behind head and body) ===== */}
      {/* Left braid — segmented look */}
      <path
        d="M 22 38 Q 16 50 15 65 Q 14 78 16 90 Q 17 95 20 96 Q 24 96 25 90 Q 24 78 25 65 Q 26 50 28 38 Z"
        fill="url(#ivyBraid)"
      />
      {/* Braid segment marks left */}
      {[48, 60, 72, 84].map((y) => (
        <path
          key={y}
          d={`M 15.5 ${y} Q 20 ${y + 2} 24.5 ${y}`}
          fill="none"
          stroke="#0a0502"
          strokeWidth="1"
        />
      ))}
      {/* Right braid */}
      <path
        d="M 78 38 Q 84 50 85 65 Q 86 78 84 90 Q 83 95 80 96 Q 76 96 75 90 Q 76 78 75 65 Q 74 50 72 38 Z"
        fill="url(#ivyBraid)"
      />
      {[48, 60, 72, 84].map((y) => (
        <path
          key={y}
          d={`M 84.5 ${y} Q 80 ${y + 2} 75.5 ${y}`}
          fill="none"
          stroke="#0a0502"
          strokeWidth="1"
        />
      ))}
      {/* Braid tips */}
      <ellipse cx="19" cy="96" rx="3.5" ry="4" fill="url(#ivyHair)" />
      <ellipse cx="81" cy="96" rx="3.5" ry="4" fill="url(#ivyHair)" />
      {/* Braid ties — small green bands */}
      <rect x="15" y="35" width="13" height="3" rx="1.5" fill="#22aa33" />
      <rect x="72" y="35" width="13" height="3" rx="1.5" fill="#22aa33" />

      {/* Main hair volume on top/back */}
      <ellipse cx="50" cy="30" rx="30" ry="22" fill="url(#ivyHair)" />

      {/* ===== FACE ===== */}
      <ellipse cx="50" cy="45" rx="25" ry="26" fill="url(#ivySkin)" filter="url(#ivyShadow)" />

      {/* Ears */}
      <ellipse cx="25" cy="45" rx="4.5" ry="5.5" fill="url(#ivySkin)" />
      <ellipse cx="75" cy="45" rx="4.5" ry="5.5" fill="url(#ivySkin)" />

      {/* Nose — subtle */}
      <path d="M 48.5 51 Q 50 53.5 51.5 51" fill="none" stroke="#3a1a08" strokeWidth="1.5" strokeLinecap="round" />

      {/* ===== LEAF CROWN ===== */}
      {crown}

      {/* ===== EXPRESSIONS ===== */}
      {brows}
      {eyes}
      {mouth}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                         */
/* ------------------------------------------------------------------ */

const heroRenderers = [Blaze, Frost, Bolt, Ivy] as const;

export function Character({ index, mood = "neutral", size = 120 }: CharacterProps) {
  const Hero = heroRenderers[index % heroRenderers.length];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 130"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      aria-label={`${["Blaze", "Frost", "Bolt", "Ivy"][index]} superhero character, ${mood}`}
    >
      <Hero mood={mood} />
    </svg>
  );
}
