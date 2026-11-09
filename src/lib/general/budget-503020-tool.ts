import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-presupuesto-503020",
  "50/30/20 Budget Calculator",
  "productividad",
  "calculator",
  "Split your after-tax income into needs (50%), wants (30%), and savings (20%).",
  [
    "50/30/20 budget calculator",
    "50 30 20 rule",
    "budget calculator",
    "calculadora presupuesto 50 30 20",
    "regla 50 30 20",
  ],
  {
    title: "50/30/20 Budget Calculator — Needs, Wants, Savings | UtiliHub",
    description: "Free 50/30/20 rule calculator. Enter monthly after-tax income to see recommended amounts for needs, wants, and savings/debt. Runs locally.",
  },
);
tool.faq.push(faq("What is the 50/30/20 rule?", "A simple budgeting guideline: 50% of after-tax income for needs, 30% for wants, 20% for savings and debt repayment."));
tool.faq.push(faq("Is this financial advice?", "No. It is a general framework. Adjust based on your situation, location, and goals."));

export const BUDGET_503020_TOOLS = [tool];
