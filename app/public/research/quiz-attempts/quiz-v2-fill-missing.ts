// ============================================================
// CHECK FOR UNDERSTANDING: Fill in the Missing Number
// Insert these steps at the end of the lesson, before finale-intro.
// ============================================================

  "quiz-intro": {
    id: "quiz-intro",
    type: "narrate",
    tutorText: "Before the bakery closes, Ember has a surprise — a little puzzle game! She pulls out some cards with fraction riddles on them. 'Can you figure out the missing number?' she asks, bouncing on her tiny claws. Let's give it a try!",
    next: "quiz-1-show",
    sfx: "music-box",
  },

  // --- Puzzle 1: 1/2 = ?/4 ---

  "quiz-1-show": {
    id: "quiz-1-show",
    type: "show-fraction",
    tutorText: "Here's the first riddle! We know that one-half equals something-fourths. One-half equals WHAT over four? Hmm, what number is hiding behind that question mark?",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "quiz-1-ask",
    sfx: "sparkle",
  },

  "quiz-1-ask": {
    id: "quiz-1-ask",
    type: "choice",
    tutorText: "1/2 = ?/4 — What number goes where the question mark is?",
    choices: [
      { label: "1", next: "quiz-1-wrong-1" },
      { label: "2", next: "quiz-1-correct", correct: true },
      { label: "3", next: "quiz-1-wrong-3" },
    ],
    sfx: "xylophone",
  },

  "quiz-1-wrong-1": {
    id: "quiz-1-wrong-1",
    type: "narrate",
    tutorText: "Not quite! One-fourth is a smaller piece than one-half. Remember, when we cut each half into two more pieces, we get TWICE as many. Think about how many fourths fit in one half, and try again!",
    next: "quiz-1-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-1-wrong-3": {
    id: "quiz-1-wrong-3",
    type: "narrate",
    tutorText: "Hmm, three-fourths would be more than one-half — that's too much cake! We need exactly the same amount as one-half. Try again!",
    next: "quiz-1-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-1-correct": {
    id: "quiz-1-correct",
    type: "narrate",
    tutorText: "Yes! One-half equals two-fourths! If you cut each half into two pieces, you get four pieces total, and two of those four pieces is the same amount. Ember stamps a little gold star on the card!",
    next: "quiz-2-show",
    sfx: "chime",
  },

  // --- Puzzle 2: 2/4 = 1/? ---

  "quiz-2-show": {
    id: "quiz-2-show",
    type: "show-fraction",
    tutorText: "Next riddle! Flicker holds up a card that says two-fourths equals one-over-SOMETHING. What number goes on the bottom?",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "quiz-2-ask",
    sfx: "sparkle",
  },

  "quiz-2-ask": {
    id: "quiz-2-ask",
    type: "choice",
    tutorText: "2/4 = 1/? — What number is missing on the bottom?",
    choices: [
      { label: "2", next: "quiz-2-correct", correct: true },
      { label: "3", next: "quiz-2-wrong-3" },
      { label: "4", next: "quiz-2-wrong-4" },
    ],
    sfx: "xylophone",
  },

  "quiz-2-wrong-3": {
    id: "quiz-2-wrong-3",
    type: "narrate",
    tutorText: "Hmm, one-third would mean cutting into three pieces — that's a different amount than two-fourths. Remember, two-fourths is the same as one... what? Think about the word we learned today!",
    next: "quiz-2-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-2-wrong-4": {
    id: "quiz-2-wrong-4",
    type: "narrate",
    tutorText: "One-fourth would be just one small piece out of four. But two-fourths is bigger than that! When you push those two small pieces back together, what do you get? Try again!",
    next: "quiz-2-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-2-correct": {
    id: "quiz-2-correct",
    type: "narrate",
    tutorText: "You got it! Two-fourths equals one-HALF! Two little pieces out of four is the same as one big piece out of two. Flicker does a happy wing-flap!",
    next: "quiz-3-show",
    sfx: "chime",
  },

  // --- Puzzle 3: ?/4 = 1/2 ---

  "quiz-3-show": {
    id: "quiz-3-show",
    type: "show-fraction",
    tutorText: "Ooh, this one flips it around! Something-fourths equals one-half. How many fourths make a half?",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "quiz-3-ask",
    sfx: "sparkle",
  },

  "quiz-3-ask": {
    id: "quiz-3-ask",
    type: "choice",
    tutorText: "?/4 = 1/2 — How many fourths equal one-half?",
    choices: [
      { label: "1", next: "quiz-3-wrong-1" },
      { label: "2", next: "quiz-3-correct", correct: true },
      { label: "3", next: "quiz-3-wrong-3" },
    ],
    sfx: "xylophone",
  },

  "quiz-3-wrong-1": {
    id: "quiz-3-wrong-1",
    type: "narrate",
    tutorText: "One-fourth is just one little piece — that's less than half the cake. If the cake has four pieces, how many do you need to have exactly half? Try again!",
    next: "quiz-3-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-3-wrong-3": {
    id: "quiz-3-wrong-3",
    type: "narrate",
    tutorText: "Three-fourths would be three pieces out of four — that's almost the whole cake! That's more than half. Try a smaller number!",
    next: "quiz-3-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-3-correct": {
    id: "quiz-3-correct",
    type: "narrate",
    tutorText: "That's right! Two-fourths equals one-half! You're getting so good at this! Ember and Flicker high-five with their little wings.",
    next: "quiz-4-show",
    sfx: "chime",
  },

  // --- Puzzle 4: 1/3 = 2/? (stretch challenge) ---

  "quiz-4-show": {
    id: "quiz-4-show",
    type: "show-fraction",
    tutorText: "One last riddle — a tricky one! Ember writes: one-third equals two-over-WHAT. This time the cake is cut into thirds! If we cut each third into two pieces, how many pieces would the whole cake have?",
    showFractionNum: 1,
    showFractionDen: 3,
    next: "quiz-4-ask",
    sfx: "sparkle",
  },

  "quiz-4-ask": {
    id: "quiz-4-ask",
    type: "choice",
    tutorText: "1/3 = 2/? — What number goes on the bottom?",
    choices: [
      { label: "4", next: "quiz-4-wrong-4" },
      { label: "6", next: "quiz-4-correct", correct: true },
      { label: "8", next: "quiz-4-wrong-8" },
    ],
    sfx: "xylophone",
  },

  "quiz-4-wrong-4": {
    id: "quiz-4-wrong-4",
    type: "narrate",
    tutorText: "Not quite! Think about it this way: the cake starts with 3 big pieces. If you cut EACH of those 3 pieces in half, how many total pieces would you have? That's 3 groups of 2!",
    next: "quiz-4-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-4-wrong-8": {
    id: "quiz-4-wrong-8",
    type: "narrate",
    tutorText: "That's too many pieces! We start with 3 slices and cut each one into 2. So that's 3 times 2. Can you figure it out? Try again!",
    next: "quiz-4-ask",
    sfx: "gentle-whoosh",
  },

  "quiz-4-correct": {
    id: "quiz-4-correct",
    type: "narrate",
    tutorText: "Amazing! One-third equals two-sixths! Three slices cut in half makes six pieces, and two of those six is the same as one of the three. You solved all the riddles!",
    next: "quiz-celebrate",
    sfx: "chime",
  },

  "quiz-celebrate": {
    id: "quiz-celebrate",
    type: "narrate",
    tutorText: "Ember and Flicker jump up and down, showering you with tiny flour-cloud fireworks! 'You're a fraction puzzle champion!' they squeal. You figured out every missing number!",
    next: "finale-intro",
    sfx: "harp-gliss",
  },
