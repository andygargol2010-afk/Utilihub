import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-presupuesto-diario-viaje",
  "Daily Travel Budget Calculator",
  "viajes",
  "calculator",
  "Calculate recommended daily spending from total travel budget and trip duration.",
  [
    "daily travel budget calculator",
    "travel daily budget",
    "calculadora presupuesto diario viaje",
    "presupuesto diario viaje",
    "how much to spend per day travel",
  ],
  {
    title: "Daily Travel Budget Calculator | UtiliHub",
    description: "Free daily travel budget calculator. Divide total budget by days for daily spending. Browser-only.",
    summaryEs: "Calcula el gasto diario recomendado a partir del presupuesto total y los días de viaje.",
  },
);
tool.faq.push(
  faq(
    "How does the daily travel budget calculator work?",
    "Enter your total budget and the number of travel days. The tool divides the total by the days to suggest a daily amount.",
  ),
);

export const DAILY_TRAVEL_BUDGET_CALCULATOR_TOOLS = [tool];
