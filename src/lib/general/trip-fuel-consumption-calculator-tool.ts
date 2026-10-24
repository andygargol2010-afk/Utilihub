import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-consumo-viaje",
  "Trip Fuel Consumption Calculator",
  "viajes",
  "calculator",
  "Estimate fuel consumption and cost for a trip based on distance, efficiency and fuel price. Runs fully in the browser.",
  [
    "trip fuel calculator",
    "fuel consumption trip",
    "calculadora consumo viaje",
    "how much fuel for trip",
    "travel fuel cost calculator",
  ],
  {
    title: "Trip Fuel Consumption Calculator — Liters and Cost | UtiliHub",
    description: "Free trip fuel calculator. Enter distance, consumption rate and fuel price to estimate liters needed and total cost. Local, private, no signup.",
    summaryEs: "Estima el consumo de combustible y costo de un viaje. Distancia, eficiencia y precio.",
  },
);
tool.faq.push(
  faq(
    "How is fuel consumption calculated?",
    "Liters = (distance km / 100) × consumption L/100km. Cost = liters × price per liter.",
  ),
);

export const TRIP_FUEL_CONSUMPTION_CALCULATOR_TOOLS = [tool];
