import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-consumo-agua",
  "Water Consumption Calculator",
  "hogar",
  "calculator",
  "Estimate monthly and yearly water consumption from daily liters.",
  [
    "water consumption calculator",
    "daily water usage",
    "calculadora consumo agua",
    "consumo de agua mensual",
  ],
  {
    title: "Water Consumption Calculator — Daily liters to monthly & yearly | UtiliHub",
    description: "Free water consumption calculator. Enter liters per day and days to estimate monthly and yearly use. Local browser calculation.",
  },
);
tool.faq.push(faq("How is it calculated?", "Monthly = liters/day × days. Yearly = monthly × 12."));

export const WATER_CONSUMPTION_CALCULATOR_TOOLS = [tool];
