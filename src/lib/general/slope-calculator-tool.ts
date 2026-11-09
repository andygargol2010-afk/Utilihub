import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-pendiente",
  "Slope Calculator",
  "matematicas",
  "calculator",
  "Calculate the slope (m) between two points. Formula: m = (y2 − y1) / (x2 − x1).",
  [
    "slope calculator",
    "calculate slope",
    "calculadora pendiente",
    "calcular pendiente",
    "slope between two points",
  ],
  {
    title: "Slope Calculator — Rise over Run | UtiliHub",
    description: "Free slope calculator. Enter two points to get the slope m. Handles vertical lines. Runs in your browser.",
  },
);
tool.faq.push(faq("What is slope?", "Slope is the steepness of a line, calculated as rise over run."));
tool.faq.push(faq("Formula?", "m = (y2 - y1) / (x2 - x1). Undefined if x2 = x1."));

export const SLOPE_CALCULATOR_TOOLS = [tool];
