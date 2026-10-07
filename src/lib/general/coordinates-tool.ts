import { makeTool } from "./types";

/** Gap: travel tools cover Schengen and jet lag, not lat/lon DMS. */
export const COORDINATE_TOOLS = [
  makeTool(
    "conversor-coordenadas",
    "Coordinate converter",
    "viajes",
    "converter",
    "Convert latitude and longitude between decimal degrees and degrees-minutes-seconds.",
    [
      "decimal degrees to dms converter",
      "latitude longitude dms",
      "convertir coordenadas decimales a grados minutos segundos",
      "conversor latitud longitud dms",
      "grados decimales a dms",
    ],
    {
      mode: "coordinates",
      title: "Decimal Degrees to DMS Converter — Lat/Lon | UtiliHub",
      description:
        "Convert latitude and longitude between decimal degrees and degrees, minutes, seconds. Madrid 40.4168, -3.7038 becomes 40° 25' 0.48\" N. In the browser.",
    },
  ),
];
