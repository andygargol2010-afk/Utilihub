import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-presion-atmosferica",
  "Atmospheric Pressure Calculator",
  "ciencia",
  "calculator",
  "Estimate atmospheric pressure at a given altitude using the barometric formula.",
  [
    "atmospheric pressure calculator",
    "calculadora presion atmosferica",
    "pressure at altitude",
    "presion atmosferica altitud",
    "barometric formula calculator",
  ],
  {
    title: "Atmospheric Pressure Calculator — By Altitude | UtiliHub",
    description: "Free atmospheric pressure calculator. Enter altitude in meters. Get estimated pressure in hPa. Browser-only.",
    summaryEs: "Estima la presión atmosférica a una altitud dada usando la fórmula barométrica.",
  },
);
tool.faq.push(
  faq(
    "How accurate is this pressure estimate?",
    "It uses a standard approximation of the barometric formula. Real pressure varies with weather.",
  ),
);

export const ATMOSPHERIC_PRESSURE_CALCULATOR_TOOLS = [tool];
