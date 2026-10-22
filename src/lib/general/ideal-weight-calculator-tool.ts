import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-peso-saludable",
  "Ideal Weight Calculator",
  "salud",
  "calculator",
  "Calculate ideal body weight from height and gender using the Devine formula.",
  [
    "ideal weight calculator",
    "ideal body weight",
    "calculadora peso ideal",
    "peso ideal segun altura",
    "devine formula",
    "calculadora peso saludable",
  ],
  {
    title: "Ideal Weight Calculator — Devine Formula | UtiliHub",
    description: "Free ideal weight calculator. Enter height and gender to get your ideal weight in kg using the Devine formula.",
  },
);
tool.faq.push(faq("What formula is used?", "Devine: Men 50 + 2.3 × (height_in − 60); Women 45.5 + 2.3 × (height_in − 60). Height in cm converted to inches."));
tool.faq.push(faq("Is this medical advice?", "No. It is an estimate only. Consult a professional for personal health advice."));

export const IDEAL_WEIGHT_CALCULATOR_TOOLS = [tool];
