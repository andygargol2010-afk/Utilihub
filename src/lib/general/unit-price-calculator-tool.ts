import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-precio-por-unidad",
  "Unit Price Calculator",
  "utilidades",
  "calculator",
  "Calculate the price per unit from total price and quantity. Instant result for comparing products. Runs fully in the browser.",
  [
    "unit price calculator",
    "price per unit",
    "calculadora precio por unidad",
    "precio unitario",
    "cost per item calculator",
  ],
  {
    title: "Unit Price Calculator — Price per Unit from Total and Quantity | UtiliHub",
    description: "Free unit price calculator. Enter total price and quantity to get the price per unit. Local, private, no signup.",
    summaryEs: "Calcula el precio por unidad a partir del precio total y la cantidad. Ideal para comparar productos.",
  },
);
tool.faq.push(
  faq(
    "How do I calculate price per unit?",
    "Divide the total price by the quantity: price per unit = total / quantity.",
  ),
);
tool.faq.push(
  faq(
    "Why is unit price useful?",
    "It helps compare different package sizes or brands to find the best value.",
  ),
);

export const UNIT_PRICE_CALCULATOR_TOOLS = [tool];
