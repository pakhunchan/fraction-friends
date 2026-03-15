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

  // ──────────────────────────────────────────────
  // PHASE 1: Easy warm-up (4 stickers, 2 students)
  // ──────────────────────────────────────────────

  "start": {
    id: "start",
    type: "narrate",
    tutorText:
      "Good morning, class! Welcome to Sticker Day! I have a sheet of beautiful gold star stickers here, and we are going to learn how to share them fairly. Ready?",
    next: "p1-show-stickers",
    sfx: "pop",
  },

  "p1-show-stickers": {
    id: "p1-show-stickers",
    type: "narrate",
    tutorText:
      "Here are 4 shiny star stickers, fresh off the sticker sheet! And today we have 2 superstars who earned a reward -- Alex and Jordan. Let's share them equally!",
    cookieCount: 4,
    characterCount: 2,
    next: "p1-distribute",
    sfx: "ding",
  },

  "p1-distribute": {
    id: "p1-distribute",
    type: "distribute",
    tutorText:
      "Go ahead -- drag the star stickers to Alex and Jordan. Give each student the same number!",
    taskHeader: "Share 4 star stickers between 2 students",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "p1-quiz",
    sfx: "woosh",
  },

  "p1-quiz": {
    id: "p1-quiz",
    type: "choice",
    tutorText:
      "Wonderful sharing! Now, how many star stickers did each student get?",
    choices: [
      { label: "2 each", next: "p1-correct", correct: true },
      { label: "4 each", next: "p1-wrong-a" },
      { label: "0 each", next: "p1-wrong-b" },
    ],
    sfx: "pop",
  },

  "p1-wrong-a": {
    id: "p1-wrong-a",
    type: "narrate",
    tutorText:
      "4 each? Oh my -- that would mean we need 8 stickers! I think someone is trying to sneak extra stickers into their folder! Let's count again, class.",
    next: "p1-quiz",
    sfx: "boing",
  },

  "p1-wrong-b": {
    id: "p1-wrong-b",
    type: "narrate",
    tutorText:
      "Zero each? But look at all those stickers on their desks! Unless they turned invisible... Nope, still sparkly! Try again, superstar.",
    next: "p1-quiz",
    sfx: "boing",
  },

  "p1-correct": {
    id: "p1-correct",
    type: "narrate",
    tutorText:
      "Gold star for you! That's right -- 4 star stickers shared between 2 students means 2 each. Fair and square! Now let's try something trickier...",
    next: "p2-intro",
    sfx: "fanfare",
  },

  // ──────────────────────────────────────────────
  // PHASE 2: Conflict (5 stickers, 2 students)
  // ──────────────────────────────────────────────

  "p2-intro": {
    id: "p2-intro",
    type: "narrate",
    tutorText:
      "Uh oh, class! This time I have 5 star stickers, but still only 2 students to share with -- Alex and Jordan. Hmm, 5 doesn't split into 2 neat groups, does it?",
    cookieCount: 5,
    characterCount: 2,
    next: "p2-distribute-whole",
    sfx: "pop",
  },

  "p2-distribute-whole": {
    id: "p2-distribute-whole",
    type: "distribute",
    tutorText:
      "Start by handing out as many whole stickers as you can, equally. Go ahead!",
    taskHeader: "Share 5 star stickers between 2 students (whole ones first!)",
    cookieCount: 5,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "p2-leftover-quiz",
    sfx: "woosh",
  },

  "p2-leftover-quiz": {
    id: "p2-leftover-quiz",
    type: "choice",
    tutorText:
      "Nice work! Each student has 2 star stickers, but look -- there is 1 sticker left over sitting right there in the middle. What should we do with it?",
    choices: [
      { label: "Cut it in half!", next: "p2-cut-correct", correct: true },
      { label: "Stick it on the teacher's forehead", next: "p2-wrong-a" },
      { label: "Throw it in the glitter bin", next: "p2-wrong-b" },
    ],
    sfx: "ding",
  },

  "p2-wrong-a": {
    id: "p2-wrong-a",
    type: "narrate",
    tutorText:
      "Ha! A star sticker on my forehead? I DO look fabulous with it, but that's not fair sharing, is it? Alex and Jordan earned these! Let's think about how to split that last sticker.",
    next: "p2-leftover-quiz",
    sfx: "boing",
  },

  "p2-wrong-b": {
    id: "p2-wrong-b",
    type: "narrate",
    tutorText:
      "The glitter bin?! That sticker is too precious for the recycling! Besides, wasting a perfectly good star would make the sticker factory elves cry. Let's find a better way!",
    next: "p2-leftover-quiz",
    sfx: "boing",
  },

  "p2-cut-correct": {
    id: "p2-cut-correct",
    type: "narrate",
    tutorText:
      "Great thinking, superstar! We can use scissors to cut that last star sticker right down the middle -- one half for Alex, one half for Jordan. Watch closely!",
    next: "p2-slice",
    sfx: "ding",
  },

  "p2-slice": {
    id: "p2-slice",
    type: "slice",
    tutorText:
      "Use the scissors to cut the star sticker into 2 equal halves. Snip snip!",
    taskHeader: "Cut the leftover sticker in half",
    cookieCount: 1,
    allowKnife: true,
    next: "p2-distribute-halves",
    sfx: "slice",
  },

  "p2-distribute-halves": {
    id: "p2-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Perfect cut! Now give one half-sticker to Alex and one half-sticker to Jordan.",
    taskHeader: "Give each student their half",
    cookieCount: 1,
    characterCount: 2,
    next: "p2-total-quiz",
    sfx: "woosh",
  },

  "p2-total-quiz": {
    id: "p2-total-quiz",
    type: "choice",
    tutorText:
      "Look at that -- everyone got a fair share! So class, how many star stickers does each student have now in total?",
    choices: [
      { label: "2 and a half", next: "p2-total-correct", correct: true },
      { label: "3", next: "p2-total-wrong-a" },
      { label: "2", next: "p2-total-wrong-b" },
    ],
    sfx: "pop",
  },

  "p2-total-wrong-a": {
    id: "p2-total-wrong-a",
    type: "narrate",
    tutorText:
      "3? Almost! Count the pieces on Alex's desk -- 2 whole stickers and one HALF sticker. That half isn't a whole one, so it can't count as 1. Peek again!",
    next: "p2-total-quiz",
    sfx: "boing",
  },

  "p2-total-wrong-b": {
    id: "p2-total-wrong-b",
    type: "narrate",
    tutorText:
      "Just 2? But wait -- don't forget that little half-sticker! It may be small, but it still counts. Each student has 2 whole stickers PLUS something extra. What is it?",
    next: "p2-total-quiz",
    sfx: "boing",
  },

  "p2-total-correct": {
    id: "p2-total-correct",
    type: "narrate",
    tutorText:
      "That's absolutely right -- 2 and a half! Or as math superstars write it, two-and-one-half. Let me show you what that looks like as a number!",
    next: "p2-show-number",
    sfx: "fanfare",
  },

  "p2-show-number": {
    id: "p2-show-number",
    type: "show-number",
    tutorText:
      "Here it is, class! Each student gets exactly this many star stickers:",
    showNumber: "2 1/2",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "p3-bridge-intro",
    sfx: "ding",
  },

  // ──────────────────────────────────────────────
  // PHASE 3: Bridge to symbolic fractions
  // ──────────────────────────────────────────────

  "p3-bridge-intro": {
    id: "p3-bridge-intro",
    type: "narrate",
    tutorText:
      "Okay class, gather round! We just discovered something really cool. When we share and things don't split evenly, we get a NEW kind of number. Let me explain!",
    next: "p3-whole-number",
    sfx: "pop",
  },

  "p3-whole-number": {
    id: "p3-whole-number",
    type: "show-number",
    tutorText:
      "A number like 2 is called a WHOLE number. Think of it as 2 complete, uncut, shiny star stickers. Nothing is missing, nothing is extra -- just 2 perfect stickers!",
    showNumber: "2",
    wholeNumber: 2,
    next: "p3-fraction-explain",
    sfx: "ding",
  },

  "p3-fraction-explain": {
    id: "p3-fraction-explain",
    type: "show-fraction",
    tutorText:
      "But when we cut a sticker into 2 equal pieces and take 1 piece, we write that as a FRACTION -- one half! The bottom number tells us how many pieces we cut, and the top number tells us how many pieces we took.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "p3-fraction-quiz",
    sfx: "ding",
  },

  "p3-fraction-quiz": {
    id: "p3-fraction-quiz",
    type: "choice",
    tutorText:
      "Quick check! If I cut a star sticker into 2 equal pieces and gave you 1 piece, what fraction of the sticker do you have?",
    choices: [
      { label: "1/2", next: "p3-fraction-correct", correct: true },
      { label: "2/1", next: "p3-fraction-wrong-a" },
      { label: "1/4", next: "p3-fraction-wrong-b" },
    ],
    sfx: "pop",
  },

  "p3-fraction-wrong-a": {
    id: "p3-fraction-wrong-a",
    type: "narrate",
    tutorText:
      "2 over 1? That would mean you somehow got 2 pieces out of 1 cut -- that's sticker magic, not sticker math! Remember: pieces you TOOK go on top, pieces you CUT go on the bottom.",
    next: "p3-fraction-quiz",
    sfx: "boing",
  },

  "p3-fraction-wrong-b": {
    id: "p3-fraction-wrong-b",
    type: "narrate",
    tutorText:
      "One quarter? That would mean we cut the sticker into 4 pieces, but we only cut it into 2! Imagine the glitter mess if we made 4 cuts! The bottom number matches how many pieces we made.",
    next: "p3-fraction-quiz",
    sfx: "boing",
  },

  "p3-fraction-correct": {
    id: "p3-fraction-correct",
    type: "narrate",
    tutorText:
      "You are a fraction superstar! 1 over 2, or one-half, is exactly right. Now let's put your skills to the test with a bigger challenge!",
    next: "p4-intro",
    sfx: "fanfare",
  },

  // ──────────────────────────────────────────────
  // PHASE 4: Harder challenge (5 stickers, 4 students)
  // ──────────────────────────────────────────────

  "p4-intro": {
    id: "p4-intro",
    type: "narrate",
    tutorText:
      "Alright class, final challenge! This time I have 5 star stickers and FOUR students waiting -- Alex, Jordan, Sam, and Riley. This is a tricky one. Let's see if you can handle it!",
    cookieCount: 5,
    characterCount: 4,
    next: "p4-distribute-whole",
    sfx: "pop",
  },

  "p4-distribute-whole": {
    id: "p4-distribute-whole",
    type: "distribute",
    tutorText:
      "Start by handing out whole stickers equally to all 4 students. How many whole ones can each student get?",
    taskHeader: "Share 5 star stickers among 4 students (whole ones first!)",
    cookieCount: 5,
    characterCount: 4,
    expectedPerPerson: 1,
    next: "p4-leftover-quiz",
    sfx: "woosh",
  },

  "p4-leftover-quiz": {
    id: "p4-leftover-quiz",
    type: "choice",
    tutorText:
      "Each student has 1 whole star sticker. But we have 1 sticker left over again! With 4 students this time, how should we cut it?",
    choices: [
      { label: "Cut it into 4 equal pieces!", next: "p4-cut-correct", correct: true },
      { label: "Stack all 4 students on top of it", next: "p4-wrong-a" },
      { label: "Give it to the class hamster", next: "p4-wrong-b" },
    ],
    sfx: "ding",
  },

  "p4-wrong-a": {
    id: "p4-wrong-a",
    type: "narrate",
    tutorText:
      "Stack the students on a sticker?! That's a squished sticker AND a trip to the nurse's office! We need scissors, not acrobatics. Think about how many equal pieces we need!",
    next: "p4-leftover-quiz",
    sfx: "boing",
  },

  "p4-wrong-b": {
    id: "p4-wrong-b",
    type: "narrate",
    tutorText:
      "Mr. Whiskers the hamster would just eat it! Besides, hamsters didn't do their homework -- these students did! We need to cut the sticker so everyone gets a piece.",
    next: "p4-leftover-quiz",
    sfx: "boing",
  },

  "p4-cut-correct": {
    id: "p4-cut-correct",
    type: "narrate",
    tutorText:
      "Exactly right! We have 4 students, so we cut the leftover sticker into 4 equal pieces. Grab those scissors -- carefully now!",
    next: "p4-slice",
    sfx: "ding",
  },

  "p4-slice": {
    id: "p4-slice",
    type: "slice",
    tutorText:
      "Use the scissors to cut this star sticker into 4 equal quarters. Snip, snip, snip!",
    taskHeader: "Cut the leftover sticker into 4 equal pieces",
    cookieCount: 1,
    allowKnife: true,
    next: "p4-distribute-quarters",
    sfx: "slice",
  },

  "p4-distribute-quarters": {
    id: "p4-distribute-quarters",
    type: "distribute-halves",
    tutorText:
      "Beautiful cuts! Now give one quarter-sticker to each of the 4 students.",
    taskHeader: "Give each student their quarter piece",
    cookieCount: 1,
    characterCount: 4,
    next: "p4-total-quiz",
    sfx: "woosh",
  },

  "p4-total-quiz": {
    id: "p4-total-quiz",
    type: "choice",
    tutorText:
      "Everyone got their fair share! So class, how many star stickers does each student have in total?",
    choices: [
      { label: "1 and 1/4", next: "p4-total-correct", correct: true },
      { label: "2", next: "p4-total-wrong-a" },
      { label: "1 and 1/2", next: "p4-total-wrong-b" },
    ],
    sfx: "pop",
  },

  "p4-total-wrong-a": {
    id: "p4-total-wrong-a",
    type: "narrate",
    tutorText:
      "2 whole stickers? Let's recount -- each desk has 1 whole star and 1 little quarter-piece. That quarter piece is smaller than a whole, so the total has to be between 1 and 2!",
    next: "p4-total-quiz",
    sfx: "boing",
  },

  "p4-total-wrong-b": {
    id: "p4-total-wrong-b",
    type: "narrate",
    tutorText:
      "One and a half? Close, but we cut into FOUR pieces, not two! Each student got 1 piece out of 4 -- that's a quarter, not a half. A half would be bigger!",
    next: "p4-total-quiz",
    sfx: "boing",
  },

  "p4-total-correct": {
    id: "p4-total-correct",
    type: "narrate",
    tutorText:
      "Absolutely perfect! 1 whole sticker plus 1 quarter of a sticker -- that's 1 and 1/4! Let me show you how a math superstar writes that!",
    next: "p4-show-result",
    sfx: "fanfare",
  },

  "p4-show-result": {
    id: "p4-show-result",
    type: "show-number",
    tutorText:
      "Each student gets exactly this many star stickers:",
    showNumber: "1 1/4",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 4,
    next: "end",
    sfx: "ding",
  },

  "end": {
    id: "end",
    type: "narrate",
    tutorText:
      "Class, you did it! You learned how to share fairly, how to split leftovers, AND what fractions are! One-half, one-quarter -- you know them all now. You are officially Fraction Superstars! Give yourselves a round of applause!",
    sfx: "fanfare",
  },
};
