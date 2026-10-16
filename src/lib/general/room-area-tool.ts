import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-habitacion",
  "Room Area Calculator",
  "hogar",
  "calculator",
  "Calculate the floor area of a rectangular room from length and width.",
  [
    "room area calculator",
    "calculate room square footage",
    "floor area calculator",
    "calculadora de área de habitación",
    "calcular metros cuadrados habitación",
    "área de piso",
  ],
  {
    title: "Room Area Calculator — Floor Square Footage | UtiliHub",
    description: "Free room area calculator. Enter length and width to get square meters or square feet instantly. Perfect for flooring, paint, or furniture planning.",
  },
);
tool.faq.push(faq("What units should I use?", "Enter length and width in the same units (meters or feet). The result is in square units of that measure."));
tool.faq.push(faq("For irregular rooms?", "Split the room into rectangles, calculate each, then add the areas."));

export const ROOM_AREA_TOOLS = [tool];
