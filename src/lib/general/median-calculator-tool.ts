import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-mediana",
  "Median Calculator",
  "educacion",
  "calculator",
  "Calculate the median of a list of numbers.",
  [
    "median calculator",
    "calculate median",
    "calculadora mediana",
    "mediana de numeros",
  ],
  {
    title: "Median Calculator — Middle Value of Numbers | UtiliHub",
    description: "Free median calculator. Enter numbers to find the middle value after sorting. Handles even and odd counts. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the median?", "The middle value in a sorted list. For even count, average of the two middle values."));
tool.faq.push(faq("How is it different from mean?", "Median is resistant to outliers; mean is the arithmetic average."));

export const MEDIAN_CALCULATOR_TOOLS = [tool];
