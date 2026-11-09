import { makeTool } from "./types";

const tool = makeTool(
  "conversor-texto-caso",
  "Text Case Converter",
  "texto",
  "converter",
  "Convert text between uppercase, lowercase, title case and sentence case.",
  [
    "text case converter",
    "uppercase lowercase",
    "title case converter",
    "conversor mayusculas minusculas",
    "convertir texto caso",
  ],
  {
    title: "Text Case Converter | UtiliHub",
    description: "Free text case converter: upper, lower, title and sentence case. Instant, browser-only.",
    summaryEs: "Convierte texto entre mayúsculas, minúsculas, título y oración.",
  },
);

export const TEXT_CASE_CONVERTER_TOOLS = [tool];
