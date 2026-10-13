import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ley-ohm",
  "Ohm's Law Calculator",
  "ciencia",
  "calculator",
  "Calculate voltage, current, or resistance using Ohm's law (V = I × R). Runs fully in the browser.",
  [
    "ohms law calculator",
    "ohm's law calculator",
    "voltage current resistance calculator",
    "calculadora ley de ohm",
    "calculadora de ohm",
    "ley de ohm voltaje corriente resistencia",
  ],
  {
    title: "Ohm's Law Calculator — Voltage, Current, Resistance | UtiliHub",
    description:
      "Free Ohm's law calculator. Enter any two of voltage (V), current (I), or resistance (R) to find the third. Instant local calculation, no signup.",
  },
);
tool.faq.push(
  faq(
    "What is Ohm's law?",
    "Ohm's law states that voltage equals current times resistance: V = I × R. It relates the three quantities in a simple resistive circuit.",
  ),
);
tool.faq.push(
  faq(
    "What units should I use?",
    "Use volts (V), amperes (A), and ohms (Ω). The calculator accepts any numeric values and returns the consistent unit.",
  ),
);
tool.faq.push(
  faq(
    "Does this work for AC circuits?",
    "This tool uses the basic DC form of Ohm's law. For AC with impedance or reactance, more advanced analysis is needed.",
  ),
);

export const OHMS_LAW_TOOLS = [tool];
