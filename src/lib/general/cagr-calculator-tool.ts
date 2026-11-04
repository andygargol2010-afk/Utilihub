import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-cagr",
  "CAGR Calculator",
  "finanzas",
  "calculator",
  "Calculate the Compound Annual Growth Rate (CAGR) from initial value, final value, and years.",
  [
    "cagr calculator",
    "compound annual growth rate",
    "calculadora cagr",
    "tasa de crecimiento anual compuesto",
    "annual growth rate calculator",
  ],
  {
    title: "CAGR Calculator — Compound Annual Growth Rate | UtiliHub",
    description: "Free CAGR calculator. Enter initial value, final value and years to get the compound annual growth rate. Local browser calculation, no signup.",
    summaryEs: "Calcula la tasa de crecimiento anual compuesto (CAGR) a partir del valor inicial, final y años.",
  },
);
tool.faq.push(
  faq(
    "What is CAGR?",
    "CAGR is the geometric average annual growth rate that smooths out the rate of return over multiple periods. Formula: (final / initial)^(1/years) − 1.",
  ),
);
tool.faq.push(
  faq(
    "When should I use CAGR instead of average annual return?",
    "Use CAGR when the growth is compounded and you want a single consistent annual rate that would produce the same total result. It is better than a simple average for multi-year investments.",
  ),
);

export const CAGR_CALCULATOR_TOOLS = [tool];
