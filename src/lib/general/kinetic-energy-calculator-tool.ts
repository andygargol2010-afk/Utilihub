import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-energia-cinetica",
  "Kinetic Energy Calculator",
  "ciencia",
  "calculator",
  "Calculate kinetic energy from mass and velocity using E = ½ mv². Supports SI units with validation and worked examples.",
  [
    "kinetic energy calculator",
    "calculadora energia cinetica",
    "½ mv2 calculator",
    "energia cinética",
    "kinetic energy formula",
    "calculadora de energia cinetica",
  ],
  {
    title: "Kinetic Energy Calculator | E = ½ mv² | UtiliHub",
    description: "Free kinetic energy calculator. Compute ½ m v² from mass (kg) and velocity (m/s). Instant EN+ES results with examples.",
    summaryEs: "Calcula la energía cinética (½ m v²) a partir de masa y velocidad.",
  },
);
tool.faq.push(faq("What is the formula for kinetic energy?", "Kinetic energy KE = ½ × mass × velocity². With mass in kilograms and velocity in m/s the result is in joules (J)."));
tool.faq.push(faq("What units should I use?", "Use kilograms (kg) for mass and meters per second (m/s) for velocity to obtain joules. Negative values are rejected."));

export const KINETIC_ENERGY_CALCULATOR_TOOLS = [tool];
