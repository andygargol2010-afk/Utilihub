import { makeTool } from "./types";

/** Gap: no dedicated classic Lorem Ipsum generator with paragraph/word control. */
export const LOREM_TOOLS = [
  makeTool(
    "generador-lorem-ipsum",
    "Lorem Ipsum Generator",
    "generadores",
    "generator",
    "Generate placeholder Lorem Ipsum text with a chosen number of paragraphs or words. Classic Latin dummy text. Empty or zero counts do not invent text.",
    [
      "lorem ipsum generator",
      "dummy text generator",
      "placeholder text generator",
      "generador lorem ipsum",
      "texto de relleno lorem",
      "generador de texto placeholder",
    ],
    {
      title: "Lorem Ipsum Generator — 3 paragraphs or 50 words | UtiliHub",
      description:
        "Generate classic Lorem Ipsum placeholder text. Choose paragraphs or words. Empty, zero, and negative counts do not invent text. Runs in the browser.",
    },
  ),
];
