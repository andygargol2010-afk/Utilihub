import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-densidad",
  "Density Calculator",
  "ciencia",
  "calculator",
  "Calculate density from mass and volume using ρ = m / V.",
  [
    "density calculator",
    "mass volume density",
    "calculadora de densidad",
    "densidad masa volumen",
  ],
  {
    title: "Density Calculator — ρ = m / V | UtiliHub",
    description: "Free density calculator. Enter mass and volume to get density. Browser-only calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Density = mass / volume."));
tool.faq.push(faq("Units?", "Density has units of mass per volume (e.g., g/cm³ if mass in g and volume in cm³)."));

export const DENSITY_CALCULATOR_TOOLS = [tool];
