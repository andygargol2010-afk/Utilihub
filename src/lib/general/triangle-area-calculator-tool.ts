import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-triangulo",
  "Triangle Area Calculator",
  "matematicas",
  "calculator",
  "Calculate the area of a triangle from base and height using A = (base × height) / 2.",
  [
    "triangle area calculator",
    "area of a triangle",
    "calculadora area triangulo",
    "área del triángulo",
  ],
  {
    title: "Triangle Area Calculator — (base × height) / 2 | UtiliHub",
    description: "Free triangle area calculator. Enter base and height to get the area. Browser-only calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Area = (base × height) / 2."));
tool.faq.push(faq("Units?", "Area is in square units of the input units."));

export const TRIANGLE_AREA_CALCULATOR_TOOLS = [tool];
