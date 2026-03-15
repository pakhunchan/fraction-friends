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
  // STAGE 1: Review halves — what IS one half?
  // ============================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText: "The sun has set over the forest and the campfire is crackling! Beaver, Owl, Rabbit, and Fox are all gathered around the warm glow. Tonight they're sharing s'mores and trail mix under the stars.",
    next: "meet-beaver-owl",
    sfx: "warm-pad",
  },

  "meet-beaver-owl": {
    id: "meet-beaver-owl",
    type: "narrate",
    tutorText: "Beaver just finished toasting a beautiful golden s'more. Owl is sitting right next to him, and her tummy is rumbling! Beaver wants to share his s'more with Owl so they each get the same amount.",
    next: "share-1-smore",
    sfx: "soft-bell",
  },

  "share-1-smore": {
    id: "share-1-smore",
    type: "slice",
    tutorText: "Beaver has 1 s'more and wants to split it equally with Owl. Can you slice it in half?",
    taskHeader: "Slice the s'more so they can share!",
    cookieCount: 1,
    allowKnife: true,
    next: "share-1-smore-dist",
    sfx: "gentle-whoosh",
  },

  "share-1-smore-dist": {
    id: "share-1-smore-dist",
    type: "distribute-halves",
    tutorText: "Great slice! Now give one half to Beaver and one half to Owl.",
    taskHeader: "Give each friend a half.",
    cookieCount: 1,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "half-reveal",
    sfx: "chime",
  },

  "half-reveal": {
    id: "half-reveal",
    type: "show-fraction",
    tutorText: "Each friend got one half of the s'more. We write one half like this — a 1 on top, and a 2 on the bottom. The bottom number tells us we cut it into 2 equal pieces!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "half-q1",
    sfx: "harp-gliss",
  },

  "half-q1": {
    id: "half-q1",
    type: "choice",
    tutorText: "Quick check! When we cut something into 2 equal pieces and take 1 piece, what fraction do we have?",
    taskHeader: "What fraction is one piece out of two?",
    choices: [
      { label: "1/3", next: "half-q1-wrong" },
      { label: "1/2", next: "half-q1-right", correct: true },
      { label: "2/2", next: "half-q1-wrong" },
    ],
    sfx: "soft-bell",
  },

  "half-q1-wrong": {
    id: "half-q1-wrong",
    type: "narrate",
    tutorText: "Not quite! Remember, the s'more was cut into 2 equal pieces and each friend took 1 piece. Think about which numbers go on top and bottom. Let's try again!",
    next: "half-q1",
    sfx: "gentle-whoosh",
  },

  "half-q1-right": {
    id: "half-q1-right",
    type: "narrate",
    tutorText: "That's right — one half! Beaver and Owl each munch their half happily by the fire. Yum!",
    next: "trail-mix-intro",
    sfx: "chime",
  },

  // --- Trail mix interlude to solidify halves ---

  "trail-mix-intro": {
    id: "trail-mix-intro",
    type: "narrate",
    tutorText: "Now Rabbit hops over with a bag of trail mix. There are 4 little handfuls of trail mix in the bag, and Rabbit wants to share equally with Fox. Let's help!",
    next: "trail-mix-distribute",
    sfx: "warm-pad",
  },

  "trail-mix-distribute": {
    id: "trail-mix-distribute",
    type: "distribute",
    tutorText: "Give out 4 handfuls of trail mix equally between Rabbit and Fox.",
    taskHeader: "Share 4 handfuls between 2 friends.",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "trail-mix-result",
    sfx: "xylophone",
  },

  "trail-mix-result": {
    id: "trail-mix-result",
    type: "show-number",
    tutorText: "Awesome! 4 handfuls shared between 2 friends means each one gets 2. That's a fair share! Rabbit and Fox are happy campers.",
    showNumber: "2",
    next: "trail-mix-half-q",
    sfx: "sparkle",
  },

  "trail-mix-half-q": {
    id: "trail-mix-half-q",
    type: "choice",
    tutorText: "Rabbit ate 2 out of the 4 handfuls. Fox also ate 2 out of 4. Each of them ate HALF the bag! But wait — is 2 out of 4 really the same as one half?",
    taskHeader: "Is 2/4 the same amount as 1/2?",
    choices: [
      { label: "Yes!", next: "trail-mix-half-yes", correct: true },
      { label: "No, they're different", next: "trail-mix-half-no" },
    ],
    sfx: "soft-bell",
  },

  "trail-mix-half-no": {
    id: "trail-mix-half-no",
    type: "narrate",
    tutorText: "Hmm, let's think about it. Rabbit got exactly half the bag. We can also write that as 2 out of 4. They're the same amount — just written differently! Try again.",
    next: "trail-mix-half-q",
    sfx: "gentle-whoosh",
  },

  "trail-mix-half-yes": {
    id: "trail-mix-half-yes",
    type: "narrate",
    tutorText: "You got it! This is a really big idea. Half the bag is 1 out of 2, but it's ALSO 2 out of 4. The same amount of trail mix — just described two different ways!",
    next: "stage2-bridge",
    sfx: "harp-gliss",
  },

  // ============================================================
  // STAGE 2: Discover that 1/2 = 2/4
  // ============================================================

  "stage2-bridge": {
    id: "stage2-bridge",
    type: "narrate",
    tutorText: "Owl ruffles her feathers excitedly. \"Did you know,\" she hoots, \"that fractions can LOOK different but mean the SAME thing?\" Let's explore what Owl means!",
    next: "smore-for-4",
    sfx: "warm-pad",
  },

  "smore-for-4": {
    id: "smore-for-4",
    type: "narrate",
    tutorText: "Beaver toasts another s'more. This time ALL four friends want a piece — Beaver, Owl, Rabbit, and Fox. We need to cut it into 4 equal pieces!",
    next: "slice-into-4",
    sfx: "soft-bell",
  },

  "slice-into-4": {
    id: "slice-into-4",
    type: "slice",
    tutorText: "Slice this s'more into 4 equal pieces so everyone gets some!",
    taskHeader: "Cut the s'more into 4 pieces.",
    cookieCount: 1,
    allowKnife: true,
    next: "distribute-quarters",
    sfx: "gentle-whoosh",
  },

  "distribute-quarters": {
    id: "distribute-quarters",
    type: "distribute",
    tutorText: "Perfect cuts! Now hand out the 4 pieces, one to each friend.",
    taskHeader: "Give 1 piece to each of the 4 friends.",
    cookieCount: 4,
    characterCount: 4,
    expectedPerPerson: 1,
    next: "quarter-show",
    sfx: "chime",
  },

  "quarter-show": {
    id: "quarter-show",
    type: "show-fraction",
    tutorText: "Each friend got 1 piece out of 4. We write that as one-fourth — a 1 on top and a 4 on the bottom!",
    showFractionNum: 1,
    showFractionDen: 4,
    next: "quarter-q1",
    sfx: "xylophone",
  },

  "quarter-q1": {
    id: "quarter-q1",
    type: "choice",
    tutorText: "Each friend got 1 out of 4 pieces. What fraction of the s'more did each friend eat?",
    taskHeader: "What fraction is 1 piece out of 4?",
    choices: [
      { label: "1/2", next: "quarter-q1-wrong" },
      { label: "1/4", next: "quarter-q1-right", correct: true },
      { label: "1/3", next: "quarter-q1-wrong" },
    ],
    sfx: "soft-bell",
  },

  "quarter-q1-wrong": {
    id: "quarter-q1-wrong",
    type: "narrate",
    tutorText: "Almost! We cut the s'more into 4 pieces, so the bottom number is 4. Each friend took 1 piece, so the top number is 1. Try once more!",
    next: "quarter-q1",
    sfx: "gentle-whoosh",
  },

  "quarter-q1-right": {
    id: "quarter-q1-right",
    type: "narrate",
    tutorText: "One-fourth! Nice job. Now here comes the magic part...",
    next: "equiv-setup",
    sfx: "sparkle",
  },

  "equiv-setup": {
    id: "equiv-setup",
    type: "narrate",
    tutorText: "Owl says, \"Look! Beaver and I are sitting together. Between us, we have 2 of the 4 pieces.\" That's 2 out of 4. Hmm, does that remind you of something?",
    next: "show-two-fourths",
    sfx: "warm-pad",
  },

  "show-two-fourths": {
    id: "show-two-fourths",
    type: "show-fraction",
    tutorText: "Beaver and Owl together have 2 pieces out of 4. We write that as two-fourths!",
    showFractionNum: 2,
    showFractionDen: 4,
    next: "equiv-compare",
    sfx: "harp-gliss",
  },

  "equiv-compare": {
    id: "equiv-compare",
    type: "narrate",
    tutorText: "Remember earlier when Beaver and Owl split a whole s'more in half? Each got one-half. Now they each have one piece out of four — and together that's two-fourths. But it's still the same amount of s'more! One half of the s'more equals two-fourths of the s'more.",
    next: "show-equiv",
    sfx: "music-box",
  },

  "show-equiv": {
    id: "show-equiv",
    type: "show-fraction",
    tutorText: "One-half equals two-fourths. They look different, but they mean the SAME amount! These are called equivalent fractions.",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "equiv-q1",
    sfx: "sparkle",
  },

  "equiv-q1": {
    id: "equiv-q1",
    type: "choice",
    tutorText: "So if Beaver and Owl share half a s'more, and it's cut into 4 pieces, how many pieces do they have together?",
    taskHeader: "1/2 of the s'more = how many fourths?",
    choices: [
      { label: "1/4", next: "equiv-q1-wrong" },
      { label: "2/4", next: "equiv-q1-right", correct: true },
      { label: "3/4", next: "equiv-q1-wrong" },
    ],
    sfx: "soft-bell",
  },

  "equiv-q1-wrong": {
    id: "equiv-q1-wrong",
    type: "narrate",
    tutorText: "Let's think again. Beaver has 1 piece and Owl has 1 piece. Together that's 2 pieces out of 4. That's the fraction that equals one-half! Try again.",
    next: "equiv-q1",
    sfx: "gentle-whoosh",
  },

  "equiv-q1-right": {
    id: "equiv-q1-right",
    type: "narrate",
    tutorText: "Yes! Two-fourths! One-half and two-fourths are equivalent fractions. They're the same amount, just written with different numbers. Owl hoots proudly!",
    next: "equiv-q2",
    sfx: "chime",
  },

  "equiv-q2": {
    id: "equiv-q2",
    type: "choice",
    tutorText: "True or false: one-half and two-fourths are the SAME amount.",
    taskHeader: "Are 1/2 and 2/4 equal?",
    choices: [
      { label: "True — same amount!", next: "equiv-q2-right", correct: true },
      { label: "False — different amounts", next: "equiv-q2-wrong" },
    ],
    sfx: "soft-bell",
  },

  "equiv-q2-wrong": {
    id: "equiv-q2-wrong",
    type: "narrate",
    tutorText: "Actually, they ARE the same! Picture the s'more: half of it is the same chunk whether you call it 1/2 or 2/4. The pieces are just cut smaller, but there are more of them. Let's try again!",
    next: "equiv-q2",
    sfx: "gentle-whoosh",
  },

  "equiv-q2-right": {
    id: "equiv-q2-right",
    type: "narrate",
    tutorText: "Exactly right! Fractions can look different on paper but represent the very same amount. That's the secret of equivalent fractions!",
    next: "stage3-bridge",
    sfx: "harp-gliss",
  },

  // ============================================================
  // STAGE 3: Practice another equivalence (2/4 = 4/8? No — 1/3 = 2/6)
  // ============================================================

  "stage3-bridge": {
    id: "stage3-bridge",
    type: "narrate",
    tutorText: "The campfire crackles and sparks fly up into the starry sky. Fox stretches and says, \"I wonder if there are OTHER equivalent fractions hiding out there!\" Great question, Fox! Let's find out.",
    next: "granola-intro",
    sfx: "warm-pad",
  },

  "granola-intro": {
    id: "granola-intro",
    type: "narrate",
    tutorText: "Rabbit pulls out a long granola bar. Three friends want to share it equally — Rabbit, Fox, and Owl. That means we need to split it into 3 equal parts!",
    next: "slice-into-3",
    sfx: "soft-bell",
  },

  "slice-into-3": {
    id: "slice-into-3",
    type: "slice",
    tutorText: "Slice the granola bar into 3 equal pieces — one for each friend.",
    taskHeader: "Cut the granola bar into 3 pieces.",
    cookieCount: 1,
    allowKnife: true,
    next: "distribute-thirds",
    sfx: "gentle-whoosh",
  },

  "distribute-thirds": {
    id: "distribute-thirds",
    type: "distribute",
    tutorText: "Now give one piece to each of the 3 friends!",
    taskHeader: "Share the 3 pieces equally.",
    cookieCount: 3,
    characterCount: 3,
    expectedPerPerson: 1,
    next: "third-show",
    sfx: "chime",
  },

  "third-show": {
    id: "third-show",
    type: "show-fraction",
    tutorText: "Each friend got 1 piece out of 3. That's one-third! A 1 on top and a 3 on the bottom.",
    showFractionNum: 1,
    showFractionDen: 3,
    next: "third-q1",
    sfx: "xylophone",
  },

  "third-q1": {
    id: "third-q1",
    type: "choice",
    tutorText: "Each friend got 1 out of 3 equal pieces. What fraction is that?",
    taskHeader: "What fraction did each friend get?",
    choices: [
      { label: "1/2", next: "third-q1-wrong" },
      { label: "1/4", next: "third-q1-wrong" },
      { label: "1/3", next: "third-q1-right", correct: true },
    ],
    sfx: "soft-bell",
  },

  "third-q1-wrong": {
    id: "third-q1-wrong",
    type: "narrate",
    tutorText: "Hmm, not quite. We split the bar into 3 pieces, so the bottom number is 3. Each friend got 1 piece, so the top is 1. What fraction is that?",
    next: "third-q1",
    sfx: "gentle-whoosh",
  },

  "third-q1-right": {
    id: "third-q1-right",
    type: "narrate",
    tutorText: "One-third — you've got it! Now Owl has an idea. What if we cut each of those thirds in half? Let's see what happens...",
    next: "double-slice-narrate",
    sfx: "sparkle",
  },

  "double-slice-narrate": {
    id: "double-slice-narrate",
    type: "narrate",
    tutorText: "Owl says, \"If we cut each of the 3 pieces in half, we'll have 6 tiny pieces total!\" Now the same granola bar is split into 6 equal bits instead of 3.",
    next: "show-sixths",
    sfx: "music-box",
  },

  "show-sixths": {
    id: "show-sixths",
    type: "show-fraction",
    tutorText: "Now there are 6 pieces total. Each friend's original third became 2 of the 6 little pieces. So each friend has two-sixths!",
    showFractionNum: 2,
    showFractionDen: 6,
    next: "equiv2-q1",
    sfx: "harp-gliss",
  },

  "equiv2-q1": {
    id: "equiv2-q1",
    type: "choice",
    tutorText: "Rabbit had 1 out of 3 pieces before. Now that same chunk is 2 out of 6 tiny pieces. Are one-third and two-sixths the same amount of granola bar?",
    taskHeader: "Does 1/3 = 2/6?",
    choices: [
      { label: "Yes, same amount!", next: "equiv2-q1-right", correct: true },
      { label: "No, different amounts", next: "equiv2-q1-wrong" },
    ],
    sfx: "soft-bell",
  },

  "equiv2-q1-wrong": {
    id: "equiv2-q1-wrong",
    type: "narrate",
    tutorText: "Think about it this way: Rabbit's piece didn't get bigger or smaller — we just cut it into smaller bits. 1 out of 3 and 2 out of 6 are the same chunk of granola! Let's try again.",
    next: "equiv2-q1",
    sfx: "gentle-whoosh",
  },

  "equiv2-q1-right": {
    id: "equiv2-q1-right",
    type: "narrate",
    tutorText: "That's right! One-third and two-sixths are equivalent fractions! The pieces are smaller, but there are more of them — same total amount. Fox wags his tail with excitement!",
    next: "equiv2-show",
    sfx: "chime",
  },

  "equiv2-show": {
    id: "equiv2-show",
    type: "show-fraction",
    tutorText: "One-third equals two-sixths. We found another pair of equivalent fractions! The secret: when you cut each piece in half, you double both the top and bottom numbers.",
    showFractionNum: 1,
    showFractionDen: 3,
    next: "pattern-q",
    sfx: "sparkle",
  },

  "pattern-q": {
    id: "pattern-q",
    type: "choice",
    tutorText: "Let's see if you spot the pattern! We learned that 1/2 = 2/4, and 1/3 = 2/6. What do you notice about equivalent fractions?",
    taskHeader: "What's the pattern?",
    choices: [
      { label: "The numbers always stay the same", next: "pattern-q-wrong" },
      { label: "Same amount, different-looking numbers", next: "pattern-q-right", correct: true },
      { label: "The fraction gets bigger", next: "pattern-q-wrong" },
    ],
    sfx: "soft-bell",
  },

  "pattern-q-wrong": {
    id: "pattern-q-wrong",
    type: "narrate",
    tutorText: "Not exactly. With equivalent fractions, the AMOUNT stays the same, but the numbers on top and bottom can look different. 1/2 and 2/4 are the same amount even though the numbers changed. Try again!",
    next: "pattern-q",
    sfx: "gentle-whoosh",
  },

  "pattern-q-right": {
    id: "pattern-q-right",
    type: "narrate",
    tutorText: "Exactly! Equivalent fractions show the same amount with different numbers. You're thinking like a math whiz!",
    next: "final-challenge-intro",
    sfx: "harp-gliss",
  },

  // --- Final challenge round ---

  "final-challenge-intro": {
    id: "final-challenge-intro",
    type: "narrate",
    tutorText: "The fire is getting low, so let's do one last round of sharing before everyone curls up to sleep! Beaver made two more s'mores for the group.",
    next: "final-distribute",
    sfx: "warm-pad",
  },

  "final-distribute": {
    id: "final-distribute",
    type: "distribute",
    tutorText: "Share these 2 s'mores equally among all 4 friends.",
    taskHeader: "Give 2 s'mores to 4 friends equally.",
    cookieCount: 2,
    characterCount: 4,
    expectedPerPerson: 1,
    next: "final-slice",
    sfx: "xylophone",
  },

  "final-slice": {
    id: "final-slice",
    type: "slice",
    tutorText: "Hmm, 2 s'mores for 4 friends — that's not enough whole ones for everyone! Let's cut each s'more in half so there are enough pieces.",
    taskHeader: "Slice each s'more in half.",
    cookieCount: 2,
    allowKnife: true,
    next: "final-dist-halves",
    sfx: "gentle-whoosh",
  },

  "final-dist-halves": {
    id: "final-dist-halves",
    type: "distribute-halves",
    tutorText: "Now we have 4 half-pieces! Give one half to each friend.",
    taskHeader: "Hand out the halves — 1 each.",
    cookieCount: 2,
    characterCount: 4,
    expectedPerPerson: 1,
    next: "final-fraction-show",
    sfx: "chime",
  },

  "final-fraction-show": {
    id: "final-fraction-show",
    type: "show-fraction",
    tutorText: "Each friend got one-half of a s'more! And we could also say each friend got 2 out of 4 pieces of the total s'more supply. One-half equals two-fourths — there it is again!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "final-q1",
    sfx: "sparkle",
  },

  "final-q1": {
    id: "final-q1",
    type: "choice",
    tutorText: "Last big question! Which of these is an equivalent fraction to 1/2?",
    taskHeader: "Which fraction equals 1/2?",
    choices: [
      { label: "1/4", next: "final-q1-wrong" },
      { label: "2/4", next: "final-q1-right", correct: true },
      { label: "3/4", next: "final-q1-wrong" },
    ],
    sfx: "soft-bell",
  },

  "final-q1-wrong": {
    id: "final-q1-wrong",
    type: "narrate",
    tutorText: "Close! Remember, when we cut each half into two pieces, 1 piece becomes 2 pieces and 2 total becomes 4 total. So 1/2 becomes... try again!",
    next: "final-q1",
    sfx: "gentle-whoosh",
  },

  "final-q1-right": {
    id: "final-q1-right",
    type: "narrate",
    tutorText: "Two-fourths! You remembered! Owl, Beaver, Rabbit, and Fox all cheer around the campfire!",
    next: "final-q2",
    sfx: "chime",
  },

  "final-q2": {
    id: "final-q2",
    type: "choice",
    tutorText: "One more! Which fraction is equivalent to 1/3?",
    taskHeader: "Which fraction equals 1/3?",
    choices: [
      { label: "2/6", next: "final-q2-right", correct: true },
      { label: "2/3", next: "final-q2-wrong" },
      { label: "1/6", next: "final-q2-wrong" },
    ],
    sfx: "soft-bell",
  },

  "final-q2-wrong": {
    id: "final-q2-wrong",
    type: "narrate",
    tutorText: "Hmm, think back to the granola bar. When we cut each third in half, 1 piece became 2 pieces and 3 total became 6 total. So 1/3 equals... let's try once more!",
    next: "final-q2",
    sfx: "gentle-whoosh",
  },

  "final-q2-right": {
    id: "final-q2-right",
    type: "narrate",
    tutorText: "Two-sixths! You're on fire — campfire, that is! You've found two pairs of equivalent fractions tonight!",
    next: "campfire-wrapup",
    sfx: "harp-gliss",
  },

  "campfire-wrapup": {
    id: "campfire-wrapup",
    type: "narrate",
    tutorText: "The embers glow softly. Owl hoots a little summary: \"Fractions can look different but mean the same thing. One-half is the same as two-fourths. One-third is the same as two-sixths. Those are equivalent fractions!\"",
    next: "goodnight",
    sfx: "music-box",
  },

  "goodnight": {
    id: "goodnight",
    type: "narrate",
    tutorText: "The four friends snuggle up by the warm campfire under a blanket of stars. You did an amazing job learning about equivalent fractions tonight! Sweet dreams, math explorer!",
    next: "end",
    sfx: "warm-pad",
  },
};
