# Step 3 -- Text-to-Speech for the Fraction Tutor

## Approach

Three files are provided:

| File | Role |
|---|---|
| `useSpeech.ts` | React hook wrapping the Web Speech API (SpeechSynthesis). |
| `TutorPanel.tsx` | Updated tutor panel -- speaks on step change, stops on interaction, shows mute button. |
| `page.tsx` | Updated root page -- instantiates `useSpeech()` at top level and passes speech props down to `TutorPanel`. |

### Key design decisions

1. **Hook lives in `page.tsx`** -- The `useSpeech` hook is called once at the
   top of the page component. Speech props (`speak`, `stop`, `isSpeaking`,
   `isMuted`, `toggleMute`) are passed down to `TutorPanel` as regular props.
   This avoids duplicate speech instances and keeps mute state centralized.

2. **Voice selection is async-safe** -- On most browsers, `getVoices()` returns
   an empty array on the first call.  The hook listens for the
   `voiceschanged` event and picks a voice once the list is populated. Preferred
   voices (Samantha on Apple platforms, Google US English on Chrome, Zira on
   Windows) are tried in order before falling back to any English voice.

3. **Mute ref** -- `isMuted` is mirrored into a ref so that the `speak`
   callback (which is memoized via `useCallback`) always reads the latest
   value without needing to be recreated on every mute toggle.

4. **Stop-before-transition** -- `TutorPanel` wraps `onChoice` and `onContinue`
   to call `stop()` before passing through to the parent. This prevents
   overlapping utterances when the user clicks quickly.

5. **Progressive enhancement** -- Every call into the SpeechSynthesis API is
   guarded by `typeof window !== "undefined"` checks and wrapped in try/catch.
   If the API is unavailable (e.g., SSR, unsupported browser) the hook is a
   harmless no-op.

## Browser compatibility

| Browser | Support |
|---|---|
| Safari (macOS, iPadOS, iOS) | Full support. "Samantha" voice selected automatically. |
| Chrome (desktop, Android) | Full support. Uses "Google US English" when available. |
| Firefox | Supported but voice quality varies by OS. |
| Edge | Full support. Uses "Microsoft Zira" when available. |

The Web Speech API (`SpeechSynthesis`) is supported in all modern browsers.
See https://caniuse.com/speech-synthesis for details.

## How to integrate

1. Copy `useSpeech.ts` into `app/src/app/hooks/useSpeech.ts`.

2. Replace `app/src/app/components/TutorPanel.tsx` with the provided
   `TutorPanel.tsx`.

3. Replace `app/src/app/page.tsx` with the provided `page.tsx`.

4. Make sure the import paths in `page.tsx` match your project layout:
   - `./hooks/useSpeech` for the speech hook
   - `./components/TutorPanel` for the panel
   - `./components/CookieWorkspace` for the workspace (unchanged)
   - `./lib/lessonData` for lesson data (unchanged)

5. Run the app (`npm run dev`) and verify:
   - The tutor speaks each step's text aloud.
   - Clicking a choice or "continue" stops speech before advancing.
   - The mute button (bottom-left of tutor panel) toggles speech on/off.
   - The speaker icon pulses gently while speech is playing.

## Speech tuning

Adjustable constants in `useSpeech.ts`:

- `utterance.rate = 0.9` -- slightly slower than normal for young learners.
- `utterance.pitch = 1.1` -- slightly higher for a warm, friendly tone.
- `utterance.volume = 1` -- full volume (respects system volume).

These can be changed or exposed as hook parameters if needed.
