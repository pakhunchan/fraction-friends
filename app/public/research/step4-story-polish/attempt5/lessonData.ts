// ============================================================
//  ATTEMPT 5 — SILLY COMEDIAN NARRATOR
//  Fraction lesson: 4÷2, 5÷2, 5÷4
//
//  Tutor emotion keys (for animated tutor face):
//    "neutral" | "excited" | "sneaky" | "shocked" | "sad" |
//    "smug"    | "chef-kiss" | "thinking" | "caught" | "hyped"
//
//  SFX keys (passed to useSoundEffects play()):
//    "pop" | "boing" | "slide-whistle" | "rimshot" | "sad-trombone" |
//    "raspberry" | "giggle" | "ding" | "fanfare" | "slice" | "woosh"
// ============================================================

export type StepType =
  | "narrate"
  | "choice"
  | "distribute"
  | "slice"
  | "distribute-halves"
  | "show-number"
  | "show-fraction";

export type TutorEmotion =
  | "neutral"
  | "excited"
  | "sneaky"
  | "shocked"
  | "sad"
  | "smug"
  | "chef-kiss"
  | "thinking"
  | "caught"
  | "hyped";

export interface Choice {
  label: string;
  next: string;
  correct?: boolean;
}

export interface LessonStep {
  id: string;
  type: StepType;
  tutorText?: string;
  tutorEmotion?: TutorEmotion;
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

// ─── RUNNING GAG STATE ───────────────────────────────────────────────────────
// The tutor "accidentally" eats cookies THREE times across the lesson.
// These steps reference that gag by id so the renderer can show a bite animation.
// Gag appearances: "gag-eat-1" (Phase 1), "gag-eat-2" (Phase 2), "gag-eat-3" (Phase 3)

export const lessonSteps: Record<string, LessonStep> = {

  // ══════════════════════════════════════════════════════════════════════════
  //  INTRO  —  Tutor introduces himself and immediately breaks the 4th wall
  // ══════════════════════════════════════════════════════════════════════════

  "intro-hello": {
    id: "intro-hello",
    type: "narrate",
    tutorEmotion: "excited",
    tutorText:
      "HELLO HELLO HELLO! Welcome to Math With Me — your FAVORITE math show! " +
      "(It's your only math show, but still.) " +
      "I'm your host, and between you and me? I already know all the answers. " +
      "Don't worry, I'll let you figure them out yourself. Mostly.",
    next: "intro-topic",
    sfx: "giggle",
  },

  "intro-topic": {
    id: "intro-topic",
    type: "narrate",
    tutorEmotion: "sneaky",
    tutorText:
      "Today's episode: FRACTIONS. Ooooh, spooky word, right? " +
      "But here's the secret — fractions are just what happens when you try to share cookies. " +
      "And I LOVE cookies. Ahem. For, uh, EDUCATIONAL purposes only.",
    next: "start",
    sfx: "slide-whistle",
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  PHASE 1 — WARM-UP: 4 cookies ÷ 2 friends
  // ══════════════════════════════════════════════════════════════════════════

  "start": {
    id: "start",
    type: "distribute",
    tutorEmotion: "excited",
    taskHeader: "Share 4 cookies between 2 friends.",
    tutorText:
      "Okay, Round One! 4 cookies. 2 hungry friends. This one's nice and easy. " +
      "I call it the 'warm-up' but I've also eaten 12 cookies today so maybe I'M warming up. Anyway — drag those cookies!",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "gag-eat-1",
    sfx: "pop",
  },

  // RUNNING GAG #1: tutor "accidentally" ate a cookie
  "gag-eat-1": {
    id: "gag-eat-1",
    type: "narrate",
    tutorEmotion: "caught",
    tutorText:
      "...Oh. OH. You weren't supposed to see that. " +
      "I was just... inspecting the cookie. Quality control. Very official. " +
      "Luckily we already distributed them before my 'inspection,' so we're good!",
    next: "result-4-2",
    sfx: "rimshot",
  },

  "result-4-2": {
    id: "result-4-2",
    type: "show-number",
    tutorEmotion: "smug",
    tutorText:
      "BOOM! 4 cookies ÷ 2 friends = 2 cookies each. Perfect! Even splits! " +
      "No leftover cookies! No drama! No tears! This is the GOOD timeline.",
    showNumber: "2",
    next: "phase1-choice",
    sfx: "ding",
  },

  "phase1-choice": {
    id: "phase1-choice",
    type: "choice",
    tutorEmotion: "smug",
    tutorText: "Quick check! What did we just figure out? Pick the right answer and I'll be VERY impressed.",
    choices: [
      { label: "4 ÷ 2 = 2 (each person gets 2 cookies)", next: "phase1-correct", correct: true },
      { label: "4 ÷ 2 = 42 (put the digits next to each other)", next: "phase1-wrong-42" },
      { label: "I ate all 4 cookies myself", next: "phase1-wrong-ate" },
    ],
  },

  "phase1-wrong-42": {
    id: "phase1-wrong-42",
    type: "narrate",
    tutorEmotion: "shocked",
    tutorText:
      "FORTY-TWO COOKIES?! Each?! That's not sharing, that's a BAKERY! " +
      "Nobody has a plate that big. Try again — we had 4 cookies and 2 people. " +
      "Each person got... count those plates!",
    next: "phase1-choice",
    sfx: "boing",
  },

  "phase1-wrong-ate": {
    id: "phase1-wrong-ate",
    type: "narrate",
    tutorEmotion: "sneaky",
    tutorText:
      "Okay, I respect that energy. DEEPLY. " +
      "But technically that would be a crime called 'cookie theft,' and I'm a LICENSED MATH TUTOR, " +
      "not a getaway driver. Let's look at those plates and try again.",
    next: "phase1-choice",
    sfx: "giggle",
  },

  "phase1-correct": {
    id: "phase1-correct",
    type: "narrate",
    tutorEmotion: "chef-kiss",
    tutorText:
      "YES! 4 ÷ 2 = 2. You got it! Chef's kiss! " +
      "Round One is in the bag! Round Two is... significantly more chaotic. " +
      "You've been warned.",
    next: "intro-5-2",
    sfx: "fanfare",
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  PHASE 2 — THE PROBLEM: 5 cookies ÷ 2 friends
  // ══════════════════════════════════════════════════════════════════════════

  "intro-5-2": {
    id: "intro-5-2",
    type: "narrate",
    tutorEmotion: "sneaky",
    tutorText:
      "Alright. Same setup. Two friends. EXCEPT — plot twist — " +
      "now we have FIVE cookies. Five. An ODD number. " +
      "And no, we can't just eat the extra one ourselves. " +
      "...I already tried that last episode.",
    next: "distribute-5-2",
    sfx: "slide-whistle",
  },

  "distribute-5-2": {
    id: "distribute-5-2",
    type: "distribute",
    tutorEmotion: "thinking",
    taskHeader: "Share 5 cookies — give each friend as many whole ones as you can!",
    tutorText:
      "5 cookies, 2 friends. Give everyone as many WHOLE cookies as you can. " +
      "Someone's gonna need a bigger plate! (Or a smaller friend.)",
    cookieCount: 5,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "leftover-observe",
    sfx: "pop",
  },

  "leftover-observe": {
    id: "leftover-observe",
    type: "narrate",
    tutorEmotion: "shocked",
    tutorText:
      "DUN DUN DUUUUN! There's one cookie left over! " +
      "Both friends are staring at it. It's staring back. " +
      "The tension is UNBEARABLE. What do we do?!",
    next: "leftover",
    sfx: "sad-trombone",
  },

  "leftover": {
    id: "leftover",
    type: "choice",
    tutorEmotion: "thinking",
    tutorText:
      "One lonely cookie, two hungry friends. What should we do with that last cookie?",
    choices: [
      { label: "Cut it in half and share it!", next: "slice-cookie", correct: true },
      {
        label: "Give it all to Friend 1 (Friend 2 gets nothing)",
        next: "wrong-unfair",
      },
      { label: "Launch it into the sun", next: "wrong-sun" },
      { label: "Name it Gerald and adopt it as a pet", next: "wrong-gerald" },
    ],
  },

  "wrong-unfair": {
    id: "wrong-unfair",
    type: "narrate",
    tutorEmotion: "shocked",
    tutorText:
      "Give FIVE cookies to Friend 1 and ZERO to Friend 2?! " +
      "Friend 2 is gonna turn into a COOKIE MONSTER out of jealousy! " +
      "We need EQUAL sharing here. Try again — can we do something to that leftover cookie?",
    next: "leftover",
    sfx: "sad-trombone",
  },

  "wrong-sun": {
    id: "wrong-sun",
    type: "narrate",
    tutorEmotion: "hyped",
    tutorText:
      "Launch it into the SUN?! Bold. VERY bold. " +
      "Scientifically speaking it would take approximately 70 days at rocket speed " +
      "and the cookie would burn up immediately. Also: our friends are still hungry. " +
      "Let's try a different plan.",
    next: "leftover",
    sfx: "slide-whistle",
  },

  "wrong-gerald": {
    id: "wrong-gerald",
    type: "narrate",
    tutorEmotion: "hyped",
    tutorText:
      "Gerald the Cookie. I... I actually love that. " +
      "Gerald deserves a good home. Gerald also deserves to be EATEN " +
      "because Gerald is a cookie and that's kind of the whole deal. " +
      "Can we split Gerald in half for our friends? Please?",
    next: "leftover",
    sfx: "giggle",
  },

  "slice-cookie": {
    id: "slice-cookie",
    type: "narrate",
    tutorEmotion: "excited",
    tutorText:
      "CUT IT IN HALF! Yes! GREAT thinking! " +
      "I have a knife right here. Spoiler: I've been holding this knife the whole time. " +
      "Dramatic pause. Okay, tap that cookie and let's split it!",
    next: "do-slice",
    sfx: "giggle",
  },

  "do-slice": {
    id: "do-slice",
    type: "slice",
    tutorEmotion: "hyped",
    tutorText: "TAP THE COOKIE! Right down the middle! Chop chop! (Cookie pun. You're welcome.)",
    next: "post-slice",
    sfx: "slice",
  },

  "post-slice": {
    id: "post-slice",
    type: "narrate",
    tutorEmotion: "chef-kiss",
    tutorText:
      "SLICED! Beautiful! Two perfect halves! " +
      "Each half is exactly the same size — if one is bigger than the other, " +
      "I will personally come back and fix it. Now let's hand them out!",
    next: "distribute-halves",
    sfx: "rimshot",
  },

  "distribute-halves": {
    id: "distribute-halves",
    type: "distribute-halves",
    tutorEmotion: "excited",
    tutorText: "Drag each half to a friend! One half each! Don't mix them up or the cookie will be MAD.",
    characterCount: 2,
    next: "gag-eat-2",
    sfx: "woosh",
  },

  // RUNNING GAG #2: tutor pretends to inspect a half
  "gag-eat-2": {
    id: "gag-eat-2",
    type: "narrate",
    tutorEmotion: "caught",
    tutorText:
      "Hmm. Just double-checking the halves are equal... yep. Equal. " +
      "Wait, how did a bite mark get on this one? " +
      "I'm investigating. It was NOT me. " +
      "...Okay it was me. Moving on.",
    next: "how-many-each",
    sfx: "rimshot",
  },

  "how-many-each": {
    id: "how-many-each",
    type: "choice",
    tutorEmotion: "thinking",
    tutorText:
      "Alright brainiac! Each friend got 2 whole cookies PLUS one half. " +
      "How many cookies is that in total? (Between us, I know. But it's your turn!)",
    choices: [
      { label: "2 and a half cookies", next: "correct-two-half", correct: true },
      { label: "2 cookies (ignore the half, it's basically nothing)", next: "wrong-ignore-half" },
      { label: "3 cookies (the half rounds up because vibes)", next: "wrong-round-up" },
      { label: "∞ cookies (wishes count)", next: "wrong-infinity" },
    ],
  },

  "wrong-ignore-half": {
    id: "wrong-ignore-half",
    type: "narrate",
    tutorEmotion: "shocked",
    tutorText:
      "IGNORE THE HALF?! That half worked VERY hard to get here. " +
      "We sliced a cookie in two! We can't just ghost it like an old text message. " +
      "Count the halves! They count!",
    next: "how-many-each",
    sfx: "sad-trombone",
  },

  "wrong-round-up": {
    id: "wrong-round-up",
    type: "narrate",
    tutorEmotion: "sneaky",
    tutorText:
      "Ohhh, 'rounding up because vibes' is my FAVORITE math strategy. " +
      "Unfortunately it is not a real math strategy. " +
      "The half is exactly half — not a whole cookie. So the answer is 2... PLUS something.",
    next: "how-many-each",
    sfx: "boing",
  },

  "wrong-infinity": {
    id: "wrong-infinity",
    type: "narrate",
    tutorEmotion: "hyped",
    tutorText:
      "WISHES COUNT! Finally someone gets me! " +
      "Sadly the friends' plates have a finite number of cookies on them. " +
      "Look at the plates. Count what you see. It's 2 whole ones and a half of one.",
    next: "how-many-each",
    sfx: "giggle",
  },

  "correct-two-half": {
    id: "correct-two-half",
    type: "show-number",
    tutorEmotion: "hyped",
    tutorText:
      "TWO AND A HALF! CORRECT! You absolute GENIUS! " +
      "Each friend got 2 whole cookies plus one half of a cookie. " +
      "Now how do we WRITE that down? Hmm...",
    showNumber: "2½",
    next: "explain-whole",
    sfx: "ding",
  },

  // ── Bridge to symbolic notation ──

  "explain-whole": {
    id: "explain-whole",
    type: "narrate",
    tutorEmotion: "smug",
    tutorText:
      "The 2 whole cookies? Easy. We write the number 2. Revolutionary, I know. " +
      "You're welcome. But THAT HALF... that's where it gets INTERESTING.",
    next: "but-half",
  },

  "but-half": {
    id: "but-half",
    type: "narrate",
    tutorEmotion: "thinking",
    tutorText:
      "How do you write 'half' as a number? You can't just write 0.5 in kindergarten — " +
      "that's cheating. And you can't draw a little cookie with a line through it. " +
      "Trust me, I tried. Mathematicians were NOT impressed.",
    next: "know-fraction",
  },

  "know-fraction": {
    id: "know-fraction",
    type: "choice",
    tutorEmotion: "sneaky",
    tutorText:
      "Do you already know how to write 'one half' as a fraction number? " +
      "(And no, the answer is not 'very carefully.')",
    choices: [
      { label: "I think I know!", next: "show-half-fraction" },
      { label: "Nope, show me!", next: "show-half-fraction" },
      { label: "Ask the sliced cookie — it's literally shaped like a fraction", next: "ask-cookie-response" },
    ],
  },

  "ask-cookie-response": {
    id: "ask-cookie-response",
    type: "narrate",
    tutorEmotion: "hyped",
    tutorText:
      "That's... actually genius?? The cookie IS shaped like a fraction! " +
      "Top part, line in the middle, bottom part. " +
      "I never thought of it that way. You just BLEW MY MIND. " +
      "Also — yes — let me show you exactly what that looks like as a number!",
    next: "show-half-fraction",
    sfx: "giggle",
  },

  "show-half-fraction": {
    id: "show-half-fraction",
    type: "show-fraction",
    tutorEmotion: "chef-kiss",
    tutorText:
      "BEHOLD! The fraction one-half! The 1 on top means 'we have 1 piece.' " +
      "The 2 on the bottom means 'it takes 2 pieces to make a whole.' " +
      "Top number = pieces you have. Bottom number = how many make a whole. Memorize that!",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "fraction-name",
    sfx: "ding",
  },

  "fraction-name": {
    id: "fraction-name",
    type: "choice",
    tutorEmotion: "smug",
    tutorText:
      "That stacked number — one on top of two — has a SPECIAL name. " +
      "Drum roll please... it's called a FRACTION! Have you heard that word before?",
    choices: [
      { label: "Yes! I know fractions!", next: "fraction-explain" },
      { label: "That's brand new to me!", next: "fraction-explain" },
      { label: "I thought 'fraction' was a type of dinosaur", next: "fraction-wrong-dino" },
    ],
  },

  "fraction-wrong-dino": {
    id: "fraction-wrong-dino",
    type: "narrate",
    tutorEmotion: "hyped",
    tutorText:
      "A FRACTION-ASAURUS! That would be a GREAT dinosaur. " +
      "It would eat cookies and be very good at math. " +
      "But no — a fraction is a number that shows parts of a whole thing. " +
      "No dinosaurs involved. Sadly.",
    next: "fraction-explain",
    sfx: "giggle",
  },

  "fraction-explain": {
    id: "fraction-explain",
    type: "narrate",
    tutorEmotion: "excited",
    tutorText:
      "A fraction lets us write parts of things! " +
      "Whole numbers (like 1, 2, 3) count WHOLE cookies. " +
      "Fractions (like one-half) count PIECES of cookies. " +
      "Together they make our final answer: 2 and one-half!",
    next: "each-got",
    sfx: "pop",
  },

  "each-got": {
    id: "each-got",
    type: "show-fraction",
    tutorEmotion: "chef-kiss",
    tutorText:
      "So we write it like THIS! A big 2 for the whole cookies, " +
      "and one-half beside it for that sliced piece. " +
      "2 and one-half. Math is BEAUTIFUL. I'm not crying, you're crying.",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "bridge-to-phase3",
    sfx: "fanfare",
  },

  "bridge-to-phase3": {
    id: "bridge-to-phase3",
    type: "narrate",
    tutorEmotion: "sneaky",
    tutorText:
      "INCREDIBLE! You handled 2 friends like a champ. " +
      "Now here's the thing... I've invited MORE friends to the cookie party. " +
      "Four friends. For five cookies. " +
      "I may have miscalculated the invitations. Slightly.",
    next: "intro-5-4",
    sfx: "slide-whistle",
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  PHASE 3 — THE BIG CHALLENGE: 5 cookies ÷ 4 friends
  // ══════════════════════════════════════════════════════════════════════════

  "intro-5-4": {
    id: "intro-5-4",
    type: "narrate",
    tutorEmotion: "excited",
    tutorText:
      "FOUR friends. FIVE cookies. A knife. A dream. " +
      "This is the FINAL BOSS of today's lesson! " +
      "Are you ready? Don't say no. We're doing it anyway.",
    next: "distribute-5-4",
    sfx: "giggle",
  },

  "distribute-5-4": {
    id: "distribute-5-4",
    type: "distribute",
    tutorEmotion: "thinking",
    taskHeader: "Share 5 cookies between 4 friends.",
    tutorText:
      "5 cookies, 4 friends. You've got the knife — use it! " +
      "Give everyone the same amount. No favorites. Not even that one friend " +
      "who always shares their snacks. Everyone gets the same!",
    cookieCount: 5,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "gag-eat-3",
    sfx: "pop",
  },

  // RUNNING GAG #3: tutor has definitely been eating cookies again
  "gag-eat-3": {
    id: "gag-eat-3",
    type: "narrate",
    tutorEmotion: "caught",
    tutorText:
      "Wait — why do I only count 4 cookies? There should be— " +
      "Oh no. OH NO. " +
      "I did it again didn't I. " +
      "...Don't tell anyone. I'm logging this as 'quality assurance.' " +
      "GREAT news: you distributed them before my 'audit,' so everyone's still served!",
    next: "result-5-4-check",
    sfx: "rimshot",
  },

  "result-5-4-check": {
    id: "result-5-4-check",
    type: "choice",
    tutorEmotion: "thinking",
    tutorText:
      "Okay! Everyone has their cookies and cookie pieces. " +
      "How much did each friend get? Think carefully — I'll wait. " +
      "(I'm not waiting, answer quickly, I'm very impatient.)",
    choices: [
      { label: "1 and a quarter cookies (1¼)", next: "correct-one-quarter", correct: true },
      { label: "1 whole cookie (ignore the quarter-pieces)", next: "wrong-ignore-quarter" },
      { label: "2 cookies (seems like a nice round number)", next: "wrong-two-54" },
      { label: "5 cookies each (just make more cookies)", next: "wrong-five-each" },
    ],
  },

  "wrong-ignore-quarter": {
    id: "wrong-ignore-quarter",
    type: "narrate",
    tutorEmotion: "shocked",
    tutorText:
      "Ignore the quarter-pieces?! AGAIN with the ignoring! " +
      "Those little quarter cookies are FEELINGS and they MATTER. " +
      "Each friend got 1 whole cookie PLUS a little piece. What's the whole amount?",
    next: "result-5-4-check",
    sfx: "sad-trombone",
  },

  "wrong-two-54": {
    id: "wrong-two-54",
    type: "narrate",
    tutorEmotion: "sneaky",
    tutorText:
      "Ooh, 2 cookies each. Bold. Confident. Incorrect. " +
      "If each of 4 friends got 2 cookies, that'd be 8 cookies total. " +
      "We only had 5. Where are the other 3 coming from? " +
      "Look at the actual plates and count!",
    next: "result-5-4-check",
    sfx: "boing",
  },

  "wrong-five-each": {
    id: "wrong-five-each",
    type: "narrate",
    tutorEmotion: "hyped",
    tutorText:
      "JUST MAKE MORE COOKIES! I love the energy! " +
      "But we are working with what we have, and what we have is 5 cookies. " +
      "We can't generate cookies from thin air. " +
      "(...I've tried. The oven just makes more cookies. Delicious but off-topic.)",
    next: "result-5-4-check",
    sfx: "giggle",
  },

  "correct-one-quarter": {
    id: "correct-one-quarter",
    type: "show-fraction",
    tutorEmotion: "hyped",
    tutorText:
      "ONE AND A QUARTER! You absolute LEGEND! " +
      "Each friend got 1 whole cookie, and then we sliced that last cookie into 4 equal pieces, " +
      "so each friend got one of those pieces too. One-quarter! " +
      "We write it like THIS:",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 4,
    next: "explain-quarter",
    sfx: "ding",
  },

  "explain-quarter": {
    id: "explain-quarter",
    type: "narrate",
    tutorEmotion: "smug",
    tutorText:
      "See that fraction? The 1 on top: we have 1 piece. " +
      "The 4 on the bottom: it takes 4 pieces to make a whole cookie. " +
      "So 1 out of 4 = one-quarter! Same recipe as before, different numbers. " +
      "You're basically a mathematician now. Congratulations.",
    next: "big-idea",
    sfx: "pop",
  },

  "big-idea": {
    id: "big-idea",
    type: "choice",
    tutorEmotion: "excited",
    tutorText:
      "Quick! What's the BIG IDEA we learned today? " +
      "What are fractions actually FOR?",
    choices: [
      {
        label: "Fractions describe pieces when we can't share evenly",
        next: "big-idea-correct",
        correct: true,
      },
      {
        label: "Fractions are the noise cookies make when they're sad",
        next: "big-idea-wrong-noise",
      },
      {
        label: "Fractions are only for adults who drink coffee",
        next: "big-idea-wrong-adults",
      },
    ],
  },

  "big-idea-wrong-noise": {
    id: "big-idea-wrong-noise",
    type: "narrate",
    tutorEmotion: "hyped",
    tutorText:
      "The noise cookies make when they're SAD?! " +
      "I'm writing that down for a comedy special later. " +
      "But actually: fractions help us write down 'part of something' as a number. " +
      "Try again!",
    next: "big-idea",
    sfx: "raspberry",
  },

  "big-idea-wrong-adults": {
    id: "big-idea-wrong-adults",
    type: "narrate",
    tutorEmotion: "shocked",
    tutorText:
      "Only for ADULTS?! You just used fractions! Right now! Today! " +
      "You're literally holding a fraction in your brain right now. " +
      "Kids can absolutely do fractions. YOU are proof. Try again!",
    next: "big-idea",
    sfx: "boing",
  },

  "big-idea-correct": {
    id: "big-idea-correct",
    type: "narrate",
    tutorEmotion: "chef-kiss",
    tutorText:
      "PERFECT! Fractions help us write 'part of something' as a number! " +
      "When cookies don't split evenly, we cut them into equal pieces — " +
      "and fractions tell us exactly how many pieces we got. " +
      "You NAILED it.",
    next: "lesson-complete",
    sfx: "fanfare",
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  ENDING — Finale with full comedy send-off
  // ══════════════════════════════════════════════════════════════════════════

  "lesson-complete": {
    id: "lesson-complete",
    type: "narrate",
    tutorEmotion: "hyped",
    tutorText:
      "THAT'S A WRAP! You just learned fractions by sharing cookies! " +
      "You figured out 4÷2, then 5÷2 (with a half!), then 5÷4 (with a quarter!). " +
      "That's THREE math problems. In ONE lesson. While I was eating cookies. " +
      "You did most of the work and I'm very proud of both of us.",
    next: "done",
    sfx: "fanfare",
  },

  "done": {
    id: "done",
    type: "narrate",
    tutorEmotion: "chef-kiss",
    tutorText:
      "You are officially a COOKIE-SHARING, FRACTION-KNOWING SUPERSTAR! " +
      "Go forth and split things fairly. " +
      "And if anyone ever gives you 5 cookies for 4 people — " +
      "YOU know exactly what to do. " +
      "Unlike me. I would just eat them all. Goodbye!!",
    next: "end",
    sfx: "fanfare",
  },
};

// ─── Step order (for progress tracking) ──────────────────────────────────────
// Lists the canonical "happy path" sequence (wrong-answer branches rejoin the main path).
export const stepOrder: string[] = [
  "intro-hello",
  "intro-topic",
  // Phase 1
  "start",
  "gag-eat-1",
  "result-4-2",
  "phase1-choice",
  "phase1-correct",
  // Phase 2
  "intro-5-2",
  "distribute-5-2",
  "leftover-observe",
  "leftover",
  "slice-cookie",
  "do-slice",
  "post-slice",
  "distribute-halves",
  "gag-eat-2",
  "how-many-each",
  "correct-two-half",
  "explain-whole",
  "but-half",
  "know-fraction",
  "show-half-fraction",
  "fraction-name",
  "fraction-explain",
  "each-got",
  "bridge-to-phase3",
  // Phase 3
  "intro-5-4",
  "distribute-5-4",
  "gag-eat-3",
  "result-5-4-check",
  "correct-one-quarter",
  "explain-quarter",
  "big-idea",
  "big-idea-correct",
  // Finale
  "lesson-complete",
  "done",
];
