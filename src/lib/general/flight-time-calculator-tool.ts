import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tiempo-vuelo",
  "Flight Time Calculator",
  "viajes",
  "calculator",
  "Estimate flight time from distance and average speed.",
  [
    "flight time calculator",
    "flight duration calculator",
    "calculadora tiempo de vuelo",
    "tiempo de vuelo",
  ],
  {
    title: "Flight Time Calculator — distance / speed | UtiliHub",
    description: "Free flight time calculator. Enter distance and speed to estimate duration. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Time = Distance / Speed. Convert units as needed."));
tool.faq.push(faq("Units?", "Distance in km or miles, speed in km/h or mph."));

export const FLIGHT_TIME_CALCULATOR_TOOLS = [tool];
