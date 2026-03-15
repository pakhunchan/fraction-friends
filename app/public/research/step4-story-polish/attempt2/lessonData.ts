export type StepType =
  | "narrate"         // Tutor speaks, continue button
  | "choice"          // Multiple choice buttons
  | "distribute"      // Kid distributes cookies to characters
  | "slice"           // Kid clicks cookie to slice
  | "distribute-halves" // Kid distributes halves
  | "show-number"     // Big number display
  | "show-fraction"   // Big fraction display

export type TutorEmotion =
  | "excited"
  | "thinking"
  | "celebrating"
  | "surprised";

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
  tutorEmotion?: TutorEmotion;
}

export const lessonSteps: Record<string, LessonStep> = {

  // =====================================================
  // PHASE 1: Meet Cookie & Easy Warm-up (4 cookies, 2 people)
  // =====================================================

  "start": {
    id: "start",
    type: "distribute",
    taskHeader: "Share 4 cookies between 2 friends.",
    tutorText:
      "Hey there! I'm Cookie, and I've got a problem. My friends are hungry and I need YOUR help sharing these cookies fairly! We have 4 cookies and 2 friends. Drag each cookie to a friend!",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "result-4-2",
    sfx: "ambient",
    tutorEmotion: "excited",
  },

  "result-4-2": {
    id: "result-4-2",
    type: "show-number",
    tutorText:
      "You figured that out so fast! 4 cookies split between 2 friends means everybody gets 2. That's what I call a fair deal.",
    showNumber: "2",
    next: "phase2-setup",
    sfx: "ding",
    tutorEmotion: "celebrating",
  },

  // =====================================================
  // PHASE 2: Create conflict (5 cookies, 2 people)
  // =====================================================

  "phase2-setup": {
    id: "phase2-setup",
    type: "narrate",
    tutorText:
      "Okay, that was the warm-up. But my friends just baked another batch and... uh oh. This time the numbers aren't so tidy.",
    next: "intro-5-2",
    tutorEmotion: "thinking",
  },

  "intro-5-2": {
    id: "intro-5-2",
    type: "distribute",
    taskHeader: "Share 5 cookies between 2 friends.",
    tutorText:
      "5 cookies, 2 friends. Give each person as many whole cookies as you can. I have a feeling something interesting is about to happen...",
    cookieCount: 5,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "leftover",
    sfx: "pop",
    tutorEmotion: "excited",
  },

  "leftover": {
    id: "leftover",
    type: "choice",
    tutorText:
      "Uh oh... there's one cookie left and two hungry friends. This is tricky! What should we do with it?",
    choices: [
      { label: "Cut it in half", next: "slice-cookie", correct: true },
      { label: "Launch it into space", next: "space-response" },
      { label: "Eat it myself", next: "sneaky-response" },
    ],
    tutorEmotion: "thinking",
  },

  "space-response": {
    id: "space-response",
    type: "narrate",
    tutorText:
      "Ha! A cookie in orbit! That would be out of this world... but our friends would still be hungry down here on Earth. Let's try something a little more... shareable.",
    next: "leftover",
    sfx: "woosh",
    tutorEmotion: "surprised",
  },

  "sneaky-response": {
    id: "sneaky-response",
    type: "narrate",
    tutorText:
      "Sneaky! I like your style. But I think your friends might notice the crumbs on your face... Let's find a fair way to handle this.",
    next: "leftover",
    sfx: "boing",
    tutorEmotion: "surprised",
  },

  "slice-cookie": {
    id: "slice-cookie",
    type: "narrate",
    tutorText:
      "Now you're thinking like a real cookie engineer! Cutting it is the perfect move. Hold on, let me grab my trusty cookie knife...",
    next: "do-slice",
    sfx: "woosh",
    tutorEmotion: "excited",
  },

  "do-slice": {
    id: "do-slice",
    type: "slice",
    tutorText:
      "Alright, tap on that cookie and SLICE it right down the middle!",
    next: "slice-reaction",
    sfx: "slice",
    tutorEmotion: "excited",
  },

  "slice-reaction": {
    id: "slice-reaction",
    type: "narrate",
    tutorText:
      "PERFECT cut! Right down the middle. Two equal pieces. You could be a cookie surgeon.",
    next: "distribute-halves",
    sfx: "ding",
    tutorEmotion: "celebrating",
  },

  "distribute-halves": {
    id: "distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Now give each friend one half. Fair and square!",
    characterCount: 2,
    next: "halves-done",
    sfx: "pop",
    tutorEmotion: "excited",
  },

  "halves-done": {
    id: "halves-done",
    type: "narrate",
    tutorText:
      "Look at those smiles! Everyone got the same amount. That's the power of sharing. Now here's the big question...",
    next: "how-many-each",
    tutorEmotion: "thinking",
  },

  "how-many-each": {
    id: "how-many-each",
    type: "choice",
    tutorText:
      "How many cookies did each friend end up with? Count carefully -- the whole cookies AND the piece!",
    choices: [
      { label: "Two", next: "wrong-two" },
      { label: "Two and a half", next: "correct-two-half", correct: true },
      { label: "Three", next: "wrong-three" },
    ],
    tutorEmotion: "thinking",
  },

  "wrong-two": {
    id: "wrong-two",
    type: "narrate",
    tutorText:
      "Two whole cookies -- yes, they did get those! But you're forgetting the bonus piece. Remember that cookie we sliced? Each person got a half of it too.",
    next: "how-many-each",
    sfx: "wrong",
    tutorEmotion: "thinking",
  },

  "wrong-three": {
    id: "wrong-three",
    type: "narrate",
    tutorText:
      "Hmm, three would mean 6 cookies total, but we only had 5! Each person got 2 whole cookies plus one piece. Look closely at those halves.",
    next: "how-many-each",
    sfx: "wrong",
    tutorEmotion: "thinking",
  },

  "correct-two-half": {
    id: "correct-two-half",
    type: "show-number",
    tutorText:
      "YES! Two and a half! You nailed it! Each friend has 2 whole cookies and half a cookie.",
    showNumber: "2",
    next: "explain-whole",
    sfx: "ding",
    tutorEmotion: "celebrating",
  },

  // =====================================================
  // PHASE 3: Bridge to symbolic notation
  // =====================================================

  "explain-whole": {
    id: "explain-whole",
    type: "narrate",
    tutorText:
      "Writing down the 2 whole cookies is easy. We just write the number 2. No sweat.",
    next: "but-half",
    tutorEmotion: "excited",
  },

  "but-half": {
    id: "but-half",
    type: "narrate",
    tutorText:
      "But wait... how do we write down the half cookie part? We can't just say \"2 and a bit.\" We need something more precise. Hmm, let me think...",
    next: "know-fraction",
    tutorEmotion: "thinking",
  },

  "know-fraction": {
    id: "know-fraction",
    type: "choice",
    tutorText:
      "Actually -- do YOU know how to write one half as a number?",
    choices: [
      { label: "I think so!", next: "show-half-fraction" },
      { label: "Not yet!", next: "no-worries-fraction" },
      { label: "Can we ask the cookies?", next: "ask-cookies-response" },
    ],
    tutorEmotion: "thinking",
  },

  "no-worries-fraction": {
    id: "no-worries-fraction",
    type: "narrate",
    tutorText:
      "No worries at all! That's exactly why I'm here. Get ready, because this is one of the coolest tricks in all of math.",
    next: "show-half-fraction",
    sfx: "woosh",
    tutorEmotion: "excited",
  },

  "ask-cookies-response": {
    id: "ask-cookies-response",
    type: "narrate",
    tutorText:
      "I just whispered to the cookies. They said... \"crumble crumble crumble.\" Not super helpful. I think WE might be smarter than the cookies. Let me show you!",
    next: "show-half-fraction",
    sfx: "boing",
    tutorEmotion: "surprised",
  },

  "show-half-fraction": {
    id: "show-half-fraction",
    type: "show-fraction",
    tutorText:
      "Ta-da! We stack one number on top of another. The bottom number says how many pieces we cut the cookie into. The top number says how many pieces we have. 1 out of 2 pieces!",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "know-word-fraction",
    sfx: "ding",
    tutorEmotion: "excited",
  },

  "know-word-fraction": {
    id: "know-word-fraction",
    type: "choice",
    tutorText:
      "When we write numbers stacked like this, it has a special name. It's called a FRACTION! Have you heard that word before?",
    choices: [
      { label: "Yep!", next: "fraction-confirm" },
      { label: "That's new to me!", next: "fraction-new" },
    ],
    tutorEmotion: "excited",
  },

  "fraction-confirm": {
    id: "fraction-confirm",
    type: "narrate",
    tutorText:
      "Awesome, so you've got a head start! But here's the cool part -- now you know WHERE fractions come from. They come from sharing things fairly. Every single fraction started with someone trying to divide something up!",
    next: "each-got",
    tutorEmotion: "celebrating",
  },

  "fraction-new": {
    id: "fraction-new",
    type: "narrate",
    tutorText:
      "Welcome to the world of fractions! Here's the secret: a fraction just means we split something into equal parts. The bottom number is how many parts total, the top number is how many parts we're talking about. You're going to be great at this.",
    next: "each-got",
    tutorEmotion: "excited",
  },

  "explain-fraction": {
    id: "explain-fraction",
    type: "narrate",
    tutorText:
      "A whole number, like 2, counts whole cookies. But a fraction, like one half, lets us count PART of a cookie. Together they make a team!",
    next: "each-got",
    tutorEmotion: "excited",
  },

  "each-got": {
    id: "each-got",
    type: "show-fraction",
    tutorText:
      "So each friend ended up with 2 and one half cookies. In math, we write it just like this. Whole number on the left, fraction on the right. Beautiful!",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "phase4-transition",
    sfx: "ding",
    tutorEmotion: "celebrating",
  },

  // =====================================================
  // PHASE 4: Harder challenge (5 cookies, 4 people)
  // =====================================================

  "phase4-transition": {
    id: "phase4-transition",
    type: "narrate",
    tutorText:
      "You are seriously good at this. But hold on -- two more friends just showed up! Now there are FOUR hungry people at the table. And we only have 5 cookies. Think you can handle it?",
    next: "intro-5-4",
    sfx: "woosh",
    tutorEmotion: "surprised",
  },

  "intro-5-4": {
    id: "intro-5-4",
    type: "distribute",
    taskHeader: "Share 5 cookies between 4 friends.",
    tutorText:
      "5 cookies, 4 friends. Give each person one whole cookie first, then figure out what to do with whatever's left. You've got the knife if you need it!",
    cookieCount: 5,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "result-5-4-check",
    sfx: "pop",
    tutorEmotion: "excited",
  },

  "result-5-4-check": {
    id: "result-5-4-check",
    type: "choice",
    tutorText:
      "Everybody's been served! Now count up what each person got. How many cookies did each friend end up with?",
    choices: [
      { label: "One", next: "wrong-one-54" },
      { label: "One and a quarter", next: "correct-one-quarter", correct: true },
      { label: "Forty-seven", next: "wrong-fortyseven" },
    ],
    tutorEmotion: "thinking",
  },

  "wrong-one-54": {
    id: "wrong-one-54",
    type: "narrate",
    tutorText:
      "One whole cookie, yes! But don't forget those little pieces from the cookie we sliced up. Each person got a whole cookie PLUS a piece. How big is that piece?",
    next: "result-5-4-check",
    sfx: "wrong",
    tutorEmotion: "thinking",
  },

  "wrong-two-54": {
    id: "wrong-two-54",
    type: "narrate",
    tutorText:
      "Hmm, 2 each would need 8 cookies and we only have 5! Look at each person's plate: one whole cookie plus a small piece.",
    next: "result-5-4-check",
    sfx: "wrong",
    tutorEmotion: "thinking",
  },

  "wrong-fortyseven": {
    id: "wrong-fortyseven",
    type: "narrate",
    tutorText:
      "Forty-seven?! I WISH we had that many cookies! That would be the best day ever. But we've only got 5. One whole cookie per person, plus a little piece each...",
    next: "result-5-4-check",
    sfx: "boing",
    tutorEmotion: "surprised",
  },

  "correct-one-quarter": {
    id: "correct-one-quarter",
    type: "show-fraction",
    tutorText:
      "ONE AND A QUARTER! You got it! We cut the leftover cookie into 4 equal pieces -- quarters -- and gave one quarter to each friend. Look at this fraction!",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 4,
    next: "lesson-complete",
    sfx: "fanfare",
    tutorEmotion: "celebrating",
  },

  // =====================================================
  // FINALE
  // =====================================================

  "lesson-complete": {
    id: "lesson-complete",
    type: "narrate",
    tutorText:
      "You just discovered fractions by sharing cookies! Here's the big idea: when you can't split things evenly, you cut them into equal pieces. THAT is what fractions are. And you figured it out all by yourself.",
    next: "done",
    sfx: "fanfare",
    tutorEmotion: "celebrating",
  },

  "done": {
    id: "done",
    type: "narrate",
    tutorText:
      "You did it! You went from sharing cookies to writing real fractions. I am SO proud of you. You're officially a Cookie-Sharing Fraction Champion. Come back any time -- my friends are always hungry!",
    next: "end",
    sfx: "fanfare",
    tutorEmotion: "celebrating",
  },
};
