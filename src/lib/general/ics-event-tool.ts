import { makeTool } from "./types";

/** Gap: date math tools do not emit an importable calendar file. */
export const ICS_EVENT_TOOLS = [
  makeTool(
    "generador-ics",
    "ICS calendar event generator",
    "productividad",
    "generator",
    "Build a downloadable .ics event with all-day dates, floating or UTC times, a weekly count, and an optional reminder.",
    [
      "ics file generator",
      "create ics calendar event",
      "download ics invite",
      "all day ics end date",
      "weekly rrule ics",
      "generador ics",
      "crear archivo ics",
      "evento calendario ics",
      "ics todo el dia",
      "recordatorio ics",
    ],
    {
      mode: "ics-generator",
      title: "ICS Event Generator — Download a Calendar File | UtiliHub",
      description:
        "Create an .ics event with all-day exclusive end dates, floating or UTC times, weekly repeats, and a reminder. Runs in the browser.",
    },
  ),
];
