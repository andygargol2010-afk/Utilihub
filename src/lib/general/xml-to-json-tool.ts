import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-xml-json",
  "XML to JSON Converter",
  "desarrollo",
  "converter",
  "Convert XML to JSON. Paste XML and get a structured JSON object instantly in your browser.",
  [
    "xml to json",
    "convert xml to json",
    "xml to json converter",
    "xml json online",
    "convertidor xml a json",
    "xml a json",
  ],
  {
    title: "XML to JSON Converter — Free Online | UtiliHub",
    description:
      "Free online XML to JSON converter. Paste XML and get a JSON object instantly in your browser. No signup, local processing.",
  },
);
tool.faq.push(
  faq(
    "Does it handle attributes and text content?",
    "Yes, attributes become keys with @ prefix, and text content is under #text. Nested elements are arrays or objects.",
  ),
);
tool.faq.push(
  faq(
    "Is my data uploaded?",
    "No. Conversion runs entirely in your browser using DOMParser.",
  ),
);
tool.faq.push(
  faq(
    "What about namespaces or complex XML?",
    "Basic XML is supported. Namespaces and CDATA may appear as text; very large files may be slow.",
  ),
);

export const XML_TO_JSON_TOOLS = [tool];
