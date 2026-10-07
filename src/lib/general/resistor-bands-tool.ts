import { makeTool } from "./types";

/** Gap: Ohm's law and series/parallel exist; no EIA color-band decoder. */
export const RESISTOR_BAND_TOOLS = [
  makeTool(
    "decodificador-bandas-resistencia",
    "Resistor color code decoder",
    "ciencia",
    "text",
    "Decode 4, 5, and 6-band resistor color codes into ohms, tolerance, and temperature coefficient.",
    [
      "resistor color code calculator",
      "4 band resistor calculator",
      "5 band resistor color code",
      "codigo de colores resistencia",
      "calculadora bandas resistencia",
      "colores resistencia a ohmios",
    ],
    {
      mode: "resistor-bands",
      title: "Resistor Color Code Calculator — 4, 5 and 6 Bands | UtiliHub",
      description:
        "Decode EIA resistor color bands to ohms, tolerance, and ppm/°C. 4, 5, and 6 bands. Local only. Free in the browser.",
    },
  ),
];
