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
  // ─────────────────────────────────────────────
  // PHASE 1: Easy warm-up (4 coins, 2 pirates)
  // ─────────────────────────────────────────────
  start: {
    id: "start",
    type: "narrate",
    tutorText:
      "Ahoy, me young hearty! Welcome aboard the good ship Golden Gull! I be Captain Sharktooth, and today we be huntin' for treasure! Are ye ready to sail the seven seas with me?",
    next: "p1-show-coins",
    sfx: "woosh",
  },

  "p1-show-coins": {
    id: "p1-show-coins",
    type: "narrate",
    tutorText:
      "Shiver me timbers -- we found a treasure chest washed up on shore! Let's crack it open... Blazin' barnacles, there be 4 shiny gold coins inside! Now, there be 2 pirates on this crew: you and me. A good captain always splits the loot evenly!",
    next: "p1-distribute",
    sfx: "ding",
  },

  "p1-distribute": {
    id: "p1-distribute",
    type: "distribute",
    tutorText:
      "Go on then, matey! Drag the gold coins and give each pirate the same number. Fair shares for all!",
    taskHeader: "Share 4 coins between 2 pirates",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "p1-quiz",
    sfx: "pop",
  },

  "p1-quiz": {
    id: "p1-quiz",
    type: "choice",
    tutorText:
      "Nicely done, ye scallywag! Now tell old Captain Sharktooth -- how many gold coins did each pirate get?",
    taskHeader: "How many coins does each pirate have?",
    choices: [
      { label: "2 coins each", next: "p1-correct", correct: true },
      { label: "4 coins each", next: "p1-wrong-greedy" },
      { label: "1 coin each", next: "p1-wrong-low" },
    ],
    sfx: "pop",
  },

  "p1-wrong-greedy": {
    id: "p1-wrong-greedy",
    type: "narrate",
    tutorText:
      "Arrr! 4 coins each?! That be more coins than we even HAVE, ye greedy sea dog! Me parrot could count better than that -- and he only knows the word 'cracker'! Try again, matey.",
    next: "p1-quiz",
    sfx: "boing",
  },

  "p1-wrong-low": {
    id: "p1-wrong-low",
    type: "narrate",
    tutorText:
      "Only 1 coin each? That means 2 coins be hidin' somewhere! Did a seagull steal 'em? Nay -- count again, me hearty!",
    next: "p1-quiz",
    sfx: "boing",
  },

  "p1-correct": {
    id: "p1-correct",
    type: "show-number",
    tutorText:
      "Aye aye! 2 coins each! That be perfect pirate math! When ye split 4 coins between 2 pirates, each one gets exactly 2. Ye be a natural treasure-divider!",
    showNumber: "2",
    next: "p2-intro",
    sfx: "ding",
  },

  // ─────────────────────────────────────────────
  // PHASE 2: Conflict (5 coins, 2 pirates)
  // ─────────────────────────────────────────────
  "p2-intro": {
    id: "p2-intro",
    type: "narrate",
    tutorText:
      "Hold the anchor! We found ANOTHER chest behind them rocks! Let's crack it open... Well blow me down -- there be 5 gold coins this time! Still 2 pirates in our crew. Let's share 'em out fair and square!",
    next: "p2-distribute",
    sfx: "woosh",
  },

  "p2-distribute": {
    id: "p2-distribute",
    type: "distribute",
    tutorText:
      "Give each pirate the same number of coins. But wait... something funny might happen this time!",
    taskHeader: "Share 5 coins between 2 pirates",
    cookieCount: 5,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "p2-choice-leftover",
    sfx: "pop",
  },

  "p2-choice-leftover": {
    id: "p2-choice-leftover",
    type: "choice",
    tutorText:
      "Arrr, we got a problem! Each pirate got 2 coins, but there be 1 lonely coin left over! We can't just toss it overboard -- that be wasteful! What shall we do with it, me hearty?",
    taskHeader: "One coin left over! What do we do?",
    choices: [
      { label: "Break it in half and share!", next: "p2-slice", correct: true },
      { label: "Feed it to the kraken", next: "p2-wrong-kraken" },
      { label: "Make the parrot decide", next: "p2-wrong-parrot" },
    ],
    sfx: "boing",
  },

  "p2-wrong-kraken": {
    id: "p2-wrong-kraken",
    type: "narrate",
    tutorText:
      "Feed it to the KRAKEN?! That big beastie already ate me favorite boots last Tuesday! Nay, we don't throw away perfectly good treasure. Think again, ye silly sailor!",
    next: "p2-choice-leftover",
    sfx: "boing",
  },

  "p2-wrong-parrot": {
    id: "p2-wrong-parrot",
    type: "narrate",
    tutorText:
      "BRAWK! The parrot says he wants ALL the coins! See, that's why we don't let parrots make decisions. They be terrible at sharing! Let's figure this out ourselves, matey.",
    next: "p2-choice-leftover",
    sfx: "boing",
  },

  "p2-slice": {
    id: "p2-slice",
    type: "slice",
    tutorText:
      "Aye, brilliant idea! We can BREAK this coin right down the middle! Grab yer sword and slice it in half -- one clean cut, matey!",
    taskHeader: "Slice the coin in half!",
    cookieCount: 1,
    next: "p2-distribute-halves",
    sfx: "slice",
  },

  "p2-distribute-halves": {
    id: "p2-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Now give one half to each pirate! Each crew member gets their fair share of the treasure!",
    taskHeader: "Give each pirate one half",
    cookieCount: 2,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "p2-quiz-total",
    sfx: "pop",
  },

  "p2-quiz-total": {
    id: "p2-quiz-total",
    type: "choice",
    tutorText:
      "Now think carefully, ye clever pirate -- each of us got 2 whole coins AND one half coin. So how many coins does each pirate have altogether?",
    taskHeader: "How many coins does each pirate have in total?",
    choices: [
      { label: "2 and a half", next: "p2-correct-total", correct: true },
      { label: "3 -- close enough!", next: "p2-wrong-roundup" },
      { label: "2 -- halves don't count!", next: "p2-wrong-ignore" },
    ],
    sfx: "pop",
  },

  "p2-wrong-roundup": {
    id: "p2-wrong-roundup",
    type: "narrate",
    tutorText:
      "3 coins? Arrr, ye be rounding up like a pirate rounds up prisoners! But half a coin isn't a whole coin, matey. We need to be exact -- pirates take their treasure VERY seriously! Try again.",
    next: "p2-quiz-total",
    sfx: "boing",
  },

  "p2-wrong-ignore": {
    id: "p2-wrong-ignore",
    type: "narrate",
    tutorText:
      "Halves don't count?! Walk the plank with that attitude, ye scallywag! Half a gold coin can still buy ye half a barrel of grog! That half be important! Think again!",
    next: "p2-quiz-total",
    sfx: "boing",
  },

  "p2-correct-total": {
    id: "p2-correct-total",
    type: "show-fraction",
    tutorText:
      "AYE AYE! Two and a half coins each! Ye be sharper than me cutlass! Now here be the treasure secret -- clever pirates write that as 2 and 1 over 2. The top number says how many pieces ye have, and the bottom number says how many pieces the coin was broken into. That's called a FRACTION! Arrr!",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "p3-bridge-intro",
    sfx: "fanfare",
  },

  // ─────────────────────────────────────────────
  // PHASE 3: Bridge to symbolic
  // ─────────────────────────────────────────────
  "p3-bridge-intro": {
    id: "p3-bridge-intro",
    type: "narrate",
    tutorText:
      "Now gather 'round the mast, me hearty! Captain Sharktooth be about to share a mighty secret of pirate math!",
    next: "p3-whole-number",
    sfx: "woosh",
  },

  "p3-whole-number": {
    id: "p3-whole-number",
    type: "show-number",
    tutorText:
      "A WHOLE number is like a whole gold coin -- complete, no pieces missing! Numbers like 1, 2, 3, 4... those be whole numbers. A whole coin ye can hold in yer hand, nice and round!",
    showNumber: "1, 2, 3, 4...",
    next: "p3-fraction-explain",
    sfx: "ding",
  },

  "p3-fraction-explain": {
    id: "p3-fraction-explain",
    type: "show-fraction",
    tutorText:
      "But a FRACTION be like a PIECE of a coin -- when ye break a coin into equal parts, each piece is a fraction! Like when we cut that coin in half: we had 1 piece out of 2 equal parts. That be one-half!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "p3-quiz-understanding",
    sfx: "ding",
  },

  "p3-quiz-understanding": {
    id: "p3-quiz-understanding",
    type: "choice",
    tutorText:
      "Pop quiz, sailor! If ye break a gold coin into 2 equal pieces and take 1 piece, what fraction of the coin do ye have?",
    taskHeader: "What fraction is one piece of a coin broken in two?",
    choices: [
      { label: "One half (1/2)", next: "p3-correct", correct: true },
      { label: "One whole coin", next: "p3-wrong-whole" },
      { label: "Two halves", next: "p3-wrong-two-halves" },
    ],
    sfx: "pop",
  },

  "p3-wrong-whole": {
    id: "p3-wrong-whole",
    type: "narrate",
    tutorText:
      "A whole coin? Nay, matey! We BROKE the coin, remember? Ye only took one of the two pieces. That ain't the whole thing -- that be a piece of it! Try again, ye landlubber!",
    next: "p3-quiz-understanding",
    sfx: "boing",
  },

  "p3-wrong-two-halves": {
    id: "p3-wrong-two-halves",
    type: "narrate",
    tutorText:
      "Two halves?! Shiver me timbers, ye greedy barnacle! Ye only took ONE piece, not both of 'em! If ye took both halves, that'd be the whole coin again! One piece means one half!",
    next: "p3-quiz-understanding",
    sfx: "boing",
  },

  "p3-correct": {
    id: "p3-correct",
    type: "narrate",
    tutorText:
      "That be RIGHT! One half! Ye be learnin' pirate math faster than a cannonball flies! Now... are ye ready for the ULTIMATE treasure challenge?",
    next: "p4-intro",
    sfx: "fanfare",
  },

  // ─────────────────────────────────────────────
  // PHASE 4: Harder challenge (5 coins, 4 pirates)
  // ─────────────────────────────────────────────
  "p4-intro": {
    id: "p4-intro",
    type: "narrate",
    tutorText:
      "LAND HO! We've sailed to Skull Island, and two MORE pirates want to join our crew! Now we have 4 pirates total. And there be a giant golden chest buried under the palm tree...",
    next: "p4-show-coins",
    sfx: "woosh",
  },

  "p4-show-coins": {
    id: "p4-show-coins",
    type: "narrate",
    tutorText:
      "We dug it up and -- THUNDERING TYPHOONS -- there be 5 gold coins inside! Now we need to split 5 coins between 4 pirates. This be a tricky one, matey!",
    next: "p4-distribute",
    sfx: "ding",
  },

  "p4-distribute": {
    id: "p4-distribute",
    type: "distribute",
    tutorText:
      "Start by givin' each pirate as many whole coins as ye can, fair and even! Use the knife tool if ye need to cut any leftover coins into pieces!",
    taskHeader: "Share 5 coins between 4 pirates",
    cookieCount: 5,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "p4-slice",
    sfx: "pop",
  },

  "p4-slice": {
    id: "p4-slice",
    type: "slice",
    tutorText:
      "Aye! Each pirate got 1 whole coin, and there be 1 coin left over -- but NOW we have 4 pirates to share it with! Slice this coin into 4 EQUAL pieces. A steady hand makes a fair share!",
    taskHeader: "Slice the coin into 4 equal pieces!",
    cookieCount: 1,
    next: "p4-distribute-quarters",
    sfx: "slice",
  },

  "p4-distribute-quarters": {
    id: "p4-distribute-quarters",
    type: "distribute-halves",
    tutorText:
      "Now give one piece to each of the 4 pirates! Every crew member gets their quarter!",
    taskHeader: "Give each pirate one quarter",
    cookieCount: 4,
    characterCount: 4,
    expectedPerPerson: 1,
    next: "p4-quiz",
    sfx: "pop",
  },

  "p4-quiz": {
    id: "p4-quiz",
    type: "choice",
    tutorText:
      "Alright, me brilliant buccaneer! Each pirate got 1 whole coin and 1 piece of a coin that was cut into 4. How much treasure does each pirate have?",
    taskHeader: "How many coins does each pirate have total?",
    choices: [
      { label: "1 and a quarter (1 1/4)", next: "p4-correct", correct: true },
      { label: "2 coins each", next: "p4-wrong-high" },
      { label: "1 coin -- quarters are too small!", next: "p4-wrong-ignore" },
    ],
    sfx: "pop",
  },

  "p4-wrong-high": {
    id: "p4-wrong-high",
    type: "narrate",
    tutorText:
      "2 coins each? Arrr, if each of the 4 pirates had 2 coins, we'd need 8 coins total! We only found 5, not 8! Did ye find a secret stash ye be hidin' from the captain?! Try again!",
    next: "p4-quiz",
    sfx: "boing",
  },

  "p4-wrong-ignore": {
    id: "p4-wrong-ignore",
    type: "narrate",
    tutorText:
      "Too small to count?! Ye'd best not let the crew hear that -- a quarter coin can buy ye a fine piece of hardtack! Every piece counts when ye be a pirate! Think again, matey!",
    next: "p4-quiz",
    sfx: "boing",
  },

  "p4-correct": {
    id: "p4-correct",
    type: "show-fraction",
    tutorText:
      "YO HO HO! 1 and one-quarter! That means 1 whole coin plus 1 piece out of 4 equal pieces. Pirates write that as 1 and 1 over 4. The bottom number tells ye the coin was cut into 4 parts, and the top says each pirate got 1 of those parts!",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 4,
    next: "finale",
    sfx: "fanfare",
  },

  // ─────────────────────────────────────────────
  // FINALE
  // ─────────────────────────────────────────────
  finale: {
    id: "finale",
    type: "narrate",
    tutorText:
      "Shiver me timbers, ye did it! Ye've mastered the art of pirate treasure sharing! Ye learned that when treasure doesn't split evenly, we can BREAK it into equal pieces -- and those pieces be called FRACTIONS! Ye be the finest math pirate to ever sail these seas! Now go forth and share fairly, Captain!",
    next: "end",
    sfx: "fanfare",
  },

  end: {
    id: "end",
    type: "narrate",
    tutorText:
      "Lesson complete! Fair winds and following seas, me hearty! Until our next adventure!",
    sfx: "fanfare",
  },
};
