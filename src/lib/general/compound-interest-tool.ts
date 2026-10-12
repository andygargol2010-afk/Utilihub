import { makeTool } from "./types";

export const COMPOUND_INTEREST_TOOLS = [
  makeTool(
    "calculadora-interes-compuesto",
    "Compound Interest Calculator",
    "utilidades",
    "calculator",
    "Calculate compound interest and total amount from principal, rate, and time. Instant, local, no signup.",
    [
      "compound interest calculator",
      "interest calculator",
      "calculadora de interes compuesto",
      "interes compuesto",
      "principal rate time compound",
    ],
    {
      title: "Compound Interest Calculator — Principal, rate, time | UtiliHub",
      description: "Free compound interest calculator. Enter principal, annual rate and years to get interest and total. Runs in the browser.",
      operation: "compound-interest",
      fields: ["Principal", "Rate (%)", "Time (years)"],
    },
  ),
];
