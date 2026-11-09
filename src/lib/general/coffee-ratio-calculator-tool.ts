import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ratio-cafe",
  "Coffee Ratio Calculator",
  "hogar",
  "calculator",
  "Calculate water needed for coffee from coffee weight and brew ratio.",
  [
    "coffee ratio calculator",
    "coffee to water ratio",
    "calculadora ratio cafe",
    "proporcion cafe agua",
  ],
  {
    title: "Coffee Ratio Calculator — water from coffee | UtiliHub",
    description: "Free coffee ratio calculator. Enter coffee grams and ratio to get water amount. Local browser calculation.",
  },
);
tool.faq.push(faq("What is a common ratio?", "1:15 to 1:17 is typical for pour-over."));
tool.faq.push(faq("Units?", "Both coffee and water are in grams."));

export const COFFEE_RATIO_CALCULATOR_TOOLS = [tool];
