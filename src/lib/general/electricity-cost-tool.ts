import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-costo-electricidad",
  "Electricity Cost Calculator",
  "hogar",
  "calculator",
  "Estimate the cost of running an appliance from watts, hours per day, electricity rate, and days.",
  [
    "electricity cost calculator",
    "power consumption calculator",
    "appliance running cost",
    "calculadora costo electricidad",
    "costo consumo electrico",
  ],
  {
    title: "Electricity Cost Calculator — Appliance running cost | UtiliHub",
    description: "Free electricity cost calculator. Enter watts, hours per day, rate per kWh, and days to estimate total cost and daily cost. Runs in the browser.",
  },
);
tool.faq.push(faq("How is electricity cost calculated?", "kWh = (watts × hours) / 1000. Cost = kWh × rate. Multiply by days for the period."));
tool.faq.push(faq("What rate should I use?", "Use your utility's price per kWh. Include taxes if you want a full estimate."));
tool.faq.push(faq("Does it account for standby power?", "This version uses the watts you enter while running. Add a separate standby calculation if needed."));

export const ELECTRICITY_COST_TOOLS = [tool];
