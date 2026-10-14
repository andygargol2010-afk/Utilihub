import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-energia-cinetica",
  "Kinetic Energy Calculator",
  "ciencia",
  "calculator",
  "Calculate kinetic energy from mass and velocity. Instant results in the browser, no signup.",
  [
    "kinetic energy calculator",
    "energy calculator",
    "KE = 1/2 mv2",
    "calculadora energia cinetica",
    "energia cinetica",
  ],
  {
    title: "Kinetic Energy Calculator — KE = ½ mv² | UtiliHub",
    description:
      "Free kinetic energy calculator. Enter mass and velocity to get KE in joules. Supports kg/m/s and other units. Local, instant.",
  },
);
tool.faq.push(
  faq(
    "What is kinetic energy?",
    "Kinetic energy is the energy an object has due to its motion. The formula is KE = ½ × m × v², where m is mass and v is velocity.",
  ),
);
tool.faq.push(
  faq(
    "Which units does this use?",
    "Mass in kilograms and velocity in meters per second give energy in joules. The tool converts common inputs automatically.",
  ),
);

export const KINETIC_ENERGY_TOOLS = [tool];
