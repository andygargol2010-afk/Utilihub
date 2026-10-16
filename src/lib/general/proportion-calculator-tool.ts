import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-proporcion",
  "Proportion Calculator",
  "matematicas",
  "calculator",
  "Solve proportions: find the missing value in a:b = c:x or scale ratios quickly in the browser.",
  [
    "proportion calculator",
    "ratio calculator",
    "solve proportion",
    "calculadora de proporciones",
    "calculadora de ratios",
    "resolver proporción",
  ],
  {
    title: "Proportion Calculator — Solve a:b = c:x | UtiliHub",
    description: "Free proportion and ratio calculator. Enter three values to find the fourth. Instant, private, runs in your browser.",
  },
);
tool.faq.push(faq("How does the proportion formula work?", "Cross-multiply: a/b = c/x → a·x = b·c → x = (b·c)/a. The tool solves for the empty field."));
tool.faq.push(faq("What if I leave more than one field empty?", "Enter exactly three numbers and leave one blank so the calculator knows which value to solve for."));

export const PROPORTION_CALCULATOR_TOOLS = [tool];
