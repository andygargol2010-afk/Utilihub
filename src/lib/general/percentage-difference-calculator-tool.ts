import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-diferencia-porcentual",
  "Percentage Difference Calculator",
  "matematicas",
  "calculator",
  "Calculate the percentage difference between two numbers.",
  [
    "percentage difference calculator",
    "diferencia porcentual",
    "percent difference",
    "calculadora diferencia porcentual",
  ],
  {
    title: "Percentage Difference Calculator | UtiliHub",
    description: "Free percentage difference calculator. Enter two values to get absolute and relative percentage difference. Browser-only.",
    summaryEs: "Calcula la diferencia porcentual entre dos números.",
  },
);
tool.faq.push(
  faq(
    "How is percentage difference calculated?",
    "It is the absolute difference divided by the average of the two absolute values, multiplied by 100.",
  ),
);

export const PERCENTAGE_DIFFERENCE_CALCULATOR_TOOLS = [tool];
