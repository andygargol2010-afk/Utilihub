import type { GeneralTool } from "./types";

export const PRESSURE_CONVERTER_TOOLS: GeneralTool[] = [
  {
    slug: "conversor-presion",
    name: "Pressure Converter",
    nameEs: "Conversor de presión",
    description: "Convert between bar, psi, atm, kPa and more.",
    descriptionEs: "Convierte entre bar, psi, atm, kPa y más.",
    category: "conversiones",
    kind: "converter",
    about: ["Free online pressure unit converter."],
    steps: ["Enter value and select units."],
    faq: [],
  },
];
