import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-descuento",
  "Discount Calculator",
  "utilidades",
  "calculator",
  "Calculate the final price after a percentage discount. Enter original price and discount % to see savings and final amount. Runs fully in the browser.",
  [
    "discount calculator",
    "percentage discount",
    "calculadora descuento",
    "precio con descuento",
    "discount percent",
    "sale price calculator",
  ],
  {
    title: "Discount Calculator — Percentage Off Price | UtiliHub",
    description:
      "Free discount calculator. Enter original price and discount percentage to get the final price and savings. Instant, local, no signup.",
  },
);
tool.faq.push(faq("How is the discount calculated?", "Discount amount = original price × (discount % / 100). Final price = original price − discount amount. Example: 80 with 25% off → 20 saved, final price 60."));
tool.faq.push(faq("Can I calculate two discounts together (e.g. 30% off plus an extra 20%)?", "Apply them sequentially, not by adding: final = price × (1 − 0.30) × (1 − 0.20). A 30% plus 20% discount equals 44% total off, not 50%."));
tool.faq.push(faq("Does it work for taxes or markups?", "No. This tool only subtracts a percentage. Use a percentage-change or tax calculator for increases."));

export const DISCOUNT_CALCULATOR_TOOLS = [tool];
