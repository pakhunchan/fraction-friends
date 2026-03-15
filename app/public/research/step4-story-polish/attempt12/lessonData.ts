// lessonData-storyB.ts — "Midnight Snack" (Cozy Sleepover with Friendly Monsters)
// Warm, whispery, gentle bedtime-story energy. The narrator is a nurturing guide.
// Monsters are having a sleepover and sharing chocolate bars as a midnight snack.

export type StepType =
  | "narrate"           // Tutor speaks, continue button
  | "choice"            // Multiple choice buttons
  | "distribute"        // Kid distributes chocolate bars to monsters
  | "slice"             // Kid clicks chocolate bar to slice
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
  cookieCount?: number;       // number of chocolate bars
  characterCount?: number;    // number of monsters
  expectedPerPerson?: number;
  showNumber?: string;   // e.g. "1" or "1½"
  showFractionNum?: number;
  showFractionDen?: number;
  wholeNumber?: number;
  allowKnife?: boolean;
  sfx?: string;
}

// ---------------------------------------------------------------------------
// The lesson — 55 steps across 3 stages + finale
// ---------------------------------------------------------------------------
//
// Stage 1 — Clean division:     2 bars ÷ 2 monsters → 1 each
// Stage 2 — Introduce halves:   3 bars ÷ 2 monsters → 1½ each
// Stage 3 — Introduce quarters: 7 bars ÷ 4 monsters → 1¾ each
// Finale  — Cozy celebration, sleepy pride
//
// SFX palette:
//   chime        — a single, soft high chime (correct answer, moment of insight)
//   harp-gliss   — a gentle upward harp run (transitions, reveals)
//   warm-pad     — a slow warm chord swell (open / title moments)
//   soft-bell    — single mellow bell tone (chocolate bar placement)
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
      "Shhh... it's late at night and the house is very quiet. "
      + "But upstairs, in a blanket fort lit by fairy lights, "
      + "two friendly monsters are having a sleepover.",
    next: "start-2",
    sfx: "warm-pad",
  },

  "start-2": {
    id: "start-2",
    type: "narrate",
    tutorText:
      "Their tummies are rumbling. It's time for a midnight snack! "
      + "They've found some chocolate bars in the kitchen, "
      + "and they want to share them fairly. Will you help?",
    next: "s1-setup",
    sfx: "harp-gliss",
  },

  "s1-setup": {
    id: "s1-setup",
    type: "narrate",
    tutorText:
      "There are 2 chocolate bars on the blanket, "
      + "and 2 sleepy monsters waiting for their snack. "
      + "Let's make sure each monster gets the same amount.",
    next: "s1-distribute",
    sfx: "gentle-whoosh",
  },

  "s1-distribute": {
    id: "s1-distribute",
    type: "distribute",
    taskHeader: "Give each monster the same number of chocolate bars.",
    tutorText:
      "2 chocolate bars, 2 monsters. "
      + "Go ahead and drag each bar to a monster. "
      + "Take your time — there's no rush on a cozy night like this.",
    cookieCount: 2,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "s1-result",
    sfx: "soft-bell",
  },

  "s1-result": {
    id: "s1-result",
    type: "choice",
    tutorText:
      "Nicely done! Now tell me — how many chocolate bars does each monster get?",
    choices: [
      { label: "1 each", next: "s1-correct", correct: true },
      { label: "2 each", next: "s1-wrong-two" },
      { label: "Hide them under the pillow", next: "s1-wrong-pillow" },
    ],
  },

  "s1-wrong-two": {
    id: "s1-wrong-two",
    type: "narrate",
    tutorText:
      "Wouldn't that be lovely — two each! But we only have 2 bars total. "
      + "If one monster took 2, the other monster wouldn't get any, "
      + "and that wouldn't feel very fair at a sleepover, would it?",
    next: "s1-wrong-scaffold",
    sfx: "gentle-whoosh",
  },

  "s1-wrong-pillow": {
    id: "s1-wrong-pillow",
    type: "narrate",
    tutorText:
      "Ha! Hiding chocolate under the pillow is a classic sleepover move. "
      + "But these two monsters are looking at you with their big, hopeful eyes. "
      + "I think they'd rather share the snack together.",
    next: "s1-wrong-scaffold",
    sfx: "gentle-whoosh",
  },

  "s1-wrong-scaffold": {
    id: "s1-wrong-scaffold",
    type: "narrate",
    tutorText:
      "Here's a little trick: we have 2 bars and 2 monsters. "
      + "One bar goes to the first monster, one bar goes to the second. "
      + "That means each monster gets exactly 1.",
    next: "s1-show",
    sfx: "chime",
  },

  "s1-correct": {
    id: "s1-correct",
    type: "show-number",
    tutorText:
      "That's right — each monster gets exactly 1 chocolate bar. "
      + "2 bars shared between 2 monsters means 1 each. "
      + "Fair and square, just the way a sleepover snack should be.",
    showNumber: "1",
    next: "s1-reflect",
    sfx: "chime",
  },

  "s1-show": {
    id: "s1-show",
    type: "show-number",
    tutorText:
      "Each monster gets 1 chocolate bar. "
      + "2 shared equally between 2 is 1. That's sharing at its simplest.",
    showNumber: "1",
    next: "s1-reflect",
    sfx: "chime",
  },

  "s1-reflect": {
    id: "s1-reflect",
    type: "choice",
    tutorText:
      "We just divided 2 chocolate bars between 2 monsters and each got 1. "
      + "This is what division means — sharing equally. How does that feel?",
    choices: [
      { label: "Makes sense! Let's keep going.", next: "s2-intro" },
      { label: "Can I see that again?", next: "s1-review" },
    ],
  },

  "s1-review": {
    id: "s1-review",
    type: "narrate",
    tutorText:
      "Of course. Picture two monsters sitting side by side, "
      + "and two chocolate bars between them. "
      + "One bar slides to the left monster. One bar slides to the right. "
      + "Each has the same. That's division — sharing equally.",
    next: "s2-intro",
    sfx: "gentle-whoosh",
  },

  // ===========================================================================
  // STAGE 2 — Introduce halves: 3 chocolate bars, 2 monsters → 1½ each
  // ===========================================================================

  "s2-intro": {
    id: "s2-intro",
    type: "narrate",
    tutorText:
      "Now, something exciting happens. "
      + "One of the monsters peeks back into the kitchen "
      + "and finds one more chocolate bar! "
      + "That makes 3 bars total for our 2 monsters.",
    next: "s2-wonder",
    sfx: "harp-gliss",
  },

  "s2-wonder": {
    id: "s2-wonder",
    type: "narrate",
    tutorText:
      "Hmm... 3 bars and 2 monsters. "
      + "That's an odd number for an even number of monsters. "
      + "I wonder what will happen when we try to share them...",
    next: "s2-distribute",
    sfx: "gentle-whoosh",
  },

  "s2-distribute": {
    id: "s2-distribute",
    type: "distribute",
    taskHeader: "Share 3 chocolate bars between 2 monsters.",
    tutorText:
      "Give each monster as many whole bars as you can. "
      + "Let's see what happens with what's left over.",
    cookieCount: 3,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "s2-leftover",
    sfx: "soft-bell",
  },

  "s2-leftover": {
    id: "s2-leftover",
    type: "narrate",
    tutorText:
      "Look at that — each monster has 1 whole bar, "
      + "but there's still 1 chocolate bar sitting in the middle. "
      + "Both monsters are eyeing it hopefully.",
    next: "s2-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s2-leftover-choice": {
    id: "s2-leftover-choice",
    type: "choice",
    tutorText:
      "What should we do with that last chocolate bar?",
    choices: [
      { label: "Break it in half so each monster gets a piece.", next: "s2-slice-intro", correct: true },
      { label: "Let the monsters arm-wrestle for it.", next: "s2-wrong-wrestle" },
      { label: "Save it for breakfast.", next: "s2-wrong-breakfast" },
    ],
  },

  "s2-wrong-wrestle": {
    id: "s2-wrong-wrestle",
    type: "narrate",
    tutorText:
      "An arm-wrestling match in the blanket fort! That would be quite a sight. "
      + "But then only one monster would get the chocolate, "
      + "and the other might feel a little left out. "
      + "What if we could split it so both monsters get an equal piece?",
    next: "s2-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-breakfast": {
    id: "s2-wrong-breakfast",
    type: "narrate",
    tutorText:
      "Saving it for breakfast is a responsible idea — I like the way you think! "
      + "But both monsters are wide awake and snacky right now. "
      + "Maybe there's a way to share this one bar between them tonight?",
    next: "s2-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s2-slice-intro": {
    id: "s2-slice-intro",
    type: "narrate",
    tutorText:
      "Yes — snap it right down the middle! "
      + "One piece for each monster, perfectly equal. "
      + "Go ahead and tap the chocolate bar to break it in two.",
    next: "s2-do-slice",
    sfx: "harp-gliss",
  },

  "s2-do-slice": {
    id: "s2-do-slice",
    type: "slice",
    tutorText:
      "Tap the chocolate bar to snap it in half. "
      + "Right down the middle — nice and even.",
    next: "s2-post-slice",
    sfx: "gentle-whoosh",
  },

  "s2-post-slice": {
    id: "s2-post-slice",
    type: "narrate",
    tutorText:
      "Snap! Two equal pieces. "
      + "When we break something into two equal parts, "
      + "each part is called one half. "
      + "Now let's give each monster their piece.",
    next: "s2-distribute-halves",
    sfx: "chime",
  },

  "s2-distribute-halves": {
    id: "s2-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Give one half to each monster. "
      + "One piece here... and one piece there.",
    characterCount: 2,
    next: "s2-count-question",
    sfx: "xylophone",
  },

  "s2-count-question": {
    id: "s2-count-question",
    type: "choice",
    tutorText:
      "Now each monster has 1 whole chocolate bar and 1 half. "
      + "How many chocolate bars does each monster have altogether?",
    choices: [
      { label: "1", next: "s2-wrong-one" },
      { label: "1 and a half", next: "s2-count-correct", correct: true },
      { label: "2", next: "s2-wrong-two" },
    ],
  },

  "s2-wrong-one": {
    id: "s2-wrong-one",
    type: "narrate",
    tutorText:
      "You're right that each monster got 1 whole bar — good eye! "
      + "But look closely — there's a little extra piece sitting next to it. "
      + "That half-bar counts too! "
      + "What do you get when you add one whole bar and one half together?",
    next: "s2-count-question",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-two": {
    id: "s2-wrong-two",
    type: "narrate",
    tutorText:
      "Close! I can see why you might think 2 — "
      + "there is a whole bar and another piece. "
      + "But that extra piece isn't a whole bar, is it? "
      + "It's just half of one. So it's a little more than 1, but not quite 2.",
    next: "s2-count-question",
    sfx: "gentle-whoosh",
  },

  "s2-count-correct": {
    id: "s2-count-correct",
    type: "show-number",
    tutorText:
      "One and a half! Exactly right. "
      + "Each monster gets 1 whole chocolate bar and half of another. "
      + "That's a very satisfying midnight snack.",
    showNumber: "1½",
    next: "s2-fraction-ask",
    sfx: "chime",
  },

  "s2-fraction-ask": {
    id: "s2-fraction-ask",
    type: "choice",
    tutorText:
      "We know each monster gets one and a half bars. "
      + "Writing the 1 is easy. But the half — "
      + "do you know how we write 'half' as a number?",
    choices: [
      { label: "Yes, I know!", next: "s2-fraction-skip" },
      { label: "No, show me.", next: "s2-fraction-explain" },
    ],
  },

  "s2-fraction-skip": {
    id: "s2-fraction-skip",
    type: "narrate",
    tutorText:
      "Wonderful! Then this will look familiar. "
      + "Let me show you the fraction just to make sure we're on the same page.",
    next: "s2-show-fraction",
    sfx: "harp-gliss",
  },

  "s2-fraction-explain": {
    id: "s2-fraction-explain",
    type: "narrate",
    tutorText:
      "Mathematicians have a clever way to write 'half.' "
      + "They stack two numbers with a line between them. "
      + "The bottom number says how many equal pieces we made — that's 2. "
      + "The top number says how many pieces we have — that's 1.",
    next: "s2-show-fraction",
    sfx: "harp-gliss",
  },

  "s2-show-fraction": {
    id: "s2-show-fraction",
    type: "show-fraction",
    tutorText:
      "Here it is — one and one half. "
      + "The big 1 counts the whole chocolate bar. "
      + "The fraction ½ counts the piece. "
      + "Together, they tell us exactly how much each monster received.",
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
      "Both monsters are munching happily under the fairy lights. "
      + "Fair sharing feels good, doesn't it? "
      + "But the sleepover isn't over yet...",
    next: "s3-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 3 — Introduce quarters: 7 chocolate bars, 4 monsters → 1¾ each
  // ===========================================================================

  "s3-intro": {
    id: "s3-intro",
    type: "narrate",
    tutorText:
      "Just then, there's a gentle knock on the blanket fort door. "
      + "Two more monster friends have arrived, "
      + "carrying their own sleeping bags and stuffed animals. "
      + "Now there are 4 monsters at the sleepover!",
    next: "s3-setup",
    sfx: "harp-gliss",
  },

  "s3-setup": {
    id: "s3-setup",
    type: "narrate",
    tutorText:
      "The new arrivals are hungry too, of course. "
      + "Everyone rummages through the snack bag and finds 7 chocolate bars. "
      + "7 bars for 4 monsters. Let's figure this out together.",
    next: "s3-distribute",
    sfx: "gentle-whoosh",
  },

  "s3-distribute": {
    id: "s3-distribute",
    type: "distribute",
    taskHeader: "Share 7 chocolate bars equally between 4 monsters.",
    tutorText:
      "Start by giving each monster as many whole bars as you can. "
      + "Don't worry about the leftovers yet — "
      + "we'll handle those together.",
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
      "Each monster has 1 whole bar, and there are 3 bars left over. "
      + "Three chocolate bars, four hungry monsters. "
      + "We can't just hand out whole bars anymore.",
    next: "s3-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s3-leftover-choice": {
    id: "s3-leftover-choice",
    type: "choice",
    tutorText:
      "What should we do with the 3 leftover chocolate bars?",
    choices: [
      { label: "Cut each one into 4 equal pieces and share them.", next: "s3-slice-intro", correct: true },
      { label: "Stack them into a chocolate tower!", next: "s3-wrong-tower" },
      { label: "Tuck them into sleeping bags for later.", next: "s3-wrong-sleeping" },
    ],
  },

  "s3-wrong-tower": {
    id: "s3-wrong-tower",
    type: "narrate",
    tutorText:
      "A chocolate tower! Now that's creative thinking. "
      + "But I don't think the monsters would want to just look at the chocolate — "
      + "they'd like to eat it! "
      + "What if we split each leftover bar so every monster gets a fair piece?",
    next: "s3-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s3-wrong-sleeping": {
    id: "s3-wrong-sleeping",
    type: "narrate",
    tutorText:
      "Sneaking chocolate into sleeping bags — very sneaky! "
      + "But there are 3 bars and 4 monsters, so one would miss out. "
      + "That wouldn't feel very fair. "
      + "What if we cut the bars so everyone gets an equal share?",
    next: "s3-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s3-slice-intro": {
    id: "s3-slice-intro",
    type: "narrate",
    tutorText:
      "That's exactly right. We have 4 monsters, so we'll cut each leftover bar "
      + "into 4 equal pieces. Each piece will be one quarter of a bar. "
      + "Go ahead and tap each bar to slice it into quarters.",
    next: "s3-do-slice",
    sfx: "harp-gliss",
  },

  "s3-do-slice": {
    id: "s3-do-slice",
    type: "slice",
    tutorText:
      "Tap the chocolate bars to cut each one into 4 equal pieces.",
    next: "s3-post-slice",
    sfx: "gentle-whoosh",
  },

  "s3-post-slice": {
    id: "s3-post-slice",
    type: "narrate",
    tutorText:
      "Beautiful! 3 bars, each cut into 4 pieces — that's 12 little pieces. "
      + "And 12 pieces shared among 4 monsters means 3 pieces each. "
      + "Now let's hand them out.",
    next: "s3-distribute-quarters",
    sfx: "chime",
  },

  "s3-distribute-quarters": {
    id: "s3-distribute-quarters",
    type: "distribute-halves",
    tutorText:
      "Give each monster 3 quarter-pieces. "
      + "One piece, two pieces, three pieces — for every monster.",
    characterCount: 4,
    next: "s3-count-question",
    sfx: "xylophone",
  },

  "s3-count-question": {
    id: "s3-count-question",
    type: "choice",
    tutorText:
      "Each monster now has 1 whole bar and 3 quarter-pieces. "
      + "How much chocolate does each monster have altogether?",
    choices: [
      { label: "1 and three quarters", next: "s3-count-correct", correct: true },
      { label: "1 and a half", next: "s3-wrong-half" },
      { label: "2", next: "s3-wrong-two" },
    ],
  },

  "s3-wrong-half": {
    id: "s3-wrong-half",
    type: "narrate",
    tutorText:
      "That's a thoughtful guess! A half means 2 equal pieces out of 4. "
      + "But look carefully — each monster has 3 of the 4 pieces, not 2. "
      + "Three out of four pieces is more than a half. "
      + "What do we call three out of four?",
    next: "s3-count-question",
    sfx: "gentle-whoosh",
  },

  "s3-wrong-two": {
    id: "s3-wrong-two",
    type: "narrate",
    tutorText:
      "Almost! 2 would mean each monster has two complete bars. "
      + "But those 3 little pieces aren't quite a whole bar — "
      + "they're three quarters of one. A tiny bit less than 2. "
      + "Let's try again.",
    next: "s3-count-question",
    sfx: "gentle-whoosh",
  },

  "s3-count-correct": {
    id: "s3-count-correct",
    type: "narrate",
    tutorText:
      "One and three quarters. Yes! "
      + "Each monster got 1 whole bar plus 3 out of 4 pieces of another bar. "
      + "Three out of four — that's called three quarters.",
    next: "s3-fraction-ask",
    sfx: "chime",
  },

  "s3-fraction-ask": {
    id: "s3-fraction-ask",
    type: "choice",
    tutorText:
      "Do you know how to write three quarters as a fraction?",
    choices: [
      { label: "Yes, I think so!", next: "s3-fraction-skip" },
      { label: "No, show me please.", next: "s3-fraction-explain" },
    ],
  },

  "s3-fraction-skip": {
    id: "s3-fraction-skip",
    type: "narrate",
    tutorText:
      "Look at you go! Let me show you, just so we can admire it together.",
    next: "s3-show-fraction",
    sfx: "harp-gliss",
  },

  "s3-fraction-explain": {
    id: "s3-fraction-explain",
    type: "narrate",
    tutorText:
      "Remember how we wrote one half? Top number and bottom number "
      + "with a line in between. "
      + "For three quarters, the bottom number is 4 — "
      + "because we cut the bar into 4 pieces. "
      + "The top number is 3 — because each monster gets 3 of those pieces.",
    next: "s3-show-fraction",
    sfx: "harp-gliss",
  },

  "s3-show-fraction": {
    id: "s3-show-fraction",
    type: "show-fraction",
    tutorText:
      "Here it is — one and three quarters. "
      + "The 1 counts the whole bar. "
      + "The ¾ counts the three quarter-pieces. "
      + "Together: exactly what each monster received.",
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
      "Let's double-check our work. "
      + "We started with 7 bars and 4 monsters. "
      + "If each monster gets 1¾ bars, that uses up all 7. "
      + "Does that make sense?",
    choices: [
      { label: "Yes, that checks out!", next: "finale-intro" },
      { label: "Wait, how does 1¾ × 4 equal 7?", next: "s3-check-explain" },
    ],
  },

  "s3-check-explain": {
    id: "s3-check-explain",
    type: "narrate",
    tutorText:
      "Great question! Each monster gets 1 whole bar — that's 4 bars used up. "
      + "Then each monster gets ¾ of a bar — that's ¾ times 4, which is 3 bars. "
      + "4 whole bars plus 3 more bars equals 7. "
      + "It all adds up perfectly!",
    next: "finale-intro",
    sfx: "chime",
  },

  // ===========================================================================
  // FINALE
  // ===========================================================================

  "finale-intro": {
    id: "finale-intro",
    type: "narrate",
    tutorText:
      "All four monsters are curled up in their sleeping bags now, "
      + "happily full of chocolate. The fairy lights are twinkling softly. "
      + "And I want to tell you something important.",
    next: "finale-praise",
    sfx: "warm-pad",
  },

  "finale-praise": {
    id: "finale-praise",
    type: "narrate",
    tutorText:
      "What you just did — sharing 2 bars between 2, "
      + "then 3 between 2, then 7 between 4 — "
      + "that is real mathematics. You didn't just guess. "
      + "You thought carefully, and you made sure every monster "
      + "was treated fairly. That's something to be proud of.",
    next: "finale-close",
    sfx: "music-box",
  },

  "finale-close": {
    id: "finale-close",
    type: "narrate",
    tutorText:
      "Fractions aren't just numbers in a textbook. "
      + "They happen whenever you share a chocolate bar with your friends, "
      + "or split a sandwich in half, or divide up a pizza at a party. "
      + "Now that you understand them, you'll spot them everywhere. "
      + "Sleep tight, little mathematician. Sweet dreams.",
    next: "end",
    sfx: "music-box",
  },
};
