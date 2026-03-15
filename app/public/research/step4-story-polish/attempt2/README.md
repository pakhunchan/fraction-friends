# Step 4 (Attempt 2): Story & Audio Polish -- Narrative Craft + Audio Design

## Narrative Design

### Meet "Cookie" the Tutor

The tutor is no longer an anonymous voice. She is **Cookie**, a friendly cookie-sharing expert who speaks directly to the kid as a co-conspirator. The framing: "I have a problem and I need YOUR help." This shifts the child from passive receiver to active helper -- the most engaging position for a young learner.

### Story Arc

The lesson follows a three-act structure:

1. **Act 1 -- The Easy Win** (4 cookies / 2 friends): A warm-up that builds confidence. Cookie celebrates the kid immediately ("You figured that out so fast!"). The goal is to make the child feel competent before any challenge arrives.

2. **Act 2 -- The Conflict** (5 cookies / 2 friends): "Uh oh... there's one cookie left and two hungry friends. This is tricky!" The odd-one-out cookie creates genuine dramatic tension. The child has to invent a solution (cutting), which makes the fraction feel like THEIR discovery, not a lecture.

3. **Act 3 -- The Boss Level** (5 cookies / 4 friends): Two more friends arrive unexpectedly ("Hold on -- two more friends just showed up!"). The stakes rise. The child applies what they learned (cutting) in a harder context (quarters instead of halves). Victory here feels earned.

### Wrong Answer Philosophy

Wrong answers are designed to be **funny, not punishing**. The goal: kids should WANT to click the wrong answer to see what happens, then circle back to the correct one with a smile.

- "Launch it into space" triggers a woosh sound and Cookie reacting with surprise
- "Eat it myself" gets a conspiratorial "Sneaky! But I think your friends might notice the crumbs on your face..."
- "Forty-seven" (in the final question) gets "I WISH we had that many cookies!"
- "Can we ask the cookies?" gets a direct quote from the cookies: "crumble crumble crumble"

No wrong answer says "wrong" or "incorrect." They redirect with humor and a gentle hint.

### tutorEmotion Field

Each step includes a `tutorEmotion` field for future avatar animation:

| Emotion | When Used | Suggested Visual |
|-------------|----------------------------------------------|-------------------------------|
| `excited` | Introducing new challenges, correct-answer praise | Wide eyes, leaning forward |
| `thinking` | Posing questions, reacting to wrong answers | Hand on chin, looking up |
| `celebrating` | Correct answers, phase completions | Arms up, big grin |
| `surprised` | Funny wrong answers, unexpected moments | Raised eyebrows, open mouth |

### Transition Beats

Attempt 1 jumped directly between phases. Attempt 2 adds **narrative bridge steps** (`phase2-setup`, `slice-reaction`, `halves-done`, `phase4-transition`) that give Cookie a moment to react emotionally before the next challenge. These make the experience feel like a conversation rather than a sequence of tasks.

---

## Sound Effects Design

### System Architecture

`useSoundEffects.ts` is a React hook built entirely on the **Web Audio API** -- no audio files needed. Every sound is synthesized in real time.

```
AudioContext
  -> masterGain (volume + mute control)
    -> individual synth patches (fire-and-forget)
    -> ambient pad (looping, stoppable)
```

Key design decisions:
- **Lazy initialization**: AudioContext is created on first `play()` call, respecting browser autoplay policies
- **Refs over state**: All internal values use `useRef` to avoid re-renders when volume/mute changes
- **Self-cleaning**: Each sound schedules its own `stop()` time; no manual cleanup needed except for ambient
- **Graceful degradation**: Returns no-op if Web Audio API is unavailable

### Sound Palette

| Name | Musical Description | Technical Approach | When to Trigger |
|------------|----------------------------------------------|----------------------------------------------|------------------------------|
| `pop` | C major triad pluck (C4+E4+G4) | 3 triangle oscillators, fast attack, 250ms decay | Cookie placed on a plate |
| `slice` | Descending chromatic slash + crunch | Sawtooth glissando 2400->300 Hz + bandpass noise burst | Cookie sliced |
| `ding` | Glockenspiel ascending chime (E5->G5) | Sine + inharmonic partial (x2.76) for bell timbre | Correct answer, fraction shown |
| `boing` | Cartoony spring bounce | FM synthesis: sine carrier with pitch bend, sine modulator with decaying depth | Funny wrong answer |
| `woosh` | Wind sweep, left-to-right stereo pan | White noise through sweeping bandpass (200->4000 Hz), StereoPanner L->R | Scene transition, space joke |
| `fanfare` | 4-note ascending melody (C4-E4-G4-C5) | Square wave through LPF, delay-line reverb (180ms, 25% feedback) | Phase complete, lesson end |
| `wrong` | Gentle descending "uh-oh" (E4->C4) | Two sine tones, 180ms apart, soft envelope | Incorrect answer (non-funny) |
| `ambient` | Warm C major pad drone | 3 sine oscillators (C3+E3+G3) with independent slow vibrato LFOs, very low gain (0.04) | Background during lesson |

### Audio Design Principles

1. **Musical, not mechanical**: Every sound is tuned to a real musical interval. The pop is a major chord. The fanfare is a C major arpeggio. The wrong sound is a descending minor third -- the universal "uh-oh" interval.

2. **Kid-safe dynamics**: No sound exceeds 0.25 peak gain before the master gain. The ambient pad maxes at 0.04. Nothing is harsh, sudden, or startling.

3. **Timbrally distinct**: Each sound occupies a different frequency range and uses a different synthesis technique (additive, subtractive, FM, noise-based). Even without looking at the screen, a child can tell what just happened by ear.

---

## Integration Guide

### 1. Drop-in file replacement

Copy these files into the app:

```
lessonData.ts   -> app/src/app/lib/lessonData.ts
useSoundEffects.ts -> app/src/app/hooks/useSoundEffects.ts
```

### 2. Wire the hook into page.tsx

```tsx
import { useSoundEffects, SfxName } from "./hooks/useSoundEffects";
import { lessonSteps, LessonStep } from "./lib/lessonData";

export default function Home() {
  const sfx = useSoundEffects();
  const [stepId, setStepId] = useState("start");
  const step = lessonSteps[stepId];

  // Play sfx when step changes
  useEffect(() => {
    if (step?.sfx) {
      sfx.play(step.sfx as SfxName);
    }
  }, [stepId]);

  // In your mute button handler:
  // sfx.setMuted(true/false);

  // ...rest of component
}
```

### 3. Additional trigger points

Beyond step-level sfx, you may want to trigger sounds on specific user interactions:

```tsx
// When a cookie is dropped onto a character plate:
sfx.play("pop");

// When the knife tool slices a cookie:
sfx.play("slice");

// When distribution is complete and all characters are happy:
sfx.play("ding");
```

### 4. Coordinate with TTS (Step 3)

If using the Web Speech API TTS from Step 3, you may want to delay sfx playback until speech finishes, or duck (lower volume of) the sfx during speech:

```tsx
// Duck sfx while speaking
speechSynthesis.onstart = () => sfx.setVolume(0.3);
speechSynthesis.onend = () => sfx.setVolume(0.7);
```

### 5. New step IDs

This attempt adds several new steps not present in the original:

| New Step ID | Purpose |
|-----------------------|----------------------------------------------|
| `phase2-setup` | Narrative bridge between Phase 1 and Phase 2 |
| `space-response` | Funny wrong answer: launch cookie into space |
| `sneaky-response` | Funny wrong answer: eat it myself |
| `slice-reaction` | Cookie celebrates the perfect cut |
| `halves-done` | Emotional beat before the counting question |
| `no-worries-fraction` | Encouraging response to "Not yet!" |
| `fraction-confirm` | Deeper explanation for kids who said "Yep!" |
| `fraction-new` | Welcoming explanation for kids who said "That's new!" |
| `phase4-transition` | Dramatic bridge into the final challenge |
| `wrong-fortyseven` | Funny wrong answer: forty-seven cookies |

The `know-word-fraction` step now branches to `fraction-confirm` or `fraction-new` instead of the single `explain-fraction`, giving a more personalized response. The `explain-fraction` step is retained as a fallback but is no longer on the main path.

### 6. The tutorEmotion field

The new `tutorEmotion` field on each step is purely additive -- it does not affect any existing logic. It is there for future avatar/animation work. Components can read it as:

```tsx
const emotion = step.tutorEmotion ?? "excited";
```
