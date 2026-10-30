import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-mediana",
  "Median Calculator",
  "matematicas",
  "calculator",
  "Calculate the median of a list of numbers.",
  [
    "median calculator",
    "mediana calculadora",
    "calculadora mediana",
    "middle value",
    "statistical median",
  ],
  {
    title: "Median Calculator — Middle Value of a List | UtiliHub",
    description: "Free median calculator. Enter numbers to get the middle value after sorting. Local browser calculation, no signup.",
    summaryEs: "Calcula la mediana de una lista de números.",
  },
);
tool.faq.push(
  faq(
    "What is the median?",
    "The median is the middle value in a sorted list. For an odd count it is the central number; for an even count it is the average of the two central numbers. It is robust to outliers compared to the mean.",
  ),
);
tool.faq.push(
  faq(
    "How is it different from the mean?",
    "The arithmetic mean is the average (sum / n). The median is the 50th percentile and is not affected by extreme values the same way.",
  ),
);

export const MEDIAN_CALCULATOR_TOOLS = [tool];
