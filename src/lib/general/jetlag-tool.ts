import { makeTool } from "./types";

/** Gap: jet-lag-horas only subtracts UTC offsets. This builds a pre-trip bedtime shift. */
export const JETLAG_TOOLS = [
  makeTool(
    "planificador-jet-lag",
    "Jet lag sleep schedule",
    "viajes",
    "text",
    "Plan earlier or later bedtimes before a flight from the signed UTC shift, with a daily cap.",
    [
      "jet lag sleep schedule calculator",
      "eastbound westbound bedtime shift",
      "pre trip circadian plan",
      "planificador sueno jet lag",
      "horario de cama antes del vuelo",
      "desfase horario este oeste",
    ],
    {
      mode: "jetlag",
      title: "Jet Lag Sleep Schedule — East or West Bedtime Shift | UtiliHub",
      description:
        "Build a pre-trip bedtime plan from the UTC offset difference. East advances sleep; west delays it. Runs locally.",
    },
  ),
];
