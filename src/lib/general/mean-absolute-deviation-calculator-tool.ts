import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-desviacion-absoluta-media",
  "Mean Absolute Deviation Calculator",
  "matematicas",
  "calculator",
  "Calculate the mean absolute deviation (MAD) of a list of numbers.",
  [
    "mean absolute deviation calculator",
    "mad calculator",
    "average absolute deviation",
    "desviacion absoluta media",
    "calculadora desviacion absoluta",
  ],
  {
    title: "Mean Absolute Deviation (MAD) Calculator — average |x - mean| | UtiliHub",
    description: "Free mean absolute deviation calculator. Enter numbers to get MAD = (1/n) Σ |x_i - mean|. Local browser calculation, no signup.",
    summaryEs: "Calcula la desviación absoluta media (MAD) de una lista de números.",
  },
);
tool.faq.push(
  faq(
    "What is the mean absolute deviation (MAD)?",
    "MAD = (1/n) * Σ |x_i - μ| where μ is the arithmetic mean. It measures average distance from the mean using absolute values, less sensitive to outliers than standard deviation.",
  ),
);
tool.faq.push(
  faq(
    "How does MAD differ from standard deviation?",
    "Standard deviation uses squared differences (more weight to large deviations). MAD uses absolute differences and is more robust to outliers.",
  ),
);

export const MEAN_ABSOLUTE_DEVIATION_CALCULATOR_TOOLS = [tool];
