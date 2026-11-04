// Part 1 of 3 — split from MemoryMatchClassicGame.tsx on 2026-11-04. Edit here; MemoryMatchClassicGame.tsx re-exports.

export const SIZES = [
  { id: "4x4", cols: 4, rows: 4, pairs: 8, labelEn: "4×4 Easy (8 pairs)", labelEs: "4×4 Fácil (8 pares)" },
  { id: "6x4", cols: 6, rows: 4, pairs: 12, labelEn: "6×4 Medium (12 pairs)", labelEs: "6×4 Medio (12 pares)" },
  { id: "6x6", cols: 6, rows: 6, pairs: 18, labelEn: "6×6 Hard (18 pairs)", labelEs: "6×6 Difícil (18 pares)" },
] as const;
