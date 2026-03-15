// =============================================================================
// LESSONDATA.TS — THE FRACTION KINGDOM: AN EPIC QUEST
// Attempt 6 · Creative Direction: Fantasy RPG Adventure Quest
// =============================================================================
// Narrative arc:
//   Act I   — The Call to Adventure (peaceful village, 4÷2 warm-up)
//   Act II  — The Riddle of the Odd Cookie (5÷2, leftover crisis)
//   Act III — The Fraction Revelation (symbolic bridge, 1/2 unlocked)
//   Act IV  — The Great Hall of Four (5÷4, escalating challenge)
//   Finale  — The Fraction Kingdom Restored (triumphant closing)
// =============================================================================

export type StepType =
  | "narrate"           // Tutor speaks, continue button
  | "choice"            // Multiple choice buttons
  | "distribute"        // Kid distributes cookies to characters
  | "slice"             // Kid clicks cookie to slice
  | "distribute-halves" // Kid distributes halves
  | "show-number"       // Big number display
  | "show-fraction"     // Big fraction display

export type TutorEmotion =
  | "neutral"
  | "excited"
  | "curious"
  | "proud"
  | "dramatic"
  | "conspiratorial"
  | "triumphant"
  | "worried"
  | "playful"

export interface Choice {
  label: string;
  next: string;
  correct?: boolean;
}

export interface LessonStep {
  id: string;
  type: StepType;
  tutorText?: string;
  taskHeader?: string;
  choices?: Choice[];
  next?: string;
  cookieCount?: number;
  characterCount?: number;
  expectedPerPerson?: number;
  showNumber?: string;
  showFractionNum?: number;
  showFractionDen?: number;
  wholeNumber?: number;
  allowKnife?: boolean;
  /** Sound effect key to fire when this step loads */
  sfx?: string;
  /** Tutor portrait emotion state */
  tutorEmotion?: TutorEmotion;
}

// =============================================================================
export const lessonSteps: Record<string, LessonStep> = {

  // ===========================================================================
  // ACT I — THE CALL TO ADVENTURE
  // The hero is introduced. The Fraction Kingdom is peaceful... for now.
  // ===========================================================================

  "prologue": {
    id: "prologue",
    type: "narrate",
    tutorText: "Long ago, in the mystical Fraction Kingdom, a great feast was prepared. But the royal baker baked a STRANGE number of cookies... and only a true hero can share them fairly. That hero... is YOU.",
    next: "hero-rises",
    sfx: "quest-horn",
    tutorEmotion: "dramatic",
  },

  "hero-rises": {
    id: "hero-rises",
    type: "narrate",
    tutorText: "I am Zara, your guide on this quest. I've trained a thousand young adventurers... but I have a feeling YOU might be the greatest of all. Ready your wits, brave one. Our first trial awaits!",
    next: "act1-approach",
    sfx: "footsteps",
    tutorEmotion: "excited",
  },

  "act1-approach": {
    id: "act1-approach",
    type: "narrate",
    tutorText: "We approach the Village of Beginnings. Two hungry villagers wait at the feast table. The baker has left FOUR cookies. Your quest: share them so each villager gets exactly the same amount. Not one crumb more, not one crumb less!",
    next: "start",
    sfx: "footsteps",
    tutorEmotion: "conspiratorial",
  },

  // --- Trial 1: 4 cookies, 2 people ---
  "start": {
    id: "start",
    type: "distribute",
    taskHeader: "Trial I: Share 4 cookies between 2 villagers!",
    tutorText: "Drag the cookies to each villager. Every hero starts here — and every hero succeeds. You've got this!",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "result-4-2",
    sfx: "footsteps",
    tutorEmotion: "neutral",
  },

  "result-4-2": {
    id: "result-4-2",
    type: "show-number",
    tutorText: "The ancient scales glow GREEN! Four cookies, two villagers — two cookies each. PERFECTLY balanced! The village elder nods with approval. You are worthy of the next trial.",
    showNumber: "2",
    next: "act2-travel",
    sfx: "magic-sparkle",
    tutorEmotion: "proud",
  },

  // ===========================================================================
  // ACT II — THE RIDDLE OF THE ODD COOKIE
  // The hero encounters the first real obstacle: a leftover cookie.
  // Tension rises. The Fraction Kingdom's fate hangs in the balance.
  // ===========================================================================

  "act2-travel": {
    id: "act2-travel",
    type: "narrate",
    tutorText: "The path winds deeper into the kingdom. Storm clouds gather. The torches flicker. Ahead lies the Crossroads of Conflict — where TWO hungry travelers guard the bridge... and there are FIVE cookies.",
    next: "act2-foreshadow",
    sfx: "rumble",
    tutorEmotion: "dramatic",
  },

  "act2-foreshadow": {
    id: "act2-foreshadow",
    type: "narrate",
    tutorText: "Five cookies. Two travelers. Something doesn't add up... Literally. But YOU are a hero of the Fraction Kingdom. Face this riddle — and the bridge shall open!",
    next: "intro-5-2",
    sfx: "quest-horn",
    tutorEmotion: "excited",
  },

  // --- Trial 2: 5 cookies, 2 people ---
  "intro-5-2": {
    id: "intro-5-2",
    type: "distribute",
    taskHeader: "Trial II: Share 5 cookies between 2 travelers!",
    tutorText: "Give each traveler as many WHOLE cookies as you can — equally! Be careful... something strange may happen.",
    cookieCount: 5,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "leftover-discovery",
    sfx: "footsteps",
    tutorEmotion: "curious",
  },

  "leftover-discovery": {
    id: "leftover-discovery",
    type: "narrate",
    tutorText: "The ground trembles beneath your feet. Both travelers have two cookies each — but a LONE cookie remains on the stone altar! The bridge groans. The travelers stare. What will you do, hero?",
    next: "leftover",
    sfx: "rumble",
    tutorEmotion: "dramatic",
  },

  "leftover": {
    id: "leftover",
    type: "choice",
    tutorText: "The final cookie sits there, daring you. The Fraction Kingdom demands FAIRNESS. What is your decision, brave adventurer?",
    tutorEmotion: "curious",
    choices: [
      { label: "Slice it in half — share it equally!", next: "slice-cookie", correct: true },
      { label: "Toss it to the kingdom's dragon!", next: "dragon-response" },
      { label: "Bury it as a secret treasure...", next: "treasure-response" },
    ],
  },

  "dragon-response": {
    id: "dragon-response",
    type: "narrate",
    tutorText: "ROOOAR! The dragon does appreciate your generosity... but the travelers cry out in disappointment! A true hero of the Fraction Kingdom leaves no adventurer hungry. Try again, brave one!",
    next: "leftover",
    sfx: "rumble",
    tutorEmotion: "playful",
  },

  "treasure-response": {
    id: "treasure-response",
    type: "narrate",
    tutorText: "A secret cookie treasure? An interesting strategy... but the Fraction Kingdom's ancient law is clear: ALL must be shared FAIRLY. The travelers look at you with puppy-dog eyes. Give it another try!",
    next: "leftover",
    sfx: "rumble",
    tutorEmotion: "playful",
  },

  "slice-cookie": {
    id: "slice-cookie",
    type: "narrate",
    tutorText: "BRILLIANT! You draw your blade — for justice, for fairness, for the Fraction Kingdom! The cookie must be divided. Every great hero knows: when things don't split evenly, you CUT!",
    next: "do-slice",
    sfx: "sword-whoosh",
    tutorEmotion: "excited",
  },

  "do-slice": {
    id: "do-slice",
    type: "slice",
    tutorText: "Strike the cookie! Tap it to slice it straight down the middle — two perfect halves!",
    next: "post-slice",
    sfx: "sword-whoosh",
    tutorEmotion: "excited",
  },

  "post-slice": {
    id: "post-slice",
    type: "narrate",
    tutorText: "The cookie cleaves in two! A beam of golden light shoots into the sky! The travelers gasp. Two equal halves — one for each! Now deliver them, hero!",
    next: "distribute-halves",
    sfx: "magic-sparkle",
    tutorEmotion: "triumphant",
  },

  "distribute-halves": {
    id: "distribute-halves",
    type: "distribute-halves",
    tutorText: "Place each half with its rightful traveler. Complete the sacred share!",
    characterCount: 2,
    next: "how-many-each",
    sfx: "footsteps",
    tutorEmotion: "neutral",
  },

  "how-many-each": {
    id: "how-many-each",
    type: "choice",
    tutorText: "The bridge shimmers with magic! To cross, you must answer: how many cookies did EACH traveler receive? Speak truly, hero — the bridge can detect a lie!",
    tutorEmotion: "dramatic",
    choices: [
      { label: "Two whole cookies", next: "wrong-two" },
      { label: "Two and a half cookies", next: "correct-two-half", correct: true },
      { label: "One hundred and twelve cookies", next: "wrong-huge" },
    ],
  },

  "wrong-two": {
    id: "wrong-two",
    type: "narrate",
    tutorText: "The bridge trembles and HOLDS — barely! Two whole cookies, yes... but your blade struck true and gave each traveler something MORE. Look again — a half cookie rests with each one!",
    next: "how-many-each",
    sfx: "rumble",
    tutorEmotion: "worried",
  },

  "wrong-huge": {
    id: "wrong-huge",
    type: "narrate",
    tutorText: "A hundred and twelve?! The bridge shakes with laughter! Even the dragon thinks that's a lot of cookies. Look carefully at each traveler's bounty: whole cookies PLUS the half you delivered!",
    next: "how-many-each",
    sfx: "rumble",
    tutorEmotion: "playful",
  },

  "correct-two-half": {
    id: "correct-two-half",
    type: "show-number",
    tutorText: "THE BRIDGE OPENS! Two and a half cookies each — the ancient scales ring with truth! The travelers cheer, the torches blaze bright, and the path ahead is revealed!",
    showNumber: "2½",
    next: "act3-intro",
    sfx: "stone-grind",
    tutorEmotion: "triumphant",
  },

  // ===========================================================================
  // ACT III — THE FRACTION REVELATION
  // The hero discovers the written language of fractions.
  // A mystical scribe appears. The symbolic world unlocks.
  // ===========================================================================

  "act3-intro": {
    id: "act3-intro",
    type: "narrate",
    tutorText: "Beyond the bridge lies the Tower of Symbols — where the ancient scribes of the Fraction Kingdom recorded their knowledge. A mysterious glowing door stands before you... can you decode its secrets?",
    next: "explain-whole",
    sfx: "stone-grind",
    tutorEmotion: "dramatic",
  },

  "explain-whole": {
    id: "explain-whole",
    type: "narrate",
    tutorText: "The scribe's ghost appears! She says: 'Young hero, writing TWO whole cookies is simple — we use the number 2. That part, even the dungeon goblins can manage.'",
    next: "but-half",
    sfx: "magic-sparkle",
    tutorEmotion: "conspiratorial",
  },

  "but-half": {
    id: "but-half",
    type: "narrate",
    tutorText: "'BUT!' the ghost scribe cries, swirling dramatically. 'How do we WRITE that half cookie? A half is not a whole number. It needs a special kind of magic symbol... a FRACTION!'",
    next: "know-fraction",
    sfx: "rumble",
    tutorEmotion: "dramatic",
  },

  "know-fraction": {
    id: "know-fraction",
    type: "choice",
    tutorText: "The glowing door pulses! It asks: do you already know how to write one half as a number? Answer, and the tower's secrets shall be revealed!",
    tutorEmotion: "curious",
    choices: [
      { label: "I know this ancient symbol!", next: "show-half-fraction" },
      { label: "Teach me, wise ghost scribe!", next: "show-half-fraction" },
      { label: "Ask the dungeon goblins instead...", next: "goblin-response" },
    ],
  },

  "goblin-response": {
    id: "goblin-response",
    type: "narrate",
    tutorText: "The goblins grunt and shrug and eat rocks. Not the sharpest swords in the armory, those goblins. Lucky for you, I know the ancient secret! Watch carefully...",
    next: "show-half-fraction",
    sfx: "rumble",
    tutorEmotion: "playful",
  },

  "show-half-fraction": {
    id: "show-half-fraction",
    type: "show-fraction",
    tutorText: "BEHOLD! The sacred fraction! One on top — because we have ONE piece. Two on the bottom — because the cookie was cut into TWO equal parts. This is ONE HALF. The scribe carved it into the tower walls for eternity!",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "fraction-name-reveal",
    sfx: "magic-sparkle",
    tutorEmotion: "triumphant",
  },

  "fraction-name-reveal": {
    id: "fraction-name-reveal",
    type: "choice",
    tutorText: "The tower glows! The ghost scribe whispers: 'When numbers stack like this — top and bottom — we call it a FRACTION. Have you heard this powerful word before, young hero?'",
    tutorEmotion: "conspiratorial",
    choices: [
      { label: "Yes! Fractions are my destiny!", next: "explain-fraction" },
      { label: "I've never heard it... until now!", next: "explain-fraction" },
    ],
  },

  "explain-fraction": {
    id: "explain-fraction",
    type: "narrate",
    tutorText: "A FRACTION is how heroes write parts of a whole! Two counts WHOLE cookies. But one-half — with its top number and bottom number — counts the PIECE we cut. Together: two and one-half. The language of the Fraction Kingdom is yours!",
    next: "each-got",
    sfx: "magic-sparkle",
    tutorEmotion: "excited",
  },

  "each-got": {
    id: "each-got",
    type: "show-fraction",
    tutorText: "Engrave this in your memory, hero! Each traveler at the bridge received: TWO AND ONE-HALF cookies. Written in the ancient tongue of fractions — like THIS!",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "act4-herald",
    sfx: "magic-sparkle",
    tutorEmotion: "proud",
  },

  // ===========================================================================
  // ACT IV — THE GREAT HALL OF FOUR
  // The hardest challenge yet: 5 cookies, 4 hungry champions.
  // The dungeon boss of this quest: the quarter fraction.
  // ===========================================================================

  "act4-herald": {
    id: "act4-herald",
    type: "narrate",
    tutorText: "A herald's horn echoes through the stone corridors! BOOM BOOM BOOM! You have reached the GREAT HALL OF FOUR — the final trial before the Fraction Kingdom is saved! Four legendary champions sit at the feast table... and there are five cookies.",
    next: "act4-dramatic-pause",
    sfx: "quest-horn",
    tutorEmotion: "dramatic",
  },

  "act4-dramatic-pause": {
    id: "act4-dramatic-pause",
    type: "narrate",
    tutorText: "Five cookies. FOUR champions. The ancient Fraction Dragon stirs in his lair. If you fail to share fairly, the Fraction Kingdom will fall into chaos FOREVER. But if you succeed... glory beyond measure awaits.",
    next: "act4-strategy",
    sfx: "rumble",
    tutorEmotion: "worried",
  },

  "act4-strategy": {
    id: "act4-strategy",
    type: "narrate",
    tutorText: "Fear not — your blade is sharp and your mind is sharper! The knife is available: use it wisely. Give everyone a whole cookie first, then think carefully about what to do with the leftovers. YOU CAN DO THIS!",
    next: "intro-5-4",
    sfx: "sword-whoosh",
    tutorEmotion: "excited",
  },

  // --- Trial 3: 5 cookies, 4 people ---
  "intro-5-4": {
    id: "intro-5-4",
    type: "distribute",
    taskHeader: "FINAL TRIAL: Share 5 cookies between 4 champions!",
    tutorText: "The fate of the Fraction Kingdom rests in your hands! Drag cookies to each champion — use the knife when you need to. Every piece must be equal. Go, hero!",
    cookieCount: 5,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "result-5-4-check",
    sfx: "footsteps",
    tutorEmotion: "neutral",
  },

  "result-5-4-check": {
    id: "result-5-4-check",
    type: "choice",
    tutorText: "The champions look at their plates. The Fraction Dragon watches with one enormous golden eye. The hall falls SILENT. Hero — how much did each champion receive?",
    tutorEmotion: "dramatic",
    choices: [
      { label: "One whole cookie", next: "wrong-one-54" },
      { label: "One and a quarter cookies", next: "correct-one-quarter", correct: true },
      { label: "I need to recount... it's a lot of pieces!", next: "lost-count-response" },
    ],
  },

  "wrong-one-54": {
    id: "wrong-one-54",
    type: "narrate",
    tutorText: "The Dragon rumbles ominously! One whole cookie — YES, that much is true! But look again at each champion's plate: something small sits beside that whole cookie. A piece! What IS that piece, brave one?",
    next: "result-5-4-check",
    sfx: "rumble",
    tutorEmotion: "worried",
  },

  "lost-count-response": {
    id: "lost-count-response",
    type: "narrate",
    tutorText: "The Dragon's eye narrows — but even he appreciates honesty! Look at ONE champion's plate. They got one whole cookie... AND a slice from the extra cookie. That extra cookie was cut into four equal pieces. So what's the piece called?",
    next: "result-5-4-check",
    sfx: "rumble",
    tutorEmotion: "conspiratorial",
  },

  "correct-one-quarter": {
    id: "correct-one-quarter",
    type: "show-fraction",
    tutorText: "THE FRACTION DRAGON BOWS HIS HEAD! One and a quarter — ONE on top, FOUR on the bottom, because we cut that last cookie into FOUR equal pieces! Each champion got ONE of those four pieces. The fraction is ONE-QUARTER!",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 4,
    next: "dragon-yields",
    sfx: "stone-grind",
    tutorEmotion: "triumphant",
  },

  "dragon-yields": {
    id: "dragon-yields",
    type: "narrate",
    tutorText: "With a ground-shaking RUMBLE, the ancient Fraction Dragon lowers his great head and speaks: 'You have solved the riddle of the quarters. The Fraction Kingdom... is SAVED.'",
    next: "chest-reveal",
    sfx: "rumble",
    tutorEmotion: "dramatic",
  },

  "chest-reveal": {
    id: "chest-reveal",
    type: "narrate",
    tutorText: "A golden chest at the center of the Great Hall BURSTS open! Inside: the Crown of Fraction Knowledge — and it's floating toward you! The champions cheer! The hall fills with light!",
    next: "lesson-complete",
    sfx: "chest-open",
    tutorEmotion: "triumphant",
  },

  // ===========================================================================
  // FINALE — THE FRACTION KINGDOM RESTORED
  // ===========================================================================

  "lesson-complete": {
    id: "lesson-complete",
    type: "narrate",
    tutorText: "HERO! You have completed the Quest of the Fraction Kingdom! You shared cookies with WHOLE numbers when things split evenly. You discovered FRACTIONS when they didn't. You wielded the blade of fairness... and you NEVER gave up. The kingdom is at peace!",
    next: "done",
    sfx: "victory-fanfare",
    tutorEmotion: "triumphant",
  },

  "done": {
    id: "done",
    type: "narrate",
    tutorText: "From this day forward, you are a FRACTION CHAMPION of the highest order! The ancient scribes are already writing songs about you. Whenever cookies don't split evenly — or ANYTHING doesn't — you know exactly what to do. Go forth, hero. The kingdom is yours!",
    next: "end",
    sfx: "victory-fanfare",
    tutorEmotion: "triumphant",
  },
};
