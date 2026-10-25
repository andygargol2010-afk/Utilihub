import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-logaritmo",
  "Logarithm Calculator",
  "matematicas",
  "calculator",
  "Calculate logarithms with any base. Useful for math, science and engineering.",
  [
    "logarithm calculator",
    "calculadora de logaritmo",
    "log base 10",
    "natural log calculator",
    "calculadora logaritmo base",
  ],
  {
    title: "Logarithm Calculator — Any Base | UtiliHub",
    description: "Free logarithm calculator. Enter number and base to get log result. Browser-only.",
    summaryEs: "Calcula logaritmos en cualquier base. Útil para matemáticas y ciencias.",
  },
);
tool.faq.push(
  faq(
    "How is the logarithm calculated?",
    "Using the change of base formula: log_b(n) = ln(n) / ln(b).",
  ),
);

export const LOGARITHM_CALCULATOR_TOOLS = [tool];
