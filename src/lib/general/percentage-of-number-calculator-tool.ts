import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-porcentaje-de-numero",
  "Percentage of Number Calculator",
  "matematicas",
  "calculator",
  "Calculate what is X percent of a number. Instant result for discounts, tips, taxes or any percentage. Runs fully in the browser.",
  [
    "percentage of number",
    "what is percent of",
    "calculadora porcentaje de numero",
    "X percent of Y",
    "percentage calculator",
    "porcentaje de un numero",
  ],
  {
    title: "Percentage of Number Calculator — What is X% of Y | UtiliHub",
    description: "Free percentage of a number calculator. Enter the percentage and the base number to get the result instantly. Local, private, no signup.",
    summaryEs: "Calcula qué es el X% de un número. Resultado instantáneo para descuentos, propinas o impuestos.",
  },
);
tool.faq.push(
  faq(
    "How do I calculate X% of a number?",
    "Result = (percentage / 100) × number.",
  ),
);
tool.faq.push(
  faq(
    "Is this useful for discounts?",
    "Yes. Enter the discount percentage and the original price to see how much you save or the final amount.",
  ),
);

export const PERCENTAGE_OF_NUMBER_CALCULATOR_TOOLS = [tool];
