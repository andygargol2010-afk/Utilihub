import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-frecuencia-cardiaca-maxima",
  "Max Heart Rate Calculator",
  "salud",
  "calculator",
  "Estimate maximum heart rate from age using 220 - age.",
  [
    "max heart rate calculator",
    "frecuencia cardiaca maxima",
    "calculadora fc max",
    "220 minus age",
  ],
  {
    title: "Max Heart Rate Calculator — 220 - age | UtiliHub",
    description: "Free max heart rate calculator. Enter age to estimate MHR with 220-age formula. Local browser calculation.",
  },
);
tool.faq.push(faq("Is 220-age accurate?", "It's a common estimate; individual variation exists. Consult a professional for training zones."));

export const MAX_HEART_RATE_CALCULATOR_TOOLS = [tool];
