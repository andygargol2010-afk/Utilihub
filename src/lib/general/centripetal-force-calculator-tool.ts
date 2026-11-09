import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-fuerza-centripeta",
  "Centripetal Force Calculator",
  "ciencia",
  "calculator",
  "Calculate the centripetal force needed for circular motion from mass, velocity and radius.",
  [
    "centripetal force calculator",
    "circular motion force",
    "F = mv2/r",
    "calculadora fuerza centrípeta",
    "fuerza movimiento circular",
    "calculadora F mv2/r",
  ],
  {
    title: "Centripetal Force Calculator | UtiliHub",
    description: "Free calculator for centripetal force in circular motion. Enter mass, speed and radius to get the force in newtons. Browser-only.",
    summaryEs: "Calculá la fuerza centrípeta necesaria para un movimiento circular a partir de la masa, la velocidad y el radio.",
  },
);
tool.faq.push(faq("How is centripetal force calculated?", "F = m × v² / r, where m is mass in kg, v is speed in m/s and r is radius in m."));
tool.faq.push(faq("What if the radius is zero?", "Radius must be positive. A zero radius is undefined for circular motion."));

export const CENTRIPETAL_FORCE_CALCULATOR_TOOLS = [tool];
