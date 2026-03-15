# Step 4: Story Polish & Sound Effects

## Dialogue Changes

### Tutor Personality
The tutor has been rewritten to feel like a warm, encouraging older sibling rather than a formal teacher:

- **"We" and "Let's" language**: "Let's make sure everyone gets the same amount!" instead of "See if you can divide these cookies evenly."
- **Conversational tone**: "Alright, here's where it gets interesting" instead of "But how about 5 cookies / 2 people?"
- **Brief celebrations**: "Nice!" and "That's it!" rather than long explanations.
- **Gentle redirects on wrong answers**: "Almost there!" and "Ha, fair enough!" -- never critical, always encouraging.

### Funny Wrong Answers
Every choice step now has at least one silly/playful option:

- "Feed it to a hungry dragon" (leftover cookie)
- "Stack it into a cookie tower" (leftover cookie)
- "A million" (how many cookies each?)
- "Ask the cookies what they think" (do you know fractions?)
- "I lost count, honestly" (harder challenge)

These are designed to make kids laugh while still redirecting to the lesson. The wrong-answer responses stay in character ("A dragon would definitely love a cookie!") and gently loop back.

### Structural Changes
- Same step IDs, same flow graph -- this is a drop-in replacement.
- Three new steps added for the new funny wrong answers: `dragon-response`, `tower-response`, `ask-cookies-response`, `wrong-million`, `lost-count-response`.
- The `wrong-three` step (originally reachable from `how-many-each`) is kept for backwards compatibility but the "Three" choice was replaced with "A million" in the choices list.
- The `LessonStep` interface gains an optional `sfx?: string` field.

## Sound Effects System

### `useSoundEffects.ts`
A React hook that generates all sounds procedurally using the Web Audio API. No audio files needed.

**API:**
```tsx
const { play, isMuted, toggleMute } = useSoundEffects();

play("ding");  // Play a sound
toggleMute();  // Toggle mute on/off
```

**Sound definitions:**

| Name       | Description                                  | Used When                  |
|------------|----------------------------------------------|----------------------------|
| `pop`      | Bright high-freq burst, quick decay          | Cookies appear on screen   |
| `slice`    | Sawtooth downward sweep with LP filter       | Slicing a cookie           |
| `ding`     | Bell-like sine tone with harmonic overtone    | Correct answer             |
| `boing`    | Oscillating frequency bounce (spring sound)  | Wrong answer (playful)     |
| `woosh`    | Filtered noise burst with bandpass sweep     | Distributing cookies       |
| `fanfare`  | Three ascending notes (C5-E5-G5) with shimmer | Lesson complete           |

### Design Decisions
- **Procedural synthesis** avoids loading/hosting audio files and keeps the bundle tiny.
- **AudioContext** is created lazily on first `play()` call, respecting browser autoplay policies.
- **Mute state** is managed inside the hook. When muted, `play()` is a no-op.
- **SSR-safe**: the hook catches errors if `AudioContext` is not available.

## Integration Instructions

### 1. Replace `lessonData.ts`
Copy `lessonData.ts` to `app/src/app/lib/lessonData.ts`, replacing the existing file. It exports the same types and the same `lessonSteps` object, so no import changes are needed elsewhere.

### 2. Add the sound effects hook
Copy `useSoundEffects.ts` to `app/src/app/hooks/useSoundEffects.ts` (or wherever you keep hooks).

### 3. Wire up sounds in `page.tsx`

```tsx
import { useSoundEffects } from "./hooks/useSoundEffects";

export default function Home() {
  const { play, isMuted, toggleMute } = useSoundEffects();
  const [stepId, setStepId] = useState("start");

  const step = lessonSteps[stepId];

  // Play the sfx for the current step when it changes
  useEffect(() => {
    if (step?.sfx) {
      play(step.sfx);
    }
  }, [stepId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ... rest of component
```

### 4. Add a mute button
Replace or augment the existing pause button:

```tsx
<button
  onClick={toggleMute}
  className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-20 cursor-pointer"
  aria-label={isMuted ? "Unmute" : "Mute"}
>
  {isMuted ? "🔇" : "🔊"}
</button>
```

### 5. Optional: trigger sounds on user actions
For more responsive feedback, you can also call `play()` directly on user actions:

```tsx
const handleSliceCookie = useCallback((id: string) => {
  play("slice");
  // ... existing slice logic
}, [play, step]);

const handleChoice = useCallback((nextId: string, isCorrect?: boolean) => {
  // If you want immediate feedback before navigation:
  // play(isCorrect ? "ding" : "boing");
  setStepId(nextId);
}, []);
```

The step-level `sfx` field handles most cases automatically, but action-triggered sounds feel more immediate for slice and distribute interactions.
