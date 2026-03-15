// lessonData.ts — "Pirate Treasure" (Fraction Equivalence)
// Pirates on a tropical island share treasure maps and gold bars equally.
// The lesson builds from halves to discovering that 1/2 = 2/4,
// then practices with 1/3 = 2/6. Warm, adventurous tone for ages 6–8.

export type StepType =
  | "narrate"           // Tutor speaks, continue button
  | "choice"            // Multiple choice buttons
  | "distribute"        // Kid distributes cookies to characters
  | "slice"             // Kid clicks cookie to slice
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
// The lesson — ~48 steps across 3 stages + finale
// ---------------------------------------------------------------------------
//
// Stage 1 — Review halves:       1 gold bar, 2 pirates → ½ each
// Stage 2 — Discover equivalence: 1 gold bar, 4 pirates → show 2/4 = 1/2
// Stage 3 — Practice equivalence: 1 gold bar, 3 then 6 → show 1/3 = 2/6
// Finale  — Celebrate the discovery
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
  // STAGE 1 — Review halves: 1 gold bar, 2 pirates → ½ each
  // ===========================================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText:
      "Ahoy, young pirate! Welcome to Treasure Island. "
      + "The palm trees are swaying, the waves are sparkling, "
      + "and Captain Coral and First Mate Finn just dug up a shiny gold bar!",
    next: "s1-setup",
    sfx: "warm-pad",
  },

  "s1-setup": {
    id: "s1-setup",
    type: "narrate",
    tutorText:
      "There's one gold bar and two pirates who found it together. "
      + "Pirates always share their treasure fairly — that's the Pirate Code! "
      + "Let's help them figure out how to split it.",
    next: "s1-how-split",
    sfx: "harp-gliss",
  },

  "s1-how-split": {
    id: "s1-how-split",
    type: "choice",
    tutorText:
      "We have 1 gold bar and 2 pirates. "
      + "How should we share it so both pirates get the same amount?",
    choices: [
      { label: "Cut the bar into 2 equal pieces", next: "s1-slice", correct: true },
      { label: "Give the whole bar to Captain Coral", next: "s1-wrong-whole" },
      { label: "Throw it back in the sand", next: "s1-wrong-toss" },
    ],
  },

  "s1-wrong-whole": {
    id: "s1-wrong-whole",
    type: "narrate",
    tutorText:
      "But then First Mate Finn wouldn't get any treasure at all! "
      + "The Pirate Code says every pirate gets a fair share. "
      + "What if we split the bar into equal pieces so both pirates get some?",
    next: "s1-how-split",
    sfx: "gentle-whoosh",
  },

  "s1-wrong-toss": {
    id: "s1-wrong-toss",
    type: "narrate",
    tutorText:
      "Ha! That would be a waste of perfectly good treasure! "
      + "Both pirates worked hard to dig it up. "
      + "Let's think of a way to share it so each pirate gets an equal piece.",
    next: "s1-how-split",
    sfx: "gentle-whoosh",
  },

  "s1-slice": {
    id: "s1-slice",
    type: "slice",
    tutorText:
      "Great idea! Tap the gold bar to slice it right down the middle. "
      + "One clean cut — just like a pirate's cutlass!",
    next: "s1-post-slice",
    sfx: "gentle-whoosh",
  },

  "s1-post-slice": {
    id: "s1-post-slice",
    type: "narrate",
    tutorText:
      "Nicely done! The gold bar is now in 2 equal pieces. "
      + "When you split something into 2 equal parts, "
      + "each part is called one half. Now let's hand them out.",
    next: "s1-distribute-halves",
    sfx: "chime",
  },

  "s1-distribute-halves": {
    id: "s1-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Give one half to Captain Coral and one half to First Mate Finn. "
      + "Fair and square!",
    characterCount: 2,
    next: "s1-how-much",
    sfx: "xylophone",
  },

  "s1-how-much": {
    id: "s1-how-much",
    type: "choice",
    tutorText:
      "Each pirate got one piece, and the bar was cut into 2 equal pieces. "
      + "How much of the gold bar does each pirate have?",
    choices: [
      { label: "One half", next: "s1-show-fraction", correct: true },
      { label: "One whole bar", next: "s1-wrong-whole-bar" },
      { label: "One quarter", next: "s1-wrong-quarter" },
    ],
  },

  "s1-wrong-whole-bar": {
    id: "s1-wrong-whole-bar",
    type: "narrate",
    tutorText:
      "Not quite — if each pirate had one whole bar, we'd need 2 bars! "
      + "But we only had 1 bar and cut it into 2 equal pieces. "
      + "Each pirate got 1 piece out of 2. What do we call that?",
    next: "s1-how-much",
    sfx: "gentle-whoosh",
  },

  "s1-wrong-quarter": {
    id: "s1-wrong-quarter",
    type: "narrate",
    tutorText:
      "A quarter means the bar would be cut into 4 pieces, "
      + "but we only cut it into 2 pieces. Each pirate got 1 of those 2 pieces. "
      + "What do we call 1 piece out of 2?",
    next: "s1-how-much",
    sfx: "gentle-whoosh",
  },

  "s1-show-fraction": {
    id: "s1-show-fraction",
    type: "show-fraction",
    tutorText:
      "That's right — one half! Here's how we write it as a fraction. "
      + "The bottom number, 2, means the bar was cut into 2 equal pieces. "
      + "The top number, 1, means each pirate got 1 of those pieces.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s1-celebrate",
    sfx: "sparkle",
  },

  "s1-celebrate": {
    id: "s1-celebrate",
    type: "narrate",
    tutorText:
      "Captain Coral and First Mate Finn each have one half of the gold bar. "
      + "Fair shares, happy pirates! Now let's see what happens "
      + "when more pirates join the crew...",
    next: "s2-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 2 — Discover equivalence: 1/2 = 2/4
  // ===========================================================================

  "s2-intro": {
    id: "s2-intro",
    type: "narrate",
    tutorText:
      "Two more pirates just paddled to shore — Bosun Bea and Lookout Leo! "
      + "They found another gold bar buried under a coconut tree. "
      + "Now there are 4 pirates and 1 new gold bar to share.",
    next: "s2-plan",
    sfx: "harp-gliss",
  },

  "s2-plan": {
    id: "s2-plan",
    type: "choice",
    tutorText:
      "1 gold bar, 4 pirates. "
      + "How many equal pieces should we cut the bar into "
      + "so every pirate gets a fair share?",
    choices: [
      { label: "4 pieces", next: "s2-slice", correct: true },
      { label: "2 pieces", next: "s2-wrong-two" },
      { label: "8 pieces", next: "s2-wrong-eight" },
    ],
  },

  "s2-wrong-two": {
    id: "s2-wrong-two",
    type: "narrate",
    tutorText:
      "2 pieces would work for 2 pirates, but now we have 4! "
      + "We need enough pieces so every pirate gets exactly one piece. "
      + "How many pieces do we need for 4 pirates?",
    next: "s2-plan",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-eight": {
    id: "s2-wrong-eight",
    type: "narrate",
    tutorText:
      "8 pieces would work, but each pirate would get 2 tiny pieces. "
      + "Let's keep it simple — we just need one piece per pirate. "
      + "If there are 4 pirates, how many pieces do we need?",
    next: "s2-plan",
    sfx: "gentle-whoosh",
  },

  "s2-slice": {
    id: "s2-slice",
    type: "slice",
    tutorText:
      "4 pieces for 4 pirates — perfect! "
      + "Tap the gold bar to slice it into 4 equal parts. "
      + "These smaller pieces are called quarters!",
    next: "s2-post-slice",
    sfx: "gentle-whoosh",
  },

  "s2-post-slice": {
    id: "s2-post-slice",
    type: "narrate",
    tutorText:
      "Look at that — 4 equal pieces, all the same size. "
      + "Each piece is one quarter of the gold bar. "
      + "Let's give one quarter to each pirate.",
    next: "s2-distribute-quarters",
    sfx: "chime",
  },

  "s2-distribute-quarters": {
    id: "s2-distribute-quarters",
    type: "distribute-halves",
    tutorText:
      "Hand one quarter-piece to each of the 4 pirates. "
      + "One for Coral, one for Finn, one for Bea, one for Leo!",
    characterCount: 4,
    next: "s2-each-got",
    sfx: "xylophone",
  },

  "s2-each-got": {
    id: "s2-each-got",
    type: "choice",
    tutorText:
      "Each pirate got 1 piece, and the bar was cut into 4 equal pieces. "
      + "How much of the gold bar does each pirate have?",
    choices: [
      { label: "One quarter", next: "s2-show-quarter", correct: true },
      { label: "One half", next: "s2-wrong-half" },
      { label: "One whole bar", next: "s2-wrong-one" },
    ],
  },

  "s2-wrong-half": {
    id: "s2-wrong-half",
    type: "narrate",
    tutorText:
      "One half means the bar was cut into 2 pieces, "
      + "but we cut this bar into 4 pieces. "
      + "Each pirate got 1 piece out of 4. What is that called?",
    next: "s2-each-got",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-one": {
    id: "s2-wrong-one",
    type: "narrate",
    tutorText:
      "If each pirate had a whole bar, we'd need 4 bars! "
      + "But we only had 1 bar cut into 4 pieces. "
      + "Each pirate got 1 piece out of 4. What fraction is that?",
    next: "s2-each-got",
    sfx: "gentle-whoosh",
  },

  "s2-show-quarter": {
    id: "s2-show-quarter",
    type: "show-fraction",
    tutorText:
      "Right — one quarter! The bottom number, 4, means "
      + "the bar was cut into 4 equal pieces. "
      + "The top number, 1, means each pirate got 1 piece.",
    showFractionNum: 1,
    showFractionDen: 4,
    next: "s2-big-question",
    sfx: "sparkle",
  },

  "s2-big-question": {
    id: "s2-big-question",
    type: "narrate",
    tutorText:
      "Now here's where the treasure hunt gets really interesting! "
      + "Captain Coral is looking at her quarter-piece and thinking. "
      + "She says: \"Wait — what if two pirates put their quarters together? "
      + "How much would that be?\"",
    next: "s2-two-quarters",
    sfx: "harp-gliss",
  },

  "s2-two-quarters": {
    id: "s2-two-quarters",
    type: "choice",
    tutorText:
      "Imagine Coral and Finn put their 2 quarter-pieces side by side. "
      + "The bar had 4 pieces, and now we're looking at 2 of them together. "
      + "What fraction is 2 pieces out of 4?",
    choices: [
      { label: "2 quarters — that's 2/4", next: "s2-show-two-quarters", correct: true },
      { label: "1 quarter", next: "s2-wrong-still-one" },
      { label: "4 quarters", next: "s2-wrong-four" },
    ],
  },

  "s2-wrong-still-one": {
    id: "s2-wrong-still-one",
    type: "narrate",
    tutorText:
      "Each pirate has 1 quarter, but we're putting two pirates' pieces together! "
      + "1 quarter plus 1 more quarter... how many quarter-pieces is that in total?",
    next: "s2-two-quarters",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-four": {
    id: "s2-wrong-four",
    type: "narrate",
    tutorText:
      "4 quarters would be the whole bar! "
      + "We're only combining 2 pirates' shares. "
      + "Coral has 1 quarter and Finn has 1 quarter. Together that's how many quarters?",
    next: "s2-two-quarters",
    sfx: "gentle-whoosh",
  },

  "s2-show-two-quarters": {
    id: "s2-show-two-quarters",
    type: "show-fraction",
    tutorText:
      "Yes! 2 pieces out of 4 — we write that as two-fourths. "
      + "2 on top, 4 on the bottom. Now look closely at those 2 pieces...",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "s2-compare-setup",
    sfx: "sparkle",
  },

  "s2-compare-setup": {
    id: "s2-compare-setup",
    type: "narrate",
    tutorText:
      "Captain Coral just noticed something amazing! "
      + "\"Look,\" she says. \"Those 2 quarter-pieces side by side... "
      + "they take up exactly the same amount of the gold bar as one half did! "
      + "Remember when we split a bar between just 2 pirates?\"",
    next: "s2-aha-choice",
    sfx: "harp-gliss",
  },

  "s2-aha-choice": {
    id: "s2-aha-choice",
    type: "choice",
    tutorText:
      "Two quarters of the bar takes up the same space as one half of the bar. "
      + "That means 2/4 and 1/2 are...",
    choices: [
      { label: "The same amount! 2/4 equals 1/2!", next: "s2-eureka", correct: true },
      { label: "Different amounts", next: "s2-wrong-different" },
    ],
  },

  "s2-wrong-different": {
    id: "s2-wrong-different",
    type: "narrate",
    tutorText:
      "Let's look again! When we had 2 pirates, we cut the bar in half — "
      + "each half was a big piece. With 4 pirates, we made smaller pieces, "
      + "but 2 of those smaller pieces fit together to make the exact same size "
      + "as one half. Same amount of gold, just cut differently!",
    next: "s2-aha-choice",
    sfx: "gentle-whoosh",
  },

  "s2-eureka": {
    id: "s2-eureka",
    type: "narrate",
    tutorText:
      "You discovered pirate treasure AND a math secret! "
      + "One half and two fourths are the same amount — "
      + "they're just cut into different numbers of pieces. "
      + "Fractions can look different but mean the exact same thing!",
    next: "s2-show-equivalence",
    sfx: "music-box",
  },

  "s2-show-equivalence": {
    id: "s2-show-equivalence",
    type: "show-fraction",
    tutorText:
      "Look: 1/2 equals 2/4. The gold bar is the same size — "
      + "we just sliced it into more pieces! "
      + "When two fractions show the same amount, "
      + "we call them equivalent fractions.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s2-check",
    sfx: "sparkle",
  },

  "s2-check": {
    id: "s2-check",
    type: "choice",
    tutorText:
      "Quick treasure check! If you have 2/4 of a gold bar, "
      + "is that the same as having 1/2 of the bar?",
    choices: [
      { label: "Yes — 2/4 and 1/2 are the same amount!", next: "s2-well-done", correct: true },
      { label: "No, they're different", next: "s2-check-wrong" },
    ],
  },

  "s2-check-wrong": {
    id: "s2-check-wrong",
    type: "narrate",
    tutorText:
      "Think about the gold bar. If you cut it in half, you get 1 big piece out of 2. "
      + "If you cut it into 4 pieces and take 2, you get the same amount of gold! "
      + "The pieces are smaller, but you have more of them. Same treasure!",
    next: "s2-check",
    sfx: "gentle-whoosh",
  },

  "s2-well-done": {
    id: "s2-well-done",
    type: "narrate",
    tutorText:
      "Exactly right! The crew is impressed. Captain Coral is drawing "
      + "this discovery on the treasure map so no pirate ever forgets. "
      + "Now let's see if this works with other fractions too!",
    next: "s3-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 3 — Practice another equivalence: 1/3 = 2/6
  // ===========================================================================

  "s3-intro": {
    id: "s3-intro",
    type: "narrate",
    tutorText:
      "The pirates found one more gold bar hidden in a treasure chest! "
      + "This time, 3 pirates — Coral, Finn, and Bea — will share it. "
      + "Leo is on lookout duty, keeping watch from the crow's nest.",
    next: "s3-split-three",
    sfx: "harp-gliss",
  },

  "s3-split-three": {
    id: "s3-split-three",
    type: "slice",
    tutorText:
      "1 gold bar, 3 pirates. Tap the bar to slice it into 3 equal pieces. "
      + "Each piece is called one third!",
    next: "s3-distribute-thirds",
    sfx: "gentle-whoosh",
  },

  "s3-distribute-thirds": {
    id: "s3-distribute-thirds",
    type: "distribute-halves",
    tutorText:
      "Hand one piece to each of the 3 pirates. "
      + "One third for Coral, one third for Finn, one third for Bea!",
    characterCount: 3,
    next: "s3-show-third",
    sfx: "xylophone",
  },

  "s3-show-third": {
    id: "s3-show-third",
    type: "show-fraction",
    tutorText:
      "Each pirate has one third — 1 piece out of 3 equal pieces. "
      + "The bottom says 3 pieces total, the top says each pirate got 1.",
    showFractionNum: 1,
    showFractionDen: 3,
    next: "s3-new-bar",
    sfx: "sparkle",
  },

  "s3-new-bar": {
    id: "s3-new-bar",
    type: "narrate",
    tutorText:
      "Now imagine this: what if we took another gold bar the exact same size, "
      + "but this time cut it into 6 equal pieces instead of 3? "
      + "Tinier pieces, but more of them. "
      + "Captain Coral wants to test something...",
    next: "s3-slice-six",
    sfx: "harp-gliss",
  },

  "s3-slice-six": {
    id: "s3-slice-six",
    type: "slice",
    tutorText:
      "Tap the new gold bar to slice it into 6 equal pieces. "
      + "Each tiny piece is called one sixth!",
    next: "s3-how-many-sixths",
    sfx: "gentle-whoosh",
  },

  "s3-how-many-sixths": {
    id: "s3-how-many-sixths",
    type: "choice",
    tutorText:
      "Now Coral takes 2 of those tiny sixth-pieces and lines them up. "
      + "She compares them to the 1 third-piece from before. "
      + "Do 2 sixths take up the same space as 1 third?",
    choices: [
      { label: "Yes! 2/6 is the same amount as 1/3!", next: "s3-correct-equiv", correct: true },
      { label: "No, they look different", next: "s3-wrong-different" },
    ],
  },

  "s3-wrong-different": {
    id: "s3-wrong-different",
    type: "narrate",
    tutorText:
      "The pieces do look different — one is a bigger chunk, "
      + "and the others are two smaller chunks. "
      + "But lay them side by side: 2 little sixth-pieces together "
      + "fill the exact same space as 1 third-piece. Same amount of gold!",
    next: "s3-how-many-sixths",
    sfx: "gentle-whoosh",
  },

  "s3-correct-equiv": {
    id: "s3-correct-equiv",
    type: "show-fraction",
    tutorText:
      "You got it! 2 sixths equals 1 third — another pair of equivalent fractions! "
      + "Different numbers, same amount of treasure.",
    showFractionNum: 2,
    showFractionDen: 6,
    next: "s3-pattern",
    sfx: "sparkle",
  },

  "s3-pattern": {
    id: "s3-pattern",
    type: "choice",
    tutorText:
      "We've discovered that 1/2 = 2/4, and now 1/3 = 2/6. "
      + "See the pattern? When you cut each piece into smaller pieces, "
      + "you get more pieces, but they show the same amount! "
      + "What's the secret?",
    choices: [
      { label: "If you double the pieces AND double what you take, it's the same!", next: "s3-pattern-correct", correct: true },
      { label: "I'm not sure yet", next: "s3-pattern-hint" },
    ],
  },

  "s3-pattern-hint": {
    id: "s3-pattern-hint",
    type: "narrate",
    tutorText:
      "Think about it like this: 1/2 became 2/4. "
      + "The 2 on the bottom doubled to 4, and the 1 on top doubled to 2. "
      + "Same thing happened with 1/3 becoming 2/6. "
      + "The 3 doubled to 6, and the 1 doubled to 2. "
      + "When both numbers double, the fraction stays the same!",
    next: "s3-pattern",
    sfx: "gentle-whoosh",
  },

  "s3-pattern-correct": {
    id: "s3-pattern-correct",
    type: "narrate",
    tutorText:
      "That's the big secret of equivalent fractions! "
      + "If you multiply the top AND the bottom by the same number, "
      + "you get a fraction that looks different but means the same thing. "
      + "It's like cutting treasure into smaller pieces — "
      + "the total amount of gold never changes!",
    next: "s3-final-quiz",
    sfx: "chime",
  },

  "s3-final-quiz": {
    id: "s3-final-quiz",
    type: "choice",
    tutorText:
      "One last treasure puzzle! If Captain Coral has 1/2 of a gold bar, "
      + "which of these is the same amount?",
    choices: [
      { label: "2/4", next: "s3-quiz-correct", correct: true },
      { label: "1/4", next: "s3-quiz-wrong-quarter" },
      { label: "3/4", next: "s3-quiz-wrong-three" },
    ],
  },

  "s3-quiz-wrong-quarter": {
    id: "s3-quiz-wrong-quarter",
    type: "narrate",
    tutorText:
      "1/4 is just one quarter — that's less than a half! "
      + "Remember, to find an equivalent fraction, "
      + "we need to multiply both the top and bottom by the same number. "
      + "1/2: if we double the 2 to get 4, we also double the 1 to get...",
    next: "s3-final-quiz",
    sfx: "gentle-whoosh",
  },

  "s3-quiz-wrong-three": {
    id: "s3-quiz-wrong-three",
    type: "narrate",
    tutorText:
      "3/4 is three quarters — that's more than a half! "
      + "To keep the same amount, we multiply top AND bottom by the same number. "
      + "Start with 1/2. Double the bottom: 4. Double the top: 2. "
      + "So the equivalent fraction is...",
    next: "s3-final-quiz",
    sfx: "gentle-whoosh",
  },

  "s3-quiz-correct": {
    id: "s3-quiz-correct",
    type: "show-fraction",
    tutorText:
      "2/4! Exactly right. 1/2 and 2/4 are equivalent fractions. "
      + "Same treasure, different slices!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "finale",
    sfx: "sparkle",
  },

  // ===========================================================================
  // FINALE — Celebrate the discovery
  // ===========================================================================

  "finale": {
    id: "finale",
    type: "narrate",
    tutorText:
      "You did it, pirate! Today you learned that fractions can look different "
      + "but mean the same amount. 1/2 is the same as 2/4. "
      + "1/3 is the same as 2/6. These are called equivalent fractions.",
    next: "finale-2",
    sfx: "music-box",
  },

  "finale-2": {
    id: "finale-2",
    type: "narrate",
    tutorText:
      "Captain Coral is marking all of this on the treasure map "
      + "with a big golden star. First Mate Finn is doing a little jig on the beach. "
      + "And you? You've earned your pirate hat!",
    next: "finale-3",
    sfx: "harp-gliss",
  },

  "finale-3": {
    id: "finale-3",
    type: "narrate",
    tutorText:
      "Whenever you see fractions out in the world — sharing pizza, "
      + "splitting a sandwich, or measuring ingredients — "
      + "remember: the same amount can be written many different ways. "
      + "That's the pirate's secret of fractions!",
    next: "done",
    sfx: "warm-pad",
  },

  "done": {
    id: "done",
    type: "narrate",
    tutorText:
      "Fair winds and following seas, young pirate! "
      + "The crew will be here whenever you want to sail back "
      + "and discover more fraction treasures. Until next time!",
    next: "end",
    sfx: "music-box",
  },
};
