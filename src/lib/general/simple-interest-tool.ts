import { makeTool } from "./types";

export const SIMPLE_INTEREST_TOOLS = [
  makeTool(
    "calculadora-interes-simple",
    "Simple Interest Calculator",
    "utilidades",
    "calculator",
    "Calculate simple interest and total amount from principal, rate and time. Instant, local, no signup.",
    [
      "simple interest calculator",
      "interest calculator",
      "calculadora de interes simple",
      "interes simple",
      "principal rate time",
    ],
    {
      title: "Simple Interest Calculator — Principal, rate, time | UtiliHub",
      description: "Free simple interest calculator. Enter principal, annual rate and years to get interest and total. Runs in the browser.",
      operation: "simple-interest",
      fields: ["Principal", "Rate (%)", "Time (years)"],
    },
  ),
];
