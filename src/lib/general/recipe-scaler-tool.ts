import { makeTool, faq } from "./types";

const tool = makeTool(
  "escalador-receta",
  "Recipe Scaler",
  "cocina",
  "calculator",
  "Scale recipe ingredients by servings or a multiplication factor.",
  [
    "recipe scaler",
    "scale recipe ingredients",
    "multiply recipe",
    "escalar receta",
    "multiplicar ingredientes",
    "calculadora de porciones",
  ],
  {
    title: "Recipe Scaler — Scale Ingredients by Servings | UtiliHub",
    description: "Free recipe scaler. Enter original servings, desired servings, and ingredient lines to get scaled amounts. Runs locally in the browser.",
  },
);
tool.faq.push(faq("How does scaling work?", "Numbers in each line are multiplied by the factor (desired / original). Units and text stay the same."));
tool.faq.push(faq("What if an ingredient has no number?", "Lines without numbers are left unchanged."));

export const RECIPE_SCALER_TOOLS = [tool];
