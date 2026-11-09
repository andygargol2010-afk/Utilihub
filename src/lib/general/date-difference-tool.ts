import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-diferencia-fechas",
  "Date Difference Calculator",
  "fechas",
  "calculator",
  "Calculate the number of days, weeks, and months between two dates.",
  [
    "days between two dates",
    "date difference calculator",
    "how many days until",
    "días entre dos fechas",
    "calculadora de diferencia de fechas",
    "cuántos días hay entre",
  ],
  {
    title: "Date Difference Calculator — Days Between Two Dates | UtiliHub",
    description: "Free date difference calculator. Enter start and end dates to get exact days, weeks, and approximate months between them. Runs locally in the browser.",
  },
);
tool.faq.push(faq("Does it include the start or end date?", "It counts the full days between the two dates (end - start). Same date returns 0."));
tool.faq.push(faq("What about leap years?", "The calculation uses the actual calendar, so February 29 is handled correctly."));

export const DATE_DIFFERENCE_TOOLS = [tool];
