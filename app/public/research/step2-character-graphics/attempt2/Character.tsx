"use client";

type Mood = "neutral" | "happy" | "sad";

interface CharacterProps {
  id: number;
  mood?: Mood;
  onClick?: () => void;
  highlighted?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Per-character design tokens                                        */
/* ------------------------------------------------------------------ */

interface CharacterDesign {
  // Skin
  skin: string;
  skinShadow: string;
  blush: string;
  // Hair
  hair: string;
  hairHighlight: string;
  // Outfit
  shirt: string;
  shirtAccent: string;
  // Eyes
  irisColor: string;
  // Flags
  isGirl: boolean;
  // Unique trait label (for rendering unique features)
  trait: "afro" | "wavy-bow" | "messy-cowlick" | "space-buns";
  // Eyebrow style
  browStyle: "straight" | "arched" | "angled" | "round";
}

const designs: CharacterDesign[] = [
  {
    // Character 0: Boy, short afro, warm brown skin, gold hoodie
    skin: "#9B7044",
    skinShadow: "#7D5A35",
    blush: "#B8845A",
    hair: "#1C1008",
    hairHighlight: "#3D2A14",
    shirt: "#E8B731",
    shirtAccent: "#D4A017",
    irisColor: "#5C3A1E",
    isGirl: false,
    trait: "afro",
    browStyle: "straight",
  },
  {
    // Character 1: Girl, wavy auburn hair with bow, light skin, blue dress
    skin: "#FADCC6",
    skinShadow: "#E8C4A8",
    blush: "#F4A4A4",
    hair: "#8B3A1A",
    hairHighlight: "#B55A2E",
    shirt: "#4A90D9",
    shirtAccent: "#3670B8",
    irisColor: "#3E7CB1",
    isGirl: true,
    trait: "wavy-bow",
    browStyle: "arched",
  },
  {
    // Character 2: Boy, messy dark hair with cowlick, olive skin, purple tee
    skin: "#D4B896",
    skinShadow: "#BDA07E",
    blush: "#D9A088",
    hair: "#151520",
    hairHighlight: "#2C2C40",
    shirt: "#8E44AD",
    shirtAccent: "#7D3C98",
    irisColor: "#4A7C3F",
    isGirl: false,
    trait: "messy-cowlick",
    browStyle: "angled",
  },
  {
    // Character 3: Girl, black hair in space buns, medium-dark skin, green cardigan
    skin: "#B07848",
    skinShadow: "#946038",
    blush: "#C89070",
    hair: "#0E0E14",
    hairHighlight: "#28283C",
    shirt: "#27AE60",
    shirtAccent: "#1E8C4D",
    irisColor: "#6B4226",
    isGirl: true,
    trait: "space-buns",
    browStyle: "round",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components for hair styles                                     */
/* ------------------------------------------------------------------ */

function AfroHair({ hair, highlight }: { hair: string; highlight: string }) {
  return (
    <g>
      {/* Main afro shape - big rounded mass */}
      <ellipse cx="50" cy="28" rx="30" ry="26" fill={hair} />
      {/* Afro texture bumps along the top */}
      <circle cx="26" cy="22" r="9" fill={hair} />
      <circle cx="74" cy="22" r="9" fill={hair} />
      <circle cx="34" cy="12" r="10" fill={hair} />
      <circle cx="50" cy="8" r="10" fill={hair} />
      <circle cx="66" cy="12" r="10" fill={hair} />
      <circle cx="22" cy="32" r="7" fill={hair} />
      <circle cx="78" cy="32" r="7" fill={hair} />
      {/* Subtle highlight on top */}
      <circle cx="46" cy="12" r="5" fill={highlight} opacity="0.35" />
      <circle cx="58" cy="16" r="4" fill={highlight} opacity="0.25" />
    </g>
  );
}

function WavyBowHair({ hair, highlight }: { hair: string; highlight: string }) {
  return (
    <g>
      {/* Main hair mass */}
      <ellipse cx="50" cy="30" rx="30" ry="24" fill={hair} />
      {/* Wavy side locks - left */}
      <path
        d="M 22 30 Q 16 40 20 52 Q 22 56 18 60 Q 16 64 20 66"
        fill="none" stroke={hair} strokeWidth="8" strokeLinecap="round"
      />
      {/* Wavy side locks - right */}
      <path
        d="M 78 30 Q 84 40 80 52 Q 78 56 82 60 Q 84 64 80 66"
        fill="none" stroke={hair} strokeWidth="8" strokeLinecap="round"
      />
      {/* Parting / highlight swoosh */}
      <path
        d="M 40 10 Q 50 8 56 12 Q 58 14 54 16"
        fill={highlight} opacity="0.4"
      />
      {/* Bow on right side */}
      <g transform="translate(72, 16)">
        <path d="M 0 0 Q -8 -6 -4 -10 Q 0 -12 2 -6 Z" fill="#E84466" />
        <path d="M 0 0 Q 8 -6 4 -10 Q 0 -12 -2 -6 Z" fill="#E84466" />
        <path d="M 0 0 Q -6 6 -3 10 Q 0 12 2 6 Z" fill="#D63B5A" />
        <path d="M 0 0 Q 6 6 3 10 Q 0 12 -2 6 Z" fill="#D63B5A" />
        <circle cx="0" cy="0" r="2.5" fill="#F06090" />
      </g>
    </g>
  );
}

function MessyCowlickHair({ hair, highlight }: { hair: string; highlight: string }) {
  return (
    <g>
      {/* Base hair */}
      <ellipse cx="50" cy="28" rx="28" ry="22" fill={hair} />
      {/* Messy spikes */}
      <path d="M 30 14 Q 28 4 36 8 Q 34 2 42 10" fill={hair} />
      <path d="M 60 10 Q 64 0 68 8 Q 72 2 70 14" fill={hair} />
      <path d="M 44 8 Q 46 -2 52 4 Q 54 -2 56 8" fill={hair} />
      {/* The signature cowlick - a big strand sticking up */}
      <path
        d="M 54 10 Q 58 -4 64 2 Q 60 -6 56 6"
        fill={hair} stroke={highlight} strokeWidth="0.5"
      />
      <path
        d="M 54 8 Q 60 -8 66 -2"
        fill="none" stroke={hair} strokeWidth="4" strokeLinecap="round"
      />
      {/* Side tufts */}
      <path d="M 24 26 Q 18 22 20 18 Q 22 22 24 20" fill={hair} />
      <path d="M 76 26 Q 82 22 80 18 Q 78 22 76 20" fill={hair} />
      {/* Highlight */}
      <ellipse cx="42" cy="18" rx="5" ry="3" fill={highlight} opacity="0.3" />
    </g>
  );
}

function SpaceBunsHair({ hair, highlight }: { hair: string; highlight: string }) {
  return (
    <g>
      {/* Main hair base - sleek */}
      <ellipse cx="50" cy="30" rx="28" ry="22" fill={hair} />
      {/* Left space bun */}
      <circle cx="24" cy="16" r="12" fill={hair} />
      <circle cx="22" cy="14" r="4" fill={highlight} opacity="0.2" />
      {/* Right space bun */}
      <circle cx="76" cy="16" r="12" fill={hair} />
      <circle cx="74" cy="14" r="4" fill={highlight} opacity="0.2" />
      {/* Smooth bangs across forehead */}
      <path
        d="M 28 28 Q 34 18 50 16 Q 66 18 72 28"
        fill={hair}
      />
      {/* Center parting line */}
      <line x1="50" y1="12" x2="50" y2="22" stroke={highlight} strokeWidth="0.5" opacity="0.3" />
      {/* Highlight on main hair */}
      <path
        d="M 38 20 Q 44 16 52 17 Q 56 18 58 20"
        fill={highlight} opacity="0.2"
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Eyes — the star of the show                                        */
/* ------------------------------------------------------------------ */

function Eyes({
  mood,
  irisColor,
  isGirl,
}: {
  mood: Mood;
  irisColor: string;
  isGirl: boolean;
}) {
  if (mood === "happy") {
    // Happy: crescent-shaped squinting eyes (upside-down U shapes)
    return (
      <g>
        {/* Left happy eye - upward crescent */}
        <path
          d="M 32 43 Q 36 36 42 43"
          fill="none"
          stroke="#1A1A2E"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Right happy eye - upward crescent */}
        <path
          d="M 56 43 Q 60 36 66 43"
          fill="none"
          stroke="#1A1A2E"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Lashes for girls even when happy */}
        {isGirl && (
          <>
            <line x1="31" y1="42" x2="29" y2="39" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="43" y1="42" x2="45" y2="39" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="55" y1="42" x2="53" y2="39" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="67" y1="42" x2="69" y2="39" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
      </g>
    );
  }

  // For neutral & sad, draw full open eyes
  // Sad eyes: outer corners tilt down
  const leftEyeRotation = mood === "sad" ? "rotate(8, 37, 42)" : "";
  const rightEyeRotation = mood === "sad" ? "rotate(-8, 61, 42)" : "";

  return (
    <g>
      {/* ---- LEFT EYE ---- */}
      <g transform={leftEyeRotation}>
        {/* Eye white (sclera) */}
        <ellipse cx="37" cy="42" rx="8" ry="9" fill="white" />
        {/* Subtle shadow at top of eye */}
        <ellipse cx="37" cy="38" rx="7" ry="4" fill="#E8E8F0" opacity="0.5" />
        {/* Iris */}
        <ellipse cx="37" cy="43" rx="5" ry="5.5" fill={irisColor} />
        {/* Pupil */}
        <ellipse cx="37" cy="43" rx="2.5" ry="3" fill="#0A0A12" />
        {/* Big specular highlight */}
        <ellipse cx="35" cy="40" rx="2.2" ry="2.8" fill="white" opacity="0.9" />
        {/* Small secondary highlight */}
        <circle cx="39.5" cy="45.5" r="1.2" fill="white" opacity="0.6" />
        {/* Eye outline */}
        <ellipse cx="37" cy="42" rx="8" ry="9" fill="none" stroke="#1A1A2E" strokeWidth="1.2" />
        {/* Upper eyelid line (thicker) */}
        <path
          d="M 29 42 Q 33 33 45 42"
          fill="none"
          stroke="#1A1A2E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Girl lashes */}
        {isGirl && (
          <>
            <line x1="30" y1="40" x2="27" y2="37" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="32" y1="37" x2="30" y2="33" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="36" y1="34" x2="35" y2="30" stroke="#1A1A2E" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="44" y1="38" x2="47" y2="35" stroke="#1A1A2E" strokeWidth="1.3" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* ---- RIGHT EYE ---- */}
      <g transform={rightEyeRotation}>
        {/* Eye white (sclera) */}
        <ellipse cx="61" cy="42" rx="8" ry="9" fill="white" />
        {/* Subtle shadow at top of eye */}
        <ellipse cx="61" cy="38" rx="7" ry="4" fill="#E8E8F0" opacity="0.5" />
        {/* Iris */}
        <ellipse cx="61" cy="43" rx="5" ry="5.5" fill={irisColor} />
        {/* Pupil */}
        <ellipse cx="61" cy="43" rx="2.5" ry="3" fill="#0A0A12" />
        {/* Big specular highlight */}
        <ellipse cx="59" cy="40" rx="2.2" ry="2.8" fill="white" opacity="0.9" />
        {/* Small secondary highlight */}
        <circle cx="63.5" cy="45.5" r="1.2" fill="white" opacity="0.6" />
        {/* Eye outline */}
        <ellipse cx="61" cy="42" rx="8" ry="9" fill="none" stroke="#1A1A2E" strokeWidth="1.2" />
        {/* Upper eyelid line (thicker) */}
        <path
          d="M 53 42 Q 57 33 69 42"
          fill="none"
          stroke="#1A1A2E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Girl lashes */}
        {isGirl && (
          <>
            <line x1="54" y1="40" x2="51" y2="37" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="56" y1="37" x2="54" y2="33" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="60" y1="34" x2="59" y2="30" stroke="#1A1A2E" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="68" y1="38" x2="71" y2="35" stroke="#1A1A2E" strokeWidth="1.3" strokeLinecap="round" />
          </>
        )}
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Eyebrows                                                           */
/* ------------------------------------------------------------------ */

function Eyebrows({
  mood,
  browStyle,
  hair,
}: {
  mood: Mood;
  browStyle: string;
  hair: string;
}) {
  // Brow shapes differ per character
  const browColor = hair;

  // Sad: droop outer edges
  if (mood === "sad") {
    return (
      <g>
        <path
          d="M 30 33 Q 34 30 41 34"
          fill="none" stroke={browColor} strokeWidth="2" strokeLinecap="round"
        />
        <path
          d="M 57 34 Q 64 30 68 33"
          fill="none" stroke={browColor} strokeWidth="2" strokeLinecap="round"
        />
      </g>
    );
  }

  // Happy: slightly raised, relaxed
  if (mood === "happy") {
    return (
      <g>
        <path
          d="M 30 32 Q 35 29 42 31"
          fill="none" stroke={browColor} strokeWidth="2" strokeLinecap="round"
        />
        <path
          d="M 56 31 Q 63 29 68 32"
          fill="none" stroke={browColor} strokeWidth="2" strokeLinecap="round"
        />
      </g>
    );
  }

  // Neutral brows vary by style
  switch (browStyle) {
    case "straight":
      return (
        <g>
          <line x1="30" y1="32" x2="42" y2="31" stroke={browColor} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="56" y1="31" x2="68" y2="32" stroke={browColor} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    case "arched":
      return (
        <g>
          <path d="M 30 34 Q 36 28 42 33" fill="none" stroke={browColor} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 56 33 Q 62 28 68 34" fill="none" stroke={browColor} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      );
    case "angled":
      return (
        <g>
          <path d="M 30 34 L 36 30 L 42 32" fill="none" stroke={browColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 56 32 L 62 30 L 68 34" fill="none" stroke={browColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "round":
    default:
      return (
        <g>
          <path d="M 30 33 Q 36 29 42 33" fill="none" stroke={browColor} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 56 33 Q 62 29 68 33" fill="none" stroke={browColor} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Mouth                                                              */
/* ------------------------------------------------------------------ */

function Mouth({ mood }: { mood: Mood }) {
  if (mood === "happy") {
    // Big open smile showing teeth
    return (
      <g>
        {/* Open mouth shape */}
        <path
          d="M 38 56 Q 42 54 49 54 Q 56 54 60 56 Q 56 66 49 67 Q 42 66 38 56 Z"
          fill="#C0392B"
        />
        {/* Upper teeth */}
        <path
          d="M 40 56 Q 42 54 49 54 Q 56 54 58 56 L 56 58 Q 52 56 49 56 Q 46 56 42 58 Z"
          fill="white"
        />
        {/* Tongue hint */}
        <ellipse cx="49" cy="64" rx="5" ry="3" fill="#E74C3C" />
        {/* Mouth outline */}
        <path
          d="M 38 56 Q 42 54 49 54 Q 56 54 60 56 Q 56 66 49 67 Q 42 66 38 56 Z"
          fill="none" stroke="#1A1A2E" strokeWidth="1" strokeLinejoin="round"
        />
      </g>
    );
  }

  if (mood === "sad") {
    // Pouty frown with lower lip
    return (
      <g>
        {/* Upper lip frown */}
        <path
          d="M 40 60 Q 45 56 49 56 Q 53 56 58 60"
          fill="none"
          stroke="#1A1A2E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Pouty lower lip */}
        <path
          d="M 42 61 Q 49 64 56 61"
          fill="#D4837A"
          stroke="#B56B63"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </g>
    );
  }

  // Neutral: friendly gentle smile
  return (
    <g>
      <path
        d="M 40 57 Q 45 62 49 62 Q 53 62 58 57"
        fill="none"
        stroke="#1A1A2E"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Nose                                                               */
/* ------------------------------------------------------------------ */

function Nose({ skin }: { skin: string }) {
  return (
    <g>
      {/* Simple small button nose */}
      <ellipse cx="49" cy="51" rx="2.5" ry="1.8" fill={skin} stroke="#00000020" strokeWidth="0.8" />
      {/* Nostril hints */}
      <circle cx="47.5" cy="51.5" r="0.7" fill="#00000018" />
      <circle cx="50.5" cy="51.5" r="0.7" fill="#00000018" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Ears                                                               */
/* ------------------------------------------------------------------ */

function Ears({ skin, skinShadow }: { skin: string; skinShadow: string }) {
  return (
    <g>
      {/* Left ear */}
      <ellipse cx="22" cy="44" rx="4" ry="6" fill={skin} stroke={skinShadow} strokeWidth="0.8" />
      <ellipse cx="22" cy="44" rx="2" ry="3.5" fill={skinShadow} opacity="0.3" />
      {/* Right ear */}
      <ellipse cx="76" cy="44" rx="4" ry="6" fill={skin} stroke={skinShadow} strokeWidth="0.8" />
      <ellipse cx="76" cy="44" rx="2" ry="3.5" fill={skinShadow} opacity="0.3" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Body                                                               */
/* ------------------------------------------------------------------ */

function Body({
  shirt,
  shirtAccent,
  skin,
  trait,
}: {
  shirt: string;
  shirtAccent: string;
  skin: string;
  trait: string;
}) {
  const isCardigan = trait === "space-buns";
  const isDress = trait === "wavy-bow";
  const isHoodie = trait === "afro";

  return (
    <g>
      {/* Neck */}
      <rect x="43" y="66" width="12" height="8" rx="2" fill={skin} />

      {/* Main body / shirt */}
      <path
        d="M 24 80 Q 24 72 38 70 Q 44 69 49 69 Q 54 69 60 70 Q 74 72 74 80 L 74 100 L 24 100 Z"
        fill={shirt}
      />

      {/* Shirt details based on type */}
      {isHoodie && (
        <>
          {/* Hoodie neckline with drawstrings */}
          <path
            d="M 38 72 Q 44 76 49 77 Q 54 76 60 72"
            fill="none" stroke={shirtAccent} strokeWidth="1.5" strokeLinecap="round"
          />
          {/* Hood edge at neck */}
          <path
            d="M 36 71 Q 38 68 42 70"
            fill="none" stroke={shirtAccent} strokeWidth="1" strokeLinecap="round"
          />
          <path
            d="M 62 71 Q 60 68 56 70"
            fill="none" stroke={shirtAccent} strokeWidth="1" strokeLinecap="round"
          />
          {/* Drawstrings */}
          <line x1="44" y1="77" x2="43" y2="84" stroke={shirtAccent} strokeWidth="0.8" />
          <line x1="54" y1="77" x2="55" y2="84" stroke={shirtAccent} strokeWidth="0.8" />
          {/* Kangaroo pocket */}
          <path
            d="M 38 88 Q 38 86 49 86 Q 60 86 60 88 L 60 95 Q 60 97 49 97 Q 38 97 38 95 Z"
            fill={shirtAccent} opacity="0.5"
          />
        </>
      )}

      {isDress && (
        <>
          {/* Peter Pan collar */}
          <path
            d="M 42 71 Q 38 73 36 72 Q 38 69 44 70"
            fill="white" stroke="#DDD" strokeWidth="0.5"
          />
          <path
            d="M 56 71 Q 60 73 62 72 Q 60 69 54 70"
            fill="white" stroke="#DDD" strokeWidth="0.5"
          />
          {/* Button detail */}
          <circle cx="49" cy="78" r="1.2" fill={shirtAccent} />
          <circle cx="49" cy="84" r="1.2" fill={shirtAccent} />
          <circle cx="49" cy="90" r="1.2" fill={shirtAccent} />
        </>
      )}

      {trait === "messy-cowlick" && (
        <>
          {/* T-shirt collar */}
          <path
            d="M 40 71 Q 45 74 49 75 Q 53 74 58 71"
            fill="none" stroke={shirtAccent} strokeWidth="1.5" strokeLinecap="round"
          />
          {/* Fun graphic on shirt - a little star */}
          <path
            d="M 49 82 L 50.5 86 L 55 86.5 L 51.5 89 L 52.5 93 L 49 91 L 45.5 93 L 46.5 89 L 43 86.5 L 47.5 86 Z"
            fill={shirtAccent} opacity="0.6"
          />
        </>
      )}

      {isCardigan && (
        <>
          {/* Inner shirt (lighter) */}
          <path
            d="M 40 72 Q 44 70 49 70 Q 54 70 58 72 L 56 100 L 42 100 Z"
            fill="#F5E6CA"
          />
          {/* Cardigan opening lines */}
          <line x1="42" y1="72" x2="42" y2="100" stroke={shirtAccent} strokeWidth="1.2" />
          <line x1="56" y1="72" x2="56" y2="100" stroke={shirtAccent} strokeWidth="1.2" />
          {/* Cardigan lapels */}
          <path
            d="M 40 72 Q 42 70 44 72 L 42 78 Z"
            fill={shirtAccent} opacity="0.4"
          />
          <path
            d="M 58 72 Q 56 70 54 72 L 56 78 Z"
            fill={shirtAccent} opacity="0.4"
          />
          {/* Glasses for studious look */}
        </>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Glasses (for Character 3 — studious)                               */
/* ------------------------------------------------------------------ */

function Glasses() {
  return (
    <g>
      <circle cx="37" cy="42" r="9.5" fill="none" stroke="#2A2A3A" strokeWidth="1.5" />
      <circle cx="61" cy="42" r="9.5" fill="none" stroke="#2A2A3A" strokeWidth="1.5" />
      {/* Bridge */}
      <path d="M 46.5 42 Q 49 39 51.5 42" fill="none" stroke="#2A2A3A" strokeWidth="1.3" />
      {/* Temple arms */}
      <line x1="27.5" y1="40" x2="22" y2="39" stroke="#2A2A3A" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="70.5" y1="40" x2="76" y2="39" stroke="#2A2A3A" strokeWidth="1.3" strokeLinecap="round" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Character component                                           */
/* ------------------------------------------------------------------ */

export function Character({
  id,
  mood = "neutral",
  onClick,
  highlighted = false,
}: CharacterProps) {
  const design = designs[id % designs.length];

  const HairComponent = {
    afro: AfroHair,
    "wavy-bow": WavyBowHair,
    "messy-cowlick": MessyCowlickHair,
    "space-buns": SpaceBunsHair,
  }[design.trait];

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center transition-all ${
        highlighted ? "bg-white/10 rounded-xl p-1" : "p-1"
      } ${onClick ? "cursor-pointer hover:scale-105" : ""}`}
    >
      <svg width="100" height="100" viewBox="0 0 100 100">
        <defs>
          {/* Soft shadow filter */}
          <filter id={`shadow-${id}`} x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#00000030" />
          </filter>
        </defs>

        {/* Body (behind head) */}
        <Body
          shirt={design.shirt}
          shirtAccent={design.shirtAccent}
          skin={design.skin}
          trait={design.trait}
        />

        {/* Back hair layer (for some styles) */}
        {design.trait === "wavy-bow" && (
          <g>
            {/* Hair behind ears for wavy style */}
            <path
              d="M 20 34 Q 16 42 18 54 Q 20 58 16 62"
              fill="none" stroke={design.hair} strokeWidth="7" strokeLinecap="round"
            />
            <path
              d="M 78 34 Q 82 42 80 54 Q 78 58 82 62"
              fill="none" stroke={design.hair} strokeWidth="7" strokeLinecap="round"
            />
          </g>
        )}

        {/* Ears (behind face) */}
        <Ears skin={design.skin} skinShadow={design.skinShadow} />

        {/* Head / face shape - big Pixar style */}
        <ellipse
          cx="49"
          cy="46"
          rx="26"
          ry="27"
          fill={design.skin}
        />
        {/* Face shadow on lower half */}
        <ellipse
          cx="49"
          cy="56"
          rx="20"
          ry="14"
          fill={design.skinShadow}
          opacity="0.15"
        />

        {/* Hair */}
        <HairComponent hair={design.hair} highlight={design.hairHighlight} />

        {/* Eyebrows */}
        <Eyebrows mood={mood} browStyle={design.browStyle} hair={design.hair} />

        {/* Eyes */}
        <Eyes mood={mood} irisColor={design.irisColor} isGirl={design.isGirl} />

        {/* Glasses for character 3 */}
        {design.trait === "space-buns" && <Glasses />}

        {/* Nose */}
        <Nose skin={design.skinShadow} />

        {/* Mouth */}
        <Mouth mood={mood} />

        {/* Blush circles on cheeks */}
        <circle cx="30" cy="53" r="4" fill={design.blush} opacity="0.35" />
        <circle cx="68" cy="53" r="4" fill={design.blush} opacity="0.35" />

        {/* Highlight shimmer on forehead */}
        <ellipse cx="44" cy="34" rx="6" ry="3" fill="white" opacity="0.08" />
      </svg>
    </button>
  );
}
