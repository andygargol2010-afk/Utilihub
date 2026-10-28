import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-interes-simple",
  "Simple Interest Calculator",
  "finanzas",
  "calculator",
  "Calculate simple interest and total amount from principal, rate, and time.",
  [
    "simple interest calculator",
    "calculadora interes simple",
    "interés simple",
    "I = P × r × t",
    "loan interest",
  ],
  {
    title: "Simple Interest Calculator | Loans & Savings | UtiliHub",
    description: "Free simple interest calculator. Enter principal, annual rate, and time in years to get interest and total amount. Browser-only, no signup.",
    summaryEs: "Calcula interés simple y monto total a partir de capital, tasa y tiempo.",
  },
);
tool.faq.push(
  faq(
    "What is simple interest?",
    "Simple interest is I = P × r × t / 100, where r is the annual rate in percent and t is time in years. Interest is not compounded.",
  ),
  faq(
    "Can the rate be entered as a decimal?",
    "Enter the rate as a percentage (e.g. 5 for 5%). The calculator divides by 100.",
  ),
);

export const SIMPLE_INTEREST_CALCULATOR_TOOLS = [tool];
