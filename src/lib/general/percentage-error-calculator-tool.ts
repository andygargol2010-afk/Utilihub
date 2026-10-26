import { makeTool } from "./types";

const tool = makeTool(
  "calculadora-error-porcentual",
  "Percentage Error Calculator",
  "matematicas",
  "calculator",
  "Calculate percentage error between experimental and theoretical values.",
  [
    "percentage error calculator",
    "percent error calculator",
    "calculadora error porcentual",
    "error porcentual experimental teórico",
  ],
  {
    title: "Percentage Error Calculator | UtiliHub",
    description: "Free percentage error calculator. Experimental and theoretical values. Browser-only.",
    summaryEs: "Calcula el error porcentual entre valor experimental y teórico.",
  },
);

export const PERCENTAGE_ERROR_CALCULATOR_TOOLS = [tool];
