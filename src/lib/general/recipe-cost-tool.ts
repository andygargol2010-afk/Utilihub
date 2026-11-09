import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-costo-receta",
  "Recipe Cost Calculator",
  "cocina",
  "calculator",
  "Calculate total and per-serving cost of a recipe from ingredient package prices and amounts used.",
  [
    "recipe cost calculator",
    "food cost calculator",
    "ingredient cost calculator",
    "calculadora costo receta",
    "costo por porcion",
    "escandallo receta",
  ],
  {
    title: "Recipe Cost Calculator — Food cost per serving | UtiliHub",
    description: "Free recipe cost calculator. Enter package price, size, and amount used for each ingredient to get total cost and cost per serving. Runs in the browser.",
  },
);
tool.faq.push(faq("How do I calculate recipe cost?", "For each ingredient: (package price / package size) × amount used. Sum all ingredients and divide by number of servings."));
tool.faq.push(faq("Does it include labor or packaging?", "This version calculates ingredient food cost only. Add labor, packaging, or overhead separately if needed."));
tool.faq.push(faq("Can I use different units?", "Yes, as long as package size and amount used are in compatible units (e.g. both grams or both ml). The tool does not convert between mass and volume."));

export const RECIPE_COST_TOOLS = [tool];
