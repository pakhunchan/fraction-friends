"use client";

type Mood = "neutral" | "happy" | "sad";

interface CharacterProps {
  id: number;
  mood?: Mood;
  onClick?: () => void;
  highlighted?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Shared tiny helpers                                                */
/* ------------------------------------------------------------------ */

/** White eye-highlight dot (same for every character) */
const eyeHighlight = (cx: number, cy: number) => (
  <circle cx={cx} cy={cy} r={1.4} fill="white" opacity={0.92} />
);

/** Small secondary highlight for extra life in the eyes */
const eyeHighlight2 = (cx: number, cy: number) => (
  <circle cx={cx + 3} cy={cy + 2} r={0.7} fill="white" opacity={0.6} />
);

/* ------------------------------------------------------------------ */
/*  Character 0 -- Boy, short curly dark hair, brown skin, gold shirt  */
/* ------------------------------------------------------------------ */

function Character0({ mood }: { mood: Mood }) {
  // -- Eyebrows --
  const brows = {
    neutral: (
      <>
        <path d="M 33 33 Q 38 30 43 33" fill="none" stroke="#1a1200" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 57 33 Q 62 30 67 33" fill="none" stroke="#1a1200" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    happy: (
      <>
        <path d="M 33 31 Q 38 27 43 31" fill="none" stroke="#1a1200" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 57 31 Q 62 27 67 31" fill="none" stroke="#1a1200" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
    sad: (
      <>
        <path d="M 33 32 Q 38 34 43 33" fill="none" stroke="#1a1200" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 57 33 Q 62 34 67 32" fill="none" stroke="#1a1200" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  }[mood];

  // -- Eyes --
  const eyes = {
    neutral: (
      <>
        <ellipse cx="38" cy="40" rx="5" ry="5.5" fill="white" />
        <ellipse cx="62" cy="40" rx="5" ry="5.5" fill="white" />
        <ellipse cx="38" cy="40.5" rx="3" ry="3.4" fill="#3d2b1f" />
        <ellipse cx="62" cy="40.5" rx="3" ry="3.4" fill="#3d2b1f" />
        <circle cx="38" cy="40.5" r="1.6" fill="#1a1200" />
        <circle cx="62" cy="40.5" r="1.6" fill="#1a1200" />
        {eyeHighlight(36.5, 39)}
        {eyeHighlight(60.5, 39)}
        {eyeHighlight2(36.5, 39)}
        {eyeHighlight2(60.5, 39)}
      </>
    ),
    happy: (
      <>
        {/* Squinted happy eyes -- arched shape */}
        <path d="M 33 41 Q 38 35 43 41" fill="white" stroke="none" />
        <path d="M 33 41 Q 38 44 43 41" fill="white" stroke="none" />
        <path d="M 57 41 Q 62 35 67 41" fill="white" stroke="none" />
        <path d="M 57 41 Q 62 44 67 41" fill="white" stroke="none" />
        <ellipse cx="38" cy="40" rx="3" ry="2.5" fill="#3d2b1f" />
        <ellipse cx="62" cy="40" rx="3" ry="2.5" fill="#3d2b1f" />
        <circle cx="38" cy="39.8" r="1.4" fill="#1a1200" />
        <circle cx="62" cy="39.8" r="1.4" fill="#1a1200" />
        {eyeHighlight(36.8, 38.8)}
        {eyeHighlight(60.8, 38.8)}
      </>
    ),
    sad: (
      <>
        <ellipse cx="38" cy="41" rx="5" ry="5" fill="white" />
        <ellipse cx="62" cy="41" rx="5" ry="5" fill="white" />
        {/* Droopy upper-lid lines */}
        <path d="M 33 39 Q 38 37 43 40" fill="none" stroke="#6b4f2e" strokeWidth="1.2" />
        <path d="M 57 40 Q 62 37 67 39" fill="none" stroke="#6b4f2e" strokeWidth="1.2" />
        <ellipse cx="38" cy="42" rx="3" ry="3.2" fill="#3d2b1f" />
        <ellipse cx="62" cy="42" rx="3" ry="3.2" fill="#3d2b1f" />
        <circle cx="38" cy="42" r="1.6" fill="#1a1200" />
        <circle cx="62" cy="42" r="1.6" fill="#1a1200" />
        {eyeHighlight(36.5, 40.5)}
        {eyeHighlight(60.5, 40.5)}
      </>
    ),
  }[mood];

  // -- Mouth --
  const mouth = {
    neutral: <path d="M 42 52 Q 50 57 58 52" fill="none" stroke="#3d2b1f" strokeWidth="2" strokeLinecap="round" />,
    happy: (
      <>
        <path d="M 39 50 Q 50 60 61 50" fill="#c0392b" stroke="#3d2b1f" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 42 51 Q 50 54 58 51" fill="white" stroke="none" />
      </>
    ),
    sad: <path d="M 42 56 Q 50 50 58 56" fill="none" stroke="#3d2b1f" strokeWidth="2" strokeLinecap="round" />,
  }[mood];

  // -- Cheek blush (happy only) --
  const blush = mood === "happy" ? (
    <>
      <ellipse cx="30" cy="47" rx="4" ry="2.5" fill="#e8967a" opacity={0.45} />
      <ellipse cx="70" cy="47" rx="4" ry="2.5" fill="#e8967a" opacity={0.45} />
    </>
  ) : null;

  return (
    <>
      <defs>
        <radialGradient id="skin0" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#c48a3f" />
          <stop offset="100%" stopColor="#9b6b2f" />
        </radialGradient>
        <radialGradient id="hair0" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#3d2b1f" />
          <stop offset="100%" stopColor="#1a1200" />
        </radialGradient>
      </defs>

      {/* ----- Body / Gold shirt ----- */}
      <path
        d="M 22 76 Q 22 66 50 64 Q 78 66 78 76 L 78 100 L 22 100 Z"
        fill="#e6b422"
      />
      {/* Collar */}
      <path d="M 42 66 L 50 72 L 58 66" fill="none" stroke="#c99a10" strokeWidth="1.8" strokeLinecap="round" />
      {/* Shirt shadow */}
      <path d="M 30 80 Q 50 84 70 80" fill="none" stroke="#c99a10" strokeWidth="0.8" opacity={0.5} />

      {/* ----- Hair (curly, behind head) ----- */}
      {/* Big curly mass */}
      <ellipse cx="50" cy="30" rx="28" ry="24" fill="url(#hair0)" />
      {/* Curl bumps around the top */}
      <circle cx="28" cy="26" r="7" fill="url(#hair0)" />
      <circle cx="38" cy="16" r="7.5" fill="url(#hair0)" />
      <circle cx="50" cy="13" r="7" fill="url(#hair0)" />
      <circle cx="62" cy="16" r="7.5" fill="url(#hair0)" />
      <circle cx="72" cy="26" r="7" fill="url(#hair0)" />
      {/* Side curls */}
      <circle cx="24" cy="36" r="5.5" fill="url(#hair0)" />
      <circle cx="76" cy="36" r="5.5" fill="url(#hair0)" />

      {/* ----- Face ----- */}
      <ellipse cx="50" cy="42" rx="24" ry="25" fill="url(#skin0)" />

      {/* ----- Ears ----- */}
      <ellipse cx="26" cy="43" rx="4" ry="5" fill="url(#skin0)" />
      <ellipse cx="74" cy="43" rx="4" ry="5" fill="url(#skin0)" />

      {/* ----- Nose ----- */}
      <ellipse cx="50" cy="47" rx="2.2" ry="1.5" fill="#a57835" opacity={0.6} />

      {brows}
      {eyes}
      {mouth}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Character 1 -- Girl, long straight brown hair, light skin, blue   */
/* ------------------------------------------------------------------ */

function Character1({ mood }: { mood: Mood }) {
  const brows = {
    neutral: (
      <>
        <path d="M 33 33 Q 38 31 43 33" fill="none" stroke="#5a3e28" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M 57 33 Q 62 31 67 33" fill="none" stroke="#5a3e28" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    happy: (
      <>
        <path d="M 33 31 Q 38 28 43 31" fill="none" stroke="#5a3e28" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M 57 31 Q 62 28 67 31" fill="none" stroke="#5a3e28" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    sad: (
      <>
        <path d="M 34 32 Q 38 34 43 33" fill="none" stroke="#5a3e28" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M 57 33 Q 62 34 66 32" fill="none" stroke="#5a3e28" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  }[mood];

  const eyes = {
    neutral: (
      <>
        <ellipse cx="38" cy="40" rx="5.2" ry="5.8" fill="white" />
        <ellipse cx="62" cy="40" rx="5.2" ry="5.8" fill="white" />
        <ellipse cx="38" cy="40.5" rx="3.2" ry="3.6" fill="#5b88a5" />
        <ellipse cx="62" cy="40.5" rx="3.2" ry="3.6" fill="#5b88a5" />
        <circle cx="38" cy="40.5" r="1.8" fill="#1a1a2e" />
        <circle cx="62" cy="40.5" r="1.8" fill="#1a1a2e" />
        {eyeHighlight(36.2, 39)}
        {eyeHighlight(60.2, 39)}
        {eyeHighlight2(36.2, 39)}
        {eyeHighlight2(60.2, 39)}
        {/* Eyelashes */}
        <path d="M 33 38 Q 34 36 36 37" fill="none" stroke="#5a3e28" strokeWidth="0.8" />
        <path d="M 67 38 Q 66 36 64 37" fill="none" stroke="#5a3e28" strokeWidth="0.8" />
      </>
    ),
    happy: (
      <>
        <path d="M 33 41 Q 38 35 43 41" fill="white" />
        <path d="M 33 41 Q 38 44 43 41" fill="white" />
        <path d="M 57 41 Q 62 35 67 41" fill="white" />
        <path d="M 57 41 Q 62 44 67 41" fill="white" />
        <ellipse cx="38" cy="40" rx="3" ry="2.6" fill="#5b88a5" />
        <ellipse cx="62" cy="40" rx="3" ry="2.6" fill="#5b88a5" />
        <circle cx="38" cy="39.8" r="1.5" fill="#1a1a2e" />
        <circle cx="62" cy="39.8" r="1.5" fill="#1a1a2e" />
        {eyeHighlight(36.5, 38.8)}
        {eyeHighlight(60.5, 38.8)}
        <path d="M 33 39 Q 34 37 36 38" fill="none" stroke="#5a3e28" strokeWidth="0.8" />
        <path d="M 67 39 Q 66 37 64 38" fill="none" stroke="#5a3e28" strokeWidth="0.8" />
      </>
    ),
    sad: (
      <>
        <ellipse cx="38" cy="41" rx="5.2" ry="5.2" fill="white" />
        <ellipse cx="62" cy="41" rx="5.2" ry="5.2" fill="white" />
        <path d="M 33 39 Q 38 37.5 43 40" fill="none" stroke="#5a3e28" strokeWidth="1" />
        <path d="M 57 40 Q 62 37.5 67 39" fill="none" stroke="#5a3e28" strokeWidth="1" />
        <ellipse cx="38" cy="42" rx="3.2" ry="3.4" fill="#5b88a5" />
        <ellipse cx="62" cy="42" rx="3.2" ry="3.4" fill="#5b88a5" />
        <circle cx="38" cy="42" r="1.8" fill="#1a1a2e" />
        <circle cx="62" cy="42" r="1.8" fill="#1a1a2e" />
        {eyeHighlight(36.2, 40.5)}
        {eyeHighlight(60.2, 40.5)}
      </>
    ),
  }[mood];

  const mouth = {
    neutral: <path d="M 43 52 Q 50 56 57 52" fill="none" stroke="#a04050" strokeWidth="1.8" strokeLinecap="round" />,
    happy: (
      <>
        <path d="M 40 50 Q 50 60 60 50" fill="#d45060" stroke="#a04050" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 43 51 Q 50 54 57 51" fill="white" />
      </>
    ),
    sad: <path d="M 43 56 Q 50 50 57 56" fill="none" stroke="#a04050" strokeWidth="1.8" strokeLinecap="round" />,
  }[mood];

  const blush = mood === "happy" ? (
    <>
      <ellipse cx="29" cy="47" rx="4" ry="2.5" fill="#f0a0a0" opacity={0.4} />
      <ellipse cx="71" cy="47" rx="4" ry="2.5" fill="#f0a0a0" opacity={0.4} />
    </>
  ) : null;

  return (
    <>
      <defs>
        <radialGradient id="skin1" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fde8d0" />
          <stop offset="100%" stopColor="#f0c8a0" />
        </radialGradient>
        <linearGradient id="hair1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a0622e" />
          <stop offset="100%" stopColor="#6b3a1f" />
        </linearGradient>
      </defs>

      {/* ----- Body / Blue shirt ----- */}
      <path
        d="M 22 76 Q 22 66 50 64 Q 78 66 78 76 L 78 100 L 22 100 Z"
        fill="#4a90d9"
      />
      {/* Collar */}
      <path d="M 43 65 Q 50 70 57 65" fill="none" stroke="#3570b0" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 30 80 Q 50 84 70 80" fill="none" stroke="#3570b0" strokeWidth="0.8" opacity={0.4} />

      {/* ----- Long hair (behind head, falls past shoulders) ----- */}
      {/* Main hair volume */}
      <ellipse cx="50" cy="32" rx="29" ry="26" fill="url(#hair1)" />
      {/* Side hair falling down */}
      <path d="M 21 32 Q 18 50 20 75 Q 22 78 26 76 Q 28 55 27 38 Z" fill="url(#hair1)" />
      <path d="M 79 32 Q 82 50 80 75 Q 78 78 74 76 Q 72 55 73 38 Z" fill="url(#hair1)" />

      {/* ----- Headband ----- */}
      <path d="M 22 28 Q 50 22 78 28" fill="none" stroke="#e05080" strokeWidth="3" strokeLinecap="round" />
      {/* Tiny bow on headband */}
      <path d="M 68 26 L 72 23 L 74 27 L 72 29 Z" fill="#e05080" />
      <circle cx="72" cy="26" r="1.2" fill="#c03060" />

      {/* ----- Face ----- */}
      <ellipse cx="50" cy="42" rx="24" ry="25" fill="url(#skin1)" />

      {/* ----- Ears ----- */}
      <ellipse cx="26" cy="43" rx="3.5" ry="4.5" fill="url(#skin1)" />
      <ellipse cx="74" cy="43" rx="3.5" ry="4.5" fill="url(#skin1)" />

      {/* ----- Nose ----- */}
      <path d="M 49 47 Q 50 49 51 47" fill="none" stroke="#d4a888" strokeWidth="1.2" strokeLinecap="round" />

      {brows}
      {eyes}
      {mouth}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Character 2 -- Boy, spiky black hair, medium skin, purple hoodie  */
/* ------------------------------------------------------------------ */

function Character2({ mood }: { mood: Mood }) {
  const brows = {
    neutral: (
      <>
        <path d="M 33 33 Q 38 31 43 34" fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 57 34 Q 62 31 67 33" fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    happy: (
      <>
        <path d="M 33 30 Q 38 27 43 31" fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 57 31 Q 62 27 67 30" fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    sad: (
      <>
        <path d="M 34 32 Q 38 35 43 34" fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 57 34 Q 62 35 66 32" fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  }[mood];

  const eyes = {
    neutral: (
      <>
        <ellipse cx="38" cy="40" rx="5" ry="5.5" fill="white" />
        <ellipse cx="62" cy="40" rx="5" ry="5.5" fill="white" />
        <ellipse cx="38.5" cy="40.5" rx="3" ry="3.5" fill="#4a6741" />
        <ellipse cx="62.5" cy="40.5" rx="3" ry="3.5" fill="#4a6741" />
        <circle cx="38.5" cy="40.5" r="1.7" fill="#1a1a2e" />
        <circle cx="62.5" cy="40.5" r="1.7" fill="#1a1a2e" />
        {eyeHighlight(36.8, 39)}
        {eyeHighlight(60.8, 39)}
        {eyeHighlight2(36.8, 39)}
        {eyeHighlight2(60.8, 39)}
      </>
    ),
    happy: (
      <>
        {/* Happy closed-ish eyes */}
        <path d="M 33 40 Q 38 35 43 40" fill="none" stroke="#1a1a2e" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 57 40 Q 62 35 67 40" fill="none" stroke="#1a1a2e" strokeWidth="2.2" strokeLinecap="round" />
      </>
    ),
    sad: (
      <>
        <ellipse cx="38" cy="41" rx="5" ry="5" fill="white" />
        <ellipse cx="62" cy="41" rx="5" ry="5" fill="white" />
        <path d="M 33 39.5 Q 38 38 43 41" fill="none" stroke="#1a1a2e" strokeWidth="1" />
        <path d="M 57 41 Q 62 38 67 39.5" fill="none" stroke="#1a1a2e" strokeWidth="1" />
        <ellipse cx="38" cy="42" rx="3" ry="3.2" fill="#4a6741" />
        <ellipse cx="62" cy="42" rx="3" ry="3.2" fill="#4a6741" />
        <circle cx="38" cy="42" r="1.7" fill="#1a1a2e" />
        <circle cx="62" cy="42" r="1.7" fill="#1a1a2e" />
        {eyeHighlight(36.5, 40.5)}
        {eyeHighlight(60.5, 40.5)}
      </>
    ),
  }[mood];

  const mouth = {
    neutral: <path d="M 42 52 Q 50 56 58 52" fill="none" stroke="#2d2d40" strokeWidth="2" strokeLinecap="round" />,
    happy: (
      <>
        <path d="M 38 49 Q 50 61 62 49" fill="#c0392b" stroke="#2d2d40" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 42 50 Q 50 53 58 50" fill="white" />
      </>
    ),
    sad: <path d="M 42 56 Q 50 50 58 56" fill="none" stroke="#2d2d40" strokeWidth="2" strokeLinecap="round" />,
  }[mood];

  const blush = mood === "happy" ? (
    <>
      <ellipse cx="30" cy="47" rx="4" ry="2.5" fill="#e8a090" opacity={0.4} />
      <ellipse cx="70" cy="47" rx="4" ry="2.5" fill="#e8a090" opacity={0.4} />
    </>
  ) : null;

  return (
    <>
      <defs>
        <radialGradient id="skin2" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f0d4b0" />
          <stop offset="100%" stopColor="#d4b48c" />
        </radialGradient>
        <linearGradient id="hair2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d2d40" />
          <stop offset="100%" stopColor="#0e0e1a" />
        </linearGradient>
      </defs>

      {/* ----- Body / Purple hoodie ----- */}
      <path
        d="M 20 76 Q 20 64 50 62 Q 80 64 80 76 L 80 100 L 20 100 Z"
        fill="#8e44ad"
      />
      {/* Hood neckline */}
      <path d="M 30 70 Q 36 66 42 68 Q 50 72 58 68 Q 64 66 70 70" fill="none" stroke="#6c2d88" strokeWidth="1.8" strokeLinecap="round" />
      {/* Hoodie pocket line */}
      <path d="M 36 86 Q 50 90 64 86" fill="none" stroke="#6c2d88" strokeWidth="1.2" strokeLinecap="round" />
      {/* Hoodie string */}
      <line x1="46" y1="70" x2="44" y2="80" stroke="#c0c0c0" strokeWidth="0.8" />
      <line x1="54" y1="70" x2="56" y2="80" stroke="#c0c0c0" strokeWidth="0.8" />

      {/* ----- Spiky hair ----- */}
      {/* Base hair shape */}
      <ellipse cx="50" cy="30" rx="26" ry="22" fill="url(#hair2)" />
      {/* Spikes! */}
      <path d="M 30 20 L 26 6 L 34 18 Z" fill="url(#hair2)" />
      <path d="M 40 14 L 38 1 L 46 12 Z" fill="url(#hair2)" />
      <path d="M 50 12 L 52 0 L 56 12 Z" fill="url(#hair2)" />
      <path d="M 58 14 L 64 2 L 64 14 Z" fill="url(#hair2)" />
      <path d="M 68 20 L 76 8 L 72 20 Z" fill="url(#hair2)" />
      {/* Side spike */}
      <path d="M 24 30 L 16 22 L 24 26 Z" fill="url(#hair2)" />
      <path d="M 76 30 L 84 22 L 76 26 Z" fill="url(#hair2)" />

      {/* ----- Face ----- */}
      <ellipse cx="50" cy="42" rx="24" ry="25" fill="url(#skin2)" />

      {/* ----- Ears ----- */}
      <ellipse cx="26" cy="43" rx="4" ry="5" fill="url(#skin2)" />
      <ellipse cx="74" cy="43" rx="4" ry="5" fill="url(#skin2)" />

      {/* ----- Nose ----- */}
      <ellipse cx="50" cy="47" rx="2" ry="1.5" fill="#c4a080" opacity={0.5} />

      {brows}
      {eyes}
      {mouth}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Character 3 -- Girl, red pigtails, freckles, fair skin, green     */
/* ------------------------------------------------------------------ */

function Character3({ mood }: { mood: Mood }) {
  const brows = {
    neutral: (
      <>
        <path d="M 33 33 Q 38 31 43 33" fill="none" stroke="#a04020" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M 57 33 Q 62 31 67 33" fill="none" stroke="#a04020" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
    happy: (
      <>
        <path d="M 33 30 Q 38 27 43 31" fill="none" stroke="#a04020" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M 57 31 Q 62 27 67 30" fill="none" stroke="#a04020" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
    sad: (
      <>
        <path d="M 34 32 Q 38 34 43 33" fill="none" stroke="#a04020" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M 57 33 Q 62 34 66 32" fill="none" stroke="#a04020" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
  }[mood];

  const eyes = {
    neutral: (
      <>
        <ellipse cx="38" cy="40" rx="5.2" ry="5.8" fill="white" />
        <ellipse cx="62" cy="40" rx="5.2" ry="5.8" fill="white" />
        <ellipse cx="38" cy="40.5" rx="3.2" ry="3.6" fill="#5a8f4a" />
        <ellipse cx="62" cy="40.5" rx="3.2" ry="3.6" fill="#5a8f4a" />
        <circle cx="38" cy="40.5" r="1.8" fill="#1a2e1a" />
        <circle cx="62" cy="40.5" r="1.8" fill="#1a2e1a" />
        {eyeHighlight(36.2, 39)}
        {eyeHighlight(60.2, 39)}
        {eyeHighlight2(36.2, 39)}
        {eyeHighlight2(60.2, 39)}
        {/* Eyelashes */}
        <path d="M 33 38 Q 34 35.5 36 37" fill="none" stroke="#a04020" strokeWidth="0.7" />
        <path d="M 67 38 Q 66 35.5 64 37" fill="none" stroke="#a04020" strokeWidth="0.7" />
      </>
    ),
    happy: (
      <>
        <path d="M 33 41 Q 38 35 43 41" fill="white" />
        <path d="M 33 41 Q 38 44 43 41" fill="white" />
        <path d="M 57 41 Q 62 35 67 41" fill="white" />
        <path d="M 57 41 Q 62 44 67 41" fill="white" />
        <ellipse cx="38" cy="40" rx="3.2" ry="2.6" fill="#5a8f4a" />
        <ellipse cx="62" cy="40" rx="3.2" ry="2.6" fill="#5a8f4a" />
        <circle cx="38" cy="39.8" r="1.5" fill="#1a2e1a" />
        <circle cx="62" cy="39.8" r="1.5" fill="#1a2e1a" />
        {eyeHighlight(36.5, 38.8)}
        {eyeHighlight(60.5, 38.8)}
        <path d="M 33 39 Q 34 36.5 36 38" fill="none" stroke="#a04020" strokeWidth="0.7" />
        <path d="M 67 39 Q 66 36.5 64 38" fill="none" stroke="#a04020" strokeWidth="0.7" />
      </>
    ),
    sad: (
      <>
        <ellipse cx="38" cy="41" rx="5.2" ry="5.2" fill="white" />
        <ellipse cx="62" cy="41" rx="5.2" ry="5.2" fill="white" />
        <path d="M 33 39.5 Q 38 38 43 41" fill="none" stroke="#a04020" strokeWidth="0.9" />
        <path d="M 57 41 Q 62 38 67 39.5" fill="none" stroke="#a04020" strokeWidth="0.9" />
        <ellipse cx="38" cy="42" rx="3.2" ry="3.4" fill="#5a8f4a" />
        <ellipse cx="62" cy="42" rx="3.2" ry="3.4" fill="#5a8f4a" />
        <circle cx="38" cy="42" r="1.8" fill="#1a2e1a" />
        <circle cx="62" cy="42" r="1.8" fill="#1a2e1a" />
        {eyeHighlight(36.2, 40.5)}
        {eyeHighlight(60.2, 40.5)}
      </>
    ),
  }[mood];

  const mouth = {
    neutral: <path d="M 43 52 Q 50 56 57 52" fill="none" stroke="#a04040" strokeWidth="1.8" strokeLinecap="round" />,
    happy: (
      <>
        <path d="M 40 50 Q 50 60 60 50" fill="#d45060" stroke="#a04040" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 43 51 Q 50 54 57 51" fill="white" />
      </>
    ),
    sad: <path d="M 43 56 Q 50 50 57 56" fill="none" stroke="#a04040" strokeWidth="1.8" strokeLinecap="round" />,
  }[mood];

  const blush = mood === "happy" ? (
    <>
      <ellipse cx="30" cy="47" rx="4" ry="2.5" fill="#f0a0a0" opacity={0.5} />
      <ellipse cx="70" cy="47" rx="4" ry="2.5" fill="#f0a0a0" opacity={0.5} />
    </>
  ) : null;

  // Freckles (always visible)
  const freckles = (
    <>
      <circle cx="32" cy="46" r="0.9" fill="#c07040" opacity={0.5} />
      <circle cx="35" cy="48" r="0.8" fill="#c07040" opacity={0.5} />
      <circle cx="33" cy="50" r="0.9" fill="#c07040" opacity={0.5} />
      <circle cx="68" cy="46" r="0.9" fill="#c07040" opacity={0.5} />
      <circle cx="65" cy="48" r="0.8" fill="#c07040" opacity={0.5} />
      <circle cx="67" cy="50" r="0.9" fill="#c07040" opacity={0.5} />
      {/* Nose bridge freckles */}
      <circle cx="48" cy="45" r="0.6" fill="#c07040" opacity={0.4} />
      <circle cx="52" cy="45" r="0.6" fill="#c07040" opacity={0.4} />
      <circle cx="50" cy="44" r="0.6" fill="#c07040" opacity={0.4} />
    </>
  );

  return (
    <>
      <defs>
        <radialGradient id="skin3" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ffeede" />
          <stop offset="100%" stopColor="#f5d5b8" />
        </radialGradient>
        <linearGradient id="hair3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e04020" />
          <stop offset="100%" stopColor="#b03018" />
        </linearGradient>
      </defs>

      {/* ----- Body / Green shirt ----- */}
      <path
        d="M 22 76 Q 22 66 50 64 Q 78 66 78 76 L 78 100 L 22 100 Z"
        fill="#27ae60"
      />
      {/* Collar -- round Peter Pan collar */}
      <ellipse cx="42" cy="67" rx="7" ry="4" fill="#2ecc71" />
      <ellipse cx="58" cy="67" rx="7" ry="4" fill="#2ecc71" />
      <path d="M 30 80 Q 50 84 70 80" fill="none" stroke="#1e8c4c" strokeWidth="0.8" opacity={0.4} />

      {/* ----- Pigtails (behind head) ----- */}
      {/* Left pigtail */}
      <ellipse cx="20" cy="38" rx="9" ry="18" fill="url(#hair3)" transform="rotate(-12 20 38)" />
      <circle cx="16" cy="52" r="5" fill="url(#hair3)" />
      {/* Right pigtail */}
      <ellipse cx="80" cy="38" rx="9" ry="18" fill="url(#hair3)" transform="rotate(12 80 38)" />
      <circle cx="84" cy="52" r="5" fill="url(#hair3)" />

      {/* Main hair volume */}
      <ellipse cx="50" cy="28" rx="28" ry="22" fill="url(#hair3)" />

      {/* Hair bands (where pigtails attach) */}
      <circle cx="24" cy="28" r="3.5" fill="#ffd700" />
      <circle cx="76" cy="28" r="3.5" fill="#ffd700" />

      {/* Bangs -- wispy fringe */}
      <path d="M 28 28 Q 34 36 38 28 Q 42 20 46 30 Q 50 20 54 30 Q 58 20 62 28 Q 66 36 72 28" fill="url(#hair3)" />

      {/* ----- Face ----- */}
      <ellipse cx="50" cy="42" rx="24" ry="25" fill="url(#skin3)" />

      {/* ----- Ears ----- */}
      <ellipse cx="26" cy="43" rx="3.5" ry="4.5" fill="url(#skin3)" />
      <ellipse cx="74" cy="43" rx="3.5" ry="4.5" fill="url(#skin3)" />

      {/* ----- Nose ----- */}
      <circle cx="50" cy="48" r="2" fill="#f0bfa0" opacity={0.6} />

      {freckles}
      {brows}
      {eyes}
      {mouth}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

const characterRenderers = [Character0, Character1, Character2, Character3];

export function Character({ id, mood = "neutral", onClick, highlighted = false }: CharacterProps) {
  const Renderer = characterRenderers[id % characterRenderers.length];

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center transition-all ${
        highlighted ? "bg-white/10 rounded-xl p-1" : "p-1"
      } ${onClick ? "cursor-pointer hover:scale-105" : ""}`}
    >
      <svg width="100" height="100" viewBox="0 0 100 100">
        <Renderer mood={mood} />
      </svg>
    </button>
  );
}
