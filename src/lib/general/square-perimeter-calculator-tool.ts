import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-perimetro-cuadrado",
  "Square Perimeter Calculator",
  "matematicas",
  "calculator",
  "Calculate the perimeter of a square from its side length. Formula: P = 4a.",
  [
    "square perimeter calculator",
    "perimeter of a square",
    "calculadora per\u00edmetro cuadrado",
    "per\u00edmetro de un cuadrado",
    "4 times side",
  ],
  {
    title: "Square Perimeter Calculator \u2014 4a | UtiliHub",
    description: "Free square perimeter calculator. Enter side length to get perimeter. Instant browser calculation.",
    summaryEs: "Calcula el per\u00edmetro de un cuadrado a partir de la longitud del lado. F\u00f3rmula: P = 4a.",
  },
);
tool.faq.push(faq("What is the formula?", "Perimeter = 4 \u00d7 side. Side must be non-negative."));
tool.faq.push(faq("Units?", "Any consistent length unit. Result in the same unit."));

export const SQUARE_PERIMETER_CALCULATOR_TOOLS = [tool];
