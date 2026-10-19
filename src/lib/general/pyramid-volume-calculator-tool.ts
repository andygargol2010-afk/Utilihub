import type { GeneralTool } from "./types";

export const PYRAMID_VOLUME_CALCULATOR_TOOLS: GeneralTool[] = [
  {
    slug: "calculadora-volumen-piramide",
    name: "Pyramid Volume Calculator",
    nameEs: "Calculadora de volumen de pirámide",
    description: "Calculate the volume of a pyramid from base area and height.",
    descriptionEs: "Calcula el volumen de una pirámide a partir del área de la base y la altura.",
    category: "ciencia",
    kind: "calculator",
    about: ["Simple pyramid volume calculator: V = (1/3) × base area × height."],
    steps: ["Enter base area and height."],
    faq: [],
  },
];
