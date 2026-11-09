import { makeTool } from "./types";

/** Gap: ISO duration exists. It does not map a calendar date to an ISO week, and it does not reject week 53 when the year has none. */
export const ISO_WEEK_TOOLS = [
  makeTool(
    "conversor-semana-iso",
    "ISO week converter",
    "fechas",
    "converter",
    "Convert a calendar date to an ISO 8601 week and back. A missing week 53 does not invent a date.",
    [
      "iso week date converter",
      "iso 8601 week number",
      "date to iso week",
      "conversor semana iso",
      "numero de semana iso 8601",
      "fecha a semana iso",
    ],
    {
      mode: "iso-week",
      title: "ISO Week Converter — Date to 2020-W53-5 | UtiliHub",
      description:
        "Convert a calendar date to an ISO 8601 week and an ISO week back to a date. Empty input and a week the year does not have do not invent a date. Runs in the browser.",
    },
  ),
];
