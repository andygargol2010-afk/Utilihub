import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-superficie-cilindro",
  "Cylinder Surface Area Calculator",
  "ciencia",
  "calculator",
  "Calculate the total surface area of a closed cylinder from radius and height.",
  [
    "cylinder surface area calculator",
    "calculadora area superficie cilindro",
    "area lateral cilindro",
    "superficie cilindro",
  ],
  {
    title: "Cylinder Surface Area Calculator | Closed Cylinder | UtiliHub",
    description: "Free cylinder surface area calculator. A = 2πr(h + r). EN+ES.",
    summaryEs: "Calcula el área total de la superficie de un cilindro cerrado a partir del radio y la altura.",
  },
);
tool.faq.push(faq("What is the surface area of a cylinder?", "For a closed cylinder: 2πr(h + r) = lateral area + two bases."));
tool.faq.push(faq("Does this include the bases?", "Yes. Lateral area is 2πrh; each base is πr². Total is both."));

export const CYLINDER_SURFACE_AREA_CALCULATOR_TOOLS = [tool];
