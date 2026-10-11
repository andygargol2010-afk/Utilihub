import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-propina",
  "Tip Calculator",
  "utilidades",
  "calculator",
  "Calculate tip and total bill amount based on percentage and number of people.",
  [
    "tip calculator",
    "calculate tip",
    "calculadora de propina",
    "propina restaurante",
    "tip percentage calculator",
    "split bill calculator",
  ],
  {
    title: "Tip Calculator — Calculate tip and split bill online | UtiliHub",
    description: "Free tip calculator. Enter bill amount, tip percentage, and number of people to calculate tip and total. Runs in browser.",
  },
);
tool.faq.push(faq("How is the tip calculated?", "Tip = bill × (percentage / 100). Total = bill + tip. Per person = total / people."));
tool.faq.push(faq("Can I split the bill?", "Yes, enter the number of people to see the amount per person."));
tool.faq.push(faq("Is it free?", "Yes, no signup required. Calculations happen locally."));

export const TIP_CALCULATOR_TOOLS = [tool];
