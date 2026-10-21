import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-cambio-porcentaje",
  "Percentage Change Calculator",
  "finanzas",
  "calculator",
  "Calculate the percentage change between two values.",
  [
    "percentage change calculator",
    "percent change",
    "calculadora cambio porcentaje",
    "variacion porcentual",
  ],
  {
    title: "Percentage Change Calculator — ((New − Old) / Old) × 100 | UtiliHub",
    description: "Free percentage change calculator. Enter initial and final values to get the percent change. Local browser calculation.",
  },
);
tool.faq.push(faq("How is percentage change calculated?", "((final − initial) / initial) × 100. Negative means a decrease."));

export const PERCENTAGE_CHANGE_CALCULATOR_TOOLS = [tool];
