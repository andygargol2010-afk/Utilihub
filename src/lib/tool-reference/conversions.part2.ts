// Part 2 of 3 — split from conversions.ts on 2026-11-04. Edit here; conversions.ts re-exports.
import type { ToolReference } from "./types";

export const TABLESPOON_ML_REFERENCE: ToolReference = {
  formula: {
    title: { en: "Tablespoons to ml formula", es: "Fórmula de cucharadas a ml" },
    lines: [
      { en: "ml = tablespoons × 14.7868 (US tablespoon)", es: "ml = cucharadas × 14,7868 (cucharada de EE. UU.)" },
      { en: "ml = tablespoons × 15 (metric tablespoon)", es: "ml = cucharadas × 15 (cucharada métrica)" },
      {
        en: "1 tablespoon = 3 teaspoons; 16 US tablespoons = 1 US cup (236.59 ml).",
        es: "1 cucharada = 3 cucharaditas; 16 cucharadas de EE. UU. = 1 taza de EE. UU. (236,59 ml).",
      },
    ],
  },
  table: {
    caption: { en: "Tablespoons to milliliters chart", es: "Tabla de cucharadas a mililitros" },
    headers: [
      { en: "Tablespoons", es: "Cucharadas" },
      { en: "US (ml)", es: "EE. UU. (ml)" },
      { en: "Metric (ml)", es: "Métrica (ml)" },
    ],
    rows: [
      { en: ["1 tsp (⅓ tbsp)", "4.93", "5"], es: ["1 cucharadita (⅓ cda.)", "4,93", "5"] },
      { en: ["1 tbsp", "14.79", "15"], es: ["1 cda.", "14,79", "15"] },
      { en: ["2 tbsp", "29.57", "30"], es: ["2 cdas.", "29,57", "30"] },
      { en: ["3 tbsp", "44.36", "45"], es: ["3 cdas.", "44,36", "45"] },
      { en: ["4 tbsp (¼ cup)", "59.15", "60"], es: ["4 cdas. (¼ taza)", "59,15", "60"] },
      { en: ["8 tbsp (½ cup)", "118.29", "120"], es: ["8 cdas. (½ taza)", "118,29", "120"] },
      { en: ["16 tbsp (1 cup)", "236.59", "240"], es: ["16 cdas. (1 taza)", "236,59", "240"] },
    ],
  },
  examples: [
    { en: "3 US tablespoons of oil: 3 × 14.7868 = 44.36 ml.", es: "3 cucharadas de aceite (EE. UU.): 3 × 14,7868 = 44,36 ml." },
    { en: "100 ml of milk in US tablespoons: 100 ÷ 14.7868 = 6.76 tbsp.", es: "100 ml de leche en cucharadas de EE. UU.: 100 ÷ 14,7868 = 6,76 cdas." },
    {
      en: "Australian recipes use a 20 ml tablespoon: 2 tbsp = 40 ml, not 30 ml.",
      es: "Las recetas australianas usan cucharada de 20 ml: 2 cdas. = 40 ml, no 30 ml.",
    },
  ],
};
