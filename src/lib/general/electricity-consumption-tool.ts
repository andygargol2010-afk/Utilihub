import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-consumo-electricidad",
  "Electricity Consumption Calculator",
  "hogar",
  "calculator",
  "Calculate daily electricity consumption in kWh and cost from power, hours and price.",
  [
    "electricity consumption calculator",
    "kwh calculator",
    "calculadora consumo electricidad",
    "consumo electrico",
    "coste electricidad",
  ],
  {
    title: "Electricity Consumption Calculator | UtiliHub",
    description: "Free electricity consumption calculator. Enter watts, hours per day and price per kWh to get daily kWh and cost. Instant.",
  },
);
tool.faq.push(faq("How is kWh calculated?", "kWh = (watts × hours) / 1000. Cost = kWh × price per kWh."));

export const ELECTRICITY_CONSUMPTION_TOOLS = [tool];
