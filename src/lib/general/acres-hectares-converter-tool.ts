import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-acres-hectareas",
  "Acres to Hectares Converter",
  "conversiones",
  "converter",
  "Convert acres to hectares and hectares to acres instantly.",
  [
    "acres to hectares",
    "hectares to acres",
    "conversor acres hectareas",
    "land area converter",
    "acreage calculator",
  ],
  {
    title: "Acres to Hectares Converter — Land Area Calculator | UtiliHub",
    description: "Free acres ↔ hectares converter. Instant bidirectional land area conversion for real estate, farming and geography. Local browser calculation.",
    summaryEs: "Convierte acres a hectáreas y hectáreas a acres de forma instantánea.",
  },
);
tool.faq.push(faq("How many hectares in an acre?", "1 acre equals approximately 0.404686 hectares."));
tool.faq.push(faq("How many acres in a hectare?", "1 hectare equals approximately 2.471054 acres."));

export const ACRES_HECTARES_CONVERTER_TOOLS = [tool];
