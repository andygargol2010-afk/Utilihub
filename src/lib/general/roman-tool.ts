import { makeTool } from "./types";

/** Gap: bases numericas convert binary. This converts 1-3999 with subtractive Roman form only. */
export const ROMAN_TOOLS = [
  makeTool(
    "conversor-numeros-romanos",
    "Roman Numeral Converter",
    "educacion",
    "converter",
    "Convert 1 to 3999 into standard Roman numerals and decode subtractive forms back to numbers.",
    [
      "roman numeral converter",
      "number to roman numerals",
      "roman to number",
      "subtractive roman numerals",
      "conversor numeros romanos",
      "numeros romanos online",
      "decimal a romano",
      "romano a decimal",
    ],
    {
      mode: "roman-numeral",
      title: "Roman Numeral Converter 1–3999 Free Online | UtiliHub",
      description:
        "Convert numbers to Roman numerals and back (1–3999, subtractive). Free, local, no signup.",
    },
  ),
];
