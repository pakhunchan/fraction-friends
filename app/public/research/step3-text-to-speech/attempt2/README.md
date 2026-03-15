# Step 3, Attempt 2: Text-to-Speech via React Context

## Architecture

Unlike attempt 1 (a standalone `useSpeech` hook), this attempt uses a **React
Context provider pattern**. The core idea is that speech state is app-wide
singleton state -- there is exactly one `speechSynthesis` instance shared across
the entire page -- so it belongs in a context rather than a hook that could be
instantiated multiple times.

```
<SpeechProvider>            <-- manages all TTS state, queue, voice selection
  <HomeInner>
    <TutorPanel />          <-- calls useSpeech() to read context
    <CookieWorkspace />
  </HomeInner>
</SpeechProvider>
```

### Files

| File | Role |
|---|---|
| `SpeechContext.tsx` | `SpeechProvider` component + `useSpeech()` hook |
| `TutorPanel.tsx` | Updated panel -- auto-speaks, mute button, speed toggle |
| `page.tsx` | Wraps app in `<SpeechProvider>`, otherwise unchanged |
| `README.md` | This file |

### Key differences from attempt 1

| Feature | Attempt 1 (hook) | Attempt 2 (context) |
|---|---|---|
| State ownership | Each `useSpeech()` call owns its own state | Single provider owns all state |
| Speech queue | No queue -- `speak()` cancels previous | Queue with FIFO processing |
| Voice selection | Simple name-match fallback | Ranked preference chain with gendered heuristic |
| Speed control | None | Tortoise/rabbit toggle (0.65x / 0.92x) |
| Mute persistence | None | localStorage |
| iOS Safari unlock | None | Silent utterance on first user gesture |
| Chrome 15s bug | None | Periodic pause/resume workaround |
| Interrupt vs queue | Always interrupts | `speak(text, { interrupt: true })` or queues |

## Integration guide

### 1. Copy files into the app

```
cp SpeechContext.tsx  app/src/app/components/SpeechContext.tsx
cp TutorPanel.tsx     app/src/app/components/TutorPanel.tsx
cp page.tsx           app/src/app/page.tsx
```

### 2. Update imports

`page.tsx` imports `SpeechProvider` from `./components/SpeechContext`. The
`TutorPanel` imports `useSpeech` from the same module. No other files need
changes.

### 3. Verify

The TutorPanel's props are now simpler -- it no longer needs speech-related
props passed in from the parent, since it reads them from context. The parent
page no longer needs to know about speech at all (beyond wrapping in the
provider).

## API reference

### `<SpeechProvider>`

Wrap your app (or the relevant subtree) in this component. It initializes the
Web Speech API, selects a voice, and provides the context.

### `useSpeech()`

Returns the following:

| Property | Type | Description |
|---|---|---|
| `speak(text, options?)` | function | Speak text. Queues by default. |
| `stop()` | function | Cancel speech and clear queue. |
| `isSpeaking` | boolean | True while an utterance is active. |
| `isMuted` | boolean | True if muted. |
| `toggleMute()` | function | Toggle mute. Persisted to localStorage. |
| `rate` | number | Current speech rate (0.5-2.0). |
| `setRate(n)` | function | Set rate. Clamped to 0.5-2.0. |
| `pitch` | number | Current pitch (0.5-2.0). |
| `setPitch(n)` | function | Set pitch. |
| `voiceName` | string or null | Name of the currently selected voice. |
| `setVoice(name)` | function | Manually select a voice by name. |
| `availableVoices` | string[] | All available voice names. |
| `isUnlocked` | boolean | Whether iOS audio has been unlocked. |
| `queueLength` | number | Items waiting in the speech queue. |

### `SpeakOptions`

```ts
{
  rate?: number;       // Override rate for this utterance
  pitch?: number;      // Override pitch for this utterance
  interrupt?: boolean; // If true, cancel current speech first
}
```

## Browser compatibility

| Browser | Status | Notes |
|---|---|---|
| Chrome (desktop) | Supported | Has a bug where speech pauses after ~15s. Workaround included (periodic pause/resume). |
| Chrome (Android) | Supported | Voice list may be limited. |
| Safari (macOS) | Supported | "Samantha" voice preferred -- high quality. |
| Safari (iOS/iPadOS) | Supported | **Requires user gesture to unlock audio.** The provider fires a silent utterance on first click/tap to handle this. |
| Firefox | Supported | Fewer voice options. Falls back gracefully. |
| Edge | Supported | Uses Chromium engine; same behavior as Chrome. |
| Samsung Internet | Partial | Works but voice quality varies. |
| Opera | Supported | Chromium-based. |

## iOS Safari gotchas

1. **User gesture requirement.** `speechSynthesis.speak()` silently fails if
   not triggered (directly or indirectly) by a user gesture. The provider works
   around this by firing a silent utterance on the first `click`, `touchstart`,
   or `keydown` event (captured in the capture phase).

2. **Voice loading is async.** On iOS, `speechSynthesis.getVoices()` returns an
   empty array until the `voiceschanged` event fires. The provider listens for
   this event and re-selects when voices become available.

3. **No `pause()`/`resume()` on iOS.** Safari on iOS does not support pausing
   and resuming utterances. The visibility-change handler wraps these calls in
   try/catch to avoid errors.

4. **Rate/pitch limits.** iOS Safari clamps rate more aggressively than desktop
   browsers. Values outside 0.5-2.0 are silently clamped. The provider enforces
   these bounds.

5. **Concurrent utterances.** iOS does not support multiple concurrent
   utterances. The queue system ensures only one utterance plays at a time.

## Chrome desktop gotchas

1. **15-second pause bug.** Chrome has a long-standing bug where
   `SpeechSynthesisUtterance` stops firing events after ~15 seconds of
   continuous speech. The provider includes a workaround: a `setInterval` that
   calls `speechSynthesis.pause()` then `speechSynthesis.resume()` every 10
   seconds to keep the pipeline alive.

2. **`cancel()` does not always fire `onerror`.** After calling
   `speechSynthesis.cancel()`, the `onerror` event with `error: "canceled"` may
   or may not fire depending on timing. The provider does not rely on this event
   for state cleanup -- it resets state synchronously when `stop()` is called.

## Design decisions

- **Why a context, not a hook?** The Web Speech API is a page-global singleton.
  Multiple independent hook instances could fight over `speechSynthesis.cancel()`
  and `speechSynthesis.speak()`. A context ensures a single owner.

- **Why a queue?** In multi-step flows, `speak()` may be called in rapid
  succession (e.g., a narration step auto-advances). Without a queue, only the
  last call would be heard.

- **Why persist mute but not voice?** Mute is a preference the user actively
  sets. Voice selection is device-dependent and should auto-select the best
  available voice each session.

- **Why inline `<style>` for animations?** The speaker-wave animation uses CSS
  keyframes. Inlining them avoids requiring changes to `globals.css` or Tailwind
  config, making the component fully self-contained.
