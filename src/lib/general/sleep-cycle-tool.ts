import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ciclo-sueno",
  "Sleep Cycle Calculator",
  "productividad",
  "calculator",
  "Calculate recommended bedtimes or wake times based on 90-minute sleep cycles.",
  [
    "sleep cycle calculator",
    "bedtime calculator",
    "sleep calculator",
    "calculadora de ciclo de sue\u00f1o",
    "a qu\u00e9 hora acostarme",
    "best time to go to bed",
  ],
  {
    title: "Sleep Cycle Calculator \u2014 Find best bedtime and wake time | UtiliHub",
    description: "Free sleep cycle calculator. Enter your desired wake time or bedtime to get recommendations based on 90-minute cycles. Runs in the browser.",
  },
);
tool.faq.push(faq("How does the sleep cycle calculator work?", "It uses 90-minute sleep cycles. Enter a wake time (or bedtime) and it suggests times that complete 4 to 6 full cycles, accounting for time to fall asleep."));
tool.faq.push(faq("What is a sleep cycle?", "A typical sleep cycle lasts about 90 minutes. Waking at the end of a cycle often feels more refreshing than waking in the middle of deep sleep."));
tool.faq.push(faq("Is this medical advice?", "No. It is a simple planning tool based on common 90-minute cycle estimates. Individual needs vary; consult a professional for sleep issues."));

export const SLEEP_CYCLE_TOOLS = [tool];
