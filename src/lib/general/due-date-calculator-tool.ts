import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-fecha-parto",
  "Due Date Calculator",
  "fechas",
  "calculator",
  "Calculate pregnancy due date from last menstrual period using Naegele's rule (280 days).",
  [
    "due date calculator",
    "pregnancy due date",
    "naegele's rule",
    "calculadora fecha de parto",
    "fecha probable de parto",
    "calculadora de embarazo",
  ],
  {
    title: "Pregnancy Due Date Calculator — Naegele's Rule | UtiliHub",
    description: "Free online due date calculator. Enter the first day of your last menstrual period to get the estimated due date (280 days). Runs locally in the browser.",
  },
);
tool.faq.push(faq("How is the due date calculated?", "Using Naegele's rule: add 280 days (40 weeks) to the first day of the last menstrual period. This is an estimate, not a guarantee."));
tool.faq.push(faq("Is this medical advice?", "No. This is a simple mathematical estimate. Always consult a healthcare professional for pregnancy care."));
tool.faq.push(faq("What if I know the conception date?", "You can enter a date 14 days after conception as the LMP equivalent, or use a more advanced calculator with your provider."));

export const DUE_DATE_CALCULATOR_TOOLS = [tool];
