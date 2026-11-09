import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-triangulo",
  "Triangle Area Calculator",
  "ciencia",
  "calculator",
  "Calculate the area of a triangle from base and height.",
  [
    "triangle area calculator",
    "area of a triangle",
    "calculadora area triangulo",
    "area del triangulo",
    "base height triangle",
  ],
  {
    title: "Triangle Area Calculator | Base × Height ÷ 2 | UtiliHub",
    description: "Free triangle area calculator. Enter base and height to get the area instantly. Browser-only, no signup.",
    summaryEs: "Calcula el área de un triángulo a partir de base y altura.",
  },
);
tool.faq.push(
  faq(
    "What is the formula for the area of a triangle?",
    "Area = (base × height) / 2. The height must be perpendicular to the base.",
  ),
  faq(
    "Does it work for any triangle?",
    "Yes, as long as you know one side (base) and the perpendicular height to that side.",
  ),
);

export const TRIANGLE_AREA_CALCULATOR_TOOLS = [tool];
