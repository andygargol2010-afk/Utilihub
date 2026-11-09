import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-perimetro-rectangulo",
  "Rectangle Perimeter Calculator",
  "ciencia",
  "calculator",
  "Calculate the perimeter of a rectangle from length and width.",
  [
    "rectangle perimeter calculator",
    "perimeter of a rectangle",
    "calculadora perímetro rectángulo",
    "perímetro del rectángulo",
  ],
  {
    title: "Rectangle Perimeter Calculator — 2 × (length + width) | UtiliHub",
    description: "Free rectangle perimeter calculator. Enter length and width to get the perimeter. Local browser calculation, no signup.",
    summaryEs: "Calcula el perímetro de un rectángulo a partir de la longitud y el ancho.",
  },
);
tool.faq.push(
  faq(
    "What is the formula?",
    "Perimeter P = 2 × (length + width).",
  ),
);
tool.faq.push(
  faq(
    "Units?",
    "The result is in the same linear units as the inputs (cm, m, in, etc.).",
  ),
);

export const RECTANGLE_PERIMETER_CALCULATOR_TOOLS = [tool];
