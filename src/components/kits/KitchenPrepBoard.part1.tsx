// Part 1 of 3 — split from KitchenPrepBoard.tsx on 2026-11-04. Edit here; KitchenPrepBoard.tsx re-exports.

export const BASE_SERVINGS = 4;

export type Ingredient = { id: string; en: string; es: string; amount: number; unit: string };
export type Step = { id: string; en: string; es: string; duration: number };
export type Recipe = { id: string; en: string; es: string; ingredients: Ingredient[]; steps: Step[] };

export const RECIPES: Recipe[] = [
  {
    id: "chicken-bowl",
    en: "Chicken rice bowl",
    es: "Bowl de pollo y arroz",
    ingredients: [
      { id: "chicken", en: "Chicken breast", es: "Pechuga de pollo", amount: 500, unit: "g" },
      { id: "rice", en: "Rice", es: "Arroz", amount: 200, unit: "g" },
      { id: "veggies", en: "Mixed vegetables", es: "Verduras mixtas", amount: 300, unit: "g" },
      { id: "oil", en: "Olive oil", es: "Aceite de oliva", amount: 2, unit: "tbsp" },
      { id: "salt", en: "Salt", es: "Sal", amount: 1, unit: "tsp" },
      { id: "pepper", en: "Pepper", es: "Pimienta", amount: 0.5, unit: "tsp" },
    ],
    steps: [
      { id: "prep", en: "Prep ingredients", es: "Preparar ingredientes", duration: 10 },
      { id: "cook-rice", en: "Cook rice", es: "Cocinar arroz", duration: 15 },
      { id: "sear", en: "Sear chicken", es: "Sellar el pollo", duration: 8 },
      { id: "veggies", en: "Saut\u00e9 vegetables", es: "Saltear verduras", duration: 7 },
      { id: "combine", en: "Combine & season", es: "Combinar y sazonar", duration: 5 },
      { id: "rest", en: "Rest & plate", es: "Reposar y emplatar", duration: 3 },
    ],
  },
  {
    id: "veggie-stir",
    en: "Veggie stir-fry",
    es: "Salteado de verduras",
    ingredients: [
      { id: "tofu", en: "Firm tofu", es: "Tofu firme", amount: 300, unit: "g" },
      { id: "noodles", en: "Rice noodles", es: "Fideos de arroz", amount: 180, unit: "g" },
      { id: "broccoli", en: "Broccoli", es: "Br\u00f3coli", amount: 250, unit: "g" },
      { id: "pepper-bell", en: "Bell pepper", es: "Pimiento", amount: 150, unit: "g" },
      { id: "soy", en: "Soy sauce", es: "Salsa de soja", amount: 3, unit: "tbsp" },
      { id: "garlic", en: "Garlic", es: "Ajo", amount: 2, unit: "cloves" },
    ],
    steps: [
      { id: "soak", en: "Soak noodles", es: "Remojar fideos", duration: 8 },
      { id: "prep-veg", en: "Prep vegetables", es: "Preparar verduras", duration: 7 },
      { id: "sear-tofu", en: "Sear tofu", es: "Sellar tofu", duration: 6 },
      { id: "stir", en: "Stir-fry everything", es: "Saltear todo", duration: 6 },
      { id: "sauce", en: "Add sauce & toss", es: "Agregar salsa y mezclar", duration: 3 },
      { id: "plate", en: "Plate & garnish", es: "Emplatar y decorar", duration: 2 },
    ],
  },
  {
    id: "overnight-oats",
    en: "Overnight oats",
    es: "Avena nocturna",
    ingredients: [
      { id: "oats", en: "Rolled oats", es: "Avena en hojuelas", amount: 160, unit: "g" },
      { id: "milk", en: "Milk or plant milk", es: "Leche o vegetal", amount: 400, unit: "ml" },
      { id: "yogurt", en: "Yogurt", es: "Yogur", amount: 120, unit: "g" },
      { id: "fruit", en: "Mixed fruit", es: "Fruta mixta", amount: 200, unit: "g" },
      { id: "honey", en: "Honey or maple", es: "Miel o maple", amount: 2, unit: "tbsp" },
      { id: "chia", en: "Chia seeds", es: "Semillas de ch\u00eda", amount: 2, unit: "tbsp" },
    ],
    steps: [
      { id: "mix", en: "Mix oats & liquid", es: "Mezclar avena y l\u00edquido", duration: 3 },
      { id: "add-ins", en: "Add chia & sweetener", es: "Agregar ch\u00eda y endulzante", duration: 2 },
      { id: "portion", en: "Portion into jars", es: "Porcionar en frascos", duration: 4 },
      { id: "top", en: "Top with fruit", es: "Cubrir con fruta", duration: 3 },
      { id: "chill", en: "Chill overnight", es: "Enfriar toda la noche", duration: 480 },
      { id: "serve", en: "Stir & serve", es: "Revolver y servir", duration: 1 },
    ],
  },
];

export const STORAGE_KEY = "utilihub-kit-kitchen-prep";

export type Props = { locale?: "en" | "es" };
