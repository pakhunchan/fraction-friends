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
  // === PHASE 1: Easy warm-up (4 pizza slices, 2 kids) ===
  "start": {
    id: "start",
    type: "narrate",
    tutorText: "Welcome to the BEST birthday party EVER! I'm your host, and we've got a piping-hot pizza ready to share. Let's get this party started!",
    next: "warmup-distribute",
    sfx: "pop",
  },
  "warmup-distribute": {
    id: "warmup-distribute",
    type: "distribute",
    taskHeader: "Share 4 pizza slices.",
    tutorText: "Alright birthday crew, we've got 4 slices of pizza and 2 hungry party guests! Let's make sure everyone gets the same amount. Drag those slices!",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "warmup-result",
    sfx: "pop",
  },
  "warmup-result": {
    id: "warmup-result",
    type: "show-number",
    tutorText: "Woo-hoo! 4 slices shared between 2 party guests means 2 slices each. That was a piece of cake -- well, a piece of pizza!",
    showNumber: "2",
    next: "phase2-intro",
    sfx: "ding",
  },

  // === PHASE 2: Conflict (5 pizza slices, 2 kids) ===
  "phase2-intro": {
    id: "phase2-intro",
    type: "narrate",
    tutorText: "Hold on, party people! Someone just brought MORE pizza to the party. But uh-oh, the numbers are a little trickier this time...",
    next: "phase2-distribute",
    sfx: "pop",
  },
  "phase2-distribute": {
    id: "phase2-distribute",
    type: "distribute",
    taskHeader: "Share 5 pizza slices equally.",
    tutorText: "We've got 5 slices and 2 guests. Hand out as many as you can so it's fair and square!",
    cookieCount: 5,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "leftover",
    sfx: "pop",
  },
  "leftover": {
    id: "leftover",
    type: "choice",
    tutorText: "Uh-oh, there's one slice left sitting on the plate! At this party, NOBODY goes hungry. What should we do?",
    choices: [
      { label: "Cut it in half", next: "slice-setup", correct: true },
      { label: "Launch it like a frisbee", next: "frisbee-response" },
      { label: "Stack it on the pizza tower", next: "tower-response" },
    ],
  },
  "frisbee-response": {
    id: "frisbee-response",
    type: "narrate",
    tutorText: "Ha! A pizza frisbee would be LEGENDARY, but I don't think the birthday kid's parents would love cheese on the ceiling. Let's think of something that feeds our guests!",
    next: "leftover",
    sfx: "boing",
  },
  "tower-response": {
    id: "tower-response",
    type: "narrate",
    tutorText: "A leaning tower of pizza? That's giving me major architect vibes! But our guests' tummies are rumbling. Let's find a way to share that last slice!",
    next: "leftover",
    sfx: "boing",
  },
  "slice-setup": {
    id: "slice-setup",
    type: "narrate",
    tutorText: "Great call, party planner! Let me grab the pizza cutter. This is going to be SATISFYING.",
    next: "do-slice",
  },
  "do-slice": {
    id: "do-slice",
    type: "slice",
    tutorText: "Tap that pizza slice to cut it right down the middle!",
    next: "distribute-halves",
    sfx: "slice",
  },
  "distribute-halves": {
    id: "distribute-halves",
    type: "distribute-halves",
    tutorText: "Now give each guest their half! Fair shares for the whole birthday crew!",
    characterCount: 2,
    next: "how-many-each",
    sfx: "woosh",
  },
  "how-many-each": {
    id: "how-many-each",
    type: "choice",
    tutorText: "Okay party quiz time! How many pizza slices did each guest end up with?",
    choices: [
      { label: "Two", next: "wrong-two" },
      { label: "Two and a half", next: "correct-two-half", correct: true },
      { label: "A gazillion", next: "wrong-gazillion" },
    ],
  },
  "wrong-two": {
    id: "wrong-two",
    type: "narrate",
    tutorText: "Sooo close! Two whole slices, yes! But don't forget that half-slice we just dished out. There's a little extra on each plate!",
    next: "how-many-each",
    sfx: "boing",
  },
  "wrong-gazillion": {
    id: "wrong-gazillion",
    type: "narrate",
    tutorText: "A gazillion slices?! Now THAT would be a party! But let's count what's actually on the plates. Look at the whole slices and that half!",
    next: "how-many-each",
    sfx: "boing",
  },
  "correct-two-half": {
    id: "correct-two-half",
    type: "show-number",
    tutorText: "YES! You nailed it! Two and a half pizza slices each! Give yourself a round of applause!",
    showNumber: "2",
    next: "explain-whole",
    sfx: "ding",
  },

  // === PHASE 3: Bridge to symbolic (whole numbers vs fractions) ===
  "explain-whole": {
    id: "explain-whole",
    type: "narrate",
    tutorText: "Okay, let's talk numbers for a sec. Writing down the 2 whole slices is easy peasy. We just write the number 2!",
    next: "but-half",
  },
  "but-half": {
    id: "but-half",
    type: "narrate",
    tutorText: "But wait -- how do we write down that half-slice part? Hmm, we can't just say 'that little piece.' We need a number for it!",
    next: "know-fraction",
  },
  "know-fraction": {
    id: "know-fraction",
    type: "choice",
    tutorText: "Do you know how to write one half as a number? No wrong answers at this party!",
    choices: [
      { label: "I think so!", next: "show-half-fraction" },
      { label: "Not yet!", next: "show-half-fraction" },
      { label: "Ask the pizza for its opinion", next: "ask-pizza-response" },
    ],
  },
  "ask-pizza-response": {
    id: "ask-pizza-response",
    type: "narrate",
    tutorText: "I leaned in real close and asked the pizza. It said, and I quote, 'mozzarella pepperoni crust crust.' Not super helpful. Let ME show you instead!",
    next: "show-half-fraction",
    sfx: "boing",
  },
  "show-half-fraction": {
    id: "show-half-fraction",
    type: "show-fraction",
    tutorText: "Ta-da! Here's how we write it! One number on top, one on the bottom. The bottom says how many equal pieces we cut, and the top says how many pieces we're talking about!",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "know-word-fraction",
    sfx: "ding",
  },
  "know-word-fraction": {
    id: "know-word-fraction",
    type: "choice",
    tutorText: "When we stack two numbers like this, it has a super special name. It's called a FRACTION! Have you heard that word before?",
    choices: [
      { label: "Yep!", next: "explain-fraction" },
      { label: "That's new to me!", next: "explain-fraction" },
    ],
  },
  "explain-fraction": {
    id: "explain-fraction",
    type: "narrate",
    tutorText: "A whole number, like 2, counts whole pizza slices. But a fraction, like one half, lets us count PART of a slice. It's like a superpower for sharing at parties!",
    next: "each-got",
  },
  "each-got": {
    id: "each-got",
    type: "show-fraction",
    tutorText: "So each guest walked away with 2 and a half slices of pizza. We write that like THIS! Pretty cool, right?",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "phase4-intro",
    sfx: "ding",
  },

  // === PHASE 4: Harder challenge (5 pizza slices, 4 kids with knife tool) ===
  "phase4-intro": {
    id: "phase4-intro",
    type: "narrate",
    tutorText: "Whoa whoa whoa -- MORE party guests just showed up! This is the BIGGEST birthday bash ever! Think you can handle an even trickier share?",
    next: "phase4-distribute",
    sfx: "pop",
  },
  "phase4-distribute": {
    id: "phase4-distribute",
    type: "distribute",
    taskHeader: "Share 5 pizza slices equally.",
    tutorText: "Here's the ultimate party challenge: 5 slices of pizza and 4 hungry guests! You've got the pizza cutter if you need it. Make it fair, party planner!",
    cookieCount: 5,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "phase4-check",
    sfx: "pop",
  },
  "phase4-check": {
    id: "phase4-check",
    type: "choice",
    tutorText: "Everyone's been served! Final party quiz: how many pizza slices did each guest get?",
    choices: [
      { label: "One", next: "wrong-one-p4" },
      { label: "One and a quarter", next: "correct-one-quarter", correct: true },
      { label: "I need a pizza calculator", next: "calculator-response" },
    ],
  },
  "wrong-one-p4": {
    id: "wrong-one-p4",
    type: "narrate",
    tutorText: "One whole slice, yes! But remember those extra pieces we cut up? Each guest got a little bonus on top of their whole slice!",
    next: "phase4-check",
    sfx: "boing",
  },
  "calculator-response": {
    id: "calculator-response",
    type: "narrate",
    tutorText: "Ha! A pizza calculator -- I WISH that existed! Okay, look at each plate: one whole slice, plus one little piece from the leftover slice we cut into 4. What does that add up to?",
    next: "phase4-check",
    sfx: "boing",
  },
  "correct-one-quarter": {
    id: "correct-one-quarter",
    type: "show-fraction",
    tutorText: "YESSSS! Each guest got 1 and a quarter slices of pizza! Check out that fraction -- you're a total pro!",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 4,
    next: "lesson-complete",
    sfx: "ding",
  },
  "lesson-complete": {
    id: "lesson-complete",
    type: "narrate",
    tutorText: "You just learned fractions by sharing pizza at a birthday party! Whenever we can't split things perfectly evenly, we cut them into equal pieces -- and THAT is exactly what fractions are. You're a fraction superstar!",
    next: "done",
    sfx: "fanfare",
  },
  "done": {
    id: "done",
    type: "narrate",
    tutorText: "And that's a wrap on the BEST birthday party math lesson EVER! You are officially a pizza-sharing, fraction-knowing party champion! Now who wants cake?",
    next: "end",
    sfx: "fanfare",
  },
};
