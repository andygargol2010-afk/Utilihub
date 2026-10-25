import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-propina",
  "Tip Calculator",
  "finanzas",
  "calculator",
  "Calculate tip amount and total bill based on percentage.",
  [
    "tip calculator",
    "calculate tip",
    "calculadora de propina",
    "propina porcentaje",
    "bill tip",
  ],
  {
    title: "Tip Calculator — Percentage and Total | UtiliHub",
    description: "Free tip calculator. Enter bill amount and tip percentage to get tip and total. Browser-only.",
    summaryEs: "Calcula la propina y el total de la cuenta según el porcentaje.",
  },
);
tool.faq.push(
  faq(
    "How does the tip calculator work?",
    "Enter the bill subtotal and desired tip percentage. The tool computes the tip amount and the total to pay.",
  ),
);

export const TIP_CALCULATOR_TOOLS = [tool];
