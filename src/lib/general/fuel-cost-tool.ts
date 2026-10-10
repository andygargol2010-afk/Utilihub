import { makeTool } from "./types";

export const FUEL_COST_TOOLS = [
  makeTool(
    "calculadora-costo-combustible",
    "Fuel Cost Calculator",
    "utilidades",
    "calculator",
    "Calculate trip fuel cost from distance, consumption and price per liter. Instant, local, no signup.",
    [
      "fuel cost calculator",
      "trip cost calculator",
      "calculadora de costo de combustible",
      "costo de viaje",
      "consumo combustible",
    ],
    {
      title: "Fuel Cost Calculator — Distance, consumption, price | UtiliHub",
      description: "Free fuel cost calculator. Enter distance, fuel consumption (L/100km) and price per liter to get total cost. Runs in the browser.",
      operation: "fuel-cost",
      fields: ["Distance (km)", "Consumption (L/100 km)", "Price per liter"],
    },
  ),
];
