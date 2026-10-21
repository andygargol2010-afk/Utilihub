import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-hexagono",
  "Hexagon Area Calculator",
  "matematicas",
  "calculator",
  "Calculate the area of a regular hexagon from its side length.",
  [
    "hexagon area calculator",
    "area hexagono regular",
    "calculadora area hexagono",
    "3 sqrt 3 side squared",
  ],
  {
    title: "Regular Hexagon Area Calculator — (3√3/2) × side² | UtiliHub",
    description: "Free regular hexagon area calculator. Enter side length to get area instantly. Local browser calculation.",
  },
);
tool.faq.push(faq("What is a regular hexagon?", "A hexagon with all sides equal and all interior angles 120°."));

export const HEXAGON_AREA_CALCULATOR_TOOLS = [tool];
