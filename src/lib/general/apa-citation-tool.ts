import { makeTool } from "./types";

/** Gap: ISBN validator exists; no APA 7 reference generator. */
export const APA_CITATION_TOOLS = [
  makeTool(
    "generador-cita-apa",
    "APA 7 citation generator",
    "educacion",
    "generator",
    "Build an APA 7 reference for a webpage, book, or journal article, including missing dates and multiple authors.",
    [
      "apa citation generator",
      "apa 7 reference generator",
      "cite a webpage apa",
      "generador de citas apa",
      "generador referencias apa 7",
      "citar pagina web apa",
    ],
    {
      mode: "apa-citation",
      title: "APA 7 Citation Generator — Webpage, Book, Journal | UtiliHub",
      description:
        "Generate an APA 7th reference for a webpage, book, or journal. Initials, n.d., and up to 20 authors stay in the browser.",
    },
  ),
];
