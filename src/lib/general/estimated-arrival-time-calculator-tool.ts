import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tiempo-estimado-llegada",
  "Estimated Arrival Time Calculator",
  "viajes",
  "calculator",
  "Calculate estimated travel time (ETA) from distance and average speed. Simple hours and minutes.",
  [
    "estimated arrival time calculator",
    "ETA calculator distance speed",
    "calculadora tiempo estimado llegada",
    "tiempo de viaje calculadora",
    "how long to drive",
  ],
  {
    title: "Estimated Arrival Time Calculator — Distance & Speed | UtiliHub",
    description: "Free ETA calculator. Enter distance in km and average speed in km/h to get travel time in hours and minutes. Browser-only.",
    summaryEs: "Calcula el tiempo estimado de llegada (ETA) a partir de la distancia y la velocidad promedio.",
  },
);
tool.faq.push(faq("Does it include stops?", "No. This is pure distance / speed. Add buffer for stops, traffic, or rest."));

export const ESTIMATED_ARRIVAL_TIME_CALCULATOR_TOOLS = [tool];
