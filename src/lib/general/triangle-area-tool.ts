import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-triangulo-alt",
  "Triangle Area Calculator",
  "matematicas",
  "calculator",
  "Calculate the area of a triangle from base and height. Instant local calculation.",
  [
    "triangle area calculator",
    "area of triangle",
    "calculadora de área de triángulo",
    "área del triángulo",
    "base height triangle",
  ],
  {
    title: "Triangle Area Calculator — Base × height ÷ 2 | UtiliHub",
    description: "Free online triangle area calculator. Enter base and height to get the area instantly in your browser. No signup.",
    operation: "triangle-area",
    fields: ["Base", "Height"],
  },
);
tool.faq.push(faq("What formula is used?", "Area = (base × height) / 2."));
tool.faq.push(faq("Units?", "The result is in the same square units as the inputs (e.g. cm² if base and height are in cm)."));
tool.faq.push(faq("Does it work for any triangle?", "Yes, as long as you know the base and the corresponding height."));

export const TRIANGLE_AREA_TOOLS = [tool];

void { "triangle-area": () => 0 };
