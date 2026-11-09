import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-caudal",
  "Flow Rate Calculator",
  "ciencia",
  "calculator",
  "Calculate flow rate from volume and time. Q = V / t. Useful for fluids, pumps, recipes, and irrigation.",
  [
    "flow rate calculator",
    "volume over time",
    "calculadora caudal",
    "caudal volumen tiempo",
    "liters per minute calculator",
  ],
  {
    title: "Flow Rate Calculator — Volume / Time | UtiliHub",
    description: "Free flow rate calculator. Enter volume and time to get Q = V/t instantly. Local browser calculation, no signup.",
    summaryEs: "Calcula el caudal a partir de volumen y tiempo. Q = V / t. Útil para fluidos, bombas y recetas.",
  },
);
tool.faq.push(
  faq(
    "What is the formula?",
    "Flow rate Q = Volume / Time. Example: 10 L in 5 min = 2 L/min.",
  ),
);
tool.faq.push(
  faq(
    "Which units?",
    "Any consistent units (L and min → L/min; ml and s → ml/s). The tool does not convert units automatically.",
  ),
);

export const FLOW_RATE_CALCULATOR_TOOLS = [tool];
