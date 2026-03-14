# Fraction Friends

An interactive, conversational math tutor that teaches early fraction concepts through story-driven lessons with hands-on manipulatives. Students share chocolate bars with friendly monsters and discover fraction equivalence by slicing brownies — guided by a narrated tutor with branching dialogue. Designed for children ages 6--8 and optimized for iPad.

## Features

- **Two complete lessons**
  - *Midnight Snack* (Basic Fractions) — share chocolate bars with sleepover monsters to learn halves and quarters
  - *Same Size, Different Names* (Fraction Equivalence) — discover that 1/2 and 2/4 are the same amount
- **Conversational AI tutor** with fully scripted, branching dialogue (no LLM — deterministic and safe for kids)
- **Interactive manipulatives** — slice, split, and drag-distribute chocolate bars and brownies
- **Text-to-speech narration** via ElevenLabs
- **Sound effects and background music** with automatic ducking
- **Check-for-understanding quizzes** woven into the story
- **Built for iPad** with touch-friendly interactions

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

Open [http://localhost:3000](http://localhost:3000) in your browser (or iPad).

### Environment variables

Create a `.env.local` file in the `app/` directory with the following:

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

**Scripted lesson engine.** Each lesson is defined as a directed graph of steps in TypeScript (`lessonData-storyB.ts`, `lessonData-equiv.ts`). Steps have a type that determines what the UI renders and how the student interacts:

| Step type | Behavior |
|---|---|
| `narrate` | Tutor speaks; student taps "Continue" |
| `choice` | Multiple-choice buttons with correct/incorrect branching |
| `distribute` | Student drags objects to characters |
| `slice` | Student taps an object to split it (halves or quarters) |
| `show-fraction` | Displays a fraction (e.g., 1/2) with visual emphasis |
| `show-number` | Displays a whole number or mixed number |

**Component architecture.** The page component acts as the game engine — it reads the current step, manages state (pieces, characters, tool mode), and delegates rendering to shared components: `TutorPanel` (narration + choices), `Workspace` (manipulative area), `Character`, `DividableObject`, `Brownie`, and `Fraction`.

**Text-to-speech.** Tutor narration is sent to the ElevenLabs API via a Next.js API route. Generated audio is cached in S3 keyed by text hash, so repeated plays are instant and cost-free.

**No AI/LLM at runtime.** All tutor dialogue and branching logic is pre-authored in the lesson data files. This keeps the experience deterministic, age-appropriate, and free of API latency.

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

In production, Vercel uses **OIDC federation** to assume an AWS IAM role — no static AWS credentials are stored. The setup script at `notes/aws-oidc-setup.sh` documents the IAM role, trust policy, and S3 bucket creation steps.

## Project Structure

```
app/
├── src/app/
│   ├── page.tsx                       # Landing page (lesson picker)
│   ├── basic/page.tsx                 # Basic Fractions game engine
│   ├── equivalence/page.tsx           # Fraction Equivalence game engine
│   ├── api/
│   │   ├── tts/elevenlabs/route.ts    # ElevenLabs TTS with S3 caching
│   │   ├── tts/openai/route.ts        # OpenAI TTS (alternate)
│   │   └── report-issue/route.ts      # Issue reporting endpoint
│   ├── components/
│   │   ├── TutorPanel.tsx             # Narration bubble + choice buttons
│   │   ├── Workspace.tsx              # Manipulative area (drag/drop)
│   │   ├── Character.tsx              # Monster / kid characters
│   │   ├── DividableObject.tsx        # Chocolate bar (sliceable)
│   │   ├── Brownie.tsx                # Brownie (sliceable, equivalence)
│   │   ├── Fraction.tsx               # Fraction display component
│   │   └── ReportIssue.tsx            # Bug report UI
│   └── lib/
│       ├── lessonData-storyB.ts       # "Midnight Snack" lesson graph
│       ├── lessonData-equiv.ts        # "Fraction Equivalence" lesson graph
│       ├── useElevenLabsSpeech.ts     # TTS hook
│       ├── useSoundEffects.ts         # SFX hook
│       └── useBackgroundMusic.ts      # Background music hook
├── package.json
└── .env.local                         # Local environment variables (not committed)
```
