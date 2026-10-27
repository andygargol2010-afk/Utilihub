import { makeTool } from "./types";

const tool = makeTool(
  "calculadora-costo-litro-combustible",
  "Fuel Liter Cost Calculator",
  "viajes",
  "calculator",
  "Calculate the total cost of fuel from price per liter and liters.",
  [
    "fuel cost calculator",
    "price per liter calculator",
    "calculadora costo combustible",
    "precio por litro",
  ],
  {
    title: "Fuel Cost per Liter Calculator | UtiliHub",
    description: "Free calculator for total fuel cost. Price per liter \u00d7 liters. Browser-only.",
    summaryEs: "Calcula el costo total de combustible a partir del precio por litro y los litros.",
  },
);

export const FUEL_LITER_COST_CALCULATOR_TOOLS = [tool];
