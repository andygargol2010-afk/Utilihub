import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ingesta-agua",
  "Water Intake Calculator",
  "productividad",
  "calculator",
  "Estimate daily water intake based on body weight, activity, and climate.",
  [
    "water intake calculator",
    "daily water intake",
    "how much water should I drink",
    "calculadora de agua diaria",
    "cuanta agua beber al dia",
    "ingesta de agua",
  ],
  {
    title: "Water Intake Calculator — How much water should I drink daily? | UtiliHub",
    description: "Free daily water intake calculator. Enter weight, activity level, and climate to get a recommended liters or ounces per day. Runs locally in the browser.",
  },
);
tool.faq.push(faq("How is daily water intake calculated?", "A common starting point is 30–35 ml per kg of body weight, adjusted upward for exercise and hot weather. This tool uses that range plus activity and climate factors."));
tool.faq.push(faq("Is this medical advice?", "No. It is a general estimate for healthy adults. Needs vary by health, pregnancy, illness, and other factors. Consult a professional if you have questions."));
tool.faq.push(faq("Does it include food water?", "The estimate is for total fluids. Many people get 20% from food; the number shown is a practical target for drinks."));

export const WATER_INTAKE_TOOLS = [tool];
