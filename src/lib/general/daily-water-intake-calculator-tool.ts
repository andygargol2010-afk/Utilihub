import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ingesta-agua-diaria",
  "Daily Water Intake Calculator",
  "salud",
  "calculator",
  "Estimate recommended daily water intake based on body weight. Common guideline: 30-35 ml per kg.",
  [
    "daily water intake calculator",
    "how much water should i drink",
    "calculadora agua diaria",
    "ingesta de agua por peso",
    "water intake by weight",
  ],
  {
    title: "Daily Water Intake Calculator — Liters by Body Weight | UtiliHub",
    description: "Free daily water intake calculator. Enter your weight in kg to get recommended liters per day (30-35 ml/kg). Browser-only.",
    summaryEs: "Calcula la ingesta diaria de agua recomendada según tu peso. Guía común: 30-35 ml por kg.",
  },
);
tool.faq.push(
  faq(
    "How is daily water intake estimated?",
    "A common guideline is 30–35 ml of water per kilogram of body weight. Results are approximate; individual needs vary with activity, climate, and health.",
  ),
);

export const DAILY_WATER_INTAKE_CALCULATOR_TOOLS = [tool];
