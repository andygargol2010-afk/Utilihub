import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-nota-necesaria",
  "Grade Needed Calculator",
  "educacion",
  "calculator",
  "Calculate the grade you need on the final exam or remaining work to reach a target average.",
  [
    "grade needed calculator",
    "what grade do i need to pass",
    "calculadora nota necesaria",
    "nota para aprobar",
    "final grade needed",
    "calculadora nota para pasar",
  ],
  {
    title: "Grade Needed Calculator — What Grade Do I Need to Pass? | UtiliHub",
    description: "Free grade needed calculator. Enter current average, weight remaining, and target grade to see the score required.",
  },
);
tool.faq.push(faq("How is it calculated?", "Needed = (Target × TotalWeight − Current × CurrentWeight) / RemainingWeight."));
tool.faq.push(faq("What if the needed grade is over 100?", "It means the target is unreachable with the remaining weight. Adjust target or weights."));

export const GRADE_NEEDED_CALCULATOR_TOOLS = [tool];
