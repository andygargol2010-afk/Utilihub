import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ahorro-mensual",
  "Monthly Savings Calculator",
  "utilidades",
  "calculator",
  "Calculate the monthly amount needed to reach a savings goal.",
  [
    "monthly savings calculator",
    "savings goal calculator",
    "calculadora ahorro mensual",
    "cuanto ahorrar al mes",
    "goal savings monthly",
  ],
  {
    title: "Monthly Savings Calculator — Reach your goal | UtiliHub",
    description: "Free monthly savings calculator. Enter your goal, current savings and months to see how much to save each month.",
  },
);
tool.faq.push(faq("How is it calculated?", "Monthly savings = (Goal - Current savings) / Number of months. Simple, no interest considered."));
tool.faq.push(faq("Can I include interest?", "This version is interest-free for simplicity. Ideal for short-term goals."));

export const MONTHLY_SAVINGS_CALCULATOR_TOOLS = [tool];
