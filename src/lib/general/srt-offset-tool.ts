import { makeTool } from "./types";

/** Gap: Morse and Braille rewrite glyphs. Neither shifts SubRip cue times. */
export const SRT_OFFSET_TOOLS = [
  makeTool(
    "desfase-srt",
    "SRT subtitle offset",
    "texto",
    "converter",
    "Shift SubRip cue start and end times by milliseconds without rewriting the dialogue.",
    [
      "srt time shift",
      "subtitle delay calculator",
      "offset srt timestamps",
      "delay subtitles srt",
      "desfasar subtitulos srt",
      "retrasar subtitulos",
      "adelantar subtitulos srt",
      "calculadora delay srt",
    ],
    {
      mode: "srt-offset",
      title: "SRT Subtitle Offset — Delay or Advance Cues | UtiliHub",
      description:
        "Shift SubRip start and end times by milliseconds. Empty or broken cues do not invent a file. Runs locally in the browser.",
    },
  ),
];
