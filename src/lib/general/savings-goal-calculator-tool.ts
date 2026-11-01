import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ahorro-para-meta",
  "Savings Goal Calculator",
  "finanzas",
  "calculator",
  "Calculate how much to save monthly or how many months to reach a savings goal.",
  [
    "savings goal calculator",
    "calculadora ahorro para meta",
    "cuanto ahorrar al mes",
    "how much to save monthly",
    "calculadora de meta de ahorro",
  ],
  {
    title: "Savings Goal Calculator | How much to save monthly | UtiliHub",
    description: "Free savings goal calculator. Enter your goal amount and months (or monthly savings) to see the required monthly amount or time to goal. Instant browser calculation, EN+ES.",
    summaryEs: "Calcula cuánto ahorrar al mes o en cuántos meses alcanzarás una meta de ahorro.",
  },
);
tool.faq.push(faq("How does the savings goal calculator work?", "Divide the goal amount by the number of months to get the required monthly savings. Or divide the goal by your monthly savings to get the months needed. Simple, no interest assumed for clarity."));
tool.faq.push(faq("Does it include interest or inflation?", "No. This is a basic goal calculator without compound interest. Use the compound interest or savings rate tools for more advanced projections."));

export const SAVINGS_GOAL_CALCULATOR_TOOLS = [tool];
