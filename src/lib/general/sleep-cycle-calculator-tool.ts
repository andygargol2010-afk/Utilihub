import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ciclo-sueno",
  "Sleep Cycle Calculator",
  "salud",
  "calculator",
  "Calculate optimal bedtime or wake-up time based on 90-minute sleep cycles.",
  [
    "sleep cycle calculator",
    "bedtime calculator",
    "calculadora ciclo sueno",
    "calculadora horas sueno",
    "90 minute sleep cycles",
  ],
  {
    title: "Sleep Cycle Calculator — Optimal Bedtime & Wake Time | UtiliHub",
    description: "Free sleep cycle calculator. Find the best bedtime or wake-up time using 90-minute cycles. Includes fall-asleep buffer. Local browser calculation.",
    summaryEs: "Calcula la hora óptima de acostarse o despertar basada en ciclos de sueño de 90 minutos.",
  },
);
tool.faq.push(faq("What is a sleep cycle?", "A typical sleep cycle lasts about 90 minutes and includes light sleep, deep sleep, and REM. Waking at the end of a cycle feels more refreshed."));
tool.faq.push(faq("Why add 15 minutes?", "Most people take about 15 minutes to fall asleep. The calculator includes this buffer."));

export const SLEEP_CYCLE_CALCULATOR_TOOLS = [tool];
