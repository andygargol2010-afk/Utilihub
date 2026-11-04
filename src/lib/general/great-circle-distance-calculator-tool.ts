import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-distancia-haversine",
  "Great Circle Distance Calculator",
  "viajes",
  "calculator",
  "Calculate the great-circle (shortest) distance between two geographic coordinates using the Haversine formula.",
  [
    "great circle distance calculator",
    "haversine distance",
    "calculadora distancia circulo maximo",
    "distancia entre coordenadas",
    "lat lon distance calculator",
  ],
  {
    title: "Great Circle Distance Calculator — Haversine | UtiliHub",
    description: "Free great-circle distance calculator. Enter latitude and longitude of two points to get the shortest distance in km (and miles). Local browser calculation, no signup.",
    summaryEs: "Calcula la distancia de círculo máximo (más corta) entre dos coordenadas geográficas con la fórmula de Haversine.",
  },
);
tool.faq.push(
  faq(
    "What is great-circle distance?",
    "It is the shortest distance over the Earth's surface between two points, following the curve of the sphere. The Haversine formula approximates it with mean Earth radius 6371 km.",
  ),
);
tool.faq.push(
  faq(
    "How accurate is the result?",
    "It uses a spherical Earth model. For most travel planning it is accurate enough. Real geodesic distance (WGS84) can differ slightly for very long routes.",
  ),
);

export const GREAT_CIRCLE_DISTANCE_CALCULATOR_TOOLS = [tool];
