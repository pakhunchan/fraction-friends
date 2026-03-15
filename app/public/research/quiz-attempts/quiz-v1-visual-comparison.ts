// =============================================================
// CHECK FOR UNDERSTANDING — Visual Comparison Quiz (v1)
// Insert these steps after the main lesson, before finale-intro.
// =============================================================

  "quiz-intro": {
    id: "quiz-intro",
    type: "narrate",
    tutorText: "Before the bakery closes, Ember has a fun challenge for you! 'I'm going to show you two fractions,' she says, bouncing on her little claws. 'You tell me — are they the same amount of cake, or not?' Ready? Let's go!",
    next: "q1-show-first",
    sfx: "music-box",
  },

  // --- Question 1: Is 1/2 the same as 2/4? (Yes) ---

  "q1-show-first": {
    id: "q1-show-first",
    type: "show-fraction",
    tutorText: "Ember holds up the first fraction. Look — one-half!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "q1-show-second",
    sfx: "chime",
  },

  "q1-show-second": {
    id: "q1-show-second",
    type: "show-fraction",
    tutorText: "Now here's the second fraction — two-fourths!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "q1-ask",
    sfx: "chime",
  },

  "q1-ask": {
    id: "q1-ask",
    type: "choice",
    tutorText: "Is one-half the same amount as two-fourths?",
    choices: [
      { label: "Yes, same amount!", next: "q1-correct", correct: true },
      { label: "No, they're different", next: "q1-wrong" },
    ],
    sfx: "xylophone",
  },

  "q1-wrong": {
    id: "q1-wrong",
    type: "narrate",
    tutorText: "Hmm, think about it — if you cut a cake into 4 pieces and take 2 of them, how much cake do you have? Try picturing it in your head and give it another go!",
    next: "q1-ask",
    sfx: "gentle-whoosh",
  },

  "q1-correct": {
    id: "q1-correct",
    type: "narrate",
    tutorText: "Yes! One-half and two-fourths are the same amount of cake. Ember does a happy wing-flap! 'You remembered!' she cheers. Let's try the next one.",
    next: "q2-show-first",
    sfx: "sparkle",
  },

  // --- Question 2: Is 1/3 the same as 2/4? (No) ---

  "q2-show-first": {
    id: "q2-show-first",
    type: "show-fraction",
    tutorText: "Here's the first fraction — one-third.",
    showFractionNum: 1,
    showFractionDen: 3,
    next: "q2-show-second",
    sfx: "chime",
  },

  "q2-show-second": {
    id: "q2-show-second",
    type: "show-fraction",
    tutorText: "And here's the second — two-fourths.",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "q2-ask",
    sfx: "chime",
  },

  "q2-ask": {
    id: "q2-ask",
    type: "choice",
    tutorText: "Is one-third the same amount as two-fourths?",
    choices: [
      { label: "Yes, same amount!", next: "q2-wrong" },
      { label: "No, they're different", next: "q2-correct", correct: true },
    ],
    sfx: "xylophone",
  },

  "q2-wrong": {
    id: "q2-wrong",
    type: "narrate",
    tutorText: "Not quite! One-third means the cake is cut into 3 pieces and you take 1. Two-fourths means it's cut into 4 pieces and you take 2. Those are different amounts! Try again.",
    next: "q2-ask",
    sfx: "gentle-whoosh",
  },

  "q2-correct": {
    id: "q2-correct",
    type: "narrate",
    tutorText: "That's right — they're different! One-third is a smaller piece than two-fourths. Flicker nods wisely. 'Thirds and halves are not the same!' she says. Nice thinking!",
    next: "q3-show-first",
    sfx: "sparkle",
  },

  // --- Question 3: Is 2/4 the same as 4/8? (Yes) ---

  "q3-show-first": {
    id: "q3-show-first",
    type: "show-fraction",
    tutorText: "Okay, here comes a trickier one! First fraction — two-fourths.",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "q3-show-second",
    sfx: "chime",
  },

  "q3-show-second": {
    id: "q3-show-second",
    type: "show-fraction",
    tutorText: "And the second fraction — four-eighths. Ooh, bigger numbers!",
    showFractionNum: 4,
    showFractionDen: 8,
    next: "q3-ask",
    sfx: "chime",
  },

  "q3-ask": {
    id: "q3-ask",
    type: "choice",
    tutorText: "Is two-fourths the same amount as four-eighths?",
    choices: [
      { label: "Yes, same amount!", next: "q3-correct", correct: true },
      { label: "No, they're different", next: "q3-wrong" },
    ],
    sfx: "xylophone",
  },

  "q3-wrong": {
    id: "q3-wrong",
    type: "narrate",
    tutorText: "Hmm, the numbers look bigger, but think about it — if you cut the cake into 8 pieces and take 4, that's still half the cake! And two-fourths is also half. Give it another try!",
    next: "q3-ask",
    sfx: "gentle-whoosh",
  },

  "q3-correct": {
    id: "q3-correct",
    type: "narrate",
    tutorText: "You got it! Two-fourths and four-eighths are both one-half in disguise. The numbers are bigger, but the amount is the same! Ember is impressed.",
    next: "q4-show-first",
    sfx: "sparkle",
  },

  // --- Question 4: Is 1/4 the same as 1/2? (No) ---

  "q4-show-first": {
    id: "q4-show-first",
    type: "show-fraction",
    tutorText: "Last one! Here's the first fraction — one-fourth.",
    showFractionNum: 1,
    showFractionDen: 4,
    next: "q4-show-second",
    sfx: "chime",
  },

  "q4-show-second": {
    id: "q4-show-second",
    type: "show-fraction",
    tutorText: "And the second — one-half.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "q4-ask",
    sfx: "chime",
  },

  "q4-ask": {
    id: "q4-ask",
    type: "choice",
    tutorText: "Is one-fourth the same amount as one-half?",
    choices: [
      { label: "Yes, same amount!", next: "q4-wrong" },
      { label: "No, they're different", next: "q4-correct", correct: true },
    ],
    sfx: "xylophone",
  },

  "q4-wrong": {
    id: "q4-wrong",
    type: "narrate",
    tutorText: "Not quite! One-fourth means the cake is cut into 4 pieces and you only get 1 little piece. One-half means it's cut into 2 and you get 1 bigger piece. That's more cake! Try again.",
    next: "q4-ask",
    sfx: "gentle-whoosh",
  },

  "q4-correct": {
    id: "q4-correct",
    type: "narrate",
    tutorText: "Exactly right! One-fourth is less cake than one-half. Just because the top number is the same doesn't mean the fractions are equal — the bottom number matters too!",
    next: "quiz-congrats",
    sfx: "sparkle",
  },

  // --- Congratulations ---

  "quiz-congrats": {
    id: "quiz-congrats",
    type: "narrate",
    tutorText: "You got every single one! Ember and Flicker do a little dragon dance, spinning in circles and puffing tiny smoke rings. 'You really understand equivalent fractions!' Ember cheers. 'You're a fraction expert!' adds Flicker, beaming with pride.",
    next: "finale-intro",
    sfx: "harp-gliss",
  },
