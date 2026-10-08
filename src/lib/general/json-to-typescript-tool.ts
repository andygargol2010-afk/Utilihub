import { makeTool } from "./types";

/** Gap: JSON to CSV parses rows. This infers a TypeScript interface and quotes bad keys. */
export const JSON_TS_TOOLS = [
  makeTool(
    "json-a-typescript",
    "JSON to TypeScript",
    "desarrollo",
    "generator",
    "Turn a JSON sample into TypeScript interfaces in the browser.",
    [
      "json to typescript",
      "json to interface",
      "json a typescript",
      "generador interfaz typescript",
      "convert json to interface",
    ],
    {
      mode: "json-to-typescript",
      title: "JSON to TypeScript Interface Generator — Local | UtiliHub",
      description:
        "Paste a JSON sample and get TypeScript interfaces. {\"id\":1,\"name\":\"Ada\"} becomes an Item interface. Nested objects and null arrays stay typed. Nothing is uploaded.",
    },
  ),
];
