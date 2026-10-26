import { makeTool } from "./types";

const tool = makeTool(
  "calculadora-volumen-tanque",
  "Tank Volume Calculator",
  "hogar",
  "calculator",
  "Calculate the volume of a cylindrical water tank from diameter and height.",
  [
    "tank volume calculator",
    "water tank capacity",
    "calculadora volumen tanque",
    "capacidad tanque de agua",
  ],
  {
    title: "Tank Volume Calculator | UtiliHub",
    description: "Free cylindrical tank volume calculator in liters. Diameter and height in cm. Browser-only.",
    summaryEs: "Calcula el volumen de un tanque cilíndrico de agua a partir del diámetro y la altura.",
  },
);

export const TANK_VOLUME_CALCULATOR_TOOLS = [tool];
