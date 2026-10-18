import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-margen-beneficio",
  "Profit Margin Calculator",
  "finanzas",
  "calculator",
  "Calculate profit margin percentage from cost and selling price or revenue.",
  [
    "profit margin calculator",
    "gross margin calculator",
    "calculate profit margin",
    "calculadora margen de beneficio",
    "calculadora margen de ganancia",
    "margen de beneficio",
  ],
  {
    title: "Profit Margin Calculator — Cost & Selling Price | UtiliHub",
    description: "Free profit margin calculator. Enter cost and selling price (or revenue) to get the margin percentage and profit amount. Runs entirely in the browser.",
  },
);
tool.faq.push(faq("How is profit margin calculated?", "Margin % = ((Selling price − Cost) / Selling price) × 100. Profit = Selling price − Cost."));
tool.faq.push(faq("Is this gross or net margin?", "This is the basic (gross) margin from cost and selling price. It does not include taxes, overhead or other expenses."));

export const PROFIT_MARGIN_CALCULATOR_TOOLS = [tool];
