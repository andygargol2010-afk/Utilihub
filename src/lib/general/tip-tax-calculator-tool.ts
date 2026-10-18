import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-propina-impuesto",
  "Tip + Tax Calculator",
  "utilidades",
  "calculator",
  "Calculate tip, sales tax and total bill from subtotal, tax rate and tip percentage.",
  [
    "tip and tax calculator",
    "tip tax calculator",
    "calculadora propina e impuesto",
    "calculadora propina impuesto",
    "bill calculator with tax and tip",
  ],
  {
    title: "Tip + Tax Calculator — Calculate tip, tax and total | UtiliHub",
    description: "Free tip and tax calculator. Enter subtotal, tax percentage and tip percentage to see tax amount, tip and grand total. Runs locally.",
  },
);
tool.faq.push(faq("How is tax calculated?", "Tax = subtotal × (tax% / 100). Tip is usually on the subtotal or on subtotal+tax — this tool applies tip on subtotal+tax by default."));
tool.faq.push(faq("Can I change tip base?", "Currently tip is calculated on the amount after tax. Adjust percentages as needed."));

export const TIP_TAX_CALCULATOR_TOOLS = [tool];
