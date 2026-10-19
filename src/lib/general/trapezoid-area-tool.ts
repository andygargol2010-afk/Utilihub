import type { GeneralTool } from "./types";

export const TRAPEZOID_AREA_CALCULATOR_TOOLS: GeneralTool[] = [
  {
    slug: "calculadora-area-trapecio",
    name: "Trapezoid Area Calculator",
    nameEs: "Calculadora de área de trapecio",
    description: "Calculate the area of a trapezoid from two bases and height.",
    descriptionEs: "Calcula el área de un trapecio a partir de las dos bases y la altura.",
    category: "matematicas",
    kind: "calculator",
    about: ["Trapezoid area: A = ((base_a + base_b) / 2) × height."],
    steps: ["Enter the two bases and height (all > 0)."],
    faq: [],
  },
];
