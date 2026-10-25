import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-rectangular",
  "Rectangular Area Calculator",
  "hogar",
  "calculator",
  "Calculate area of a rectangular room or space from length and width.",
  [
    "rectangular area calculator",
    "room area calculator",
    "calculadora area rectangular",
    "area habitacion largo ancho",
    "calculate square meters room",
  ],
  {
    title: "Rectangular Area Calculator — Length × Width | UtiliHub",
    description: "Free rectangular area calculator for rooms. Enter length and width to get square meters or feet. Browser-only.",
    summaryEs: "Calcula el área rectangular (habitación) a partir del largo y el ancho.",
  },
);
tool.faq.push(
  faq(
    "How do I calculate rectangular area?",
    "Area = length × width. Select meters or feet; result uses the matching square unit.",
  ),
);

export const ROOM_AREA_CALCULATOR_TOOLS = [tool];
