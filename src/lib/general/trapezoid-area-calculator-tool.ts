import type { GeneralTool } from "./types";

export const TRAPEZOID_AREA_CALCULATOR_TOOLS: GeneralTool[] = [
  {
    slug: "calculadora-area-trapecio",
    name: "Trapezoid Area Calculator",
    nameEs: "Calculadora de área de trapecio",
    description: "Calculate the area of a trapezoid from the two parallel sides and height.",
    descriptionEs: "Calcula el área de un trapecio a partir de los dos lados paralelos y la altura.",
    category: "matematicas",
    kind: "calculator",
    about: ["Trapezoid area: A = ((a + b) / 2) × h."],
    steps: ["Enter the two bases and the height."],
    faq: [],
  },
];
