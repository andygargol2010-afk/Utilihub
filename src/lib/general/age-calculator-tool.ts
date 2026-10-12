import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-edad",
  "Age Calculator",
  "fechas",
  "calculator",
  "Calculate exact age in years, months and days from birth date, plus next birthday and days lived.",
  [
    "age calculator",
    "how old am I",
    "exact age calculator",
    "birthday calculator",
    "calculadora de edad",
    "cuantos años tengo",
    "calculadora de edad exacta",
  ],
  {
    title: "Age Calculator — How old am I? Exact years, months & days | UtiliHub",
    description: "Free online age calculator. Enter your birth date to get exact age in years, months and days, next birthday and total days lived. Runs locally in the browser.",
  },
);
tool.faq.push(faq("How is exact age calculated?", "It computes the difference between today and the birth date in years, months and days, accounting for leap years and varying month lengths."));
tool.faq.push(faq("Does it work for future birth dates?", "No. Birth date must be in the past. Future dates show an error."));
tool.faq.push(faq("Is the calculation accurate for leap years?", "Yes. The tool uses standard date arithmetic that correctly handles February 29."));

export const AGE_CALCULATOR_TOOLS = [tool];
