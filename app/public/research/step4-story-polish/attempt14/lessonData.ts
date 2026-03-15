// lessonData-storyD.ts — "Lab Experiment" (Curious & Scientific)
// Friendly monsters are scientists in a lab, dividing chocolate bar "specimens"
// equally for a taste-test experiment. The narrator is an encouraging science
// mentor who treats math like a fun experiment. Wonder-filled energy.

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
// The lesson — 43 steps across 3 stages + finale
// ---------------------------------------------------------------------------
//
// Stage 1 — Clean division:     2 bars ÷ 2 monsters → 1 each
// Stage 2 — Introduce halves:   3 bars ÷ 2 monsters → 1½ each
// Stage 3 — Introduce quarters: 7 bars ÷ 4 monsters → 1¾ each
// Finale  — Celebrate the experiment
//
// SFX palette:
//   chime        — a single, soft high chime (correct answer, moment of insight)
//   harp-gliss   — a gentle upward harp run (transitions, reveals)
//   warm-pad     — a slow warm chord swell (open / title moments)
//   soft-bell    — single mellow bell tone (cookie placement)
//   xylophone    — bright single xylophone note (small wins, placements)
//   music-box    — tinkling music-box phrase (celebration)
//   gentle-whoosh — soft air-brush (page transitions, "let's look at this")
//   sparkle      — high glittery shimmer (fraction reveal)
// ---------------------------------------------------------------------------

export const lessonSteps: Record<string, LessonStep> = {

  // ===========================================================================
  // STAGE 1 — Clean division: 2 chocolate bars, 2 monsters → 1 each
  // ===========================================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText:
      "Welcome to the Chocolate Lab! Our monster scientists have been waiting "
      + "all day for this moment. Today's experiment? Taste-testing chocolate bar specimens. "
      + "But every good experiment needs one thing: fairness.",
    next: "lab-intro-2",
    sfx: "warm-pad",
  },

  "lab-intro-2": {
    id: "lab-intro-2",
    type: "narrate",
    tutorText:
      "If one monster gets more chocolate than another, the data is ruined! "
      + "So our job is to divide every specimen equally. "
      + "Here's Trial One: 2 chocolate bars and 2 monster scientists at the lab bench.",
    next: "s1-distribute",
    sfx: "harp-gliss",
  },

  "s1-distribute": {
    id: "s1-distribute",
    type: "distribute",
    taskHeader: "Give each monster the same number of chocolate bars.",
    tutorText:
      "2 chocolate bars, 2 monsters. Drag each specimen to a monster. "
      + "Take your time — precision matters in the lab!",
    cookieCount: 2,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "s1-how-many",
    sfx: "soft-bell",
  },

  "s1-how-many": {
    id: "s1-how-many",
    type: "choice",
    tutorText:
      "Great distribution! Now, for our lab notes: "
      + "how many chocolate bars did each monster receive?",
    choices: [
      { label: "1 bar each", next: "s1-correct", correct: true },
      { label: "2 bars each", next: "s1-wrong-two" },
      { label: "Put it under the microscope to find out", next: "s1-wrong-microscope" },
    ],
  },

  "s1-wrong-two": {
    id: "s1-wrong-two",
    type: "narrate",
    tutorText:
      "Hmm, 2 bars each would mean we'd need 4 bars total, "
      + "but we only started with 2. Let's recount. "
      + "We had 2 bars and 2 monsters. Each monster got one bar. "
      + "What's the answer?",
    next: "s1-how-many",
    sfx: "gentle-whoosh",
  },

  "s1-wrong-microscope": {
    id: "s1-wrong-microscope",
    type: "narrate",
    tutorText:
      "Ha! I love the scientific instinct, but we don't need a microscope for this one. "
      + "Just look at the lab bench. We started with 2 bars and split them "
      + "between 2 monsters. How many did each one get?",
    next: "s1-how-many",
    sfx: "gentle-whoosh",
  },

  "s1-correct": {
    id: "s1-correct",
    type: "show-number",
    tutorText:
      "Exactly! 1 bar per monster. Our first trial is a success! "
      + "When you divide 2 specimens between 2 scientists, each one gets 1. "
      + "Let's log that in our lab notebook.",
    showNumber: "1",
    next: "s1-reflect",
    sfx: "chime",
  },

  "s1-reflect": {
    id: "s1-reflect",
    type: "choice",
    tutorText:
      "That was division: splitting things into equal groups. "
      + "2 divided by 2 equals 1. Does that make sense so far?",
    choices: [
      { label: "Makes sense! Next experiment!", next: "s2-intro" },
      { label: "Can you explain division again?", next: "s1-explain-division" },
    ],
  },

  "s1-explain-division": {
    id: "s1-explain-division",
    type: "narrate",
    tutorText:
      "Of course! Division is just sharing equally. "
      + "Think of it like a lab rule: every scientist must get the exact same amount. "
      + "We count how many items we have, count how many scientists there are, "
      + "and then deal the items out one by one until they're all gone. "
      + "That's division!",
    next: "s2-intro",
    sfx: "gentle-whoosh",
  },

  // ===========================================================================
  // STAGE 2 — Introduce halves: 3 bars, 2 monsters → 1½ each
  // ===========================================================================

  "s2-intro": {
    id: "s2-intro",
    type: "narrate",
    tutorText:
      "Time for Trial Number Two! The delivery drone just dropped off "
      + "a new shipment: 3 chocolate bars this time. "
      + "But still only 2 monster scientists.",
    next: "s2-wonder",
    sfx: "harp-gliss",
  },

  "s2-wonder": {
    id: "s2-wonder",
    type: "narrate",
    tutorText:
      "3 bars and 2 monsters. Will the numbers divide evenly? "
      + "Only one way to find out. Let's run the experiment!",
    next: "s2-distribute",
    sfx: "gentle-whoosh",
  },

  "s2-distribute": {
    id: "s2-distribute",
    type: "distribute",
    taskHeader: "Share 3 chocolate bars between 2 monsters.",
    tutorText:
      "3 bars, 2 monster scientists. Give each monster as many whole bars as you can. "
      + "See what happens with any leftovers.",
    cookieCount: 3,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "s2-leftover-choice",
    sfx: "soft-bell",
  },

  "s2-leftover-choice": {
    id: "s2-leftover-choice",
    type: "choice",
    tutorText:
      "Each monster has 1 bar, but there's 1 left on the lab bench. "
      + "Both monsters are eyeing it through their safety goggles. "
      + "How should we handle this leftover specimen?",
    choices: [
      { label: "Cut it in half so each monster gets an equal piece.", next: "s2-do-slice", correct: true },
      { label: "Dissolve it in the beaker.", next: "s2-wrong-beaker" },
      { label: "Feed it to the lab hamster.", next: "s2-wrong-hamster" },
    ],
  },

  "s2-wrong-beaker": {
    id: "s2-wrong-beaker",
    type: "narrate",
    tutorText:
      "Dissolving chocolate in a beaker would be a fun chemistry experiment, "
      + "but then nobody gets to taste it! "
      + "Our monsters still need their specimen. "
      + "What if we split that last bar so both monsters get an equal piece?",
    next: "s2-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-hamster": {
    id: "s2-wrong-hamster",
    type: "narrate",
    tutorText:
      "The lab hamster would love that! But our two monster scientists "
      + "are the ones running this taste test, and they both want a fair share. "
      + "What if we could turn one bar into two equal pieces?",
    next: "s2-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s2-do-slice": {
    id: "s2-do-slice",
    type: "slice",
    tutorText:
      "Brilliant hypothesis! Tap the chocolate bar to slice it right down the middle. "
      + "Careful and precise, like a real scientist!",
    next: "s2-post-slice",
    sfx: "gentle-whoosh",
  },

  "s2-post-slice": {
    id: "s2-post-slice",
    type: "narrate",
    tutorText:
      "Specimen successfully divided! Two equal pieces. "
      + "When something is split into two equal parts, "
      + "each part is called one half. Now let's distribute them.",
    next: "s2-distribute-halves",
    sfx: "chime",
  },

  "s2-distribute-halves": {
    id: "s2-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Give one half to each monster scientist. "
      + "One piece here... and one piece there. Equal shares!",
    characterCount: 2,
    next: "s2-count-question",
    sfx: "xylophone",
  },

  "s2-count-question": {
    id: "s2-count-question",
    type: "choice",
    tutorText:
      "Let's record our findings. Each monster now has 1 whole bar "
      + "plus a piece of the bar we cut. "
      + "How much chocolate does each monster have in total?",
    choices: [
      { label: "1 bar", next: "s2-wrong-one" },
      { label: "1 and a half bars", next: "s2-count-correct", correct: true },
      { label: "2 bars", next: "s2-wrong-two" },
    ],
  },

  "s2-wrong-one": {
    id: "s2-wrong-one",
    type: "narrate",
    tutorText:
      "You're right that each monster got 1 whole bar — good observation! "
      + "But look closely at the lab bench. Do you see the extra half-piece "
      + "sitting next to each monster's whole bar? "
      + "We need to count that piece too. One whole bar, plus one half...",
    next: "s2-count-question",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-two": {
    id: "s2-wrong-two",
    type: "narrate",
    tutorText:
      "2 bars each would mean 4 bars total, but we only had 3 in our shipment! "
      + "Each monster has 1 whole bar and one piece that's smaller than a whole bar. "
      + "That piece is exactly half of a bar. So what's the total?",
    next: "s2-count-question",
    sfx: "gentle-whoosh",
  },

  "s2-count-correct": {
    id: "s2-count-correct",
    type: "show-number",
    tutorText:
      "Confirmed! 1 and a half bars per monster. "
      + "The experiment data checks out perfectly. "
      + "Let's record this result!",
    showNumber: "1½",
    next: "s2-know-fractions",
    sfx: "chime",
  },

  "s2-know-fractions": {
    id: "s2-know-fractions",
    type: "choice",
    tutorText:
      "In the science world, we need a precise way to write \"one half\" as a number. "
      + "Mathematicians invented something called a fraction for exactly this purpose. "
      + "Have you seen fractions before?",
    choices: [
      { label: "Yes, I know about fractions!", next: "s2-show-fraction" },
      { label: "No, show me!", next: "s2-fraction-explain" },
    ],
  },

  "s2-fraction-explain": {
    id: "s2-fraction-explain",
    type: "narrate",
    tutorText:
      "A fraction is two numbers stacked on top of each other with a line in between. "
      + "The bottom number tells you how many equal pieces the bar was cut into. "
      + "The top number tells you how many of those pieces you have. "
      + "It's like a tiny lab report for a piece of chocolate!",
    next: "s2-show-fraction",
    sfx: "harp-gliss",
  },

  "s2-show-fraction": {
    id: "s2-show-fraction",
    type: "show-fraction",
    tutorText:
      "Here's our lab result written as a fraction: 1 and one-half. "
      + "The 1 counts the whole bar. The fraction shows we also have "
      + "1 piece out of 2 equal pieces. One half!",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s2-celebrate",
    sfx: "sparkle",
  },

  "s2-celebrate": {
    id: "s2-celebrate",
    type: "narrate",
    tutorText:
      "Trial Two: complete! 3 bars divided by 2 monsters equals 1 and a half each. "
      + "The monsters are scribbling notes in their lab journals. "
      + "But the biggest experiment is still ahead...",
    next: "s3-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 3 — Introduce quarters: 7 bars, 4 monsters → 1¾ each
  // ===========================================================================

  "s3-intro": {
    id: "s3-intro",
    type: "narrate",
    tutorText:
      "Breaking news from the lab! Two more monster scientists just arrived "
      + "for the big experiment. That makes 4 monsters total. "
      + "And the supply closet has 7 chocolate bar specimens.",
    next: "s3-wonder",
    sfx: "harp-gliss",
  },

  "s3-wonder": {
    id: "s3-wonder",
    type: "narrate",
    tutorText:
      "7 bars, 4 monsters. This is our most advanced trial yet. "
      + "I have a feeling we'll need that cutting tool again. "
      + "Let's start by handing out whole bars and see what happens!",
    next: "s3-distribute",
    sfx: "gentle-whoosh",
  },

  "s3-distribute": {
    id: "s3-distribute",
    type: "distribute",
    taskHeader: "Share 7 chocolate bars equally between 4 monsters.",
    tutorText:
      "4 monster scientists, 7 chocolate bars. "
      + "Give each monster as many whole bars as you can. "
      + "Don't worry about the leftovers yet — we'll handle those next.",
    cookieCount: 7,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "s3-leftover-notice",
    sfx: "soft-bell",
  },

  "s3-leftover-notice": {
    id: "s3-leftover-notice",
    type: "narrate",
    tutorText:
      "Fascinating! Each monster has 1 whole bar, but there are 3 bars "
      + "left on the lab bench. All 4 monsters are adjusting their goggles "
      + "and staring at those leftover specimens.",
    next: "s3-leftover-plan",
    sfx: "gentle-whoosh",
  },

  "s3-leftover-plan": {
    id: "s3-leftover-plan",
    type: "choice",
    tutorText:
      "We have 3 leftover bars and 4 monsters. "
      + "What should we do with the remaining specimens?",
    choices: [
      { label: "Cut each leftover bar into 4 equal pieces.", next: "s3-do-slice", correct: true },
      { label: "Stack them and look at them under a magnifying glass.", next: "s3-wrong-magnify" },
      { label: "Cut each leftover bar in half.", next: "s3-wrong-halves" },
    ],
  },

  "s3-wrong-magnify": {
    id: "s3-wrong-magnify",
    type: "narrate",
    tutorText:
      "I admire the curiosity! But magnifying the chocolate won't make more of it. "
      + "We need to divide 3 bars among 4 monsters. "
      + "Since there are 4 monsters, think about how many pieces each bar needs to become. "
      + "How many equal pieces should we cut each bar into?",
    next: "s3-leftover-plan",
    sfx: "gentle-whoosh",
  },

  "s3-wrong-halves": {
    id: "s3-wrong-halves",
    type: "narrate",
    tutorText:
      "Good thinking — cutting is the right idea! But if we cut 3 bars in half, "
      + "we'd get 6 pieces. And 6 pieces don't split evenly among 4 monsters. "
      + "We need each bar to become 4 equal pieces, one for each monster. "
      + "How many pieces is that per bar?",
    next: "s3-leftover-plan",
    sfx: "gentle-whoosh",
  },

  "s3-do-slice": {
    id: "s3-do-slice",
    type: "slice",
    tutorText:
      "Perfect plan! Each bar becomes 4 equal pieces, one for each monster. "
      + "Tap the leftover bars to slice them. Precision cuts, lab assistant!",
    next: "s3-post-slice",
    sfx: "gentle-whoosh",
  },

  "s3-post-slice": {
    id: "s3-post-slice",
    type: "narrate",
    tutorText:
      "Beautiful work! Each bar is now in 4 equal pieces. "
      + "When something is split into 4 equal parts, each part is called one quarter. "
      + "Now let's give each monster their fair share of the pieces.",
    next: "s3-distribute-halves",
    sfx: "chime",
  },

  "s3-distribute-halves": {
    id: "s3-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Distribute the quarter-pieces so each monster gets 3 pieces. "
      + "One from each of the 3 bars we cut up!",
    characterCount: 4,
    next: "s3-count-question",
    sfx: "xylophone",
  },

  "s3-count-question": {
    id: "s3-count-question",
    type: "choice",
    tutorText:
      "Time to record our data! Each monster has 1 whole bar plus 3 quarter-pieces. "
      + "How much chocolate does each monster have altogether?",
    choices: [
      { label: "1 and three-quarters bars", next: "s3-count-correct", correct: true },
      { label: "1 and a half bars", next: "s3-wrong-half" },
      { label: "2 bars", next: "s3-wrong-two" },
    ],
  },

  "s3-wrong-half": {
    id: "s3-wrong-half",
    type: "narrate",
    tutorText:
      "Close, but let's look at the data more carefully! "
      + "A half means 2 pieces out of 4. But each monster got 3 pieces out of 4. "
      + "3 out of 4 is more than a half. What do we call 3 out of 4?",
    next: "s3-count-question",
    sfx: "gentle-whoosh",
  },

  "s3-wrong-two": {
    id: "s3-wrong-two",
    type: "narrate",
    tutorText:
      "Not quite — 2 whole bars each would need 8 bars total, and we only had 7! "
      + "Each monster has 1 whole bar and 3 quarter-pieces. "
      + "Three-quarters is close to a whole bar, but not quite there. "
      + "So each monster has 1 and how much more?",
    next: "s3-count-question",
    sfx: "gentle-whoosh",
  },

  "s3-count-correct": {
    id: "s3-count-correct",
    type: "show-number",
    tutorText:
      "Yes! The experimental result is confirmed: 1 and three-quarters bars per monster! "
      + "Outstanding lab work. Let's write that as a fraction.",
    showNumber: "1¾",
    next: "s3-show-fraction",
    sfx: "chime",
  },

  "s3-show-fraction": {
    id: "s3-show-fraction",
    type: "show-fraction",
    tutorText:
      "Here's how a scientist writes it. The whole number 1 for the complete bar. "
      + "Then a fraction: 3 on top, 4 on the bottom. Three-quarters. "
      + "The bottom number says each bar was cut into 4 pieces. "
      + "The top number says each monster got 3 of those pieces.",
    wholeNumber: 1,
    showFractionNum: 3,
    showFractionDen: 4,
    next: "s3-verify",
    sfx: "sparkle",
  },

  "s3-verify": {
    id: "s3-verify",
    type: "choice",
    tutorText:
      "Let's double-check our experiment. Does 1 and three-quarters times 4 monsters "
      + "account for all 7 bars?",
    choices: [
      { label: "Yes — 4 whole bars + 12 quarters = 4 + 3 = 7!", next: "finale", correct: true },
      { label: "I'm not sure, can you show me?", next: "s3-verify-explain" },
    ],
  },

  "s3-verify-explain": {
    id: "s3-verify-explain",
    type: "narrate",
    tutorText:
      "Each monster got 1 whole bar, so that's 4 whole bars for 4 monsters. "
      + "Then each monster got 3 quarter-pieces. 4 times 3 is 12 quarter-pieces, "
      + "which equals 3 whole bars. 4 plus 3 equals 7. Every specimen accounted for!",
    next: "finale",
    sfx: "gentle-whoosh",
  },

  // ===========================================================================
  // FINALE — Celebrate the experiment
  // ===========================================================================

  "finale": {
    id: "finale",
    type: "narrate",
    tutorText:
      "Lab assistant, I need to tell you something. What you just did was real "
      + "mathematics. You divided 2 by 2, then 3 by 2, then 7 by 4. "
      + "You discovered halves. You discovered quarters. "
      + "And you made sure every single monster got a perfectly fair share.",
    next: "done",
    sfx: "music-box",
  },

  "done": {
    id: "done",
    type: "narrate",
    tutorText:
      "Fractions aren't just something in a textbook. "
      + "They show up every time you split a sandwich with a friend, "
      + "or share a bag of trail mix among your crew. "
      + "You've proven you can handle any specimen that comes into this lab. "
      + "The monsters are already writing your name on a lab coat. "
      + "Come back anytime — there's always more to discover!",
    next: "end",
    sfx: "music-box",
  },
};
