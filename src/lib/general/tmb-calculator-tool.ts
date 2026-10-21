import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tmb",
  "BMR Calculator",
  "salud",
  "calculator",
  "Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.",
  [
    "bmr calculator",
    "basal metabolic rate",
    "calculadora tmb",
    "tasa metabolica basal",
    "mifflin st jeor",
  ],
  {
    title: "BMR Calculator — Tasa Metabólica Basal | UtiliHub",
    description: "Free BMR calculator. Enter age, weight, height and sex to get your basal metabolic rate in kcal/day. Instant, no signup.",
    operation: "tmb",
    fields: ["Age (years)", "Weight (kg)", "Height (cm)", "Sex (1=male, 0=female)"],
  },
);
tool.faq.push(faq("What is BMR?", "Basal Metabolic Rate is the number of calories your body needs at rest to maintain basic functions."));

export const TMB_CALCULATOR_TOOLS = [tool];
