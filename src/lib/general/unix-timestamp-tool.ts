import { makeTool } from "./types";

export const UNIX_TIMESTAMP_TOOLS = [
  makeTool(
    "conversor-timestamp-unix",
    "Unix Timestamp Converter",
    "fechas",
    "converter",
    "Convert between Unix timestamps (seconds or milliseconds) and human-readable local dates. Shows current time and handles invalid input.",
    [
      "unix timestamp converter",
      "epoch to date",
      "timestamp to date",
      "conversor timestamp unix",
      "epoch a fecha",
      "convertir timestamp",
    ],
    {
      title: "Unix Timestamp Converter — Current epoch to local date | UtiliHub",
      description:
        "Convert Unix timestamps (seconds or ms) to local dates and back. Live current time, copy results. Runs in the browser.",
    },
  ),
];
