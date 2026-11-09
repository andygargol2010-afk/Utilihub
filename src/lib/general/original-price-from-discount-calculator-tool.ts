import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-precio-original-descuento",
  "Original Price from Discount Calculator",
  "finanzas",
  "calculator",
  "Calculate the original price before a percentage discount from the final discounted price.",
  [
    "original price calculator",
    "price before discount",
    "reverse discount calculator",
    "calculadora precio original",
    "precio antes del descuento",
    "calculadora descuento inverso",
  ],
  {
    title: "Original Price from Discount Calculator | UtiliHub",
    description: "Free calculator to find the original price before a percentage discount. Enter the discounted price and discount % to get the original amount. Browser-only.",
    summaryEs: "Calculá el precio original antes de un descuento porcentual a partir del precio final y el porcentaje de descuento.",
  },
);
tool.faq.push(faq("How is the original price calculated?", "Original = discounted price / (1 - discount%/100). For example, 80 after 20% off means original was 100."));
tool.faq.push(faq("What if the discount is 100%?", "A 100% discount means the final price is 0, so original price is undefined or infinite. The tool rejects 100% or higher."));

export const ORIGINAL_PRICE_FROM_DISCOUNT_CALCULATOR_TOOLS = [tool];
