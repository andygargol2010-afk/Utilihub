import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-factorial",
  "Factorial Calculator",
  "matematicas",
  "calculator",
  "Calculate the factorial of a non-negative integer (0–170).",
  [
    "factorial calculator",
    "n factorial",
    "calculadora factorial",
    "factorial de n",
  ],
  {
    title: "Factorial Calculator — n! for integers 0–170 | UtiliHub",
    description: "Free factorial calculator. Enter an integer from 0 to 170 to get n!. Local browser calculation with BigInt.",
  },
);
tool.faq.push(faq("What is the maximum n?", "Up to 170 to stay within safe BigInt range in browsers."));

export const FACTORIAL_CALCULATOR_TOOLS = [tool];
