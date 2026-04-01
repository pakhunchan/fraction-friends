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
  | "cheer"             // Motivational screen with monsters cheering
  | "visual-compare"    // Ghost overlay comparison (pieces → equivalent larger piece)

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
  cheerStyle?: "sparkle-rally" | "high-five" | "champion-banner" | "gentle-encouragement" | "countdown-hype" | "cheerleader-squad" | "storybook" | "trophy-room" | "dance-party" | "warm-hug";
  ghostPiece?: "whole" | "half-left" | "half-right" | "quarter"; // ghost overlay for visual-compare
  compareCount?: number; // how many unassigned pieces to group in comparison
  pieceGap?: string; // custom CSS gap value for the unassigned pieces area (e.g. "80px")
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
  // STAGE 3 — Reassembly & Equivalence: 2/4 = 1/2 (visual proof)
  // Sofia and Marcus (2 characters) explore recombining pieces.
  // ===========================================================================

  "s3-intro": {
    id: "s3-intro",
    type: "narrate",
    characterCount: 2,
    tutorText:
      "A couple of days later, Sofia and Marcus are back in the Cozy Kitchen — "
      + "just the two of them this time. Sofia has a fresh brownie cooling on the "
      + "rack, and she can barely contain her excitement. 'Marcus, I figured out "
      + "something AMAZING about fractions. You have to see this!'",
    next: "s3-setup",
    sfx: "harp-gliss",
  },

  "s3-setup": {
    id: "s3-setup",
    type: "narrate",
    objectCount: 1,
    characterCount: 2,
    tutorText:
      "Sofia places one beautiful brownie on the cutting board and rubs her hands "
      + "together. 'Okay, first — let's cut this brownie in half. Just like before. "
      + "But THIS time, watch what happens after!'",
    next: "s3-slice-half",
    sfx: "gentle-whoosh",
  },

  "s3-slice-half": {
    id: "s3-slice-half",
    type: "slice",
    sliceTo: "half",
    pieceGap: "80px",
    tutorText:
      "Tap the brownie to cut it right down the middle!",
    next: "s3-halves-observe",
    sfx: "gentle-whoosh",
  },

  "s3-halves-observe": {
    id: "s3-halves-observe",
    type: "narrate",
    pieceGap: "80px",
    tutorText:
      "Two perfect halves sit on the cutting board. Sofia grins and slides them "
      + "back together. 'Look, Marcus — watch closely...'",
    next: "s3-compare-halves",
    sfx: "gentle-whoosh",
  },

  "s3-compare-halves": {
    id: "s3-compare-halves",
    type: "visual-compare",
    ghostPiece: "whole",
    compareCount: 2,
    tutorText:
      "The two halves fit back together perfectly! See the outline? They fill up "
      + "the whole shape — not a crumb missing. We split the brownie into two "
      + "pieces, but ALL the brownie is still right here. One half plus one half "
      + "makes one whole!",
    next: "s3-show-2-over-2",
    sfx: "chime",
  },

  "s3-show-2-over-2": {
    id: "s3-show-2-over-2",
    type: "show-fraction",
    showFractionNum: 2,
    showFractionDen: 2,
    tutorText:
      "We can write that as two-halves. The bottom number says we cut it into 2 "
      + "pieces. The top number says we have BOTH pieces. Two out of two — that's "
      + "everything! Two-halves equals one whole.",
    next: "s3-halves-check",
    sfx: "sparkle",
  },

  "s3-halves-check": {
    id: "s3-halves-check",
    type: "choice",
    tutorText:
      "Sofia asks: 'So if we put both halves back together, what do we get?'",
    choices: [
      { label: "One whole brownie — nothing changed!", next: "s3-halves-correct", correct: true },
      { label: "Two brownies, because there are two pieces", next: "s3-halves-wrong" },
    ],
  },

  "s3-halves-wrong": {
    id: "s3-halves-wrong",
    type: "narrate",
    tutorText:
      "We still have the same brownie! Cutting it made two pieces, but it didn't "
      + "create extra brownie. When we push the halves back together — same brownie, "
      + "same amount. Two halves make one whole!",
    next: "s3-halves-check",
    sfx: "gentle-whoosh",
  },

  "s3-halves-correct": {
    id: "s3-halves-correct",
    type: "narrate",
    tutorText:
      "Marcus nods slowly. 'So cutting something doesn't make MORE stuff — it "
      + "just splits the same stuff into pieces!' Sofia's eyes light up. 'Exactly! "
      + "And now... watch THIS.'",
    next: "s3-slice-quarters",
    sfx: "chime",
  },

  "s3-slice-quarters": {
    id: "s3-slice-quarters",
    type: "slice",
    sliceTo: "quarter",
    tutorText:
      "Tap each half to cut it into two smaller pieces. Now we have four quarters!",
    next: "s3-quarters-observe",
    sfx: "gentle-whoosh",
  },

  "s3-quarters-observe": {
    id: "s3-quarters-observe",
    type: "narrate",
    tutorText:
      "Four little quarter pieces! Sofia carefully slides two of them together. "
      + "'These two tiny pieces used to be one half. I wonder... do they still add "
      + "up to the same amount?'",
    next: "s3-compare-quarters",
    sfx: "gentle-whoosh",
  },

  "s3-compare-quarters": {
    id: "s3-compare-quarters",
    type: "visual-compare",
    ghostPiece: "half-left",
    compareCount: 2,
    tutorText:
      "They fit! Two quarters pushed together fill up exactly one half — see the "
      + "outline? Not too big, not too small. They're the same amount! These two "
      + "little pieces together make one half!",
    next: "s3-show-2-over-4",
    sfx: "chime",
  },

  "s3-show-2-over-4": {
    id: "s3-show-2-over-4",
    type: "show-fraction",
    showFractionNum: 2,
    showFractionDen: 4,
    tutorText:
      "Two-fourths! Two pieces out of four. And two-fourths is the same amount "
      + "as one-half. The pieces got smaller, but put two of them together and you "
      + "get the same amount back!",
    next: "s3-big-insight",
    sfx: "sparkle",
  },

  "s3-big-insight": {
    id: "s3-big-insight",
    type: "narrate",
    tutorText:
      "Sofia jumps up from the table, beaming. 'Marcus! Do you see it? One whole "
      + "brownie, two halves, four quarters — they're ALL the same amount of brownie! "
      + "You can split it into more and more pieces, but it's always the same brownie. "
      + "That's what equivalent fractions are!' Marcus grins. 'Fractions are just "
      + "different ways to describe the same thing!'",
    next: "s3-final-check",
    sfx: "harp-gliss",
  },

  "s3-final-check": {
    id: "s3-final-check",
    type: "choice",
    tutorText:
      "Quick check! If you put 2 quarter pieces together, what do they make?",
    choices: [
      { label: "One half! 2 quarters = 1 half", next: "quiz-intro", correct: true },
      { label: "One whole brownie", next: "s3-final-wrong-whole" },
      { label: "Something smaller than a half", next: "s3-final-wrong-smaller" },
    ],
  },

  "s3-final-wrong-whole": {
    id: "s3-final-wrong-whole",
    type: "narrate",
    tutorText:
      "Not quite! 4 quarters make a whole, but we only have 2 quarters here. "
      + "Think about what we just saw — 2 small pieces fitting inside the outline "
      + "of one half...",
    next: "s3-final-check",
    sfx: "gentle-whoosh",
  },

  "s3-final-wrong-smaller": {
    id: "s3-final-wrong-smaller",
    type: "narrate",
    tutorText:
      "Remember what Sofia showed us! She pushed the two quarters together and "
      + "they filled up the half-outline perfectly. Same area, same amount. "
      + "Two quarters together make...?",
    next: "s3-final-check",
    sfx: "gentle-whoosh",
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
    next: "cheer-1",
    sfx: "music-box",
  },

  // Cheer before Q1: Gentle Encouragement (#4)
  "cheer-1": {
    id: "cheer-1",
    type: "cheer",
    cheerStyle: "gentle-encouragement",
    tutorText: "Ready for a fun quiz? Don't worry — your friends are cheering for you!",
    next: "quiz-1-show-a",
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
    next: "cheer-2",
    sfx: "chime",
  },

  // Cheer before Q2: Sparkle Rally (#1)
  "cheer-2": {
    id: "cheer-2",
    type: "cheer",
    cheerStyle: "sparkle-rally",
    tutorText: "You've got this! Keep going!",
    next: "quiz-2-show",
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
    next: "cheer-3",
    sfx: "chime",
  },

  // Cheer before Q3: Cheerleader Squad (#6)
  "cheer-3": {
    id: "cheer-3",
    type: "cheer",
    cheerStyle: "cheerleader-squad",
    tutorText: "Go, go, GO! Your monster friends believe in you!",
    next: "quiz-3-show",
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
    next: "cheer-4",
    sfx: "chime",
  },

  // Cheer before Q4: Trophy Room (#8)
  "cheer-4": {
    id: "cheer-4",
    type: "cheer",
    cheerStyle: "trophy-room",
    tutorText: "Almost there! Answer the quiz to earn your Fraction Trophy!",
    next: "quiz-4-show-a",
  },

  // --- Q4: Is 1/3 the same as 2/4? (visual comparison) ---

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
    next: "cheer-5",
    sfx: "chime",
  },

  // Cheer before Q5: Dance Party (#9)
  "cheer-5": {
    id: "cheer-5",
    type: "cheer",
    cheerStyle: "dance-party",
    tutorText: "Time to shine! Dance your way through this last quiz!",
    next: "quiz-5-show-a",
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
    next: "cheer-final",
    sfx: "chime",
  },

  // Final cheer: Warm Hug (#10)
  "cheer-final": {
    id: "cheer-final",
    type: "cheer",
    cheerStyle: "warm-hug",
    tutorText: "We're so proud of you! Let's finish strong!",
    next: "quiz-celebrate",
  },

  "quiz-celebrate": {
    id: "quiz-celebrate",
    type: "narrate",
    tutorText:
      "All four friends jump up and cheer! "
      + "\"You're a fraction superstar!\" says Sofia. "
      + "You answered every puzzle perfectly!",
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
