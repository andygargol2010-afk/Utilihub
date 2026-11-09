import { makeTool } from "./types";

/** Gap: CSV to JSON drops Markdown. This writes a GFM table and escapes pipes. */
export const MARKDOWN_TABLE_TOOLS = [
  makeTool(
    "generador-tabla-markdown",
    "Markdown table generator",
    "texto",
    "generator",
    "Turn CSV or semicolon text into a GitHub-flavored Markdown table in the browser.",
    [
      "csv to markdown table",
      "convert csv to markdown",
      "csv a tabla markdown",
      "generador tabla markdown",
      "escape pipe markdown table",
    ],
    {
      mode: "markdown-table",
      title: "CSV to Markdown Table Generator — Local, Pipe Escape | UtiliHub",
      description:
        "Convert CSV or semicolon text into a GitHub-flavored Markdown table. Flour,500 and Water,320 become two body rows. Pipes are escaped. Nothing is uploaded.",
    },
  ),
];
