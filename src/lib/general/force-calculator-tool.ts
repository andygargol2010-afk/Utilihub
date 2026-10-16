import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-fuerza",
  "Force Calculator",
  "ciencia",
  "calculator",
  "Calculate force from mass and acceleration using F = m × a.",
  [
    "force calculator",
    "F = ma calculator",
    "calculadora de fuerza",
    "calculadora F = m a",
    "fuerza masa aceleración",
  ],
  {
    title: "Force Calculator — F = m × a | UtiliHub",
    description: "Free force calculator. Enter mass and acceleration to get force in newtons. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Force (N) = mass (kg) × acceleration (m/s²)."));
tool.faq.push(faq("Units?", "Use SI units: kg and m/s² for newtons."));

export const FORCE_CALCULATOR_TOOLS = [tool];
