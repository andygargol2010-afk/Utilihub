import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-presupuesto-total-viaje",
  "Trip Total Budget Calculator",
  "viajes",
  "calculator",
  "Calculate the total budget for a trip by summing transport, lodging, food, and miscellaneous costs. Optional per-person and per-day breakdown.",
  [
    "trip budget calculator",
    "total travel cost",
    "calculadora presupuesto viaje",
    "presupuesto total viaje",
    "costo viaje",
    "budget trip",
  ],
  {
    title: "Trip Total Budget Calculator | UtiliHub",
    description: "Free trip total budget calculator. Sum transport, lodging, food and misc. See total, per person and per day. EN+ES.",
    summaryEs: "Calcula el presupuesto total de un viaje sumando transporte, alojamiento, comida y otros.",
  },
);
tool.faq.push(faq("How is the total calculated?", "Simple sum of the four categories. Per-person = total / people; per-day = total / days."));
tool.faq.push(faq("Can I leave a category at zero?", "Yes. Zero is valid. Negative values are rejected."));

export const TRIP_TOTAL_BUDGET_CALCULATOR_TOOLS = [tool];
