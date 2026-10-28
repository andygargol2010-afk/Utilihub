import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-promedio-simple",
  "Simple Average Calculator",
  "educacion",
  "calculator",
  "Calculate the arithmetic mean (simple average) of a list of numbers.",
  [
    "simple average calculator",
    "arithmetic mean calculator",
    "calculadora promedio simple",
    "media aritmetica",
    "average calculator",
  ],
  {
    title: "Simple Average Calculator | Arithmetic Mean | UtiliHub",
    description: "Free simple average calculator. Enter numbers separated by commas or spaces to get the arithmetic mean. Browser-only, no signup.",
    summaryEs: "Calcula la media aritmética (promedio simple) de una lista de números.",
  },
);
tool.faq.push(
  faq(
    "What is the simple average formula?",
    "Average = (sum of all numbers) / (count of numbers). Also called arithmetic mean.",
  ),
  faq(
    "How do I enter the numbers?",
    "Separate them by commas, spaces, or new lines. Empty values are ignored.",
  ),
);

export const SIMPLE_AVERAGE_CALCULATOR_TOOLS = [tool];
