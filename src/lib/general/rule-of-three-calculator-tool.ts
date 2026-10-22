import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-regla-de-tres",
  "Rule of Three Calculator",
  "matematicas",
  "calculator",
  "Solve proportions with the rule of three. Enter three known values to find the fourth.",
  [
    "rule of three calculator",
    "proportion calculator",
    "calculadora regla de tres",
    "regla de tres simple",
    "direct proportion",
  ],
  {
    title: "Rule of Three Calculator — Proportion | UtiliHub",
    description: "Free rule of three calculator. Enter A, B and C to solve for X in A/B = C/X. Instant direct proportion.",
  },
);
tool.faq.push(faq("What is the rule of three?", "If A corresponds to B, and C corresponds to X, then X = (B × C) / A. It solves direct proportions."));

export const RULE_OF_THREE_CALCULATOR_TOOLS = [tool];
