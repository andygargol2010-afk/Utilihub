import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-macros",
  "Macro Calculator",
  "productividad",
  "calculator",
  "Split daily calories into protein, carbohydrate and fat grams using custom ratios. Runs fully in the browser.",
  [
    "macro calculator",
    "macros calculator",
    "protein calculator",
    "carb fat protein calculator",
    "calculadora de macros",
    "calculadora proteinas carbohidratos grasas",
    "macros proteina",
  ],
  {
    title: "Macro Calculator — Protein, Carbs & Fat Grams | UtiliHub",
    description:
      "Free macro calculator. Enter your daily calories and protein/carb/fat percentages to get gram targets. Instant, local, no signup.",
  },
);
tool.faq.push(
  faq(
    "How are grams calculated?",
    "Protein and carbohydrates provide 4 kcal per gram; fat provides 9 kcal per gram. Grams = (calories × percentage / 100) / kcal_per_gram.",
  ),
);
tool.faq.push(
  faq(
    "What ratios should I use?",
    "Common starting points are 30% protein / 40% carbs / 30% fat, or higher protein for muscle goals. Adjust to your preferences and total calories.",
  ),
);
tool.faq.push(
  faq(
    "Is this nutritional advice?",
    "No. It is a simple arithmetic split of the calories you provide. Individual needs vary; consult a professional for personalized targets.",
  ),
);

export const MACRO_CALCULATOR_TOOLS = [tool];
