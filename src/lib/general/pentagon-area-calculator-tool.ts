import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-pentagono",
  "Pentagon Area Calculator",
  "matematicas",
  "calculator",
  "Calculate the area of a regular pentagon from side length.",
  [
    "pentagon area calculator",
    "area of regular pentagon",
    "calculadora area pentagono",
    "area pentagono regular",
  ],
  {
    title: "Regular Pentagon Area Calculator | UtiliHub",
    description: "Free calculator for the area of a regular pentagon. Enter side length. Local browser calculation.",
  },
);
tool.faq.push(faq("Formula?", "Area = (1/4) * sqrt(5*(5+2*sqrt(5))) * side^2"));

export const PENTAGON_AREA_CALCULATOR_TOOLS = [tool];
