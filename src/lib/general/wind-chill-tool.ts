import { makeTool } from "./types";

/** Gap: heat index covers hot humidity; this is the cold-wind NWS formula. */
export const WIND_CHILL_TOOLS = [
  makeTool(
    "calculadora-enfriamiento-viento",
    "Wind chill calculator",
    "ciencia",
    "science",
    "Estimate NWS wind chill from air temperature and wind speed, in °C or °F and km/h or mph.",
    [
      "wind chill calculator",
      "nws wind chill formula",
      "wind chill celsius",
      "frostbite time wind chill",
      "calculadora wind chill",
      "enfriamiento por viento",
      "sensacion termica por viento",
      "formula nws viento",
    ],
    {
      mode: "wind-chill",
      title: "Wind Chill Calculator — NWS Formula in °F or °C | UtiliHub",
      description:
        "Calculate NWS 2001 wind chill from air temperature and wind speed. Handles °C/°F and km/h/mph, calm wind, and frostbite bands.",
    },
  ),
];