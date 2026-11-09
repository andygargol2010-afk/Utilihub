import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-zona-horaria",
  "Timezone Converter",
  "fechas",
  "converter",
  "Convert times between time zones instantly in the browser. Supports common zones with daylight saving awareness.",
  [
    "timezone converter",
    "convert time zones",
    "time zone calculator",
    "conversor zona horaria",
    "convertir zona horaria",
    "calculadora husos horarios",
  ],
  {
    title: "Timezone Converter — Convert Times Between Zones | UtiliHub",
    description:
      "Free online timezone converter. Enter a time and convert it between popular time zones. Runs locally, no signup.",
  },
);
tool.faq.push(
  faq(
    "Does it account for daylight saving time?",
    "Yes, the conversion uses the browser's Intl and Date APIs which respect current DST rules for the selected zones.",
  ),
);
tool.faq.push(
  faq(
    "Which time zones are supported?",
    "Common ones: UTC, America/New_York, America/Los_Angeles, Europe/London, Europe/Paris, Asia/Tokyo, America/Argentina/Buenos_Aires, Australia/Sydney, and more.",
  ),
);

export const TIMEZONE_TOOLS = [tool];
