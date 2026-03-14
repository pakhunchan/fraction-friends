// lessonData-storyA.ts — "Treasure Feast" (Adventurous & Excited energy)
// Friendly monsters found treasure (chocolate bars) in a cave and share them.
// Bouncy, enthusiastic narrator guides the learner through fair sharing.

export type StepType =
  | "narrate"           // Tutor speaks, continue button
  | "choice"            // Multiple choice buttons
  | "distribute"        // Kid distributes objects to characters
  | "slice"             // Kid clicks object to slice
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
  showNumber?: string;   // e.g. "1" or "1½"
  showFractionNum?: number;
  showFractionDen?: number;
  wholeNumber?: number;
  allowKnife?: boolean;
  sfx?: string;
}

// ---------------------------------------------------------------------------
// The lesson — ~42 steps across 3 stages + finale
// ---------------------------------------------------------------------------
//
// Stage 1 — Clean division:   2 bars ÷ 2 monsters → 1 each
// Stage 2 — Introduce halves: 3 bars ÷ 2 monsters → 1½ each
// Stage 3 — Introduce quarters: 7 bars ÷ 4 monsters → 1¾ each
// Finale  — Celebration & recap
//
// SFX palette:
//   chime        — a single, soft high chime (correct answer, moment of insight)
//   harp-gliss   — a gentle upward harp run (transitions, reveals)
//   warm-pad     — a slow warm chord swell (open / title moments)
//   soft-bell    — single mellow bell tone (bar placement)
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
      "Welcome, brave explorer! You just stumbled into the legendary Crystal Cave, "
      + "and guess what's glittering at the back? TREASURE! "
      + "But this isn't gold or jewels -- it's something even better...",
    next: "s1-reveal",
    sfx: "warm-pad",
  },

  "s1-reveal": {
    id: "s1-reveal",
    type: "narrate",
    tutorText:
      "Chocolate bars! The rarest, most delicious treasure in all the land! "
      + "And you're not alone -- your monster friends found the cave too. "
      + "They're bouncing on their toes and licking their lips. "
      + "We'd better share this treasure fairly!",
    next: "s1-meet-monsters",
    sfx: "harp-gliss",
  },

  "s1-meet-monsters": {
    id: "s1-meet-monsters",
    type: "narrate",
    tutorText:
      "Right now we've got 2 chocolate bars and 2 friendly monsters waiting for their share. "
      + "This is a Treasure Feast, and at a Treasure Feast, everybody eats equally! "
      + "Let's hand out the chocolate.",
    next: "s1-distribute",
    sfx: "gentle-whoosh",
  },

  "s1-distribute": {
    id: "s1-distribute",
    type: "distribute",
    taskHeader: "Give each monster the same number of chocolate bars.",
    tutorText:
      "We've got 2 chocolate bars and 2 monsters. "
      + "Drag each bar to a monster -- one for each! Take your time.",
    objectCount: 2,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "s1-quiz",
    sfx: "soft-bell",
  },

  "s1-quiz": {
    id: "s1-quiz",
    type: "choice",
    tutorText:
      "Awesome job handing those out! So tell me -- how many chocolate bars did each monster get?",
    choices: [
      { label: "1 each", next: "s1-correct", correct: true },
      { label: "2 each", next: "s1-wrong-two" },
      { label: "None -- they ate them too fast to count!", next: "s1-wrong-none" },
    ],
  },

  "s1-wrong-two": {
    id: "s1-wrong-two",
    type: "narrate",
    tutorText:
      "Two each would mean we'd need 4 bars total -- but we only had 2! "
      + "That's double what we actually have. "
      + "Look again at the monsters -- how many bars is each one holding?",
    next: "s1-quiz",
    sfx: "gentle-whoosh",
  },

  "s1-wrong-none": {
    id: "s1-wrong-none",
    type: "narrate",
    tutorText:
      "Ha! These monsters DO eat fast, but not THAT fast! "
      + "The bars are still right there in their paws. "
      + "Count the chocolate bars each monster is holding -- what do you see?",
    next: "s1-quiz",
    sfx: "gentle-whoosh",
  },

  "s1-correct": {
    id: "s1-correct",
    type: "show-number",
    tutorText:
      "That's right -- 1 each! Two bars split between two monsters means one bar per monster. "
      + "Fair and square! The monsters are doing a happy little dance.",
    showNumber: "1",
    next: "s1-reflect",
    sfx: "chime",
  },

  "s1-reflect": {
    id: "s1-reflect",
    type: "choice",
    tutorText:
      "We just divided 2 bars between 2 monsters and each got 1. "
      + "That's what sharing equally is all about! How are you feeling?",
    choices: [
      { label: "Easy peasy! Let's go!", next: "s2-intro" },
      { label: "Can you explain that again?", next: "s1-explain" },
    ],
  },

  "s1-explain": {
    id: "s1-explain",
    type: "narrate",
    tutorText:
      "Of course! We had 2 chocolate bars and 2 monsters. "
      + "We gave one bar to the first monster and one bar to the second monster. "
      + "Each monster ended up with exactly the same amount -- 1 bar. "
      + "That's division: splitting things into equal groups!",
    next: "s2-intro",
    sfx: "gentle-whoosh",
  },

  // ===========================================================================
  // STAGE 2 — Introduce halves: 3 bars ÷ 2 monsters → 1½ each
  // ===========================================================================

  "s2-intro": {
    id: "s2-intro",
    type: "narrate",
    tutorText:
      "Hold on -- the monsters just found MORE treasure deeper in the cave! "
      + "There are now 3 chocolate bars on the pile, and still 2 hungry monsters. "
      + "This is getting exciting!",
    next: "s2-wonder",
    sfx: "harp-gliss",
  },

  "s2-wonder": {
    id: "s2-wonder",
    type: "narrate",
    tutorText:
      "Hmm, 3 bars for 2 monsters... that's an odd number for an even pair. "
      + "I wonder if this will work out as neatly as last time? "
      + "Let's hand out the bars and see what happens!",
    next: "s2-distribute",
    sfx: "gentle-whoosh",
  },

  "s2-distribute": {
    id: "s2-distribute",
    type: "distribute",
    taskHeader: "Share 3 chocolate bars between 2 monsters.",
    tutorText:
      "Give each monster as many whole bars as you can, keeping it fair. "
      + "See what's left over when you're done!",
    objectCount: 3,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "s2-leftover",
    sfx: "soft-bell",
  },

  "s2-leftover": {
    id: "s2-leftover",
    type: "narrate",
    tutorText:
      "Uh oh -- look at that! Each monster has 1 bar, but there's still 1 bar sitting in the middle. "
      + "Both monsters are staring at it with big, hopeful eyes. "
      + "We can't just give it to one of them -- that wouldn't be fair!",
    next: "s2-choice",
    sfx: "gentle-whoosh",
  },

  "s2-choice": {
    id: "s2-choice",
    type: "choice",
    tutorText:
      "What should we do with that last chocolate bar?",
    choices: [
      { label: "Cut it in half so each monster gets a piece!", next: "s2-slice-intro", correct: true },
      { label: "Feed it to the cave bats.", next: "s2-wrong-bats" },
      { label: "Hide it under a rock for later.", next: "s2-wrong-hide" },
    ],
  },

  "s2-wrong-bats": {
    id: "s2-wrong-bats",
    type: "narrate",
    tutorText:
      "The cave bats are cute, but they prefer bugs over chocolate! "
      + "And our two monsters are still right here, hoping for more. "
      + "What if we could turn one bar into two equal pieces?",
    next: "s2-choice",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-hide": {
    id: "s2-wrong-hide",
    type: "narrate",
    tutorText:
      "Saving treasure for later is smart thinking! But both monsters can see the bar right there, "
      + "and a fair feast means nobody goes without. "
      + "Is there a way we could split that bar so each monster gets the same amount?",
    next: "s2-choice",
    sfx: "gentle-whoosh",
  },

  "s2-slice-intro": {
    id: "s2-slice-intro",
    type: "narrate",
    tutorText:
      "Yes! That's the adventurer's solution -- if you can't share it whole, break it in two! "
      + "Go ahead and tap the chocolate bar to slice it right down the middle.",
    next: "s2-do-slice",
    sfx: "harp-gliss",
  },

  "s2-do-slice": {
    id: "s2-do-slice",
    type: "slice",
    tutorText:
      "Tap the chocolate bar to split it into two equal halves. Right down the center!",
    next: "s2-post-slice",
    sfx: "gentle-whoosh",
  },

  "s2-post-slice": {
    id: "s2-post-slice",
    type: "narrate",
    tutorText:
      "SNAP! Two perfectly equal pieces! When we cut something into two equal parts, "
      + "each part is called one half. Now let's give one half to each monster.",
    next: "s2-distribute-halves",
    sfx: "chime",
  },

  "s2-distribute-halves": {
    id: "s2-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Drag one half to each monster. One piece here, one piece there -- everyone's happy!",
    characterCount: 2,
    next: "s2-count-quiz",
    sfx: "xylophone",
  },

  "s2-count-quiz": {
    id: "s2-count-quiz",
    type: "choice",
    tutorText:
      "Now each monster has 1 whole bar plus a half. "
      + "How much chocolate does each monster have altogether?",
    choices: [
      { label: "One and a half bars", next: "s2-count-correct", correct: true },
      { label: "Just one bar", next: "s2-count-wrong-one" },
      { label: "Two whole bars", next: "s2-count-wrong-two" },
    ],
  },

  "s2-count-wrong-one": {
    id: "s2-count-wrong-one",
    type: "narrate",
    tutorText:
      "You're right that each monster got one whole bar -- great counting! "
      + "But look at that extra piece in their paws. "
      + "That half-bar counts too! One whole bar plus one half makes...?",
    next: "s2-count-quiz",
    sfx: "gentle-whoosh",
  },

  "s2-count-wrong-two": {
    id: "s2-count-wrong-two",
    type: "narrate",
    tutorText:
      "Two whole bars would be a lot of chocolate! But look carefully -- "
      + "each monster has one full bar and one piece that's only half a bar. "
      + "That second piece isn't quite a whole bar. So it's one bar plus what?",
    next: "s2-count-quiz",
    sfx: "gentle-whoosh",
  },

  "s2-count-correct": {
    id: "s2-count-correct",
    type: "show-number",
    tutorText:
      "One and a half! You've got it! The monsters are so happy they're doing backflips! "
      + "Each one has 1 whole chocolate bar and half of another.",
    showNumber: "1½",
    next: "s2-know-fractions",
    sfx: "chime",
  },

  "s2-know-fractions": {
    id: "s2-know-fractions",
    type: "choice",
    tutorText:
      "Now, mathematicians have a super clever way to write 'one half' as a number. "
      + "It's called a fraction. Have you seen fractions before?",
    choices: [
      { label: "Yes, I know fractions!", next: "s2-fraction-skip" },
      { label: "No, show me!", next: "s2-fraction-explain" },
    ],
  },

  "s2-fraction-skip": {
    id: "s2-fraction-skip",
    type: "narrate",
    tutorText:
      "Fantastic -- then this will feel right at home! "
      + "Let me show you how we write what each monster got.",
    next: "s2-show-fraction",
    sfx: "harp-gliss",
  },

  "s2-fraction-explain": {
    id: "s2-fraction-explain",
    type: "narrate",
    tutorText:
      "No problem -- you're about to learn something really cool! "
      + "A fraction is a way to write down a part of something. "
      + "It has two numbers stacked on top of each other with a line between them.",
    next: "s2-fraction-explain2",
    sfx: "harp-gliss",
  },

  "s2-fraction-explain2": {
    id: "s2-fraction-explain2",
    type: "narrate",
    tutorText:
      "The bottom number tells you how many equal pieces the bar was cut into. "
      + "The top number tells you how many of those pieces you have. "
      + "Let me show you!",
    next: "s2-show-fraction",
    sfx: "gentle-whoosh",
  },

  "s2-show-fraction": {
    id: "s2-show-fraction",
    type: "show-fraction",
    tutorText:
      "Here it is -- one and one half! The big 1 is the whole bar. "
      + "The fraction says: the bar was cut into 2 pieces (that's the bottom number), "
      + "and each monster got 1 of those pieces (that's the top number). "
      + "One and one half chocolate bars!",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s3-transition",
    sfx: "sparkle",
  },

  // ===========================================================================
  // STAGE 3 — Introduce quarters: 7 bars ÷ 4 monsters → 1¾ each
  // ===========================================================================

  "s3-transition": {
    id: "s3-transition",
    type: "narrate",
    tutorText:
      "Wait -- do you hear that rumbling? Two MORE monsters just burst through the cave wall! "
      + "They're friendly, don't worry -- but they're VERY hungry. "
      + "Now we've got 4 monsters at the Treasure Feast!",
    next: "s3-setup",
    sfx: "harp-gliss",
  },

  "s3-setup": {
    id: "s3-setup",
    type: "narrate",
    tutorText:
      "And look at this -- there are 7 chocolate bars stacked up on the treasure pile! "
      + "7 bars for 4 monsters. This is our biggest challenge yet. "
      + "Are you ready, explorer?",
    next: "s3-distribute",
    sfx: "gentle-whoosh",
  },

  "s3-distribute": {
    id: "s3-distribute",
    type: "distribute",
    taskHeader: "Share 7 chocolate bars equally among 4 monsters.",
    tutorText:
      "Hand out the bars one at a time, keeping things even. "
      + "Give each monster as many whole bars as you can! "
      + "You've got a knife ready if you need it.",
    objectCount: 7,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "s3-leftover",
    sfx: "soft-bell",
  },

  "s3-leftover": {
    id: "s3-leftover",
    type: "narrate",
    tutorText:
      "Great work! Each monster has 1 whole bar, but look -- there are 3 bars left over! "
      + "Four monsters, three leftover bars. "
      + "We need to be clever about this. What should we do?",
    next: "s3-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s3-leftover-choice": {
    id: "s3-leftover-choice",
    type: "choice",
    tutorText:
      "We have 3 leftover bars and 4 monsters. What's our plan?",
    choices: [
      { label: "Cut each leftover bar into 4 equal pieces!", next: "s3-slice-intro", correct: true },
      { label: "Build a tiny chocolate castle with them.", next: "s3-wrong-castle" },
      { label: "Put them back in the treasure chest.", next: "s3-wrong-chest" },
    ],
  },

  "s3-wrong-castle": {
    id: "s3-wrong-castle",
    type: "narrate",
    tutorText:
      "A chocolate castle! That sounds amazing, but the monsters would rather eat the treasure "
      + "than admire it! We've got 4 hungry monsters and 3 bars to share. "
      + "Since there are 4 monsters, what if we cut each bar into 4 equal pieces?",
    next: "s3-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s3-wrong-chest": {
    id: "s3-wrong-chest",
    type: "narrate",
    tutorText:
      "But the whole point of a Treasure Feast is to enjoy the treasure! "
      + "The monsters are giving you puppy-dog eyes right now. "
      + "There must be a way to divide these 3 bars fairly among 4 monsters...",
    next: "s3-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s3-slice-intro": {
    id: "s3-slice-intro",
    type: "narrate",
    tutorText:
      "Exactly! If we cut each of the 3 leftover bars into 4 equal pieces, "
      + "we'll have 12 little pieces. That's 3 pieces for each of the 4 monsters! "
      + "Let's slice them up!",
    next: "s3-do-slice",
    sfx: "harp-gliss",
  },

  "s3-do-slice": {
    id: "s3-do-slice",
    type: "slice",
    tutorText:
      "Tap each chocolate bar to cut it into 4 equal pieces -- those are called quarters!",
    next: "s3-distribute-quarters",
    sfx: "gentle-whoosh",
  },

  "s3-distribute-quarters": {
    id: "s3-distribute-quarters",
    type: "distribute-halves",
    tutorText:
      "Now give 3 quarter-pieces to each monster. Every monster gets the same amount!",
    characterCount: 4,
    next: "s3-count-quiz",
    sfx: "xylophone",
  },

  "s3-count-quiz": {
    id: "s3-count-quiz",
    type: "choice",
    tutorText:
      "Each monster has 1 whole bar plus 3 quarter-pieces. "
      + "How much chocolate does each monster have in total?",
    choices: [
      { label: "One and three quarters", next: "s3-count-correct", correct: true },
      { label: "One and a half", next: "s3-count-wrong-half" },
      { label: "Two whole bars", next: "s3-count-wrong-two" },
    ],
  },

  "s3-count-wrong-half": {
    id: "s3-count-wrong-half",
    type: "narrate",
    tutorText:
      "Good thinking -- we did learn about halves earlier! But this time we cut bars into 4 pieces, not 2. "
      + "Each monster got 3 of those 4 pieces. Three out of four is more than half! "
      + "One whole bar plus three quarters of a bar is...?",
    next: "s3-count-quiz",
    sfx: "gentle-whoosh",
  },

  "s3-count-wrong-two": {
    id: "s3-count-wrong-two",
    type: "narrate",
    tutorText:
      "Almost two -- but not quite! Each monster has 1 whole bar plus 3 quarter-pieces. "
      + "Three quarters is close to a whole bar, but it's a little bit less. "
      + "So it's one and... how many quarters?",
    next: "s3-count-quiz",
    sfx: "gentle-whoosh",
  },

  "s3-count-correct": {
    id: "s3-count-correct",
    type: "narrate",
    tutorText:
      "ONE AND THREE QUARTERS! You are a treasure-sharing genius! "
      + "The monsters are cheering and waving their paws! "
      + "Let me show you how to write that as a fraction.",
    next: "s3-show-fraction",
    sfx: "chime",
  },

  "s3-show-fraction": {
    id: "s3-show-fraction",
    type: "show-fraction",
    tutorText:
      "Here it is -- one and three quarters! "
      + "The big 1 counts the whole bar. The fraction three over four means: "
      + "each bar was cut into 4 pieces (bottom number), "
      + "and each monster got 3 of them (top number). "
      + "One and three-quarters chocolate bars per monster!",
    wholeNumber: 1,
    showFractionNum: 3,
    showFractionDen: 4,
    next: "finale-start",
    sfx: "sparkle",
  },

  // ===========================================================================
  // FINALE — Celebration & recap
  // ===========================================================================

  "finale-start": {
    id: "finale-start",
    type: "narrate",
    tutorText:
      "Explorer, you did something really incredible today. "
      + "You helped 2 bars become 1 each, you turned 3 bars into 1 and a half each, "
      + "and you figured out that 7 bars for 4 monsters means 1 and three-quarters each!",
    next: "finale-end",
    sfx: "music-box",
  },

  "finale-end": {
    id: "finale-end",
    type: "narrate",
    tutorText:
      "Every time something doesn't divide evenly, we just cut it into equal pieces -- "
      + "and that's where fractions come from! "
      + "The monsters say thank you, the cave is glowing, "
      + "and you can come back to the Treasure Feast anytime. "
      + "Until next time, brave explorer!",
    next: "end",
    sfx: "music-box",
  },

  "end": {
    id: "end",
    type: "narrate",
    tutorText:
      "The Treasure Feast is complete! You've mastered sharing with wholes, halves, and quarters. "
      + "Fractions aren't scary -- they're just what happens when brave explorers share fairly. "
      + "See you on the next adventure!",
    sfx: "music-box",
  },
};
