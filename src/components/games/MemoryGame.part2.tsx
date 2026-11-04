// Part 2 of 3 — split from MemoryGame.tsx on 2026-11-04. Edit here; MemoryGame.tsx re-exports.
import { ICONS } from "./MemoryGame.part1";

export type Card = { id: number; icon: string; flipped: boolean; matched: boolean };

export function buildDeck(): Card[] {
  const pairs = ICONS.flatMap((icon, i) => [
    { id: i * 2, icon, flipped: false, matched: false },
    { id: i * 2 + 1, icon, flipped: false, matched: false },
  ]);
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j]!, pairs[i]!];
  }
  return pairs;
}
