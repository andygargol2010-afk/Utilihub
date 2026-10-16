import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-deficit-calorico",
  "Calorie Deficit Calculator",
  "salud",
  "calculator",
  "Estimate daily calorie deficit or surplus based on your TDEE and target weight change.",
  [
    "calorie deficit calculator",
    "calorie surplus calculator",
    "weight loss calorie calculator",
    "calculadora de déficit calórico",
    "calculadora de superávit calórico",
    "calculadora de calorías para bajar de peso",
  ],
  {
    title: "Calorie Deficit Calculator — Estimate daily deficit for weight loss | UtiliHub",
    description: "Free calorie deficit calculator. Enter your TDEE and target weekly change to see recommended daily calories. Runs in your browser.",
  },
);
tool.faq.push(faq("How is the deficit calculated?", "A common rule is ~7700 kcal per kg of body weight. Daily deficit = (weekly kg change × 7700) / 7."));
tool.faq.push(faq("What is a safe deficit?", "Most people aim for 500 kcal/day (about 0.5 kg/week). Consult a professional for personalized advice."));

export const CALORIE_DEFICIT_TOOLS = [tool];
