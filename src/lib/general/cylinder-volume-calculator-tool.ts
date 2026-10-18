import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-volumen-cilindro",
  "Cylinder Volume Calculator",
  "ciencia",
  "calculator",
  "Calculate the volume of a cylinder from its radius and height using V = π r² h.",
  [
    "cylinder volume calculator",
    "volume of a cylinder",
    "calculadora volumen cilindro",
    "volumen de un cilindro",
    "radio altura cilindro",
  ],
  {
    title: "Cylinder Volume Calculator — V = π r² h | UtiliHub",
    description: "Free cylinder volume calculator. Enter radius and height to get the volume. Local browser calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Volume = π × radius² × height."));
tool.faq.push(faq("Units?", "The volume is in the cube of the length unit (e.g., cm³ if radius and height in cm)."));

export const CYLINDER_VOLUME_CALCULATOR_TOOLS = [tool];
