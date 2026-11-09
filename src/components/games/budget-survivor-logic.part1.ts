// Part 1 of 3 — split from budget-survivor-logic.ts on 2026-11-04. Edit here; budget-survivor-logic.ts re-exports.

export type Difficulty = "easy" | "medium" | "hard";
export type EventKind = "bill" | "optional" | "income" | "surprise";

export type GameEvent = {
  id: string;
  kind: EventKind;
  day: number;
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  amount: number;
  skippable: boolean;
  altAmount?: number;
  altLabelEn?: string;
  altLabelEs?: string;
};

export const START: Record<Difficulty, number> = {
  easy: 1200,
  medium: 900,
  hard: 650,
};

export const DAYS = 28;

export function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
