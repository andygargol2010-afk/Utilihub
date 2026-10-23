import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-desviacion-estandar",
  "Standard Deviation Calculator",
  "educacion",
  "calculator",
  "Calculate sample or population standard deviation from a list of numbers.",
  [
    "standard deviation calculator",
    "calculadora desviacion estandar",
    "standard deviation",
    "desviacion estandar",
    "sample standard deviation",
  ],
  {
    title: "Standard Deviation Calculator — Sample & Population | UtiliHub",
    description:
      "Free standard deviation calculator. Enter numbers, choose sample (n−1) or population (n). Mean and variance included. Runs in your browser.",
    summaryEs: "Calcula la desviación estándar muestral o poblacional a partir de una lista de números.",
  },
);
tool.faq.push(
  faq(
    "Sample vs population?",
    "Sample uses divisor n−1 (Bessel's correction). Population uses n. Use sample when your data is a subset.",
  ),
);
tool.faq.push(faq("How many numbers?", "At least 2 valid numbers. Separate with commas or spaces."));

export const STANDARD_DEVIATION_CALCULATOR_TOOLS = [tool];
