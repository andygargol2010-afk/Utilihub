import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-rombo",
  "Rhombus Area Calculator",
  "matematicas",
  "calculator",
  "Calculate the area of a rhombus from its two diagonals using A = (d1 × d2) / 2.",
  [
    "rhombus area calculator",
    "area of a rhombus",
    "calculadora area rombo",
    "area del rombo",
  ],
  {
    title: "Rhombus Area Calculator — diagonals | UtiliHub",
    description: "Free rhombus area calculator. Enter the two diagonals to get the area. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Area = (diagonal 1 × diagonal 2) / 2."));
tool.faq.push(faq("Units?", "Area is in square units of the input units."));

export const RHOMBUS_AREA_CALCULATOR_TOOLS = [tool];
