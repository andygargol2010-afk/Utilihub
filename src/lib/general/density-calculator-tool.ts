import { makeTool } from "./types";

const tool = makeTool(
  "calculadora-densidad",
  "Density Calculator",
  "ciencia",
  "calculator",
  "Calculate density from mass and volume.",
  [
    "density calculator",
    "mass volume density",
    "calculadora de densidad",
    "densidad masa volumen",
  ],
  {
    title: "Density Calculator | UtiliHub",
    description: "Free density calculator. Mass and volume in g and cm³. Browser-only.",
    summaryEs: "Calcula la densidad a partir de masa y volumen.",
  },
);

export const DENSITY_CALCULATOR_TOOLS = [tool];
