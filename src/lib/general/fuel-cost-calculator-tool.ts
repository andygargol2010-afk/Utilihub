import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-costo-combustible",
  "Fuel Cost Calculator",
  "viajes",
  "calculator",
  "Calculate the cost of fuel for a trip. Enter distance, consumption, and price per liter.",
  [
    "fuel cost calculator",
    "trip fuel cost",
    "calculadora costo combustible",
    "costo gasolina viaje",
    "how much gas for a trip",
  ],
  {
    title: "Fuel Cost Calculator — Trip Gas Cost | UtiliHub",
    description: "Free fuel cost calculator. Enter distance (km), consumption (L/100km), and price per liter to get total fuel cost. Browser-only.",
  },
);
tool.faq.push(faq("How is fuel cost calculated?", "Liters needed = (distance / 100) × consumption. Cost = liters × price per liter."));
tool.faq.push(faq("What units does it use?", "Distance in kilometers, consumption in liters per 100 km, price in your currency per liter."));

export const FUEL_COST_CALCULATOR_TOOLS = [tool];
