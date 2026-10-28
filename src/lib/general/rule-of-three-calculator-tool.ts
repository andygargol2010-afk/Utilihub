import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-regla-de-tres",
  "Rule of Three Calculator",
  "matematicas",
  "calculator",
  "Solve proportions using the rule of three (a/b = c/x).",
  [
    "rule of three calculator",
    "proportion calculator",
    "calculadora regla de tres",
    "regla de tres simple",
    "proporciones",
  ],
  {
    title: "Rule of Three Calculator | Proportions | UtiliHub",
    description: "Free rule of three calculator. Enter three values to solve the unknown in a proportion. Browser-only, no signup.",
    summaryEs: "Resuelve proporciones con la regla de tres (a/b = c/x).",
  },
);
tool.faq.push(
  faq(
    "What is the rule of three?",
    "If a/b = c/x, then x = (b \u00d7 c) / a. Used for direct proportions.",
  ),
  faq(
    "What if a is zero?",
    "Division by zero is undefined. Enter a non-zero value for a.",
  ),
);

export const RULE_OF_THREE_CALCULATOR_TOOLS = [tool];
