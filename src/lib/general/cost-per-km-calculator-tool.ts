import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-costo-por-km",
  "Cost Per Km Calculator",
  "viajes",
  "calculator",
  "Calculate cost per kilometer for trips or transport.",
  [
    "cost per km calculator",
    "cost per kilometer",
    "calculadora costo por km",
    "costo por kilometro viaje",
  ],
  {
    title: "Cost Per Km Calculator | UtiliHub",
    description: "Free cost per kilometer calculator for travel. Total cost and distance. Browser-only.",
    summaryEs: "Calcula el costo por kilómetro para viajes o transporte.",
  },
);
tool.faq.push(
  faq(
    "How is cost per km calculated?",
    "Cost per km = total trip cost / distance in km. For example, a 45 EUR trip over 150 km costs 0.30 EUR per km. Use the same currency unit for cost and result.",
  ),
);

export const COST_PER_KM_CALCULATOR_TOOLS = [tool];
