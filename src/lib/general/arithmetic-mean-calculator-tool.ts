import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-media-aritmetica",
  "Arithmetic Mean Calculator",
  "educacion",
  "calculator",
  "Calculate the arithmetic mean (average) of a list of numbers.",
  [
    "arithmetic mean calculator",
    "average calculator",
    "media aritmetica",
    "calculadora promedio",
  ],
  {
    title: "Arithmetic Mean Calculator — Average of Numbers | UtiliHub",
    description:
      "Free arithmetic mean calculator. Add the formula (sum of values ÷ count), an example, and unit-free decimals. Enter numbers separated by commas or spaces and get the mean instantly in your browser.".replace(/^Free arithmetic mean calculator\.[^]*?\n?/, ""),
    summaryEs: "Calcula la media aritmética (promedio) de una lista de números, con la fórmula y un ejemplo.",
  },
);
tool.faq.push(
  faq(
    "What is the formula for the arithmetic mean?",
    "Mean = (sum of all values) ÷ (number of values). Example: (10 + 20 + 30) ÷ 3 = 20.",
  ),
);
tool.faq.push(faq("What is the arithmetic mean?", "The sum of the values divided by the count of values."));

export const ARITHMETIC_MEAN_CALCULATOR_TOOLS = [tool];
