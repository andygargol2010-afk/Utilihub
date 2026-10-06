import { makeTool } from "./types";

/** Gap: ISO duration and ICS exist; this builds a 5-field crontab expression, not a calendar file. */
export const CRON_TOOLS = [
  makeTool(
    "generador-cron",
    "Cron expression generator",
    "desarrollo",
    "generator",
    "Build a 5-field cron expression, explain each field, and preview the next local runs.",
    [
      "cron expression generator",
      "crontab generator explain next run",
      "cron schedule builder",
      "generador de expresiones cron",
      "explicar crontab en español",
      "próximas ejecuciones cron",
    ],
    {
      mode: "cron",
      title: "Cron Expression Generator — Explain and Preview Runs | UtiliHub",
      description:
        "Build a 5-field cron expression locally. Explains minute, hour, day, month, and weekday, with the next runs in your local time.",
    },
  ),
];
