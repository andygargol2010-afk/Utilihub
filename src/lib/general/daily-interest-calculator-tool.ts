import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-interes-diario",
  "Daily Interest Calculator",
  "finanzas",
  "calculator",
  "Calculate simple daily interest from principal, annual rate and number of days. Practical for short-term loans or savings.",
  [
    "daily interest calculator",
    "calculadora interes diario",
    "simple daily interest",
    "interes simple diario",
    "interest per day calculator",
  ],
  {
    title: "Daily Interest Calculator — Simple Interest by Days | UtiliHub",
    description: "Free daily interest calculator. Enter principal, annual rate and days. Get interest amount. Browser-only.",
    summaryEs: "Calcula el interés simple diario a partir del principal, la tasa anual y los días.",
  },
);
tool.faq.push(
  faq(
    "How is daily interest calculated?",
    "Uses simple interest: principal × (annual rate / 100 / 365) × days. Assumes 365 days/year.",
  ),
);

export const DAILY_INTEREST_CALCULATOR_TOOLS = [tool];
