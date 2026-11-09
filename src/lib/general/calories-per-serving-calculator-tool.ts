import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-calorias-porcion",
  "Calories per Serving Calculator",
  "hogar",
  "calculator",
  "Calculate calories per serving from total calories and number of servings.",
  [
    "calories per serving calculator",
    "calculadora calorias por porcion",
    "calorias por racion",
    "calories per portion",
  ],
  {
    title: "Calories per Serving Calculator | UtiliHub",
    description: "Free calories per serving calculator. Enter total calories and servings to get calories per portion. Instant browser calculation, EN+ES.",
    summaryEs: "Calcula las calorías por porción a partir del total de calorías y el número de raciones.",
  },
);
tool.faq.push(faq("How to calculate calories per serving?", "Divide the total calories of the recipe or package by the number of servings. The result is calories per portion, useful for tracking."));
tool.faq.push(faq("What if servings is not an integer?", "You can use decimal servings (e.g. 2.5). The calculator handles it and rounds the result to 1 decimal for practicality."));

export const CALORIES_PER_SERVING_CALCULATOR_TOOLS = [tool];
