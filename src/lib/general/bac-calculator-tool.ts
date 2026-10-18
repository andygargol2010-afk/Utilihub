import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-bac",
  "Blood Alcohol Content Calculator",
  "utilidades",
  "calculator",
  "Estimate blood alcohol content (BAC) using the Widmark formula from drinks, weight, gender and hours.",
  [
    "bac calculator",
    "blood alcohol content calculator",
    "calculadora bac",
    "calculadora alcohol en sangre",
    "widmark formula calculator",
    "estimador de alcoholemia",
  ],
  {
    title: "BAC Calculator — Estimate blood alcohol content | UtiliHub",
    description: "Free BAC estimator. Enter number of standard drinks, body weight, gender and hours since first drink. Approximate Widmark calculation in the browser.",
  },
);
tool.faq.push(faq("How accurate is this?", "This is a rough estimate only. Real BAC depends on many factors. Never use it to decide if you can drive."));
tool.faq.push(faq("What is a standard drink?", "Approximately 14 grams of pure alcohol (one beer, one glass of wine, or one shot)." ));

export const BAC_CALCULATOR_TOOLS = [tool];
