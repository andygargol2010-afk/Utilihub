import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-dosis-cafe",
  "Coffee Dose Calculator",
  "hogar",
  "calculator",
  "Calculate coffee dose in grams for a number of people based on standard ratio.",
  [
    "coffee dose calculator",
    "calculadora dosis cafe",
    "grams coffee per person",
    "how much coffee for people",
  ],
  {
    title: "Coffee Dose Calculator | Grams per Person | UtiliHub",
    description: "Free coffee dose calculator. Calculate how many grams of coffee for N people. Standard 15g per person. EN+ES.",
    summaryEs: "Calcula la dosis de café en gramos para un número de personas.",
  },
);
tool.faq.push(faq("What is the standard dose?", "Typically 15 grams of coffee per person for a standard cup or pour-over."));
tool.faq.push(faq("Can I change the grams per person?", "Yes. Adjust the g/person field for stronger or lighter coffee."));

export const COFFEE_DOSE_CALCULATOR_TOOLS = [tool];
