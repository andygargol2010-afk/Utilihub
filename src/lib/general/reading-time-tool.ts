import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tiempo-lectura",
  "Reading Time Calculator",
  "texto",
  "calculator",
  "Estimate reading or speaking time from word count or pasted text.",
  [
    "reading time calculator",
    "how long to read",
    "words to minutes",
    "speaking time calculator",
    "calculadora de tiempo de lectura",
    "cuanto tarda en leerse",
    "tiempo de lectura",
  ],
  {
    title: "Reading Time Calculator \u2014 How long to read or speak text | UtiliHub",
    description: "Free reading time calculator. Paste text or enter word count to estimate minutes to read or speak at your pace. Runs locally in the browser.",
  },
);
tool.faq.push(faq("How is reading time calculated?", "It divides the word count by your selected words-per-minute (WPM) rate. Typical silent reading is 200\u2013250 WPM; speaking is often 130\u2013150 WPM."));
tool.faq.push(faq("Can I paste any text?", "Yes. The tool counts words locally in your browser and never uploads the content."));
tool.faq.push(faq("What WPM should I use?", "Use 200\u2013250 for average silent reading, 130\u2013150 for speaking or presentations, or enter your own measured pace."));

export const READING_TIME_TOOLS = [tool];
