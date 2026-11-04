import type { ToolReference } from "./types";
export { OUNCES_GRAMS_REFERENCE } from "./conversions.part1";
export { TABLESPOON_ML_REFERENCE } from "./conversions.part2";

export const KG_LBS_REFERENCE: ToolReference = {
  formula: {
    title: { en: "Kg to lbs formula", es: "Fórmula de kg a libras" },
    lines: [
      { en: "pounds = kilograms × 2.20462262", es: "libras = kilogramos × 2,20462262" },
      { en: "kilograms = pounds × 0.45359237 (exact definition)", es: "kilogramos = libras × 0,45359237 (definición exacta)" },
      { en: "1 stone = 14 lb = 6.35 kg.", es: "1 stone = 14 lb = 6,35 kg." },
    ],
  },
  table: {
    caption: { en: "Kilograms to pounds chart", es: "Tabla de kilogramos a libras" },
    headers: [
      { en: "Kilograms (kg)", es: "Kilogramos (kg)" },
      { en: "Pounds (lb)", es: "Libras (lb)" },
    ],
    rows: [
      { en: ["1 kg", "2.20 lb"], es: ["1 kg", "2,20 lb"] },
      { en: ["5 kg", "11.02 lb"], es: ["5 kg", "11,02 lb"] },
      { en: ["10 kg", "22.05 lb"], es: ["10 kg", "22,05 lb"] },
      { en: ["20 kg", "44.09 lb"], es: ["20 kg", "44,09 lb"] },
      { en: ["50 kg", "110.23 lb"], es: ["50 kg", "110,23 lb"] },
      { en: ["70 kg", "154.32 lb"], es: ["70 kg", "154,32 lb"] },
      { en: ["100 kg", "220.46 lb"], es: ["100 kg", "220,46 lb"] },
    ],
  },
  examples: [
    { en: "68 kg in pounds: 68 × 2.20462 = 149.91 lb.", es: "68 kg en libras: 68 × 2,20462 = 149,91 lb." },
    { en: "150 lb in kilograms: 150 × 0.45359237 = 68.04 kg.", es: "150 lb en kilogramos: 150 × 0,45359237 = 68,04 kg." },
    {
      en: "Mental shortcut: double the kilograms and add 10 % (70 kg → 140 + 14 = 154 lb).",
      es: "Atajo mental: duplicar los kilos y sumar un 10 % (70 kg → 140 + 14 = 154 lb).",
    },
  ],
};
