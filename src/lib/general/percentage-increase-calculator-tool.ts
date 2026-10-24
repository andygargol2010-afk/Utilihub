import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-porcentaje-aumento",
  "Percentage Increase Calculator",
  "finanzas",
  "calculator",
  "Calculate the percentage increase or decrease between two values. Instant result for prices, salaries, or any change. Runs in the browser.",
  [
    "percentage increase calculator",
    "percent change",
    "calculadora porcentaje aumento",
    "porcentaje de incremento",
    "percentage difference",
  ],
  {
    title: "Percentage Increase Calculator — % Change | UtiliHub",
    description:
      "Free percentage increase calculator. Enter original and new value to get the percent change. Works for increases and decreases. No signup.",
    summaryEs: "Calcula el porcentaje de aumento o disminución entre dos valores. Resultado instantáneo.",
  },
);
tool.faq.push(
  faq(
    "How is percentage increase calculated?",
    "Percentage increase = ((new value - original value) / original value) × 100.",
  ),
);

export const PERCENTAGE_INCREASE_CALCULATOR_TOOLS = [tool];
