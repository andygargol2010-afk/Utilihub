import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-volumen-cubo",
  "Cube Volume Calculator",
  "ciencia",
  "calculator",
  "Calculate the volume of a cube from the side length using V = side³.",
  [
    "cube volume calculator",
    "volume of a cube",
    "calculadora volumen cubo",
    "volumen del cubo",
  ],
  {
    title: "Cube Volume Calculator — side³ | UtiliHub",
    description: "Free cube volume calculator. Enter the side length to get the volume. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Volume = side × side × side."));
tool.faq.push(faq("Units?", "Volume is in cubic units of the input units."));

export const CUBE_VOLUME_CALCULATOR_TOOLS = [tool];
