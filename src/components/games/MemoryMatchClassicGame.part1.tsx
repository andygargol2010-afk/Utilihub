// Part 1 of 3 — split from MemoryMatchClassicGame.tsx on 2026-11-04. Edit here; MemoryMatchClassicGame.tsx re-exports.

export const SIZES = [
  { id: "4x3", cols: 4, rows: 3, pairs: 6, labelEn: "4×3 (6 pairs)", labelEs: "4×3 (6 pares)" },
  { id: "4x4", cols: 4, rows: 4, pairs: 8, labelEn: "4×4 (8 pairs)", labelEs: "4×4 (8 pares)" },
  { id: "6x4", cols: 6, rows: 4, pairs: 12, labelEn: "6×4 (12 pairs)", labelEs: "6×4 (12 pares)" },
] as const;
