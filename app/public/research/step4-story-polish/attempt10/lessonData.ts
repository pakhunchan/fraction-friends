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
  // PHASE 1: Easy warm-up (4 slices, 2 friends)
  // ─────────────────────────────────────────────

  start: {
    id: "start",
    type: "narrate",
    tutorText:
      "Yo yo YO, welcome to DJ Melon Drop's Summer Picnic Jam! The sun is shining, the tunes are bumpin', and we've got a blanket spread out on the grass. But here's the real headline -- we've got watermelon slices to share, crew!",
    next: "p1_intro_friends",
    sfx: "fanfare",
  },

  p1_intro_friends: {
    id: "p1_intro_friends",
    type: "narrate",
    tutorText:
      "Alright, check the vibe -- two of your best friends just rolled up to the picnic: Maya and Kai. They're hungry, the sun is hot, and we've got exactly 4 juicy watermelon slices on the plate. Let's share 'em fair and square!",
    next: "p1_distribute",
    sfx: "pop",
  },

  p1_distribute: {
    id: "p1_distribute",
    type: "distribute",
    tutorText:
      "Drop those slices, one at a time, to Maya and Kai. Keep it even, like a steady beat -- no one gets more than anyone else!",
    taskHeader: "Share the watermelon slices equally!",
    cookieCount: 4,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "p1_quiz",
    sfx: "pop",
  },

  p1_quiz: {
    id: "p1_quiz",
    type: "choice",
    tutorText:
      "Niiice distribution, DJ-in-training! So tell me -- how many watermelon slices did each friend get?",
    taskHeader: "How many slices does each person have?",
    choices: [
      { label: "2 each", next: "p1_correct", correct: true },
      {
        label: "4 each",
        next: "p1_wrong_greedy",
      },
      {
        label: "0 -- the ants took them all",
        next: "p1_wrong_ants",
      },
    ],
    sfx: "boing",
  },

  p1_wrong_greedy: {
    id: "p1_wrong_greedy",
    type: "narrate",
    tutorText:
      "Ha! 4 each? That would be 8 slices total, and we only had 4! That's like playing a song at double speed -- the math doesn't groove. Try again, crew!",
    next: "p1_quiz",
    sfx: "boing",
  },

  p1_wrong_ants: {
    id: "p1_wrong_ants",
    type: "narrate",
    tutorText:
      "LOL, the ants!! Nah, we put the blanket down on ant-free turf. Those slices are safe. Count 'em up again -- how many does each friend actually have?",
    next: "p1_quiz",
    sfx: "boing",
  },

  p1_correct: {
    id: "p1_correct",
    type: "narrate",
    tutorText:
      "BOOM! 2 each -- that's the perfect split! 4 slices divided by 2 friends equals 2 slices per person. Smooth like a summer breeze, crew. But hold up... the next track is about to drop, and it's a tricky one.",
    next: "p2_setup",
    sfx: "ding",
  },

  // ─────────────────────────────────────────────
  // PHASE 2: Conflict (5 slices, 2 friends)
  // ─────────────────────────────────────────────

  p2_setup: {
    id: "p2_setup",
    type: "narrate",
    tutorText:
      "Alright, plot twist! Someone brought MORE watermelon to the picnic. Now we've got 5 slices on the plate, and it's still just Maya and Kai. Let's share 'em out!",
    next: "p2_distribute",
    sfx: "woosh",
  },

  p2_distribute: {
    id: "p2_distribute",
    type: "distribute",
    tutorText:
      "Go ahead -- hand out the watermelon slices evenly, one by one. But uh... you might notice something interesting this time.",
    taskHeader: "Share 5 slices between 2 friends!",
    cookieCount: 5,
    characterCount: 2,
    expectedPerPerson: 2,
    next: "p2_leftover",
    sfx: "pop",
  },

  p2_leftover: {
    id: "p2_leftover",
    type: "narrate",
    tutorText:
      "Whoa whoa whoa -- hold the music! There's one slice left over just sitting on the plate. We gave 2 to Maya, 2 to Kai, and that fifth slice is vibin' all alone. What do we do?",
    next: "p2_conflict_choice",
    sfx: "boing",
  },

  p2_conflict_choice: {
    id: "p2_conflict_choice",
    type: "choice",
    tutorText:
      "Yo crew, we've got a leftover slice situation. What's the move?",
    taskHeader: "What should we do with the extra slice?",
    choices: [
      {
        label: "Cut it in half and share!",
        next: "p2_slice",
        correct: true,
      },
      {
        label: "Have a seed-spitting contest for it",
        next: "p2_wrong_spit",
      },
      {
        label: "Leave it out -- maybe a seagull wants it",
        next: "p2_wrong_seagull",
      },
    ],
    sfx: "boing",
  },

  p2_wrong_spit: {
    id: "p2_wrong_spit",
    type: "narrate",
    tutorText:
      "A seed-spitting contest?! I respect the competitive energy, but that's not exactly fair sharing, fam. Plus last time someone did that, seeds went in the lemonade. Let's think of a way to split it EVENLY.",
    next: "p2_conflict_choice",
    sfx: "boing",
  },

  p2_wrong_seagull: {
    id: "p2_wrong_seagull",
    type: "narrate",
    tutorText:
      "Nah, we are NOT feeding the seagulls! Last picnic a seagull stole a whole sandwich right out of Kai's hand. We can do better than that -- there's a way to make this fair for everyone!",
    next: "p2_conflict_choice",
    sfx: "boing",
  },

  p2_slice: {
    id: "p2_slice",
    type: "slice",
    tutorText:
      "Now THAT'S the remix I was looking for! Grab that knife and cut that watermelon slice right down the middle -- two equal halves!",
    taskHeader: "Slice the leftover piece in half!",
    cookieCount: 1,
    next: "p2_distribute_halves",
    sfx: "slice",
  },

  p2_distribute_halves: {
    id: "p2_distribute_halves",
    type: "distribute-halves",
    tutorText:
      "Beautiful cut! Now give one half to Maya and one half to Kai. Fair and square, just like the beat!",
    taskHeader: "Give each friend one half!",
    cookieCount: 2,
    characterCount: 2,
    expectedPerPerson: 1,
    next: "p2_total_quiz",
    sfx: "pop",
  },

  p2_total_quiz: {
    id: "p2_total_quiz",
    type: "choice",
    tutorText:
      "Alright, moment of truth! Each friend got 2 whole slices plus half a slice. So how much watermelon does each person have in total?",
    taskHeader: "How much watermelon does each friend have?",
    choices: [
      {
        label: "2 and a half slices",
        next: "p2_total_correct",
        correct: true,
      },
      {
        label: "3 slices -- I rounded up for vibes",
        next: "p2_wrong_round",
      },
      {
        label: "2 slices -- halves don't count",
        next: "p2_wrong_ignore",
      },
    ],
    sfx: "boing",
  },

  p2_wrong_round: {
    id: "p2_wrong_round",
    type: "narrate",
    tutorText:
      "Ha! 'Rounded up for vibes' -- I love the energy, but in math we gotta keep it real. They got 2 whole slices and then a little extra. That extra piece is smaller than a whole slice, so it can't be 3. What's 2 whole slices plus a half?",
    next: "p2_total_quiz",
    sfx: "boing",
  },

  p2_wrong_ignore: {
    id: "p2_wrong_ignore",
    type: "narrate",
    tutorText:
      "Yo, halves TOTALLY count! That's like saying the DJ's encore doesn't count as part of the show. A half is real food and real math. 2 whole slices plus that half slice equals...?",
    next: "p2_total_quiz",
    sfx: "boing",
  },

  p2_total_correct: {
    id: "p2_total_correct",
    type: "narrate",
    tutorText:
      "YES! 2 and a half! That's the hit single right there. Each friend walks away with 2 whole slices and half a slice. Now let me show you something cool -- how math people write that down.",
    next: "p2_show_whole",
    sfx: "ding",
  },

  p2_show_whole: {
    id: "p2_show_whole",
    type: "show-number",
    tutorText:
      "Check it -- the 2 whole slices? We just write that as the number 2. Easy! Whole slices, whole number. Clean beat, no remix needed.",
    showNumber: "2",
    next: "p2_show_fraction",
    sfx: "woosh",
  },

  p2_show_fraction: {
    id: "p2_show_fraction",
    type: "show-fraction",
    tutorText:
      "Now the HALF slice -- that's where fractions enter the mix! We write it as 1 over 2. The top number says how many pieces we've got: 1. The bottom number says how many pieces the whole slice was cut into: 2. One out of two pieces -- that's one half!",
    showFractionNum: 1,
    showFractionDen: 2,
    next: "p2_show_mixed",
    sfx: "woosh",
  },

  p2_show_mixed: {
    id: "p2_show_mixed",
    type: "show-fraction",
    tutorText:
      "Put 'em together and you get 2 and 1/2 -- a whole number AND a fraction hanging out, like a DJ collab! Math folks call this a 'mixed number.' Two and one-half watermelon slices per person. That's the jam!",
    wholeNumber: 2,
    showFractionNum: 1,
    showFractionDen: 2,
    next: "p3_bridge",
    sfx: "ding",
  },

  // ─────────────────────────────────────────────
  // PHASE 3: Bridge to symbolic
  // ─────────────────────────────────────────────

  p3_bridge: {
    id: "p3_bridge",
    type: "narrate",
    tutorText:
      "Alright crew, let's pause the music for a sec and talk about what just happened. When we shared 4 slices between 2 friends, everyone got a nice WHOLE number -- 2. No cutting, no drama, just clean sharing.",
    next: "p3_explain_fraction",
    sfx: "woosh",
  },

  p3_explain_fraction: {
    id: "p3_explain_fraction",
    type: "narrate",
    tutorText:
      "But when we had 5 slices for 2 friends? Things didn't divide evenly, so we had to SLICE. That's when fractions show up to the party! A fraction is just what happens when you cut something into equal pieces. The bottom number tells you how many cuts, and the top number tells you how many pieces you grabbed.",
    next: "p3_real_life",
    sfx: "woosh",
  },

  p3_real_life: {
    id: "p3_real_life",
    type: "choice",
    tutorText:
      "Quick vibe check! Which of these is a fraction situation?",
    taskHeader: "Which one needs a fraction?",
    choices: [
      {
        label: "Splitting 1 popsicle between 2 people",
        next: "p3_correct",
        correct: true,
      },
      {
        label: "Putting on sunscreen",
        next: "p3_wrong_sunscreen",
      },
      {
        label: "Doing a cannonball into the pool",
        next: "p3_wrong_cannonball",
      },
    ],
    sfx: "boing",
  },

  p3_wrong_sunscreen: {
    id: "p3_wrong_sunscreen",
    type: "narrate",
    tutorText:
      "Sunscreen is important -- SPF 50, always! -- but it's not really a fraction situation. We're looking for something where you need to SPLIT or SHARE evenly. Which one involves dividing something up?",
    next: "p3_real_life",
    sfx: "boing",
  },

  p3_wrong_cannonball: {
    id: "p3_wrong_cannonball",
    type: "narrate",
    tutorText:
      "A cannonball! Maximum splash, maximum style. But you can't really split a cannonball between people -- you just DO it. Which answer involves sharing something that doesn't divide evenly?",
    next: "p3_real_life",
    sfx: "boing",
  },

  p3_correct: {
    id: "p3_correct",
    type: "narrate",
    tutorText:
      "That's the one! 1 popsicle, 2 people -- you gotta snap it in half. Each person gets 1/2. Fractions are everywhere at summer picnics, crew. Now... are you ready for the FINAL challenge? The bass is about to DROP.",
    next: "p4_setup",
    sfx: "ding",
  },

  // ─────────────────────────────────────────────
  // PHASE 4: Harder challenge (5 slices, 4 friends)
  // ─────────────────────────────────────────────

  p4_setup: {
    id: "p4_setup",
    type: "narrate",
    tutorText:
      "OH SNAP -- two more friends just showed up: Lina and Dev! Now we've got FOUR hungry people at this picnic, and 5 watermelon slices on the plate. This is the final track, crew. Let's figure this out!",
    next: "p4_distribute",
    sfx: "fanfare",
  },

  p4_distribute: {
    id: "p4_distribute",
    type: "distribute",
    tutorText:
      "Hand out the slices evenly to all four friends. One at a time, keep it fair! You've got the knife ready if you need it.",
    taskHeader: "Share 5 slices among 4 friends!",
    cookieCount: 5,
    characterCount: 4,
    expectedPerPerson: 1,
    allowKnife: true,
    next: "p4_leftover",
    sfx: "pop",
  },

  p4_leftover: {
    id: "p4_leftover",
    type: "narrate",
    tutorText:
      "Okay, everyone's got 1 whole slice, but there's 1 slice left! We've been here before -- you know the move. Time to cut it up, but this time into FOUR equal pieces!",
    next: "p4_slice",
    sfx: "boing",
  },

  p4_slice: {
    id: "p4_slice",
    type: "slice",
    tutorText:
      "Slice that watermelon into 4 equal pieces -- cut it across the middle both ways. Four friends, four pieces. Let's go!",
    taskHeader: "Cut the leftover slice into 4 equal pieces!",
    cookieCount: 1,
    characterCount: 4,
    next: "p4_distribute_quarters",
    sfx: "slice",
  },

  p4_distribute_quarters: {
    id: "p4_distribute_quarters",
    type: "distribute-halves",
    tutorText:
      "Now give one quarter-piece to each of the four friends. Everybody eats, nobody beefs. That's the DJ Melon Drop guarantee!",
    taskHeader: "Give each friend one quarter!",
    cookieCount: 4,
    characterCount: 4,
    expectedPerPerson: 1,
    next: "p4_quiz",
    sfx: "pop",
  },

  p4_quiz: {
    id: "p4_quiz",
    type: "choice",
    tutorText:
      "Final question, crew! Each friend got 1 whole slice plus 1 piece of a slice that was cut into 4. How much watermelon does each person have?",
    taskHeader: "How much does each friend have in total?",
    choices: [
      {
        label: "1 and 1/4 slices",
        next: "p4_correct",
        correct: true,
      },
      {
        label: "1 and 1/2 slices",
        next: "p4_wrong_half",
      },
      {
        label: "5 slices -- everyone shared one giant plate",
        next: "p4_wrong_plate",
      },
    ],
    sfx: "boing",
  },

  p4_wrong_half: {
    id: "p4_wrong_half",
    type: "narrate",
    tutorText:
      "Close, but we're mixing up our remixes! We cut the leftover slice into FOUR pieces, not two. So each piece is one-fourth, not one-half. One whole slice plus one-fourth of a slice is...?",
    next: "p4_quiz",
    sfx: "boing",
  },

  p4_wrong_plate: {
    id: "p4_wrong_plate",
    type: "narrate",
    tutorText:
      "Haha, 5 slices each?! That would be 20 slices total and we'd need a watermelon the size of a beach ball! We only had 5 slices split among 4 people. How much does ONE person get?",
    next: "p4_quiz",
    sfx: "boing",
  },

  p4_correct: {
    id: "p4_correct",
    type: "show-fraction",
    tutorText:
      "YOOOO, you NAILED it! 1 and 1/4! One whole slice plus one quarter. Look at that beautiful mixed number -- the 1 is the whole slice, and the 1/4 is that little bonus piece!",
    wholeNumber: 1,
    showFractionNum: 1,
    showFractionDen: 4,
    next: "end",
    sfx: "fanfare",
  },

  end: {
    id: "end",
    type: "narrate",
    tutorText:
      "AND THAT'S A WRAP on DJ Melon Drop's Fraction Picnic! You learned that sharing doesn't always come out even -- and when it doesn't, we SLICE, we SHARE, and we get FRACTIONS. The top number is how many pieces you grabbed, the bottom number is how many equal pieces there are. Now go enjoy the sunshine, crew -- you've earned it! DJ Melon Drop, OUT!",
    sfx: "fanfare",
  },
};
