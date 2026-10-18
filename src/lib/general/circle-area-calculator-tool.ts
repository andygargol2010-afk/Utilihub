import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-circulo",
  "Circle Area Calculator",
  "ciencia",
  "calculator",
  "Calculate the area of a circle from its radius using A = πr².",
  [
    "circle area calculator",
    "area of a circle",
    "calculadora área círculo",
    "área del círculo",
  ],
  {
    title: "Circle Area Calculator — πr² | UtiliHub",
    description: "Free circle area calculator. Enter the radius to get the area. Browser-only calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Area = π × radius²."));
tool.faq.push(faq("Units?", "Area is in square units of the radius unit (e.g., cm² if radius in cm)."));

export const CIRCLE_AREA_CALCULATOR_TOOLS = [tool];
