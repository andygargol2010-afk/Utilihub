import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-csv-json",
  "CSV to JSON Converter",
  "desarrollo",
  "converter",
  "Convert CSV data to a JSON array of objects. Paste spreadsheet exports and get ready-to-use JSON.",
  [
    "csv to json",
    "convert csv to json",
    "csv to json converter",
    "csv json online",
    "convertidor csv a json",
    "csv a json",
  ],
  {
    title: "CSV to JSON Converter — Free Online | UtiliHub",
    description:
      "Free online CSV to JSON converter. Paste CSV and get a JSON array of objects instantly in your browser. No signup, local processing.",
  },
);
tool.faq.push(
  faq(
    "Does it support quoted fields with commas?",
    "Yes, basic quoted fields are handled. Nested or complex quotes may need cleanup.",
  ),
);
tool.faq.push(
  faq(
    "Is my data uploaded?",
    "No. Conversion runs entirely in your browser.",
  ),
);
tool.faq.push(
  faq(
    "What delimiter does it use?",
    "You can choose comma, semicolon, or tab. First row is treated as headers.",
  ),
);

export const CSV_TO_JSON_TOOLS = [tool];
