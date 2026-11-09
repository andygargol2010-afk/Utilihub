import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-zonas-horarias",
  "Timezone Converter",
  "fechas",
  "converter",
  "Convert dates and times between different time zones. Shows current time and handles common IANA zones.",
  [
    "timezone converter",
    "conversor zonas horarias",
    "convert time zones",
    "utc to local time",
    "world clock",
    "epoch to timezone",
  ],
  {
    title: "Timezone Converter | Convert times between zones | UtiliHub",
    description: "Free timezone converter. Convert dates and times between any IANA time zones instantly in the browser. EN+ES.",
    summaryEs: "Convierte fechas y horas entre diferentes zonas horarias.",
  },
);
tool.faq.push(faq("How does the timezone converter work?", "Uses the browser's Date and Intl APIs to convert times between standard IANA time zone identifiers."));
tool.faq.push(faq("Which time zones are supported?", "Any valid IANA name such as America/New_York, Europe/Madrid, Asia/Tokyo, UTC, etc."));

export const TIMEZONE_CONVERTER_TOOLS = [tool];
