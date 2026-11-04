// Part 1 of 3 — split from HomeRenovationBoard.tsx on 2026-11-04. Edit here; HomeRenovationBoard.tsx re-exports.

export const STEPS = [
  { id: "measure", en: "Measure room", es: "Medir habitación" },
  { id: "materials", en: "Calculate materials", es: "Calcular materiales" },
  { id: "costs", en: "Estimate costs", es: "Estimar costos" },
  { id: "timeline", en: "Set timeline", es: "Definir cronograma" },
  { id: "review", en: "Review plan", es: "Revisar plan" },
] as const;
