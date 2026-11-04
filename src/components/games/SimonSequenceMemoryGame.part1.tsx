// Part 1 of 3 — split from SimonSequenceMemoryGame.tsx on 2026-11-04. Edit here; SimonSequenceMemoryGame.tsx re-exports.

export const PADS = [
  { id: 0, labelEn: "Red", labelEs: "Rojo", bg: "#dc2626", active: "#f87171", freq: 329.63, key: "1" },
  { id: 1, labelEn: "Green", labelEs: "Verde", bg: "#16a34a", active: "#4ade80", freq: 392.0, key: "2" },
  { id: 2, labelEn: "Blue", labelEs: "Azul", bg: "#2563eb", active: "#60a5fa", freq: 440.0, key: "3" },
  { id: 3, labelEn: "Yellow", labelEs: "Amarillo", bg: "#ca8a04", active: "#facc15", freq: 493.88, key: "4" },
] as const;
