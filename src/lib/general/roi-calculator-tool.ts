import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-roi",
  "ROI Calculator",
  "finanzas",
  "calculator",
  "Calculate return on investment (ROI) from cost and gain. Formula: ((Gain − Cost) / Cost) × 100.",
  [
    "roi calculator",
    "return on investment calculator",
    "calculadora roi",
    "calculadora retorno de inversion",
    "roi",
  ],
  {
    title: "ROI Calculator — Return on Investment % | UtiliHub",
    description: "Free ROI calculator. Enter investment cost and final gain to get return on investment percentage. Runs in your browser.",
  },
);
tool.faq.push(faq("What is ROI?", "Return on Investment measures the profitability of an investment as a percentage of the cost."));
tool.faq.push(faq("Formula?", "ROI % = ((Gain − Cost) / Cost) × 100."));

export const ROI_CALCULATOR_TOOLS = [tool];
