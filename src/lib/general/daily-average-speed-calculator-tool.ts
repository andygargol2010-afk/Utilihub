import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-velocidad-promedio-diaria",
  "Daily Average Speed Calculator",
  "productividad",
  "calculator",
  "Calculate average speed from distance and time for daily activities or runs.",
  [
    "average speed calculator",
    "velocidad promedio",
    "calculadora velocidad media",
    "km/h from distance time",
    "pace calculator",
  ],
  {
    title: "Daily Average Speed Calculator — km/h from Distance & Time | UtiliHub",
    description: "Free average speed calculator. Enter distance in km and time in minutes to get your average speed in km/h.",
  },
);
tool.faq.push(faq("How is speed calculated?", "Speed (km/h) = distance (km) / (time in minutes / 60)."));
tool.faq.push(faq("Can I use it for running?", "Yes, for any activity with distance and duration."));

export const DAILY_AVERAGE_SPEED_CALCULATOR_TOOLS = [tool];
