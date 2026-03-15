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

  // ============================================================
  // STAGE 1: Review halves — what is one half?
  // ============================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText: "Welcome to the ocean floor! Today we're joining Captain Coral the sea turtle and her crew on an underwater adventure. They just found a sunken treasure chest full of seaweed snacks!",
    next: "meet-crew",
    sfx: "gentle-whoosh",
  },
  "meet-crew": {
    id: "meet-crew",
    type: "narrate",
    tutorText: "Captain Coral's crew has two members: Finn the friendly fish and Sandy the starfish. They love to share everything equally!",
    next: "share-2-easy",
    sfx: "warm-pad",
  },
  "share-2-easy": {
    id: "share-2-easy",
    type: "distribute",
    taskHeader: "Share 2 seaweed snacks equally.",
    tutorText: "First, let's warm up! Captain Coral found 2 seaweed snacks. Can you share them equally between Finn and Sandy?",
    cookieCount: 2,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "share-2-result",
    sfx: "soft-bell",
  },
  "share-2-result": {
    id: "share-2-result",
    type: "show-number",
    tutorText: "Perfect! 2 snacks shared between 2 friends means 1 snack each. Nice and easy!",
    showNumber: "1",
    next: "share-4-easy",
    sfx: "chime",
  },
  "share-4-easy": {
    id: "share-4-easy",
    type: "distribute",
    taskHeader: "Share 4 seaweed snacks equally.",
    tutorText: "The treasure chest had more inside! Now there are 4 seaweed snacks. Share them equally between Finn and Sandy.",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "share-4-result",
    sfx: "soft-bell",
  },
  "share-4-result": {
    id: "share-4-result",
    type: "show-number",
    tutorText: "You got it! 4 snacks split between 2 friends gives each friend 2. You're a sharing superstar!",
    showNumber: "2",
    next: "one-snack-problem",
    sfx: "chime",
  },

  // --- Introduce halves ---

  "one-snack-problem": {
    id: "one-snack-problem",
    type: "narrate",
    tutorText: "Uh oh! Captain Coral just pulled out 1 last seaweed snack from the chest. But there are still 2 friends who want some. What should we do?",
    next: "one-snack-choice",
    sfx: "gentle-whoosh",
  },
  "one-snack-choice": {
    id: "one-snack-choice",
    type: "choice",
    tutorText: "We have 1 snack and 2 friends. How can we share it fairly?",
    choices: [
      { label: "Cut it in half!", next: "good-idea-cut", correct: true },
      { label: "Give it to a passing whale", next: "whale-response" },
      { label: "Hide it under a rock", next: "rock-response" },
    ],
  },
  "whale-response": {
    id: "whale-response",
    type: "narrate",
    tutorText: "That's very generous! But Finn and Sandy are looking at us with big hungry eyes. Maybe we can find a way to share it between them instead?",
    next: "one-snack-choice",
    sfx: "gentle-whoosh",
  },
  "rock-response": {
    id: "rock-response",
    type: "narrate",
    tutorText: "Haha, sneaky! But Captain Coral believes in fair sharing. Let's think of a way both friends can get some.",
    next: "one-snack-choice",
    sfx: "gentle-whoosh",
  },
  "good-idea-cut": {
    id: "good-idea-cut",
    type: "narrate",
    tutorText: "Great thinking! Let's slice that seaweed snack right down the middle so both friends get an equal piece.",
    next: "do-slice-half",
    sfx: "sparkle",
  },
  "do-slice-half": {
    id: "do-slice-half",
    type: "slice",
    tutorText: "Tap the snack to slice it into 2 equal pieces!",
    next: "distribute-the-halves",
    sfx: "gentle-whoosh",
  },
  "distribute-the-halves": {
    id: "distribute-the-halves",
    type: "distribute-halves",
    tutorText: "Now give one piece to Finn and one piece to Sandy!",
    characterCount: 2,
    next: "half-question",
    sfx: "soft-bell",
  },
  "half-question": {
    id: "half-question",
    type: "choice",
    tutorText: "Each friend got one piece out of two equal pieces. What do we call that amount?",
    choices: [
      { label: "One half", next: "half-correct", correct: true },
      { label: "One whole", next: "half-wrong-whole" },
      { label: "Two", next: "half-wrong-two" },
    ],
  },
  "half-wrong-whole": {
    id: "half-wrong-whole",
    type: "narrate",
    tutorText: "Not quite! One whole would be the entire snack. But each friend only got one piece out of two. That's less than a whole!",
    next: "half-question",
    sfx: "soft-bell",
  },
  "half-wrong-two": {
    id: "half-wrong-two",
    type: "narrate",
    tutorText: "Hmm, two would mean each friend got two snacks! But we only had one snack that we cut into pieces. Look at how much each friend has.",
    next: "half-question",
    sfx: "soft-bell",
  },
  "half-correct": {
    id: "half-correct",
    type: "show-fraction",
    tutorText: "That's right! Each friend got one half. We write it like this: 1 on top and 2 on the bottom. The bottom number tells us how many equal pieces, and the top tells us how many pieces each friend got!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "half-recap",
    sfx: "harp-gliss",
  },
  "half-recap": {
    id: "half-recap",
    type: "narrate",
    tutorText: "So when we split something into 2 equal pieces and take 1 piece, that's one half. Finn is happy, Sandy is happy, and Captain Coral is proud of your sharing!",
    next: "stage2-intro",
    sfx: "warm-pad",
  },

  // ============================================================
  // STAGE 2: Discover that 1/2 = 2/4
  // ============================================================

  "stage2-intro": {
    id: "stage2-intro",
    type: "narrate",
    tutorText: "Suddenly, two more sea creatures swim up! It's Shelly the seahorse and Bubbles the blowfish. Now there are 4 friends who all want to share!",
    next: "four-friends-snack",
    sfx: "gentle-whoosh",
  },
  "four-friends-snack": {
    id: "four-friends-snack",
    type: "narrate",
    tutorText: "Captain Coral finds one more big seaweed snack in the chest. This time, 4 friends want to share it equally. Hmm, we can't just cut it in half this time...",
    next: "how-many-cuts",
    sfx: "warm-pad",
  },
  "how-many-cuts": {
    id: "how-many-cuts",
    type: "choice",
    tutorText: "If we have 4 friends and 1 snack, how many equal pieces do we need to cut it into?",
    choices: [
      { label: "2 pieces", next: "wrong-2-pieces" },
      { label: "4 pieces", next: "right-4-pieces", correct: true },
      { label: "100 pieces", next: "wrong-100-pieces" },
    ],
  },
  "wrong-2-pieces": {
    id: "wrong-2-pieces",
    type: "narrate",
    tutorText: "If we only made 2 pieces, two of our friends would be left out! We need one piece for each friend. How many friends are there?",
    next: "how-many-cuts",
    sfx: "soft-bell",
  },
  "wrong-100-pieces": {
    id: "wrong-100-pieces",
    type: "narrate",
    tutorText: "Ha! Those would be some tiny crumbs! We just need enough pieces so each friend gets exactly one. Count the friends and try again!",
    next: "how-many-cuts",
    sfx: "soft-bell",
  },
  "right-4-pieces": {
    id: "right-4-pieces",
    type: "narrate",
    tutorText: "Exactly! 4 friends means we need 4 equal pieces. Let's cut this snack into quarters!",
    next: "show-quarter",
    sfx: "chime",
  },
  "show-quarter": {
    id: "show-quarter",
    type: "show-fraction",
    tutorText: "Each friend gets 1 piece out of 4 equal pieces. We write that as one fourth — 1 on top, 4 on the bottom!",
    showFractionNum: 1,
    showFractionDen: 4,
    next: "finn-gets-two",
    sfx: "harp-gliss",
  },

  // --- Now Finn's special situation ---

  "finn-gets-two": {
    id: "finn-gets-two",
    type: "narrate",
    tutorText: "But wait! Shelly and Bubbles say they aren't that hungry. They tell Finn he can have their pieces too. So now Finn has 2 out of the 4 pieces!",
    next: "finn-fraction-ask",
    sfx: "sparkle",
  },
  "finn-fraction-ask": {
    id: "finn-fraction-ask",
    type: "choice",
    tutorText: "Finn has 2 pieces out of 4 equal pieces. How do we write that as a fraction?",
    choices: [
      { label: "2/4", next: "finn-fraction-correct", correct: true },
      { label: "1/2", next: "finn-fraction-almost" },
      { label: "4/2", next: "finn-fraction-flipped" },
    ],
  },
  "finn-fraction-flipped": {
    id: "finn-fraction-flipped",
    type: "narrate",
    tutorText: "Careful! The top number is how many pieces Finn has, and the bottom number is how many total equal pieces there are. Finn has 2 pieces, and the snack was cut into 4 pieces total.",
    next: "finn-fraction-ask",
    sfx: "soft-bell",
  },
  "finn-fraction-almost": {
    id: "finn-fraction-almost",
    type: "narrate",
    tutorText: "Interesting answer! That's actually going to be important in a moment. But first, let's write exactly what we see: Finn has 2 pieces, and the snack was cut into 4 pieces total. What fraction is that?",
    next: "finn-fraction-ask",
    sfx: "soft-bell",
  },
  "finn-fraction-correct": {
    id: "finn-fraction-correct",
    type: "show-fraction",
    tutorText: "Yes! Finn has two fourths — 2 on top, 4 on the bottom!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "big-discovery-setup",
    sfx: "chime",
  },

  // --- The big discovery ---

  "big-discovery-setup": {
    id: "big-discovery-setup",
    type: "narrate",
    tutorText: "Now here's something really cool. Remember earlier when we cut a snack in half and gave Finn one piece out of two? That was one half.",
    next: "big-discovery-compare",
    sfx: "warm-pad",
  },
  "big-discovery-compare": {
    id: "big-discovery-compare",
    type: "narrate",
    tutorText: "Look at Finn's pieces now. He has 2 out of 4 pieces. But if you push those 2 pieces together... they make exactly the same amount as one half of the snack!",
    next: "big-discovery-question",
    sfx: "sparkle",
  },
  "big-discovery-question": {
    id: "big-discovery-question",
    type: "choice",
    tutorText: "So if 1 out of 2 pieces is the same amount as 2 out of 4 pieces... what does that mean?",
    choices: [
      { label: "One half and two fourths are the same!", next: "discovery-correct", correct: true },
      { label: "Finn got more snack than before", next: "discovery-wrong-more" },
      { label: "I'm not sure yet", next: "discovery-hint" },
    ],
  },
  "discovery-wrong-more": {
    id: "discovery-wrong-more",
    type: "narrate",
    tutorText: "It might look like more because there are more pieces, but look carefully — the pieces are smaller! Two small quarter-pieces pushed together equal one big half-piece. The total amount of snack is the same!",
    next: "big-discovery-question",
    sfx: "soft-bell",
  },
  "discovery-hint": {
    id: "discovery-hint",
    type: "narrate",
    tutorText: "That's okay! Think about it this way: if you put Finn's 2 quarter-pieces side by side, they fill up exactly the same space as 1 half-piece. Same amount of seaweed, just cut differently!",
    next: "big-discovery-question",
    sfx: "soft-bell",
  },
  "discovery-correct": {
    id: "discovery-correct",
    type: "narrate",
    tutorText: "You discovered something amazing! One half and two fourths are the SAME amount. The snack is just cut into different numbers of pieces!",
    next: "show-equivalence",
    sfx: "harp-gliss",
  },
  "show-equivalence": {
    id: "show-equivalence",
    type: "show-fraction",
    tutorText: "One half equals two fourths. They look different, but they mean the exact same thing! These are called equivalent fractions.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "show-equivalence-b",
    sfx: "sparkle",
  },
  "show-equivalence-b": {
    id: "show-equivalence-b",
    type: "show-fraction",
    tutorText: "See? Two fourths is the same amount! When fractions are equal like this, we call them equivalent. Equivalent means they have the same value, even though they look different.",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "equiv-check",
    sfx: "sparkle",
  },
  "equiv-check": {
    id: "equiv-check",
    type: "choice",
    tutorText: "Quick check! If Captain Coral gives you one half of a snack, and gives Finn two fourths of the same snack, who got more?",
    choices: [
      { label: "I got more", next: "equiv-check-wrong-me" },
      { label: "Finn got more", next: "equiv-check-wrong-finn" },
      { label: "We got the same amount!", next: "equiv-check-correct", correct: true },
    ],
  },
  "equiv-check-wrong-me": {
    id: "equiv-check-wrong-me",
    type: "narrate",
    tutorText: "It might seem like it, but remember what we just learned! One half and two fourths are the same amount. The pieces just look different!",
    next: "equiv-check",
    sfx: "soft-bell",
  },
  "equiv-check-wrong-finn": {
    id: "equiv-check-wrong-finn",
    type: "narrate",
    tutorText: "Finn has more pieces, but each piece is smaller! When you put his 2 little pieces together, they equal your 1 bigger piece. Think about the total amount.",
    next: "equiv-check",
    sfx: "soft-bell",
  },
  "equiv-check-correct": {
    id: "equiv-check-correct",
    type: "narrate",
    tutorText: "Exactly right! One half equals two fourths. It doesn't matter how the pieces are cut — the total amount is the same. Captain Coral is impressed!",
    next: "stage3-intro",
    sfx: "chime",
  },

  // ============================================================
  // STAGE 3: Practice with another equivalence (2/3 = 4/6)
  // ============================================================

  "stage3-intro": {
    id: "stage3-intro",
    type: "narrate",
    tutorText: "The crew swims deeper and finds an even bigger treasure chest! Inside are beautiful golden seaweed rolls. Captain Coral wants to share them with the crew.",
    next: "three-friends-setup",
    sfx: "gentle-whoosh",
  },
  "three-friends-setup": {
    id: "three-friends-setup",
    type: "narrate",
    tutorText: "This time, Finn, Sandy, and Shelly want to share. That's 3 friends! Captain Coral cuts a big golden roll into 3 equal pieces and gives 2 pieces to Finn.",
    next: "finn-two-thirds-q",
    sfx: "warm-pad",
  },
  "finn-two-thirds-q": {
    id: "finn-two-thirds-q",
    type: "choice",
    tutorText: "Finn got 2 pieces out of 3 equal pieces. What fraction is that?",
    choices: [
      { label: "2/3", next: "finn-two-thirds-correct", correct: true },
      { label: "3/2", next: "finn-two-thirds-wrong-flip" },
      { label: "1/3", next: "finn-two-thirds-wrong-one" },
    ],
  },
  "finn-two-thirds-wrong-flip": {
    id: "finn-two-thirds-wrong-flip",
    type: "narrate",
    tutorText: "Almost! Remember, the top number is how many pieces Finn has, and the bottom number is the total pieces. Finn has 2 pieces and there are 3 total.",
    next: "finn-two-thirds-q",
    sfx: "soft-bell",
  },
  "finn-two-thirds-wrong-one": {
    id: "finn-two-thirds-wrong-one",
    type: "narrate",
    tutorText: "Close, but Finn didn't get just 1 piece — he got 2 pieces! The bottom number (total pieces) is right though. Try again!",
    next: "finn-two-thirds-q",
    sfx: "soft-bell",
  },
  "finn-two-thirds-correct": {
    id: "finn-two-thirds-correct",
    type: "show-fraction",
    tutorText: "That's right! Finn has two thirds. 2 on top, 3 on the bottom!",
    showFractionNum: 2,
    showFractionDen: 3,
    next: "six-pieces-setup",
    sfx: "chime",
  },

  // --- Now cut into 6 pieces ---

  "six-pieces-setup": {
    id: "six-pieces-setup",
    type: "narrate",
    tutorText: "Now Captain Coral grabs another golden roll that's the exact same size. But this time, she cuts it into 6 equal pieces instead of 3. Twice as many cuts!",
    next: "six-pieces-question",
    sfx: "gentle-whoosh",
  },
  "six-pieces-question": {
    id: "six-pieces-question",
    type: "choice",
    tutorText: "Finn got 2 out of 3 pieces last time. If the roll is cut into 6 pieces instead, how many pieces should Finn get to have the SAME amount of seaweed?",
    choices: [
      { label: "2 pieces", next: "six-wrong-two" },
      { label: "4 pieces", next: "six-correct-four", correct: true },
      { label: "6 pieces", next: "six-wrong-six" },
    ],
  },
  "six-wrong-two": {
    id: "six-wrong-two",
    type: "narrate",
    tutorText: "Hmm, 2 pieces out of 6 would actually be less than before! When there are more pieces, each piece is smaller. Finn needs more of them to get the same total amount.",
    next: "six-pieces-question",
    sfx: "soft-bell",
  },
  "six-wrong-six": {
    id: "six-wrong-six",
    type: "narrate",
    tutorText: "That would be the whole roll! Finn only had two thirds before, not the whole thing. Think about it: each old piece became 2 smaller pieces, so how many small pieces equal Finn's share?",
    next: "six-pieces-question",
    sfx: "soft-bell",
  },
  "six-correct-four": {
    id: "six-correct-four",
    type: "show-fraction",
    tutorText: "You've got it! 4 pieces out of 6. That's four sixths!",
    showFractionNum: 4,
    showFractionDen: 6,
    next: "second-equivalence",
    sfx: "harp-gliss",
  },
  "second-equivalence": {
    id: "second-equivalence",
    type: "narrate",
    tutorText: "Look at that! Two thirds and four sixths are the SAME amount of seaweed. The roll was just cut into different numbers of pieces. You found another pair of equivalent fractions!",
    next: "second-equiv-show",
    sfx: "sparkle",
  },
  "second-equiv-show": {
    id: "second-equiv-show",
    type: "show-fraction",
    tutorText: "Two thirds equals four sixths. Same amount, different pieces. You're getting really good at spotting equivalent fractions!",
    showFractionNum: 2,
    showFractionDen: 3,
    next: "final-quiz-intro",
    sfx: "chime",
  },

  // --- Final review quiz ---

  "final-quiz-intro": {
    id: "final-quiz-intro",
    type: "narrate",
    tutorText: "Captain Coral is so proud of you! Before the crew swims home, she has one last treasure quiz for you.",
    next: "final-quiz-1",
    sfx: "warm-pad",
  },
  "final-quiz-1": {
    id: "final-quiz-1",
    type: "choice",
    tutorText: "True or false: fractions that look different can still be equal!",
    choices: [
      { label: "True!", next: "final-q1-correct", correct: true },
      { label: "False", next: "final-q1-wrong" },
    ],
  },
  "final-q1-wrong": {
    id: "final-q1-wrong",
    type: "narrate",
    tutorText: "Remember Finn's snack? One half and two fourths looked different but were the same amount! Fractions can definitely look different and still be equal.",
    next: "final-quiz-1",
    sfx: "soft-bell",
  },
  "final-q1-correct": {
    id: "final-q1-correct",
    type: "narrate",
    tutorText: "That's right! One half equals two fourths, and two thirds equals four sixths. They look different but mean the same thing!",
    next: "final-quiz-2",
    sfx: "chime",
  },
  "final-quiz-2": {
    id: "final-quiz-2",
    type: "choice",
    tutorText: "Last question! Which of these is equivalent to one half?",
    choices: [
      { label: "1/3", next: "final-q2-wrong-third" },
      { label: "2/4", next: "final-q2-correct", correct: true },
      { label: "3/4", next: "final-q2-wrong-three-quarter" },
    ],
  },
  "final-q2-wrong-third": {
    id: "final-q2-wrong-third",
    type: "narrate",
    tutorText: "Not quite! One third is a different amount than one half. Think back to our adventure — when we cut the snack into 4 pieces, how many pieces equaled one half?",
    next: "final-quiz-2",
    sfx: "soft-bell",
  },
  "final-q2-wrong-three-quarter": {
    id: "final-q2-wrong-three-quarter",
    type: "narrate",
    tutorText: "Three fourths is actually more than one half! Remember, Finn had 2 pieces out of 4 and that equaled one half. Try again!",
    next: "final-quiz-2",
    sfx: "soft-bell",
  },
  "final-q2-correct": {
    id: "final-q2-correct",
    type: "show-fraction",
    tutorText: "Perfect! Two fourths equals one half. You remembered! Equivalent fractions are the same amount, just with different-sized pieces.",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "celebration",
    sfx: "harp-gliss",
  },

  // ============================================================
  // Celebration and wrap-up
  // ============================================================

  "celebration": {
    id: "celebration",
    type: "narrate",
    tutorText: "Captain Coral, Finn, Sandy, Shelly, and Bubbles all cheer for you! You learned that fractions can look different but still be the same amount. That's the secret of equivalent fractions!",
    next: "done",
    sfx: "xylophone",
  },
  "done": {
    id: "done",
    type: "narrate",
    tutorText: "Amazing job, ocean explorer! You shared seaweed snacks, discovered halves and quarters, and learned that one half equals two fourths. The whole underwater crew is proud of you!",
    next: "end",
    sfx: "music-box",
  },
};
