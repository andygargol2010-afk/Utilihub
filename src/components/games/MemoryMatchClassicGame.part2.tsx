// Part 2 of 3 — split from MemoryMatchClassicGame.tsx on 2026-11-04. Edit here; MemoryMatchClassicGame.tsx re-exports.
import { SIZES } from "./MemoryMatchClassicGame.part1";

export type SizeId = (typeof SIZES)[number]["id"];

export const THEMES = [
  { id: "fruits", icons: ["🍎", "🍋", "🍇", "🍒", "🥝", "🍑", "🍉", "🍍", "🍓", "🍌", "🍊", "🥭"], labelEn: "Fruits", labelEs: "Frutas" },
  { id: "animals", icons: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮"], labelEn: "Animals", labelEs: "Animales" },
  { id: "numbers", icons: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "#️⃣", "*️⃣"], labelEn: "Numbers", labelEs: "Números" },
  { id: "symbols", icons: ["⭐", "❤️", "💎", "🔔", "🎯", "🎲", "🧩", "🎨", "🎵", "⚡️", "🔥", "🌈"], labelEn: "Symbols", labelEs: "Símbolos" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export type Card = { id: number; icon: string; flipped: boolean; matched: boolean };

export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildDeck(pairCount: number, icons: string[], seed?: number): Card[] {
  const used = icons.slice(0, pairCount);
  const pairs = used.flatMap((icon, i) => [
    { id: i * 2, icon, flipped: false, matched: false },
    { id: i * 2 + 1, icon, flipped: false, matched: false },
  ]);
  const rng = seed != null ? mulberry32(seed) : () => Math.random();
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j]!, pairs[i]!];
  }
  return pairs;
}

export function updateUrl(sizeId: SizeId, themeId: ThemeId, seed: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("size", sizeId);
  url.searchParams.set("theme", themeId);
  url.searchParams.set("seed", String(seed));
  window.history.replaceState(null, "", url);
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
