import { makeTool } from "./types";

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

export const COST_PER_KM_CALCULATOR_TOOLS = [tool];
