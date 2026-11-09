import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-cambio-porcentual",
  "Percentage Change Calculator",
  "matematicas",
  "calculator",
  "Calculate the percentage change between an initial and a final value.",
  [
    "percentage change calculator",
    "percent change",
    "calculadora cambio porcentual",
    "aumento porcentual",
    "disminucion porcentual",
  ],
  {
    title: "Percentage Change Calculator | Increase or Decrease | UtiliHub",
    description: "Free percentage change calculator. Enter initial and final values to get the percent increase or decrease. Browser-only, no signup.",
    summaryEs: "Calcula el cambio porcentual entre un valor inicial y uno final.",
  },
);
tool.faq.push(
  faq(
    "What is the percentage change formula?",
    "Percentage change = ((final - initial) / |initial|) \u00d7 100. A positive result is an increase; negative is a decrease.",
  ),
  faq(
    "What if the initial value is zero?",
    "Division by zero is undefined. Enter a non-zero initial value.",
  ),
);

export const PERCENTAGE_CHANGE_CALCULATOR_TOOLS = [tool];
