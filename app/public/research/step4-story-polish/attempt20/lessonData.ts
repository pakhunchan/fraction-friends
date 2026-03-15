// lessonData.ts — "Forest Music Festival" (Warm & Musical)
// Woodland animals are putting on a music festival, sharing instrument time
// and song segments equally. The narrator is an encouraging bandleader who
// guides the child through discovering that fractions can look different
// but mean the same thing (fraction equivalence: 1/2 = 2/4).

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
// Stage 1 — Review halves:         What is 1/2? Split a drum solo equally.
// Stage 2 — Discover equivalence:  1/2 = 2/4 through splitting song time.
// Stage 3 — Practice equivalence:  1/3 = 2/6 with a new instrument sharing scenario.
// Finale  — Celebrate the festival
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
  // STAGE 1 — Review halves: What is one half?
  // ===========================================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText:
      "Welcome to the Forest Music Festival! The woodland animals have been "
      + "tuning their instruments all morning. There are drums, flutes, "
      + "xylophones, and even a little piano made from birch bark.",
    next: "intro-2",
    sfx: "warm-pad",
  },

  "intro-2": {
    id: "intro-2",
    type: "narrate",
    tutorText:
      "But here's the thing about a festival — everyone needs a fair turn "
      + "to play! That means sharing time equally. "
      + "You're going to be the bandleader today and make sure every animal "
      + "gets a fair share. Ready?",
    next: "s1-setup",
    sfx: "harp-gliss",
  },

  "s1-setup": {
    id: "s1-setup",
    type: "narrate",
    tutorText:
      "First up: the drum solo! Rabbit and Fox both want to play the big oak drum. "
      + "There's 1 drum solo to share between 2 animals. "
      + "We need to split the solo time right down the middle so it's perfectly fair.",
    next: "s1-split-question",
    sfx: "gentle-whoosh",
  },

  "s1-split-question": {
    id: "s1-split-question",
    type: "choice",
    tutorText:
      "If we split 1 drum solo equally between 2 animals, "
      + "how much of the solo does each animal get?",
    choices: [
      { label: "One half of the solo", next: "s1-correct-half", correct: true },
      { label: "The whole solo", next: "s1-wrong-whole" },
      { label: "None of the solo", next: "s1-wrong-none" },
    ],
  },

  "s1-wrong-whole": {
    id: "s1-wrong-whole",
    type: "narrate",
    tutorText:
      "If one animal got the whole solo, the other animal wouldn't get any time at all! "
      + "That wouldn't be fair. We need to split the solo into 2 equal parts "
      + "so both Rabbit and Fox get the same amount. "
      + "What do we call each of those equal parts?",
    next: "s1-split-question",
    sfx: "gentle-whoosh",
  },

  "s1-wrong-none": {
    id: "s1-wrong-none",
    type: "narrate",
    tutorText:
      "Oh no — if nobody gets the solo, there's no music! "
      + "We have one solo to share between two friends. "
      + "When you split something into 2 equal parts, each part has a special name. "
      + "Can you guess what it's called?",
    next: "s1-split-question",
    sfx: "gentle-whoosh",
  },

  "s1-correct-half": {
    id: "s1-correct-half",
    type: "narrate",
    tutorText:
      "That's right! Each animal gets one half of the drum solo. "
      + "When you split something into 2 equal parts, each part is called a half. "
      + "Let's see what that looks like as a fraction!",
    next: "s1-slice",
    sfx: "chime",
  },

  "s1-slice": {
    id: "s1-slice",
    type: "slice",
    tutorText:
      "Tap the drum solo to split it into 2 equal parts — "
      + "one half for Rabbit and one half for Fox!",
    next: "s1-distribute-halves",
    sfx: "gentle-whoosh",
  },

  "s1-distribute-halves": {
    id: "s1-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Now give each animal their half of the drum solo. "
      + "One piece for Rabbit, one piece for Fox!",
    characterCount: 2,
    next: "s1-show-fraction",
    sfx: "xylophone",
  },

  "s1-show-fraction": {
    id: "s1-show-fraction",
    type: "show-fraction",
    tutorText:
      "Here's how musicians write one half. The bottom number, 2, says "
      + "we split the solo into 2 equal parts. The top number, 1, says "
      + "each animal gets 1 of those parts. One half!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s1-check",
    sfx: "sparkle",
  },

  "s1-check": {
    id: "s1-check",
    type: "choice",
    tutorText:
      "Quick bandleader check! In the fraction one-half, "
      + "what does the bottom number 2 tell us?",
    choices: [
      { label: "How many equal parts we made", next: "s1-check-correct", correct: true },
      { label: "How many animals are playing", next: "s1-check-wrong" },
    ],
  },

  "s1-check-wrong": {
    id: "s1-check-wrong",
    type: "narrate",
    tutorText:
      "Good thinking — there are 2 animals, and the bottom number is 2! "
      + "But the bottom number of a fraction always tells us how many "
      + "equal parts we split something into. It just happens that 2 animals "
      + "means 2 equal parts this time. What does the bottom number really mean?",
    next: "s1-check",
    sfx: "gentle-whoosh",
  },

  "s1-check-correct": {
    id: "s1-check-correct",
    type: "narrate",
    tutorText:
      "Exactly! The bottom number tells us how many equal parts. "
      + "The top number tells us how many of those parts we're talking about. "
      + "Rabbit and Fox each got one half and they're drumming away happily!",
    next: "s1-celebrate",
    sfx: "chime",
  },

  "s1-celebrate": {
    id: "s1-celebrate",
    type: "narrate",
    tutorText:
      "The drum solo was a hit! Rabbit and Fox took turns and the crowd loved it. "
      + "Now the festival is heating up, and something really interesting "
      + "is about to happen with fractions...",
    next: "s2-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 2 — Discover 1/2 = 2/4: The same amount, written differently
  // ===========================================================================

  "s2-intro": {
    id: "s2-intro",
    type: "narrate",
    tutorText:
      "Next up is the flute song! Deer wants to play the flute, "
      + "and so does Owl. There's 1 song to share between 2 animals. "
      + "Sound familiar? Let's split it in half, just like the drum solo.",
    next: "s2-first-half",
    sfx: "harp-gliss",
  },

  "s2-first-half": {
    id: "s2-first-half",
    type: "show-fraction",
    tutorText:
      "Just like before — each animal gets one half of the song. "
      + "Deer plays the first half, Owl plays the second half. "
      + "Here's that fraction again: one-half.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s2-twist",
    sfx: "sparkle",
  },

  "s2-twist": {
    id: "s2-twist",
    type: "narrate",
    tutorText:
      "But wait! Squirrel and Bear run up to the stage. "
      + "\"We want to play too!\" they say. "
      + "Now there are 4 animals who want to share the same song. "
      + "We'll need to split it differently this time.",
    next: "s2-four-question",
    sfx: "gentle-whoosh",
  },

  "s2-four-question": {
    id: "s2-four-question",
    type: "choice",
    tutorText:
      "If 4 animals share 1 song equally, how many equal parts "
      + "do we need to split the song into?",
    choices: [
      { label: "4 equal parts", next: "s2-four-correct", correct: true },
      { label: "2 equal parts", next: "s2-four-wrong-two" },
      { label: "8 equal parts", next: "s2-four-wrong-eight" },
    ],
  },

  "s2-four-wrong-two": {
    id: "s2-four-wrong-two",
    type: "narrate",
    tutorText:
      "2 parts worked when we had 2 animals, but now we have 4! "
      + "If we only made 2 parts, two animals would be left out. "
      + "We need one part for each animal. How many parts is that?",
    next: "s2-four-question",
    sfx: "gentle-whoosh",
  },

  "s2-four-wrong-eight": {
    id: "s2-four-wrong-eight",
    type: "narrate",
    tutorText:
      "8 parts would give each animal 2 tiny pieces — that could work, "
      + "but let's keep it simple! We have 4 animals, "
      + "so the easiest thing is to make 4 equal parts, one for each animal.",
    next: "s2-four-question",
    sfx: "gentle-whoosh",
  },

  "s2-four-correct": {
    id: "s2-four-correct",
    type: "narrate",
    tutorText:
      "Right! 4 animals means 4 equal parts. Each part is called one quarter. "
      + "Let's slice up the song into quarters!",
    next: "s2-slice-quarters",
    sfx: "chime",
  },

  "s2-slice-quarters": {
    id: "s2-slice-quarters",
    type: "slice",
    tutorText:
      "Tap the song to split it into 4 equal parts — "
      + "one quarter for each animal!",
    next: "s2-show-quarter",
    sfx: "gentle-whoosh",
  },

  "s2-show-quarter": {
    id: "s2-show-quarter",
    type: "show-fraction",
    tutorText:
      "Each animal gets one quarter of the song. "
      + "The bottom number is 4 because we made 4 equal parts. "
      + "The top number is 1 because each animal gets 1 part.",
    showFractionNum: 1,
    showFractionDen: 4,
    next: "s2-deer-share",
    sfx: "sparkle",
  },

  "s2-deer-share": {
    id: "s2-deer-share",
    type: "narrate",
    tutorText:
      "Now here's where it gets exciting! Remember, Deer was supposed to play "
      + "one half of the song. Before the others joined, Deer's half was "
      + "the first half of the whole song. Let's see how many quarter-pieces "
      + "fit inside Deer's half.",
    next: "s2-key-question",
    sfx: "harp-gliss",
  },

  "s2-key-question": {
    id: "s2-key-question",
    type: "choice",
    tutorText:
      "Look at the song split into 4 quarters. "
      + "How many of those quarter-pieces fit inside the first half of the song?",
    choices: [
      { label: "2 quarters", next: "s2-key-correct", correct: true },
      { label: "1 quarter", next: "s2-key-wrong-one" },
      { label: "3 quarters", next: "s2-key-wrong-three" },
    ],
  },

  "s2-key-wrong-one": {
    id: "s2-key-wrong-one",
    type: "narrate",
    tutorText:
      "One quarter is only a small piece — it's less than half the song. "
      + "Picture the song split into 4 equal pieces: piece 1, piece 2, piece 3, piece 4. "
      + "The first half of the song covers pieces 1 and 2. "
      + "So how many quarters is that?",
    next: "s2-key-question",
    sfx: "gentle-whoosh",
  },

  "s2-key-wrong-three": {
    id: "s2-key-wrong-three",
    type: "narrate",
    tutorText:
      "3 quarters would be more than half the song — that's three out of four pieces! "
      + "Half means exactly in the middle. If the song has 4 pieces, "
      + "the first half is pieces 1 and 2. How many is that?",
    next: "s2-key-question",
    sfx: "gentle-whoosh",
  },

  "s2-key-correct": {
    id: "s2-key-correct",
    type: "narrate",
    tutorText:
      "Yes! 2 quarters fit perfectly inside one half! "
      + "That means one half and two quarters are the SAME amount of song. "
      + "They just look different as fractions. This is a big discovery!",
    next: "s2-show-equivalence",
    sfx: "chime",
  },

  "s2-show-equivalence": {
    id: "s2-show-equivalence",
    type: "show-fraction",
    tutorText:
      "Look — one half equals two quarters! "
      + "The fractions look different, but they describe the exact same amount. "
      + "Two quarters of the song is the same as one half of the song!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "s2-equivalence-confirm",
    sfx: "sparkle",
  },

  "s2-equivalence-confirm": {
    id: "s2-equivalence-confirm",
    type: "choice",
    tutorText:
      "So when someone says one-half and someone else says two-quarters, "
      + "are they talking about the same amount or different amounts?",
    choices: [
      { label: "The same amount!", next: "s2-confirm-correct", correct: true },
      { label: "Different amounts", next: "s2-confirm-wrong" },
    ],
  },

  "s2-confirm-wrong": {
    id: "s2-confirm-wrong",
    type: "narrate",
    tutorText:
      "I can see why it might seem different — the numbers look different! "
      + "But think about it this way: if you eat half a sandwich, "
      + "and I cut my half into two smaller pieces, I still have the same amount of food. "
      + "One half and two quarters are the same amount, just cut differently!",
    next: "s2-equivalence-confirm",
    sfx: "gentle-whoosh",
  },

  "s2-confirm-correct": {
    id: "s2-confirm-correct",
    type: "narrate",
    tutorText:
      "Exactly right! One-half and two-quarters are the same amount. "
      + "This is called equivalent fractions — fractions that look different "
      + "but are worth the same. It's like how the same melody can sound beautiful "
      + "on a flute or a piano!",
    next: "s2-distribute-quarters",
    sfx: "music-box",
  },

  "s2-distribute-quarters": {
    id: "s2-distribute-quarters",
    type: "distribute-halves",
    tutorText:
      "Let's give each of the 4 animals their quarter of the song! "
      + "One piece for Deer, one for Owl, one for Squirrel, and one for Bear.",
    characterCount: 4,
    next: "s2-celebrate",
    sfx: "xylophone",
  },

  "s2-celebrate": {
    id: "s2-celebrate",
    type: "narrate",
    tutorText:
      "What a performance! All 4 animals played their quarters beautifully. "
      + "And Deer noticed something amazing — playing 2 quarters felt "
      + "just like playing one half. Same amount of music, just divided up more! "
      + "The crowd is cheering!",
    next: "s3-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 3 — Practice: 1/3 = 2/6 with xylophone sharing
  // ===========================================================================

  "s3-intro": {
    id: "s3-intro",
    type: "narrate",
    tutorText:
      "The festival is really rocking now! Three little mice want to play "
      + "the xylophone together. There's 1 xylophone song to share "
      + "between 3 mice. Let's figure out each mouse's share!",
    next: "s3-thirds-question",
    sfx: "harp-gliss",
  },

  "s3-thirds-question": {
    id: "s3-thirds-question",
    type: "choice",
    tutorText:
      "If 3 mice share 1 song equally, how many parts "
      + "do we need to split the song into?",
    choices: [
      { label: "3 equal parts", next: "s3-thirds-correct", correct: true },
      { label: "2 equal parts", next: "s3-thirds-wrong" },
      { label: "6 equal parts", next: "s3-thirds-wrong-six" },
    ],
  },

  "s3-thirds-wrong": {
    id: "s3-thirds-wrong",
    type: "narrate",
    tutorText:
      "2 parts won't work for 3 mice — one mouse would be left out! "
      + "We need one part for each mouse. Since there are 3 mice, "
      + "how many parts should we make?",
    next: "s3-thirds-question",
    sfx: "gentle-whoosh",
  },

  "s3-thirds-wrong-six": {
    id: "s3-thirds-wrong-six",
    type: "narrate",
    tutorText:
      "6 parts could work — each mouse would get 2 pieces. "
      + "But let's start simple first! The easiest way is one part per mouse. "
      + "With 3 mice, that means how many parts?",
    next: "s3-thirds-question",
    sfx: "gentle-whoosh",
  },

  "s3-thirds-correct": {
    id: "s3-thirds-correct",
    type: "narrate",
    tutorText:
      "Perfect! 3 mice, 3 equal parts. Each part is called one third. "
      + "Let's split up the song!",
    next: "s3-slice-thirds",
    sfx: "chime",
  },

  "s3-slice-thirds": {
    id: "s3-slice-thirds",
    type: "slice",
    tutorText:
      "Tap the xylophone song to split it into 3 equal parts — "
      + "one third for each mouse!",
    next: "s3-show-third",
    sfx: "gentle-whoosh",
  },

  "s3-show-third": {
    id: "s3-show-third",
    type: "show-fraction",
    tutorText:
      "Each mouse gets one third of the song! "
      + "The 3 on the bottom means 3 equal parts. "
      + "The 1 on top means each mouse gets 1 of those parts.",
    showFractionNum: 1,
    showFractionDen: 3,
    next: "s3-new-arrivals",
    sfx: "sparkle",
  },

  "s3-new-arrivals": {
    id: "s3-new-arrivals",
    type: "narrate",
    tutorText:
      "Uh oh — 3 more mice just scurried up to the stage! "
      + "\"We want to play too!\" Now there are 6 mice total. "
      + "Remember what happened with the flute song? "
      + "Let's see if we discover another equivalent fraction!",
    next: "s3-sixths-question",
    sfx: "harp-gliss",
  },

  "s3-sixths-question": {
    id: "s3-sixths-question",
    type: "choice",
    tutorText:
      "If 6 mice share 1 song equally, how many parts do we need now?",
    choices: [
      { label: "6 equal parts", next: "s3-sixths-correct", correct: true },
      { label: "3 equal parts", next: "s3-sixths-wrong-three" },
      { label: "12 equal parts", next: "s3-sixths-wrong-twelve" },
    ],
  },

  "s3-sixths-wrong-three": {
    id: "s3-sixths-wrong-three",
    type: "narrate",
    tutorText:
      "3 parts worked when we had 3 mice, but now we have 6! "
      + "Each mouse needs their own part. How many parts for 6 mice?",
    next: "s3-sixths-question",
    sfx: "gentle-whoosh",
  },

  "s3-sixths-wrong-twelve": {
    id: "s3-sixths-wrong-twelve",
    type: "narrate",
    tutorText:
      "12 is a lot of parts! Let's keep it simple — "
      + "one part for each mouse. With 6 mice, that means we need 6 parts.",
    next: "s3-sixths-question",
    sfx: "gentle-whoosh",
  },

  "s3-sixths-correct": {
    id: "s3-sixths-correct",
    type: "narrate",
    tutorText:
      "That's it! 6 mice, 6 equal parts. Each part is called one sixth. "
      + "Let's split the song into sixths!",
    next: "s3-slice-sixths",
    sfx: "chime",
  },

  "s3-slice-sixths": {
    id: "s3-slice-sixths",
    type: "slice",
    tutorText:
      "Tap the song to split it into 6 equal parts — one sixth for each mouse!",
    next: "s3-show-sixth",
    sfx: "gentle-whoosh",
  },

  "s3-show-sixth": {
    id: "s3-show-sixth",
    type: "show-fraction",
    tutorText:
      "Each mouse gets one sixth of the song. "
      + "The 6 on the bottom means 6 equal parts, "
      + "and the 1 on top means each mouse gets 1 of them.",
    showFractionNum: 1,
    showFractionDen: 6,
    next: "s3-equivalence-setup",
    sfx: "sparkle",
  },

  "s3-equivalence-setup": {
    id: "s3-equivalence-setup",
    type: "narrate",
    tutorText:
      "Now here's the big question! Remember, the first mouse originally had "
      + "one third of the song. Now the song is split into sixths. "
      + "How many sixths fit inside one third?",
    next: "s3-equiv-question",
    sfx: "harp-gliss",
  },

  "s3-equiv-question": {
    id: "s3-equiv-question",
    type: "choice",
    tutorText:
      "Look at the song split into 6 parts. The first third covered "
      + "the beginning of the song. How many sixths fit inside that same space?",
    choices: [
      { label: "2 sixths", next: "s3-equiv-correct", correct: true },
      { label: "1 sixth", next: "s3-equiv-wrong-one" },
      { label: "3 sixths", next: "s3-equiv-wrong-three" },
    ],
  },

  "s3-equiv-wrong-one": {
    id: "s3-equiv-wrong-one",
    type: "narrate",
    tutorText:
      "One sixth is actually smaller than one third. "
      + "Think about it: when we split 3 parts into 6, each old part "
      + "became 2 new parts. So one third equals how many sixths?",
    next: "s3-equiv-question",
    sfx: "gentle-whoosh",
  },

  "s3-equiv-wrong-three": {
    id: "s3-equiv-wrong-three",
    type: "narrate",
    tutorText:
      "3 sixths would be half the song — that's too much! "
      + "One third is smaller than one half. Each third got split into "
      + "exactly 2 sixths. How many sixths equal one third?",
    next: "s3-equiv-question",
    sfx: "gentle-whoosh",
  },

  "s3-equiv-correct": {
    id: "s3-equiv-correct",
    type: "show-fraction",
    tutorText:
      "Yes! 2 sixths is the same amount as 1 third! "
      + "Just like one-half equaled two-quarters, "
      + "one-third equals two-sixths. Another pair of equivalent fractions!",
    showFractionNum: 2,
    showFractionDen: 6,
    next: "s3-pattern-question",
    sfx: "sparkle",
  },

  "s3-pattern-question": {
    id: "s3-pattern-question",
    type: "choice",
    tutorText:
      "Do you notice a pattern? One-half equals two-quarters. "
      + "One-third equals two-sixths. What's happening to the numbers "
      + "when we make equivalent fractions?",
    choices: [
      { label: "Both the top and bottom numbers get multiplied by the same amount!", next: "s3-pattern-correct", correct: true },
      { label: "I'm not sure yet", next: "s3-pattern-hint" },
    ],
  },

  "s3-pattern-hint": {
    id: "s3-pattern-hint",
    type: "narrate",
    tutorText:
      "That's okay! Look closely: one-half became two-quarters. "
      + "The 1 on top doubled to 2. The 2 on the bottom doubled to 4. "
      + "And one-third became two-sixths. "
      + "The 1 on top doubled to 2. The 3 on the bottom doubled to 6. "
      + "Both numbers got multiplied by 2!",
    next: "s3-pattern-question",
    sfx: "gentle-whoosh",
  },

  "s3-pattern-correct": {
    id: "s3-pattern-correct",
    type: "narrate",
    tutorText:
      "You got it! When you multiply the top and bottom by the same number, "
      + "the fraction looks different but means the same amount. "
      + "It's like playing the same tune on different instruments — "
      + "the sound changes but the melody stays the same!",
    next: "s3-distribute-sixths",
    sfx: "chime",
  },

  "s3-distribute-sixths": {
    id: "s3-distribute-sixths",
    type: "distribute-halves",
    tutorText:
      "Let's give each of the 6 mice their sixth of the xylophone song! "
      + "One piece for each little musician.",
    characterCount: 6,
    next: "s3-celebrate",
    sfx: "xylophone",
  },

  "s3-celebrate": {
    id: "s3-celebrate",
    type: "narrate",
    tutorText:
      "Listen to those mice play! Each one has exactly one sixth of the song, "
      + "and together they make the whole melody. "
      + "The original 3 mice noticed their share sounds the same — "
      + "two sixths is the same as one third!",
    next: "finale-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // FINALE — Celebrate the festival
  // ===========================================================================

  "finale-intro": {
    id: "finale-intro",
    type: "narrate",
    tutorText:
      "Bandleader, you've done something really special today. "
      + "You didn't just share music fairly — you discovered one of "
      + "the most powerful ideas in math: equivalent fractions!",
    next: "finale-review",
    sfx: "warm-pad",
  },

  "finale-review": {
    id: "finale-review",
    type: "choice",
    tutorText:
      "Let's play one final note! Which of these is true?",
    choices: [
      { label: "One-half and two-quarters are the same amount", next: "finale-correct", correct: true },
      { label: "One-half is bigger than two-quarters", next: "finale-wrong" },
    ],
  },

  "finale-wrong": {
    id: "finale-wrong",
    type: "narrate",
    tutorText:
      "They actually are the same! Remember the flute song — "
      + "when we split each half into 2 quarters, Deer's half "
      + "became exactly 2 quarters. Same amount of music! "
      + "One-half equals two-quarters.",
    next: "finale-review",
    sfx: "gentle-whoosh",
  },

  "finale-correct": {
    id: "finale-correct",
    type: "narrate",
    tutorText:
      "That's the spirit! You've learned that fractions can look different "
      + "on the outside but mean the same thing on the inside. "
      + "One-half equals two-quarters. One-third equals two-sixths. "
      + "The music might sound different, but the melody is the same!",
    next: "finale-end",
    sfx: "chime",
  },

  "finale-end": {
    id: "finale-end",
    type: "narrate",
    tutorText:
      "The Forest Music Festival has been a huge success, all thanks to you! "
      + "The animals are taking a bow, the fireflies are lighting up the stage, "
      + "and everyone got their fair share of music. "
      + "You're not just a bandleader — you're a fraction expert! "
      + "Come back anytime the forest animals need your help!",
    next: "end",
    sfx: "music-box",
  },
};
