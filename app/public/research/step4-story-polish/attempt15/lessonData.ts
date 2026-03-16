// lessonData.ts — "Cozy Kitchen Baking" (Fraction Equivalence)
// Friendly animal characters are baking in a warm kitchen together.
// The lesson teaches that fractions can look different but represent
// the same amount (1/2 = 2/4, 2/4 = 4/8).

export type StepType =
  | "narrate"           // Tutor speaks, continue button
  | "choice"            // Multiple choice buttons
  | "distribute"        // Kid distributes items to characters
  | "slice"             // Kid clicks item to slice
  | "distribute-halves" // Kid distributes halves
  | "show-number"       // Big number display
  | "show-fraction"     // Big fraction display

export interface Choice {
  label: string;
  next: string; // step id to go to
  correct?: boolean;
}

export interface LessonStep {
  id: string;
  type: StepType;
  tutorText?: string;
  taskHeader?: string;
  choices?: Choice[];
  next?: string;         // for narrate / distribute / show-* steps
  cookieCount?: number;
  characterCount?: number;
  expectedPerPerson?: number;
  showNumber?: string;   // e.g. "2" or "2½"
  showFractionNum?: number;
  showFractionDen?: number;
  wholeNumber?: number;
  allowKnife?: boolean;
  sfx?: string;
}

// ---------------------------------------------------------------------------
// The lesson — 42 steps across 3 stages + finale
// ---------------------------------------------------------------------------
//
// Stage 1 — Review halves:     What is 1/2? Cut a brownie in half.
// Stage 2 — Discovery:         Cut the SAME brownie into 4 pieces → 1/2 = 2/4
// Stage 3 — Practice:          One more equivalence → 2/4 = 4/8
// Finale  — Celebrate
//
// SFX palette:
//   chime        — correct answer, moment of insight
//   harp-gliss   — transitions, reveals
//   warm-pad     — opening / title moments
//   soft-bell    — item placement
//   xylophone    — small wins, placements
//   music-box    — celebration
//   gentle-whoosh — page transitions
//   sparkle      — fraction reveal
// ---------------------------------------------------------------------------

export const lessonSteps: Record<string, LessonStep> = {

  // ===========================================================================
  // STAGE 1 — Review: What are halves? Cut a brownie in half.
  // ===========================================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText:
      "Welcome to the Cozy Kitchen! Today, Olive the Otter and Benny the Bear "
      + "are baking brownies together. The kitchen smells like warm chocolate, "
      + "and the brownies just came out of the oven. Yum!",
    next: "kitchen-intro-2",
    sfx: "warm-pad",
  },

  "kitchen-intro-2": {
    id: "kitchen-intro-2",
    type: "narrate",
    tutorText:
      "Olive slides a big, beautiful brownie onto the cutting board. "
      + "She and Benny both want to eat it, but there's only one brownie. "
      + "They need to share it fairly!",
    next: "s1-share-question",
    sfx: "harp-gliss",
  },

  "s1-share-question": {
    id: "s1-share-question",
    type: "choice",
    tutorText:
      "One brownie, two hungry friends. "
      + "What should Olive and Benny do to share it fairly?",
    choices: [
      { label: "Cut it in half so each friend gets an equal piece.", next: "s1-do-slice", correct: true },
      { label: "Give the whole brownie to Benny.", next: "s1-wrong-benny" },
      { label: "Put it back in the oven.", next: "s1-wrong-oven" },
    ],
  },

  "s1-wrong-benny": {
    id: "s1-wrong-benny",
    type: "narrate",
    tutorText:
      "Benny would love that, but poor Olive would be left without any brownie! "
      + "Sharing means everyone gets the same amount. "
      + "What if we cut the brownie into two equal pieces?",
    next: "s1-share-question",
    sfx: "gentle-whoosh",
  },

  "s1-wrong-oven": {
    id: "s1-wrong-oven",
    type: "narrate",
    tutorText:
      "Ha! It's already perfectly baked. Putting it back would burn it! "
      + "Our friends just need a way to split it into two equal pieces "
      + "so they each get the same amount. What could we do?",
    next: "s1-share-question",
    sfx: "gentle-whoosh",
  },

  "s1-do-slice": {
    id: "s1-do-slice",
    type: "slice",
    tutorText:
      "Great idea! Tap the brownie to cut it right down the middle. "
      + "Nice and even, just like Olive would do it.",
    next: "s1-post-slice",
    sfx: "gentle-whoosh",
  },

  "s1-post-slice": {
    id: "s1-post-slice",
    type: "narrate",
    tutorText:
      "Perfect cut! Now we have two equal pieces. "
      + "When you cut something into 2 equal parts, "
      + "each part is called one half.",
    next: "s1-distribute-halves",
    sfx: "chime",
  },

  "s1-distribute-halves": {
    id: "s1-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Give one half to Olive and one half to Benny. "
      + "Fair and square!",
    characterCount: 2,
    next: "s1-fraction-intro",
    sfx: "xylophone",
  },

  "s1-fraction-intro": {
    id: "s1-fraction-intro",
    type: "narrate",
    tutorText:
      "Each friend got one half of the brownie. "
      + "In math, we can write \"one half\" as a fraction. "
      + "Let me show you what it looks like!",
    next: "s1-show-fraction",
    sfx: "harp-gliss",
  },

  "s1-show-fraction": {
    id: "s1-show-fraction",
    type: "show-fraction",
    tutorText:
      "Here it is: one-half! The bottom number, 2, tells us we cut the brownie "
      + "into 2 equal pieces. The top number, 1, tells us each friend "
      + "got 1 of those pieces.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s1-check-understanding",
    sfx: "sparkle",
  },

  "s1-check-understanding": {
    id: "s1-check-understanding",
    type: "choice",
    tutorText:
      "Quick check! If a brownie is cut into 2 equal pieces, "
      + "and you take 1 piece, what fraction do you have?",
    choices: [
      { label: "One-half", next: "s1-correct-check", correct: true },
      { label: "One-quarter", next: "s1-wrong-quarter" },
      { label: "Two", next: "s1-wrong-two" },
    ],
  },

  "s1-wrong-quarter": {
    id: "s1-wrong-quarter",
    type: "narrate",
    tutorText:
      "Almost! A quarter means something is cut into 4 pieces. "
      + "But our brownie was cut into just 2 pieces. "
      + "When you take 1 piece out of 2, that's one... what?",
    next: "s1-check-understanding",
    sfx: "gentle-whoosh",
  },

  "s1-wrong-two": {
    id: "s1-wrong-two",
    type: "narrate",
    tutorText:
      "Not quite! 2 is the number of pieces we cut the brownie into. "
      + "But the fraction is about how much you have. "
      + "You have 1 piece out of 2. That's called one-half!",
    next: "s1-check-understanding",
    sfx: "gentle-whoosh",
  },

  "s1-correct-check": {
    id: "s1-correct-check",
    type: "narrate",
    tutorText:
      "That's right! One-half. You really know your halves! "
      + "Olive and Benny are happily munching. But wait... "
      + "there's a second brownie cooling on the rack, "
      + "and this time, more friends are coming to the kitchen!",
    next: "s2-intro",
    sfx: "chime",
  },

  // ===========================================================================
  // STAGE 2 — Discovery: 1/2 = 2/4 (same brownie, more pieces)
  // ===========================================================================

  "s2-intro": {
    id: "s2-intro",
    type: "narrate",
    tutorText:
      "Maple the Mouse and Fern the Fox just scampered into the kitchen! "
      + "Now there are 4 friends who want to share the next brownie. "
      + "But Olive has an idea...",
    next: "s2-olive-idea",
    sfx: "harp-gliss",
  },

  "s2-olive-idea": {
    id: "s2-olive-idea",
    type: "narrate",
    tutorText:
      "\"Wait,\" says Olive. \"Before we share with everyone, "
      + "let me show you something cool. First, let's cut this brownie in half, "
      + "just like before.\"",
    next: "s2-first-slice",
    sfx: "gentle-whoosh",
  },

  "s2-first-slice": {
    id: "s2-first-slice",
    type: "slice",
    tutorText:
      "Tap the brownie to cut it in half. "
      + "Two equal pieces, just like the first brownie!",
    next: "s2-show-half",
    sfx: "gentle-whoosh",
  },

  "s2-show-half": {
    id: "s2-show-half",
    type: "show-fraction",
    tutorText:
      "There it is again: one-half. Each piece is one-half of the brownie. "
      + "But now Olive picks up one of those halves and says, "
      + "\"What if I cut THIS piece in half too?\"",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s2-cut-question",
    sfx: "sparkle",
  },

  "s2-cut-question": {
    id: "s2-cut-question",
    type: "choice",
    tutorText:
      "Olive wants to cut each half of the brownie in half again. "
      + "If the brownie is already in 2 pieces and we cut each piece in half, "
      + "how many pieces will we have?",
    choices: [
      { label: "4 pieces", next: "s2-do-quarter-slice", correct: true },
      { label: "3 pieces", next: "s2-wrong-three" },
      { label: "2 pieces", next: "s2-wrong-still-two" },
    ],
  },

  "s2-wrong-three": {
    id: "s2-wrong-three",
    type: "narrate",
    tutorText:
      "Hmm, not quite! We have 2 halves, and we're cutting each one in half. "
      + "One half becomes 2 pieces. The other half becomes 2 pieces. "
      + "2 plus 2 equals...?",
    next: "s2-cut-question",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-still-two": {
    id: "s2-wrong-still-two",
    type: "narrate",
    tutorText:
      "If we cut each half in half, we're making MORE pieces, not the same number! "
      + "Each of the 2 halves becomes 2 smaller pieces. "
      + "So the total is 2 plus 2. How many is that?",
    next: "s2-cut-question",
    sfx: "gentle-whoosh",
  },

  "s2-do-quarter-slice": {
    id: "s2-do-quarter-slice",
    type: "slice",
    tutorText:
      "Exactly! Tap to cut each half in half. "
      + "Now the brownie will be in 4 equal pieces!",
    next: "s2-post-quarter-slice",
    sfx: "gentle-whoosh",
  },

  "s2-post-quarter-slice": {
    id: "s2-post-quarter-slice",
    type: "narrate",
    tutorText:
      "Beautiful! The brownie is now in 4 equal pieces. "
      + "Each little piece is called one-quarter, or one-fourth. "
      + "But here's where it gets really interesting...",
    next: "s2-magic-moment",
    sfx: "chime",
  },

  "s2-magic-moment": {
    id: "s2-magic-moment",
    type: "narrate",
    tutorText:
      "Olive points at the brownie. \"Look! See where the first cut was? "
      + "2 of these 4 pieces are on this side, and 2 are on that side. "
      + "The first cut split the brownie exactly in half. "
      + "So 2 out of 4 pieces is the SAME as one-half!\"",
    next: "s2-show-equivalence",
    sfx: "harp-gliss",
  },

  "s2-show-equivalence": {
    id: "s2-show-equivalence",
    type: "show-fraction",
    tutorText:
      "Look at this fraction: two-fourths! 2 pieces out of 4 total pieces. "
      + "It covers the exact same amount of brownie as one-half. "
      + "Two-fourths equals one-half!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "s2-equiv-check",
    sfx: "sparkle",
  },

  "s2-equiv-check": {
    id: "s2-equiv-check",
    type: "choice",
    tutorText:
      "Olive's discovery: the brownie didn't change size. We just cut it into "
      + "more pieces! So one-half and two-fourths are the same amount. "
      + "Which of these is true?",
    choices: [
      { label: "1/2 and 2/4 are equal — same amount of brownie!", next: "s2-equiv-correct", correct: true },
      { label: "2/4 is bigger because 4 is bigger than 2.", next: "s2-wrong-bigger" },
      { label: "2/4 is smaller because the pieces are smaller.", next: "s2-wrong-smaller" },
    ],
  },

  "s2-wrong-bigger": {
    id: "s2-wrong-bigger",
    type: "narrate",
    tutorText:
      "I can see why you might think that! The numbers are bigger. "
      + "But remember: we didn't add any brownie. We just made more cuts. "
      + "The pieces got smaller, but we have more of them. "
      + "2 small pieces out of 4 covers the exact same area as 1 big piece out of 2!",
    next: "s2-equiv-check",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-smaller": {
    id: "s2-wrong-smaller",
    type: "narrate",
    tutorText:
      "You're right that each piece is smaller! But we have MORE of them. "
      + "1 piece out of 2 is the same amount of brownie as 2 pieces out of 4. "
      + "The brownie didn't shrink or grow — we just sliced it differently. "
      + "They cover the same amount!",
    next: "s2-equiv-check",
    sfx: "gentle-whoosh",
  },

  "s2-equiv-correct": {
    id: "s2-equiv-correct",
    type: "narrate",
    tutorText:
      "Yes! Benny's eyes go wide. \"So fractions can LOOK different "
      + "but mean the SAME thing?\" Olive nods. \"These are called "
      + "equivalent fractions. They're just different ways to write "
      + "the same amount!\"",
    next: "s2-share-quarters",
    sfx: "chime",
  },

  "s2-share-quarters": {
    id: "s2-share-quarters",
    type: "distribute-halves",
    tutorText:
      "Now let's share! Give each of the 4 friends one quarter of the brownie. "
      + "One piece for Olive, one for Benny, one for Maple, one for Fern!",
    characterCount: 4,
    next: "s2-celebrate",
    sfx: "xylophone",
  },

  "s2-celebrate": {
    id: "s2-celebrate",
    type: "narrate",
    tutorText:
      "Everyone got a fair piece! And now you know something amazing: "
      + "one-half and two-fourths are the same amount, just written differently. "
      + "It's like how \"twelve\" and \"a dozen\" mean the same thing! "
      + "But the baking isn't over yet...",
    next: "s3-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 3 — Practice: 2/4 = 4/8 (one more equivalence)
  // ===========================================================================

  "s3-intro": {
    id: "s3-intro",
    type: "narrate",
    tutorText:
      "Olive pulls a tray of cookies out of the oven. "
      + "\"I made one big cookie for all of us to share! "
      + "But this time, even MORE friends are coming!\" "
      + "Four more little mice peek through the kitchen window!",
    next: "s3-setup",
    sfx: "harp-gliss",
  },

  "s3-setup": {
    id: "s3-setup",
    type: "narrate",
    tutorText:
      "Now there are 8 friends who want cookie. "
      + "\"Don't worry,\" says Olive. \"I know just what to do. "
      + "First, let me cut this cookie into 4 equal pieces.\"",
    next: "s3-first-cut",
    sfx: "gentle-whoosh",
  },

  "s3-first-cut": {
    id: "s3-first-cut",
    type: "slice",
    tutorText:
      "Tap the cookie to cut it into 4 equal pieces. "
      + "One cross-shaped cut, just like slicing a pizza!",
    next: "s3-show-quarters",
    sfx: "gentle-whoosh",
  },

  "s3-show-quarters": {
    id: "s3-show-quarters",
    type: "narrate",
    tutorText:
      "4 equal pieces! Olive picks up 2 of them. "
      + "\"Look, 2 out of 4 pieces is the same as one-half of the cookie. "
      + "We already know that! But now I need to share these pieces "
      + "with 8 friends, not 4...\"",
    next: "s3-show-two-fourths",
    sfx: "chime",
  },

  "s3-show-two-fourths": {
    id: "s3-show-two-fourths",
    type: "show-fraction",
    tutorText:
      "Right now we have 2 pieces out of 4. That's two-fourths. "
      + "But we need smaller pieces so everyone gets a share. "
      + "What if we cut each quarter in half?",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "s3-predict",
    sfx: "sparkle",
  },

  "s3-predict": {
    id: "s3-predict",
    type: "choice",
    tutorText:
      "If we cut each of the 4 pieces in half, "
      + "how many pieces will the cookie have in total?",
    choices: [
      { label: "8 pieces", next: "s3-second-cut", correct: true },
      { label: "6 pieces", next: "s3-wrong-six" },
      { label: "4 pieces", next: "s3-wrong-four" },
    ],
  },

  "s3-wrong-six": {
    id: "s3-wrong-six",
    type: "narrate",
    tutorText:
      "Not quite! Let's count carefully. We have 4 pieces, and each one "
      + "gets cut in half. That means each piece becomes 2 smaller pieces. "
      + "4 times 2 equals...?",
    next: "s3-predict",
    sfx: "gentle-whoosh",
  },

  "s3-wrong-four": {
    id: "s3-wrong-four",
    type: "narrate",
    tutorText:
      "We already have 4 pieces, and we're cutting each one in half. "
      + "That will make MORE pieces! Each of the 4 pieces becomes 2 pieces. "
      + "So 4 times 2 gives us how many?",
    next: "s3-predict",
    sfx: "gentle-whoosh",
  },

  "s3-second-cut": {
    id: "s3-second-cut",
    type: "slice",
    tutorText:
      "Right! Tap to cut each quarter in half. "
      + "The cookie will be in 8 tiny, equal pieces!",
    next: "s3-post-cut",
    sfx: "gentle-whoosh",
  },

  "s3-post-cut": {
    id: "s3-post-cut",
    type: "narrate",
    tutorText:
      "8 equal pieces! Each one is called one-eighth. "
      + "Now Benny is curious. \"Before, 2 out of 4 pieces was half the cookie. "
      + "How many of these tiny eighths make up the same half?\"",
    next: "s3-equiv-question",
    sfx: "chime",
  },

  "s3-equiv-question": {
    id: "s3-equiv-question",
    type: "choice",
    tutorText:
      "Look at the cookie. The cut that split it in half is still there. "
      + "How many of the 8 tiny pieces are on one side of that half-line?",
    choices: [
      { label: "4 pieces", next: "s3-equiv-reveal", correct: true },
      { label: "2 pieces", next: "s3-wrong-two-pieces" },
      { label: "3 pieces", next: "s3-wrong-three-pieces" },
    ],
  },

  "s3-wrong-two-pieces": {
    id: "s3-wrong-two-pieces",
    type: "narrate",
    tutorText:
      "2 pieces was the answer when we had 4 pieces total. "
      + "But now we have 8 pieces! Look at one side of the cookie. "
      + "Each of the 2 old quarters got cut in half, so each became 2 little pieces. "
      + "That's 2 plus 2 on one side. How many is that?",
    next: "s3-equiv-question",
    sfx: "gentle-whoosh",
  },

  "s3-wrong-three-pieces": {
    id: "s3-wrong-three-pieces",
    type: "narrate",
    tutorText:
      "Close! Let's look carefully. One side of the cookie used to have "
      + "2 quarter-pieces. We cut each quarter in half. "
      + "So 2 quarters became 4 eighths. Count them on one side!",
    next: "s3-equiv-question",
    sfx: "gentle-whoosh",
  },

  "s3-equiv-reveal": {
    id: "s3-equiv-reveal",
    type: "show-fraction",
    tutorText:
      "Yes! 4 out of 8 pieces is the same as half the cookie! "
      + "So four-eighths equals two-fourths, which equals one-half. "
      + "They're ALL the same amount, just cut into different numbers of pieces!",
    showFractionNum: 4,
    showFractionDen: 8,
    next: "s3-big-idea",
    sfx: "sparkle",
  },

  "s3-big-idea": {
    id: "s3-big-idea",
    type: "choice",
    tutorText:
      "Maple squeaks excitedly: \"So we can keep cutting into more and more pieces, "
      + "and the fraction LOOKS different, but the amount stays the SAME?\" "
      + "Is Maple right?",
    choices: [
      { label: "Yes! More pieces, same amount. The fractions are equivalent!", next: "s3-big-idea-correct", correct: true },
      { label: "No, more pieces means more food.", next: "s3-big-idea-wrong" },
    ],
  },

  "s3-big-idea-wrong": {
    id: "s3-big-idea-wrong",
    type: "narrate",
    tutorText:
      "I see why that might seem right! But think about it: "
      + "we never added any extra cookie. We just made more cuts. "
      + "More cuts means more pieces, but each piece is smaller. "
      + "The total amount of cookie stays exactly the same!",
    next: "s3-big-idea",
    sfx: "gentle-whoosh",
  },

  "s3-big-idea-correct": {
    id: "s3-big-idea-correct",
    type: "narrate",
    tutorText:
      "That's the big secret of equivalent fractions! "
      + "One-half, two-fourths, and four-eighths are all the same amount. "
      + "The brownie or cookie doesn't change — only the number of pieces does. "
      + "Now let's share this cookie with all 8 friends!",
    next: "s3-distribute-eighths",
    sfx: "chime",
  },

  "s3-distribute-eighths": {
    id: "s3-distribute-eighths",
    type: "distribute-halves",
    tutorText:
      "Give one eighth to each of the 8 friends. "
      + "Everyone gets one tiny, delicious piece!",
    characterCount: 8,
    next: "s3-final-check",
    sfx: "xylophone",
  },

  "s3-final-check": {
    id: "s3-final-check",
    type: "choice",
    tutorText:
      "One last question from Fern the Fox! "
      + "\"If I have 4 out of 8 pieces, is that more, less, or the same "
      + "as someone who has 1 out of 2 pieces?\"",
    choices: [
      { label: "The same! 4/8 = 1/2", next: "finale-intro", correct: true },
      { label: "More, because 4 is more than 1.", next: "s3-final-wrong" },
    ],
  },

  "s3-final-wrong": {
    id: "s3-final-wrong",
    type: "narrate",
    tutorText:
      "The numbers are bigger, but remember: the pieces are smaller too! "
      + "4 tiny eighth-pieces add up to the exact same amount as "
      + "1 big half-piece. It's like having 4 quarters versus 1 dollar bill. "
      + "Same value, just different pieces!",
    next: "s3-final-check",
    sfx: "gentle-whoosh",
  },

  // ===========================================================================
  // FINALE — Celebrate
  // ===========================================================================

  "finale-intro": {
    id: "finale-intro",
    type: "narrate",
    tutorText:
      "You got it! All the animals cheer and clink their milk glasses together. "
      + "Today in the Cozy Kitchen, you discovered something amazing: "
      + "fractions can look completely different but mean the exact same thing.",
    next: "finale-recap",
    sfx: "music-box",
  },

  "finale-recap": {
    id: "finale-recap",
    type: "narrate",
    tutorText:
      "One-half equals two-fourths equals four-eighths. "
      + "We proved it by cutting the same brownie and cookie into "
      + "more and more pieces. The pieces got smaller, but the amount "
      + "stayed exactly the same. That's what equivalent fractions are all about!",
    next: "finale-goodbye",
    sfx: "harp-gliss",
  },

  "finale-goodbye": {
    id: "finale-goodbye",
    type: "narrate",
    tutorText:
      "Olive waves a flour-dusted paw. \"Come back to the Cozy Kitchen anytime! "
      + "There are always more treats to bake and more fraction secrets to discover.\" "
      + "Benny, Maple, and Fern all wave goodbye. Great baking today, chef!",
    next: "quiz-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // QUIZ — Check for Understanding
  // ===========================================================================

  "quiz-intro": {
    id: "quiz-intro",
    type: "narrate",
    tutorText:
      "Great job learning about equivalent fractions! Now let's see how much "
      + "you remember. Sofia has a few puzzles for you...",
    next: "quiz-1-show-a",
    sfx: "music-box",
  },

  // --- Q1: Is 1/2 the same as 2/4? (visual comparison) ---

  "quiz-1-show-a": {
    id: "quiz-1-show-a",
    type: "show-fraction",
    tutorText:
      "Take a look at this fraction: one-half!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "quiz-1-show-b",
    sfx: "sparkle",
  },

  "quiz-1-show-b": {
    id: "quiz-1-show-b",
    type: "show-fraction",
    tutorText:
      "And now look at this one: two-fourths!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "quiz-1-ask",
    sfx: "sparkle",
  },

  "quiz-1-ask": {
    id: "quiz-1-ask",
    type: "choice",
    tutorText: "Is 1/2 the same as 2/4?",
    choices: [
      { label: "Yes, same amount!", next: "quiz-1-correct", correct: true },
      { label: "No, they're different", next: "quiz-1-wrong" },
    ],
    sfx: "xylophone",
  },

  "quiz-1-wrong": {
    id: "quiz-1-wrong",
    type: "narrate",
    tutorText:
      "Remember what we discovered — when we cut each half into two pieces, "
      + "we got 2 out of 4. That's the same amount of brownie!",
    next: "quiz-1-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-1-correct": {
    id: "quiz-1-correct",
    type: "narrate",
    tutorText:
      "That's right! One-half and two-fourths are the exact same amount. "
      + "Sofia gives you a big thumbs up!",
    next: "quiz-2-show",
    sfx: "chime",
  },

  // --- Q2: 1/2 = ?/4 (fill missing) ---

  "quiz-2-show": {
    id: "quiz-2-show",
    type: "show-fraction",
    tutorText:
      "Here's a puzzle from Marcus! One-half equals how many fourths? "
      + "What number goes where the question mark is?",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "quiz-2-ask",
    sfx: "sparkle",
  },

  "quiz-2-ask": {
    id: "quiz-2-ask",
    type: "choice",
    tutorText: "1/2 = ?/4 — What number goes where the question mark is?",
    choices: [
      { label: "1", next: "quiz-2-wrong-1" },
      { label: "2", next: "quiz-2-correct", correct: true },
      { label: "3", next: "quiz-2-wrong-3" },
    ],
    sfx: "xylophone",
  },

  "quiz-2-wrong-1": {
    id: "quiz-2-wrong-1",
    type: "narrate",
    tutorText:
      "If we only have 1 out of 4 pieces, that's less than half. "
      + "We need more pieces!",
    next: "quiz-2-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-2-wrong-3": {
    id: "quiz-2-wrong-3",
    type: "narrate",
    tutorText:
      "3 out of 4 is more than half. Think about how many quarters "
      + "fit in one half.",
    next: "quiz-2-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-2-correct": {
    id: "quiz-2-correct",
    type: "narrate",
    tutorText:
      "Yes! One-half equals two-fourths! Marcus does a happy little dance. "
      + "You're on a roll!",
    next: "quiz-3-show",
    sfx: "chime",
  },

  // --- Q3: ?/4 = 1/2 (fill missing, flipped) ---

  "quiz-3-show": {
    id: "quiz-3-show",
    type: "show-fraction",
    tutorText:
      "Lily flips the equation around! Something-fourths equals one-half. "
      + "How many fourths make a half?",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "quiz-3-ask",
    sfx: "sparkle",
  },

  "quiz-3-ask": {
    id: "quiz-3-ask",
    type: "choice",
    tutorText: "?/4 = 1/2 — How many fourths equal one-half?",
    choices: [
      { label: "1", next: "quiz-3-wrong-1" },
      { label: "2", next: "quiz-3-correct", correct: true },
      { label: "3", next: "quiz-3-wrong-3" },
    ],
    sfx: "xylophone",
  },

  "quiz-3-wrong-1": {
    id: "quiz-3-wrong-1",
    type: "narrate",
    tutorText:
      "If we only have 1 out of 4 pieces, that's less than half. "
      + "We need more pieces!",
    next: "quiz-3-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-3-wrong-3": {
    id: "quiz-3-wrong-3",
    type: "narrate",
    tutorText:
      "3 out of 4 is more than half. Think about how many quarters "
      + "fit in one half.",
    next: "quiz-3-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-3-correct": {
    id: "quiz-3-correct",
    type: "narrate",
    tutorText:
      "That's right! Two-fourths equals one-half! "
      + "Lily and James give you a round of applause.",
    next: "quiz-4-show-a",
    sfx: "chime",
  },

  // --- Q4: Is 1/3 the same as 2/4? (visual comparison — tricky) ---

  "quiz-4-show-a": {
    id: "quiz-4-show-a",
    type: "show-fraction",
    tutorText:
      "Now Sofia has a tricky one! Take a look at this fraction: one-third.",
    showFractionNum: 1,
    showFractionDen: 3,
    next: "quiz-4-show-b",
    sfx: "sparkle",
  },

  "quiz-4-show-b": {
    id: "quiz-4-show-b",
    type: "show-fraction",
    tutorText:
      "And compare it with this one: two-fourths!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "quiz-4-ask",
    sfx: "sparkle",
  },

  "quiz-4-ask": {
    id: "quiz-4-ask",
    type: "choice",
    tutorText: "Is 1/3 the same as 2/4?",
    choices: [
      { label: "Yes, same amount!", next: "quiz-4-wrong" },
      { label: "No, they're different", next: "quiz-4-correct", correct: true },
    ],
    sfx: "xylophone",
  },

  "quiz-4-wrong": {
    id: "quiz-4-wrong",
    type: "narrate",
    tutorText:
      "These look similar but they're actually different amounts! "
      + "1/3 means the brownie was cut into 3 pieces and you took 1. "
      + "2/4 means it was cut into 4 pieces and you took 2. "
      + "Those aren't the same size pieces.",
    next: "quiz-4-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-4-correct": {
    id: "quiz-4-correct",
    type: "narrate",
    tutorText:
      "Great thinking! One-third and two-fourths are NOT the same. "
      + "Not all fractions that look similar are equivalent! "
      + "James is impressed.",
    next: "quiz-5-show-a",
    sfx: "chime",
  },

  // --- Q5: Is 2/4 the same as 4/8? (visual comparison) ---

  "quiz-5-show-a": {
    id: "quiz-5-show-a",
    type: "show-fraction",
    tutorText:
      "One more puzzle! Take a look at this fraction: two-fourths.",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "quiz-5-show-b",
    sfx: "sparkle",
  },

  "quiz-5-show-b": {
    id: "quiz-5-show-b",
    type: "show-fraction",
    tutorText:
      "And now this one: four-eighths! What do you think?",
    showFractionNum: 4,
    showFractionDen: 8,
    next: "quiz-5-ask",
    sfx: "sparkle",
  },

  "quiz-5-ask": {
    id: "quiz-5-ask",
    type: "choice",
    tutorText: "Is 2/4 the same as 4/8?",
    choices: [
      { label: "Yes, same amount!", next: "quiz-5-correct", correct: true },
      { label: "No, they're different", next: "quiz-5-wrong" },
    ],
    sfx: "xylophone",
  },

  "quiz-5-wrong": {
    id: "quiz-5-wrong",
    type: "narrate",
    tutorText:
      "Think about it this way — if you cut each of the 4 pieces in half, "
      + "you'd have 8 pieces. And 2 quarters cut in half gives you 4 eighths. "
      + "Same brownie, same amount!",
    next: "quiz-5-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-5-correct": {
    id: "quiz-5-correct",
    type: "narrate",
    tutorText:
      "You got it! Two-fourths and four-eighths are the same amount — "
      + "just more pieces! Sofia, Marcus, Lily, and James all cheer for you!",
    next: "quiz-celebrate",
    sfx: "chime",
  },

  "quiz-celebrate": {
    id: "quiz-celebrate",
    type: "narrate",
    tutorText:
      "All four friends jump up and cheer! "
      + "You've learned that fractions can look different but mean the same thing. "
      + "That's the magic of equivalent fractions!",
    next: "end",
    sfx: "victory-fanfare",
  },
};
