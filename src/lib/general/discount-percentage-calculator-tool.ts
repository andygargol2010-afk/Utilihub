import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-descuento-porcentaje",
  "Discount Percentage Calculator",
  "finanzas",
  "calculator",
  "Calculate the final price after a percentage discount or the discount amount.",
  [
    "discount calculator",
    "percentage discount calculator",
    "calculadora descuento porcentaje",
    "precio con descuento",
    "calculadora de rebajas",
  ],
  {
    title: "Discount Percentage Calculator — Precio con Descuento | UtiliHub",
    description: "Free discount calculator. Enter original price and discount percentage to see the final price and savings. Instant, no signup.",
  },
);
tool.faq.push(faq("How do I calculate a percentage discount?", "Multiply the original price by the discount percentage (as decimal) to get the discount amount, then subtract from original."));

export const DISCOUNT_PERCENTAGE_CALCULATOR_TOOLS = [tool];
