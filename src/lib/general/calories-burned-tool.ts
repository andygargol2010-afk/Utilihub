import type { GeneralTool } from "./types";

export const CALORIES_BURNED_CALCULATOR_TOOLS: GeneralTool[] = [
  {
    slug: "calculadora-calorias-quemadas",
    name: "Calories Burned Calculator",
    nameEs: "Calculadora de calorías quemadas",
    title: "Calories Burned Calculator | MET Estimate | UtiliHub",
    summary: "Estimate calories burned by activity, weight and duration.",
    summaryEs: "Estima calorías quemadas por actividad, peso y duración.",
    keywords: ["calories burned calculator", "met calculator", "calorie burn", "calculadora calorias quemadas", "calorias quemadas ejercicio"],
    description: "Estimate calories burned by activity, weight and duration.",
    descriptionEs: "Estima calorías quemadas por actividad, peso y duración.",
    category: "salud",
    kind: "calculator",
    about: ["Simple MET-based calorie burn estimator."],
    steps: ["Enter weight, duration and activity MET."],
    faq: [],
  },
];
