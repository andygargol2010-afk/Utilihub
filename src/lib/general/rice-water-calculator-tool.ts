import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-agua-arroz",
  "Rice Water Calculator",
  "cocina",
  "calculator",
  "Calculate water needed for rice based on cups and ratio. Perfect for perfect fluffy rice every time.",
  [
    "rice water ratio calculator",
    "calculadora agua arroz",
    "how much water for rice",
    "rice to water ratio",
    "cantidad de agua para arroz",
  ],
  {
    title: "Rice Water Calculator — Perfect Ratio Online | UtiliHub",
    description:
      "Free rice water calculator. Enter cups of rice and ratio. Get exact water amount. Browser-only.",
    summaryEs: "Calcula el agua necesaria para el arroz según tazas y ratio. Ideal para arroz perfecto.",
  },
);
tool.faq.push(
  faq(
    "What is the standard ratio?",
    "White rice often 1.5:1 to 2:1 water:rice. Brown rice higher. Rinse and adjust.",
  ),
);

export const RICE_WATER_CALCULATOR_TOOLS = [tool];
