import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-diferencia-horas",
  "Time of Day Difference Calculator",
  "fechas",
  "calculator",
  "Calculate the hours and minutes between two times of day, including overnight shifts.",
  [
    "time difference calculator",
    "hours between times",
    "calculadora diferencia horas",
    "horas entre horarios",
    "work hours between times",
  ],
  {
    title: "Time of Day Difference Calculator | Hours Between Times | UtiliHub",
    description: "Free calculator for hours and minutes between two times of day (HH:MM). Handles overnight. EN+ES. Browser-only.",
    summaryEs: "Calcula las horas y minutos entre dos horarios del día, incluyendo turnos nocturnos.",
  },
);
tool.faq.push(faq("Does it handle overnight?", "Yes. If the end time is earlier than the start, it adds one day (next calendar day)."));
tool.faq.push(faq("What format to use?", "24-hour HH:MM, for example 09:30 or 17:45. Seconds are not required."));

export const TIME_OF_DAY_DIFFERENCE_CALCULATOR_TOOLS = [tool];
