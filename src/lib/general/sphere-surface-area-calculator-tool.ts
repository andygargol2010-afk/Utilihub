import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-superficie-esfera",
  "Sphere Surface Area Calculator",
  "ciencia",
  "calculator",
  "Calculate the surface area of a sphere from its radius. Formula: A = 4 π r².",
  [
    "sphere surface area calculator",
    "area of a sphere",
    "calculadora área superficie esfera",
    "área de una esfera",
    "4 pi r squared",
  ],
  {
    title: "Sphere Surface Area Calculator — 4πr² | UtiliHub",
    description: "Free sphere surface area calculator. Enter radius to get surface area. Instant browser calculation.",
    summaryEs: "Calcula el área de la superficie de una esfera a partir del radio. Fórmula: A = 4 π r².",
  },
);
tool.faq.push(faq("What is the formula?", "Surface area = 4 × π × r². Radius must be non-negative."));
tool.faq.push(faq("Units?", "Any consistent length unit. Result in square units."));

export const SPHERE_SURFACE_AREA_CALCULATOR_TOOLS = [tool];
