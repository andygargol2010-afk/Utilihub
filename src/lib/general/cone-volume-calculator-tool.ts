import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-volumen-cono",
  "Cone Volume Calculator",
  "ciencia",
  "calculator",
  "Calculate the volume of a cone from its radius and height using V = (1/3) π r² h.",
  [
    "cone volume calculator",
    "volume of a cone",
    "calculadora volumen cono",
    "volumen de un cono",
    "radio altura cono",
  ],
  {
    title: "Cone Volume Calculator — V = (1/3) π r² h | UtiliHub",
    description: "Free cone volume calculator. Enter the radius and height to get the volume. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Volume = (1/3) × π × radius² × height."));
tool.faq.push(faq("Units?", "The volume is in the cube of the radius unit (e.g., cm³ if radius in cm)."));

export const CONE_VOLUME_CALCULATOR_TOOLS = [tool];
