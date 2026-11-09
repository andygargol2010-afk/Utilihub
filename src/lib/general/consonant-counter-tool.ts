import { makeTool, faq } from "./types";

const tool = makeTool(
  "contador-consonantes",
  "Consonant Counter",
  "texto",
  "text",
  "Count the consonants in a text, ignoring vowels, spaces and punctuation.",
  [
    "consonant counter",
    "count consonants",
    "contador de consonantes",
    "contar consonantes",
  ],
  {
    title: "Consonant Counter — count consonants in text | UtiliHub",
    description: "Free consonant counter. Paste text to count consonants (EN/ES aware). Browser-only.",
  },
);
tool.faq.push(faq("What counts as a consonant?", "Any letter that is not a vowel (a, e, i, o, u, and accented variants). Spaces and punctuation are ignored."));

export const CONSONANT_COUNTER_TOOLS = [tool];
