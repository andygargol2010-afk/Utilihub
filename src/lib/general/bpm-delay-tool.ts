import { makeTool } from "./types";

/** Chord transpose changes pitch. This maps BPM to pedal delay times and stays in the browser. */
export const BPM_DELAY_TOOLS = [
  makeTool(
    "convertidor-delay-bpm",
    "BPM delay converter",
    "conversiones",
    "converter",
    "Convert BPM to note-length delay in milliseconds, including dotted and triplet values.",
    [
      "bpm to ms",
      "bpm delay calculator",
      "bpm to milliseconds",
      "dotted eighth delay",
      "convertidor delay bpm",
      "bpm a milisegundos",
      "calculadora delay bpm",
      "tresillo delay milisegundos",
    ],
    {
      mode: "bpm-delay",
      title: "BPM to Milliseconds Delay Converter | UtiliHub",
      description:
        "Type 120 BPM and read a 500 ms quarter note, 375 ms dotted eighth, and 166.7 ms eighth triplet. Nothing is uploaded.",
    },
  ),
];
