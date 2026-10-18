import { makeTool, faq } from "./types";

const tool = makeTool(
  "contador-vocales",
  "Vowel Counter",
  "texto",
  "calculator",
  "Count vowels (a, e, i, o, u) in text, case-insensitive.",
  [
    "vowel counter",
    "count vowels in text",
    "contador de vocales",
    "contar vocales",
  ],
  {
    title: "Vowel Counter — Count aeiou in Text | UtiliHub",
    description: "Free vowel counter. Paste text to count vowels. Browser-only.",
  },
);
tool.faq.push(faq("Which letters count?", "A, E, I, O, U (case-insensitive). Y is not counted as a vowel here."));
tool.faq.push(faq("Empty text?", "Empty or no vowels returns 0."));

export const VOWEL_COUNTER_TOOLS = [tool];
