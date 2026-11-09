import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-consumo-gas",
  "Gas Consumption Cost Calculator",
  "hogar",
  "calculator",
  "Calculate the cost of gas consumption from volume and price per unit.",
  [
    "gas consumption calculator",
    "gas cost calculator",
    "calculadora consumo de gas",
    "costo gas hogar",
    "natural gas bill calculator",
  ],
  {
    title: "Gas Consumption Cost Calculator — Volume × Price | UtiliHub",
    description: "Free gas consumption cost calculator. Enter volume and price per unit to get total cost. Instant browser calculation.",
    summaryEs: "Calcula el costo del consumo de gas a partir del volumen y el precio por unidad.",
  },
);
tool.faq.push(faq("How is cost calculated?", "Cost = Volume × Price per unit. Use consistent units (m³ or liters)."));
tool.faq.push(faq("Negative values?", "Volume and price must be non-negative."));

export const GAS_CONSUMPTION_CALCULATOR_TOOLS = [tool];
