"use client";

import React, { useState } from "react";

// ---------------------------------------------------------------------------
// Aliased imports — each attempt has an isolated import to avoid name clashes
// ---------------------------------------------------------------------------

import { useSpeech as useSpeech1 } from "./hooks/attempt1";
import {
  SpeechProvider,
  useSpeech as useSpeechCtx2,
} from "./hooks/attempt2";
import { useSpeech as useSpeech3 } from "./hooks/attempt3";
import { useSpeech as useSpeech4 } from "./hooks/attempt4";
import { useNarration } from "./hooks/attempt5";
import { useSpeech as useSpeech6 } from "./hooks/attempt6";

// ElevenLabs cloud TTS hooks
import { useElevenLabsSpeech } from "./hooks/elevenlabs-simple";
import { useElevenLabsMultiVoice } from "./hooks/elevenlabs-multivoice";
import { useElevenLabsStreaming } from "./hooks/elevenlabs-streaming";

// OpenAI cloud TTS hooks
import { useOpenAISpeech } from "./hooks/openai-simple";
import { useOpenAIMultiVoice } from "./hooks/openai-multivoice";

// Google Cloud TTS hooks
import { useGoogleMultiVoice } from "./hooks/google-multivoice";

// ---------------------------------------------------------------------------
// Sample texts
// ---------------------------------------------------------------------------

const DEFAULT_TEXT =
  "Hello! Let's learn about fractions. If we have 5 cookies and 2 friends, each friend gets 2 and 1/2 cookies!";

const TAGGED_TEXT =
  "[tutor]Let's share cookies![/tutor] [char0]I want some![/char0]";

const NARRATION_TEXT =
  "Hello! {pause:400} Let's learn about {slow}fractions{/slow}. {emphasis}Are you ready?{/emphasis}";

// ---------------------------------------------------------------------------
// Shared UI primitives
// ---------------------------------------------------------------------------

function SpeakingDot({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block w-3 h-3 rounded-full transition-all duration-300 ${
        active
          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
          : "bg-slate-600"
      }`}
      aria-hidden="true"
    />
  );
}

function MuteButton({
  isMuted,
  onToggle,
}: {
  isMuted: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        isMuted
          ? "bg-rose-600 hover:bg-rose-500 text-white"
          : "bg-slate-600 hover:bg-slate-500 text-slate-200"
      }`}
    >
      {isMuted ? "Unmute" : "Mute"}
    </button>
  );
}

function SpeakButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
    >
      Speak
    </button>
  );
}

function StopButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-md bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium transition-colors"
    >
      Stop
    </button>
  );
}

function AttemptShell({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[#121d35] border border-slate-700 rounded-xl p-5 flex flex-col gap-4">
      <header className="flex items-center gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-bold text-white">
          {number}
        </span>
        <div>
          <h2 className="text-white font-semibold text-base leading-tight">
            {title}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">{description}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function TextArea({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full bg-[#0d1527] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}

function RateSlider({
  rate,
  setRate,
}: {
  rate: number;
  setRate: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 text-xs text-slate-400">
      <span className="w-10 shrink-0">Rate</span>
      <input
        type="range"
        min={0.5}
        max={2.0}
        step={0.1}
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
        className="flex-1 accent-indigo-500"
      />
      <span className="w-8 text-right font-mono text-slate-300">
        {rate.toFixed(1)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Attempt 1 — Simple Hook
// ---------------------------------------------------------------------------

function Attempt1() {
  const { speak, stop, isSpeaking, isMuted, toggleMute } = useSpeech1();
  const [text, setText] = useState(DEFAULT_TEXT);

  return (
    <AttemptShell
      number={1}
      title="Attempt 1 — Simple Hook"
      description="Basic useSpeech with voice selection, mute, and visibility handling."
    >
      <TextArea value={text} onChange={setText} />
      <div className="flex flex-wrap items-center gap-2">
        <SpeakButton onClick={() => speak(text)} />
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking…
          </span>
        )}
      </div>
    </AttemptShell>
  );
}

// ---------------------------------------------------------------------------
// Attempt 2 — Context Provider (inner component)
// ---------------------------------------------------------------------------

function Attempt2Inner() {
  const {
    speak,
    stop,
    isSpeaking,
    isMuted,
    toggleMute,
    rate,
    setRate,
    queueLength,
    availableVoices,
    voiceName,
    setVoice,
  } = useSpeechCtx2();

  const [text, setText] = useState(DEFAULT_TEXT);

  return (
    <AttemptShell
      number={2}
      title="Attempt 2 — Context Provider"
      description="Full-featured SpeechProvider with queue, rate, pitch, voice picker, and iOS unlock."
    >
      <TextArea value={text} onChange={setText} />
      <div className="flex flex-wrap items-center gap-2">
        <SpeakButton onClick={() => speak(text)} />
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking…
          </span>
        )}
        {queueLength > 0 && (
          <span className="text-amber-400 text-xs">
            Queue: {queueLength}
          </span>
        )}
      </div>
      <RateSlider rate={rate} setRate={setRate} />
      {availableVoices.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="shrink-0">Voice</span>
          <select
            value={voiceName ?? ""}
            onChange={(e) => setVoice(e.target.value || null)}
            className="flex-1 bg-[#0d1527] border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Auto</option>
            {availableVoices.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      )}
    </AttemptShell>
  );
}

function Attempt2() {
  return (
    <SpeechProvider>
      <Attempt2Inner />
    </SpeechProvider>
  );
}

// ---------------------------------------------------------------------------
// Attempt 3 — Rate + Retry Hook
// ---------------------------------------------------------------------------

function Attempt3() {
  const { speak, stop, isSpeaking, isMuted, toggleMute, rate, setRate } =
    useSpeech3();
  const [text, setText] = useState(DEFAULT_TEXT);

  return (
    <AttemptShell
      number={3}
      title="Attempt 3 — Rate & Retry Hook"
      description="Sentence-level splitting, Markdown stripping, fraction normalisation, exponential backoff retry."
    >
      <TextArea value={text} onChange={setText} />
      <div className="flex flex-wrap items-center gap-2">
        <SpeakButton onClick={() => speak(text)} />
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking…
          </span>
        )}
      </div>
      <RateSlider rate={rate} setRate={setRate} />
    </AttemptShell>
  );
}

// ---------------------------------------------------------------------------
// Attempt 4 — Multi-Voice / Role Hook
// ---------------------------------------------------------------------------

const VOICE_ROLES = [
  "tutor",
  "char0",
  "char1",
  "char2",
  "char3",
  "system",
] as const;

function Attempt4() {
  const {
    speak,
    speakTagged,
    stop,
    isSpeaking,
    isMuted,
    toggleMute,
    voices,
    queueLength,
    getVoiceForRole,
  } = useSpeech4();

  const [text, setText] = useState(TAGGED_TEXT);
  const [selectedRole, setSelectedRole] =
    useState<(typeof VOICE_ROLES)[number]>("tutor");

  return (
    <AttemptShell
      number={4}
      title="Attempt 4 — Multi-Voice / Role"
      description="Per-character voice profiles with inline role tags: [tutor]…[/tutor] [char0]…[/char0]"
    >
      <TextArea value={text} onChange={setText} />

      {/* Role selector */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="shrink-0">Speak as</span>
        <div className="flex flex-wrap gap-1">
          {VOICE_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-2 py-0.5 rounded-md font-mono transition-colors ${
                selectedRole === role
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => speak(text)}
          className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          Speak (tutor)
        </button>
        <button
          onClick={() => speakTagged(text)}
          className="px-4 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          Speak Tagged
        </button>
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking…
          </span>
        )}
        {queueLength > 0 && (
          <span className="text-amber-400 text-xs">Queue: {queueLength}</span>
        )}
      </div>

      {/* Voice-per-role display */}
      {voices.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          {VOICE_ROLES.map((role) => {
            const vName = getVoiceForRole(role);
            return (
              <div key={role} className="flex items-center gap-1.5">
                <span className="font-mono text-slate-500 w-12 shrink-0">
                  {role}
                </span>
                <span className="text-slate-400 truncate">
                  {vName ?? "—"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </AttemptShell>
  );
}

// ---------------------------------------------------------------------------
// Attempt 5 — Narration Engine
// ---------------------------------------------------------------------------

function Attempt5() {
  const {
    narrate,
    stop,
    pause,
    resume,
    isSpeaking,
    isMuted,
    toggleMute,
    progress,
    currentWord,
    rate,
    setRate,
    queueLength,
    scriptWords,
  } = useNarration();

  const [text, setText] = useState(NARRATION_TEXT);

  return (
    <AttemptShell
      number={5}
      title="Attempt 5 — Narration Engine"
      description="Rich markup: {pause:N}, {slow}…{/slow}, {fast}…, {emphasis}…, {whisper}… with word-level progress."
    >
      <TextArea value={text} onChange={setText} />

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => narrate(text, undefined, { interrupt: true })}
          className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          Narrate
        </button>
        <button
          onClick={pause}
          className="px-3 py-1.5 rounded-md bg-slate-600 hover:bg-slate-500 text-white text-sm transition-colors"
        >
          Pause
        </button>
        <button
          onClick={resume}
          className="px-3 py-1.5 rounded-md bg-slate-600 hover:bg-slate-500 text-white text-sm transition-colors"
        >
          Resume
        </button>
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking…
          </span>
        )}
        {queueLength > 0 && (
          <span className="text-amber-400 text-xs">Queue: {queueLength}</span>
        )}
      </div>

      <RateSlider rate={rate} setRate={setRate} />

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Word highlight */}
      {scriptWords.length > 0 && (
        <div className="flex flex-wrap gap-1 text-xs leading-relaxed">
          {scriptWords.map((word, i) => (
            <span
              key={i}
              className={`transition-colors duration-150 ${
                i === currentWord
                  ? "text-amber-300 font-semibold"
                  : "text-slate-400"
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      )}
    </AttemptShell>
  );
}

// ---------------------------------------------------------------------------
// Attempt 6 — Accessibility-First Hook
// ---------------------------------------------------------------------------

function Attempt6() {
  const {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isMuted,
    toggleMute,
    captionText,
    showCaptions,
    setCaptions,
    rate,
    setRate,
    hasScreenReader,
    screenReaderSuppression,
    setScreenReaderSuppression,
    isSupported,
  } = useSpeech6();

  const [text, setText] = useState(DEFAULT_TEXT);

  return (
    <AttemptShell
      number={6}
      title="Attempt 6 — Accessibility-First"
      description="ARIA live regions, screen-reader detection, caption mode, keyboard shortcuts (Space/Esc/+/-)."
    >
      <TextArea value={text} onChange={setText} />

      <div className="flex flex-wrap items-center gap-2">
        <SpeakButton onClick={() => speak(text, { interrupt: true })} />
        <button
          onClick={() => (isPaused ? resume() : pause())}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isPaused
              ? "bg-amber-600 hover:bg-amber-500 text-white"
              : "bg-slate-600 hover:bg-slate-500 text-slate-200"
          }`}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && !isPaused && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking…
          </span>
        )}
        {isPaused && (
          <span className="text-amber-400 text-xs">Paused</span>
        )}
      </div>

      <RateSlider rate={rate} setRate={setRate} />

      {/* Caption toggle */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
          <input
            type="checkbox"
            checked={showCaptions}
            onChange={(e) => setCaptions(e.target.checked)}
            className="accent-indigo-500"
          />
          Show Captions
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
          <input
            type="checkbox"
            checked={screenReaderSuppression}
            onChange={(e) => setScreenReaderSuppression(e.target.checked)}
            className="accent-indigo-500"
          />
          SR Suppression
        </label>
        {hasScreenReader && (
          <span className="text-amber-400">Screen reader detected</span>
        )}
        {!isSupported && (
          <span className="text-rose-400">TTS not supported</span>
        )}
      </div>

      {/* Caption display */}
      {showCaptions && captionText && (
        <div
          className="bg-black/50 border border-slate-600 rounded-lg px-4 py-3 text-sm text-white leading-relaxed"
          role="status"
          aria-live="polite"
          aria-label="Speech captions"
        >
          {captionText}
        </div>
      )}

      {/* Hidden live region for screen readers (always rendered) */}
      <span
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {captionText}
      </span>

      <p className="text-slate-600 text-xs">
        Keyboard: Space=pause/resume · Esc=stop · +/-=speed
      </p>
    </AttemptShell>
  );
}

// ---------------------------------------------------------------------------
// ElevenLabs 1 — Simple (Jessica voice)
// ---------------------------------------------------------------------------

function ElevenLabs1() {
  const { speak, stop, isSpeaking, isMuted, toggleMute } =
    useElevenLabsSpeech();
  const [text, setText] = useState(DEFAULT_TEXT);

  return (
    <AttemptShell
      number={7}
      title="ElevenLabs — Simple"
      description="Cloud TTS via ElevenLabs API. Jessica voice (Playful, Bright, Warm). Fire-and-forget."
    >
      <TextArea value={text} onChange={setText} />
      <div className="flex flex-wrap items-center gap-2">
        <SpeakButton onClick={() => speak(text)} />
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking…
          </span>
        )}
      </div>
    </AttemptShell>
  );
}

// ---------------------------------------------------------------------------
// ElevenLabs 2 — Multi-Voice (per character)
// ---------------------------------------------------------------------------

const EL_VOICE_ROLES = [
  "tutor",
  "char0",
  "char1",
  "char2",
  "char3",
  "system",
] as const;

function ElevenLabs2() {
  const {
    speak,
    speakTagged,
    stop,
    isSpeaking,
    isMuted,
    toggleMute,
    voices,
    queueLength,
    getVoiceForRole,
  } = useElevenLabsMultiVoice();

  const [text, setText] = useState(TAGGED_TEXT);
  const [selectedRole, setSelectedRole] =
    useState<(typeof EL_VOICE_ROLES)[number]>("tutor");

  return (
    <AttemptShell
      number={8}
      title="ElevenLabs — Multi-Voice"
      description="Each character has a distinct ElevenLabs voice. Cookie=Jessica, Marcus=Will, Sophie=Laura, Kai=Liam, Priya=Alice."
    >
      <TextArea value={text} onChange={setText} />

      {/* Role selector */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="shrink-0">Speak as</span>
        <div className="flex flex-wrap gap-1">
          {EL_VOICE_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-2 py-0.5 rounded-md font-mono transition-colors ${
                selectedRole === role
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => speak(text, selectedRole)}
          className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          Speak ({selectedRole})
        </button>
        <button
          onClick={() => speakTagged(text)}
          className="px-4 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          Speak Tagged
        </button>
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking…
          </span>
        )}
        {queueLength > 0 && (
          <span className="text-amber-400 text-xs">Queue: {queueLength}</span>
        )}
      </div>

      {/* Voice-per-role display */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {EL_VOICE_ROLES.map((role) => {
          const vName = getVoiceForRole(role);
          return (
            <div key={role} className="flex items-center gap-1.5">
              <span className="font-mono text-slate-500 w-12 shrink-0">
                {role}
              </span>
              <span className="text-slate-400 truncate">{vName ?? "—"}</span>
            </div>
          );
        })}
      </div>
    </AttemptShell>
  );
}

// ---------------------------------------------------------------------------
// ElevenLabs 3 — Streaming (low-latency)
// ---------------------------------------------------------------------------

function ElevenLabs3() {
  const { speak, stop, isSpeaking, isMuted, toggleMute } =
    useElevenLabsStreaming();
  const [text, setText] = useState(DEFAULT_TEXT);

  return (
    <AttemptShell
      number={9}
      title="ElevenLabs — Streaming"
      description="Streaming TTS for lowest latency. Audio starts playing before full response arrives (MediaSource on Chrome, blob fallback on Safari)."
    >
      <TextArea value={text} onChange={setText} />
      <div className="flex flex-wrap items-center gap-2">
        <SpeakButton onClick={() => speak(text)} />
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking…
          </span>
        )}
      </div>
    </AttemptShell>
  );
}

// ---------------------------------------------------------------------------
// OpenAI 1 — Simple (nova voice)
// ---------------------------------------------------------------------------

function OpenAI1() {
  const { speak, stop, isSpeaking, isMuted, toggleMute } = useOpenAISpeech();
  const [text, setText] = useState(DEFAULT_TEXT);

  return (
    <AttemptShell
      number={10}
      title="OpenAI — Simple"
      description="Cloud TTS via OpenAI tts-1 model. Nova voice (warm, friendly). Fire-and-forget."
    >
      <TextArea value={text} onChange={setText} />
      <div className="flex flex-wrap items-center gap-2">
        <SpeakButton onClick={() => speak(text)} />
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking…
          </span>
        )}
      </div>
    </AttemptShell>
  );
}

// ---------------------------------------------------------------------------
// OpenAI 2 — Multi-Voice (per character + HD toggle)
// ---------------------------------------------------------------------------

const OAI_VOICE_ROLES = [
  "tutor",
  "char0",
  "char1",
  "char2",
  "char3",
  "system",
] as const;

function OpenAI2() {
  const {
    speak,
    speakTagged,
    stop,
    isSpeaking,
    isMuted,
    toggleMute,
    useHD,
    setUseHD,
    voices,
    queueLength,
    getVoiceForRole,
  } = useOpenAIMultiVoice();

  const [text, setText] = useState(TAGGED_TEXT);
  const [selectedRole, setSelectedRole] =
    useState<(typeof OAI_VOICE_ROLES)[number]>("tutor");

  return (
    <AttemptShell
      number={11}
      title="OpenAI — Multi-Voice"
      description="Each character has a distinct OpenAI voice. Cookie=nova, Marcus=echo, Sophie=shimmer, Kai=fable, Priya=alloy. HD toggle."
    >
      <TextArea value={text} onChange={setText} />

      {/* Role selector */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="shrink-0">Speak as</span>
        <div className="flex flex-wrap gap-1">
          {OAI_VOICE_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-2 py-0.5 rounded-md font-mono transition-colors ${
                selectedRole === role
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => speak(text, selectedRole)}
          className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          Speak ({selectedRole})
        </button>
        <button
          onClick={() => speakTagged(text)}
          className="px-4 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          Speak Tagged
        </button>
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <button
          onClick={() => setUseHD(!useHD)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            useHD
              ? "bg-amber-600 hover:bg-amber-500 text-white"
              : "bg-slate-600 hover:bg-slate-500 text-slate-200"
          }`}
        >
          {useHD ? "HD On" : "HD Off"}
        </button>
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking…
          </span>
        )}
        {queueLength > 0 && (
          <span className="text-amber-400 text-xs">Queue: {queueLength}</span>
        )}
      </div>

      {/* Voice-per-role display */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {OAI_VOICE_ROLES.map((role) => {
          const vName = getVoiceForRole(role);
          return (
            <div key={role} className="flex items-center gap-1.5">
              <span className="font-mono text-slate-500 w-12 shrink-0">
                {role}
              </span>
              <span className="text-slate-400 truncate">{vName ?? "—"}</span>
            </div>
          );
        })}
      </div>
    </AttemptShell>
  );
}

// ---------------------------------------------------------------------------
// Google Cloud TTS — Multi-Voice (per character)
// ---------------------------------------------------------------------------

const GCLOUD_VOICE_ROLES = [
  "tutor",
  "char0",
  "char1",
  "char2",
  "char3",
  "system",
] as const;

function GoogleCloud1() {
  const {
    speak,
    speakTagged,
    stop,
    isSpeaking,
    isMuted,
    toggleMute,
    voices,
    queueLength,
    getVoiceForRole,
  } = useGoogleMultiVoice();

  const [text, setText] = useState(TAGGED_TEXT);
  const [selectedRole, setSelectedRole] =
    useState<(typeof GCLOUD_VOICE_ROLES)[number]>("tutor");

  return (
    <AttemptShell
      number={12}
      title="Google Cloud TTS — Multi-Voice"
      description="Each character has a distinct Google Cloud TTS voice with unique pitch and rate. Cookie=Studio-O, Marcus=Neural2-D, Sophie=Neural2-F, Kai=Journey-D, Priya=Neural2-H."
    >
      <TextArea value={text} onChange={setText} />

      {/* Role selector */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="shrink-0">Speak as</span>
        <div className="flex flex-wrap gap-1">
          {GCLOUD_VOICE_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-2 py-0.5 rounded-md font-mono transition-colors ${
                selectedRole === role
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => speak(text, selectedRole)}
          className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          Speak ({selectedRole})
        </button>
        <button
          onClick={() => speakTagged(text)}
          className="px-4 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          Speak Tagged
        </button>
        <StopButton onClick={stop} />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
        <SpeakingDot active={isSpeaking} />
        {isSpeaking && (
          <span className="text-emerald-400 text-xs animate-pulse">
            Speaking&hellip;
          </span>
        )}
        {queueLength > 0 && (
          <span className="text-amber-400 text-xs">Queue: {queueLength}</span>
        )}
      </div>

      {/* Voice-per-role display */}
      {voices.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          {GCLOUD_VOICE_ROLES.map((role) => {
            const vName = getVoiceForRole(role);
            return (
              <div key={role} className="flex items-center gap-1.5">
                <span className="font-mono text-slate-500 w-12 shrink-0">
                  {role}
                </span>
                <span className="text-slate-400 truncate">{vName ?? "—"}</span>
              </div>
            );
          })}
        </div>
      )}
    </AttemptShell>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TtsTestPage() {
  return (
    <main
      className="min-h-screen bg-[#0f1729] text-slate-100 px-4 py-10"
      style={{ fontFamily: "system-ui, sans-serif", overflow: "auto", height: "100vh" }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            TTS Implementations — Side-by-Side
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Compare 12 text-to-speech implementations. 7–9 use ElevenLabs, 10–11
            use OpenAI, 12 uses Google Cloud TTS, 1–6 use the browser&apos;s built-in Web Speech API.
          </p>
        </header>

        {/* ElevenLabs Cloud TTS */}
        <h2 className="text-xl font-bold text-white pt-2">
          ElevenLabs Cloud TTS
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ElevenLabs1 />
          <ElevenLabs2 />
          <ElevenLabs3 />
        </div>

        {/* OpenAI Cloud TTS */}
        <h2 className="text-xl font-bold text-white pt-6">
          OpenAI Cloud TTS
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <OpenAI1 />
          <OpenAI2 />
        </div>

        {/* Google Cloud TTS */}
        <h2 className="text-xl font-bold text-white pt-6">
          Google Cloud TTS
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <GoogleCloud1 />
        </div>

        {/* Browser Web Speech API */}
        <h2 className="text-xl font-bold text-white pt-6">
          Browser Web Speech API (original attempts)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Attempt1 />
          <Attempt2 />
          <Attempt3 />
          <Attempt4 />
          <Attempt5 />
          <Attempt6 />
        </div>

        {/* Legend */}
        <footer className="mt-8 border-t border-slate-800 pt-6 text-xs text-slate-500 space-y-1">
          <p className="text-slate-300 font-medium mb-2">ElevenLabs Cloud TTS</p>
          <p>
            <span className="text-slate-300 font-medium">7</span> —
            elevenlabs-simple.ts (single Jessica voice, fire-and-forget)
          </p>
          <p>
            <span className="text-slate-300 font-medium">8</span> —
            elevenlabs-multivoice.ts (per-character voices with tagged text)
          </p>
          <p>
            <span className="text-slate-300 font-medium">9</span> —
            elevenlabs-streaming.ts (streaming for low-latency playback)
          </p>
          <p className="text-slate-300 font-medium mt-3 mb-2">OpenAI Cloud TTS</p>
          <p>
            <span className="text-slate-300 font-medium">10</span> —
            openai-simple.ts (nova voice, tts-1 model)
          </p>
          <p>
            <span className="text-slate-300 font-medium">11</span> —
            openai-multivoice.ts (per-character voices, HD toggle)
          </p>
          <p className="text-slate-300 font-medium mt-3 mb-2">Google Cloud TTS</p>
          <p>
            <span className="text-slate-300 font-medium">12</span> —
            google-multivoice.ts (per-character Google Cloud voices with pitch/rate differentiation)
          </p>
          <p className="text-slate-300 font-medium mt-3 mb-2">Browser Web Speech API</p>
          <p>
            <span className="text-slate-300 font-medium">1</span> —
            attempt1.ts (basic useSpeech hook)
          </p>
          <p>
            <span className="text-slate-300 font-medium">2</span> —
            attempt2.tsx (SpeechProvider context + queue)
          </p>
          <p>
            <span className="text-slate-300 font-medium">3</span> —
            attempt3.ts (sentence splitting + retry)
          </p>
          <p>
            <span className="text-slate-300 font-medium">4</span> —
            attempt4.ts (multi-voice roles)
          </p>
          <p>
            <span className="text-slate-300 font-medium">5</span> —
            attempt5.ts (narration engine)
          </p>
          <p>
            <span className="text-slate-300 font-medium">6</span> —
            attempt6.ts (accessibility-first)
          </p>
        </footer>
      </div>
    </main>
  );
}
