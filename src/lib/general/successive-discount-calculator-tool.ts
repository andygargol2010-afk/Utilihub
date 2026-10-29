import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-descuento-sucesivo",
  "Successive Discount Calculator",
  "utilidades",
  "calculator",
  "Calculate the final price after two successive percentage discounts (applied sequentially, not added).",
  [
    "successive discount calculator",
    "double discount calculator",
    "calculadora descuento sucesivo",
    "descuentos sucesivos",
    "precio con dos descuentos",
    "stacked discounts",
  ],
  {
    title: "Successive Discount Calculator | Two Percentage Discounts | UtiliHub",
    description: "Free successive discount calculator. Enter original price and two discount percentages to get the final price after sequential application. Browser-only, no signup.",
    summaryEs: "Calcula el precio final tras dos descuentos porcentuales sucesivos (aplicados en secuencia).",
  },
);
tool.faq.push(
  faq(
    "How are successive discounts calculated?",
    "Apply them one after the other: final = price × (1 - d1/100) × (1 - d2/100). Do not add the percentages.",
  ),
  faq(
    "Example: 100 with 20% then 10%?",
    "After 20%: 80. After 10% of 80: 72. Total effective discount is 28%, not 30%.",
  ),
);

export const SUCCESSIVE_DISCOUNT_CALCULATOR_TOOLS = [tool];
