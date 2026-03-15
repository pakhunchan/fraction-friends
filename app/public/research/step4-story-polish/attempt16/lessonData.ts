// lessonData.ts — "Space Station Snack Share" (Fraction Equivalence)
// Young astronauts aboard Space Station Solaris must share food rations fairly.
// The lesson teaches that fractions can look different but mean the same amount
// (1/2 = 2/4, 2/4 = 4/8). Warm, encouraging tone for ages 6–8.

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
// The lesson — 45 steps across 3 stages + finale
// ---------------------------------------------------------------------------
//
// Stage 1 — Review halves:  What is 1/2? Cut a protein bar in half for 2 astronauts
// Stage 2 — Discovery:      Cut each half again → 2/4 = 1/2 (same bar!)
// Stage 3 — Practice:       Double again → 4/8 = 2/4 = 1/2
// Finale  — Celebrate the crew's fraction knowledge
//
// SFX palette:
//   chime        — a single, soft high chime (correct answer, moment of insight)
//   harp-gliss   — a gentle upward harp run (transitions, reveals)
//   warm-pad     — a slow warm chord swell (open / title moments)
//   soft-bell    — single mellow bell tone (item placement)
//   xylophone    — bright single xylophone note (small wins, placements)
//   music-box    — tinkling music-box phrase (celebration)
//   gentle-whoosh — soft air-brush (page transitions, "let's look at this")
//   sparkle      — high glittery shimmer (fraction reveal)
// ---------------------------------------------------------------------------

export const lessonSteps: Record<string, LessonStep> = {

  // ===========================================================================
  // STAGE 1 — Review: What are halves? (1 protein bar, 2 astronauts)
  // ===========================================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText:
      "Welcome aboard Space Station Solaris! You're the newest crew member, "
      + "and today is your first Snack Share. Up here in space, every astronaut "
      + "gets an equal portion — that's the rule!",
    next: "intro-2",
    sfx: "warm-pad",
  },

  "intro-2": {
    id: "intro-2",
    type: "narrate",
    tutorText:
      "Commander Luna and Pilot Cosmo are hungry after a long spacewalk. "
      + "We have 1 protein bar to share between the 2 of them. "
      + "Hmm — 1 bar, 2 astronauts. What should we do?",
    next: "s1-what-do",
    sfx: "gentle-whoosh",
  },

  "s1-what-do": {
    id: "s1-what-do",
    type: "choice",
    tutorText:
      "We have 1 protein bar and 2 hungry astronauts. "
      + "How can we make it fair?",
    choices: [
      { label: "Cut it in half!", next: "s1-cut-correct", correct: true },
      { label: "Give it all to one astronaut", next: "s1-wrong-all" },
      { label: "Don't share it", next: "s1-wrong-none" },
    ],
  },

  "s1-wrong-all": {
    id: "s1-wrong-all",
    type: "narrate",
    tutorText:
      "That wouldn't be fair, would it? One astronaut would be full "
      + "and the other would be hungry! Let's think again — how can we "
      + "split 1 bar so both astronauts get the same amount?",
    next: "s1-what-do",
    sfx: "soft-bell",
  },

  "s1-wrong-none": {
    id: "s1-wrong-none",
    type: "narrate",
    tutorText:
      "But they're both so hungry from their spacewalk! "
      + "We need to share the bar. What if we cut it so each person "
      + "gets the same-sized piece?",
    next: "s1-what-do",
    sfx: "soft-bell",
  },

  "s1-cut-correct": {
    id: "s1-cut-correct",
    type: "narrate",
    tutorText:
      "Great thinking! If we cut the bar right down the middle, "
      + "we get 2 equal pieces. Let's do it!",
    next: "s1-slice",
    sfx: "chime",
  },

  "s1-slice": {
    id: "s1-slice",
    type: "slice",
    taskHeader: "Tap the protein bar to cut it in half!",
    tutorText:
      "Tap the protein bar to slice it into 2 equal pieces.",
    cookieCount: 1,
    allowKnife: true,
    next: "s1-show-half",
    sfx: "xylophone",
  },

  "s1-show-half": {
    id: "s1-show-half",
    type: "show-fraction",
    tutorText:
      "Each piece is one half of the whole bar. "
      + "We write that as a fraction — a 1 on top and a 2 on the bottom.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s1-explain-half",
    sfx: "sparkle",
  },

  "s1-explain-half": {
    id: "s1-explain-half",
    type: "narrate",
    tutorText:
      "The bottom number tells us how many equal pieces we made — 2. "
      + "The top number tells us how many pieces we're looking at — 1. "
      + "So one-half means: 1 piece out of 2 equal pieces!",
    next: "s1-distribute",
    sfx: "gentle-whoosh",
  },

  "s1-distribute": {
    id: "s1-distribute",
    type: "distribute-halves",
    taskHeader: "Give each astronaut their half of the protein bar!",
    tutorText:
      "Drag one half to Commander Luna and one half to Pilot Cosmo.",
    cookieCount: 1,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "s1-check",
    sfx: "soft-bell",
  },

  "s1-check": {
    id: "s1-check",
    type: "choice",
    tutorText:
      "Each astronaut got one piece. We cut the bar into 2 equal pieces "
      + "and each person got 1. What fraction did each astronaut get?",
    choices: [
      { label: "1/2", next: "s1-nicework", correct: true },
      { label: "1/3", next: "s1-wrong-third" },
      { label: "2", next: "s1-wrong-two" },
    ],
  },

  "s1-wrong-third": {
    id: "s1-wrong-third",
    type: "narrate",
    tutorText:
      "Not quite! One-third would mean the bar was cut into 3 pieces. "
      + "But we only cut it into 2 equal pieces. "
      + "Each astronaut got 1 piece out of 2. Let's try again!",
    next: "s1-check",
    sfx: "soft-bell",
  },

  "s1-wrong-two": {
    id: "s1-wrong-two",
    type: "narrate",
    tutorText:
      "Hmm, 2 would mean each astronaut got 2 whole bars! "
      + "But we only had 1 bar cut into 2 pieces. "
      + "Each astronaut got 1 piece out of those 2. What fraction is that?",
    next: "s1-check",
    sfx: "soft-bell",
  },

  "s1-nicework": {
    id: "s1-nicework",
    type: "narrate",
    tutorText:
      "That's right — one-half! Each astronaut got exactly 1/2 of the bar. "
      + "Snack Share success! Now let's get ready for the next delivery...",
    next: "s2-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 2 — Discovery: 1/2 = 2/4 (cut halves into quarters)
  // ===========================================================================

  "s2-intro": {
    id: "s2-intro",
    type: "narrate",
    tutorText:
      "A supply pod just docked! Inside there's 1 energy wafer for "
      + "Commander Luna and Pilot Cosmo to share. "
      + "But this time, the Space Station Chef has a special request...",
    next: "s2-chef-request",
    sfx: "harp-gliss",
  },

  "s2-chef-request": {
    id: "s2-chef-request",
    type: "narrate",
    tutorText:
      "\"Could you cut the wafer into 4 equal pieces instead of 2?\" "
      + "says Chef Nebula. \"Smaller bites are easier to eat in zero gravity!\" "
      + "Interesting — let's see what happens!",
    next: "s2-slice-1",
    sfx: "gentle-whoosh",
  },

  "s2-slice-1": {
    id: "s2-slice-1",
    type: "slice",
    taskHeader: "Tap the wafer to cut it into 4 equal pieces!",
    tutorText:
      "Let's cut this wafer into 4 equal pieces. Tap to slice!",
    cookieCount: 1,
    allowKnife: true,
    next: "s2-how-many-pieces",
    sfx: "xylophone",
  },

  "s2-how-many-pieces": {
    id: "s2-how-many-pieces",
    type: "choice",
    tutorText:
      "We cut the wafer into 4 equal pieces. "
      + "Now we need to share them fairly between 2 astronauts. "
      + "How many pieces should each astronaut get?",
    choices: [
      { label: "2 pieces each", next: "s2-pieces-correct", correct: true },
      { label: "1 piece each", next: "s2-wrong-one" },
      { label: "3 pieces each", next: "s2-wrong-three" },
    ],
  },

  "s2-wrong-one": {
    id: "s2-wrong-one",
    type: "narrate",
    tutorText:
      "If each astronaut got only 1 piece, we'd use just 2 of the 4 pieces. "
      + "There would be leftovers! We want to share ALL the pieces fairly. "
      + "4 pieces, 2 astronauts — how many each?",
    next: "s2-how-many-pieces",
    sfx: "soft-bell",
  },

  "s2-wrong-three": {
    id: "s2-wrong-three",
    type: "narrate",
    tutorText:
      "3 pieces each would need 6 pieces total, but we only have 4! "
      + "Let's think: 4 pieces shared equally between 2 astronauts...",
    next: "s2-how-many-pieces",
    sfx: "soft-bell",
  },

  "s2-pieces-correct": {
    id: "s2-pieces-correct",
    type: "narrate",
    tutorText:
      "Exactly! 4 pieces split between 2 astronauts means 2 pieces each. "
      + "Go ahead and hand them out!",
    next: "s2-distribute",
    sfx: "chime",
  },

  "s2-distribute": {
    id: "s2-distribute",
    type: "distribute",
    taskHeader: "Give each astronaut 2 pieces of the wafer!",
    tutorText:
      "Drag 2 pieces to Commander Luna and 2 pieces to Pilot Cosmo.",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "s2-show-quarter",
    sfx: "soft-bell",
  },

  "s2-show-quarter": {
    id: "s2-show-quarter",
    type: "show-fraction",
    tutorText:
      "Each astronaut got 2 pieces out of 4 total. "
      + "We write that as two-fourths!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "s2-big-question",
    sfx: "sparkle",
  },

  "s2-big-question": {
    id: "s2-big-question",
    type: "narrate",
    tutorText:
      "Now here's the really cool part. Think back to Stage 1 — "
      + "when we cut the bar into 2 pieces, each astronaut got 1/2. "
      + "This time we cut it into 4 pieces, and each astronaut got 2/4. "
      + "But wait... did each astronaut actually get a DIFFERENT amount of wafer?",
    next: "s2-same-or-different",
    sfx: "gentle-whoosh",
  },

  "s2-same-or-different": {
    id: "s2-same-or-different",
    type: "choice",
    tutorText:
      "Last time each astronaut got 1/2 of a bar. "
      + "This time each got 2/4 of a wafer. "
      + "Is the amount of food the same or different?",
    choices: [
      { label: "The same amount!", next: "s2-same-correct", correct: true },
      { label: "Different — 2/4 is more", next: "s2-wrong-more" },
      { label: "Different — 1/2 is more", next: "s2-wrong-half-more" },
    ],
  },

  "s2-wrong-more": {
    id: "s2-wrong-more",
    type: "narrate",
    tutorText:
      "I can see why you'd think that — 2/4 has bigger numbers! "
      + "But picture it: the wafer is the same size. "
      + "We just cut it into more pieces. Each piece is smaller, "
      + "so 2 small pieces = 1 big half. Let's think again!",
    next: "s2-same-or-different",
    sfx: "soft-bell",
  },

  "s2-wrong-half-more": {
    id: "s2-wrong-half-more",
    type: "narrate",
    tutorText:
      "It might seem that way, but imagine putting the 2 quarter-pieces "
      + "back together — they'd fit perfectly into one half! "
      + "The amount is actually the same. Let's try again!",
    next: "s2-same-or-different",
    sfx: "soft-bell",
  },

  "s2-same-correct": {
    id: "s2-same-correct",
    type: "narrate",
    tutorText:
      "You got it! Even though we cut the wafer into MORE pieces, "
      + "each astronaut still got exactly the same amount of food. "
      + "The pieces are smaller, but there are more of them!",
    next: "s2-show-equiv",
    sfx: "chime",
  },

  "s2-show-equiv": {
    id: "s2-show-equiv",
    type: "show-fraction",
    tutorText:
      "One-half and two-fourths are the SAME amount! "
      + "We call these equivalent fractions. 1/2 = 2/4!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s2-show-equiv-2",
    sfx: "sparkle",
  },

  "s2-show-equiv-2": {
    id: "s2-show-equiv-2",
    type: "show-fraction",
    tutorText:
      "Two-fourths looks different from one-half, "
      + "but it means exactly the same thing. Pretty cool, right?",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "s2-confirm-quiz",
    sfx: "sparkle",
  },

  "s2-confirm-quiz": {
    id: "s2-confirm-quiz",
    type: "choice",
    tutorText:
      "Quick check! Which fraction is equivalent to 1/2?",
    choices: [
      { label: "2/4", next: "s2-quiz-correct", correct: true },
      { label: "1/4", next: "s2-quiz-wrong-quarter" },
      { label: "3/4", next: "s2-quiz-wrong-three-quarter" },
    ],
  },

  "s2-quiz-wrong-quarter": {
    id: "s2-quiz-wrong-quarter",
    type: "narrate",
    tutorText:
      "One-fourth is just 1 piece out of 4 — that's only a quarter of the wafer. "
      + "We need 2 pieces out of 4 to match one-half. Try again!",
    next: "s2-confirm-quiz",
    sfx: "soft-bell",
  },

  "s2-quiz-wrong-three-quarter": {
    id: "s2-quiz-wrong-three-quarter",
    type: "narrate",
    tutorText:
      "Three-fourths is 3 pieces out of 4 — that's more than half! "
      + "Remember, each astronaut got 2 out of 4 pieces. "
      + "What fraction is that?",
    next: "s2-confirm-quiz",
    sfx: "soft-bell",
  },

  "s2-quiz-correct": {
    id: "s2-quiz-correct",
    type: "narrate",
    tutorText:
      "Exactly right! 1/2 = 2/4. They look different, "
      + "but they describe the same amount. You're becoming a fraction expert, astronaut!",
    next: "s3-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 3 — Practice: 2/4 = 4/8 (cut quarters into eighths)
  // ===========================================================================

  "s3-intro": {
    id: "s3-intro",
    type: "narrate",
    tutorText:
      "Great news! Another supply pod has arrived with 1 space cracker. "
      + "Commander Luna and Pilot Cosmo need to share again. "
      + "But this time, Chef Nebula wants even TINIER bites...",
    next: "s3-chef-tiny",
    sfx: "harp-gliss",
  },

  "s3-chef-tiny": {
    id: "s3-chef-tiny",
    type: "narrate",
    tutorText:
      "\"Cut it into 8 equal pieces, please!\" says Chef Nebula. "
      + "\"Crumbs float everywhere in zero gravity — tiny bites are tidier!\" "
      + "Alright, let's slice this cracker into 8 pieces!",
    next: "s3-slice",
    sfx: "gentle-whoosh",
  },

  "s3-slice": {
    id: "s3-slice",
    type: "slice",
    taskHeader: "Tap the space cracker to cut it into 8 equal pieces!",
    tutorText:
      "Slice the cracker into 8 tiny, equal pieces. Tap to cut!",
    cookieCount: 1,
    allowKnife: true,
    next: "s3-how-many",
    sfx: "xylophone",
  },

  "s3-how-many": {
    id: "s3-how-many",
    type: "choice",
    tutorText:
      "We now have 8 equal pieces and 2 astronauts. "
      + "How many pieces should each astronaut get?",
    choices: [
      { label: "4 pieces each", next: "s3-pieces-correct", correct: true },
      { label: "2 pieces each", next: "s3-wrong-two" },
      { label: "8 pieces each", next: "s3-wrong-eight" },
    ],
  },

  "s3-wrong-two": {
    id: "s3-wrong-two",
    type: "narrate",
    tutorText:
      "2 pieces each would only use 4 of the 8 pieces — half would be left over! "
      + "We want to share ALL 8 pieces between 2 astronauts. How many each?",
    next: "s3-how-many",
    sfx: "soft-bell",
  },

  "s3-wrong-eight": {
    id: "s3-wrong-eight",
    type: "narrate",
    tutorText:
      "8 each would need 16 pieces, but we only have 8! "
      + "Remember: 8 pieces, 2 astronauts, share them all fairly.",
    next: "s3-how-many",
    sfx: "soft-bell",
  },

  "s3-pieces-correct": {
    id: "s3-pieces-correct",
    type: "narrate",
    tutorText:
      "That's it — 4 pieces each! Go ahead and share them out.",
    next: "s3-distribute",
    sfx: "chime",
  },

  "s3-distribute": {
    id: "s3-distribute",
    type: "distribute",
    taskHeader: "Give each astronaut 4 pieces of the space cracker!",
    tutorText:
      "Drag 4 pieces to Commander Luna and 4 pieces to Pilot Cosmo.",
    cookieCount: 8,
    characterCount: 2,
    expectedPerPerson: 4,
    next: "s3-show-eighths",
    sfx: "soft-bell",
  },

  "s3-show-eighths": {
    id: "s3-show-eighths",
    type: "show-fraction",
    tutorText:
      "Each astronaut got 4 pieces out of 8. "
      + "We write that as four-eighths!",
    showFractionNum: 4,
    showFractionDen: 8,
    next: "s3-think-back",
    sfx: "sparkle",
  },

  "s3-think-back": {
    id: "s3-think-back",
    type: "narrate",
    tutorText:
      "Hmm, let's think about this. Last time we cut into 4 pieces "
      + "and each astronaut got 2/4. Now we cut into 8 pieces "
      + "and each astronaut got 4/8. Did the amount of food change?",
    next: "s3-same-check",
    sfx: "gentle-whoosh",
  },

  "s3-same-check": {
    id: "s3-same-check",
    type: "choice",
    tutorText:
      "Is 4/8 the same amount as 2/4?",
    choices: [
      { label: "Yes, the same!", next: "s3-same-correct", correct: true },
      { label: "No, 4/8 is more", next: "s3-wrong-more" },
      { label: "No, 2/4 is more", next: "s3-wrong-2-4-more" },
    ],
  },

  "s3-wrong-more": {
    id: "s3-wrong-more",
    type: "narrate",
    tutorText:
      "The numbers are bigger, but the pieces are smaller! "
      + "4 tiny eighth-pieces fit together to make the same amount as 2 quarter-pieces. "
      + "Think of it like this: we just cut the same food into more slices. Let's try again!",
    next: "s3-same-check",
    sfx: "soft-bell",
  },

  "s3-wrong-2-4-more": {
    id: "s3-wrong-2-4-more",
    type: "narrate",
    tutorText:
      "I see why it might look that way! But try putting 4 eighth-pieces together — "
      + "they'd form exactly the same amount as 2 quarter-pieces. "
      + "Same cracker, just more cuts! Try again.",
    next: "s3-same-check",
    sfx: "soft-bell",
  },

  "s3-same-correct": {
    id: "s3-same-correct",
    type: "narrate",
    tutorText:
      "You're absolutely right! 4/8 and 2/4 are the same amount. "
      + "And guess what? They're BOTH the same as 1/2! "
      + "Three different fractions — one-half, two-fourths, four-eighths — "
      + "all describe the exact same amount.",
    next: "s3-show-chain-1",
    sfx: "chime",
  },

  "s3-show-chain-1": {
    id: "s3-show-chain-1",
    type: "show-fraction",
    tutorText:
      "One-half...",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s3-show-chain-2",
    sfx: "sparkle",
  },

  "s3-show-chain-2": {
    id: "s3-show-chain-2",
    type: "show-fraction",
    tutorText:
      "...equals two-fourths...",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "s3-show-chain-3",
    sfx: "sparkle",
  },

  "s3-show-chain-3": {
    id: "s3-show-chain-3",
    type: "show-fraction",
    tutorText:
      "...equals four-eighths! They all mean the SAME thing!",
    showFractionNum: 4,
    showFractionDen: 8,
    next: "s3-final-quiz",
    sfx: "sparkle",
  },

  "s3-final-quiz": {
    id: "s3-final-quiz",
    type: "choice",
    tutorText:
      "Pop quiz, astronaut! Which of these fractions is "
      + "equivalent to 2/4?",
    choices: [
      { label: "4/8", next: "s3-final-correct", correct: true },
      { label: "3/8", next: "s3-final-wrong-38" },
      { label: "2/8", next: "s3-final-wrong-28" },
    ],
  },

  "s3-final-wrong-38": {
    id: "s3-final-wrong-38",
    type: "narrate",
    tutorText:
      "Not quite! 3/8 is a little less than half. "
      + "Remember: when we doubled both numbers in 2/4 "
      + "(2 becomes 4, and 4 becomes 8), we got...?",
    next: "s3-final-quiz",
    sfx: "soft-bell",
  },

  "s3-final-wrong-28": {
    id: "s3-final-wrong-28",
    type: "narrate",
    tutorText:
      "2/8 is actually only a quarter of the cracker — that's less than 2/4. "
      + "Think: we doubled the pieces from 4 to 8, "
      + "so we also need to double how many we take, from 2 to...?",
    next: "s3-final-quiz",
    sfx: "soft-bell",
  },

  "s3-final-correct": {
    id: "s3-final-correct",
    type: "narrate",
    tutorText:
      "That's it! 2/4 = 4/8. You doubled the number of pieces "
      + "AND doubled how many you take, so the amount stays the same. "
      + "You really understand equivalent fractions!",
    next: "finale-1",
    sfx: "chime",
  },

  // ===========================================================================
  // FINALE — Celebration
  // ===========================================================================

  "finale-1": {
    id: "finale-1",
    type: "narrate",
    tutorText:
      "Commander Luna floats over to the intercom. \"Attention, Space Station Solaris! "
      + "Our newest crew member just made an amazing discovery!\"",
    next: "finale-2",
    sfx: "harp-gliss",
  },

  "finale-2": {
    id: "finale-2",
    type: "narrate",
    tutorText:
      "\"Fractions can LOOK different but mean the SAME amount! "
      + "1/2, 2/4, and 4/8 are all equal. "
      + "It's like magic — but it's math!\"",
    next: "finale-3",
    sfx: "gentle-whoosh",
  },

  "finale-3": {
    id: "finale-3",
    type: "narrate",
    tutorText:
      "The whole crew cheers! Pilot Cosmo does a zero-gravity backflip. "
      + "Chef Nebula tosses tiny cracker crumbs that sparkle as they float. "
      + "You did an incredible job today, astronaut!",
    next: "finale-4",
    sfx: "music-box",
  },

  "finale-4": {
    id: "finale-4",
    type: "narrate",
    tutorText:
      "Remember: whenever you cut something into MORE equal pieces, "
      + "the pieces get smaller — but you get MORE of them. "
      + "The total amount stays the same. That's the secret of equivalent fractions!",
    next: "end",
    sfx: "warm-pad",
  },

};
