import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-volumen-piramide",
  "Pyramid Volume Calculator",
  "ciencia",
  "calculator",
  "Calculate the volume of a pyramid from base area and height using V = (1/3) × base × height.",
  [
    "pyramid volume calculator",
    "volume of a pyramid",
    "calculadora volumen piramide",
    "volumen de una piramide",
  ],
  {
    title: "Pyramid Volume Calculator — V = (1/3) × base × height | UtiliHub",
    description: "Free pyramid volume calculator. Enter base area and height to get the volume. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Volume = (1/3) × base area × height."));
tool.faq.push(faq("Units?", "Volume is in cubic units of the input units (e.g., cm³ if area in cm² and height in cm)."));

export const PYRAMID_VOLUME_CALCULATOR_TOOLS = [tool];
