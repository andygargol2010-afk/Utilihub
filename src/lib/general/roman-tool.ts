import { makeTool, faq } from "./types";

/** Gap: bases numericas convert binary. This converts 1-3999 with subtractive Roman form only. */
const tool = makeTool(
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
);
tool.faq.push(
  faq(
    "How do I write a number in Roman numerals?",
    "Use the subtractive form: build the number from the values 1000 (M), 900 (CM), 500 (D), 400 (CD), 100 (C), 90 (XC), 50 (L), 40 (XL), 10 (X), 9 (IX), 5 (V), 4 (IV), and 1 (I), taking the largest that fits at each step. Example: 2026 = MM + XX + VI = MMXXVI.",
  ),
);
tool.faq.push(
  faq(
    "Why are IIII or IC rejected?",
    "Standard Roman numerals only allow the subtractive pairs IV, IX, XL, XC, CD, and CM. A symbol like I or X can repeat at most three times in a row, and only the pairs listed above can subtract. The tool only accepts the canonical form, so 4 must be IV and 99 must be XCIX.",
  ),
);
tool.faq.push(
  faq(
    "What is the valid range?",
    "This converter works from 1 to 3999, the range covered by standard subtractive Roman numerals without needing an overline (vinculum) for larger values.",
  ),
);
export const ROMAN_TOOLS = [tool];
