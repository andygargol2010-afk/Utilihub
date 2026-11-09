import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-potencia-electrica",
  "Electrical Power Calculator",
  "ciencia",
  "calculator",
  "Calculate electrical power from voltage and current (P = V × I).",
  [
    "electrical power calculator",
    "power calculator",
    "calculadora potencia electrica",
    "calculadora de potencia",
  ],
  {
    title: "Electrical Power Calculator — P = V × I | UtiliHub",
    description: "Free electrical power calculator. Enter voltage and current to get power in watts. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Power (W) = Voltage (V) × Current (A)."));
tool.faq.push(faq("Units?", "Voltage in volts, current in amperes, power in watts."));

export const ELECTRICAL_POWER_CALCULATOR_TOOLS = [tool];
