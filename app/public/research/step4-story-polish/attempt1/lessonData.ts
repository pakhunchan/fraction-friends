export type StepType =
  | "narrate"         // Tutor speaks, continue button
  | "choice"          // Multiple choice buttons
  | "distribute"      // Kid distributes cookies to characters
  | "slice"           // Kid clicks cookie to slice
  | "distribute-halves" // Kid distributes halves
  | "show-number"     // Big number display
  | "show-fraction"   // Big fraction display

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
  next?: string; // for narrate/distribute steps
  cookieCount?: number;
  characterCount?: number;
  expectedPerPerson?: number;
  showNumber?: string; // e.g. "2" or "2½"
  showFractionNum?: number;
  showFractionDen?: number;
  wholeNumber?: number;
  allowKnife?: boolean;
  sfx?: string;
}

export const lessonSteps: Record<string, LessonStep> = {
  // === PHASE 1: Easy warm-up (4 cookies, 2 people) ===
  "start": {
    id: "start",
    type: "distribute",
    taskHeader: "Share 4 cookies.",
    tutorText: "Okay, we've got 4 cookies and 2 hungry friends. Let's make sure everyone gets the same amount!",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "result-4-2",
    sfx: "pop",
  },
  "result-4-2": {
    id: "result-4-2",
    type: "show-number",
    tutorText: "Nice! 4 cookies shared between 2 people means 2 cookies each. That was pretty smooth!",
    showNumber: "2",
    next: "intro-5-2",
    sfx: "ding",
  },

  // === PHASE 2: Create conflict (5 cookies, 2 people) ===
  "intro-5-2": {
    id: "intro-5-2",
    type: "distribute",
    taskHeader: "Share 5 cookies equally.",
    tutorText: "Alright, here's where it gets interesting. 5 cookies, 2 people. Give everyone as many as you can!",
    cookieCount: 5,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "leftover",
    sfx: "pop",
  },
  "leftover": {
    id: "leftover",
    type: "choice",
    tutorText: "Hmm, there's one cookie left over. What should we do with it?",
    choices: [
      { label: "Cut it in half", next: "slice-cookie", correct: true },
      { label: "Feed it to a hungry dragon", next: "dragon-response" },
      { label: "Stack it into a cookie tower", next: "tower-response" },
    ],
  },
  "dragon-response": {
    id: "dragon-response",
    type: "narrate",
    tutorText: "A dragon would definitely love a cookie! But our friends here are pretty hungry too. Let's find a way to share it with them.",
    next: "leftover",
    sfx: "boing",
  },
  "tower-response": {
    id: "tower-response",
    type: "narrate",
    tutorText: "A cookie tower would be amazing, not gonna lie. But maybe we can do something so everyone gets a bite?",
    next: "leftover",
    sfx: "boing",
  },
  "slice-cookie": {
    id: "slice-cookie",
    type: "narrate",
    tutorText: "Great thinking! Let me grab a knife.",
    next: "do-slice",
  },
  "do-slice": {
    id: "do-slice",
    type: "slice",
    tutorText: "Tap the cookie to slice it right down the middle!",
    next: "distribute-halves",
    sfx: "slice",
  },
  "distribute-halves": {
    id: "distribute-halves",
    type: "distribute-halves",
    tutorText: "Now let's give each friend their half!",
    characterCount: 2,
    next: "how-many-each",
    sfx: "woosh",
  },
  "how-many-each": {
    id: "how-many-each",
    type: "choice",
    tutorText: "So, how many cookies did each person end up with?",
    choices: [
      { label: "Two", next: "wrong-two" },
      { label: "Two and a half", next: "correct-two-half", correct: true },
      { label: "A million", next: "wrong-million" },
    ],
  },
  "wrong-two": {
    id: "wrong-two",
    type: "narrate",
    tutorText: "Almost there! Two whole cookies, yes, but don't forget that half cookie we just handed out.",
    next: "how-many-each",
    sfx: "boing",
  },
  "wrong-million": {
    id: "wrong-million",
    type: "narrate",
    tutorText: "Ha, a million cookies would be the dream! But let's count what we actually have. Look at the whole cookies and the half.",
    next: "how-many-each",
    sfx: "boing",
  },
  "wrong-three": {
    id: "wrong-three",
    type: "narrate",
    tutorText: "Not quite! Each person got 2 whole cookies plus a little piece. Take another peek at those halves.",
    next: "how-many-each",
    sfx: "boing",
  },
  "correct-two-half": {
    id: "correct-two-half",
    type: "show-number",
    tutorText: "That's it! Two and a half cookies each!",
    showNumber: "2",
    next: "explain-whole",
    sfx: "ding",
  },

  // === PHASE 3: Bridge to symbolic ===
  "explain-whole": {
    id: "explain-whole",
    type: "narrate",
    tutorText: "Writing down the 2 whole cookies is easy. We just write the number 2.",
    next: "but-half",
  },
  "but-half": {
    id: "but-half",
    type: "narrate",
    tutorText: "But how do we write down that half cookie part? Hmm...",
    next: "know-fraction",
  },
  "know-fraction": {
    id: "know-fraction",
    type: "choice",
    tutorText: "Do you happen to know how to write one half as a number?",
    choices: [
      { label: "I think so!", next: "show-half-fraction" },
      { label: "Not yet!", next: "show-half-fraction" },
      { label: "Ask the cookies what they think", next: "ask-cookies-response" },
    ],
  },
  "ask-cookies-response": {
    id: "ask-cookies-response",
    type: "narrate",
    tutorText: "I just asked them. They said, and I quote, \"crumble crumble crumble.\" Not super helpful. Let me show you instead!",
    next: "show-half-fraction",
    sfx: "boing",
  },
  "show-half-fraction": {
    id: "show-half-fraction",
    type: "show-fraction",
    tutorText: "Here's how we write it! One number on top, one on the bottom.",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "know-word-fraction",
    sfx: "ding",
  },
  "know-word-fraction": {
    id: "know-word-fraction",
    type: "choice",
    tutorText: "When we stack two numbers like this, it has a special name. It's called a fraction! Have you heard that word before?",
    choices: [
      { label: "Yep!", next: "explain-fraction" },
      { label: "That's new to me!", next: "explain-fraction" },
    ],
  },
  "explain-fraction": {
    id: "explain-fraction",
    type: "narrate",
    tutorText: "A whole number, like 2, counts whole cookies. But a fraction, like one half, lets us count part of a cookie. Pretty handy, right?",
    next: "each-got",
  },
  "each-got": {
    id: "each-got",
    type: "show-fraction",
    tutorText: "So each person walked away with 2 and a half cookies. We write that like this!",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "intro-5-4",
    sfx: "ding",
  },

  // === PHASE 4: Harder challenge (5 cookies, 4 people) ===
  "intro-5-4": {
    id: "intro-5-4",
    type: "distribute",
    taskHeader: "Share 5 cookies equally.",
    tutorText: "Ready for a bigger challenge? Now we have 5 cookies and 4 people. That's a full table! You can use the knife tool if you need it.",
    cookieCount: 5,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "result-5-4-check",
    sfx: "pop",
  },
  "result-5-4-check": {
    id: "result-5-4-check",
    type: "choice",
    tutorText: "Alright, everyone's been served. How many cookies did each person get?",
    choices: [
      { label: "One", next: "wrong-one-54" },
      { label: "One and a quarter", next: "correct-one-quarter", correct: true },
      { label: "I lost count, honestly", next: "lost-count-response" },
    ],
  },
  "wrong-one-54": {
    id: "wrong-one-54",
    type: "narrate",
    tutorText: "One whole cookie, yes! But remember those extra pieces we sliced up? Each person got a little more than just one.",
    next: "result-5-4-check",
    sfx: "boing",
  },
  "wrong-two-54": {
    id: "wrong-two-54",
    type: "narrate",
    tutorText: "Hmm, not quite that many. Let's look carefully at the whole cookies and the little pieces each person got.",
    next: "result-5-4-check",
    sfx: "boing",
  },
  "lost-count-response": {
    id: "lost-count-response",
    type: "narrate",
    tutorText: "Ha, fair enough! There's a lot going on. Look at each person's plate: one whole cookie, plus one little piece. What does that add up to?",
    next: "result-5-4-check",
    sfx: "boing",
  },
  "correct-one-quarter": {
    id: "correct-one-quarter",
    type: "show-fraction",
    tutorText: "Yes! Each person got 1 and a quarter cookies! Look at that fraction.",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 4,
    next: "lesson-complete",
    sfx: "ding",
  },
  "lesson-complete": {
    id: "lesson-complete",
    type: "narrate",
    tutorText: "You just figured out fractions by sharing cookies! Whenever we can't split things evenly, we cut them into equal pieces, and that's exactly what fractions are. You're a natural!",
    next: "done",
    sfx: "fanfare",
  },
  "done": {
    id: "done",
    type: "narrate",
    tutorText: "Awesome job today! You are officially a cookie-sharing, fraction-knowing superstar!",
    next: "end",
    sfx: "fanfare",
  },
};
