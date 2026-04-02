"use client";

import { useDroppable } from "@dnd-kit/core";
import { Character } from "./Character";

interface DroppableCharacterProps {
  charIndex: number;
  mood: "neutral" | "happy" | "sad";
  size: number;
  onClick?: () => void;
  highlighted?: boolean;
}

export function DroppableCharacter({
  charIndex,
  mood,
  size,
  onClick,
  highlighted,
}: DroppableCharacterProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `character-${charIndex}`,
    data: { charIndex },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        borderRadius: "1rem",
        transition: "box-shadow 0.15s ease, transform 0.15s ease",
        transform: isOver ? "scale(1.05)" : undefined,
        boxShadow: isOver
          ? "0 0 0 3px #fbbf24, 0 0 16px rgba(251,191,36,0.5)"
          : undefined,
      }}
    >
      <Character id={charIndex} mood={mood} size={size} onClick={onClick} highlighted={highlighted} />
    </div>
  );
}
