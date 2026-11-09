// Part 1 of 3 — split from conversions.ts on 2026-11-04. Edit here; conversions.ts re-exports.
import type { ToolReference } from "./types";

export const OUNCES_GRAMS_REFERENCE: ToolReference = {
  formula: {
    title: { en: "Ounces to grams formula", es: "Fórmula de onzas a gramos" },
    lines: [
      { en: "grams = ounces × 28.349523125", es: "gramos = onzas × 28,349523125" },
      { en: "ounces = grams ÷ 28.349523125", es: "onzas = gramos ÷ 28,349523125" },
      {
        en: "This is the avoirdupois ounce (weight). Fluid ounces measure volume and need a different converter.",
        es: "Es la onza avoirdupois (peso). La onza líquida mide volumen y necesita otro conversor.",
      },
    ],
  },
  table: {
    caption: { en: "Ounces to grams chart", es: "Tabla de onzas a gramos" },
    headers: [
      { en: "Ounces (oz)", es: "Onzas (oz)" },
      { en: "Grams (g)", es: "Gramos (g)" },
    ],
    rows: [
      { en: ["0.5 oz", "14.17 g"], es: ["0,5 oz", "14,17 g"] },
      { en: ["1 oz", "28.35 g"], es: ["1 oz", "28,35 g"] },
      { en: ["2 oz", "56.70 g"], es: ["2 oz", "56,70 g"] },
      { en: ["4 oz (¼ lb)", "113.40 g"], es: ["4 oz (¼ lb)", "113,40 g"] },
      { en: ["8 oz (½ lb)", "226.80 g"], es: ["8 oz (½ lb)", "226,80 g"] },
      { en: ["12 oz", "340.19 g"], es: ["12 oz", "340,19 g"] },
      { en: ["16 oz (1 lb)", "453.59 g"], es: ["16 oz (1 lb)", "453,59 g"] },
    ],
  },
  examples: [
    { en: "6 oz of cheese: 6 × 28.3495 = 170.10 g.", es: "6 oz de queso: 6 × 28,3495 = 170,10 g." },
    { en: "250 g of pasta in ounces: 250 ÷ 28.3495 = 8.82 oz.", es: "250 g de pasta en onzas: 250 ÷ 28,3495 = 8,82 oz." },
    {
      en: "Quick mental estimate: multiply ounces by 28 (or by 30 for a rough figure, ~6 % high).",
      es: "Cálculo mental rápido: multiplicar las onzas por 28 (o por 30 para una cifra aproximada, ~6 % de más).",
    },
  ],
};
