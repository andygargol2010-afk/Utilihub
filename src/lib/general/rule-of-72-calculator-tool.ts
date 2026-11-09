import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-regla-del-72",
  "Rule of 72 Calculator",
  "finanzas",
  "calculator",
  "Estimate years to double an investment using the Rule of 72 and compare to exact annual compounding.",
  [
    "rule of 72 calculator",
    "years to double money",
    "calculadora regla del 72",
    "cuanto tarda en duplicarse",
  ],
  {
    title: "Calculadora de la Regla del 72 — Años para duplicar | UtiliHub",
    description: "Free Rule of 72 calculator. Enter annual rate to estimate years to double your money. Compare with exact compound interest. Browser-only.",
    summaryEs: "Estima los años para duplicar una inversión con la Regla del 72 y compáralo con el interés compuesto exacto anual.",
  },
);
tool.faq.push(faq("What is the Rule of 72?", "A quick mental math shortcut: years to double ≈ 72 / annual rate (%). Accurate near 6-10%."));
tool.faq.push(faq("How accurate is it?", "Very close between ~5% and 12%. At extremes the exact logarithmic formula is better."));

export const RULE_OF_72_CALCULATOR_TOOLS = [tool];
