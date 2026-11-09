import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tdee",
  "TDEE Calculator",
  "productividad",
  "calculator",
  "Estimate Total Daily Energy Expenditure (TDEE) and BMR from age, sex, weight, height, and activity level.",
  [
    "tdee calculator",
    "how many calories should I eat",
    "bmr calculator",
    "calorie calculator",
    "calculadora tdee",
    "cuantas calorias debo comer",
    "calculadora de gasto calorico",
  ],
  {
    title: "TDEE Calculator — How many calories do I need daily? | UtiliHub",
    description: "Free TDEE and BMR calculator using Mifflin-St Jeor. Enter age, sex, weight, height and activity to get maintenance calories. Runs locally in the browser.",
  },
);
tool.faq.push(faq("How is TDEE calculated?", "BMR is estimated with the Mifflin-St Jeor equation, then multiplied by an activity factor (1.2 sedentary to 1.9 very active) to get TDEE."));
tool.faq.push(faq("Is this medical or nutritional advice?", "No. It is a general estimate based on population formulas. Individual needs vary; consult a professional for personalized advice."));
tool.faq.push(faq("What is the difference between BMR and TDEE?", "BMR is calories burned at rest. TDEE adds the calories used for daily activity and exercise."));

export const TDEE_CALCULATOR_TOOLS = [tool];
