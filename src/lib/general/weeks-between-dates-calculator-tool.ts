import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-semanas-entre-fechas",
  "Weeks Between Dates Calculator",
  "fechas",
  "calculator",
  "Calculate the number of full weeks and remaining days between two dates.",
  [
    "weeks between dates",
    "weeks calculator",
    "calculadora semanas entre fechas",
    "semanas entre dos fechas",
    "how many weeks between",
    "diferencia en semanas",
  ],
  {
    title: "Weeks Between Dates Calculator | UtiliHub",
    description: "Free weeks between dates calculator. Enter two dates to get full weeks and leftover days.",
  },
);
tool.faq.push(faq("Does it include both dates?", "It calculates the absolute difference in days, then full weeks + remainder. End date exclusive of extra day if same time."));

export const WEEKS_BETWEEN_DATES_CALCULATOR_TOOLS = [tool];
