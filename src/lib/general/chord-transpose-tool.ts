import { makeTool } from "./types";

/** Gap: text has Morse, not a chord-chart transposer with slash bass and solfege. */
export const CHORD_TRANSPOSE_TOOLS = [
  makeTool(
    "transportador-acordes",
    "Chord transposer",
    "conversiones",
    "text",
    "Transpose guitar and piano chord charts by semitones, with slash bass, capo hint, and Do-Re-Mi.",
    [
      "chord transposer",
      "transpose chords",
      "capo chord chart",
      "transportar acordes",
      "cambiador de tono guitarra",
      "acordes do re mi",
    ],
    {
      mode: "chord-transpose",
      title: "Chord Transposer — Semitones, Capo, Do Re Mi | UtiliHub",
      description:
        "Transpose a chord chart by semitones. Slash bass, flats or sharps, capo hint, and Spanish note names. Runs in the browser.",
    },
  ),
];
