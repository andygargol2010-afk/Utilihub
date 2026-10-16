import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-nota-final",
  "Final Grade Calculator",
  "educacion",
  "calculator",
  "Calculate the score you need on your final exam to reach a desired overall grade.",
  [
    "final grade calculator",
    "what grade do I need on the final",
    "needed score on final exam",
    "calculadora nota final",
    "qué nota necesito en el final",
    "calculadora de nota necesaria",
  ],
  {
    title: "Final Grade Calculator — What Score Do I Need? | UtiliHub",
    description: "Free final grade calculator. Enter current grade, final weight, and desired grade to find the score needed on your exam. Instant browser tool.",
  },
);
tool.faq.push(faq("How is the needed score calculated?", "Needed = (Desired − Current × (1 − Weight)) / Weight. Weight is the fraction the final is worth (e.g. 0.3 for 30%)."));
tool.faq.push(faq("What if the result is over 100?", "It means the desired grade is not reachable with that final weight. Consider a lower target or check the numbers."));

export const FINAL_GRADE_TOOLS = [tool];
