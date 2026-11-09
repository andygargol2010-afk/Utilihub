import { makeTool } from "./types";

/** Gap: braille maps cells. This maps ITU Morse both ways and keeps word slashes. */
export const MORSE_TOOLS = [
  makeTool(
    "traductor-morse",
    "Morse code translator",
    "texto",
    "converter",
    "Translate text to ITU Morse and Morse back to text, with word slashes, in the browser.",
    [
      "morse code translator",
      "text to morse",
      "morse decoder",
      "itu morse code",
      "traductor codigo morse",
      "texto a morse",
      "decodificar morse",
      "codigo morse internacional",
    ],
    {
      mode: "morse-translator",
      title: "Morse Code Translator — Text to ITU Morse | UtiliHub",
      description:
        "Convert letters, digits, and common punctuation to ITU Morse and decode Morse back to text. Word gaps stay as slashes. Nothing leaves the browser.",
    },
  ),
];
