import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-numeros-romanos",
  "Roman Numerals Converter",
  "texto",
  "converter",
  "Convert numbers to Roman numerals and Roman numerals to numbers. Instant, local, no signup.",
  [
    "roman numerals converter",
    "number to roman",
    "roman to number",
    "conversor numeros romanos",
    "numeros romanos",
    "arabic to roman",
  ],
  {
    title: "Roman Numerals Converter — Number ↔ Roman | UtiliHub",
    description:
      "Free bidirectional Roman numerals converter. Convert 1–3999 to classic Roman (IV, IX, XL…) or parse Roman back to integer. Local in the browser.",
    summaryEs: "Convierte números a romanos y romanos a números. Instantáneo, local, sin registro.",
  },
);
tool.faq.push(
  faq(
    "What range does it support?",
    "Classic Roman numerals from 1 to 3999 (MCMXCIX). Values outside this range are rejected.",
  ),
);
tool.faq.push(
  faq(
    "Does it accept subtractive notation?",
    "Yes. IV, IX, XL, XC, CD and CM are fully supported and validated by round-trip conversion.",
  ),
);

export const ROMAN_NUMERALS_CONVERTER_TOOLS = [tool];
