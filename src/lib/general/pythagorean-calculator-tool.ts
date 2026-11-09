import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-teorema-pitagoras",
  "Pythagorean Theorem Calculator",
  "matematicas",
  "calculator",
  "Calculate the hypotenuse or a missing leg of a right triangle with the Pythagorean theorem a² + b² = c².",
  [
    "pythagorean theorem calculator",
    "hypotenuse calculator",
    "right triangle calculator",
    "calculadora teorema de pitagoras",
    "calculadora hipotenusa",
    "teorema de pitagoras",
  ],
  {
    title: "Pythagorean Theorem Calculator — a² + b² = c² | UtiliHub",
    description: "Free Pythagorean theorem calculator. Find the hypotenuse or missing leg of a right triangle. Accurate browser calculation, no signup.",
  },
);
tool.faq.push(faq("What is the Pythagorean theorem?", "In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides: a² + b² = c²."));

export const PYTHAGOREAN_CALCULATOR_TOOLS = [tool];
