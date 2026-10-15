import { makeTool, faq } from "./types";

const tool = makeTool(
  "ordenador-lineas-texto",
  "Line Sorter & Duplicate Remover",
  "texto",
  "text",
  "Sort lines alphabetically, remove duplicates, and trim whitespace from any text. Instant local processing.",
  [
    "sort lines online",
    "remove duplicate lines",
    "line sorter",
    "ordenar líneas de texto",
    "eliminar líneas duplicadas",
    "limpiar texto líneas",
  ],
  {
    title: "Line Sorter & Duplicate Remover — Clean Text Lines Online | UtiliHub",
    description:
      "Free online tool to sort text lines alphabetically, remove duplicate lines, and trim extra spaces. Runs instantly in your browser, no upload.",
  },
);
tool.faq.push(
  faq(
    "Does it keep the original order if I only remove duplicates?",
    "Yes. When sort is off, duplicates are removed while preserving the first occurrence order.",
  ),
);
tool.faq.push(
  faq(
    "What about empty lines?",
    "Empty or whitespace-only lines can be removed with the trim and clean options.",
  ),
);

export const LINE_SORTER_TOOLS = [tool];
