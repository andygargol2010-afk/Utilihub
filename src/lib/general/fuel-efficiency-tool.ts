import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-eficiencia-combustible",
  "Fuel Efficiency Calculator",
  "viajes",
  "calculator",
  "Calculate fuel efficiency from distance and fuel used. Supports L/100km, km/L, MPG.",
  [
    "fuel efficiency calculator",
    "mpg calculator",
    "l/100km calculator",
    "calculadora eficiencia combustible",
    "consumo combustible",
    "km por litro",
  ],
  {
    title: "Fuel Efficiency Calculator — MPG, L/100km, km/L | UtiliHub",
    description:
      "Free fuel efficiency calculator. Enter distance and fuel used to get L/100km, km/L, or MPG. Instant browser calculation.",
  },
);
tool.faq.push(
  faq(
    "How is fuel efficiency calculated?",
    "L/100km = (fuel liters / distance km) * 100. km/L = distance / fuel. MPG = (distance miles / fuel gallons).",
  ),
);
tool.faq.push(
  faq(
    "What if fuel used is zero?",
    "Efficiency is infinite or undefined. The tool warns and avoids division by zero.",
  ),
);

export const FUEL_EFFICIENCY_TOOLS = [tool];
