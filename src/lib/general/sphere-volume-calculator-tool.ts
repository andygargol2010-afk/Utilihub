import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-volumen-esfera",
  "Sphere Volume Calculator",
  "ciencia",
  "calculator",
  "Calculate the volume of a sphere from its radius using V = (4/3) π r³.",
  [
    "sphere volume calculator",
    "volume of a sphere",
    "calculadora volumen esfera",
    "volumen de una esfera",
    "radio esfera volumen",
  ],
  {
    title: "Sphere Volume Calculator — V = (4/3) π r³ | UtiliHub",
    description: "Free sphere volume calculator. Enter the radius to get the volume. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Volume = (4/3) × π × radius³."));
tool.faq.push(faq("Units?", "The volume is in the cube of the radius unit (e.g., cm³ if radius in cm)."));

export const SPHERE_VOLUME_CALCULATOR_TOOLS = [tool];
