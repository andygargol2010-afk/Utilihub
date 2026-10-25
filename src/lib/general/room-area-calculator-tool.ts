import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-habitacion",
  "Room Area Calculator",
  "hogar",
  "calculator",
  "Calculate room area from length and width in meters or feet.",
  [
    "room area calculator",
    "room square meters",
    "calculadora area habitacion",
    "metros cuadrados habitacion",
    "calculate room size",
  ],
  {
    title: "Room Area Calculator — Length × Width | UtiliHub",
    description: "Free room area calculator. Enter length and width to get square meters or square feet. Browser-only.",
    summaryEs: "Calcula el área de una habitación a partir del largo y el ancho.",
  },
);
tool.faq.push(
  faq(
    "How do I calculate room area?",
    "Area = length × width. Choose meters or feet; the result is shown in the matching square unit.",
  ),
);

export const ROOM_AREA_CALCULATOR_TOOLS = [tool];
