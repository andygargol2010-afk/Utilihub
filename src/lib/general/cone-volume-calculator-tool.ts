import type { GeneralTool } from "./types";

export const CONE_VOLUME_CALCULATOR_TOOLS: GeneralTool[] = [
  {
    slug: "calculadora-volumen-cono",
    name: "Cone Volume Calculator",
    nameEs: "Calculadora de volumen de cono",
    description: "Calculate the volume of a cone from radius and height.",
    descriptionEs: "Calcula el volumen de un cono a partir del radio y la altura.",
    category: "ciencia",
    kind: "calculator",
    about: ["Simple cone volume formula: V = (1/3) π r² h."],
    steps: ["Enter radius and height."],
    faq: [],
  },
];
