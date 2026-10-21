import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-dias-hasta-fecha",
  "Days Until Date Calculator",
  "fechas",
  "calculator",
  "Calculate how many days remain until a target date (or days since a past date).",
  [
    "days until date calculator",
    "how many days until",
    "calculadora dias hasta fecha",
    "cuantos dias faltan",
    "days left until",
  ],
  {
    title: "Days Until Date Calculator — count days to any date | UtiliHub",
    description: "Free days until date calculator. Pick a target date and see remaining (or past) days. Local browser calculation.",
  },
);
tool.faq.push(
  faq(
    "Does it count today?",
    "The difference is calendar days between the two dates at noon, so same-day is 0.",
  ),
);

export const DAYS_UNTIL_DATE_CALCULATOR_TOOLS = [tool];
