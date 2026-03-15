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

  // =============================================
  // STAGE 1: Review halves — what is 1/2?
  // =============================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText: "Welcome to the Monster Art Studio! Today our friendly monsters are painting pictures, and they need your help mixing paint colors!",
    next: "meet-blobby",
    sfx: "harp-gliss",
  },
  "meet-blobby": {
    id: "meet-blobby",
    type: "narrate",
    tutorText: "This is Blobby, our purple monster artist. Blobby has one big tube of blue paint, and two canvases to paint on. Each canvas needs the same amount!",
    next: "share-1-tube",
    sfx: "warm-pad",
  },
  "share-1-tube": {
    id: "share-1-tube",
    type: "distribute",
    taskHeader: "Share 1 paint tube equally.",
    tutorText: "Blobby has 1 tube of blue paint and 2 canvases. But wait — we can't give 1 whole tube to both! What should we do?",
    cookieCount: 1,
    characterCount: 2,
    expectedPerPerson: 0,
    allowKnife: true,
    next: "need-to-split",
  },
  "need-to-split": {
    id: "need-to-split",
    type: "choice",
    tutorText: "We have 1 tube of paint but 2 canvases that each need the same amount. What should we do?",
    choices: [
      { label: "Split the tube in half!", next: "good-split", correct: true },
      { label: "Give it all to one canvas", next: "not-fair" },
      { label: "Don't paint at all", next: "no-paint" },
    ],
  },
  "not-fair": {
    id: "not-fair",
    type: "narrate",
    tutorText: "But then one canvas gets all the paint and the other gets nothing! Blobby wants both pictures to match. Let's think of a way to share it equally.",
    next: "need-to-split",
    sfx: "soft-bell",
  },
  "no-paint": {
    id: "no-paint",
    type: "narrate",
    tutorText: "Oh no, Blobby really wants to paint today! There IS a way to share one tube between two canvases. Think about cutting it!",
    next: "need-to-split",
    sfx: "soft-bell",
  },
  "good-split": {
    id: "good-split",
    type: "narrate",
    tutorText: "Great idea! If we split the tube right down the middle, each canvas gets the same amount!",
    next: "do-slice-1",
    sfx: "chime",
  },
  "do-slice-1": {
    id: "do-slice-1",
    type: "slice",
    tutorText: "Tap the paint tube to split it into two equal parts!",
    next: "give-halves-1",
    sfx: "gentle-whoosh",
  },
  "give-halves-1": {
    id: "give-halves-1",
    type: "distribute-halves",
    tutorText: "Now give one half to each canvas!",
    characterCount: 2,
    next: "each-got-half",
    sfx: "sparkle",
  },
  "each-got-half": {
    id: "each-got-half",
    type: "choice",
    tutorText: "Each canvas got some of the paint tube. How much did each canvas get?",
    choices: [
      { label: "One half", next: "show-one-half", correct: true },
      { label: "One whole tube", next: "not-whole" },
      { label: "Two tubes", next: "not-two" },
    ],
  },
  "not-whole": {
    id: "not-whole",
    type: "narrate",
    tutorText: "Not quite! We only had one tube and we split it. So each canvas got less than a whole tube. We cut it into two equal pieces, remember?",
    next: "each-got-half",
    sfx: "soft-bell",
  },
  "not-two": {
    id: "not-two",
    type: "narrate",
    tutorText: "Hmm, we started with just 1 tube total, so we can't have 2 whole tubes! We split that 1 tube into two equal pieces. How much is each piece?",
    next: "each-got-half",
    sfx: "soft-bell",
  },
  "show-one-half": {
    id: "show-one-half",
    type: "show-fraction",
    tutorText: "That's right! Each canvas got one half of the paint tube. We write one half like this — a 1 on top and a 2 on the bottom!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "explain-half",
    sfx: "chime",
  },
  "explain-half": {
    id: "explain-half",
    type: "narrate",
    tutorText: "The bottom number tells us how many equal pieces we made — 2 pieces. The top number tells us how many pieces each canvas got — 1 piece. So it's 1 out of 2!",
    next: "half-recap",
    sfx: "warm-pad",
  },
  "half-recap": {
    id: "half-recap",
    type: "narrate",
    tutorText: "Blobby's first painting is looking great! Now Blobby wants to try something new for the next painting.",
    next: "stage2-intro",
    sfx: "music-box",
  },

  // =============================================
  // STAGE 2: Discover that 1/2 = 2/4
  // =============================================

  "stage2-intro": {
    id: "stage2-intro",
    type: "narrate",
    tutorText: "Blobby's friend Splat just arrived! Splat is a green monster who also loves to paint. Splat has a question about sharing paint.",
    next: "splat-question",
    sfx: "xylophone",
  },
  "splat-question": {
    id: "splat-question",
    type: "narrate",
    tutorText: "Splat says: \"I have 1 paint tube and 4 canvases! I want each canvas to get the same amount of paint. Can you help?\"",
    next: "share-1-among-4",
    sfx: "warm-pad",
  },
  "share-1-among-4": {
    id: "share-1-among-4",
    type: "distribute",
    taskHeader: "Share 1 paint tube among 4 canvases.",
    tutorText: "Let's help Splat! We have 1 tube and 4 canvases. We'll need to cut the tube into equal pieces. Use the knife!",
    cookieCount: 1,
    characterCount: 4,
    expectedPerPerson: 0,
    allowKnife: true,
    next: "how-many-pieces-4",
    sfx: "gentle-whoosh",
  },
  "how-many-pieces-4": {
    id: "how-many-pieces-4",
    type: "choice",
    tutorText: "To share 1 tube equally among 4 canvases, how many pieces should we cut it into?",
    choices: [
      { label: "2 pieces", next: "not-2-pieces" },
      { label: "4 pieces", next: "yes-4-pieces", correct: true },
      { label: "10 pieces", next: "not-10-pieces" },
    ],
  },
  "not-2-pieces": {
    id: "not-2-pieces",
    type: "narrate",
    tutorText: "If we cut it into 2 pieces, we'd only have enough for 2 canvases. But Splat has 4 canvases! We need one piece for each canvas.",
    next: "how-many-pieces-4",
    sfx: "soft-bell",
  },
  "not-10-pieces": {
    id: "not-10-pieces",
    type: "narrate",
    tutorText: "That's a lot of pieces! We only need one piece for each canvas. Count the canvases — how many are there?",
    next: "how-many-pieces-4",
    sfx: "soft-bell",
  },
  "yes-4-pieces": {
    id: "yes-4-pieces",
    type: "narrate",
    tutorText: "Exactly! 4 canvases means 4 equal pieces. Each canvas gets one piece out of four!",
    next: "show-one-fourth",
    sfx: "chime",
  },
  "show-one-fourth": {
    id: "show-one-fourth",
    type: "show-fraction",
    tutorText: "Each canvas gets one fourth of the tube. We write that with a 1 on top and a 4 on the bottom!",
    showFractionNum: 1,
    showFractionDen: 4,
    next: "now-the-trick",
    sfx: "sparkle",
  },
  "now-the-trick": {
    id: "now-the-trick",
    type: "narrate",
    tutorText: "Now here's where it gets really cool. Splat looks at Blobby's 2 canvases and says: \"Hey Blobby, let's compare! You gave each of YOUR canvases one half. I gave each of MY canvases one fourth.\"",
    next: "splat-idea",
    sfx: "music-box",
  },
  "splat-idea": {
    id: "splat-idea",
    type: "narrate",
    tutorText: "Splat has an idea: \"What if I push two of my canvases together? Two of my little pieces side by side... how much paint is that?\"",
    next: "two-fourths-question",
    sfx: "xylophone",
  },
  "two-fourths-question": {
    id: "two-fourths-question",
    type: "choice",
    tutorText: "If each canvas got one fourth, and we push 2 canvases together, how many fourths is that?",
    choices: [
      { label: "1 fourth", next: "not-1-fourth" },
      { label: "2 fourths", next: "yes-2-fourths", correct: true },
      { label: "4 fourths", next: "not-4-fourths" },
    ],
  },
  "not-1-fourth": {
    id: "not-1-fourth",
    type: "narrate",
    tutorText: "That's just one canvas worth! We're putting two canvases together, so we need to count both their pieces. Try again!",
    next: "two-fourths-question",
    sfx: "soft-bell",
  },
  "not-4-fourths": {
    id: "not-4-fourths",
    type: "narrate",
    tutorText: "4 fourths would be ALL the canvases together — that's the whole tube! We're only pushing 2 of the 4 canvases together.",
    next: "two-fourths-question",
    sfx: "soft-bell",
  },
  "yes-2-fourths": {
    id: "yes-2-fourths",
    type: "show-fraction",
    tutorText: "Right! Two canvases together have 2 fourths of the paint. Let's write that down!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "big-discovery",
    sfx: "chime",
  },
  "big-discovery": {
    id: "big-discovery",
    type: "narrate",
    tutorText: "Now look closely! Blobby split 1 tube between 2 canvases, so each got one half. Splat split 1 tube between 4 canvases, and two of those together make two fourths.",
    next: "compare-amounts",
    sfx: "warm-pad",
  },
  "compare-amounts": {
    id: "compare-amounts",
    type: "narrate",
    tutorText: "But here's the magical part — Blobby's one half and Splat's two fourths are the SAME amount of paint! The canvases would look exactly the same!",
    next: "discovery-question",
    sfx: "harp-gliss",
  },
  "discovery-question": {
    id: "discovery-question",
    type: "choice",
    tutorText: "So if one half and two fourths are the same amount of paint, that means...",
    choices: [
      { label: "One half equals two fourths!", next: "yes-equivalent", correct: true },
      { label: "One half is bigger", next: "not-bigger" },
      { label: "Two fourths is bigger", next: "not-bigger-2" },
    ],
  },
  "not-bigger": {
    id: "not-bigger",
    type: "narrate",
    tutorText: "Think about it — Blobby's canvas and Splat's two canvases pushed together have exactly the same amount of paint. Neither one has more! They're...",
    next: "discovery-question",
    sfx: "soft-bell",
  },
  "not-bigger-2": {
    id: "not-bigger-2",
    type: "narrate",
    tutorText: "Remember, both came from splitting the same size tube. Blobby's half and Splat's two fourths cover the exact same amount. They must be...",
    next: "discovery-question",
    sfx: "soft-bell",
  },
  "yes-equivalent": {
    id: "yes-equivalent",
    type: "narrate",
    tutorText: "YES! One half equals two fourths! They look different as fractions, but they mean the exact same amount. That's called equivalent fractions!",
    next: "show-equiv-half",
    sfx: "sparkle",
  },
  "show-equiv-half": {
    id: "show-equiv-half",
    type: "show-fraction",
    tutorText: "Here's one half...",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "show-equiv-2-4",
    sfx: "chime",
  },
  "show-equiv-2-4": {
    id: "show-equiv-2-4",
    type: "show-fraction",
    tutorText: "...and here's two fourths. Same amount of paint, just written differently! One half equals two fourths!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "explain-why",
    sfx: "chime",
  },
  "explain-why": {
    id: "explain-why",
    type: "narrate",
    tutorText: "Here's the secret: when we cut each half into 2 smaller pieces, we get twice as many pieces — but each piece is twice as small. The amount stays the same!",
    next: "stage3-intro",
    sfx: "warm-pad",
  },

  // =============================================
  // STAGE 3: Practice another equivalence (2/4 = 4/8 or 1/3 = 2/6)
  // =============================================

  "stage3-intro": {
    id: "stage3-intro",
    type: "narrate",
    tutorText: "A third monster just walked into the studio! It's Doodle, a tiny orange monster. Doodle wants to try the same trick with a different painting.",
    next: "doodle-setup",
    sfx: "xylophone",
  },
  "doodle-setup": {
    id: "doodle-setup",
    type: "narrate",
    tutorText: "Doodle has 1 tube of red paint and 3 canvases. Let's help Doodle share the paint equally!",
    next: "share-1-among-3",
    sfx: "music-box",
  },
  "share-1-among-3": {
    id: "share-1-among-3",
    type: "distribute",
    taskHeader: "Share 1 paint tube among 3 canvases.",
    tutorText: "Help Doodle split 1 tube of red paint among 3 canvases equally. Use the knife to cut!",
    cookieCount: 1,
    characterCount: 3,
    expectedPerPerson: 0,
    allowKnife: true,
    next: "each-got-third",
    sfx: "gentle-whoosh",
  },
  "each-got-third": {
    id: "each-got-third",
    type: "choice",
    tutorText: "We split 1 tube into 3 equal parts. How much did each canvas get?",
    choices: [
      { label: "One third", next: "yes-one-third", correct: true },
      { label: "One half", next: "not-half-here" },
      { label: "Three tubes", next: "not-three-tubes" },
    ],
  },
  "not-half-here": {
    id: "not-half-here",
    type: "narrate",
    tutorText: "One half means we split into 2 pieces. But we split into 3 equal pieces this time! So each piece is one out of three.",
    next: "each-got-third",
    sfx: "soft-bell",
  },
  "not-three-tubes": {
    id: "not-three-tubes",
    type: "narrate",
    tutorText: "We only started with 1 tube! We cut that 1 tube into 3 equal pieces. Each canvas gets 1 of those 3 pieces.",
    next: "each-got-third",
    sfx: "soft-bell",
  },
  "yes-one-third": {
    id: "yes-one-third",
    type: "show-fraction",
    tutorText: "Exactly! Each canvas gets one third! A 1 on top and a 3 on the bottom.",
    showFractionNum: 1,
    showFractionDen: 3,
    next: "doodle-challenge",
    sfx: "chime",
  },
  "doodle-challenge": {
    id: "doodle-challenge",
    type: "narrate",
    tutorText: "Now Doodle says: \"What if I had cut each of those thirds in half? Then I'd have even MORE little pieces!\" Let's think about that.",
    next: "how-many-sixths",
    sfx: "xylophone",
  },
  "how-many-sixths": {
    id: "how-many-sixths",
    type: "choice",
    tutorText: "If we cut each of the 3 pieces in half, how many tiny pieces would we have in total?",
    choices: [
      { label: "4 pieces", next: "not-4-pcs" },
      { label: "6 pieces", next: "yes-6-pieces", correct: true },
      { label: "3 pieces", next: "not-3-pcs" },
    ],
  },
  "not-4-pcs": {
    id: "not-4-pcs",
    type: "narrate",
    tutorText: "Not quite! We had 3 pieces, and we cut EACH one in half. So each piece becomes 2 little pieces. That's 3 times 2!",
    next: "how-many-sixths",
    sfx: "soft-bell",
  },
  "not-3-pcs": {
    id: "not-3-pcs",
    type: "narrate",
    tutorText: "We started with 3 pieces, but then we cut each one in half. That gives us MORE pieces! Each of the 3 becomes 2 little ones.",
    next: "how-many-sixths",
    sfx: "soft-bell",
  },
  "yes-6-pieces": {
    id: "yes-6-pieces",
    type: "narrate",
    tutorText: "Yes! 3 pieces cut in half makes 6 tiny pieces! So now the whole tube is split into 6 equal parts — sixths!",
    next: "how-many-sixths-per-canvas",
    sfx: "chime",
  },
  "how-many-sixths-per-canvas": {
    id: "how-many-sixths-per-canvas",
    type: "choice",
    tutorText: "Each canvas originally had 1 third. We cut that third in half, so now each canvas has how many sixths?",
    choices: [
      { label: "1 sixth", next: "not-1-sixth" },
      { label: "2 sixths", next: "yes-2-sixths", correct: true },
      { label: "3 sixths", next: "not-3-sixths" },
    ],
  },
  "not-1-sixth": {
    id: "not-1-sixth",
    type: "narrate",
    tutorText: "Remember, each canvas had one third, and we cut that third into 2 pieces. So each canvas now has 2 of the little pieces!",
    next: "how-many-sixths-per-canvas",
    sfx: "soft-bell",
  },
  "not-3-sixths": {
    id: "not-3-sixths",
    type: "narrate",
    tutorText: "3 sixths would be half the whole tube! Each canvas only had one third. When we cut that third in half, we get 2 tiny pieces.",
    next: "how-many-sixths-per-canvas",
    sfx: "soft-bell",
  },
  "yes-2-sixths": {
    id: "yes-2-sixths",
    type: "show-fraction",
    tutorText: "That's it! Each canvas has 2 sixths! Let's write that down.",
    showFractionNum: 2,
    showFractionDen: 6,
    next: "second-equivalence",
    sfx: "sparkle",
  },
  "second-equivalence": {
    id: "second-equivalence",
    type: "narrate",
    tutorText: "So one third and two sixths are the same amount of paint — just like one half and two fourths were the same! The fractions look different, but the paint amount is equal!",
    next: "show-equiv-third",
    sfx: "harp-gliss",
  },
  "show-equiv-third": {
    id: "show-equiv-third",
    type: "show-fraction",
    tutorText: "Here's one third...",
    showFractionNum: 1,
    showFractionDen: 3,
    next: "show-equiv-2-6",
    sfx: "chime",
  },
  "show-equiv-2-6": {
    id: "show-equiv-2-6",
    type: "show-fraction",
    tutorText: "...and here's two sixths! Same amount, different way to write it. One third equals two sixths!",
    showFractionNum: 2,
    showFractionDen: 6,
    next: "final-quiz",
    sfx: "chime",
  },
  "final-quiz": {
    id: "final-quiz",
    type: "choice",
    tutorText: "Pop quiz from the monsters! Which of these is the same amount as one half?",
    choices: [
      { label: "1 fourth", next: "not-1-fourth-final" },
      { label: "2 fourths", next: "yes-final", correct: true },
      { label: "3 fourths", next: "not-3-fourths-final" },
    ],
  },
  "not-1-fourth-final": {
    id: "not-1-fourth-final",
    type: "narrate",
    tutorText: "One fourth is actually smaller than one half. Remember, when Blobby split the tube into 2 pieces and Splat split it into 4, we needed TWO of Splat's pieces to match one of Blobby's!",
    next: "final-quiz",
    sfx: "soft-bell",
  },
  "not-3-fourths-final": {
    id: "not-3-fourths-final",
    type: "narrate",
    tutorText: "Three fourths is actually more than one half! Think back to Splat's 4 canvases — we only needed 2 of them to match Blobby's 1 half.",
    next: "final-quiz",
    sfx: "soft-bell",
  },
  "yes-final": {
    id: "yes-final",
    type: "narrate",
    tutorText: "You got it! Two fourths equals one half! You really understand equivalent fractions!",
    next: "celebration",
    sfx: "sparkle",
  },
  "celebration": {
    id: "celebration",
    type: "narrate",
    tutorText: "All three monsters — Blobby, Splat, and Doodle — are cheering for you! They painted a big sign that says: \"Fractions can look different but mean the same amount!\"",
    next: "lesson-wrapup",
    sfx: "harp-gliss",
  },
  "lesson-wrapup": {
    id: "lesson-wrapup",
    type: "narrate",
    tutorText: "Today you discovered something really important: when we cut pieces into smaller pieces, we get more pieces — but the amount stays the same. That's the secret of equivalent fractions!",
    next: "goodbye",
    sfx: "warm-pad",
  },
  "goodbye": {
    id: "goodbye",
    type: "narrate",
    tutorText: "The monsters wave goodbye from their art studio. Great job today, fraction artist! Come back and paint with them anytime!",
    next: "end",
    sfx: "music-box",
  },
};
