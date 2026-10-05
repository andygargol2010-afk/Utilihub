import { makeTool } from "./types";

/** Gap: temperatura-cientifica converts scales. This estimates feels-like heat index and wind chill. */
export const HEAT_INDEX_TOOLS = [
  makeTool(
    "calculadora-sensacion-termica",
    "Heat index and wind chill",
    "ciencia",
    "formula",
    "Estimate feels-like temperature from air temperature plus humidity (heat index) or wind (wind chill), in Celsius or Fahrenheit.",
    [
      "heat index calculator",
      "wind chill calculator",
      "feels like temperature",
      "humidex vs heat index",
      "NWS heat index",
      "calculadora de sensacion termica",
      "indice de calor",
      "sensacion termica por viento",
      "wind chill en celsius",
      "calculadora de indice de calor",
    ],
    {
      mode: "heat-index",
      title: "Heat Index and Wind Chill Calculator | UtiliHub",
      description:
        "Calculate heat index from temperature and humidity, or wind chill from temperature and wind. Celsius or Fahrenheit. Free, in the browser.",
    },
  ),
];
