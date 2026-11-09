import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-depreciacion-lineal",
  "Straight-Line Depreciation Calculator",
  "finanzas",
  "calculator",
  "Calculate annual straight-line depreciation from cost, salvage value and useful life.",
  [
    "straight line depreciation calculator",
    "calculadora depreciacion lineal",
    "annual depreciation",
    "depreciacion anual",
  ],
  {
    title: "Straight-Line Depreciation Calculator | Annual Amount | UtiliHub",
    description: "Free straight-line depreciation calculator. (Cost − Salvage) ÷ Years. EN+ES.",
    summaryEs: "Calcula la depreciación lineal anual a partir del costo, valor residual y vida útil.",
  },
);
tool.faq.push(faq("What is straight-line depreciation?", "Equal annual depreciation over the useful life: (cost − salvage) / years."));
tool.faq.push(faq("What if salvage is zero?", "Then annual depreciation = cost / years. Common for many assets."));

export const STRAIGHT_LINE_DEPRECIATION_CALCULATOR_TOOLS = [tool];
