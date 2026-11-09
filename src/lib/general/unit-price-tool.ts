import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-precio-unitario",
  "Unit Price Calculator",
  "utilidades",
  "calculator",
  "Compare product prices by unit weight, volume, or quantity to find the best value.",
  [
    "unit price calculator",
    "price per unit",
    "price per kg",
    "price per liter",
    "calculadora precio unitario",
    "precio por kilo",
    "comparar precios unitarios",
  ],
  {
    title: "Unit Price Calculator — Price per kg, Liter or Item | UtiliHub",
    description:
      "Free unit price calculator. Enter total price and quantity to get the price per unit. Compare products by weight, volume or count. Runs locally in your browser.",
  },
);
tool.faq.push(
  faq(
    "How is the price per unit calculated?",
    "Price per unit = total price ÷ quantity. Example: $12.50 for 2.5 kg gives $5.00 per kg.",
  ),
  faq(
    "Can I compare products in different units?",
    "Only within the same unit. To compare a price per kg with a price per lb or per liter, first convert one product to the same unit (1 kg = 2.20462 lb = 1000 g; 1 L = 1000 mL).",
  ),
);

export const UNIT_PRICE_TOOLS = [tool];
