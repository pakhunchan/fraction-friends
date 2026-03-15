// lessonData.ts — "The Garden Party" (Warm & Whimsical)
// Friendly bugs are hosting a garden party, sharing flower petals and leaves
// equally. The narrator is a gentle garden guide helping a child discover
// that fractions can look different but mean the same thing (equivalence).

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
// The lesson — ~45 steps across 3 stages + finale
// ---------------------------------------------------------------------------
//
// Stage 1 — Review halves: What is ½? Share 1 petal between 2 bugs.
// Stage 2 — Discover equivalence: 1/2 = 2/4 using 2 petals and 4 bugs.
// Stage 3 — Practice equivalence: 2/3 = 4/6 using leaves and more bugs.
// Finale  — Celebrate the discovery
//
// SFX palette:
//   chime        — correct answer, moment of insight
//   harp-gliss   — transitions, reveals
//   warm-pad     — opening / title moments
//   soft-bell    — placement sounds
//   xylophone    — small wins, placements
//   music-box    — celebration
//   gentle-whoosh — page transitions
//   sparkle      — fraction reveal
// ---------------------------------------------------------------------------

export const lessonSteps: Record<string, LessonStep> = {

  // ===========================================================================
  // STAGE 1 — Review halves: share 1 petal between 2 ladybugs
  // ===========================================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText:
      "Welcome to the Garden Party! The sun is warm, the flowers are blooming, "
      + "and the bugs have set up tiny tables under the daisies. "
      + "Today you are the garden helper — you will make sure everyone gets a fair share of petals and leaves.",
    next: "s1-meet-bugs",
    sfx: "warm-pad",
  },

  "s1-meet-bugs": {
    id: "s1-meet-bugs",
    type: "narrate",
    tutorText:
      "First up: two little ladybugs named Dot and Pip. "
      + "They found one beautiful rose petal and they both want a piece. "
      + "Can you help them share it fairly?",
    next: "s1-share-question",
    sfx: "harp-gliss",
  },

  "s1-share-question": {
    id: "s1-share-question",
    type: "choice",
    tutorText:
      "One petal, two ladybugs. If we split the petal into two equal pieces, "
      + "how much of the petal does each ladybug get?",
    choices: [
      { label: "One half", next: "s1-correct-half", correct: true },
      { label: "One whole petal", next: "s1-wrong-whole" },
      { label: "One quarter", next: "s1-wrong-quarter" },
    ],
  },

  "s1-wrong-whole": {
    id: "s1-wrong-whole",
    type: "narrate",
    tutorText:
      "If each ladybug got a whole petal, we would need 2 petals. "
      + "But we only have 1! When we cut 1 petal into 2 equal pieces, "
      + "each piece is smaller than the whole petal. What do we call that piece?",
    next: "s1-share-question",
    sfx: "gentle-whoosh",
  },

  "s1-wrong-quarter": {
    id: "s1-wrong-quarter",
    type: "narrate",
    tutorText:
      "A quarter means we cut something into 4 equal pieces. "
      + "But we are only splitting this petal between 2 ladybugs, not 4. "
      + "Two equal pieces from one petal — what is each piece called?",
    next: "s1-share-question",
    sfx: "gentle-whoosh",
  },

  "s1-correct-half": {
    id: "s1-correct-half",
    type: "narrate",
    tutorText:
      "That is right! One half. When you split something into two equal parts, "
      + "each part is called one half. Let's slice this petal right down the middle!",
    next: "s1-do-slice",
    sfx: "chime",
  },

  "s1-do-slice": {
    id: "s1-do-slice",
    type: "slice",
    tutorText:
      "Tap the rose petal to slice it into two equal pieces. "
      + "Nice and even — Dot and Pip are watching!",
    next: "s1-distribute-halves",
    sfx: "gentle-whoosh",
  },

  "s1-distribute-halves": {
    id: "s1-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Now give one half to Dot and one half to Pip. Fair and square!",
    characterCount: 2,
    next: "s1-show-fraction",
    sfx: "xylophone",
  },

  "s1-show-fraction": {
    id: "s1-show-fraction",
    type: "show-fraction",
    tutorText:
      "Here is how we write one half as a fraction. "
      + "The bottom number, 2, says we split the petal into 2 equal parts. "
      + "The top number, 1, says each ladybug got 1 of those parts.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s1-fraction-check",
    sfx: "sparkle",
  },

  "s1-fraction-check": {
    id: "s1-fraction-check",
    type: "choice",
    tutorText:
      "So one half means...",
    choices: [
      { label: "1 piece out of 2 equal pieces", next: "s1-celebrate", correct: true },
      { label: "2 pieces out of 1", next: "s1-fraction-wrong" },
    ],
  },

  "s1-fraction-wrong": {
    id: "s1-fraction-wrong",
    type: "narrate",
    tutorText:
      "Almost! Remember, the bottom number tells how many equal pieces the petal was split into, "
      + "and the top number tells how many pieces you have. "
      + "We split into 2 pieces and each ladybug got 1. Let's try again.",
    next: "s1-fraction-check",
    sfx: "gentle-whoosh",
  },

  "s1-celebrate": {
    id: "s1-celebrate",
    type: "narrate",
    tutorText:
      "Wonderful! Dot and Pip are munching happily on their half-petals. "
      + "You already know about halves — that is going to help us with a discovery "
      + "coming up next. Something surprising happens at the garden party...",
    next: "s2-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 2 — Discover 1/2 = 2/4: share 2 petals among 4 ants
  // ===========================================================================

  "s2-intro": {
    id: "s2-intro",
    type: "narrate",
    tutorText:
      "Four little ants just marched up to the party table! "
      + "Their names are Ace, Bree, Clover, and Dew. "
      + "They found 2 sunflower petals and want to share them fairly.",
    next: "s2-distribute",
    sfx: "harp-gliss",
  },

  "s2-distribute": {
    id: "s2-distribute",
    type: "distribute",
    taskHeader: "Share 2 petals between 4 ants.",
    tutorText:
      "We have 2 petals and 4 ants. Try giving each ant a whole petal. "
      + "Hmm, can you? Let's see what happens!",
    cookieCount: 2,
    characterCount: 4,
    expectedPerPerson: 0,
    next: "s2-problem-notice",
    sfx: "soft-bell",
  },

  "s2-problem-notice": {
    id: "s2-problem-notice",
    type: "choice",
    tutorText:
      "Only 2 petals for 4 ants — there are not enough whole petals for everyone! "
      + "What should we do?",
    choices: [
      { label: "Cut each petal in half so there are more pieces!", next: "s2-slice-plan", correct: true },
      { label: "Tell 2 ants to wait for more petals.", next: "s2-wrong-wait" },
      { label: "Give each ant a quarter of one petal.", next: "s2-wrong-quarter" },
    ],
  },

  "s2-wrong-wait": {
    id: "s2-wrong-wait",
    type: "narrate",
    tutorText:
      "That would not be very fair! All four ants are at the party and all four deserve a share. "
      + "What if we could turn 2 petals into more pieces by cutting them? "
      + "If we cut each petal in half, how many pieces would we have?",
    next: "s2-problem-notice",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-quarter": {
    id: "s2-wrong-quarter",
    type: "narrate",
    tutorText:
      "Good thinking about quarters! But we have 2 whole petals to work with. "
      + "If we cut each petal into halves instead, we would get 4 half-pieces — "
      + "one for each ant. That might be simpler! Let's try halves first.",
    next: "s2-problem-notice",
    sfx: "gentle-whoosh",
  },

  "s2-slice-plan": {
    id: "s2-slice-plan",
    type: "narrate",
    tutorText:
      "Great idea! If we cut each of the 2 petals in half, "
      + "we will get 4 equal pieces — exactly one for each ant!",
    next: "s2-do-slice",
    sfx: "chime",
  },

  "s2-do-slice": {
    id: "s2-do-slice",
    type: "slice",
    tutorText:
      "Tap each petal to slice it in half. Two petals become four pieces!",
    next: "s2-distribute-halves",
    sfx: "gentle-whoosh",
  },

  "s2-distribute-halves": {
    id: "s2-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Now hand out the 4 half-pieces — one to each ant. "
      + "Ace, Bree, Clover, and Dew each get one piece!",
    characterCount: 4,
    next: "s2-how-much",
    sfx: "xylophone",
  },

  "s2-how-much": {
    id: "s2-how-much",
    type: "choice",
    tutorText:
      "Each ant got one piece, and each piece is half of a petal. "
      + "So how much petal does each ant have?",
    choices: [
      { label: "One half of a petal", next: "s2-show-half", correct: true },
      { label: "One whole petal", next: "s2-wrong-whole" },
      { label: "One quarter of a petal", next: "s2-wrong-quarter2" },
    ],
  },

  "s2-wrong-whole": {
    id: "s2-wrong-whole",
    type: "narrate",
    tutorText:
      "We only had 2 petals for 4 ants, so each ant cannot have a whole petal. "
      + "Each piece is half of a petal. So each ant has...",
    next: "s2-how-much",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-quarter2": {
    id: "s2-wrong-quarter2",
    type: "narrate",
    tutorText:
      "Not quite! We cut each petal into 2 pieces, not 4. "
      + "When you cut something into 2 equal pieces, each piece is one half, not one quarter. "
      + "Each ant has one of those half-pieces. So each ant has...",
    next: "s2-how-much",
    sfx: "gentle-whoosh",
  },

  "s2-show-half": {
    id: "s2-show-half",
    type: "show-fraction",
    tutorText:
      "Each ant has one half of a petal. Here is that fraction again: one half!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s2-big-question",
    sfx: "sparkle",
  },

  "s2-big-question": {
    id: "s2-big-question",
    type: "narrate",
    tutorText:
      "Now here is the really interesting part. "
      + "We used 2 petals and shared them among 4 ants. "
      + "We could also write that as a fraction: the ants got 2 out of 4 pieces total. "
      + "But wait — we just said each ant got one half. So could 2 out of 4 be the same as 1 out of 2?",
    next: "s2-equivalence-question",
    sfx: "harp-gliss",
  },

  "s2-equivalence-question": {
    id: "s2-equivalence-question",
    type: "choice",
    tutorText:
      "Think about it: each ant has 1 half-piece. But if we think of all the pieces together, "
      + "each ant has 1 piece out of 4 total pieces, which came from 2 petals. "
      + "Does one half equal two quarters?",
    choices: [
      { label: "Yes! They are the same amount!", next: "s2-equivalence-yes", correct: true },
      { label: "No, they must be different.", next: "s2-equivalence-no" },
    ],
  },

  "s2-equivalence-no": {
    id: "s2-equivalence-no",
    type: "narrate",
    tutorText:
      "I understand why it seems different — the numbers look different! "
      + "But picture this: take one petal and cut it in half. You have 1 out of 2 pieces. "
      + "Now cut each half in half again. You have 2 out of 4 pieces — "
      + "but the amount of petal has not changed! Same petal, same amount. "
      + "Let's look at this again.",
    next: "s2-equivalence-question",
    sfx: "gentle-whoosh",
  },

  "s2-equivalence-yes": {
    id: "s2-equivalence-yes",
    type: "narrate",
    tutorText:
      "Yes! You discovered something amazing! One half and two quarters are the same amount. "
      + "The fractions look different — different numbers on top and bottom — "
      + "but they describe the exact same amount of petal. "
      + "This is called equivalent fractions!",
    next: "s2-show-equiv",
    sfx: "chime",
  },

  "s2-show-equiv": {
    id: "s2-show-equiv",
    type: "show-fraction",
    tutorText:
      "Look: one half...",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s2-show-equiv-2",
    sfx: "sparkle",
  },

  "s2-show-equiv-2": {
    id: "s2-show-equiv-2",
    type: "show-fraction",
    tutorText:
      "...is the same as two quarters! The numbers are different, "
      + "but the amount is exactly the same. "
      + "One half equals two quarters. That is fraction equivalence!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "s2-why-it-works",
    sfx: "sparkle",
  },

  "s2-why-it-works": {
    id: "s2-why-it-works",
    type: "narrate",
    tutorText:
      "Here is the secret: if you multiply both the top and the bottom of a fraction "
      + "by the same number, you get an equivalent fraction. "
      + "1 times 2 is 2. And 2 times 2 is 4. So one half becomes two quarters! "
      + "The ants are buzzing with excitement about this discovery.",
    next: "s2-check-understanding",
    sfx: "harp-gliss",
  },

  "s2-check-understanding": {
    id: "s2-check-understanding",
    type: "choice",
    tutorText:
      "Quick check! Which fraction is equivalent to one half?",
    choices: [
      { label: "2/4", next: "s2-check-correct", correct: true },
      { label: "1/4", next: "s2-check-wrong-1" },
      { label: "3/4", next: "s2-check-wrong-2" },
    ],
  },

  "s2-check-wrong-1": {
    id: "s2-check-wrong-1",
    type: "narrate",
    tutorText:
      "One quarter is actually smaller than one half! "
      + "Remember, we need to multiply both the top and the bottom by the same number. "
      + "1 times 2 is 2 on top, and 2 times 2 is 4 on the bottom. What does that give us?",
    next: "s2-check-understanding",
    sfx: "gentle-whoosh",
  },

  "s2-check-wrong-2": {
    id: "s2-check-wrong-2",
    type: "narrate",
    tutorText:
      "Three quarters is actually more than one half! "
      + "To find the equivalent fraction, we multiply both the top and bottom of one half by 2. "
      + "1 times 2 on top, 2 times 2 on the bottom. Which fraction is that?",
    next: "s2-check-understanding",
    sfx: "gentle-whoosh",
  },

  "s2-check-correct": {
    id: "s2-check-correct",
    type: "narrate",
    tutorText:
      "You got it! Two quarters equals one half. The ants are doing a happy dance! "
      + "Now let's see if this idea works with other fractions too. "
      + "More garden party guests are arriving...",
    next: "s3-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 3 — Practice: 2/3 = 4/6 using leaves and beetles
  // ===========================================================================

  "s3-intro": {
    id: "s3-intro",
    type: "narrate",
    tutorText:
      "A group of beetles just rolled up to the garden party! "
      + "They have brought along some big green leaves from the oak tree. "
      + "Let's help them share fairly and see if we discover more equivalent fractions.",
    next: "s3-setup",
    sfx: "harp-gliss",
  },

  "s3-setup": {
    id: "s3-setup",
    type: "narrate",
    tutorText:
      "First, here are 2 leaves and 3 beetles: Maple, Fern, and Sage. "
      + "Let's see what happens when we share 2 leaves among 3 beetles.",
    next: "s3-distribute",
    sfx: "gentle-whoosh",
  },

  "s3-distribute": {
    id: "s3-distribute",
    type: "distribute",
    taskHeader: "Share 2 leaves among 3 beetles.",
    tutorText:
      "2 leaves, 3 beetles. There are not enough whole leaves for everyone, "
      + "so we will need to cut them. Give out what you can!",
    cookieCount: 2,
    characterCount: 3,
    expectedPerPerson: 0,
    next: "s3-cutting-plan",
    sfx: "soft-bell",
  },

  "s3-cutting-plan": {
    id: "s3-cutting-plan",
    type: "choice",
    tutorText:
      "We need to share 2 leaves among 3 beetles. "
      + "If we cut each leaf into 3 equal pieces, how many pieces will we have?",
    choices: [
      { label: "6 pieces", next: "s3-cutting-correct", correct: true },
      { label: "3 pieces", next: "s3-cutting-wrong-3" },
      { label: "5 pieces", next: "s3-cutting-wrong-5" },
    ],
  },

  "s3-cutting-wrong-3": {
    id: "s3-cutting-wrong-3",
    type: "narrate",
    tutorText:
      "3 pieces would be right if we only had 1 leaf. "
      + "But we have 2 leaves! If each leaf becomes 3 pieces, "
      + "then 2 leaves become... 2 times 3 pieces!",
    next: "s3-cutting-plan",
    sfx: "gentle-whoosh",
  },

  "s3-cutting-wrong-5": {
    id: "s3-cutting-wrong-5",
    type: "narrate",
    tutorText:
      "Not quite. Each leaf gets cut into 3 equal pieces. "
      + "The first leaf gives us 3 pieces, and the second leaf gives us 3 more. "
      + "3 plus 3 equals...",
    next: "s3-cutting-plan",
    sfx: "gentle-whoosh",
  },

  "s3-cutting-correct": {
    id: "s3-cutting-correct",
    type: "narrate",
    tutorText:
      "Right! 2 leaves, each cut into 3 pieces, gives us 6 pieces total. "
      + "And 6 pieces shared among 3 beetles means each beetle gets 2 pieces! Let's cut!",
    next: "s3-do-slice",
    sfx: "chime",
  },

  "s3-do-slice": {
    id: "s3-do-slice",
    type: "slice",
    tutorText:
      "Tap each leaf to slice it into 3 equal parts. Careful cuts, garden helper!",
    next: "s3-distribute-pieces",
    sfx: "gentle-whoosh",
  },

  "s3-distribute-pieces": {
    id: "s3-distribute-pieces",
    type: "distribute-halves",
    tutorText:
      "Now give each beetle 2 pieces. Maple, Fern, and Sage each get their fair share!",
    characterCount: 3,
    next: "s3-each-beetle-has",
    sfx: "xylophone",
  },

  "s3-each-beetle-has": {
    id: "s3-each-beetle-has",
    type: "choice",
    tutorText:
      "Each beetle has 2 pieces, and each piece is one third of a leaf. "
      + "So each beetle has how much leaf?",
    choices: [
      { label: "Two thirds of a leaf", next: "s3-show-two-thirds", correct: true },
      { label: "One third of a leaf", next: "s3-wrong-one-third" },
      { label: "One whole leaf", next: "s3-wrong-one-leaf" },
    ],
  },

  "s3-wrong-one-third": {
    id: "s3-wrong-one-third",
    type: "narrate",
    tutorText:
      "One third would be just 1 piece. But look — each beetle has 2 pieces! "
      + "Each piece is one third, so 2 pieces means two thirds. Let's try again.",
    next: "s3-each-beetle-has",
    sfx: "gentle-whoosh",
  },

  "s3-wrong-one-leaf": {
    id: "s3-wrong-one-leaf",
    type: "narrate",
    tutorText:
      "A whole leaf would be 3 out of 3 pieces, but each beetle only has 2 pieces. "
      + "2 out of 3 equal pieces is called two thirds. What does each beetle have?",
    next: "s3-each-beetle-has",
    sfx: "gentle-whoosh",
  },

  "s3-show-two-thirds": {
    id: "s3-show-two-thirds",
    type: "show-fraction",
    tutorText:
      "Each beetle has two thirds of a leaf! "
      + "The 3 on the bottom says each leaf was cut into 3 equal pieces. "
      + "The 2 on top says each beetle got 2 of those pieces.",
    showFractionNum: 2,
    showFractionDen: 3,
    next: "s3-equiv-setup",
    sfx: "sparkle",
  },

  "s3-equiv-setup": {
    id: "s3-equiv-setup",
    type: "narrate",
    tutorText:
      "Now here is where the magic happens again! "
      + "What if each of those thirds was cut in half? "
      + "Each leaf would have 6 tiny pieces instead of 3 bigger ones. "
      + "And each beetle's 2 pieces would become 4 tiny pieces.",
    next: "s3-equiv-question",
    sfx: "harp-gliss",
  },

  "s3-equiv-question": {
    id: "s3-equiv-question",
    type: "choice",
    tutorText:
      "If each beetle has 4 pieces out of 6 total tiny pieces per leaf, "
      + "that is the fraction four sixths. "
      + "Is four sixths the same amount as two thirds?",
    choices: [
      { label: "Yes! Same amount, just smaller pieces!", next: "s3-equiv-correct", correct: true },
      { label: "No, 4/6 must be bigger than 2/3.", next: "s3-equiv-wrong" },
    ],
  },

  "s3-equiv-wrong": {
    id: "s3-equiv-wrong",
    type: "narrate",
    tutorText:
      "It looks bigger because the numbers are bigger, but think about it this way: "
      + "we did not add any leaf — we just cut the same pieces into smaller pieces! "
      + "2 out of 3 big pieces is the same amount of leaf as 4 out of 6 small pieces. "
      + "The amount has not changed, only the size of the pieces changed.",
    next: "s3-equiv-question",
    sfx: "gentle-whoosh",
  },

  "s3-equiv-correct": {
    id: "s3-equiv-correct",
    type: "narrate",
    tutorText:
      "Exactly right! Two thirds and four sixths are equivalent fractions! "
      + "We multiplied both the top and the bottom by 2. "
      + "2 times 2 is 4, and 3 times 2 is 6. The amount of leaf is exactly the same.",
    next: "s3-show-equiv-1",
    sfx: "chime",
  },

  "s3-show-equiv-1": {
    id: "s3-show-equiv-1",
    type: "show-fraction",
    tutorText:
      "Two thirds...",
    showFractionNum: 2,
    showFractionDen: 3,
    next: "s3-show-equiv-2",
    sfx: "sparkle",
  },

  "s3-show-equiv-2": {
    id: "s3-show-equiv-2",
    type: "show-fraction",
    tutorText:
      "...equals four sixths! Different numbers, same amount. "
      + "You found another pair of equivalent fractions!",
    showFractionNum: 4,
    showFractionDen: 6,
    next: "s3-final-quiz",
    sfx: "sparkle",
  },

  "s3-final-quiz": {
    id: "s3-final-quiz",
    type: "choice",
    tutorText:
      "The beetles want to test you! Which of these is equivalent to two thirds?",
    choices: [
      { label: "4/6", next: "s3-quiz-correct", correct: true },
      { label: "3/6", next: "s3-quiz-wrong-1" },
      { label: "2/6", next: "s3-quiz-wrong-2" },
    ],
  },

  "s3-quiz-wrong-1": {
    id: "s3-quiz-wrong-1",
    type: "narrate",
    tutorText:
      "Three sixths is actually the same as one half, not two thirds! "
      + "To find the equivalent of two thirds, we multiply both the 2 and the 3 by the same number. "
      + "2 times 2 on top, 3 times 2 on the bottom. What do we get?",
    next: "s3-final-quiz",
    sfx: "gentle-whoosh",
  },

  "s3-quiz-wrong-2": {
    id: "s3-quiz-wrong-2",
    type: "narrate",
    tutorText:
      "Two sixths is actually the same as one third, which is less than two thirds. "
      + "Remember the rule: multiply both the top and bottom by the same number. "
      + "2 times 2 is 4, and 3 times 2 is 6. So two thirds equals...",
    next: "s3-final-quiz",
    sfx: "gentle-whoosh",
  },

  "s3-quiz-correct": {
    id: "s3-quiz-correct",
    type: "narrate",
    tutorText:
      "You nailed it! Four sixths equals two thirds. "
      + "The beetles are cheering and waving their tiny antennae! "
      + "You have become a true fraction expert at this garden party.",
    next: "finale-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // FINALE — Celebrate the discovery
  // ===========================================================================

  "finale-intro": {
    id: "finale-intro",
    type: "narrate",
    tutorText:
      "All the bugs at the garden party are gathered around you now — "
      + "Dot and Pip the ladybugs, the four ants, and the three beetles. "
      + "They want to celebrate what you discovered today.",
    next: "finale-review",
    sfx: "harp-gliss",
  },

  "finale-review": {
    id: "finale-review",
    type: "narrate",
    tutorText:
      "You learned that one half is 1 piece out of 2. "
      + "Then you discovered that one half is the same amount as two quarters — "
      + "the fractions look different but mean the same thing! "
      + "And then you found that two thirds is the same as four sixths.",
    next: "finale-big-idea",
    sfx: "gentle-whoosh",
  },

  "finale-big-idea": {
    id: "finale-big-idea",
    type: "narrate",
    tutorText:
      "The big idea is this: when you multiply the top and the bottom of a fraction "
      + "by the same number, you get an equivalent fraction. "
      + "It is like cutting pieces into smaller pieces — "
      + "you have more pieces, but the total amount stays the same!",
    next: "finale-last-question",
    sfx: "warm-pad",
  },

  "finale-last-question": {
    id: "finale-last-question",
    type: "choice",
    tutorText:
      "One last question from the garden party bugs: "
      + "can a fraction have lots of different equivalent fractions?",
    choices: [
      { label: "Yes! You can keep multiplying to find more!", next: "finale-celebrate", correct: true },
      { label: "No, each fraction only has one equivalent.", next: "finale-wrong" },
    ],
  },

  "finale-wrong": {
    id: "finale-wrong",
    type: "narrate",
    tutorText:
      "Actually, you can keep going! One half equals two quarters, "
      + "but it also equals three sixths, four eighths, five tenths, and on and on! "
      + "You can always multiply by a bigger number to find more equivalents. "
      + "There are infinitely many!",
    next: "finale-last-question",
    sfx: "gentle-whoosh",
  },

  "finale-celebrate": {
    id: "finale-celebrate",
    type: "narrate",
    tutorText:
      "That is right! One half also equals three sixths, four eighths, "
      + "five tenths — the list goes on forever! Equivalent fractions are everywhere.",
    next: "finale-end",
    sfx: "chime",
  },

  "finale-end": {
    id: "finale-end",
    type: "narrate",
    tutorText:
      "The garden party is winding down. Fireflies are blinking in the twilight. "
      + "All the bugs agree: you are the best garden helper they have ever had. "
      + "You shared fairly, you discovered equivalent fractions, and you had fun doing it. "
      + "Come back anytime — the garden always has more surprises!",
    next: "end",
    sfx: "music-box",
  },
};
