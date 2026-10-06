import { makeTool } from "./types";

/** Gap: date diff and business days exist; this emits a portable ISO 8601 duration, not a calendar span. */
export const ISO_DURATION_TOOLS = [
  makeTool(
    "generador-duracion-iso",
    "ISO 8601 duration builder",
    "fechas",
    "generator",
    "Build a portable ISO 8601 duration such as P1Y2M3DT4H or P2W, with the week-mixing rule.",
    [
      "iso 8601 duration calculator",
      "pnynmndthhmms generator",
      "iso duration weeks",
      "generador duracion iso 8601",
      "duracion p1y2m3dt4h",
      "calculadora duracion iso",
    ],
    {
      mode: "iso-duration",
      title: "ISO 8601 Duration Builder — P1Y2M3DT4H | UtiliHub",
      description:
        "Build an ISO 8601 duration from years, months, weeks, days, and time. Weeks stay exclusive of Y/M/D. Runs locally.",
    },
  ),
];
