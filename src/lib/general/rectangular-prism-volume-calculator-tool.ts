import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-volumen-prisma-rectangular",
  "Rectangular Prism Volume Calculator",
  "ciencia",
  "calculator",
  "Calculate the volume of a rectangular prism (box) from length, width and height using V = l × w × h.",
  [
    "rectangular prism volume calculator",
    "box volume calculator",
    "calculadora volumen prisma rectangular",
    "volumen de un prisma rectangular",
    "volumen de una caja",
  ],
  {
    title: "Rectangular Prism Volume Calculator — l × w × h | UtiliHub",
    description: "Free rectangular prism (box) volume calculator. Enter length, width and height to get the volume. Browser-only calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Volume = length × width × height."));
tool.faq.push(faq("Units?", "Volume is in cubic units of the input units."));

export const RECTANGULAR_PRISM_VOLUME_CALCULATOR_TOOLS = [tool];
