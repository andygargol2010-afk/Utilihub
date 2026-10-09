import { makeTool } from "./types";

/** Gap: wind chill estimates feels-like cold. It does not map a wind speed to a WMO Beaufort force. */
export const BEAUFORT_TOOLS = [
  makeTool(
    "conversor-escala-beaufort",
    "Beaufort wind scale converter",
    "ciencia",
    "converter",
    "Convert wind speed in m/s, km/h, knots, or mph to a WMO Beaufort force. Empty or negative speeds do not invent a force.",
    [
      "beaufort scale calculator",
      "wind speed to beaufort",
      "beaufort force converter",
      "conversor escala beaufort",
      "velocidad del viento a beaufort",
      "escala de beaufort nudos",
    ],
    {
      mode: "beaufort",
      title: "Beaufort Scale Converter — 10 m/s to Force 5 | UtiliHub",
      description:
        "Convert wind speed in m/s, km/h, knots, or mph to a WMO Beaufort force 0–12. Empty, invalid, and negative speeds do not invent a force. Runs in the browser.",
    },
  ),
];
