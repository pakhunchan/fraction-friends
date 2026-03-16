# Demo Script: Fraction Friends (1-2 min)

## Context
Jackie needs a timed talking-points script for a 1-2 minute demo video of "Fraction Friends" — a Synthesis Tutor clone built in 1 week. The audience is Patrick Skinner and the Superbuilders team, who are evaluating whether the prototype meets the challenge requirements (conversational tutor, interactive manipulative, fraction equivalence lesson flow).

## Strategy
- **Open on the app** — no title slides, jump straight in
- **Use the equivalence lesson** (`/equivalence`) as the primary demo path since that directly matches the spec requirement
- **Narrate over a live walkthrough** — show tutor + workspace interaction in real time
- **Close with brief technical highlights** that show going beyond the brief

---

## Script (~90 seconds)

### Opening (0:00 – 0:10)
> "This is Fraction Friends — a story-driven math tutor that teaches fraction equivalence through interactive manipulatives and a conversational guide. Let me walk you through the equivalence lesson."

**Action:** App is already loaded on the equivalence lesson landing. Tap "Tap to begin."

---

### Tutor + Manipulative Demo (0:10 – 0:55)
> "The tutor introduces the concept through a story — four friendly monsters are sharing brownies in a kitchen. The tutor speaks each line aloud using ElevenLabs text-to-speech."

**Action:** Let 1-2 narration steps play so the audience hears the TTS voice and sees the tutor panel.

> "Now the student gets hands-on. I need to cut this brownie in half and give each monster a fair share."

**Action:** Switch to knife mode, slice the brownie, then drag pieces to characters. Show character moods reacting (happy when fair).

> "Here's the key moment — the tutor asks: what if we cut the same brownie into four pieces instead of two? The student slices again, and can see visually that two-quarters is the same amount as one-half."

**Action:** Demonstrate the equivalence discovery step — slice into quarters, distribute, show the fraction display (1/2 = 2/4).

> "Then there's a quiz section with multiple-choice questions to check understanding, with encouraging cheer screens between each challenge."

**Action:** Answer a quiz question correctly, show the cheer screen animation briefly.

---

### Technical Highlights (0:55 – 1:20)
> "A few things I'm proud of technically:
> - **Zero audio files** — all sound effects are procedurally synthesized with the Web Audio API. Background music too.
> - **Four original SVG characters** with three mood states each — they react dynamically to whether you're sharing fairly.
> - **Audio ducking** — background music automatically dips when sound effects play, then recovers.
> - I built two complete lessons, not just one — the intro lesson teaches basic fractions through a midnight-snack sleepover story."

**Action:** Optionally quick-flash the landing page showing both lesson cards.

---

### Close (1:20 – 1:30)
> "Built in one week with Next.js, React, Tailwind, and the Web Audio API. Runs on iPad Safari. That's Fraction Friends."

---

## Tips for Recording
- **Use the equivalence lesson** (`/equivalence`) — it directly matches the spec
- **Pre-load the app** so there's no loading spinner
- **Keep TTS unmuted** for the first few tutor lines so the reviewer hears the voice, then you can mute it to save time and narrate over
- **Practice the knife → distribute → equivalence reveal flow** — that's the money shot
- **Screen record on iPad or desktop** — both work, iPad matches the deliverable requirement

## Key Moments to Hit (maps to spec requirements)
1. **Conversational Tutor Interface** ✓ — tutor panel with scripted dialogue, TTS voice, branching on correct/incorrect
2. **Interactive Digital Manipulative** ✓ — brownie splitting, drag-to-distribute, visual fraction display
3. **Lesson Flow** ✓ — exploration → formal questions → check for understanding (quiz section)
