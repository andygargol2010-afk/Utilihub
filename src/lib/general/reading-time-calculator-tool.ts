import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tiempo-lectura",
  "Reading Time Calculator",
  "productividad",
  "calculator",
  "Estimate reading time from word count and reading speed (words per minute).",
  [
    "reading time calculator",
    "how long to read",
    "calculadora tiempo lectura",
    "tiempo de lectura",
    "words per minute reading time",
  ],
  {
    title: "Words to Minutes — Reading Time Calculator | UtiliHub",
    description:
      "Convert word count to reading or speaking time at your WPM. Free estimate for posts, speeches, books and scripts.",
  },
);
tool.faq.push(
  faq(
    "What is a typical reading speed?",
    "Average adult reading speed is about 200–250 words per minute for non-technical text.",
  ),
);
tool.faq.push(
  faq(
    "How is time calculated?",
    "Minutes = word count ÷ words per minute. Result is shown in minutes and seconds.",
  ),
);

export const READING_TIME_CALCULATOR_TOOLS = [tool];
