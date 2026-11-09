import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-area-elipse",
  "Ellipse Area Calculator",
  "matematicas",
  "calculator",
  "Calculate the area of an ellipse from semi-major and semi-minor axes.",
  [
    "ellipse area calculator",
    "area elipse",
    "calculadora area elipse",
    "pi a b",
  ],
  {
    title: "Ellipse Area Calculator — π × a × b | UtiliHub",
    description: "Free ellipse area calculator. Enter semi-axes a and b to get area. Local browser calculation.",
  },
);
tool.faq.push(faq("What are semi-axes?", "Half the major and minor diameters of the ellipse."));

export const ELLIPSE_AREA_CALCULATOR_TOOLS = [tool];
