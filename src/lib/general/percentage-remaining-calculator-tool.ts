import { makeTool } from "./types";

const tool = makeTool(
  "calculadora-porcentaje-restante",
  "Percentage Remaining Calculator",
  "matematicas",
  "calculator",
  "Calculate the remaining percentage after a given percentage is taken.",
  [
    "percentage remaining calculator",
    "remaining percent calculator",
    "calculadora porcentaje restante",
    "porcentaje que queda",
  ],
  {
    title: "Percentage Remaining Calculator | UtiliHub",
    description: "Free calculator for remaining percentage. 100% - used %. Browser-only.",
    summaryEs: "Calcula el porcentaje restante después de aplicar un porcentaje.",
  },
);

export const PERCENTAGE_REMAINING_CALCULATOR_TOOLS = [tool];
