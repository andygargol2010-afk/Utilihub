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
    description: "Free arithmetic mean calculator. Enter numbers separated by commas or spaces to get the average. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the arithmetic mean?", "The sum of the values divided by the count of values."));

export const ARITHMETIC_MEAN_CALCULATOR_TOOLS = [tool];
