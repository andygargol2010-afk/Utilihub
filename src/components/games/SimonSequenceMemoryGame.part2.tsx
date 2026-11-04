// Part 2 of 3 — split from SimonSequenceMemoryGame.tsx on 2026-11-04. Edit here; SimonSequenceMemoryGame.tsx re-exports.

export type Status = "idle" | "playing" | "input" | "over";
export type Difficulty = "easy" | "normal" | "hard";

export const SPEED: Record<Difficulty, number> = { easy: 1.45, normal: 1, hard: 0.65 };

export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
