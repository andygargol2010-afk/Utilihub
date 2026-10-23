import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-interes-compuesto",
  "Compound Interest Calculator",
  "finanzas",
  "calculator",
  "Calculate compound interest. Formula: A = P (1 + r/n)^(n*t).",
  [
    "compound interest calculator",
    "calculadora interes compuesto",
    "compound interest",
    "interes compuesto",
    "calculadora de interes compuesto",
  ],
  {
    title: "Compound Interest Calculator | UtiliHub",
    description: "Free compound interest calculator. Enter principal, annual rate, time and compounding frequency. Runs in your browser.",
  },
);
tool.faq.push(faq("What is compound interest?", "Interest calculated on the initial principal and also on the accumulated interest of previous periods."));

export const COMPOUND_INTEREST_CALCULATOR_TOOLS = [tool];
