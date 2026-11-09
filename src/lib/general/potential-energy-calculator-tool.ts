import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-energia-potencial",
  "Potential Energy Calculator",
  "ciencia",
  "calculator",
  "Calculate gravitational potential energy (m × g × h).",
  [
    "potential energy calculator",
    "gravitational potential energy",
    "calculadora energia potencial",
    "mgh calculator",
  ],
  {
    title: "Gravitational Potential Energy Calculator — m × 9.81 × h | UtiliHub",
    description: "Free potential energy calculator. Enter mass and height to get PE in joules. Local browser calculation.",
  },
);
tool.faq.push(faq("What is gravitational potential energy?", "The energy an object has due to its position in a gravitational field: PE = m × g × h."));

export const POTENTIAL_ENERGY_CALCULATOR_TOOLS = [tool];
