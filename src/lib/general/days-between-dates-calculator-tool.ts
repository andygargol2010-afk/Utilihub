import { makeTool } from "./types";

const tool = makeTool(
  "calculadora-dias-entre-fechas",
  "Days Between Dates Calculator",
  "fechas",
  "calculator",
  "Calculate the number of days between two dates.",
  [
    "days between dates calculator",
    "calculadora dias entre fechas",
    "date difference calculator",
    "dias entre fechas",
    "cuantos dias entre fechas",
  ],
  {
    title: "Days Between Dates Calculator | UtiliHub",
    description: "Free days between dates calculator. Enter two dates and get the calendar day difference. Browser-only.",
    summaryEs: "Calcula los días entre dos fechas.",
  },
);

export const DAYS_BETWEEN_DATES_CALCULATOR_TOOLS = [tool];
