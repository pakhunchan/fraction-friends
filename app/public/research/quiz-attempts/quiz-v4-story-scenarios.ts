// Quiz Section: Check for Understanding — Story-Based Scenarios
// Goes at the END of the lesson, after the student has learned 1/2 = 2/4.
// Characters: Olive, Benny, Maple, Fern (Cozy Kitchen theme)
// Start: "quiz-intro" → End: next: "finale-intro"

  "quiz-intro": {
    id: "quiz-intro",
    type: "narrate",
    tutorText: "The kitchen is warm and cozy, and the smell of fresh brownies fills the air. Before we close up, Olive has a fun idea. 'Let's play a little game! I'll tell some stories, and you see if you can spot the equal fractions hiding inside.'",
    next: "quiz-s1-setup",
    sfx: "music-box",
  },

  // ---- SCENARIO 1: Olive & Benny's Brownies ----

  "quiz-s1-setup": {
    id: "quiz-s1-setup",
    type: "narrate",
    tutorText: "Olive cut her brownie into 2 equal pieces and ate 1 piece. Benny cut his brownie — the exact same size — into 4 equal pieces and ate 2 pieces. Benny looks at Olive's plate and says, 'Hey, I think you got more than me!'",
    next: "quiz-s1-question",
    sfx: "warm-pad",
  },

  "quiz-s1-question": {
    id: "quiz-s1-question",
    type: "choice",
    tutorText: "Olive ate 1/2 of her brownie. Benny ate 2/4 of his brownie. Who ate more?",
    choices: [
      { label: "Olive ate more", next: "quiz-s1-wrong-olive" },
      { label: "They ate the same!", next: "quiz-s1-correct", correct: true },
      { label: "Benny ate more", next: "quiz-s1-wrong-benny" },
    ],
    sfx: "xylophone",
  },

  "quiz-s1-wrong-olive": {
    id: "quiz-s1-wrong-olive",
    type: "narrate",
    tutorText: "Hmm, let's think about it. Olive ate 1 piece out of 2. Benny ate 2 pieces out of 4. Remember — 2 little quarter-pieces fit together to make the same size as 1 half-piece! Try again.",
    next: "quiz-s1-question",
    sfx: "gentle-whoosh",
  },

  "quiz-s1-wrong-benny": {
    id: "quiz-s1-wrong-benny",
    type: "narrate",
    tutorText: "It might look like Benny ate more because he had 2 pieces, but those pieces were smaller! Two quarters is the same amount as one half. Let's try that one more time.",
    next: "quiz-s1-question",
    sfx: "gentle-whoosh",
  },

  "quiz-s1-correct": {
    id: "quiz-s1-correct",
    type: "narrate",
    tutorText: "That's right! One-half and two-fourths are the same amount. Olive and Benny both ate exactly half a brownie. Benny grins. 'Phew! I was worried I got less!'",
    next: "quiz-s2-setup",
    sfx: "chime",
  },

  // ---- SCENARIO 2: Maple & Fern's Argument ----

  "quiz-s2-setup": {
    id: "quiz-s2-setup",
    type: "narrate",
    tutorText: "Maple is holding a plate with 2/4 of a brownie. Fern is holding a plate with 1/2 of a brownie. Maple peers at Fern's plate and pouts. 'That's not fair — Fern got a bigger piece than me!'",
    next: "quiz-s2-question",
    sfx: "warm-pad",
  },

  "quiz-s2-question": {
    id: "quiz-s2-question",
    type: "choice",
    tutorText: "Maple has 2/4 of a brownie. Fern has 1/2 of a brownie. Is Maple right that Fern got more?",
    choices: [
      { label: "Yes, Fern got more", next: "quiz-s2-wrong" },
      { label: "No — they got the same!", next: "quiz-s2-correct", correct: true },
    ],
    sfx: "xylophone",
  },

  "quiz-s2-wrong": {
    id: "quiz-s2-wrong",
    type: "narrate",
    tutorText: "It does look different, but remember our trick! Two-fourths and one-half are equivalent fractions — they are the exact same amount. Maple's 2 smaller pieces add up to Fern's 1 bigger piece. Try again!",
    next: "quiz-s2-question",
    sfx: "gentle-whoosh",
  },

  "quiz-s2-correct": {
    id: "quiz-s2-correct",
    type: "narrate",
    tutorText: "Exactly! Maple doesn't need to worry. Two-fourths equals one-half, so they both have the same amount of brownie. Fern gives Maple a friendly pat. 'See? We're brownie twins!'",
    next: "quiz-s3-setup",
    sfx: "harp-gliss",
  },

  // ---- SCENARIO 3: The Sharing Plate ----

  "quiz-s3-setup": {
    id: "quiz-s3-setup",
    type: "narrate",
    tutorText: "There's one last brownie on the kitchen counter, cut into 4 equal pieces. Olive takes 2 pieces and puts them on her plate. At the other end of the table, Benny has a different brownie — the same size — cut into just 2 pieces. He takes 1 piece.",
    next: "quiz-s3-question",
    sfx: "warm-pad",
  },

  "quiz-s3-question": {
    id: "quiz-s3-question",
    type: "choice",
    tutorText: "Olive took 2 out of 4 pieces. Benny took 1 out of 2 pieces. Did they both take the same amount of brownie?",
    choices: [
      { label: "Yes — both took half!", next: "quiz-s3-correct", correct: true },
      { label: "No — Olive took more", next: "quiz-s3-wrong" },
    ],
    sfx: "xylophone",
  },

  "quiz-s3-wrong": {
    id: "quiz-s3-wrong",
    type: "narrate",
    tutorText: "Olive did take 2 pieces, but her pieces were smaller because the brownie was cut into 4. Two-fourths is the same as one-half! The brownies are the same size, so Olive and Benny each have the same amount. Let's try again.",
    next: "quiz-s3-question",
    sfx: "gentle-whoosh",
  },

  "quiz-s3-correct": {
    id: "quiz-s3-correct",
    type: "narrate",
    tutorText: "You got it! 2/4 and 1/2 are the same amount — they're equivalent fractions. Olive and Benny high-five across the table. 'Fair and square!' they say together.",
    next: "quiz-s4-setup",
    sfx: "chime",
  },

  // ---- SCENARIO 4: Fern's Tricky Question ----

  "quiz-s4-setup": {
    id: "quiz-s4-setup",
    type: "narrate",
    tutorText: "Fern has one more question before everyone heads home. She holds up two cards. One card says 1/2. The other card says 1/4. 'Okay, smarty-pants,' she says with a grin. 'Are THESE two fractions the same amount?'",
    next: "quiz-s4-question",
    sfx: "soft-bell",
  },

  "quiz-s4-question": {
    id: "quiz-s4-question",
    type: "choice",
    tutorText: "Is 1/2 the same amount as 1/4?",
    choices: [
      { label: "Yes, they are equal", next: "quiz-s4-wrong" },
      { label: "No, they are different!", next: "quiz-s4-correct", correct: true },
    ],
    sfx: "xylophone",
  },

  "quiz-s4-wrong": {
    id: "quiz-s4-wrong",
    type: "narrate",
    tutorText: "Careful! One-half means you cut into 2 pieces and take 1. One-quarter means you cut into 4 pieces and take only 1. That quarter piece is much smaller than a half piece! They are NOT the same. Try again.",
    next: "quiz-s4-question",
    sfx: "gentle-whoosh",
  },

  "quiz-s4-correct": {
    id: "quiz-s4-correct",
    type: "narrate",
    tutorText: "'Tricky, right?' laughs Fern. One-half and one-quarter are NOT equal. One-quarter is smaller! Remember, 1/2 equals 2/4, but not 1/4. You really know your fractions!",
    next: "quiz-outro",
    sfx: "sparkle",
  },

  "quiz-outro": {
    id: "quiz-outro",
    type: "narrate",
    tutorText: "Maple, Fern, Olive, and Benny give you a big round of applause. 'You passed the Cozy Kitchen quiz!' cheers Olive. 'You know that one-half and two-fourths are the same — and you didn't fall for any tricks!' The warm kitchen glows as everyone shares one last brownie together.",
    next: "finale-intro",
    sfx: "music-box",
  },
