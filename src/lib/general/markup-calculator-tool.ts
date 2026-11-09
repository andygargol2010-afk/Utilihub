import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-markup",
  "Markup Calculator",
  "utilidades",
  "calculator",
  "Calculate the selling price from cost and markup percentage. Instant result for pricing products or services. Runs fully in the browser.",
  [
    "markup calculator",
    "calculate selling price markup",
    "calculadora markup",
    "precio con recargo",
    "markup percentage calculator",
    "calculadora de markup",
  ],
  {
    title: "Markup Calculator — Selling Price from Cost and Markup | UtiliHub",
    description: "Free markup calculator. Enter cost and markup % to get the selling price and profit. Local, private, no signup.",
    summaryEs: "Calcula el precio de venta a partir del costo y el porcentaje de markup. Ideal para fijar precios.",
  },
);
tool.faq.push(
  faq(
    "What is markup?",
    "Markup is the percentage added to the cost to determine the selling price. Selling price = cost × (1 + markup/100).",
  ),
);
tool.faq.push(
  faq(
    "How is markup different from margin?",
    "Markup is based on cost; margin is based on selling price. A 60% markup on cost 50 gives price 80 (margin 37.5%).",
  ),
);

export const MARKUP_CALCULATOR_TOOLS = [tool];
