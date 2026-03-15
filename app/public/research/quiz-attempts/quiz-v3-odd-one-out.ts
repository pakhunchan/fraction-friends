// ============================================================
// CHECK FOR UNDERSTANDING — Odd One Out Quiz
// Append these steps after the main lesson, before finale-intro.
// ============================================================

"quiz-intro": {
  id: "quiz-intro",
  type: "narrate",
  tutorText: "Before the bakery closes, Ember has a surprise! She pulls out her 'Fraction Detective' magnifying glass. 'I'm going to show you three fractions. Two of them are secretly the SAME amount — but one is an imposter! Can you spot which fraction doesn't belong?'",
  next: "quiz-1-setup",
  sfx: "music-box",
},

// ---- PROBLEM 1: 1/2, 2/4, 1/3 ----

"quiz-1-setup": {
  id: "quiz-1-setup",
  type: "narrate",
  tutorText: "Ember holds up three cards with fractions on them. 'One of these is NOT like the others,' she whispers mysteriously. 'Put on your detective hat!'",
  next: "quiz-1-choice",
  sfx: "soft-bell",
},

"quiz-1-choice": {
  id: "quiz-1-choice",
  type: "choice",
  tutorText: "Which fraction does NOT belong with the others?",
  taskHeader: "Spot the odd one out!",
  choices: [
    { label: "1/2", next: "quiz-1-wrong-half" },
    { label: "2/4", next: "quiz-1-wrong-twofourths" },
    { label: "1/3", next: "quiz-1-correct", correct: true },
  ],
  sfx: "xylophone",
},

"quiz-1-wrong-half": {
  id: "quiz-1-wrong-half",
  type: "narrate",
  tutorText: "Careful, detective! 1/2 and 2/4 are actually the same amount — remember, two quarters fit perfectly into one half! So they both belong together. The odd one out is something different from one-half. Try again!",
  next: "quiz-1-choice",
  sfx: "gentle-whoosh",
},

"quiz-1-wrong-twofourths": {
  id: "quiz-1-wrong-twofourths",
  type: "narrate",
  tutorText: "Not quite! 2/4 is just one-half wearing a disguise — 2 pieces out of 4 is the same amount as 1 piece out of 2. Those two match! Look for the fraction that ISN'T equal to one-half. Try again!",
  next: "quiz-1-choice",
  sfx: "gentle-whoosh",
},

"quiz-1-correct": {
  id: "quiz-1-correct",
  type: "narrate",
  tutorText: "You cracked the case! 1/3 is the imposter! One-half and two-fourths are the same amount of cake, but one-third is a different-sized piece. Excellent detective work!",
  next: "quiz-2-setup",
  sfx: "chime",
},

// ---- PROBLEM 2: 2/4, 3/6, 1/4 ----

"quiz-2-setup": {
  id: "quiz-2-setup",
  type: "narrate",
  tutorText: "Flicker flips over three new fraction cards and lays them on the counter. 'Ooh, this one is trickier!' she says, wiggling her little wings. 'Can you find the sneaky one?'",
  next: "quiz-2-choice",
  sfx: "soft-bell",
},

"quiz-2-choice": {
  id: "quiz-2-choice",
  type: "choice",
  tutorText: "Which fraction is NOT the same as the others?",
  taskHeader: "Find the fraction that doesn't belong!",
  choices: [
    { label: "2/4", next: "quiz-2-wrong-twofourths" },
    { label: "3/6", next: "quiz-2-wrong-threesixths" },
    { label: "1/4", next: "quiz-2-correct", correct: true },
  ],
  sfx: "xylophone",
},

"quiz-2-wrong-twofourths": {
  id: "quiz-2-wrong-twofourths",
  type: "narrate",
  tutorText: "Hmm, not that one! 2/4 and 3/6 are both secret ways to write one-half. Two out of four pieces is the same as three out of six pieces — they're equivalent! The odd one out is smaller than one-half. Try again!",
  next: "quiz-2-choice",
  sfx: "gentle-whoosh",
},

"quiz-2-wrong-threesixths": {
  id: "quiz-2-wrong-threesixths",
  type: "narrate",
  tutorText: "Close, but 3/6 is actually equal to one-half — remember the owl's cake? 3 pieces out of 6 is the same as 1 piece out of 2. So 3/6 and 2/4 are twins! Look for the one that's different. Try again!",
  next: "quiz-2-choice",
  sfx: "gentle-whoosh",
},

"quiz-2-correct": {
  id: "quiz-2-correct",
  type: "narrate",
  tutorText: "Brilliant! 1/4 is the odd one out! Two-fourths and three-sixths are both equal to one-half, but one-quarter is just a small single piece — way less than half. You're a fraction detective superstar!",
  next: "quiz-3-setup",
  sfx: "harp-gliss",
},

// ---- PROBLEM 3: 1/2, 1/4, 2/4 ----

"quiz-3-setup": {
  id: "quiz-3-setup",
  type: "narrate",
  tutorText: "Ember shuffles the cards one more time. 'Last mystery!' she announces. The wise old owl peeks through the window, curious to see if you can solve this one too.",
  next: "quiz-3-choice",
  sfx: "soft-bell",
},

"quiz-3-choice": {
  id: "quiz-3-choice",
  type: "choice",
  tutorText: "Which fraction is the odd one out?",
  taskHeader: "Which one doesn't belong?",
  choices: [
    { label: "1/2", next: "quiz-3-wrong-half" },
    { label: "1/4", next: "quiz-3-correct", correct: true },
    { label: "2/4", next: "quiz-3-wrong-twofourths" },
  ],
  sfx: "xylophone",
},

"quiz-3-wrong-half": {
  id: "quiz-3-wrong-half",
  type: "narrate",
  tutorText: "Careful! 1/2 and 2/4 are equivalent fractions — they're the same amount! Two pieces out of four equals one piece out of two. So those two match. Which one is left all alone? Try again!",
  next: "quiz-3-choice",
  sfx: "gentle-whoosh",
},

"quiz-3-wrong-twofourths": {
  id: "quiz-3-wrong-twofourths",
  type: "narrate",
  tutorText: "Not 2/4! Remember, 2/4 is just another way to write 1/2. They're the same amount of cake! The fraction that doesn't match is the smaller one. Try again!",
  next: "quiz-3-choice",
  sfx: "gentle-whoosh",
},

"quiz-3-correct": {
  id: "quiz-3-correct",
  type: "narrate",
  tutorText: "You solved every mystery! 1/4 doesn't belong because 1/2 and 2/4 are equivalent — they're the same amount. But 1/4 is just one little quarter-piece. The owl hoots with delight!",
  next: "quiz-4-setup",
  sfx: "sparkle",
},

// ---- PROBLEM 4: 2/6, 1/3, 1/2 ----

"quiz-4-setup": {
  id: "quiz-4-setup",
  type: "narrate",
  tutorText: "'Wait, wait!' calls the owl, swooping back in. 'I have one final brain-tickler for our young detective!' Ember and Flicker lean in close. This is the toughest one yet!",
  next: "quiz-4-choice",
  sfx: "soft-bell",
},

"quiz-4-choice": {
  id: "quiz-4-choice",
  type: "choice",
  tutorText: "The owl shows you three fractions. Which one is the odd one out?",
  taskHeader: "The owl's final challenge!",
  choices: [
    { label: "2/6", next: "quiz-4-wrong-twosixths" },
    { label: "1/3", next: "quiz-4-wrong-onethird" },
    { label: "1/2", next: "quiz-4-correct", correct: true },
  ],
  sfx: "xylophone",
},

"quiz-4-wrong-twosixths": {
  id: "quiz-4-wrong-twosixths",
  type: "narrate",
  tutorText: "Tricky, but 2/6 actually belongs here! Think about a cake cut into 6 pieces — if you take 2, that's the same as taking 1 piece from a cake cut into 3. So 2/6 and 1/3 are the same! The odd one out is bigger. Try again!",
  next: "quiz-4-choice",
  sfx: "gentle-whoosh",
},

"quiz-4-wrong-onethird": {
  id: "quiz-4-wrong-onethird",
  type: "narrate",
  tutorText: "Almost! But 1/3 and 2/6 are secretly the same amount — two-sixths is just one-third in disguise! Two tiny pieces out of six equals one bigger piece out of three. The odd one out is the bigger fraction. Try again!",
  next: "quiz-4-choice",
  sfx: "gentle-whoosh",
},

"quiz-4-correct": {
  id: "quiz-4-correct",
  type: "narrate",
  tutorText: "'Magnificent!' the owl hoots, flapping with joy. 1/2 is the odd one out! Two-sixths and one-third are equivalent fractions — but one-half is a bigger amount. You are a true Fraction Detective!",
  next: "quiz-celebrate",
  sfx: "harp-gliss",
},

// ---- CELEBRATION & TRANSITION ----

"quiz-celebrate": {
  id: "quiz-celebrate",
  type: "narrate",
  tutorText: "Ember pins a shiny gold star badge on you. 'Official Dragon Bakery Fraction Detective!' she declares. Flicker does a little loop-the-loop in the air, leaving a trail of sparkles. You solved every single mystery!",
  next: "finale-intro",
  sfx: "sparkle",
},
