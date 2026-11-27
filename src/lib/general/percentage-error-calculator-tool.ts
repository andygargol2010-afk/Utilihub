import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-error-porcentual",
  "Percentage Error Calculator",
  "matematicas",
  "calculator",
  "Calculate percentage error between experimental and theoretical values.",
  [
    "percentage error calculator",
    "percent error calculator",
    "calculadora error porcentual",
    "error porcentual experimental teórico",
  ],
  {
    title: "Percentage Error Calculator | UtiliHub",
    description: "Free percentage error calculator. Experimental and theoretical values. Browser-only.",
    summaryEs: "Calcula el error porcentual entre valor experimental y teórico.",
  },
);
tool.faq.push(
  faq(
    "What is the formula for percentage error?",
    "Percentage error = (|experimental − theoretical| / |theoretical|) × 100. The absolute value keeps the error non-negative.",
  ),
);
tool.faq.push(
  faq(
    "What values are valid?",
    "The theoretical value must not be zero (division by zero is undefined). If the experimental value equals the theoretical one, the percentage error is 0%.",
  ),
);

export const PERCENTAGE_ERROR_CALCULATOR_TOOLS = [tool];
