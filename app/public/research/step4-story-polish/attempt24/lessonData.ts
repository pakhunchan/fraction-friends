export type StepType =
  | "narrate"
  | "choice"
  | "distribute"
  | "slice"
  | "distribute-halves"
  | "show-number"
  | "show-fraction"

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
  sfx?: string;
}

export const lessonSteps: Record<string, LessonStep> = {

  // ============================================================
  // STAGE 1: Review halves — what IS one half?
  // ============================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText: "Welcome to the Dragon Bakery! Two baby dragons named Ember and Flicker just opened their very own cake shop. They have tiny wings, flour on their snouts, and big toothy grins. Let's help them serve their customers today!",
    next: "meet-ember",
    sfx: "music-box",
  },

  "meet-ember": {
    id: "meet-ember",
    type: "narrate",
    tutorText: "Ember is the head baker. She just pulled a beautiful chocolate cake out of the oven with her little claws. 'One whole cake!' she announces proudly, doing a happy wing-flap.",
    next: "show-whole",
    sfx: "warm-pad",
  },

  "show-whole": {
    id: "show-whole",
    type: "show-number",
    tutorText: "Here is the whole cake. We can write one whole cake as the number 1.",
    showNumber: "1",
    next: "first-customer",
    sfx: "chime",
  },

  "first-customer": {
    id: "first-customer",
    type: "narrate",
    tutorText: "Ding-a-ling! The bakery door opens. Two friendly caterpillars wiggle in. 'We'd like to share one cake fairly between the two of us, please!' they say in their tiny voices.",
    next: "half-question",
    sfx: "soft-bell",
  },

  "half-question": {
    id: "half-question",
    type: "choice",
    tutorText: "The caterpillars want to share one cake equally between 2 friends. How many pieces do we need to cut it into?",
    taskHeader: "How many equal pieces?",
    choices: [
      { label: "2 pieces", next: "half-correct", correct: true },
      { label: "3 pieces", next: "half-wrong" },
    ],
    sfx: "xylophone",
  },

  "half-wrong": {
    id: "half-wrong",
    type: "narrate",
    tutorText: "Hmm, 3 pieces would mean someone gets extra — or one piece is left over! We have 2 caterpillars who each want the same amount. Let's try again!",
    next: "half-question",
    sfx: "gentle-whoosh",
  },

  "half-correct": {
    id: "half-correct",
    type: "narrate",
    tutorText: "That's right! 2 equal pieces for 2 friends. Flicker grabs a big cake knife. 'I'll cut it right down the middle!' she says, wagging her tail with excitement.",
    next: "slice-half",
    sfx: "chime",
  },

  "slice-half": {
    id: "slice-half",
    type: "slice",
    tutorText: "Help Flicker slice the cake into 2 equal pieces!",
    taskHeader: "Slice into 2 equal pieces",
    cookieCount: 1,
    allowKnife: true,
    next: "show-half-fraction",
    sfx: "sparkle",
  },

  "show-half-fraction": {
    id: "show-half-fraction",
    type: "show-fraction",
    tutorText: "Each caterpillar gets one piece out of two. We write that as a fraction: one-half! The 1 on top means one piece. The 2 on the bottom means we cut into 2 equal pieces.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "half-explain",
    sfx: "harp-gliss",
  },

  "half-explain": {
    id: "half-explain",
    type: "narrate",
    tutorText: "The bottom number tells us how many equal pieces we cut. The top number tells us how many pieces each caterpillar gets. One out of two pieces equals one-half!",
    next: "distribute-caterpillars",
    sfx: "warm-pad",
  },

  "distribute-caterpillars": {
    id: "distribute-caterpillars",
    type: "distribute-halves",
    tutorText: "Now give each caterpillar their half of the cake!",
    taskHeader: "Give each caterpillar one half",
    cookieCount: 1,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "caterpillars-happy",
    sfx: "sparkle",
  },

  "caterpillars-happy": {
    id: "caterpillars-happy",
    type: "narrate",
    tutorText: "'Yummy!' the caterpillars cheer, nibbling their cake halves. Ember writes in her order book: each caterpillar got one-half. 'Our first happy customers!' she squeaks.",
    next: "half-review-q",
    sfx: "music-box",
  },

  "half-review-q": {
    id: "half-review-q",
    type: "choice",
    tutorText: "Quick review! When we cut something into 2 equal pieces, each piece is called...",
    taskHeader: "Each piece is called...",
    choices: [
      { label: "One-half (1/2)", next: "half-review-right", correct: true },
      { label: "One-third (1/3)", next: "half-review-wrong" },
    ],
    sfx: "xylophone",
  },

  "half-review-wrong": {
    id: "half-review-wrong",
    type: "narrate",
    tutorText: "Not quite! One-third means 3 equal pieces. We only cut into 2 pieces, so each piece is one-half. Let's try that again!",
    next: "half-review-q",
    sfx: "gentle-whoosh",
  },

  "half-review-right": {
    id: "half-review-right",
    type: "narrate",
    tutorText: "Exactly right! One-half means 1 piece out of 2 equal pieces. You're a natural! Ember gives you a thumbs-up with her little claw.",
    next: "stage2-intro",
    sfx: "chime",
  },

  // ============================================================
  // STAGE 2: Discover that 1/2 = 2/4
  // ============================================================

  "stage2-intro": {
    id: "stage2-intro",
    type: "narrate",
    tutorText: "The bakery door swings open again. This time, four tiny mice scurry in! 'We heard you have amazing cake! Can we share one cake equally between all four of us?'",
    next: "mice-bake",
    sfx: "soft-bell",
  },

  "mice-bake": {
    id: "mice-bake",
    type: "narrate",
    tutorText: "Ember fires up the oven and bakes a brand-new cake — exactly the same size as the caterpillars' cake. Flicker sniffs the air. 'Smells like vanilla this time!' she says.",
    next: "four-mice-question",
    sfx: "warm-pad",
  },

  "four-mice-question": {
    id: "four-mice-question",
    type: "choice",
    tutorText: "Four mice want to share one cake equally. How many pieces do we need?",
    taskHeader: "How many equal pieces?",
    choices: [
      { label: "4 pieces", next: "four-correct", correct: true },
      { label: "2 pieces", next: "four-wrong" },
    ],
    sfx: "xylophone",
  },

  "four-wrong": {
    id: "four-wrong",
    type: "narrate",
    tutorText: "2 pieces would work for 2 friends, but we have 4 mice! Each mouse wants the same amount. Let's think again!",
    next: "four-mice-question",
    sfx: "gentle-whoosh",
  },

  "four-correct": {
    id: "four-correct",
    type: "narrate",
    tutorText: "Right! 4 equal pieces for 4 mice. Flicker picks up the knife. 'More cutting practice!' she giggles, little sparks flying from her nostrils.",
    next: "slice-quarters",
    sfx: "chime",
  },

  "slice-quarters": {
    id: "slice-quarters",
    type: "slice",
    tutorText: "Help Flicker slice this cake into 4 equal pieces!",
    taskHeader: "Slice into 4 equal pieces",
    cookieCount: 1,
    allowKnife: true,
    next: "show-quarter-fraction",
    sfx: "sparkle",
  },

  "show-quarter-fraction": {
    id: "show-quarter-fraction",
    type: "show-fraction",
    tutorText: "Each mouse gets one piece out of four. We write that as one-quarter!",
    showFractionNum: 1,
    showFractionDen: 4,
    next: "distribute-mice",
    sfx: "harp-gliss",
  },

  "distribute-mice": {
    id: "distribute-mice",
    type: "distribute",
    tutorText: "Give each of the 4 mice their quarter of the cake!",
    taskHeader: "One quarter for each mouse",
    cookieCount: 4,
    characterCount: 4,
    expectedPerPerson: 1,
    next: "mice-happy",
    sfx: "sparkle",
  },

  "mice-happy": {
    id: "mice-happy",
    type: "narrate",
    tutorText: "The mice squeak with joy! But wait — a curious mouse named Pip looks over at the caterpillars' leftover crumbs. 'Hey,' says Pip, 'I wonder... did each of us get the same amount of cake as each caterpillar did?'",
    next: "big-discovery-setup",
    sfx: "warm-pad",
  },

  "big-discovery-setup": {
    id: "big-discovery-setup",
    type: "narrate",
    tutorText: "Ember thinks hard. She baked two identical cakes — the same size! The caterpillars' cake was cut into 2 pieces. The mice's cake was cut into 4 pieces. Let's put the cakes side by side and compare!",
    next: "compare-half",
    sfx: "music-box",
  },

  "compare-half": {
    id: "compare-half",
    type: "show-fraction",
    tutorText: "Look! One caterpillar got 1 out of 2 pieces — that's one-half of the cake.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "compare-mouse-explain",
    sfx: "chime",
  },

  "compare-mouse-explain": {
    id: "compare-mouse-explain",
    type: "narrate",
    tutorText: "Now look at the mice's cake. It's cut into 4 pieces, and each mouse got 1 piece. But look closely — 2 of those smaller pieces fit together perfectly to make the same size as 1 of the caterpillar's bigger pieces!",
    next: "equivalence-question",
    sfx: "warm-pad",
  },

  "equivalence-question": {
    id: "equivalence-question",
    type: "choice",
    tutorText: "If we put 2 of the mice's quarter-pieces together, how much of the whole cake is that?",
    taskHeader: "2 quarters equals...",
    choices: [
      { label: "One-half (1/2)", next: "equivalence-correct", correct: true },
      { label: "One-quarter (1/4)", next: "equivalence-wrong" },
    ],
    sfx: "xylophone",
  },

  "equivalence-wrong": {
    id: "equivalence-wrong",
    type: "narrate",
    tutorText: "One-quarter is just 1 small piece. But we put 2 small pieces together — that makes a bigger chunk! Look at how the 2 pieces line up with the caterpillar's slice. They match perfectly! Try again.",
    next: "equivalence-question",
    sfx: "gentle-whoosh",
  },

  "equivalence-correct": {
    id: "equivalence-correct",
    type: "narrate",
    tutorText: "'Whoa!' gasps Pip the mouse. 2 out of 4 pieces is the same amount of cake as 1 out of 2 pieces! The fractions look different, but the amount of cake is exactly the same!",
    next: "show-two-fourths",
    sfx: "harp-gliss",
  },

  "show-two-fourths": {
    id: "show-two-fourths",
    type: "show-fraction",
    tutorText: "Two-fourths! Two pieces out of four equal pieces. And it equals the same amount as one-half!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "magic-moment",
    sfx: "sparkle",
  },

  "magic-moment": {
    id: "magic-moment",
    type: "narrate",
    tutorText: "Ember's eyes go wide. 'So one-half and two-fourths are the SAME amount? The fractions just look different!' Flicker does a happy little fire-snort. 'Fractions can be sneaky like that!'",
    next: "equivalence-confirm",
    sfx: "music-box",
  },

  "equivalence-confirm": {
    id: "equivalence-confirm",
    type: "choice",
    tutorText: "Let's make sure we've got it. Is one-half (1/2) equal to two-fourths (2/4)?",
    taskHeader: "Is 1/2 = 2/4?",
    choices: [
      { label: "Yes, they are equal!", next: "confirm-correct", correct: true },
      { label: "No, they are different", next: "confirm-wrong" },
    ],
    sfx: "xylophone",
  },

  "confirm-wrong": {
    id: "confirm-wrong",
    type: "narrate",
    tutorText: "Let's look again! Imagine the same cake. Cut it in half — one piece is 1/2. Now cut it into 4 slices instead — 2 of those slices is the same size as that one half. They really are equal! Try again.",
    next: "equivalence-confirm",
    sfx: "gentle-whoosh",
  },

  "confirm-correct": {
    id: "confirm-correct",
    type: "narrate",
    tutorText: "You've got it! One-half equals two-fourths. The pieces are smaller when you cut more, but you get more of them — so the total amount stays the same. This is called an equivalent fraction!",
    next: "equiv-name",
    sfx: "chime",
  },

  "equiv-name": {
    id: "equiv-name",
    type: "narrate",
    tutorText: "Ember writes on the bakery chalkboard in big letters: 1/2 = 2/4. 'Equivalent means EQUAL,' she explains. 'These two fractions are equivalent because they show the same amount of cake!'",
    next: "stage3-intro",
    sfx: "warm-pad",
  },

  // ============================================================
  // STAGE 3: Practice another equivalence (2/4 = 4/8 or 1/3 = 2/6, etc.)
  // ============================================================

  "stage3-intro": {
    id: "stage3-intro",
    type: "narrate",
    tutorText: "The bakery is buzzing! A family of ladybugs comes in — 3 little ladybug children and Mama Ladybug, so 4 ladybugs total. 'One strawberry pie, please!' says Mama.",
    next: "ladybug-slice",
    sfx: "soft-bell",
  },

  "ladybug-slice": {
    id: "ladybug-slice",
    type: "slice",
    tutorText: "Flicker bakes a beautiful strawberry pie. Help her cut it into 4 equal pieces for the ladybug family!",
    taskHeader: "Slice the pie into 4 pieces",
    cookieCount: 1,
    allowKnife: true,
    next: "ladybug-distribute",
    sfx: "sparkle",
  },

  "ladybug-distribute": {
    id: "ladybug-distribute",
    type: "distribute",
    tutorText: "Give each ladybug one quarter of the pie!",
    taskHeader: "One quarter for each ladybug",
    cookieCount: 4,
    characterCount: 4,
    expectedPerPerson: 1,
    next: "ladybug-fraction",
    sfx: "sparkle",
  },

  "ladybug-fraction": {
    id: "ladybug-fraction",
    type: "show-fraction",
    tutorText: "Each ladybug gets one-quarter of the pie.",
    showFractionNum: 1,
    showFractionDen: 4,
    next: "grasshopper-arrive",
    sfx: "chime",
  },

  "grasshopper-arrive": {
    id: "grasshopper-arrive",
    type: "narrate",
    tutorText: "Just then, two grasshoppers hop through the door! 'We want to share a pie too — just the two of us!' Ember bakes another pie, the exact same size as the ladybugs' pie.",
    next: "grasshopper-slice",
    sfx: "soft-bell",
  },

  "grasshopper-slice": {
    id: "grasshopper-slice",
    type: "slice",
    tutorText: "Cut this pie into 2 equal pieces for the two grasshoppers!",
    taskHeader: "Slice into 2 equal pieces",
    cookieCount: 1,
    allowKnife: true,
    next: "grasshopper-distribute",
    sfx: "sparkle",
  },

  "grasshopper-distribute": {
    id: "grasshopper-distribute",
    type: "distribute-halves",
    tutorText: "Give each grasshopper their half of the pie!",
    taskHeader: "One half for each grasshopper",
    cookieCount: 1,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "grasshopper-fraction",
    sfx: "sparkle",
  },

  "grasshopper-fraction": {
    id: "grasshopper-fraction",
    type: "show-fraction",
    tutorText: "Each grasshopper gets one-half of the pie.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "compare-pies",
    sfx: "chime",
  },

  "compare-pies": {
    id: "compare-pies",
    type: "narrate",
    tutorText: "Mama Ladybug tilts her head. 'Hmm, if two of my children put their pieces together, would they have the same amount as one grasshopper?' Ember grins. 'Let's figure it out!'",
    next: "practice-equivalence",
    sfx: "warm-pad",
  },

  "practice-equivalence": {
    id: "practice-equivalence",
    type: "choice",
    tutorText: "Two ladybug children each have 1/4 of a pie. Together that's 2/4. Is 2/4 the same amount as the grasshopper's 1/2?",
    taskHeader: "Does 2/4 = 1/2?",
    choices: [
      { label: "Yes, 2/4 = 1/2!", next: "practice-right", correct: true },
      { label: "No, they are different", next: "practice-wrong" },
    ],
    sfx: "xylophone",
  },

  "practice-wrong": {
    id: "practice-wrong",
    type: "narrate",
    tutorText: "Remember what we just learned! Two quarter-pieces fit perfectly into one half-piece. The pies are the same size, so 2 out of 4 slices IS the same as 1 out of 2 slices. Try again!",
    next: "practice-equivalence",
    sfx: "gentle-whoosh",
  },

  "practice-right": {
    id: "practice-right",
    type: "narrate",
    tutorText: "'It IS the same!' cheers Mama Ladybug. Flicker adds it to the chalkboard: 1/2 = 2/4. Two different-looking fractions, same yummy amount of pie!",
    next: "show-equiv-24",
    sfx: "harp-gliss",
  },

  "show-equiv-24": {
    id: "show-equiv-24",
    type: "show-fraction",
    tutorText: "Let's see it one more time. Two-fourths...",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "show-equiv-12",
    sfx: "chime",
  },

  "show-equiv-12": {
    id: "show-equiv-12",
    type: "show-fraction",
    tutorText: "...equals one-half! They are equivalent fractions!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "bonus-intro",
    sfx: "sparkle",
  },

  "bonus-intro": {
    id: "bonus-intro",
    type: "narrate",
    tutorText: "Just before closing time, a wise old owl swoops in through the window. 'I have a tricky question for you young bakers! I brought a cake already cut into 6 equal pieces.'",
    next: "owl-show-sixths",
    sfx: "soft-bell",
  },

  "owl-show-sixths": {
    id: "owl-show-sixths",
    type: "show-fraction",
    tutorText: "The owl's cake is cut into 6 equal slices. Each slice is one-sixth.",
    showFractionNum: 1,
    showFractionDen: 6,
    next: "owl-question",
    sfx: "chime",
  },

  "owl-question": {
    id: "owl-question",
    type: "choice",
    tutorText: "The owl asks: 'If I want exactly one-half of this cake, how many of these 6 pieces should I take?'",
    taskHeader: "How many sixths = one half?",
    choices: [
      { label: "3 pieces (3/6)", next: "owl-correct", correct: true },
      { label: "2 pieces (2/6)", next: "owl-wrong" },
    ],
    sfx: "xylophone",
  },

  "owl-wrong": {
    id: "owl-wrong",
    type: "narrate",
    tutorText: "Not quite! Think about it: half of 6 is 3. If you split 6 pieces into two equal groups, each group has 3 pieces. So 3 out of 6 is one-half! Let's try again.",
    next: "owl-question",
    sfx: "gentle-whoosh",
  },

  "owl-correct": {
    id: "owl-correct",
    type: "narrate",
    tutorText: "'Splendid!' hoots the owl. 3 out of 6 equals one-half. That's ANOTHER equivalent fraction! Ember's jaw drops. 'So 1/2, 2/4, AND 3/6 are all the same amount?!'",
    next: "show-three-sixths",
    sfx: "harp-gliss",
  },

  "show-three-sixths": {
    id: "show-three-sixths",
    type: "show-fraction",
    tutorText: "Three-sixths is yet another way to write one-half! The pieces get smaller, but you get more of them — and the total is still the same.",
    showFractionNum: 3,
    showFractionDen: 6,
    next: "final-quiz",
    sfx: "sparkle",
  },

  "final-quiz": {
    id: "final-quiz",
    type: "choice",
    tutorText: "Last question! Which of these is NOT equal to one-half?",
    taskHeader: "Which is NOT equal to 1/2?",
    choices: [
      { label: "1/3", next: "final-correct", correct: true },
      { label: "2/4", next: "final-wrong" },
    ],
    sfx: "xylophone",
  },

  "final-wrong": {
    id: "final-wrong",
    type: "narrate",
    tutorText: "Actually, we just learned that 2/4 IS equal to 1/2! The question asks which one is NOT equal to one-half. Think about thirds versus halves. Try again!",
    next: "final-quiz",
    sfx: "gentle-whoosh",
  },

  "final-correct": {
    id: "final-correct",
    type: "narrate",
    tutorText: "You got it! One-third (1/3) means the cake is cut into 3 equal pieces and you take 1 — that's a different amount than one-half. But 2/4 and 3/6 are both secretly one-half in disguise!",
    next: "closing",
    sfx: "chime",
  },

  "closing": {
    id: "closing",
    type: "narrate",
    tutorText: "Ember flips the bakery sign to 'Closed' and Flicker sweeps up the crumbs with her tail. 'What a day!' says Ember. 'We learned that fractions can look different but mean the same amount. One-half, two-fourths, three-sixths — all equal!'",
    next: "goodbye",
    sfx: "warm-pad",
  },

  "goodbye": {
    id: "goodbye",
    type: "narrate",
    tutorText: "Flicker waves a floury wing. 'Come back to the Dragon Bakery anytime! There are always more cakes to slice and fractions to discover!' Great job today, young mathematician!",
    next: "end",
    sfx: "music-box",
  },

};
