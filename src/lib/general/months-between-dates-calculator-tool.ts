import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-meses-entre-fechas",
  "Months Between Dates Calculator",
  "fechas",
  "calculator",
  "Calculate the number of full months and remaining days between two dates.",
  [
    "months between dates",
    "months between two dates",
    "calculadora de meses entre fechas",
    "meses entre fechas",
    "how many months between",
  ],
  {
    title: "Months Between Dates Calculator — Exact Months and Days | UtiliHub",
    description: "Free months between dates calculator. Enter two dates to get full months and remaining days. Browser-only, no signup.",
    summaryEs: "Calcula los meses completos y los días restantes entre dos fechas.",
  },
);
tool.faq.push(
  faq(
    "How are months between dates calculated?",
    "Full calendar months are counted by advancing the start date month by month until it exceeds the end date, then remaining days are calculated.",
  ),
  faq(
    "Does it account for different month lengths?",
    "Yes. It uses actual calendar dates, so February and 31-day months are handled correctly.",
  ),
);

export const MONTHS_BETWEEN_DATES_CALCULATOR_TOOLS = [tool];
