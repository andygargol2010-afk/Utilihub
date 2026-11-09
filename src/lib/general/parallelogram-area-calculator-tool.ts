import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-paralelogramo",
  "Parallelogram Area Calculator",
  "matematicas",
  "calculator",
  "Calculate the area of a parallelogram from base and height.",
  [
    "parallelogram area",
    "area of parallelogram",
    "calculadora de área de paralelogramo",
    "área de paralelogramo",
  ],
  {
    title: "Parallelogram Area Calculator — Base × Height | UtiliHub",
    description: "Free parallelogram area calculator. Enter base and height to get the area instantly. Browser-only, no signup.",
    summaryEs: "Calcula el área de un paralelogramo a partir de la base y la altura.",
  },
);
tool.faq.push(
  faq(
    "What is the formula for the area of a parallelogram?",
    "Area = base × height, where height is the perpendicular distance between the bases.",
  ),
  faq(
    "Does it work for rectangles and rhombi?",
    "Yes. Any parallelogram, including rectangles (right angles) and rhombi, uses the same base × height formula.",
  ),
);

export const PARALLELOGRAM_AREA_CALCULATOR_TOOLS = [tool];
