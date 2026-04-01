"use client";

import { useState, useEffect } from "react";
import { SPRITE_FRAMES, SpriteAnimation } from "../lib/spriteManifest";

type Mood = "neutral" | "happy" | "sad";

interface CharacterProps {
  id: number;
  mood?: Mood;
  onClick?: () => void;
  highlighted?: boolean;
  size?: number;
}

const MOOD_TO_ANIM: Record<Mood, SpriteAnimation> = {
  neutral: "idle",
  happy: "happy",
  sad: "sad",
};

const SEQ = [0, 1, 2, 1]; // ping-pong frame sequence

export function Character({ id, mood = "neutral", onClick, highlighted = false, size = 150 }: CharacterProps) {
  const anim = MOOD_TO_ANIM[mood];
  const frames = SPRITE_FRAMES[id % 4][anim];
  const [seqIdx, setSeqIdx] = useState(0);

  // Ping-pong animation loop
  useEffect(() => {
    const timer = setInterval(() => setSeqIdx((i) => (i + 1) % SEQ.length), 300);
    return () => clearInterval(timer);
  }, []);

  // Reset to first frame when animation changes
  useEffect(() => {
    setSeqIdx(0);
  }, [anim]);

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center transition-all ${
        highlighted ? "bg-white/10 rounded-xl p-1" : "p-1"
      } ${onClick ? "cursor-pointer hover:scale-105" : ""}`}
    >
      <div style={{ width: size, height: size, position: "relative" }}>
        {frames.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            width={size}
            height={size}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: i === SEQ[seqIdx] ? "block" : "none",
            }}
          />
        ))}
      </div>
    </button>
  );
}
