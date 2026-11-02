import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-varianza",
  "Variance Calculator",
  "matematicas",
  "calculator",
  "Calculate sample or population variance of a list of numbers. Shows mean, variance, and standard deviation.",
  [
    "variance calculator",
    "calculadora varianza",
    "sample variance",
    "population variance",
    "varianza muestral",
    "varianza poblacional",
  ],
  {
    title: "Variance Calculator | Sample & Population | UtiliHub",
    description: "Free variance calculator. Enter numbers to get sample or population variance, mean, and standard deviation instantly. EN+ES.",
    summaryEs: "Calcula la varianza muestral o poblacional de una lista de números.",
  },
);
tool.faq.push(faq("What is the difference between sample and population variance?", "Sample variance divides by n-1 (Bessel's correction). Population variance divides by n. Use sample for data from a larger group."));
tool.faq.push(faq("How do I enter the numbers?", "Comma, space, or newline separated. Non-numeric values are ignored."));

export const VARIANCE_CALCULATOR_TOOLS = [tool];
