import { makeTool, faq } from "./types";

const tool = makeTool(
  "contador-palabras",
  "Word Counter",
  "texto",
  "text",
  "Count words, characters, sentences, and paragraphs in any text. Instant results in the browser.",
  [
    "word counter",
    "character count",
    "word count tool",
    "contador de palabras",
    "contador de caracteres",
  ],
  {
    title: "Word Counter — Words, characters, sentences | UtiliHub",
    description: "Free online word counter. Paste or type text to count words, characters (with and without spaces), sentences, and paragraphs. Runs locally.",
  },
);
tool.faq.push(faq("How are words counted?", "Words are sequences separated by whitespace. Punctuation is included with the word."));
tool.faq.push(faq("Does it count special characters?", "Yes. Characters with spaces include everything. Without spaces removes all whitespace."));
tool.faq.push(faq("Is the text sent anywhere?", "No. Counting happens entirely in your browser."));

export const WORD_COUNTER_TOOLS = [tool];
