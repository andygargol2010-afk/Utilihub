import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-escalado-receta",
  "Recipe Scaler Calculator",
  "cocina",
  "calculator",
  "Scale recipe ingredients by a multiplication factor or target servings.",
  [
    "recipe scaler",
    "scale recipe",
    "calculadora escalado receta",
    "multiplicar ingredientes",
    "recipe multiplier",
  ],
  {
    title: "Recipe Scaler Calculator | UtiliHub",
    description: "Free online recipe scaler. Multiply ingredients by a factor or adjust for more servings. Instant calculation in your browser.",
    summaryEs: "Escala los ingredientes de una receta por un factor o porciones objetivo.",
  },
);
tool.faq.push(
  faq(
    "How do I scale a recipe?",
    "Enter the original amount and the scale factor (e.g. 2 for double). The new amount is original × factor.",
  ),
);
tool.faq.push(
  faq(
    "Can I scale by servings?",
    "Yes. Enter original servings, target servings, and original amount. Factor = target / original.",
  ),
);

export const RECIPE_SCALER_CALCULATOR_TOOLS = [tool];
