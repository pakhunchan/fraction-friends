# Fraction Friends

An interactive, conversational math tutor that teaches early fraction concepts through story-driven lessons with hands-on manipulatives. Students share food with friendly monsters and discover fraction equivalence by slicing and distributing pieces — guided by a narrated tutor with branching dialogue. Designed for children ages 6–8 and optimized for iPad Safari.

## Features

- **Two complete lessons** with distinct stories and manipulatives
  - *Midnight Snack* — monsters at a sleepover share chocolate bars to learn halves and quarters
  - *Same Size, Different Names* — monsters in a kitchen share brownies to discover that 1/2 = 2/4
- **Conversational tutor** with scripted, branching dialogue — warm and encouraging, deterministic and safe for kids (no LLM at runtime)
- **Interactive manipulatives** — tap to slice objects into halves or quarters, drag pieces to characters, and watch them react
- **Four original SVG monster characters** with three mood states each (happy, neutral, sad) that respond dynamically to fair or unfair sharing
- **Text-to-speech narration** powered by ElevenLabs, cached in S3 for instant playback
- **Zero audio files** — all 16 sound effects and background music are procedurally synthesized in the browser using the Web Audio API
- **Audio ducking** — background music automatically dips when sound effects or TTS play, then smoothly recovers
- **Check-for-understanding quizzes** woven into the story, with motivational cheer screens between questions
- **Built for iPad** with touch-friendly interactions and responsive layout

## Lessons

### Lesson 1: Midnight Snack (`/basic`)

A cozy sleepover bedtime story. Two friendly monsters want a midnight snack, and the student helps share chocolate bars fairly. The lesson progresses through four phases:

1. **Warm-up** — share 4 chocolate bars between 2 monsters (whole number division)
2. **Conflict** — 5 chocolate bars for 2 monsters introduces the need to split (halves)
3. **Notation** — the tutor introduces fraction notation (½)
4. **Challenge** — 5 chocolate bars for 4 monsters introduces quarters (¼)

### Lesson 2: Same Size, Different Names (`/equivalence`)

Four friendly monsters are baking brownies in a kitchen. The student slices and distributes brownies, then makes a key discovery:

1. **Review halves** — slice a brownie in half and share it between two monsters
2. **Discovery** — slice the same brownie into quarters instead, and see that 2/4 covers the same amount as 1/2
3. **Reinforcement** — multiple-choice quiz questions with cheer screens to celebrate progress

This lesson directly teaches fraction equivalence (1/2 = 2/4), the core concept from the challenge spec.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and run

```bash
git clone <repo-url>
cd app
npm install
cp .env.local.example .env.local   # then fill in your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (or iPad Safari).

### Environment variables

Create a `.env.local` file in the `app/` directory:

| Variable | Description |
|---|---|
| `ELEVENLABS_API_KEY` | API key for ElevenLabs text-to-speech narration |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 TTS cache (local dev only) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 TTS cache (local dev only) |
| `AWS_REGION` | AWS region (defaults to `us-west-2`) |
| `S3_TTS_CACHE_BUCKET` | S3 bucket name used to cache generated TTS audio |

In production (Vercel), AWS credentials are provided via OIDC federation — no stored secrets needed.

## Technical Approach

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4

### Development Process

I started by decomposing what a tutor like Synthesis actually requires — a conversational guide, interactive manipulatives, a lesson script with branching, audio feedback, and voice narration. Then I had Claude generate each component independently: original SVG characters and divisible objects, playful stories that would appeal to kids, sound effects and background music using the Web Audio API, and instructor text-to-speech using the ElevenLabs API. Once each piece worked in isolation, I combined them into a cohesive lesson flow. I used Xcode's Simulator to run an iPad emulator throughout development to adjust layout and touch interactions for iPad Safari.

### Scripted Lesson Engine

Each lesson is defined as a directed graph of steps in TypeScript. Steps have a `type` that determines what the UI renders and how the student interacts. The graph supports branching — correct and incorrect answers lead to different paths, and the tutor responds accordingly.

| Step type | Behavior |
|---|---|
| `narrate` | Tutor speaks a line; student taps to continue |
| `choice` | Multiple-choice buttons with correct/incorrect branching |
| `distribute` | Student drags objects to characters |
| `slice` | Student taps an object to split it (halves or quarters) |
| `distribute-halves` | Student drags sliced pieces to characters |
| `show-fraction` | Displays a fraction (e.g., ½) with visual emphasis |
| `show-number` | Displays a whole number or mixed number |
| `cheer` | Animated motivational celebration screen |

This data-driven approach makes lessons easy to author — adding a new lesson is just writing a new step graph in TypeScript, no component changes needed.

### Component Architecture

The page component for each lesson acts as the game engine. It reads the current step from the lesson graph, manages state (pieces, characters, tool mode, moods), and delegates rendering to shared components:

- **TutorPanel** — left panel with narration text, speaking indicator, choice buttons, and mute toggles for voice/SFX/music
- **Workspace** — right panel with the interactive manipulative area, character lineup, tool switcher (move/knife), and fraction displays
- **Character** — four distinct SVG monsters (purple blob, green tall, orange triangle, blue cloud) each with happy/neutral/sad expressions
- **DividableObject** — sliceable chocolate bar SVG used in Lesson 1
- **Brownie** — detailed SVG brownie with procedural crackle texture, cut-face geometry, and proportional sizing (a half renders at half the width of a whole)
- **BigFraction** — large fraction display with whole number, numerator, denominator, and fraction bar

### Audio System (Three Independent Layers)

All audio is generated in the browser — the app ships zero audio files.

**Background Music** (`useBackgroundMusic.ts`): A cheerful piano-like arpeggio in C major, synthesized with triangle-wave oscillators through a convolver reverb. Cycles through I → IV → ii → V chord progression at 96 BPM. Supports audio ducking — when SFX or TTS plays, music volume ramps down to 25% then smoothly recovers.

**Sound Effects** (`useSoundEffects.ts`): 16 named sounds, all procedurally synthesized via Web Audio API. The palette ranges from gentle PBS-style sounds (chime, harp-gliss, warm-pad, sparkle, soft-bell, xylophone, music-box) to more dramatic sounds (chest-open, quest-horn, victory-fanfare, magic-sparkle). Each sound is triggered by lesson events — correct answers, slicing, distributing, celebrations.

**Text-to-Speech** (`useElevenLabsSpeech.ts`): Tutor narration is sent to the ElevenLabs API via a Next.js API route. Audio is cached in S3 keyed by a SHA-256 hash of the voice ID, model, and text. On step changes, the next 3 steps and all choice targets are prefetched into an in-memory blob cache so playback is instant.

### Character Mood System

Characters react in real time to the student's actions. After each piece is distributed, the app calculates whether sharing is fair:

- **Happy** — this character has a fair share (or more)
- **Sad** — this character has less than others
- **Neutral** — default state before distribution begins

This gives students immediate visual feedback on whether they're sharing equally, reinforcing the math concept without the tutor needing to say anything.

### iPad Compatibility

The app is designed for iPad Safari with touch interactions:

- Tap to slice objects (knife tool)
- Tap to select a piece, then tap a character to assign it
- Large touch targets for choice buttons and the continue arrow
- "Tap to begin" overlay handles browser autoplay policy — audio starts on first user interaction
- Responsive layout that fills the iPad screen with tutor panel on the left and workspace on the right

## Architecture

```mermaid
graph TD
    subgraph "Client (Browser / iPad)"
        LP[Landing Page<br/><i>page.tsx</i>]
        BP[Basic Fractions Page<br/><i>basic/page.tsx</i>]
        EP[Equivalence Page<br/><i>equivalence/page.tsx</i>]

        LP -->|"/basic"| BP
        LP -->|"/equivalence"| EP

        BP --> TP1[TutorPanel]
        BP --> WS1[Workspace]
        EP --> TP2[TutorPanel]
        EP --> WS2[Workspace]

        WS1 --> CH1[Character]
        WS1 --> DO1[DividableObject]
        WS2 --> CH2[Character]
        WS2 --> BR[Brownie]
    end

    subgraph "Lesson Data (TypeScript)"
        LD1[lessonData-storyB.ts] -->|step graph| BP
        LD2[lessonData-equiv.ts] -->|step graph| EP
    end

    subgraph "Server (Next.js API Routes)"
        TTS[/api/tts/elevenlabs]
    end

    subgraph "External Services"
        EL[ElevenLabs API]
        S3[(S3 TTS Cache)]
    end

    BP -->|narration request| TTS
    EP -->|narration request| TTS
    TTS -->|cache miss| EL
    TTS -->|read/write| S3
    EL -->|audio| TTS
    TTS -->|audio stream| BP
    TTS -->|audio stream| EP
```

## Deployment

### Vercel (recommended)

Deploy the `app/` directory to Vercel. Set the following environment variables in the Vercel dashboard:

| Variable | Value |
|---|---|
| `ELEVENLABS_API_KEY` | Your ElevenLabs API key |
| `AWS_ROLE_ARN` | ARN of the OIDC-federated IAM role |
| `AWS_REGION` | `us-west-2` |
| `S3_TTS_CACHE_BUCKET` | `fraction-friends-tts-cache` |

In production, Vercel uses **OIDC federation** to assume an AWS IAM role — no static AWS credentials are stored.

## Project Structure

```
app/
├── src/app/
│   ├── page.tsx                       # Landing page (lesson picker)
│   ├── basic/page.tsx                 # Lesson 1: Midnight Snack game engine
│   ├── equivalence/page.tsx           # Lesson 2: Fraction Equivalence game engine
│   ├── api/
│   │   ├── tts/elevenlabs/route.ts    # ElevenLabs TTS with S3 caching
│   │   └── report-issue/route.ts      # Bug report endpoint
│   ├── components/
│   │   ├── TutorPanel.tsx             # Left panel: narration, choices, mute toggles
│   │   ├── Workspace.tsx              # Right panel: manipulatives, characters, tools
│   │   ├── Character.tsx              # 4 SVG monsters × 3 mood states
│   │   ├── DividableObject.tsx        # Sliceable chocolate bar (Lesson 1)
│   │   ├── Brownie.tsx                # Sliceable brownie with cut geometry (Lesson 2)
│   │   ├── Fraction.tsx               # Big fraction display component
│   │   └── ReportIssue.tsx            # Bug report UI
│   └── lib/
│       ├── lessonData.ts              # Shared types (StepType, LessonStep, Choice)
│       ├── lessonData-storyB.ts       # Lesson 1 step graph
│       ├── lessonData-equiv.ts        # Lesson 2 step graph
│       ├── useElevenLabsSpeech.ts     # TTS hook with prefetch and blob cache
│       ├── useSoundEffects.ts         # 16 procedurally synthesized sound effects
│       └── useBackgroundMusic.ts      # Synthesized background music with ducking
├── package.json
└── .env.local                         # Environment variables (not committed)
```
