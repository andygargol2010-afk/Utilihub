import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-descuento",
  "Percentage Discount Calculator",
  "finanzas",
  "calculator",
  "Calculate the final price after a percentage discount. Instant result for sales, promotions or savings. Runs fully in the browser.",
  [
    "percentage discount calculator",
    "discount calculator",
    "calculadora descuento porcentaje",
    "how much is X percent off",
    "sale price calculator",
  ],
  {
    title: "Percentage Discount Calculator — Final Price After X% Off | UtiliHub",
    description: "Free percentage discount calculator. Enter original price and discount percent to get the savings and final price instantly. Local, private, no signup.",
    summaryEs: "Calcula el precio final tras un descuento porcentual. Resultado instantáneo para ofertas o ahorros.",
  },
);
tool.faq.push(
  faq(
    "How do I calculate a percentage discount?",
    "Savings = (discount% / 100) × original price. Final price = original − savings.",
  ),
);
tool.faq.push(
  faq(
    "Can I use this for multiple items?",
    "Yes. Calculate per item or total the original prices first.",
  ),
);

export const PERCENTAGE_DISCOUNT_CALCULATOR_TOOLS = [tool];
