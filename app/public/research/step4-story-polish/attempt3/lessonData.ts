export type StepType =
  | "narrate"           // Tutor speaks, continue button
  | "choice"            // Multiple choice buttons
  | "distribute"        // Kid distributes cookies to characters
  | "slice"             // Kid clicks cookie to slice
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
  // PHASE 1: THE OPENING — 4 cookies, 2 people (the warm-up)
  // ============================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText: "Welcome... to the FRACTION ZONE! I'm your host, and TODAY — you are going to become a certified, gold-medal, hall-of-fame FRACTION CHAMPION! Are you ready?! LET'S PLAY!",
    next: "warmup-intro",
    sfx: "horn-fanfare",
  },

  "warmup-intro": {
    id: "warmup-intro",
    type: "narrate",
    tutorText: "First up: our WARM-UP ROUND! The crowd is on their feet! We've got 4 delicious cookies and 2 very hungry friends. Your mission: give everyone the EXACT SAME amount. Think you can do it?!",
    next: "distribute-4-2",
    sfx: "drum-roll",
  },

  "distribute-4-2": {
    id: "distribute-4-2",
    type: "distribute",
    taskHeader: "Share 4 cookies between 2 friends!",
    tutorText: "Drag those cookies onto the plates! Give each friend the same number. The audience is WATCHING!",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "result-4-2-sting",
    sfx: "whoosh",
  },

  "result-4-2-sting": {
    id: "result-4-2-sting",
    type: "narrate",
    tutorText: "Ohhh here it comes... the moment of TRUTH! The judges are checking the plates... checking... checking...",
    next: "result-4-2",
    sfx: "drum-roll",
  },

  "result-4-2": {
    id: "result-4-2",
    type: "show-number",
    tutorText: "DING DING DING! That is CORRECT! Four cookies split between two people — that's TWO cookies each! FLAWLESS execution! The crowd goes WILD!",
    showNumber: "2",
    next: "result-4-2-quiz",
    sfx: "winner-bell",
  },

  "result-4-2-quiz": {
    id: "result-4-2-quiz",
    type: "choice",
    tutorText: "BONUS QUESTION for extra style points! If you have 4 cookies and 2 people, you're doing what kind of math?",
    choices: [
      { label: "Sharing equally — division!", next: "bonus-correct", correct: true },
      { label: "Cookie archaeology", next: "bonus-wrong-archaeology" },
      { label: "Advanced cookie sculpture", next: "bonus-wrong-sculpture" },
    ],
  },

  "bonus-wrong-archaeology": {
    id: "bonus-wrong-archaeology",
    type: "narrate",
    tutorText: "BZZZT! Oh no no no! Cookie archaeology is a REAL field of study, but not what we're doing here! We're sharing! That's DIVISION! Let's try again!",
    next: "result-4-2-quiz",
    sfx: "buzzer",
  },

  "bonus-wrong-sculpture": {
    id: "bonus-wrong-sculpture",
    type: "narrate",
    tutorText: "BZZZT! I love the creativity — truly, a visionary! But today we're sharing equally. That's DIVISION! Back to the podium!",
    next: "result-4-2-quiz",
    sfx: "buzzer",
  },

  "bonus-correct": {
    id: "bonus-correct",
    type: "narrate",
    tutorText: "INCREDIBLE! Yes! Sharing equally IS division! 4 divided by 2 equals 2! You are ALREADY playing like a champion. But wait... the game is about to get SPICY.",
    next: "transition-to-phase2",
    sfx: "applause",
  },

  // ============================================================
  // PHASE 2: THE TWIST — 5 cookies, 2 people (remainder drama!)
  // ============================================================

  "transition-to-phase2": {
    id: "transition-to-phase2",
    type: "narrate",
    tutorText: "Alright contestants, it's time for ROUND TWO — the REMAINDER ROUND! This is where champions are MADE. Are you strapped in? Because things are about to get INTERESTING!",
    next: "distribute-5-2",
    sfx: "drum-roll",
  },

  "distribute-5-2": {
    id: "distribute-5-2",
    type: "distribute",
    taskHeader: "Share 5 cookies between 2 friends!",
    tutorText: "Five cookies! Two hungry friends! Give everyone as many WHOLE cookies as you can — equally! GO GO GO!",
    cookieCount: 5,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "leftover-sting",
    sfx: "whoosh",
  },

  "leftover-sting": {
    id: "leftover-sting",
    type: "narrate",
    tutorText: "Hold on... HOLD ON! Something's happening! There's a cookie left over! One lonely cookie sitting on the table! What do we do?! The studio audience gasps! This changes EVERYTHING!",
    next: "leftover-choice",
    sfx: "drum-roll",
  },

  "leftover-choice": {
    id: "leftover-choice",
    type: "choice",
    tutorText: "One cookie remains! Our friends each got 2, but there's still one more! What should we do with the leftover cookie?",
    choices: [
      { label: "Cut it in half and share it!", next: "leftover-correct", correct: true },
      { label: "Launch it into outer space", next: "leftover-wrong-space" },
      { label: "Train it to be a guard cookie", next: "leftover-wrong-guard" },
      { label: "Give it to the judges", next: "leftover-wrong-judges" },
    ],
  },

  "leftover-wrong-space": {
    id: "leftover-wrong-space",
    type: "narrate",
    tutorText: "BZZZT! A space cookie! Honestly, a BOLD strategy! But our friends are hungry RIGHT NOW, not in orbit. Let's think closer to home. What could we do to share it?",
    next: "leftover-choice",
    sfx: "buzzer",
  },

  "leftover-wrong-guard": {
    id: "leftover-wrong-guard",
    type: "narrate",
    tutorText: "BZZZT! A guard cookie! I have so many questions about its training regimen! But our friends need a snack. Can we find a way to share that cookie instead?",
    next: "leftover-choice",
    sfx: "buzzer",
  },

  "leftover-wrong-judges": {
    id: "leftover-wrong-judges",
    type: "narrate",
    tutorText: "BZZZT! Oh, the judges would LOVE that — they're very hungry! But our friends here need it more. What's a fair way to split that one cookie between two people?",
    next: "leftover-choice",
    sfx: "buzzer",
  },

  "leftover-correct": {
    id: "leftover-correct",
    type: "narrate",
    tutorText: "YESSS! Cut it in HALF! Brilliant! Clean! Fair! MATHEMATICALLY SOUND! The crowd is on their feet! Grab the knife — let's make this happen!",
    next: "do-slice",
    sfx: "winner-bell",
  },

  "do-slice": {
    id: "do-slice",
    type: "slice",
    tutorText: "The tension is ELECTRIC! Tap the cookie to slice it right down the middle! One swift cut — make it DRAMATIC!",
    next: "slice-reaction",
    sfx: "whoosh",
  },

  "slice-reaction": {
    id: "slice-reaction",
    type: "narrate",
    tutorText: "SLICE! Did you HEAR that?! Perfect cut! Right down the middle! Two equal halves! The studio erupts! That is TEXTBOOK cookie division!",
    next: "distribute-halves",
    sfx: "applause",
  },

  "distribute-halves": {
    id: "distribute-halves",
    type: "distribute-halves",
    tutorText: "Now give each friend their half! One half to the left, one half to the right! SHARE THE WEALTH!",
    characterCount: 2,
    next: "how-many-each",
    sfx: "whoosh",
  },

  "how-many-each": {
    id: "how-many-each",
    type: "choice",
    tutorText: "Everyone's been served! The plates are full! Here's your MILLION-POINT QUESTION: how many cookies did EACH person get?",
    choices: [
      { label: "Two and a half", next: "how-many-correct", correct: true },
      { label: "Just two", next: "how-many-wrong-two" },
      { label: "One thousand and a half", next: "how-many-wrong-thousand" },
      { label: "A cookie and a dream", next: "how-many-wrong-dream" },
    ],
  },

  "how-many-wrong-two": {
    id: "how-many-wrong-two",
    type: "narrate",
    tutorText: "BZZZT! Ohhh so close! Two whole cookies — yes! But don't forget that half we just sliced and handed out! Look at those plates again — there's a little extra piece!",
    next: "how-many-each",
    sfx: "buzzer",
  },

  "how-many-wrong-thousand": {
    id: "how-many-wrong-thousand",
    type: "narrate",
    tutorText: "BZZZT! One thousand and a half! Haha, I WISH! That would be the greatest cookie party in human history! Count the cookies on the plate — two whole ones plus something smaller!",
    next: "how-many-each",
    sfx: "buzzer",
  },

  "how-many-wrong-dream": {
    id: "how-many-wrong-dream",
    type: "narrate",
    tutorText: "BZZZT! A cookie and a dream! That's poetry! That's art! But for MATH purposes, look at the actual plates. Two whole cookies... and one carefully sliced half!",
    next: "how-many-each",
    sfx: "buzzer",
  },

  "how-many-correct": {
    id: "how-many-correct",
    type: "show-number",
    tutorText: "TWO AND A HALF! CORRECT! THE CROWD GOES ABSOLUTELY WILD! That is EXACTLY right! Two whole cookies PLUS one half cookie equals... two and a half! MAGNIFICENT!",
    showNumber: "2½",
    next: "bridge-to-fractions",
    sfx: "winner-bell",
  },

  // ============================================================
  // PHASE 3: THE FRACTION REVEAL — writing it symbolically
  // ============================================================

  "bridge-to-fractions": {
    id: "bridge-to-fractions",
    type: "narrate",
    tutorText: "Now here's where we level up! Writing 2 whole cookies is EASY — you just write the number 2. But how do we write that HALF? Mathematicians have a special secret weapon for exactly this moment!",
    next: "fraction-quiz",
    sfx: "countdown-tick",
  },

  "fraction-quiz": {
    id: "fraction-quiz",
    type: "choice",
    tutorText: "Quick-fire round! Do you know how mathematicians write one half as a number?",
    choices: [
      { label: "I think so — show me!", next: "show-half-fraction" },
      { label: "No idea — teach me!", next: "show-half-fraction" },
      { label: "I'll ask my pet goldfish", next: "fraction-quiz-wrong-fish" },
    ],
  },

  "fraction-quiz-wrong-fish": {
    id: "fraction-quiz-wrong-fish",
    type: "narrate",
    tutorText: "BZZZT! I consulted a goldfish once. It stared at me for nine seconds and swam away. Unhelpful! I'll show you instead — this is going to BLOW your mind!",
    next: "show-half-fraction",
    sfx: "buzzer",
  },

  "show-half-fraction": {
    id: "show-half-fraction",
    type: "show-fraction",
    tutorText: "Ladies and gentlemen — the FRACTION! One number on TOP, a line in the MIDDLE, one number on the BOTTOM! This magical symbol says: one part out of two equal parts! It's called ONE HALF!",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "fraction-name-quiz",
    sfx: "sparkle",
  },

  "fraction-name-quiz": {
    id: "fraction-name-quiz",
    type: "choice",
    tutorText: "That stacked number has a special name — a name used by mathematicians all around the WORLD! What is it called?",
    choices: [
      { label: "A fraction!", next: "fraction-name-correct", correct: true },
      { label: "A stack number", next: "fraction-name-wrong-stack" },
      { label: "A double-decker digit", next: "fraction-name-wrong-decker" },
    ],
  },

  "fraction-name-wrong-stack": {
    id: "fraction-name-wrong-stack",
    type: "narrate",
    tutorText: "BZZZT! Stack number! I genuinely love that name and I'm going to use it at home. But officially — in the world of math — it's called a FRACTION! Try again!",
    next: "fraction-name-quiz",
    sfx: "buzzer",
  },

  "fraction-name-wrong-decker": {
    id: "fraction-name-wrong-decker",
    type: "narrate",
    tutorText: "BZZZT! Double-decker digit! Spectacular! Mathematical poetry! But the actual name is FRACTION. Say it with me — FRAC-TION! Now choose it!",
    next: "fraction-name-quiz",
    sfx: "buzzer",
  },

  "fraction-name-correct": {
    id: "fraction-name-correct",
    type: "narrate",
    tutorText: "FRACTION! YES! The crowd is SCREAMING! A fraction lets us write parts of a whole! The bottom number says how many equal pieces total, and the top number says how many pieces we HAVE! Pure genius!",
    next: "show-full-result",
    sfx: "applause",
  },

  "show-full-result": {
    id: "show-full-result",
    type: "show-fraction",
    tutorText: "So here's the GRAND TOTAL for our friends: 2 whole cookies PLUS one half — written as two-and-one-half! BEAUTIFUL! ELEGANT! Frame it on the wall!",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "transition-to-phase3",
    sfx: "sparkle",
  },

  // ============================================================
  // PHASE 4: THE CHAMPIONSHIP ROUND — 5 cookies, 4 people
  // ============================================================

  "transition-to-phase3": {
    id: "transition-to-phase3",
    type: "narrate",
    tutorText: "AMAZING work in Round Two! But we saved the BEST for last! It's time for the CHAMPIONSHIP ROUND! The ultimate test! The final boss of fractions! Are you READY?!",
    next: "phase3-setup",
    sfx: "horn-fanfare",
  },

  "phase3-setup": {
    id: "phase3-setup",
    type: "narrate",
    tutorText: "Here are the CHAMPIONSHIP conditions: FIVE cookies. FOUR hungry friends. That means MORE cutting, MORE fractions, and MORE glory! This is what you've been TRAINING for!",
    next: "distribute-5-4",
    sfx: "drum-roll",
  },

  "distribute-5-4": {
    id: "distribute-5-4",
    type: "distribute",
    taskHeader: "Share 5 cookies between 4 friends!",
    tutorText: "Give each friend as many whole cookies as you can, equally! Use the knife to slice what's left! The clock is TICKING — well, not really, but FEEL the urgency!",
    cookieCount: 5,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "distribute-5-4-reaction",
    sfx: "countdown-tick",
  },

  "distribute-5-4-reaction": {
    id: "distribute-5-4-reaction",
    type: "narrate",
    tutorText: "The plates are full! Four friends, each with a pile of cookies! Let's see what the judges think... The calculations are being verified... The math is CHECKING OUT...",
    next: "result-5-4-check",
    sfx: "drum-roll",
  },

  "result-5-4-check": {
    id: "result-5-4-check",
    type: "choice",
    tutorText: "JUDGES' QUESTION! Each person got one whole cookie, plus one of four equal slices. Altogether, how many cookies did each friend receive?",
    choices: [
      { label: "One and a quarter", next: "result-5-4-correct", correct: true },
      { label: "Just one", next: "result-5-4-wrong-one" },
      { label: "Two", next: "result-5-4-wrong-two" },
      { label: "Forty-seven", next: "result-5-4-wrong-fortyseven" },
    ],
  },

  "result-5-4-wrong-one": {
    id: "result-5-4-wrong-one",
    type: "narrate",
    tutorText: "BZZZT! One whole cookie, yes! But look at those extra slices! We cut up the leftover cookie into FOUR equal pieces. Each friend got one of those pieces too! Add it all together!",
    next: "result-5-4-check",
    sfx: "buzzer",
  },

  "result-5-4-wrong-two": {
    id: "result-5-4-wrong-two",
    type: "narrate",
    tutorText: "BZZZT! Two is a great number — I have tremendous respect for the number two! But each friend only got one whole cookie, plus a small slice. Not quite two!",
    next: "result-5-4-check",
    sfx: "buzzer",
  },

  "result-5-4-wrong-fortyseven": {
    id: "result-5-4-wrong-fortyseven",
    type: "narrate",
    tutorText: "BZZZT! Forty-seven! I appreciate the CONFIDENCE! Forty-seven cookies each would require approximately a million cookies total. We only started with five. Look at those plates and count carefully!",
    next: "result-5-4-check",
    sfx: "buzzer",
  },

  "result-5-4-correct": {
    id: "result-5-4-correct",
    type: "show-fraction",
    tutorText: "ONE AND A QUARTER! THE JUDGES SAY YES! Each friend got 1 whole cookie PLUS one out of four equal pieces — that's one-quarter! Written as a fraction: one over four! CHAMPIONSHIP MATERIAL!",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 4,
    next: "quarter-explain",
    sfx: "winner-bell",
  },

  "quarter-explain": {
    id: "quarter-explain",
    type: "choice",
    tutorText: "Here's a BONUS brain-buster! The bottom number of our fraction is 4. What does that 4 MEAN?",
    choices: [
      { label: "We cut the cookie into 4 equal pieces", next: "quarter-explain-correct", correct: true },
      { label: "We have 4 friends", next: "quarter-explain-wrong-friends" },
      { label: "It's my lucky number", next: "quarter-explain-wrong-lucky" },
    ],
  },

  "quarter-explain-wrong-friends": {
    id: "quarter-explain-wrong-friends",
    type: "narrate",
    tutorText: "BZZZT! We DO have 4 friends — and that's connected! We cut the cookie into 4 pieces BECAUSE we had 4 friends! The bottom number means how many equal pieces the cookie was cut into!",
    next: "quarter-explain",
    sfx: "buzzer",
  },

  "quarter-explain-wrong-lucky": {
    id: "quarter-explain-wrong-lucky",
    type: "narrate",
    tutorText: "BZZZT! Four IS a fantastic lucky number! But in this fraction, the 4 means something very specific! It's how many equal pieces we cut that cookie into!",
    next: "quarter-explain",
    sfx: "buzzer",
  },

  "quarter-explain-correct": {
    id: "quarter-explain-correct",
    type: "narrate",
    tutorText: "EXACTLY RIGHT! The bottom number — called the DENOMINATOR — always tells you how many equal pieces something was cut into! You just learned a SECRET MATH WORD! De-NOM-in-ator! Say it!",
    next: "numerator-explain",
    sfx: "applause",
  },

  "numerator-explain": {
    id: "numerator-explain",
    type: "choice",
    tutorText: "And the TOP number — what does the 1 on top of our fraction mean?",
    choices: [
      { label: "Each friend got 1 of those pieces", next: "numerator-correct", correct: true },
      { label: "There was only 1 cookie left over", next: "numerator-wrong-leftover" },
      { label: "One is the loneliest number", next: "numerator-wrong-lonely" },
    ],
  },

  "numerator-wrong-leftover": {
    id: "numerator-wrong-leftover",
    type: "narrate",
    tutorText: "BZZZT! It's true there was 1 leftover cookie — you have an excellent memory! But the top number in a fraction shows how many PIECES each person got! Each person got 1 slice!",
    next: "numerator-explain",
    sfx: "buzzer",
  },

  "numerator-wrong-lonely": {
    id: "numerator-wrong-lonely",
    type: "narrate",
    tutorText: "BZZZT! Ha! I see you know your classic songs! But in math, the top number — the NUMERATOR — tells us how many pieces someone received! Each person got 1 piece!",
    next: "numerator-explain",
    sfx: "buzzer",
  },

  "numerator-correct": {
    id: "numerator-correct",
    type: "narrate",
    tutorText: "OUTSTANDING! The top number — called the NUMERATOR — tells you how many pieces YOU have! One piece out of four total pieces equals ONE QUARTER! You now know TWO secret math words: numerator and denominator!",
    next: "lesson-complete",
    sfx: "applause",
  },

  // ============================================================
  // FINALE — Victory lap!
  // ============================================================

  "lesson-complete": {
    id: "lesson-complete",
    type: "narrate",
    tutorText: "LADIES AND GENTLEMEN! Let me tell you what just happened here today! This player walked in not knowing what a fraction WAS — and now they're throwing around words like NUMERATOR and DENOMINATOR like a seasoned PROFESSIONAL!",
    next: "done",
    sfx: "horn-fanfare",
  },

  "done": {
    id: "done",
    type: "narrate",
    tutorText: "You have officially CONQUERED the Fraction Zone! Every time you can't split something evenly, you CUT it into equal pieces and WRITE it as a fraction — and now you know EXACTLY how! You are a FRACTION CHAMPION! Come back ANYTIME!",
    next: "end",
    sfx: "winner-bell",
  },
};
