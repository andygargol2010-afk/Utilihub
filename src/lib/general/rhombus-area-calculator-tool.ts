import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-rombo",
  "Rhombus Area Calculator",
  "matematicas",
  "calculator",
  "Calculate the area of a rhombus from its two diagonals using A = (d1 \u00d7 d2) / 2.",
  [
    "rhombus area calculator",
    "area of a rhombus",
    "calculadora area rombo",
    "\u00e1rea del rombo",
  ],
  {
    title: "Rhombus Area Calculator \u2014 (d1 \u00d7 d2)/2 | UtiliHub",
    description: "Free rhombus area calculator. Enter the two diagonals to get the area. Browser-only calculation.",
    summaryEs: "Calcula el \u00e1rea de un rombo a partir de sus dos diagonales con A = (d1 \u00d7 d2) / 2.",
  },
);
tool.faq.push(faq("What is the formula?", "Area = (diagonal 1 \u00d7 diagonal 2) / 2."));
tool.faq.push(faq("Units?", "Area is in square units of the input units."));

export const RHOMBUS_AREA_CALCULATOR_TOOLS = [tool];
