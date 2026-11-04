// Part 2 of 3 — split from RecipeAssemblyKit.tsx on 2026-11-04. Edit here; RecipeAssemblyKit.tsx re-exports.

export type Ingredient = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  notes: string;
};

export type Step = {
  id: string;
  title: string;
  ingredients: Ingredient[];
};

export type Recipe = {
  title: string;
  cuisine: string;
  steps: Step[];
};

export const CUISINES = [
  { id: "blank", en: "Blank", es: "En blanco" },
  { id: "mexican", en: "Mexican", es: "Mexicana" },
  { id: "italian", en: "Italian", es: "Italiana" },
  { id: "asian", en: "Asian", es: "Asiática" },
  { id: "american", en: "American", es: "Americana" },
];

export const PRESETS: Record<string, { title: string; steps: Omit<Step, "id">[] }> = {
  mexican: {
    title: "Tacos al pastor",
    steps: [
      {
        title: "Marinate",
        ingredients: [
          { id: "", name: "pork", qty: 500, unit: "g", notes: "thin slices" },
          { id: "", name: "achiote paste", qty: 2, unit: "tbsp", notes: "" },
          { id: "", name: "pineapple", qty: 100, unit: "g", notes: "diced" },
        ],
      },
      {
        title: "Assemble",
        ingredients: [
          { id: "", name: "corn tortillas", qty: 8, unit: "pcs", notes: "" },
          { id: "", name: "onion", qty: 1, unit: "pcs", notes: "chopped" },
          { id: "", name: "cilantro", qty: 10, unit: "g", notes: "" },
        ],
      },
    ],
  },
  italian: {
    title: "Spaghetti carbonara",
    steps: [
      {
        title: "Sauce",
        ingredients: [
          { id: "", name: "eggs", qty: 3, unit: "pcs", notes: "" },
          { id: "", name: "pecorino", qty: 50, unit: "g", notes: "grated" },
          { id: "", name: "black pepper", qty: 1, unit: "tsp", notes: "" },
        ],
      },
      {
        title: "Pasta",
        ingredients: [
          { id: "", name: "spaghetti", qty: 400, unit: "g", notes: "" },
          { id: "", name: "guanciale", qty: 100, unit: "g", notes: "diced" },
        ],
      },
    ],
  },
  asian: {
    title: "Stir-fry",
    steps: [
      {
        title: "Prep",
        ingredients: [
          { id: "", name: "vegetables", qty: 300, unit: "g", notes: "mixed" },
          { id: "", name: "soy sauce", qty: 2, unit: "tbsp", notes: "" },
          { id: "", name: "garlic", qty: 2, unit: "cloves", notes: "" },
        ],
      },
      {
        title: "Cook",
        ingredients: [
          { id: "", name: "rice", qty: 200, unit: "g", notes: "cooked" },
          { id: "", name: "oil", qty: 1, unit: "tbsp", notes: "" },
        ],
      },
    ],
  },
  american: {
    title: "Classic burger",
    steps: [
      {
        title: "Patty",
        ingredients: [
          { id: "", name: "ground beef", qty: 200, unit: "g", notes: "" },
          { id: "", name: "salt", qty: 0.5, unit: "tsp", notes: "" },
          { id: "", name: "pepper", qty: 0.25, unit: "tsp", notes: "" },
        ],
      },
      {
        title: "Build",
        ingredients: [
          { id: "", name: "bun", qty: 1, unit: "pcs", notes: "" },
          { id: "", name: "cheese", qty: 1, unit: "slice", notes: "" },
          { id: "", name: "lettuce", qty: 1, unit: "leaf", notes: "" },
        ],
      },
    ],
  },
};

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function emptyRecipe(): Recipe {
  return {
    title: "",
    cuisine: "blank",
    steps: [{ id: uid(), title: "", ingredients: [] }],
  };
}

export function withIds(preset: typeof PRESETS[string]): Recipe {
  return {
    title: preset.title,
    cuisine: "blank",
    steps: preset.steps.map((s) => ({
      id: uid(),
      title: s.title,
      ingredients: s.ingredients.map((i) => ({ ...i, id: uid() })),
    })),
  };
}

export function encodeRecipe(r: Recipe): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(r))));
  } catch {
    return "";
  }
}

export function decodeRecipe(s: string | null): Recipe | null {
  if (!s) return null;
  try {
    return JSON.parse(decodeURIComponent(escape(atob(s))));
  } catch {
    return null;
  }
}
