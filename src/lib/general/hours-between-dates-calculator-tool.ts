import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-horas-entre-fechas",
  "Hours Between Dates Calculator",
  "fechas",
  "calculator",
  "Calculate the exact number of hours between two dates and times.",
  [
    "hours between dates",
    "calculadora horas entre fechas",
    "time difference calculator",
    "diferencia de horas",
    "how many hours between dates",
  ],
  {
    title: "Hours Between Dates Calculator — Free Time Difference | UtiliHub",
    description: "Free calculator for hours between two dates and times. Instant result in your browser.",
    summaryEs: "Calcula el número exacto de horas entre dos fechas y horas.",
  },
);
tool.faq.push(faq("How is it calculated?", "Difference in milliseconds divided by 3,600,000. Uses local browser time."));
tool.faq.push(faq("Negative result?", "If the end date is before the start, the result is negative (hours in the past)."));

export const HOURS_BETWEEN_DATES_CALCULATOR_TOOLS = [tool];
