import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-palabras-por-minuto",
  "Words Per Minute Calculator",
  "productividad",
  "calculator",
  "Calculate typing or reading speed in words per minute (WPM).",
  [
    "wpm calculator",
    "calculadora palabras por minuto",
    "words per minute",
    "typing speed calculator",
    "wpm typing test",
  ],
  {
    title: "Words Per Minute Calculator — Free WPM Tool | UtiliHub",
    description: "Calculate your WPM from words typed or read and time taken. Free, instant, browser-only.",
    summaryEs: "Calcula tu velocidad de escritura o lectura en palabras por minuto (PPM).",
  },
);
tool.faq.push(faq("What is WPM?", "Words Per Minute. Common measure of typing or reading speed."));
tool.faq.push(faq("Average WPM?", "Average typing is ~40 WPM; professional 60–80+. Reading is higher."));

export const WORDS_PER_MINUTE_CALCULATOR_TOOLS = [tool];
