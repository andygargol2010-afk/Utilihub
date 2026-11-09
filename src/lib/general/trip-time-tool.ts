import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tiempo-viaje",
  "Trip Time Calculator",
  "viajes",
  "calculator",
  "Calculate trip duration from distance and average speed. Instant browser calculation.",
  [
    "trip time calculator",
    "travel time calculator",
    "distance speed time calculator",
    "calculadora tiempo de viaje",
    "tiempo de viaje distancia velocidad",
    "calculadora de duración de viaje",
  ],
  {
    title: "Trip Time Calculator — Distance and Speed to Duration | UtiliHub",
    description: "Free trip time calculator. Enter distance and average speed to get travel duration in hours and minutes. Runs locally in your browser.",
  },
);
tool.faq.push(faq("How is time calculated?", "Time = Distance / Speed. Result is shown in hours and minutes."));
tool.faq.push(faq("What units?", "Use consistent units (km and km/h, or miles and mph). The tool does not convert between unit systems."));

export const TRIP_TIME_TOOLS = [tool];
