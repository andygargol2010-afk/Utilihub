import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-rectangulo",
  "Rectangle Area Calculator",
  "ciencia",
  "calculator",
  "Calculate the area of a rectangle from length and width.",
  [
    "rectangle area calculator",
    "area of a rectangle",
    "calculadora área rectángulo",
    "área del rectángulo",
  ],
  {
    title: "Rectangle Area Calculator — length × width | UtiliHub",
    description: "Free rectangle area calculator. Enter length and width to get the area. Browser-only calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Area = length × width."));
tool.faq.push(faq("Units?", "Area is in square units of the input units."));

export const RECTANGLE_AREA_CALCULATOR_TOOLS = [tool];
