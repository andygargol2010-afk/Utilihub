import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-grados-a-radianes",
  "Degrees to Radians Converter",
  "conversiones",
  "converter",
  "Convert degrees to radians instantly and see the result as a multiple of π.",
  [
    "degrees to radians",
    "angle converter",
    "grados a radianes",
    "conversor de ángulos",
  ],
  {
    title: "Degrees to Radians Converter — Free Online | UtiliHub",
    description: "Free degrees to radians converter. Enter degrees to get radians and the π multiple. Browser-only, no signup.",
    summaryEs: "Convertí grados a radianes al instante y mirá el resultado como múltiplo de π.",
  },
);
tool.faq.push(
  faq(
    "What is the formula?",
    "radians = degrees × π / 180. 180° = π rad exactly.",
  ),
  faq(
    "Can I enter negative angles?",
    "Yes. Negative degrees produce negative radians (clockwise convention).",
  ),
);

export const DEGREES_TO_RADIANS_CONVERTER_TOOLS = [tool];
