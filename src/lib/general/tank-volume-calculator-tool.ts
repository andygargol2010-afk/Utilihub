import { makeTool, faq } from "./types";

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
    title: "Cylindrical Tank Volume Calculator — Liters from Diameter & Height | UtiliHub",
    description: "Free cylindrical tank volume calculator in liters. Enter diameter and height in cm to get water capacity instantly. Browser-only.",
    summaryEs: "Calcula el volumen de un tanque cilíndrico de agua a partir del diámetro y la altura.",
  },
);
tool.faq.push(faq("What is the formula?", "Volume = π × r² × h, where r is the radius (diameter / 2) and h is the height. Result in liters (1 L = 1000 cm³)."));
tool.faq.push(faq("What units does it use?", "Enter diameter and height in centimeters; the result is shown in liters and cubic meters."));

export const TANK_VOLUME_CALCULATOR_TOOLS = [tool];
