import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-volumen-cono",
  "Cone Volume Calculator",
  "ciencia",
  "calculator",
  "Calculate the volume of a right circular cone. Formula: V = (1/3) π r² h.",
  [
    "cone volume calculator",
    "calculadora volumen cono",
    "volume of a cone",
    "volumen de un cono",
    "cone volume formula",
  ],
  {
    title: "Cone Volume Calculator — V = (1/3)πr²h | UtiliHub",
    description:
      "Free cone volume calculator. Enter radius and height to get volume and base area. Runs in your browser.",
    summaryEs: "Calcula el volumen de un cono circular recto. Fórmula: V = (1/3) π r² h.",
  },
);
tool.faq.push(faq("Formula?", "V = (1/3) × π × r² × h. Radius and height must be non-negative."));
tool.faq.push(faq("Units?", "Any consistent length unit (cm, m, in). Result is in cubic units."));

export const CONE_VOLUME_CALCULATOR_TOOLS = [tool];
