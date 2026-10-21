import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-presupuesto-viaje",
  "Travel Budget Calculator",
  "viajes",
  "calculator",
  "Calculate total travel budget from daily amount, days, and number of people.",
  [
    "travel budget calculator",
    "trip cost calculator",
    "calculadora presupuesto viaje",
    "costo total viaje",
  ],
  {
    title: "Travel Budget Calculator — daily × days × people | UtiliHub",
    description: "Free travel budget calculator. Enter daily budget, days, and people to get the total cost. Local browser calculation.",
  },
);
tool.faq.push(faq("How is it calculated?", "Total = daily budget × number of days × number of people."));

export const TRAVEL_BUDGET_CALCULATOR_TOOLS = [tool];
