// Reference content for ounces→grams, tablespoons→ml and kg→lb converters.
// Add entries surgically; never rewrite this file wholesale.
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
