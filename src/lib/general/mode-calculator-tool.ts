import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-moda",
  "Mode Calculator",
  "educacion",
  "calculator",
  "Calculate the mode (most frequent value) of a list of numbers.",
  [
    "mode calculator",
    "calculate mode",
    "calculadora moda",
    "moda estadistica",
    "most frequent number",
  ],
  {
    title: "Mode Calculator — Most Frequent Value | UtiliHub",
    description: "Free mode calculator. Enter numbers to find the most frequent value(s). Handles multimodal lists. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the mode?", "The mode is the number that appears most often in a data set. A set can have more than one mode."));
tool.faq.push(faq("What if all numbers are unique?", "There is no mode. The tool will indicate that."));

export const MODE_CALCULATOR_TOOLS = [tool];
