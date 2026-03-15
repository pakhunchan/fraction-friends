"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { LessonStep } from "../lib/lessonData";
import { useSpeech, type VoiceRole } from "./useSpeech";

// ---------------------------------------------------------------------------
// Character name -> role mapping
// ---------------------------------------------------------------------------

/** The 4 characters in lesson order, mapped to their voice role. */
const CHARACTER_ROLES: VoiceRole[] = ["char0", "char1", "char2", "char3"];

/** Display names for each role (used in the voice assignment panel). */
const ROLE_LABELS: Record<VoiceRole, string> = {
  tutor: "Tutor",
  char0: "Zara",
  char1: "Leo",
  char2: "Maya",
  char3: "Oscar",
  system: "System",
};

/** Accent colours per role for the voice assignment UI. */
const ROLE_COLORS: Record<VoiceRole, string> = {
  tutor:  "from-blue-500/30 to-blue-600/20 border-blue-400/30",
  char0:  "from-pink-500/30 to-pink-600/20 border-pink-400/30",
  char1:  "from-emerald-500/30 to-emerald-600/20 border-emerald-400/30",
  char2:  "from-amber-500/30 to-amber-600/20 border-amber-400/30",
  char3:  "from-violet-500/30 to-violet-600/20 border-violet-400/30",
  system: "from-slate-500/30 to-slate-600/20 border-slate-400/30",
};

const ROLE_DOT_COLORS: Record<VoiceRole, string> = {
  tutor:  "bg-blue-400",
  char0:  "bg-pink-400",
  char1:  "bg-emerald-400",
  char2:  "bg-amber-400",
  char3:  "bg-violet-400",
  system: "bg-slate-400",
};

// ---------------------------------------------------------------------------
// Speaker icon parts
// ---------------------------------------------------------------------------

function SpeakerBody() {
  return <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />;
}

function SpeakerWaves({ animate }: { animate: boolean }) {
  return (
    <>
      <path
        d="M15.54 8.46a5 5 0 0 1 0 7.07"
        className={animate ? "animate-wave-1" : ""}
      />
      <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14"
        className={animate ? "animate-wave-2" : ""}
      />
    </>
  );
}

function SpeakerMutedX() {
  return (
    <>
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </>
  );
}

// ---------------------------------------------------------------------------
// Role indicator dot — pulses when that role is actively speaking
// ---------------------------------------------------------------------------

interface RoleDotProps {
  role: VoiceRole;
  isActive: boolean;
}

function RoleDot({ role, isActive }: RoleDotProps) {
  return (
    <span
      title={`${ROLE_LABELS[role]} voice`}
      className={`inline-block w-2 h-2 rounded-full transition-all ${ROLE_DOT_COLORS[role]} ${
        isActive ? "scale-150 shadow-[0_0_6px_2px_rgba(255,255,255,0.4)]" : "opacity-50"
      }`}
    />
  );
}

// ---------------------------------------------------------------------------
// Voice assignment panel
// ---------------------------------------------------------------------------

interface VoiceAssignmentPanelProps {
  voices: string[];
  profiles: ReturnType<typeof useSpeech>["profiles"];
  getVoiceForRole: (role: VoiceRole) => string | null;
  assignVoice: (role: VoiceRole, name: string | null) => void;
  updateProfile: (role: VoiceRole, patch: Parameters<ReturnType<typeof useSpeech>["updateProfile"]>[1]) => void;
  onClose: () => void;
}

function VoiceAssignmentPanel({
  voices,
  profiles,
  getVoiceForRole,
  assignVoice,
  updateProfile,
  onClose,
}: VoiceAssignmentPanelProps) {
  const roles: VoiceRole[] = ["tutor", "char0", "char1", "char2", "char3", "system"];

  return (
    <div className="absolute inset-0 z-20 overflow-y-auto bg-[#1a1f3a]/95 backdrop-blur-sm rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          Voice Settings
        </h2>
        <button
          onClick={onClose}
          aria-label="Close voice settings"
          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" />
            <line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>
      </div>

      {/* Role cards */}
      <div className="space-y-3">
        {roles.map((role) => {
          const currentVoiceName = getVoiceForRole(role);
          const profile = profiles[role];

          return (
            <div
              key={role}
              className={`bg-gradient-to-br ${ROLE_COLORS[role]} border rounded-xl p-3`}
            >
              {/* Role header */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ROLE_DOT_COLORS[role]}`} />
                <span className="text-xs font-semibold text-white/90">{ROLE_LABELS[role]}</span>
                {currentVoiceName && (
                  <span className="ml-auto text-[10px] text-white/50 truncate max-w-[100px]">
                    {currentVoiceName}
                  </span>
                )}
              </div>

              {/* Voice picker */}
              <select
                value={currentVoiceName ?? ""}
                onChange={(e) => assignVoice(role, e.target.value || null)}
                className="w-full text-xs bg-black/30 text-white/80 border border-white/10 rounded-lg px-2 py-1.5 mb-2 cursor-pointer"
                aria-label={`Voice for ${ROLE_LABELS[role]}`}
              >
                <option value="">Auto-select</option>
                {voices.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              {/* Rate / pitch sliders */}
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[10px] text-white/50 block mb-0.5">
                    Speed: {profile.rate.toFixed(2)}x
                  </span>
                  <input
                    type="range"
                    min="0.5"
                    max="1.8"
                    step="0.05"
                    value={profile.rate}
                    onChange={(e) =>
                      updateProfile(role, { rate: parseFloat(e.target.value) })
                    }
                    className="w-full h-1.5 accent-white/60 cursor-pointer"
                    aria-label={`Speed for ${ROLE_LABELS[role]}`}
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-white/50 block mb-0.5">
                    Pitch: {profile.pitch.toFixed(2)}
                  </span>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={profile.pitch}
                    onChange={(e) =>
                      updateProfile(role, { pitch: parseFloat(e.target.value) })
                    }
                    className="w-full h-1.5 accent-white/60 cursor-pointer"
                    aria-label={`Pitch for ${ROLE_LABELS[role]}`}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-white/30 mt-4 text-center">
        Voice availability varies by browser and OS.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Infer the speaking role from a step
// ---------------------------------------------------------------------------

/**
 * Determine which voice role should narrate a given lesson step.
 *
 * Steps that are "character reactions" (choice feedback steps that have a
 * character index in their id) use that character's role. Everything else
 * defaults to "tutor".
 *
 * This heuristic can be extended as lessonData grows. Steps can also embed
 * role tags directly in tutorText for fine-grained control.
 */
function inferStepRole(step: LessonStep): VoiceRole {
  // If the tutorText contains role tags, speakTagged will handle splitting —
  // the "primary" role here is just the first role in the text.
  if (step.tutorText) {
    const firstTag = step.tutorText.match(/^\[(tutor|char0|char1|char2|char3|system)\]/);
    if (firstTag) {
      return firstTag[1] as VoiceRole;
    }
  }

  // Steps whose IDs contain "char-N" or "char{N}" patterns get the character voice.
  const charMatch = step.id.match(/char[_-]?(\d)/i);
  if (charMatch) {
    const idx = parseInt(charMatch[1], 10);
    if (idx >= 0 && idx <= 3) return CHARACTER_ROLES[idx];
  }

  // Choice and narrate steps default to tutor.
  return "tutor";
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

interface TutorPanelProps {
  step: LessonStep;
  onChoice: (nextId: string) => void;
  onContinue: () => void;
  taskHeader?: string;
}

// ---------------------------------------------------------------------------
// TutorPanel
// ---------------------------------------------------------------------------

export function TutorPanel({ step, onChoice, onContinue, taskHeader }: TutorPanelProps) {
  const {
    speakAs,
    speakTagged,
    stop,
    isSpeaking,
    isMuted,
    toggleMute,
    voices,
    assignVoice,
    getVoiceForRole,
    profiles,
    updateProfile,
    queueLength,
  } = useSpeech();

  const [showVoicePanel, setShowVoicePanel] = useState(false);

  // Track which role is currently "active" for the animated dots.
  // We derive this from isSpeaking + the last-spoken role.
  const [activeRole, setActiveRole] = useState<VoiceRole | null>(null);

  const showContinue =
    step.type === "narrate" ||
    step.type === "show-number" ||
    step.type === "show-fraction";
  const showChoices = step.type === "choice" && step.choices;

  // ---------------------------------------------------------------------------
  // Auto-speak on step change
  // ---------------------------------------------------------------------------

  const prevStepIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (step.id === prevStepIdRef.current) return;
    prevStepIdRef.current = step.id;

    if (!step.tutorText) return;

    const text = step.tutorText;

    // If the text contains role tags, use speakTagged to parse and queue each
    // segment under the correct voice. Otherwise use the inferred role.
    const hasRoleTags = /\[(tutor|char0|char1|char2|char3|system)\]/.test(text);
    if (hasRoleTags) {
      speakTagged(text);
      // Best-effort: mark first detected role as active.
      const firstTag = text.match(/\[(tutor|char0|char1|char2|char3|system)\]/);
      if (firstTag) {
        setActiveRole(firstTag[1] as VoiceRole);
      }
    } else {
      const role = inferStepRole(step);
      speakAs(role, text);
      setActiveRole(role);
    }
  }, [step.id, step.tutorText, speakAs, speakTagged]);

  // Clear active role indicator when speech ends.
  useEffect(() => {
    if (!isSpeaking) {
      setActiveRole(null);
    }
  }, [isSpeaking]);

  // ---------------------------------------------------------------------------
  // Navigation handlers (stop speech before moving)
  // ---------------------------------------------------------------------------

  const handleChoice = useCallback(
    (nextId: string) => {
      stop();
      onChoice(nextId);
    },
    [stop, onChoice]
  );

  const handleContinue = useCallback(() => {
    stop();
    onContinue();
  }, [stop, onContinue]);

  // ---------------------------------------------------------------------------
  // Replay: re-speak the current step's text on demand
  // ---------------------------------------------------------------------------

  const handleReplay = useCallback(() => {
    if (!step.tutorText) return;
    const text = step.tutorText;
    const hasRoleTags = /\[(tutor|char0|char1|char2|char3|system)\]/.test(text);
    if (hasRoleTags) {
      speakTagged(text);
    } else {
      const role = inferStepRole(step);
      speakAs(role, text);
      setActiveRole(role);
    }
  }, [step, speakAs, speakTagged]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const displayedRoles: VoiceRole[] = ["tutor", "char0", "char1", "char2", "char3"];

  return (
    <div className="relative flex flex-col h-full p-6 pt-20 max-w-[300px]">
      {/* Keyframe animations for speaker wave icons */}
      <style>{`
        @keyframes wave-pulse-1 {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
        @keyframes wave-pulse-2 {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 1; }
        }
        .animate-wave-1 { animation: wave-pulse-1 1.1s ease-in-out infinite; }
        .animate-wave-2 { animation: wave-pulse-2 1.1s ease-in-out infinite; }
      `}</style>

      {/* Voice Assignment Panel (overlay) */}
      {showVoicePanel && (
        <VoiceAssignmentPanel
          voices={voices}
          profiles={profiles}
          getVoiceForRole={getVoiceForRole}
          assignVoice={assignVoice}
          updateProfile={updateProfile}
          onClose={() => setShowVoicePanel(false)}
        />
      )}

      {/* Task header */}
      {taskHeader && (
        <div className="bg-white/10 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <span className="text-sm text-blue-300">{taskHeader}</span>
          <span className="text-xl">&#x1F44B;</span>
        </div>
      )}

      <div className="flex-1" />

      {/* Active role indicator dots */}
      <div className="flex items-center gap-1.5 mb-2" aria-hidden="true">
        {displayedRoles.map((role) => (
          <RoleDot
            key={role}
            role={role}
            isActive={isSpeaking && activeRole === role}
          />
        ))}
        {isSpeaking && queueLength > 0 && (
          <span className="text-[10px] text-white/30 ml-1">
            +{queueLength}
          </span>
        )}
      </div>

      {/* Tutor text */}
      <div className="mb-4">
        {/*
          Render the text without the role tags so the UI stays clean.
          The raw step.tutorText is the source of truth for speech; the
          displayed text strips out the markup.
        */}
        <p className="text-base leading-relaxed text-[#e8ecff]">
          {step.tutorText
            ? step.tutorText.replace(/\[(\/?(tutor|char0|char1|char2|char3|system))\]/g, "")
            : ""}
        </p>
      </div>

      {/* Choices */}
      {showChoices && (
        <div className="flex flex-wrap gap-2 mb-4">
          {step.choices!.map((choice) => (
            <button
              key={choice.label}
              onClick={() => handleChoice(choice.next)}
              className="px-4 py-2.5 rounded-xl bg-white/10 text-[#e8ecff] text-sm font-medium
                hover:bg-white/20 active:bg-white/25 transition-colors cursor-pointer"
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}

      {/* Continue button */}
      {showContinue && step.next && (
        <button
          onClick={handleContinue}
          aria-label="Continue to next step"
          className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-400 active:bg-blue-600
            flex items-center justify-center transition-colors cursor-pointer mt-2 mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4L10 16M10 16L4 10M10 16L16 10"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Bottom toolbar */}
      <div className="flex items-center gap-2 mt-auto">

        {/* Mute / unmute */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute voices" : "Mute voices"}
          title={isMuted ? "Unmute" : "Mute"}
          className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center
            text-white transition-colors cursor-pointer flex-shrink-0"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <SpeakerBody />
            {isMuted ? <SpeakerMutedX /> : <SpeakerWaves animate={isSpeaking} />}
          </svg>
        </button>

        {/* Replay button — re-speaks the current step */}
        <button
          onClick={handleReplay}
          aria-label="Replay audio"
          title="Replay"
          disabled={isMuted || !step.tutorText}
          className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center
            text-white transition-colors cursor-pointer flex-shrink-0
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Circular arrow (replay) */}
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
          </svg>
        </button>

        {/* Voice settings button */}
        <button
          onClick={() => setShowVoicePanel((v) => !v)}
          aria-label="Open voice settings"
          title="Voice settings"
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-white
            transition-colors cursor-pointer flex-shrink-0 ${
              showVoicePanel
                ? "bg-blue-500/50 hover:bg-blue-500/60"
                : "bg-white/10 hover:bg-white/20"
            }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Sliders icon */}
            <line x1="4"  y1="21" x2="4"  y2="14" />
            <line x1="4"  y1="10" x2="4"  y2="3"  />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8"  x2="12" y2="3"  />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3"  />
            <line x1="1"  y1="14" x2="7"  y2="14" />
            <line x1="9"  y1="8"  x2="15" y2="8"  />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>

        {/* Character role indicators (compact) */}
        <div className="ml-auto flex items-center gap-1" aria-hidden="true" title="Active voice role">
          {displayedRoles.map((role) => (
            <RoleDot
              key={role}
              role={role}
              isActive={isSpeaking && activeRole === role}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
