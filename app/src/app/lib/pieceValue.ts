import type { ObjectPieceType } from "../components/Workspace";

const PIECE_VALUES: Record<ObjectPieceType, number> = {
  whole: 1,
  "half-left": 0.5,
  "half-right": 0.5,
  quarter: 0.25,
  eighth: 0.125,
};

export function pieceValue(type: ObjectPieceType): number {
  return PIECE_VALUES[type];
}
