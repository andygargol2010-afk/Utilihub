import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-paralelogramo",
  "Parallelogram Area Calculator",
  "matematicas",
  "calculator",
  "Calculate the area of a parallelogram from base and height using A = base × height.",
  [
    "parallelogram area calculator",
    "area of a parallelogram",
    "calculadora area paralelogramo",
    "área del paralelogramo",
  ],
  {
    title: "Parallelogram Area Calculator — base × height | UtiliHub",
    description: "Free parallelogram area calculator. Enter base and height to get the area. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Area = base × height."));
tool.faq.push(faq("Units?", "Area is in square units of the input units."));

export const PARALLELOGRAM_AREA_CALCULATOR_TOOLS = [tool];
