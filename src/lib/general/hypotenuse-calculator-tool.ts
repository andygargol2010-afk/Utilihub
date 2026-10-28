import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-hipotenusa",
  "Hypotenuse Calculator",
  "ciencia",
  "calculator",
  "Calculate the hypotenuse of a right triangle from the two legs using Pythagoras.",
  [
    "hypotenuse calculator",
    "pythagorean theorem calculator",
    "calculadora hipotenusa",
    "teorema de pitagoras",
    "right triangle hypotenuse",
  ],
  {
    title: "Hypotenuse Calculator | Pythagoras Theorem | UtiliHub",
    description: "Free hypotenuse calculator. Enter the two legs of a right triangle to get the hypotenuse instantly. Browser-only, no signup.",
    summaryEs: "Calcula la hipotenusa de un triángulo rectángulo a partir de los dos catetos.",
  },
);
tool.faq.push(
  faq(
    "What is the formula for the hypotenuse?",
    "Hypotenuse = √(leg1² + leg2²). This is the Pythagorean theorem for right triangles.",
  ),
  faq(
    "Does it work for any triangle?",
    "No, only for right-angled triangles (one angle of 90°).",
  ),
);

export const HYPOTENUSE_CALCULATOR_TOOLS = [tool];
