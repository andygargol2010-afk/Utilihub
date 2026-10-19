import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-cuadrado",
  "Square Area Calculator",
  "matematicas",
  "calculator",
  "Calculate the area of a square from the side length using A = side × side.",
  [
    "square area calculator",
    "area of a square",
    "calculadora area cuadrado",
    "área del cuadrado",
  ],
  {
    title: "Square Area Calculator — Side × Side | UtiliHub",
    description: "Free square area calculator. Enter the side length to get the area. Browser-only calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Area = side × side (side²)."));
tool.faq.push(faq("Units?", "Area is in square units of the input units."));

export const SQUARE_AREA_CALCULATOR_TOOLS = [tool];
