import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-dias-habiles",
  "Business Days Calculator",
  "fechas",
  "calculator",
  "Calculate the number of business days (working days) between two dates, excluding weekends and optional holidays.",
  [
    "business days calculator",
    "working days between dates",
    "calculadora dias habiles",
    "dias laborables entre fechas",
    "exclude weekends calculator",
    "business day count",
  ],
  {
    title: "Business Days Calculator — Working Days Between Dates | UtiliHub",
    description: "Free business days calculator. Count working days between two dates excluding weekends and custom holidays. Instant results in browser.",
  },
);
tool.faq.push(faq("What are business days?", "Business days are weekdays (Monday to Friday) excluding weekends and any holidays you specify."));
tool.faq.push(faq("How are holidays handled?", "Enter holiday dates one per line in YYYY-MM-DD format. They are excluded from the count."));
tool.faq.push(faq("Is the end date inclusive?", "Yes, if the end date is a business day it is included in the count."));

export const BUSINESS_DAYS_TOOLS = [tool];
