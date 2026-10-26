import { makeTool } from "./types";

const tool = makeTool(
  "calculadora-relacion-aspecto",
  "Aspect Ratio Calculator",
  "diseno",
  "calculator",
  "Calculate simplified aspect ratio from width and height.",
  [
    "aspect ratio calculator",
    "calculadora relacion de aspecto",
    "calculadora ratio aspecto",
    "16:9 calculator",
    "relacion de aspecto",
  ],
  {
    title: "Aspect Ratio Calculator | UtiliHub",
    description: "Free aspect ratio calculator. Enter width and height to get simplified ratio and decimal. Browser-only.",
    summaryEs: "Calcula la relación de aspecto simplificada a partir de ancho y alto.",
  },
);

export const ASPECT_RATIO_CALCULATOR_TOOLS = [tool];
