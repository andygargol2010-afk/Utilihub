import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-calorias-diarias",
  "Daily Calories Calculator",
  "salud",
  "calculator",
  "Estimate daily calorie needs (TDEE) based on weight, height, age, gender and activity level.",
  [
    "daily calories calculator",
    "calculadora calorias diarias",
    "tdee calculator",
    "calorias diarias",
    "calculadora de calorias",
  ],
  {
    title: "Daily Calories Calculator — TDEE Estimate | UtiliHub",
    description: "Free daily calories / TDEE estimator. Enter age, gender, weight, height and activity level. Runs in your browser.",
  },
);
tool.faq.push(faq("What is TDEE?", "Total Daily Energy Expenditure — the estimated number of calories you burn per day including activity."));

export const DAILY_CALORIES_CALCULATOR_TOOLS = [tool];
