// lessonData.ts — "Cozy Kitchen Baking" (Fraction Equivalence)
// Kids are sharing brownies at a kitchen table together.
// The lesson teaches that fractions can look different but represent
// the same amount (1/2 = 2/4). Max 4 characters on screen.

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
  objectCount?: number;
  characterCount?: number;
  expectedPerPerson?: number;
  showNumber?: string;   // e.g. "2" or "2½"
  showFractionNum?: number;
  showFractionDen?: number;
  wholeNumber?: number;
  allowKnife?: boolean;
  sliceTo?: "half" | "quarter"; // target tier for slice steps — prevents over-slicing
  sfx?: string;
}

// ---------------------------------------------------------------------------
// The lesson — steps across 3 stages + finale (max 4 characters)
// ---------------------------------------------------------------------------
//
// Stage 1 — Review halves:     What is 1/2? Cut a brownie in half. (2 characters)
// Stage 2 — Discovery:         Cut the SAME brownie into 4 pieces → 1/2 = 2/4 (4 characters)
// Stage 3 — Practice:          Reinforce 1/2 = 2/4 with another brownie (4 characters)
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
      "Welcome to the Cozy Kitchen! Today, Sofia and Marcus "
      + "are baking brownies together. The kitchen smells like warm chocolate, "
      + "and the brownies just came out of the oven. Yum!",
    next: "kitchen-intro-2",
    sfx: "warm-pad",
  },

  "kitchen-intro-2": {
    id: "kitchen-intro-2",
    type: "narrate",
    objectCount: 1,
    tutorText:
      "Sofia slides a big, beautiful brownie onto the cutting board. "
      + "She and Marcus both want to eat it, but there's only one brownie. "
      + "They need to share it fairly!",
    next: "s1-share-question",
    sfx: "harp-gliss",
  },

  "s1-share-question": {
    id: "s1-share-question",
    type: "choice",
    tutorText:
      "One brownie, two hungry friends. "
      + "What should Sofia and Marcus do to share it fairly?",
    choices: [
      { label: "Cut it in half so each friend gets an equal piece.", next: "s1-do-slice", correct: true },
      { label: "Give the whole brownie to Marcus.", next: "s1-wrong-benny" },
      { label: "Put it back in the oven.", next: "s1-wrong-oven" },
    ],
  },

  "s1-wrong-benny": {
    id: "s1-wrong-benny",
    type: "narrate",
    tutorText:
      "Marcus would love that, but poor Sofia would be left without any brownie! "
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
    sliceTo: "half",
    tutorText:
      "Great idea! Tap the brownie to cut it right down the middle. "
      + "Nice and even, just like Sofia would do it.",
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
      "Give one half to Sofia and one half to Marcus. "
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
      + "Sofia and Marcus are happily munching. But wait... "
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
    characterCount: 4,
    tutorText:
      "Lily and James just walked into the kitchen! "
      + "Now there are 4 friends who want to share the next brownie. "
      + "But Sofia has an idea...",
    next: "s2-olive-idea",
    sfx: "harp-gliss",
  },

  "s2-olive-idea": {
    id: "s2-olive-idea",
    type: "narrate",
    objectCount: 1,
    characterCount: 4,
    tutorText:
      "\"Wait,\" says Sofia. \"Before we share with everyone, "
      + "let me show you something cool. First, let's cut this brownie in half, "
      + "just like before.\"",
    next: "s2-first-slice",
    sfx: "gentle-whoosh",
  },

  "s2-first-slice": {
    id: "s2-first-slice",
    type: "slice",
    sliceTo: "half",
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
      + "But now Sofia picks up one of those halves and says, "
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
      "Sofia wants to cut each half of the brownie in half again. "
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
    sliceTo: "quarter",
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
      "Sofia points at the brownie. \"Look! See where the first cut was? "
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
      "Sofia's discovery: the brownie didn't change size. We just cut it into "
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
      "Yes! Marcus's eyes go wide. \"So fractions can LOOK different "
      + "but mean the SAME thing?\" Sofia nods. \"These are called "
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
      + "One piece for Sofia, one for Marcus, one for Lily, one for James!",
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
  // STAGE 3 — Practice: Reinforce 1/2 = 2/4 with another brownie (4 characters)
  // ===========================================================================

  "s3-intro": {
    id: "s3-intro",
    type: "narrate",
    characterCount: 4,
    tutorText:
      "Sofia pulls another tray of brownies out of the oven. "
      + "\"I made one big brownie for the four of us to share! "
      + "This time, YOU get to figure out how to split it fairly.\"",
    next: "s3-setup",
    sfx: "harp-gliss",
  },

  "s3-setup": {
    id: "s3-setup",
    type: "narrate",
    objectCount: 1,
    characterCount: 4,
    tutorText:
      "There's 1 brownie and 4 friends. "
      + "\"How should we cut it?\" asks Lily. "
      + "\"Think about what we just learned!\"",
    next: "s3-plan-question",
    sfx: "gentle-whoosh",
  },

  "s3-plan-question": {
    id: "s3-plan-question",
    type: "choice",
    tutorText:
      "We need to share 1 brownie fairly among 4 friends. "
      + "What should we do first?",
    choices: [
      { label: "Cut the brownie in half, then cut each half in half to get 4 quarters.", next: "s3-first-cut", correct: true },
      { label: "Give the whole brownie to Lily.", next: "s3-wrong-maple" },
      { label: "Cut it in half for 2 pieces.", next: "s3-wrong-half-only" },
    ],
  },

  "s3-wrong-maple": {
    id: "s3-wrong-maple",
    type: "narrate",
    tutorText:
      "Lily would love that, but then Sofia, Marcus, and James "
      + "wouldn't get any! We need to cut it into enough pieces "
      + "so all 4 friends get the same amount.",
    next: "s3-plan-question",
    sfx: "gentle-whoosh",
  },

  "s3-wrong-half-only": {
    id: "s3-wrong-half-only",
    type: "narrate",
    tutorText:
      "Two pieces would work for 2 friends, but we have 4! "
      + "We need more pieces. What if we cut each half in half again?",
    next: "s3-plan-question",
    sfx: "gentle-whoosh",
  },

  "s3-first-cut": {
    id: "s3-first-cut",
    type: "slice",
    sliceTo: "half",
    tutorText:
      "Great plan! First, tap the brownie to cut it in half.",
    next: "s3-second-cut",
    sfx: "gentle-whoosh",
  },

  "s3-second-cut": {
    id: "s3-second-cut",
    type: "slice",
    sliceTo: "quarter",
    tutorText:
      "Now tap each half to cut it in half again. "
      + "That gives us 4 quarters — one for each friend!",
    next: "s3-post-cut",
    sfx: "gentle-whoosh",
  },

  "s3-post-cut": {
    id: "s3-post-cut",
    type: "narrate",
    tutorText:
      "4 equal pieces! Marcus points at the brownie. "
      + "\"Hey, look — 2 of those quarters are on one side of the big cut. "
      + "That's the same as one-half! We proved it again!\"",
    next: "s3-show-equivalence",
    sfx: "chime",
  },

  "s3-show-equivalence": {
    id: "s3-show-equivalence",
    type: "show-fraction",
    tutorText:
      "Two-fourths equals one-half! "
      + "It doesn't matter which brownie we cut — "
      + "1/2 and 2/4 are always the same amount.",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "s3-equiv-check",
    sfx: "sparkle",
  },

  "s3-equiv-check": {
    id: "s3-equiv-check",
    type: "choice",
    tutorText:
      "James asks: \"If I eat 2 out of 4 pieces, "
      + "did I eat more or less than half the brownie?\"",
    choices: [
      { label: "Exactly half! 2/4 = 1/2.", next: "s3-equiv-correct", correct: true },
      { label: "Less than half, because quarters are small.", next: "s3-equiv-wrong-less" },
      { label: "More than half, because 2 pieces is a lot.", next: "s3-equiv-wrong-more" },
    ],
  },

  "s3-equiv-wrong-less": {
    id: "s3-equiv-wrong-less",
    type: "narrate",
    tutorText:
      "The pieces are smaller, that's true! But you have 2 of them. "
      + "Look at where the big half-cut is — those 2 quarters fit "
      + "perfectly on one side. They cover the same amount as one half!",
    next: "s3-equiv-check",
    sfx: "gentle-whoosh",
  },

  "s3-equiv-wrong-more": {
    id: "s3-equiv-wrong-more",
    type: "narrate",
    tutorText:
      "2 pieces sounds like a lot, but remember: the whole brownie "
      + "has 4 pieces. 2 out of 4 is exactly half. "
      + "We didn't add any extra brownie — just made more cuts!",
    next: "s3-equiv-check",
    sfx: "gentle-whoosh",
  },

  "s3-equiv-correct": {
    id: "s3-equiv-correct",
    type: "narrate",
    tutorText:
      "That's right! Now let's share the brownie. "
      + "Give one quarter to each of the 4 friends!",
    next: "s3-distribute-quarters",
    sfx: "chime",
  },

  "s3-distribute-quarters": {
    id: "s3-distribute-quarters",
    type: "distribute-halves",
    tutorText:
      "Give one quarter to Sofia, one to Marcus, "
      + "one to Lily, and one to James!",
    characterCount: 4,
    next: "s3-final-check",
    sfx: "xylophone",
  },

  "s3-final-check": {
    id: "s3-final-check",
    type: "choice",
    tutorText:
      "One last question from James! "
      + "\"If I have 2 out of 4 pieces of brownie, is that more, less, "
      + "or the same as someone who has 1 out of 2 pieces?\"",
    choices: [
      { label: "The same! 2/4 = 1/2", next: "quiz-intro", correct: true },
      { label: "More, because 2 is more than 1.", next: "s3-final-wrong" },
    ],
  },

  "s3-final-wrong": {
    id: "s3-final-wrong",
    type: "narrate",
    tutorText:
      "The numbers are bigger, but remember: the pieces are smaller too! "
      + "2 quarter-pieces add up to the exact same amount as "
      + "1 half-piece. It's like having 2 quarters versus 1 fifty-cent coin. "
      + "Same value, just different pieces!",
    next: "s3-final-check",
    sfx: "gentle-whoosh",
  },

  // ===========================================================================
  // CHECK FOR UNDERSTANDING — Fill in the Missing Number
  // ===========================================================================

  "quiz-intro": {
    id: "quiz-intro",
    type: "narrate",
    tutorText:
      "Before the kitchen closes up, Sofia has a surprise — a little puzzle game! "
      + "She pulls out some cards with fraction riddles on them. "
      + "'Can you figure out the missing number?' she asks with a grin. "
      + "Let's give it a try!",
    next: "quiz-1-show",
    sfx: "music-box",
  },

  // --- Puzzle 1: 1/2 = ?/4 ---

  "quiz-1-show": {
    id: "quiz-1-show",
    type: "show-fraction",
    tutorText:
      "Here's the first riddle! We know that one-half equals something-fourths. "
      + "One-half equals WHAT over four? Hmm, what number is hiding behind "
      + "that question mark?",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "quiz-1-ask",
    sfx: "sparkle",
  },

  "quiz-1-ask": {
    id: "quiz-1-ask",
    type: "choice",
    tutorText: "1/2 = ?/4 — What number goes where the question mark is?",
    choices: [
      { label: "1", next: "quiz-1-wrong-1" },
      { label: "2", next: "quiz-1-correct", correct: true },
      { label: "3", next: "quiz-1-wrong-3" },
    ],
    sfx: "xylophone",
  },

  "quiz-1-wrong-1": {
    id: "quiz-1-wrong-1",
    type: "narrate",
    tutorText:
      "Not quite! One-fourth is a smaller piece than one-half. Remember, "
      + "when we cut each half into two more pieces, we get TWICE as many. "
      + "Think about how many fourths fit in one half, and try again!",
    next: "quiz-1-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-1-wrong-3": {
    id: "quiz-1-wrong-3",
    type: "narrate",
    tutorText:
      "Hmm, three-fourths would be more than one-half — that's too much brownie! "
      + "We need exactly the same amount as one-half. Try again!",
    next: "quiz-1-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-1-correct": {
    id: "quiz-1-correct",
    type: "narrate",
    tutorText:
      "Yes! One-half equals two-fourths! If you cut each half into two pieces, "
      + "you get four pieces total, and two of those four pieces is the same amount. "
      + "Sofia stamps a little gold star on the card!",
    next: "quiz-2-show",
    sfx: "chime",
  },

  // --- Puzzle 2: 2/4 = 1/? ---

  "quiz-2-show": {
    id: "quiz-2-show",
    type: "show-fraction",
    tutorText:
      "Next riddle! Marcus holds up a card that says two-fourths equals "
      + "one-over-SOMETHING. What number goes on the bottom?",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "quiz-2-ask",
    sfx: "sparkle",
  },

  "quiz-2-ask": {
    id: "quiz-2-ask",
    type: "choice",
    tutorText: "2/4 = 1/? — What number is missing on the bottom?",
    choices: [
      { label: "2", next: "quiz-2-correct", correct: true },
      { label: "3", next: "quiz-2-wrong-3" },
      { label: "4", next: "quiz-2-wrong-4" },
    ],
    sfx: "xylophone",
  },

  "quiz-2-wrong-3": {
    id: "quiz-2-wrong-3",
    type: "narrate",
    tutorText:
      "Hmm, one-third would mean cutting into three pieces — that's a different "
      + "amount than two-fourths. Remember, two-fourths is the same as one... what? "
      + "Think about the word we learned today!",
    next: "quiz-2-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-2-wrong-4": {
    id: "quiz-2-wrong-4",
    type: "narrate",
    tutorText:
      "One-fourth would be just one small piece out of four. But two-fourths "
      + "is bigger than that! When you push those two small pieces back together, "
      + "what do you get? Try again!",
    next: "quiz-2-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-2-correct": {
    id: "quiz-2-correct",
    type: "narrate",
    tutorText:
      "You got it! Two-fourths equals one-HALF! Two little pieces out of four "
      + "is the same as one big piece out of two. Marcus does a happy little dance!",
    next: "quiz-3-show",
    sfx: "chime",
  },

  // --- Puzzle 3: ?/4 = 1/2 ---

  "quiz-3-show": {
    id: "quiz-3-show",
    type: "show-fraction",
    tutorText:
      "Ooh, this one flips it around! Something-fourths equals one-half. "
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
      "One-fourth is just one little piece — that's less than half the brownie. "
      + "If the brownie has four pieces, how many do you need to have exactly half? "
      + "Try again!",
    next: "quiz-3-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-3-wrong-3": {
    id: "quiz-3-wrong-3",
    type: "narrate",
    tutorText:
      "Three-fourths would be three pieces out of four — that's almost the whole brownie! "
      + "That's more than half. Try a smaller number!",
    next: "quiz-3-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-3-correct": {
    id: "quiz-3-correct",
    type: "narrate",
    tutorText:
      "That's right! Two-fourths equals one-half! You're getting so good at this! "
      + "Lily and James give you a round of applause.",
    next: "quiz-4-show",
    sfx: "chime",
  },

  // --- Puzzle 4: 4/4 = ?/2 (stretch challenge) ---

  "quiz-4-show": {
    id: "quiz-4-show",
    type: "show-fraction",
    tutorText:
      "One last riddle — a tricky one! Sofia writes: four-fourths equals "
      + "WHAT-over-two. Four-fourths means we have ALL the pieces — that's "
      + "the whole brownie! How many halves make a whole?",
    showFractionNum: 4,
    showFractionDen: 4,
    next: "quiz-4-ask",
    sfx: "sparkle",
  },

  "quiz-4-ask": {
    id: "quiz-4-ask",
    type: "choice",
    tutorText: "4/4 = ?/2 — What number goes on top?",
    choices: [
      { label: "1", next: "quiz-4-wrong-1" },
      { label: "2", next: "quiz-4-correct", correct: true },
      { label: "4", next: "quiz-4-wrong-4" },
    ],
    sfx: "xylophone",
  },

  "quiz-4-wrong-1": {
    id: "quiz-4-wrong-1",
    type: "narrate",
    tutorText:
      "Not quite! One-half is only half the brownie, but four-fourths is the "
      + "WHOLE brownie. We need enough halves to make a whole. "
      + "If you put two halves together, what do you get? Try again!",
    next: "quiz-4-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-4-wrong-4": {
    id: "quiz-4-wrong-4",
    type: "narrate",
    tutorText:
      "Four-halves would be more than one whole brownie — that's two whole brownies! "
      + "We only have one brownie. How many halves does it take to make exactly one? "
      + "Try again!",
    next: "quiz-4-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-4-correct": {
    id: "quiz-4-correct",
    type: "narrate",
    tutorText:
      "Amazing! Four-fourths equals two-halves — they're both the whole brownie! "
      + "Two halves make a whole, and four quarters make a whole too. "
      + "You solved all the riddles!",
    next: "quiz-celebrate",
    sfx: "chime",
  },

  "quiz-celebrate": {
    id: "quiz-celebrate",
    type: "narrate",
    tutorText:
      "All four friends jump up and down, showering you with tiny flour-cloud fireworks! "
      + "'You're a fraction puzzle champion!' they cheer. "
      + "You figured out every missing number!",
    next: "finale-intro",
    sfx: "harp-gliss",
  },

  // ===========================================================================
  // FINALE — Celebrate
  // ===========================================================================

  "finale-intro": {
    id: "finale-intro",
    type: "narrate",
    tutorText:
      "You got it! All four friends cheer and clink their milk glasses together. "
      + "Today in the Cozy Kitchen, you discovered something amazing: "
      + "fractions can look completely different but mean the exact same thing.",
    next: "finale-recap",
    sfx: "music-box",
  },

  "finale-recap": {
    id: "finale-recap",
    type: "narrate",
    tutorText:
      "One-half equals two-fourths. "
      + "We proved it by cutting brownies into halves and quarters. "
      + "The pieces got smaller, but the amount "
      + "stayed exactly the same. That's what equivalent fractions are all about!",
    next: "finale-goodbye",
    sfx: "harp-gliss",
  },

  "finale-goodbye": {
    id: "finale-goodbye",
    type: "narrate",
    tutorText:
      "Sofia waves a flour-dusted hand. \"Come back to the Cozy Kitchen anytime! "
      + "There are always more treats to bake and more fraction secrets to discover.\" "
      + "Marcus, Lily, and James all wave goodbye. Great baking today, chef!",
    next: "end",
    sfx: "music-box",
  },
};
