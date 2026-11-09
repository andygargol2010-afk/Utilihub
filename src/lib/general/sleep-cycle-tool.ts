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
    "calculadora de ciclo de sueño",
    "a qué hora acostarme",
    "best time to go to bed",
  ],
  {
    title: "Sleep Cycle Calculator — 90-Minute Bedtimes | UtiliHub",
    description:
      "Find bedtimes and wake times in 90-minute sleep cycles. Free, instant, browser-only. Not medical advice.",
  },
);
tool.faq.push(
  faq(
    "How does the sleep cycle calculator work?",
    "It uses 90-minute sleep cycles. Enter a wake time (or bedtime) and it suggests times that complete 4 to 6 full cycles, accounting for time to fall asleep.",
  ),
);
tool.faq.push(
  faq(
    "What is a sleep cycle?",
    "A typical sleep cycle lasts about 90 minutes. Waking at the end of a cycle often feels more refreshing than waking in the middle of deep sleep.",
  ),
);
tool.faq.push(
  faq(
    "Is this medical advice?",
    "No. It is a simple planning tool based on common 90-minute cycle estimates. Individual needs vary; consult a professional for sleep issues.",
  ),
);

export const SLEEP_CYCLE_TOOLS = [tool];
