"use client";

import { ComponentType } from "react";
import { useDraggable } from "@dnd-kit/core";
import { ObjectComponentProps, ObjectPiece } from "./Workspace";

interface DraggableBrowniePieceProps {
  piece: ObjectPiece;
  ObjectComponent: ComponentType<ObjectComponentProps>;
  size: number;
  animationState?: "idle" | "pre-split" | "bounce";
  selected?: boolean;
  onClick?: () => void;
}

export function DraggableBrowniePiece({
  piece,
  ObjectComponent,
  size,
  animationState,
  selected,
  onClick,
}: DraggableBrowniePieceProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: piece.id, data: { piece } });

  const style: React.CSSProperties = {
    cursor: "grab",
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
    ...(transform
      ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
      : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
    >
      <ObjectComponent
        type={piece.type}
        size={size}
        selected={selected}
        animationState={animationState}
      />
    </div>
  );
}
