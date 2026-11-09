import { makeTool } from "./types";

/** Gap: wind chill and heat index exist; this adds incoherent sound levels, not temperatures. */
export const DECIBEL_TOOLS = [
  makeTool(
    "sumador-decibelios",
    "Decibel level adder",
    "ciencia",
    "calculator",
    "Add incoherent sound levels in dB. Two equal sources are about +3 dB, not double.",
    [
      "add decibels calculator",
      "combine sound levels dB",
      "sumar decibelios",
      "calculadora suma de dB",
      "decibel addition not average",
    ],
    {
      mode: "decibel",
      title: "Decibel Adder — Combine Sound Levels in dB | UtiliHub",
      description:
        "Add sound levels the right way: 60 dB + 60 dB is 63.01 dB, and 70 dB + 60 dB is 70.41 dB. Not a linear sum. In the browser.",
    },
  ),
];
