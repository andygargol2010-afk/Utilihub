import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-dias-vacaciones",
  "Vacation Days Calculator",
  "fechas",
  "calculator",
  "Calculate remaining vacation days from annual allowance and days used. Instant result for leave planning. Runs fully in the browser.",
  [
    "vacation days calculator",
    "remaining vacation days",
    "calculadora días de vacaciones",
    "vacation leave calculator",
    "days off remaining",
  ],
  {
    title: "Vacation Days Calculator — Remaining Days Off | UtiliHub",
    description: "Free vacation days calculator. Enter annual allowance and days used to see remaining vacation days. Local, private, no signup.",
    summaryEs: "Calcula los días de vacaciones restantes a partir del total anual y los usados.",
  },
);
tool.faq.push(
  faq(
    "How are remaining vacation days calculated?",
    "Remaining = annual allowance - days used. Cannot be negative.",
  ),
);
tool.faq.push(
  faq(
    "What if I used more than allowed?",
    "The result shows 0 remaining and a note that you are over.",
  ),
);

export const VACATION_DAYS_CALCULATOR_TOOLS = [tool];
