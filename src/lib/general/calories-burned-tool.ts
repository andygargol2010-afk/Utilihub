import type { GeneralTool } from "./types";

export const CALORIES_BURNED_CALCULATOR_TOOLS: GeneralTool[] = [
  {
    slug: "calculadora-calorias-quemadas",
    name: "Calories Burned Calculator",
    nameEs: "Calculadora de calorías quemadas",
    description: "Estimate calories burned by activity, weight and duration.",
    descriptionEs: "Estima calorías quemadas por actividad, peso y duración.",
    category: "salud",
    kind: "calculator",
    about: ["Simple MET-based calorie burn estimator."],
    steps: ["Enter weight, duration and activity MET."],
    faq: [],
  },
];
