# PRD: Math Tutor — Asset & Feature Upgrades

## Overview

Upgrade the existing math tutor from placeholder SVGs and text-only interaction to a polished, engaging experience with real graphics, voice, and story polish.

---

## Step 1: Graphics for Dividable Objects

**Goal:** Replace inline SVG cookie graphics with visually appealing, textured cookie art.

**Current state:** Flat brown SVG circles with dot "chips." Semicircles for halves, quarter-circle wedges for quarters.

**Requirements:**
- Create cookie assets: whole, half-left, half-right, quarter
- Each should have visual texture (chocolate chips, golden-brown color, shadows/highlights)
- SVG format preferred (scales cleanly, stays in-repo, no binary assets)
- Slice animation: cookie should visually split apart when cut
- Assets must plug into existing `Cookie.tsx` component which already handles `whole`, `half-left`, `half-right`, `quarter` types

**Output:** Drop-in replacement graphics in `step1-dividable-objects/attempt1/`

---

## Step 2: Graphics for Characters

**Goal:** Replace inline SVG blob characters with charming, distinct cartoon characters.

**Current state:** Ellipse faces with dot eyes, curved mouth, colored shirt. 4 color palettes. Mood changes mouth curve only.

**Requirements:**
- 4 distinct characters with personality (different hair, accessories, skin tones, shirt colors)
- 3 mood variants each: neutral, happy, sad (12 total illustrations)
- SVG format preferred
- Must work at ~100x100px display size (current `Character.tsx` viewport)
- Characters should feel kid-friendly, warm, cartoon-style
- Must plug into existing `Character` component which switches on `mood` prop

**Output:** Drop-in replacement character graphics in `step2-character-graphics/attempt1/`

---

## Step 3: Text-to-Speech Integration

**Goal:** Make the tutor speak aloud using text-to-speech.

**Current state:** Tutor text is rendered as static `<p>` elements in `TutorPanel.tsx`. No audio.

**Requirements:**
- Use the Web Speech API (`window.speechSynthesis`) — zero cost, works on iPad Safari
- Speak each step's `tutorText` when the step loads
- Select a warm, friendly voice (prefer female voice if available)
- Allow speech to be interrupted when moving to next step
- Add a mute/unmute toggle button
- Do NOT require any API keys or external services
- Wire into existing `TutorPanel.tsx` and `page.tsx` step transition logic

**Output:** Working TTS hook and updated components in `step3-text-to-speech/attempt1/`

---

## Step 4: Story & Audio Polish

**Goal:** Improve the tutor dialogue warmth and add sound effects.

**Current state:** 33-step lesson script in `lessonData.ts`. Functional but somewhat dry. No sound effects or music.

**Requirements:**
- Rewrite tutor dialogue to be warmer, more encouraging, more playful
- Add at least one playful wrong answer to every choice step
- Add sound effect triggers at key moments: cookie place, cookie slice, correct answer, wrong answer, level complete
- Create a simple SFX system (Web Audio API or `<audio>` elements with generated/sourced sounds)
- Add optional background ambient audio (subtle, not distracting)
- All audio should be toggleable (respect the mute button from Step 3)

**Output:** Updated lesson data and SFX system in `step4-story-polish/attempt1/`
