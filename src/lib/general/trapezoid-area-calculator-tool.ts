import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-trapecio",
  "Trapezoid Area Calculator",
  "matematicas",
  "calculator",
  "Calculate the area of a trapezoid from the two bases and height using A = ((a + b) / 2) × h.",
  [
    "trapezoid area calculator",
    "area of a trapezoid",
    "calculadora area trapecio",
    "área del trapecio",
  ],
  {
    title: "Trapezoid Area Calculator — ((a + b)/2) × h | UtiliHub",
    description: "Free trapezoid area calculator. Enter the two bases and height to get the area. Browser-only calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Area = ((base a + base b) / 2) × height."));
tool.faq.push(faq("Units?", "Area is in square units of the input units."));

export const TRAPEZOID_AREA_CALCULATOR_TOOLS = [tool];
