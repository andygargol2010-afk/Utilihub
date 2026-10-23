import { makeTool } from "./types";

const tool = makeTool(
  "calculadora-perimetro-triangulo",
  "Triangle Perimeter Calculator",
  "matematicas",
  "calculator",
  "Calculate the perimeter of a triangle given three sides. Validates triangle inequality.",
  [
    "triangle perimeter calculator",
    "perimetro triangulo",
    "calculadora perimetro triangulo",
    "triangle sides sum",
  ],
  {
    title: "Triangle Perimeter Calculator — a + b + c | UtiliHub",
    description: "Free triangle perimeter calculator. Enter three sides and get the perimeter instantly. Validates triangle inequality. Runs in browser.",
  },
);

export const TRIANGLE_PERIMETER_CALCULATOR_TOOLS = [tool];
