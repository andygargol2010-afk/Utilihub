import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-interes-simple",
  "Simple Interest Calculator",
  "finanzas",
  "calculator",
  "Calculate simple interest and total amount from principal, annual rate and time.",
  [
    "simple interest calculator",
    "calculate simple interest",
    "calculadora interes simple",
    "calculadora de inter\u00e9s simple",
  ],
  {
    title: "Simple Interest Calculator \u2014 I = P \u00d7 r \u00d7 t | UtiliHub",
    description: "Free simple interest calculator. Enter principal, annual rate (%) and time in years to get interest and total. Browser-only.",
  },
);
tool.faq.push(faq("What is the formula?", "Interest = Principal \u00d7 (rate/100) \u00d7 time. Total = Principal + Interest."));
tool.faq.push(faq("Is the rate annual?", "Yes, the rate is the annual percentage rate. Time is in years."));

export const SIMPLE_INTEREST_CALCULATOR_TOOLS = [tool];
