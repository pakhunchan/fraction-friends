// lessonData.ts — Gentle Wise Professor (Mister Rogers energy)
// Warm, unhurried, wondering, never harsh. Celebrates quietly.

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
  showNumber?: string;   // e.g. "2" or "2½"
  showFractionNum?: number;
  showFractionDen?: number;
  wholeNumber?: number;
  allowKnife?: boolean;
  sfx?: string;
}

// ---------------------------------------------------------------------------
// The lesson — ~43 steps across 4 phases + finale
// ---------------------------------------------------------------------------
//
// Phase 1 — Warm-up:   4 ÷ 2  (whole number answer, builds confidence)
// Phase 2 — Conflict:  5 ÷ 2  (leftover cookie → introduces cutting)
// Phase 3 — Symbol:    name and write the fraction ½
// Phase 4 — Challenge: 5 ÷ 4  (leftover cookie → quarters, fraction ¼)
// Finale  — Gentle celebration, quiet pride
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
  // PHASE 1 — Warm-up: 4 cookies, 2 people
  // ===========================================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText:
      "Hello there, friend. I'm so glad you're here today. "
      + "You know, I've been thinking about something wonderful — "
      + "sharing. When we share, everyone feels cared for. "
      + "Shall we explore that together?",
    next: "meet-the-cookies",
    sfx: "warm-pad",
  },

  "meet-the-cookies": {
    id: "meet-the-cookies",
    type: "narrate",
    tutorText:
      "We have some cookies, and we have some friends who are hoping for a snack. "
      + "Isn't that a nice thing — to have enough to share? "
      + "Let's see if we can make sure everyone gets the very same amount.",
    next: "warmup-task",
    sfx: "harp-gliss",
  },

  "warmup-task": {
    id: "warmup-task",
    type: "distribute",
    taskHeader: "Give each friend the same number of cookies.",
    tutorText:
      "Here we have 4 cookies and 2 friends. "
      + "I wonder... if we give each friend the same number, how many would that be? "
      + "Go ahead and drag the cookies over — take your time, there's no rush.",
    objectCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "warmup-result",
    sfx: "soft-bell",
  },

  "warmup-result": {
    id: "warmup-result",
    type: "show-number",
    tutorText:
      "You did it. Four cookies, two friends — each friend received two cookies. "
      + "That feels fair and right, doesn't it? I knew you could work that out.",
    showNumber: "2",
    next: "warmup-reflect",
    sfx: "chime",
  },

  "warmup-reflect": {
    id: "warmup-reflect",
    type: "choice",
    tutorText:
      "We just divided 4 cookies between 2 friends and each got 2. "
      + "This is exactly what division means — sharing equally. "
      + "How does that sit with you?",
    choices: [
      { label: "That makes sense!", next: "warmup-great" },
      { label: "I want to see it again.", next: "warmup-again" },
      { label: "What is division?", next: "explain-division" },
    ],
  },

  "warmup-great": {
    id: "warmup-great",
    type: "narrate",
    tutorText:
      "Wonderful. You're already thinking like a mathematician — "
      + "and you haven't even tried the tricky part yet. "
      + "I think you're going to enjoy what comes next.",
    next: "phase2-intro",
    sfx: "harp-gliss",
  },

  "warmup-again": {
    id: "warmup-again",
    type: "narrate",
    tutorText:
      "Of course! Let's just sit with it for a moment. "
      + "4 cookies, shared between 2 friends, means 2 each. "
      + "Think of it like this: for every cookie we give to one friend, "
      + "we give another cookie to the other friend. "
      + "They always stay even. Ready to move on?",
    next: "phase2-intro",
    sfx: "gentle-whoosh",
  },

  "explain-division": {
    id: "explain-division",
    type: "narrate",
    tutorText:
      "What a thoughtful question! Division just means splitting something "
      + "into equal groups. Like sharing a pizza with your family — "
      + "you make sure every slice is the same size so no one feels left out. "
      + "That's all division is. Sharing, fairly.",
    next: "phase2-intro",
    sfx: "gentle-whoosh",
  },

  // ===========================================================================
  // PHASE 2 — Conflict: 5 cookies, 2 people
  // ===========================================================================

  "phase2-intro": {
    id: "phase2-intro",
    type: "narrate",
    tutorText:
      "Now, I want to show you something a little different. "
      + "Sometimes when we try to share, the numbers don't come out quite so tidily. "
      + "I wonder what happens when there's a little bit left over...",
    next: "distribute-5-2",
    sfx: "harp-gliss",
  },

  "distribute-5-2": {
    id: "distribute-5-2",
    type: "distribute",
    taskHeader: "Share 5 cookies between 2 friends.",
    tutorText:
      "5 cookies. 2 friends. Give each friend as many whole cookies as you can. "
      + "See what happens when you've done your best.",
    objectCount: 5,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "leftover-notice",
    sfx: "soft-bell",
  },

  "leftover-notice": {
    id: "leftover-notice",
    type: "narrate",
    tutorText:
      "Hmm. Isn't that interesting. Each friend has two cookies... "
      + "and there is one cookie left, sitting right in the middle. "
      + "Both friends are looking at it. I wonder what we should do.",
    next: "leftover-choice",
    sfx: "gentle-whoosh",
  },

  "leftover-choice": {
    id: "leftover-choice",
    type: "choice",
    tutorText:
      "What would be the kindest, fairest thing to do with that last cookie?",
    choices: [
      { label: "Cut it so each friend gets half.", next: "slice-yes", correct: true },
      { label: "Give it to a passing squirrel.", next: "squirrel-response" },
      { label: "Hide it in my pocket for later.", next: "pocket-response" },
    ],
  },

  "squirrel-response": {
    id: "squirrel-response",
    type: "narrate",
    tutorText:
      "Oh my, a squirrel! That's a very generous thought — squirrels do love a treat. "
      + "But our two friends are still here, both hoping for a little more. "
      + "I wonder if there's a way to make everyone happy... "
      + "What if we tried something with the cookie itself?",
    next: "leftover-choice",
    sfx: "gentle-whoosh",
  },

  "pocket-response": {
    id: "pocket-response",
    type: "narrate",
    tutorText:
      "Ha — I have to say, saving a cookie for later is a very sensible idea in general! "
      + "But I notice both friends are still looking hopefully at that cookie. "
      + "What if we could somehow make one cookie into two equal pieces? "
      + "Let's think about that together.",
    next: "leftover-choice",
    sfx: "gentle-whoosh",
  },

  "slice-yes": {
    id: "slice-yes",
    type: "narrate",
    tutorText:
      "Yes — cutting it right down the middle. "
      + "That way each friend receives the same amount, "
      + "and nothing goes to waste. What a thoughtful solution. "
      + "Go ahead — tap the cookie to slice it.",
    next: "do-slice",
    sfx: "harp-gliss",
  },

  "do-slice": {
    id: "do-slice",
    type: "slice",
    tutorText:
      "Tap the cookie right in the center. "
      + "Gently does it — right down the middle.",
    next: "post-slice",
    sfx: "gentle-whoosh",
  },

  "post-slice": {
    id: "post-slice",
    type: "narrate",
    tutorText:
      "There it is. Two equal pieces — each one exactly the same size. "
      + "When we cut something into two equal parts, "
      + "each part has a special name. We call each piece one half.",
    next: "distribute-halves",
    sfx: "chime",
  },

  "distribute-halves": {
    id: "distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Now let's give each friend one half. "
      + "One piece for this friend... and one piece for that friend.",
    characterCount: 2,
    next: "halves-done",
    sfx: "xylophone",
  },

  "halves-done": {
    id: "halves-done",
    type: "narrate",
    tutorText:
      "Look at that. Both friends have the very same amount now. "
      + "Two whole cookies, and one half of a cookie. "
      + "Everyone feels taken care of. That's a lovely feeling.",
    next: "count-question",
    sfx: "chime",
  },

  "count-question": {
    id: "count-question",
    type: "choice",
    tutorText:
      "Let's count together. Each friend received two whole cookies, "
      + "plus that half we just shared. "
      + "How many cookies does each friend have altogether?",
    choices: [
      { label: "Two", next: "count-wrong-two" },
      { label: "Two and a half", next: "count-correct", correct: true },
      { label: "Three whole cookies", next: "count-wrong-three" },
    ],
  },

  "count-wrong-two": {
    id: "count-wrong-two",
    type: "narrate",
    tutorText:
      "That's a creative thought — and you're absolutely right that each friend "
      + "got two whole cookies! But I'd like you to look at one more thing: "
      + "do you see that half-cookie sitting with each friend as well? "
      + "What do we get when we add two whole cookies and one half?",
    next: "count-question",
    sfx: "gentle-whoosh",
  },

  "count-wrong-three": {
    id: "count-wrong-three",
    type: "narrate",
    tutorText:
      "Three would mean they each got a lot of cookies — "
      + "and wouldn't that be wonderful! But let's look very carefully together. "
      + "They each have two whole cookies, and then one piece that is only part of a cookie. "
      + "Not quite a whole third cookie. What would you call that?",
    next: "count-question",
    sfx: "gentle-whoosh",
  },

  "count-correct": {
    id: "count-correct",
    type: "show-number",
    tutorText:
      "Two and a half. You got it, and I'm not at all surprised. "
      + "Each friend has two whole cookies, and one half. "
      + "Two and a half — let's hold onto that thought.",
    showNumber: "2",
    next: "bridge-intro",
    sfx: "chime",
  },

  // ===========================================================================
  // PHASE 3 — Bridge to symbolic notation: writing fractions
  // ===========================================================================

  "bridge-intro": {
    id: "bridge-intro",
    type: "narrate",
    tutorText:
      "Now I'd like to think about something with you. "
      + "We know each friend got two and a half cookies. "
      + "Writing the two is easy — we've been writing that number for a long time. "
      + "But the half... how do we write that down?",
    next: "write-whole",
    sfx: "harp-gliss",
  },

  "write-whole": {
    id: "write-whole",
    type: "narrate",
    tutorText:
      "The two whole cookies? We just write the numeral 2. Simple. "
      + "But 'half' is trickier. We could write the word... "
      + "but mathematicians have a wonderfully clever way to write it as a number. "
      + "Would you like to see?",
    next: "know-fraction-q",
  },

  "know-fraction-q": {
    id: "know-fraction-q",
    type: "choice",
    tutorText:
      "Before I show you, I'm curious — have you ever seen a fraction written down before?",
    choices: [
      { label: "I think so!", next: "fraction-preview-yes" },
      { label: "I'm not sure.", next: "fraction-preview-no" },
      { label: "Maybe ask the cookie?", next: "cookie-wisdom" },
    ],
  },

  "cookie-wisdom": {
    id: "cookie-wisdom",
    type: "narrate",
    tutorText:
      "I actually leaned over and whispered to the cookie just now. "
      + "It said... nothing at all, as cookies do. "
      + "But that's all right — we can figure this out together, you and I.",
    next: "fraction-preview-no",
    sfx: "gentle-whoosh",
  },

  "fraction-preview-yes": {
    id: "fraction-preview-yes",
    type: "narrate",
    tutorText:
      "Wonderful — then this will feel familiar. "
      + "And if it looks a little different from how you've seen it before, "
      + "that's perfectly fine. Let's look at it together and make sure it feels solid.",
    next: "show-half-fraction",
    sfx: "harp-gliss",
  },

  "fraction-preview-no": {
    id: "fraction-preview-no",
    type: "narrate",
    tutorText:
      "That's completely all right. You're about to see something new, "
      + "and new things are always a little exciting. "
      + "I'll walk you through it nice and slowly.",
    next: "show-half-fraction",
    sfx: "harp-gliss",
  },

  "show-half-fraction": {
    id: "show-half-fraction",
    type: "show-fraction",
    tutorText:
      "Here it is — the fraction one half, written as a number. "
      + "One number on top, one number on the bottom, with a little line between them. "
      + "The bottom number tells us how many equal pieces the cookie was cut into. "
      + "The top number tells us how many of those pieces we have. "
      + "Two pieces total. One piece for our friend. One half.",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "fraction-name",
    sfx: "sparkle",
  },

  "fraction-name": {
    id: "fraction-name",
    type: "choice",
    tutorText:
      "This way of writing part of something — stacking one number above another — "
      + "has a name. It's called a fraction. "
      + "Have you heard that word before, fraction?",
    choices: [
      { label: "Yes, I've heard it.", next: "fraction-name-yes" },
      { label: "It's new to me.", next: "fraction-name-no" },
    ],
  },

  "fraction-name-yes": {
    id: "fraction-name-yes",
    type: "narrate",
    tutorText:
      "I thought you might have. And now you know where fractions come from — "
      + "they come from sharing things fairly and needing a way to write down the pieces. "
      + "Every fraction tells the story of something that was divided.",
    next: "fraction-summary",
    sfx: "chime",
  },

  "fraction-name-no": {
    id: "fraction-name-no",
    type: "narrate",
    tutorText:
      "Fraction. Isn't that a satisfying word? "
      + "It comes from a Latin word that means 'to break.' "
      + "A fraction describes something that has been broken — or cut — into equal pieces. "
      + "You've already been doing fractions this whole time.",
    next: "fraction-summary",
    sfx: "chime",
  },

  "fraction-summary": {
    id: "fraction-summary",
    type: "show-fraction",
    tutorText:
      "So each friend walked away with 2 and one half cookies. "
      + "In mathematics, we write it exactly like this. "
      + "The 2 counts the whole cookies. The fraction one half counts the piece. "
      + "Together, they tell the whole story.",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "phase4-transition",
    sfx: "sparkle",
  },

  // ===========================================================================
  // PHASE 4 — Challenge: 5 cookies, 4 people
  // ===========================================================================

  "phase4-transition": {
    id: "phase4-transition",
    type: "narrate",
    tutorText:
      "You've done beautifully so far, and I'd like to try something "
      + "just a little more adventurous with you. "
      + "Two more friends have arrived at the table. "
      + "Now we have four friends... and still just five cookies.",
    next: "phase4-wonder",
    sfx: "harp-gliss",
  },

  "phase4-wonder": {
    id: "phase4-wonder",
    type: "narrate",
    tutorText:
      "I wonder — will the numbers work out evenly this time? "
      + "Or will we need to do some cutting again? "
      + "Let's find out together. Take your time with this one.",
    next: "distribute-5-4",
    sfx: "gentle-whoosh",
  },

  "distribute-5-4": {
    id: "distribute-5-4",
    type: "distribute",
    taskHeader: "Share 5 cookies equally between 4 friends.",
    tutorText:
      "Four friends, five cookies. "
      + "Start by giving each friend one whole cookie. "
      + "Then think about what to do with whatever's left. "
      + "You have the knife available if you'd like to use it.",
    objectCount: 5,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "distribute-5-4-result",
    sfx: "soft-bell",
  },

  "distribute-5-4-result": {
    id: "distribute-5-4-result",
    type: "narrate",
    tutorText:
      "Everyone has been served. Let's take a quiet moment and look "
      + "at what each friend received. "
      + "One whole cookie... and a small piece from the one we cut up. "
      + "I wonder what size that piece is.",
    next: "quarter-question",
    sfx: "gentle-whoosh",
  },

  "quarter-question": {
    id: "quarter-question",
    type: "choice",
    tutorText:
      "We had one cookie left and we cut it into four equal pieces — "
      + "one for each friend. How much does each friend have altogether?",
    choices: [
      { label: "One cookie exactly.", next: "quarter-wrong-one" },
      { label: "One and a quarter cookies.", next: "quarter-correct", correct: true },
      { label: "One and a half cookies.", next: "quarter-wrong-half" },
    ],
  },

  "quarter-wrong-one": {
    id: "quarter-wrong-one",
    type: "narrate",
    tutorText:
      "You're right that each friend got one whole cookie — that part is correct! "
      + "But I'd like you to look at the little piece beside it. "
      + "That piece came from a cookie we cut into four equal parts. "
      + "So each friend got one whole cookie, and one of those four pieces. "
      + "What do we call one out of four equal pieces?",
    next: "quarter-question",
    sfx: "gentle-whoosh",
  },

  "quarter-wrong-half": {
    id: "quarter-wrong-half",
    type: "narrate",
    tutorText:
      "That's a very reasonable guess, and I can see why you're thinking that — "
      + "we did talk about halves earlier, after all! "
      + "But this time, we had four friends and only one cookie to share among them. "
      + "So we cut it into four equal pieces, not two. "
      + "One out of four pieces is smaller than one half. "
      + "Do you know what we call it?",
    next: "quarter-question",
    sfx: "gentle-whoosh",
  },

  "quarter-correct": {
    id: "quarter-correct",
    type: "show-fraction",
    tutorText:
      "One and a quarter. Yes. You did it. "
      + "We cut one cookie into four equal pieces and gave one piece to each friend. "
      + "One out of four pieces is called one quarter. "
      + "Here's how we write it — the bottom number is four, the top number is one. "
      + "One quarter.",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 4,
    next: "lesson-complete",
    sfx: "sparkle",
  },

  // ===========================================================================
  // FINALE
  // ===========================================================================

  "lesson-complete": {
    id: "lesson-complete",
    type: "narrate",
    tutorText:
      "I want to tell you something. "
      + "What you just did — working through 4 divided by 2, "
      + "then 5 divided by 2, then 5 divided by 4 — "
      + "that is real mathematics. "
      + "You didn't just memorize anything. "
      + "You figured it out by thinking carefully, "
      + "and by being kind enough to want to share fairly. "
      + "I find that very admirable.",
    next: "done",
    sfx: "music-box",
  },

  "done": {
    id: "done",
    type: "narrate",
    tutorText:
      "Fractions aren't something that happens far away in a textbook. "
      + "They happen every time you share a pizza, or split a granola bar, "
      + "or pour juice equally into two glasses. "
      + "Now that you know what they are, "
      + "I think you'll start to notice them everywhere. "
      + "It's been a real pleasure thinking about this with you. "
      + "Come back anytime.",
    next: "end",
    sfx: "music-box",
  },
};
