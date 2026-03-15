"use client";

type Mood = "neutral" | "happy" | "sad";

interface CharacterProps {
  index: 0 | 1 | 2 | 3;
  mood?: Mood;
  size?: number;
}

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                      */
/* ------------------------------------------------------------------ */

/** Crisp white highlight dot on eye */
const eyeGlint = (cx: number, cy: number) => (
  <circle cx={cx} cy={cy} r={1.6} fill="white" opacity={0.95} />
);
const eyeGlint2 = (cx: number, cy: number) => (
  <circle cx={cx + 2.5} cy={cy + 1.8} r={0.75} fill="white" opacity={0.55} />
);

/* ------------------------------------------------------------------ */
/*  Character 0 — Bear                                                 */
/*  Round, warm brown, little round ears, friendly belly patch         */
/* ------------------------------------------------------------------ */

function Bear({ mood }: { mood: Mood }) {
  /* ---- eyebrows ---- */
  const brows = {
    neutral: (
      <>
        <path d="M 31 34 Q 37 30 43 34" fill="none" stroke="#3d2006" strokeWidth="2" strokeLinecap="round" />
        <path d="M 57 34 Q 63 30 69 34" fill="none" stroke="#3d2006" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    happy: (
      <>
        <path d="M 31 31 Q 37 26 43 31" fill="none" stroke="#3d2006" strokeWidth="2" strokeLinecap="round" />
        <path d="M 57 31 Q 63 26 69 31" fill="none" stroke="#3d2006" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    sad: (
      <>
        <path d="M 32 33 Q 37 36 43 34" fill="none" stroke="#3d2006" strokeWidth="2" strokeLinecap="round" />
        <path d="M 57 34 Q 63 36 68 33" fill="none" stroke="#3d2006" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  }[mood];

  /* ---- eyes ---- */
  const eyes = {
    neutral: (
      <>
        <ellipse cx="38" cy="41" rx="5.5" ry="6" fill="white" />
        <ellipse cx="62" cy="41" rx="5.5" ry="6" fill="white" />
        <ellipse cx="38" cy="41.5" rx="3.4" ry="3.8" fill="#3d1f00" />
        <ellipse cx="62" cy="41.5" rx="3.4" ry="3.8" fill="#3d1f00" />
        <circle cx="38" cy="41.5" r="1.8" fill="#0e0600" />
        <circle cx="62" cy="41.5" r="1.8" fill="#0e0600" />
        {eyeGlint(36.4, 39.6)}
        {eyeGlint(60.4, 39.6)}
        {eyeGlint2(36.4, 39.6)}
        {eyeGlint2(60.4, 39.6)}
      </>
    ),
    happy: (
      <>
        {/* Happy squint arcs */}
        <path d="M 33 42 Q 38 35 43 42" fill="white" stroke="none" />
        <path d="M 33 42 Q 38 46 43 42" fill="white" stroke="none" />
        <path d="M 57 42 Q 62 35 67 42" fill="white" stroke="none" />
        <path d="M 57 42 Q 62 46 67 42" fill="white" stroke="none" />
        <ellipse cx="38" cy="41" rx="3" ry="2.6" fill="#3d1f00" />
        <ellipse cx="62" cy="41" rx="3" ry="2.6" fill="#3d1f00" />
        {eyeGlint(36.5, 39.8)}
        {eyeGlint(60.5, 39.8)}
      </>
    ),
    sad: (
      <>
        <ellipse cx="38" cy="42" rx="5.5" ry="5.5" fill="white" />
        <ellipse cx="62" cy="42" rx="5.5" ry="5.5" fill="white" />
        {/* droopy upper lid */}
        <path d="M 33 40 Q 38 38 43 41" fill="none" stroke="#7a5030" strokeWidth="1.4" />
        <path d="M 57 41 Q 62 38 67 40" fill="none" stroke="#7a5030" strokeWidth="1.4" />
        <ellipse cx="38" cy="43" rx="3.4" ry="3.6" fill="#3d1f00" />
        <ellipse cx="62" cy="43" rx="3.4" ry="3.6" fill="#3d1f00" />
        <circle cx="38" cy="43" r="1.8" fill="#0e0600" />
        <circle cx="62" cy="43" r="1.8" fill="#0e0600" />
        {eyeGlint(36.4, 41.4)}
        {eyeGlint(60.4, 41.4)}
        {/* sad tear drop */}
        <ellipse cx="32" cy="50" rx="1.2" ry="1.8" fill="#a8d4f0" opacity={0.8} />
        <ellipse cx="68" cy="50" rx="1.2" ry="1.8" fill="#a8d4f0" opacity={0.8} />
      </>
    ),
  }[mood];

  /* ---- mouth ---- */
  const mouth = {
    neutral: (
      <path d="M 41 53 Q 50 59 59 53" fill="none" stroke="#3d1f00" strokeWidth="2.2" strokeLinecap="round" />
    ),
    happy: (
      <>
        <path d="M 38 51 Q 50 63 62 51" fill="#c0392b" stroke="#3d1f00" strokeWidth="2" strokeLinecap="round" />
        <path d="M 42 52 Q 50 56 58 52" fill="white" stroke="none" />
        {/* tongue peek */}
        <ellipse cx="50" cy="57" rx="4" ry="2.5" fill="#e57070" />
      </>
    ),
    sad: (
      <path d="M 41 58 Q 50 52 59 58" fill="none" stroke="#3d1f00" strokeWidth="2.2" strokeLinecap="round" />
    ),
  }[mood];

  /* ---- blush ---- */
  const blush = mood === "happy" ? (
    <>
      <ellipse cx="27" cy="49" rx="5" ry="3" fill="#d97850" opacity={0.38} />
      <ellipse cx="73" cy="49" rx="5" ry="3" fill="#d97850" opacity={0.38} />
    </>
  ) : null;

  /* ---- ear mood: perky happy, droopy sad ---- */
  const earLY = mood === "sad" ? 14 : mood === "happy" ? 10 : 12;
  const earRY = earLY;

  return (
    <>
      <defs>
        <radialGradient id="bearFur" cx="45%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#c87941" />
          <stop offset="100%" stopColor="#8b4e1a" />
        </radialGradient>
        <radialGradient id="bearBelly" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#e8c49a" />
          <stop offset="100%" stopColor="#d4a870" />
        </radialGradient>
        <radialGradient id="bearEar" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#c87941" />
          <stop offset="100%" stopColor="#7a3e10" />
        </radialGradient>
        <filter id="bearShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#5a2e00" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* ---- Body ---- */}
      <ellipse cx="50" cy="88" rx="28" ry="18" fill="url(#bearFur)" />
      {/* Belly patch */}
      <ellipse cx="50" cy="84" rx="15" ry="12" fill="url(#bearBelly)" />

      {/* ---- Round ears ---- */}
      {/* left ear */}
      <circle cx="25" cy={earLY + 10} r="10" fill="url(#bearEar)" />
      <circle cx="25" cy={earLY + 10} r="5.5" fill="#d4936b" />
      {/* right ear */}
      <circle cx="75" cy={earRY + 10} r="10" fill="url(#bearEar)" />
      <circle cx="75" cy={earRY + 10} r="5.5" fill="#d4936b" />

      {/* ---- Head ---- */}
      <circle cx="50" cy="46" r="30" fill="url(#bearFur)" filter="url(#bearShadow)" />

      {/* ---- Muzzle patch ---- */}
      <ellipse cx="50" cy="55" rx="12" ry="9" fill="url(#bearBelly)" />

      {/* ---- Nose ---- */}
      <ellipse cx="50" cy="50" rx="5" ry="3.5" fill="#2a1200" />
      <ellipse cx="48.5" cy="49" rx="1.4" ry="0.9" fill="white" opacity={0.35} />

      {brows}
      {eyes}
      {mouth}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Character 1 — Bunny                                                */
/*  White/pink, very tall ears, cute button nose, fluffy cheeks        */
/* ------------------------------------------------------------------ */

function Bunny({ mood }: { mood: Mood }) {
  /* ears tilt with mood */
  const earTiltL = mood === "happy" ? -8 : mood === "sad" ? 18 : 0;
  const earTiltR = mood === "happy" ? 8 : mood === "sad" ? -18 : 0;

  /* ---- eyebrows ---- */
  const brows = {
    neutral: (
      <>
        <path d="M 32 37 Q 38 33 44 37" fill="none" stroke="#c060a0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 56 37 Q 62 33 68 37" fill="none" stroke="#c060a0" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    happy: (
      <>
        <path d="M 32 34 Q 38 29 44 34" fill="none" stroke="#c060a0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 56 34 Q 62 29 68 34" fill="none" stroke="#c060a0" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    sad: (
      <>
        <path d="M 33 36 Q 38 39 44 37" fill="none" stroke="#c060a0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 56 37 Q 62 39 67 36" fill="none" stroke="#c060a0" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  }[mood];

  /* ---- eyes (big, sparkly) ---- */
  const eyes = {
    neutral: (
      <>
        <ellipse cx="37" cy="42" rx="6" ry="6.5" fill="white" />
        <ellipse cx="63" cy="42" rx="6" ry="6.5" fill="white" />
        <ellipse cx="37" cy="42.5" rx="3.8" ry="4.2" fill="#e060c0" />
        <ellipse cx="63" cy="42.5" rx="3.8" ry="4.2" fill="#e060c0" />
        <circle cx="37" cy="42.5" r="2" fill="#1a0e14" />
        <circle cx="63" cy="42.5" r="2" fill="#1a0e14" />
        {eyeGlint(35, 40.5)}
        {eyeGlint(61, 40.5)}
        {eyeGlint2(35, 40.5)}
        {eyeGlint2(61, 40.5)}
      </>
    ),
    happy: (
      <>
        {/* sparkly happy U shapes */}
        <path d="M 31 43 Q 37 36 43 43" fill="white" stroke="none" />
        <path d="M 31 43 Q 37 47 43 43" fill="white" stroke="none" />
        <path d="M 57 43 Q 63 36 69 43" fill="white" stroke="none" />
        <path d="M 57 43 Q 63 47 69 43" fill="white" stroke="none" />
        <ellipse cx="37" cy="42" rx="3.5" ry="2.8" fill="#e060c0" />
        <ellipse cx="63" cy="42" rx="3.5" ry="2.8" fill="#e060c0" />
        <circle cx="37" cy="41.8" r="1.7" fill="#1a0e14" />
        <circle cx="63" cy="41.8" r="1.7" fill="#1a0e14" />
        {eyeGlint(35.2, 40.5)}
        {eyeGlint(61.2, 40.5)}
        {/* star sparkle */}
        <path d="M 44 34 L 45 31 L 46 34 L 49 35 L 46 36 L 45 39 L 44 36 L 41 35 Z" fill="white" opacity={0.7} transform="scale(0.7) translate(18, 14)" />
      </>
    ),
    sad: (
      <>
        <ellipse cx="37" cy="43" rx="6" ry="6" fill="white" />
        <ellipse cx="63" cy="43" rx="6" ry="6" fill="white" />
        <path d="M 31 41 Q 37 39 43 42" fill="none" stroke="#c060a0" strokeWidth="1.2" />
        <path d="M 57 42 Q 63 39 69 41" fill="none" stroke="#c060a0" strokeWidth="1.2" />
        <ellipse cx="37" cy="44" rx="3.8" ry="4" fill="#e060c0" />
        <ellipse cx="63" cy="44" rx="3.8" ry="4" fill="#e060c0" />
        <circle cx="37" cy="44" r="2" fill="#1a0e14" />
        <circle cx="63" cy="44" r="2" fill="#1a0e14" />
        {eyeGlint(35, 42)}
        {eyeGlint(61, 42)}
        {/* big tears */}
        <path d="M 31 50 Q 30 54 32 56 Q 34 58 33 54 Z" fill="#a8d4f5" opacity={0.85} />
        <path d="M 69 50 Q 70 54 68 56 Q 66 58 67 54 Z" fill="#a8d4f5" opacity={0.85} />
      </>
    ),
  }[mood];

  /* ---- mouth ---- */
  const mouth = {
    neutral: (
      <>
        <path d="M 50 54 L 50 57" fill="none" stroke="#e080b0" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 43 57 Q 50 62 57 57" fill="none" stroke="#e080b0" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    happy: (
      <>
        <path d="M 50 52 L 50 55" fill="none" stroke="#e080b0" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 40 54 Q 50 65 60 54" fill="#e87070" stroke="#c06060" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 44 55 Q 50 59 56 55" fill="white" stroke="none" />
      </>
    ),
    sad: (
      <>
        <path d="M 50 58 L 50 61" fill="none" stroke="#e080b0" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 43 62 Q 50 56 57 62" fill="none" stroke="#e080b0" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  }[mood];

  const blush = mood === "happy" ? (
    <>
      <ellipse cx="25" cy="50" rx="6" ry="3.5" fill="#ffb0d8" opacity={0.5} />
      <ellipse cx="75" cy="50" rx="6" ry="3.5" fill="#ffb0d8" opacity={0.5} />
    </>
  ) : (
    /* soft natural blush always on bunny cheeks */
    <>
      <ellipse cx="25" cy="50" rx="5" ry="3" fill="#ffb0d8" opacity={0.25} />
      <ellipse cx="75" cy="50" rx="5" ry="3" fill="#ffb0d8" opacity={0.25} />
    </>
  );

  return (
    <>
      <defs>
        <radialGradient id="bunnyFur" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8dde8" />
        </radialGradient>
        <radialGradient id="bunnyPink" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ffcce8" />
          <stop offset="100%" stopColor="#f0a0cc" />
        </radialGradient>
        <radialGradient id="bunnyEarInner" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffb0d8" />
          <stop offset="100%" stopColor="#e890c0" />
        </radialGradient>
        <filter id="bunnyShadow" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#b070a0" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* ---- Body ---- */}
      <ellipse cx="50" cy="90" rx="26" ry="16" fill="url(#bunnyFur)" />
      {/* Tummy */}
      <ellipse cx="50" cy="87" rx="13" ry="10" fill="url(#bunnyPink)" opacity={0.5} />

      {/* ---- Tall ears — drawn before head so head overlaps base ---- */}
      {/* Left ear */}
      <g transform={`rotate(${earTiltL}, 35, 48)`}>
        <ellipse cx="35" cy="18" rx="8" ry="22" fill="url(#bunnyFur)" />
        <ellipse cx="35" cy="18" rx="4.5" ry="16" fill="url(#bunnyEarInner)" />
      </g>
      {/* Right ear */}
      <g transform={`rotate(${earTiltR}, 65, 48)`}>
        <ellipse cx="65" cy="18" rx="8" ry="22" fill="url(#bunnyFur)" />
        <ellipse cx="65" cy="18" rx="4.5" ry="16" fill="url(#bunnyEarInner)" />
      </g>

      {/* ---- Head ---- */}
      <circle cx="50" cy="50" r="28" fill="url(#bunnyFur)" filter="url(#bunnyShadow)" />

      {/* ---- Fluffy cheek pouches ---- */}
      <circle cx="22" cy="53" r="8" fill="url(#bunnyFur)" opacity={0.8} />
      <circle cx="78" cy="53" r="8" fill="url(#bunnyFur)" opacity={0.8} />

      {/* ---- Muzzle ---- */}
      <ellipse cx="50" cy="57" rx="9" ry="6" fill="url(#bunnyPink)" opacity={0.6} />

      {/* ---- Nose (cute button) ---- */}
      <ellipse cx="50" cy="53" rx="3.5" ry="2.4" fill="#e870b0" />
      <ellipse cx="49" cy="52.2" rx="1" ry="0.7" fill="white" opacity={0.45} />

      {/* ---- Whiskers ---- */}
      <line x1="32" y1="55" x2="46" y2="54" stroke="#d0b0c8" strokeWidth="0.8" opacity={0.6} strokeLinecap="round" />
      <line x1="32" y1="58" x2="46" y2="57" stroke="#d0b0c8" strokeWidth="0.8" opacity={0.6} strokeLinecap="round" />
      <line x1="54" y1="54" x2="68" y2="55" stroke="#d0b0c8" strokeWidth="0.8" opacity={0.6} strokeLinecap="round" />
      <line x1="54" y1="57" x2="68" y2="58" stroke="#d0b0c8" strokeWidth="0.8" opacity={0.6} strokeLinecap="round" />

      {brows}
      {eyes}
      {mouth}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Character 2 — Fox                                                  */
/*  Orange, pointy triangular ears, white muzzle, bushy tail peek      */
/* ------------------------------------------------------------------ */

function Fox({ mood }: { mood: Mood }) {
  /* ---- eyebrows ---- */
  const brows = {
    neutral: (
      <>
        <path d="M 31 34 Q 37 30 44 33" fill="none" stroke="#5a2800" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 56 33 Q 63 30 69 34" fill="none" stroke="#5a2800" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    happy: (
      <>
        <path d="M 31 31 Q 37 26 44 30" fill="none" stroke="#5a2800" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 56 30 Q 63 26 69 31" fill="none" stroke="#5a2800" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    sad: (
      <>
        {/* inner brows raised for sad-puppy look */}
        <path d="M 32 33 Q 37 36 44 34" fill="none" stroke="#5a2800" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 56 34 Q 63 36 68 33" fill="none" stroke="#5a2800" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  }[mood];

  /* ---- eyes (amber / golden, clever-looking) ---- */
  const eyes = {
    neutral: (
      <>
        <ellipse cx="37" cy="41" rx="5.5" ry="6" fill="white" />
        <ellipse cx="63" cy="41" rx="5.5" ry="6" fill="white" />
        <ellipse cx="37" cy="41.5" rx="3.5" ry="3.8" fill="#c87820" />
        <ellipse cx="63" cy="41.5" rx="3.5" ry="3.8" fill="#c87820" />
        {/* vertical slit pupils - clever fox! */}
        <ellipse cx="37" cy="41.5" rx="1.2" ry="3.2" fill="#1e0e00" />
        <ellipse cx="63" cy="41.5" rx="1.2" ry="3.2" fill="#1e0e00" />
        {eyeGlint(35.4, 39.6)}
        {eyeGlint(61.4, 39.6)}
        {eyeGlint2(35.4, 39.6)}
        {eyeGlint2(61.4, 39.6)}
      </>
    ),
    happy: (
      <>
        {/* happy squint */}
        <path d="M 32 42 Q 37 35 43 42" fill="white" stroke="none" />
        <path d="M 32 42 Q 37 46 43 42" fill="white" stroke="none" />
        <path d="M 57 42 Q 62 35 68 42" fill="white" stroke="none" />
        <path d="M 57 42 Q 62 46 68 42" fill="white" stroke="none" />
        <ellipse cx="37" cy="41" rx="3" ry="2.6" fill="#c87820" />
        <ellipse cx="63" cy="41" rx="3" ry="2.6" fill="#c87820" />
        {eyeGlint(35.4, 39.8)}
        {eyeGlint(61.4, 39.8)}
      </>
    ),
    sad: (
      <>
        <ellipse cx="37" cy="42" rx="5.5" ry="5.5" fill="white" />
        <ellipse cx="63" cy="42" rx="5.5" ry="5.5" fill="white" />
        <path d="M 32 40 Q 37 38 43 41" fill="none" stroke="#8a4010" strokeWidth="1.3" />
        <path d="M 57 41 Q 63 38 68 40" fill="none" stroke="#8a4010" strokeWidth="1.3" />
        <ellipse cx="37" cy="43" rx="3.5" ry="3.6" fill="#c87820" />
        <ellipse cx="63" cy="43" rx="3.5" ry="3.6" fill="#c87820" />
        <ellipse cx="37" cy="43" rx="1.2" ry="3" fill="#1e0e00" />
        <ellipse cx="63" cy="43" rx="1.2" ry="3" fill="#1e0e00" />
        {eyeGlint(35.4, 41.4)}
        {eyeGlint(61.4, 41.4)}
        {/* tears */}
        <ellipse cx="31" cy="50" rx="1.4" ry="2" fill="#a8d4f0" opacity={0.8} />
        <ellipse cx="69" cy="50" rx="1.4" ry="2" fill="#a8d4f0" opacity={0.8} />
      </>
    ),
  }[mood];

  /* ---- mouth ---- */
  const mouth = {
    neutral: (
      <path d="M 42 54 Q 50 59 58 54" fill="none" stroke="#5a2800" strokeWidth="2" strokeLinecap="round" />
    ),
    happy: (
      <>
        <path d="M 39 52 Q 50 64 61 52" fill="#c04030" stroke="#5a2800" strokeWidth="2" strokeLinecap="round" />
        <path d="M 43 53 Q 50 57 57 53" fill="white" stroke="none" />
        {/* cheeky tongue */}
        <ellipse cx="50" cy="58" rx="4.5" ry="3" fill="#e06060" />
      </>
    ),
    sad: (
      <path d="M 42 58 Q 50 52 58 58" fill="none" stroke="#5a2800" strokeWidth="2" strokeLinecap="round" />
    ),
  }[mood];

  const blush = mood === "happy" ? (
    <>
      <ellipse cx="26" cy="50" rx="6" ry="3.5" fill="#f09060" opacity={0.4} />
      <ellipse cx="74" cy="50" rx="6" ry="3.5" fill="#f09060" opacity={0.4} />
    </>
  ) : null;

  return (
    <>
      <defs>
        <radialGradient id="foxOrange" cx="40%" cy="35%" r="62%">
          <stop offset="0%" stopColor="#f08030" />
          <stop offset="100%" stopColor="#c05010" />
        </radialGradient>
        <radialGradient id="foxWhite" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fff8f0" />
          <stop offset="100%" stopColor="#f0e4d0" />
        </radialGradient>
        <radialGradient id="foxEar" cx="50%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#f08030" />
          <stop offset="100%" stopColor="#a03010" />
        </radialGradient>
        <filter id="foxShadow" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#8a3000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* ---- Tail peek at bottom ---- */}
      {mood !== "sad" && (
        <>
          <ellipse cx="76" cy="93" rx="14" ry="9" fill="url(#foxOrange)" transform="rotate(-20 76 93)" />
          <ellipse cx="76" cy="93" rx="7" ry="4.5" fill="url(#foxWhite)" transform="rotate(-20 76 93)" />
        </>
      )}

      {/* ---- Body ---- */}
      <ellipse cx="50" cy="89" rx="27" ry="17" fill="url(#foxOrange)" />
      {/* chest patch */}
      <ellipse cx="50" cy="86" rx="14" ry="10" fill="url(#foxWhite)" />

      {/* ---- Pointy triangular ears ---- */}
      {/* Left ear */}
      <path d="M 20 30 L 30 5 L 40 30 Z" fill="url(#foxEar)" />
      <path d="M 23 28 L 30 10 L 37 28 Z" fill="#e05020" opacity={0.5} />
      {/* Right ear */}
      <path d="M 60 30 L 70 5 L 80 30 Z" fill="url(#foxEar)" />
      <path d="M 63 28 L 70 10 L 77 28 Z" fill="#e05020" opacity={0.5} />

      {/* ---- Head ---- */}
      <ellipse cx="50" cy="46" rx="29" ry="27" fill="url(#foxOrange)" filter="url(#foxShadow)" />

      {/* ---- White face mask ---- */}
      {/* cheek patches */}
      <ellipse cx="32" cy="52" rx="10" ry="8" fill="url(#foxWhite)" />
      <ellipse cx="68" cy="52" rx="10" ry="8" fill="url(#foxWhite)" />

      {/* ---- Muzzle ---- */}
      <ellipse cx="50" cy="56" rx="11" ry="8" fill="url(#foxWhite)" />

      {/* ---- Nose ---- */}
      <ellipse cx="50" cy="51" rx="4" ry="2.8" fill="#1a0a00" />
      <ellipse cx="48.8" cy="50.2" rx="1.2" ry="0.8" fill="white" opacity={0.4} />

      {/* ---- Whiskers ---- */}
      <line x1="28" y1="55" x2="44" y2="53" stroke="#8a5030" strokeWidth="0.9" opacity={0.5} strokeLinecap="round" />
      <line x1="28" y1="58" x2="44" y2="57" stroke="#8a5030" strokeWidth="0.9" opacity={0.5} strokeLinecap="round" />
      <line x1="56" y1="53" x2="72" y2="55" stroke="#8a5030" strokeWidth="0.9" opacity={0.5} strokeLinecap="round" />
      <line x1="56" y1="57" x2="72" y2="58" stroke="#8a5030" strokeWidth="0.9" opacity={0.5} strokeLinecap="round" />

      {brows}
      {eyes}
      {mouth}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Character 3 — Owl                                                  */
/*  Gray/brown, enormous round eyes, tufted ear feathers, wise beak    */
/* ------------------------------------------------------------------ */

function Owl({ mood }: { mood: Mood }) {
  /* ---- eyebrows (feathery tufts) ---- */
  const brows = {
    neutral: (
      <>
        <path d="M 27 31 Q 33 26 39 30" fill="none" stroke="#4a3820" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 61 30 Q 67 26 73 31" fill="none" stroke="#4a3820" strokeWidth="2.2" strokeLinecap="round" />
        {/* feather texture on brows */}
        <path d="M 28 30 Q 31 27 34 29" fill="none" stroke="#4a3820" strokeWidth="1" strokeLinecap="round" opacity={0.6} />
        <path d="M 66 29 Q 69 27 72 30" fill="none" stroke="#4a3820" strokeWidth="1" strokeLinecap="round" opacity={0.6} />
      </>
    ),
    happy: (
      <>
        <path d="M 27 28 Q 33 22 39 27" fill="none" stroke="#4a3820" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 61 27 Q 67 22 73 28" fill="none" stroke="#4a3820" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 28 27 Q 31 23 34 26" fill="none" stroke="#4a3820" strokeWidth="1" strokeLinecap="round" opacity={0.6} />
        <path d="M 66 26 Q 69 23 72 27" fill="none" stroke="#4a3820" strokeWidth="1" strokeLinecap="round" opacity={0.6} />
      </>
    ),
    sad: (
      <>
        <path d="M 28 29 Q 33 33 39 31" fill="none" stroke="#4a3820" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 61 31 Q 67 33 72 29" fill="none" stroke="#4a3820" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 29 28 Q 32 32 35 30" fill="none" stroke="#4a3820" strokeWidth="1" strokeLinecap="round" opacity={0.6} />
        <path d="M 65 30 Q 68 32 71 28" fill="none" stroke="#4a3820" strokeWidth="1" strokeLinecap="round" opacity={0.6} />
      </>
    ),
  }[mood];

  /* ---- enormous owl eyes ---- */
  const eyes = {
    neutral: (
      <>
        {/* outer ring */}
        <circle cx="35" cy="43" r="12" fill="#7a6040" />
        <circle cx="65" cy="43" r="12" fill="#7a6040" />
        {/* facial disc ring */}
        <circle cx="35" cy="43" r="10" fill="#c8a870" />
        <circle cx="65" cy="43" r="10" fill="#c8a870" />
        {/* eyeball */}
        <circle cx="35" cy="43" r="8" fill="white" />
        <circle cx="65" cy="43" r="8" fill="white" />
        {/* iris */}
        <circle cx="35" cy="43" r="5.5" fill="#e8a020" />
        <circle cx="65" cy="43" r="5.5" fill="#e8a020" />
        {/* pupil */}
        <circle cx="35" cy="43" r="3" fill="#0a0600" />
        <circle cx="65" cy="43" r="3" fill="#0a0600" />
        {/* glints */}
        {eyeGlint(32.5, 40.5)}
        {eyeGlint(62.5, 40.5)}
        {eyeGlint2(32.5, 40.5)}
        {eyeGlint2(62.5, 40.5)}
        <circle cx="37" cy="45" r="0.9" fill="white" opacity={0.4} />
        <circle cx="67" cy="45" r="0.9" fill="white" opacity={0.4} />
      </>
    ),
    happy: (
      <>
        {/* outer ring */}
        <circle cx="35" cy="43" r="12" fill="#7a6040" />
        <circle cx="65" cy="43" r="12" fill="#7a6040" />
        <circle cx="35" cy="43" r="10" fill="#c8a870" />
        <circle cx="65" cy="43" r="10" fill="#c8a870" />
        {/* happy half-closed: keep the rings but clip top with arc fill */}
        <circle cx="35" cy="43" r="8" fill="white" />
        <circle cx="65" cy="43" r="8" fill="white" />
        {/* drooping eyelid top mask */}
        <path d="M 27 43 Q 35 33 43 43" fill="#c8a870" stroke="none" />
        <path d="M 57 43 Q 65 33 73 43" fill="#c8a870" stroke="none" />
        {/* iris large happy */}
        <circle cx="35" cy="45" r="5.5" fill="#e8a020" />
        <circle cx="65" cy="45" r="5.5" fill="#e8a020" />
        <circle cx="35" cy="45" r="3" fill="#0a0600" />
        <circle cx="65" cy="45" r="3" fill="#0a0600" />
        {eyeGlint(32.5, 43)}
        {eyeGlint(62.5, 43)}
      </>
    ),
    sad: (
      <>
        <circle cx="35" cy="43" r="12" fill="#7a6040" />
        <circle cx="65" cy="43" r="12" fill="#7a6040" />
        <circle cx="35" cy="43" r="10" fill="#c8a870" />
        <circle cx="65" cy="43" r="10" fill="#c8a870" />
        <circle cx="35" cy="43" r="8" fill="white" />
        <circle cx="65" cy="43" r="8" fill="white" />
        {/* drooped upper lid for sad */}
        <path d="M 27 43 Q 35 37 43 43" fill="#c8a870" stroke="none" />
        <path d="M 57 43 Q 65 37 73 43" fill="#c8a870" stroke="none" />
        <circle cx="35" cy="44" r="5.5" fill="#e8a020" />
        <circle cx="65" cy="44" r="5.5" fill="#e8a020" />
        <circle cx="35" cy="44" r="3" fill="#0a0600" />
        <circle cx="65" cy="44" r="3" fill="#0a0600" />
        {eyeGlint(32.5, 42)}
        {eyeGlint(62.5, 42)}
        {/* tears streaming down */}
        <path d="M 29 51 Q 28 56 30 60 Q 31 56 30 52 Z" fill="#a8d4f5" opacity={0.9} />
        <path d="M 71 51 Q 72 56 70 60 Q 69 56 70 52 Z" fill="#a8d4f5" opacity={0.9} />
      </>
    ),
  }[mood];

  /* ---- beak ---- */
  const beak = (
    <path d="M 45 55 L 50 62 L 55 55 Q 52 58 50 58 Q 48 58 45 55 Z" fill="#e8a030" stroke="#c07818" strokeWidth="0.8" strokeLinejoin="round" />
  );

  /* ---- mouth expression below beak ---- */
  const mouthBelow = {
    neutral: null,
    happy: (
      <path d="M 43 62 Q 50 67 57 62" fill="none" stroke="#c07818" strokeWidth="1.8" strokeLinecap="round" />
    ),
    sad: (
      <path d="M 43 66 Q 50 61 57 66" fill="none" stroke="#c07818" strokeWidth="1.8" strokeLinecap="round" />
    ),
  }[mood];

  const blush = mood === "happy" ? (
    <>
      <ellipse cx="22" cy="52" rx="5" ry="3" fill="#e8b070" opacity={0.4} />
      <ellipse cx="78" cy="52" rx="5" ry="3" fill="#e8b070" opacity={0.4} />
    </>
  ) : null;

  return (
    <>
      <defs>
        <radialGradient id="owlBody" cx="40%" cy="35%" r="62%">
          <stop offset="0%" stopColor="#a08060" />
          <stop offset="100%" stopColor="#604828" />
        </radialGradient>
        <radialGradient id="owlDisc" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#d4b888" />
          <stop offset="100%" stopColor="#b89060" />
        </radialGradient>
        <radialGradient id="owlBelly" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#e8d8b0" />
          <stop offset="100%" stopColor="#c8b080" />
        </radialGradient>
        <filter id="owlShadow" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#402010" floodOpacity="0.3" />
        </filter>
        {/* Feather pattern for wings */}
        <pattern id="featherPat" x="0" y="0" width="6" height="4" patternUnits="userSpaceOnUse">
          <path d="M 0 2 Q 3 0 6 2 Q 3 4 0 2 Z" fill="#7a5a38" opacity={0.25} />
        </pattern>
      </defs>

      {/* ---- Wings / body ---- */}
      <ellipse cx="50" cy="88" rx="30" ry="16" fill="url(#owlBody)" />
      {/* Wing texture */}
      <ellipse cx="50" cy="88" rx="30" ry="16" fill="url(#featherPat)" />
      {/* Belly feathers */}
      <ellipse cx="50" cy="85" rx="16" ry="11" fill="url(#owlBelly)" />
      {/* Belly scallop lines */}
      <path d="M 40 78 Q 50 82 60 78" fill="none" stroke="#b09060" strokeWidth="0.8" opacity={0.5} />
      <path d="M 38 83 Q 50 88 62 83" fill="none" stroke="#b09060" strokeWidth="0.8" opacity={0.5} />

      {/* ---- Ear tufts (feather points on top) ---- */}
      <path d="M 27 22 L 22 6 L 34 20 Z" fill="url(#owlBody)" />
      <path d="M 23 20 L 20 8 L 30 18 Z" fill="#8a6840" opacity={0.6} />
      <path d="M 73 22 L 78 6 L 66 20 Z" fill="url(#owlBody)" />
      <path d="M 77 20 L 80 8 L 70 18 Z" fill="#8a6840" opacity={0.6} />

      {/* ---- Head ---- */}
      <circle cx="50" cy="44" r="32" fill="url(#owlBody)" filter="url(#owlShadow)" />
      {/* Facial disc */}
      <ellipse cx="50" cy="47" rx="25" ry="23" fill="url(#owlDisc)" />

      {brows}
      {eyes}
      {beak}
      {mouthBelow}
      {blush}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                         */
/* ------------------------------------------------------------------ */

const animalRenderers = [Bear, Bunny, Fox, Owl];

export function Character({ index, mood = "neutral", size = 120 }: CharacterProps) {
  const Renderer = animalRenderers[index % animalRenderers.length];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <Renderer mood={mood} />
    </svg>
  );
}
