// lessonData-storyC.ts — Monster Bake-Off (Silly & Playful)
// Wacky game-show host energy. Goofy, encouraging, never punitive.
// Monsters are judges at a chocolate bar bake-off and must taste-test fairly.

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
  next?: string;         // for narrate / distribute / show-* steps
  cookieCount?: number;
  characterCount?: number;
  expectedPerPerson?: number;
  showNumber?: string;   // e.g. "2" or "2½"
  showFractionNum?: number;
  showFractionDen?: number;
  wholeNumber?: number;
  allowKnife?: boolean;
  sfx?: string;
}

// ---------------------------------------------------------------------------
// The lesson — ~42 steps across 3 stages + finale
// ---------------------------------------------------------------------------
//
// Stage 1 — Clean division:      2 bars ÷ 2 monsters → 1 each
// Stage 2 — Introduce halves:    3 bars ÷ 2 monsters → 1½ each
// Stage 3 — Introduce quarters:  7 bars ÷ 4 monsters → 1¾ each
// Finale  — Silly celebration
//
// SFX palette:
//   chime        — correct answer, moment of insight
//   harp-gliss   — transitions, reveals
//   warm-pad     — open / title moments
//   soft-bell    — chocolate bar placement
//   xylophone    — small wins, placements
//   music-box    — celebration
//   gentle-whoosh — page transitions
//   sparkle      — fraction reveal
// ---------------------------------------------------------------------------

export const lessonSteps: Record<string, LessonStep> = {

  // ===========================================================================
  // STAGE 1 — Clean division: 2 bars ÷ 2 monsters → 1 each
  // ===========================================================================

  "start": {
    id: "start",
    type: "narrate",
    tutorText:
      "WELCOME, WELCOME, WELCOME to the most SPECTACULAR, most CHOCOLATEY, "
      + "most MONSTROUSLY DELICIOUS event of the year — "
      + "it's the MONSTER BAKE-OFF!",
    next: "intro-2",
    sfx: "warm-pad",
  },

  "intro-2": {
    id: "intro-2",
    type: "narrate",
    tutorText:
      "I'm your host, and we have some VERY important monster judges waiting backstage. "
      + "They're here to taste-test chocolate bars, and there's just one tiny rule — "
      + "every monster must get EXACTLY the same amount. Fair and square!",
    next: "intro-3",
    sfx: "harp-gliss",
  },

  "intro-3": {
    id: "intro-3",
    type: "narrate",
    tutorText:
      "You see, monsters can be a teensy bit grumpy if someone gets more chocolate than they do. "
      + "And a grumpy monster is... well, let's just say we don't want to find out. "
      + "Your job? Make sure every monster gets a FAIR share!",
    next: "s1-setup",
    sfx: "gentle-whoosh",
  },

  "s1-setup": {
    id: "s1-setup",
    type: "narrate",
    tutorText:
      "Alright, round one! Our first two monster judges have waddled up to the tasting table. "
      + "And we have exactly 2 chocolate bars fresh out of the oven. "
      + "The crowd goes wild! Well, it's just me, but I'm very excited!",
    next: "s1-distribute",
    sfx: "harp-gliss",
  },

  "s1-distribute": {
    id: "s1-distribute",
    type: "distribute",
    taskHeader: "Give each monster the same number of chocolate bars.",
    tutorText:
      "2 chocolate bars. 2 monsters. "
      + "Drag each bar to a monster so they both get the same amount. "
      + "No pressure — except that the monsters are staring at you. Lovingly.",
    cookieCount: 2,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "s1-howmany",
    sfx: "soft-bell",
  },

  "s1-howmany": {
    id: "s1-howmany",
    type: "choice",
    tutorText:
      "Fantastic distributing! Now tell me — how many chocolate bars did each monster get?",
    choices: [
      { label: "1 bar each", next: "s1-correct", correct: true },
      { label: "2 bars each", next: "s1-wrong-two" },
      { label: "I ate them both myself", next: "s1-wrong-ate", correct: false },
    ],
  },

  "s1-wrong-two": {
    id: "s1-wrong-two",
    type: "narrate",
    tutorText:
      "Ooh, 2 each would be AMAZING — the monsters would LOVE that. "
      + "But we only had 2 bars total, not 4! "
      + "If we split 2 bars between 2 monsters, each one gets just 1. "
      + "Let's try that question again!",
    next: "s1-howmany",
    sfx: "gentle-whoosh",
  },

  "s1-wrong-ate": {
    id: "s1-wrong-ate",
    type: "narrate",
    tutorText:
      "HA! I like your style, but the monsters are giving you a VERY suspicious look right now. "
      + "Those chocolate bars are for the judges, my friend! "
      + "We had 2 bars and 2 monsters — so each monster gets... how many?",
    next: "s1-howmany",
    sfx: "gentle-whoosh",
  },

  "s1-correct": {
    id: "s1-correct",
    type: "show-number",
    tutorText:
      "DING DING DING! One bar each! The monsters are happily chomping away. "
      + "2 bars divided between 2 monsters means each one gets exactly 1. "
      + "That's what we call FAIR sharing — also known as DIVISION!",
    showNumber: "1",
    next: "s1-reflect",
    sfx: "chime",
  },

  "s1-reflect": {
    id: "s1-reflect",
    type: "choice",
    tutorText:
      "So we just divided 2 bars between 2 monsters, and each got 1. Easy peasy! Ready for round two?",
    choices: [
      { label: "Bring it on!", next: "s2-intro" },
      { label: "Wait, what's division?", next: "s1-explain-division" },
    ],
  },

  "s1-explain-division": {
    id: "s1-explain-division",
    type: "narrate",
    tutorText:
      "Great question! Division is just a fancy word for SHARING EQUALLY. "
      + "When you split something up so everyone gets the same amount — that's division. "
      + "You've been doing it your whole life without even knowing it had a fancy name!",
    next: "s2-intro",
    sfx: "gentle-whoosh",
  },

  // ===========================================================================
  // STAGE 2 — Introduce halves: 3 bars ÷ 2 monsters → 1½ each
  // ===========================================================================

  "s2-intro": {
    id: "s2-intro",
    type: "narrate",
    tutorText:
      "Round TWO! The same two monsters are back at the judging table, "
      + "and this time the bakers have sent out — drumroll please — "
      + "THREE chocolate bars! Ooooh!",
    next: "s2-problem",
    sfx: "harp-gliss",
  },

  "s2-problem": {
    id: "s2-problem",
    type: "narrate",
    tutorText:
      "But wait. 3 bars and 2 monsters. Hmm. "
      + "That's... not as tidy as last time, is it? "
      + "I'm getting a funny feeling about this. Let's see what happens!",
    next: "s2-distribute",
    sfx: "gentle-whoosh",
  },

  "s2-distribute": {
    id: "s2-distribute",
    type: "distribute",
    taskHeader: "Share 3 chocolate bars between 2 monsters.",
    tutorText:
      "3 bars. 2 monsters. Give each monster as many whole bars as you can. "
      + "If there's a bar left over, don't panic — we'll figure it out together!",
    cookieCount: 3,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "s2-leftover",
    sfx: "soft-bell",
  },

  "s2-leftover": {
    id: "s2-leftover",
    type: "narrate",
    tutorText:
      "Well, well, well. Each monster has 1 bar, and there's 1 lonely bar sitting in the middle. "
      + "Both monsters are eyeing it. One of them just drooled a little. "
      + "We need to figure out what to do with it!",
    next: "s2-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s2-leftover-choice": {
    id: "s2-leftover-choice",
    type: "choice",
    tutorText:
      "What should we do with this last chocolate bar so both monsters get a fair share?",
    choices: [
      { label: "Cut it in half — one piece for each!", next: "s2-slice-intro", correct: true },
      { label: "Throw it into the volcano!", next: "s2-wrong-volcano", correct: false },
      { label: "Ask the chocolate bar nicely to split itself", next: "s2-wrong-ask", correct: false },
    ],
  },

  "s2-wrong-volcano": {
    id: "s2-wrong-volcano",
    type: "narrate",
    tutorText:
      "INTO THE VOLCANO?! That is the most dramatic solution I have ever heard! "
      + "The monsters look horrified. That's perfectly good chocolate! "
      + "What if instead of lava, we used... a knife? "
      + "We could cut that bar so both monsters get a piece!",
    next: "s2-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-ask": {
    id: "s2-wrong-ask",
    type: "narrate",
    tutorText:
      "I actually tried that once. I said, 'Excuse me, chocolate bar, would you mind splitting yourself in two?' "
      + "It just sat there. Very rude. Chocolate bars are NOT good listeners. "
      + "But YOU can split it — what if we cut it into two equal pieces?",
    next: "s2-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s2-slice-intro": {
    id: "s2-slice-intro",
    type: "narrate",
    tutorText:
      "YES! Cut it right down the middle — one half for each monster! "
      + "That's the kind of brilliant thinking that wins bake-offs. "
      + "Go ahead, tap that chocolate bar to slice it!",
    next: "s2-do-slice",
    sfx: "harp-gliss",
  },

  "s2-do-slice": {
    id: "s2-do-slice",
    type: "slice",
    tutorText:
      "Tap the chocolate bar to cut it in half. "
      + "Steady hands... you've got this!",
    next: "s2-post-slice",
    sfx: "gentle-whoosh",
  },

  "s2-post-slice": {
    id: "s2-post-slice",
    type: "narrate",
    tutorText:
      "PERFECT CUT! Two equal pieces! "
      + "When you cut something into two equal parts, each piece is called ONE HALF. "
      + "Now let's give each monster their piece!",
    next: "s2-distribute-halves",
    sfx: "chime",
  },

  "s2-distribute-halves": {
    id: "s2-distribute-halves",
    type: "distribute-halves",
    tutorText:
      "Drag one half to each monster. "
      + "One piece here, one piece there — fair and square!",
    characterCount: 2,
    next: "s2-count-q",
    sfx: "xylophone",
  },

  "s2-count-q": {
    id: "s2-count-q",
    type: "choice",
    tutorText:
      "Both monsters are happily munching. Let's count up what each one got — "
      + "one whole bar, plus that half we just shared. "
      + "How much chocolate does each monster have altogether?",
    choices: [
      { label: "1 bar", next: "s2-wrong-one" },
      { label: "1 and a half bars", next: "s2-count-correct", correct: true },
      { label: "47 bars", next: "s2-wrong-47", correct: false },
    ],
  },

  "s2-wrong-one": {
    id: "s2-wrong-one",
    type: "narrate",
    tutorText:
      "Almost! Each monster DID get 1 whole bar — you're right about that part. "
      + "But don't forget the half-bar we just sliced up! "
      + "1 whole bar PLUS a half bar equals... what?",
    next: "s2-count-q",
    sfx: "gentle-whoosh",
  },

  "s2-wrong-47": {
    id: "s2-wrong-47",
    type: "narrate",
    tutorText:
      "FORTY-SEVEN?! Oh my goodness, the monsters WISH! "
      + "That would be the greatest bake-off in history! "
      + "But we only had 3 bars total. Each monster got 1 whole bar, plus a half. "
      + "So what's 1 plus a half?",
    next: "s2-count-q",
    sfx: "gentle-whoosh",
  },

  "s2-count-correct": {
    id: "s2-count-correct",
    type: "show-number",
    tutorText:
      "ONE AND A HALF! The crowd goes bananas! Well, I go bananas. "
      + "Each monster got 1 whole bar plus half a bar. That's 1 and a half!",
    showNumber: "1½",
    next: "s2-know-fractions",
    sfx: "chime",
  },

  "s2-know-fractions": {
    id: "s2-know-fractions",
    type: "choice",
    tutorText:
      "Now here's something cool — mathematicians have a special way to write 'one half' as a number. "
      + "It's called a FRACTION. Have you ever seen a fraction before?",
    choices: [
      { label: "Yes, I know fractions!", next: "s2-fraction-skip" },
      { label: "Nope, show me!", next: "s2-fraction-explain" },
    ],
  },

  "s2-fraction-skip": {
    id: "s2-fraction-skip",
    type: "narrate",
    tutorText:
      "Oh, a fraction expert in the audience! Love it! "
      + "Then this next part should feel nice and familiar. Let's see it in action!",
    next: "s2-show-fraction",
    sfx: "harp-gliss",
  },

  "s2-fraction-explain": {
    id: "s2-fraction-explain",
    type: "narrate",
    tutorText:
      "A fraction is just a way to write down PART of something! "
      + "It has two numbers stacked on top of each other with a line in between. "
      + "The bottom number says how many equal pieces we cut it into. "
      + "The top number says how many pieces we're talking about. Easy!",
    next: "s2-show-fraction",
    sfx: "gentle-whoosh",
  },

  "s2-show-fraction": {
    id: "s2-show-fraction",
    type: "show-fraction",
    tutorText:
      "Here it is! Each monster got 1 and one half. "
      + "The big 1 is the whole bar. The fraction shows the half — "
      + "1 on top (one piece) and 2 on the bottom (cut into 2 equal pieces). "
      + "Ta-daaaa!",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "s2-celebrate",
    sfx: "sparkle",
  },

  "s2-celebrate": {
    id: "s2-celebrate",
    type: "narrate",
    tutorText:
      "Round 2 is COMPLETE! The monsters give the chocolate a solid 10 out of 10. "
      + "They're very happy judges. But hold on to your hats — "
      + "round 3 is going to get WILD!",
    next: "s3-intro",
    sfx: "music-box",
  },

  // ===========================================================================
  // STAGE 3 — Introduce quarters: 7 bars ÷ 4 monsters → 1¾ each
  // ===========================================================================

  "s3-intro": {
    id: "s3-intro",
    type: "narrate",
    tutorText:
      "Ladies, gentlemen, and monsters of all sizes — it's time for the FINAL ROUND! "
      + "Two MORE monster judges have arrived! We now have FOUR monsters at the table!",
    next: "s3-setup",
    sfx: "warm-pad",
  },

  "s3-setup": {
    id: "s3-setup",
    type: "narrate",
    tutorText:
      "And the bakers have outdone themselves — they've sent out SEVEN chocolate bars! "
      + "The monsters' eyes are as big as dinner plates. "
      + "But remember: every monster must get the EXACT same amount. Let's do this!",
    next: "s3-distribute",
    sfx: "harp-gliss",
  },

  "s3-distribute": {
    id: "s3-distribute",
    type: "distribute",
    taskHeader: "Share 7 chocolate bars equally between 4 monsters.",
    tutorText:
      "7 bars. 4 monsters. Start by giving each monster as many whole bars as you can. "
      + "Don't worry about leftovers yet — we'll handle those together!",
    cookieCount: 7,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "s3-whole-check",
    sfx: "soft-bell",
  },

  "s3-whole-check": {
    id: "s3-whole-check",
    type: "choice",
    tutorText:
      "OK! Each monster has some whole bars. "
      + "Before we deal with leftovers — how many WHOLE bars did each monster get?",
    choices: [
      { label: "1 whole bar each", next: "s3-whole-correct", correct: true },
      { label: "2 whole bars each", next: "s3-whole-wrong-two", correct: false },
      { label: "7 whole bars each", next: "s3-whole-wrong-seven", correct: false },
    ],
  },

  "s3-whole-wrong-two": {
    id: "s3-whole-wrong-two",
    type: "narrate",
    tutorText:
      "2 each would use up 8 bars — but we only have 7! SO close though. "
      + "With 7 bars and 4 monsters, each monster can get 1 whole bar. "
      + "That uses up 4 bars, leaving 3 bars still on the table. Let's try again!",
    next: "s3-whole-check",
    sfx: "gentle-whoosh",
  },

  "s3-whole-wrong-seven": {
    id: "s3-whole-wrong-seven",
    type: "narrate",
    tutorText:
      "SEVEN EACH?! That would be 28 bars total! "
      + "The monsters would absolutely love that, but we'd need a LOT more chocolate. "
      + "We only have 7 bars for 4 monsters. Each one gets 1 whole bar, with some left over!",
    next: "s3-whole-check",
    sfx: "gentle-whoosh",
  },

  "s3-whole-correct": {
    id: "s3-whole-correct",
    type: "narrate",
    tutorText:
      "That's right! 1 whole bar each! That uses up 4 of our 7 bars. "
      + "Which means we have 3 bars left over. "
      + "Three leftover bars and four hungry monsters... "
      + "this is getting INTERESTING!",
    next: "s3-leftover-choice",
    sfx: "chime",
  },

  "s3-leftover-choice": {
    id: "s3-leftover-choice",
    type: "choice",
    tutorText:
      "We have 3 chocolate bars left and 4 monsters. What should we do?",
    choices: [
      { label: "Cut each leftover bar into 4 equal pieces!", next: "s3-cut-correct", correct: true },
      { label: "Give 3 monsters a bar and tell the 4th one 'sorry'", next: "s3-wrong-unfair", correct: false },
      { label: "Stack them into a chocolate tower and admire it", next: "s3-wrong-tower", correct: false },
    ],
  },

  "s3-wrong-unfair": {
    id: "s3-wrong-unfair",
    type: "narrate",
    tutorText:
      "Oh no! The 4th monster just made the saddest face I've ever seen. "
      + "A single glittery tear rolled down its fuzzy cheek. "
      + "We HAVE to share fairly! What if we CUT each leftover bar "
      + "into pieces so all 4 monsters get the same amount?",
    next: "s3-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s3-wrong-tower": {
    id: "s3-wrong-tower",
    type: "narrate",
    tutorText:
      "A CHOCOLATE TOWER! I love the architectural ambition! "
      + "But the monsters don't want to LOOK at chocolate — they want to EAT it! "
      + "What if we cut each of those 3 bars into pieces "
      + "so every monster gets an equal share?",
    next: "s3-leftover-choice",
    sfx: "gentle-whoosh",
  },

  "s3-cut-correct": {
    id: "s3-cut-correct",
    type: "narrate",
    tutorText:
      "GENIUS! If we cut each leftover bar into 4 equal pieces, "
      + "that gives us 12 little pieces total. "
      + "12 pieces divided among 4 monsters means 3 pieces each!",
    next: "s3-do-slice",
    sfx: "harp-gliss",
  },

  "s3-do-slice": {
    id: "s3-do-slice",
    type: "slice",
    tutorText:
      "Tap the chocolate bars to slice each one into 4 equal pieces. "
      + "Channel your inner pastry chef!",
    next: "s3-post-slice",
    sfx: "gentle-whoosh",
  },

  "s3-post-slice": {
    id: "s3-post-slice",
    type: "narrate",
    tutorText:
      "Beautiful slicing! Each bar is now in 4 equal pieces. "
      + "When you cut something into 4 equal parts, each piece is called a QUARTER — "
      + "or one fourth. Now give 3 pieces to each monster!",
    next: "s3-distribute-quarters",
    sfx: "chime",
  },

  "s3-distribute-quarters": {
    id: "s3-distribute-quarters",
    type: "distribute-halves",
    tutorText:
      "Drag the quarter pieces to the monsters — 3 pieces for each one!",
    characterCount: 4,
    next: "s3-total-q",
    sfx: "xylophone",
  },

  "s3-total-q": {
    id: "s3-total-q",
    type: "choice",
    tutorText:
      "Let's add it all up. Each monster got 1 whole bar, plus 3 quarter pieces. "
      + "3 quarters is the same as three fourths. "
      + "How much chocolate does each monster have altogether?",
    choices: [
      { label: "1 and three quarters", next: "s3-total-correct", correct: true },
      { label: "1 and a half", next: "s3-total-wrong-half", correct: false },
      { label: "A gazillion", next: "s3-total-wrong-gazillion", correct: false },
    ],
  },

  "s3-total-wrong-half": {
    id: "s3-total-wrong-half",
    type: "narrate",
    tutorText:
      "Close, but not quite! A half would be 2 out of 4 pieces. "
      + "But each monster got 3 out of 4 pieces — that's MORE than half! "
      + "3 out of 4 equal pieces is called three quarters. "
      + "So it's 1 whole bar plus three quarters. What's that altogether?",
    next: "s3-total-q",
    sfx: "gentle-whoosh",
  },

  "s3-total-wrong-gazillion": {
    id: "s3-total-wrong-gazillion",
    type: "narrate",
    tutorText:
      "A GAZILLION! If only! The monsters would build a chocolate swimming pool! "
      + "But let's count for real — each monster has 1 whole bar, "
      + "plus 3 little quarter pieces. 1 plus three quarters equals...?",
    next: "s3-total-q",
    sfx: "gentle-whoosh",
  },

  "s3-total-correct": {
    id: "s3-total-correct",
    type: "narrate",
    tutorText:
      "YES! ONE AND THREE QUARTERS! You absolute legend! "
      + "Now let's write that as a fraction — this is the coolest part!",
    next: "s3-know-quarters",
    sfx: "chime",
  },

  "s3-know-quarters": {
    id: "s3-know-quarters",
    type: "choice",
    tutorText:
      "We're about to write 'three quarters' as a fraction. "
      + "Do you know how to write a quarter as a fraction?",
    choices: [
      { label: "Yep, I've got it!", next: "s3-fraction-skip" },
      { label: "Show me how!", next: "s3-fraction-explain" },
    ],
  },

  "s3-fraction-skip": {
    id: "s3-fraction-skip",
    type: "narrate",
    tutorText:
      "Look at you, fraction whiz! Then feast your eyes on this!",
    next: "s3-show-fraction",
    sfx: "harp-gliss",
  },

  "s3-fraction-explain": {
    id: "s3-fraction-explain",
    type: "narrate",
    tutorText:
      "Remember — the BOTTOM number tells us how many equal pieces we cut the bar into. "
      + "We cut each bar into 4 pieces, so the bottom number is 4. "
      + "The TOP number tells us how many pieces each monster got — that's 3. "
      + "So three quarters is written as 3 on top, 4 on the bottom!",
    next: "s3-show-fraction",
    sfx: "gentle-whoosh",
  },

  "s3-show-fraction": {
    id: "s3-show-fraction",
    type: "show-fraction",
    tutorText:
      "BEHOLD! Each monster got 1 and three quarters chocolate bars! "
      + "The big 1 is the whole bar. The fraction shows three quarters — "
      + "3 on top, 4 on the bottom. Magnificent!",
    wholeNumber: 1,
    showFractionNum: 3,
    showFractionDen: 4,
    next: "finale-1",
    sfx: "sparkle",
  },

  // ===========================================================================
  // FINALE
  // ===========================================================================

  "finale-1": {
    id: "finale-1",
    type: "narrate",
    tutorText:
      "AND THAT'S A WRAP ON THE MONSTER BAKE-OFF! "
      + "All four monsters are rubbing their bellies and giving you a standing ovation. "
      + "Well, a sitting ovation. Monsters aren't great at standing after eating that much chocolate.",
    next: "finale-2",
    sfx: "music-box",
  },

  "finale-2": {
    id: "finale-2",
    type: "narrate",
    tutorText:
      "Let's look at what you accomplished today. "
      + "You shared 2 bars between 2 monsters — 1 each. "
      + "You shared 3 bars between 2 monsters — 1 and a half each. "
      + "And you shared 7 bars between 4 monsters — 1 and three quarters each!",
    next: "finale-3",
    sfx: "harp-gliss",
  },

  "finale-3": {
    id: "finale-3",
    type: "narrate",
    tutorText:
      "You learned about halves, quarters, and fractions — "
      + "all because you wanted to make sure every monster got a fair share. "
      + "That's real math, and YOU did it. The monsters are SO proud of you. "
      + "One of them is crying happy tears into its chocolate. "
      + "Come back anytime — the bake-off never ends!",
    next: "end",
    sfx: "music-box",
  },
};
