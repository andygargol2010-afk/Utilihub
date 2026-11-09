import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-rango-estadistico",
  "Statistical Range Calculator",
  "matematicas",
  "calculator",
  "Calculate the statistical range (max - min) of a list of numbers.",
  [
    "statistical range calculator",
    "rango estadistico",
    "calculadora rango",
    "max min difference",
    "range of data",
  ],
  {
    title: "Statistical Range Calculator — Max minus Min | UtiliHub",
    description: "Free statistical range calculator. Enter numbers to get the difference between the largest and smallest values. Local browser calculation, no signup.",
    summaryEs: "Calcula el rango estadístico (máximo menos mínimo) de una lista de números.",
  },
);
tool.faq.push(
  faq(
    "What is the statistical range?",
    "The range is the simplest measure of dispersion: the difference between the maximum and minimum values in the data set. It is sensitive to outliers.",
  ),
);
tool.faq.push(
  faq(
    "How is it different from standard deviation?",
    "Range only looks at the extremes. Standard deviation considers how far every value is from the mean, giving a more complete picture of spread.",
  ),
);

export const STATISTICAL_RANGE_CALCULATOR_TOOLS = [tool];
