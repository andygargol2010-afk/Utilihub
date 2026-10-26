import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-costo-kwh",
  "Electricity Cost Calculator",
  "hogar",
  "calculator",
  "Calculate monthly electricity cost from kWh usage and rate.",
  [
    "electricity cost calculator",
    "kwh cost",
    "calculadora costo electricidad",
    "costo kwh",
  ],
  {
    title: "Electricity Cost Calculator | UtiliHub",
    description: "Free monthly electricity cost calculator. Enter kWh and rate. Browser-only.",
    summaryEs: "Calcula el costo mensual de electricidad a partir de kWh y tarifa.",
  },
);
tool.faq.push(
  faq(
    "How is the cost calculated?",
    "Monthly cost = kWh × rate per kWh.",
  ),
);

export const KWH_COST_CALCULATOR_TOOLS = [tool];
