import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-perimetro-rectangulo",
  "Rectangle Perimeter Calculator",
  "matematicas",
  "calculator",
  "Calculate the perimeter of a rectangle from its length and width using P = 2(l + w).",
  [
    "rectangle perimeter calculator",
    "perimeter of a rectangle",
    "calculadora perímetro rectángulo",
    "perímetro del rectángulo",
  ],
  {
    title: "Rectangle Perimeter Calculator — 2(l + w) | UtiliHub",
    description: "Free rectangle perimeter calculator. Enter length and width to get the perimeter. Runs in the browser.",
  },
);
tool.faq.push(faq("What is the formula?", "Perimeter = 2 × (length + width)."));
tool.faq.push(faq("Units?", "Perimeter is in the same linear units as the sides."));

export const RECTANGLE_PERIMETER_CALCULATOR_TOOLS = [tool];
