import type { GeneralTool } from "./types";

export const PRESSURE_CONVERTER_TOOLS: GeneralTool[] = [
  {
    slug: "conversor-presion",
    name: "Pressure Converter",
    nameEs: "Conversor de presión",
    title: "Pressure Converter | bar, psi, atm, kPa | UtiliHub",
    summary: "Convert between bar, psi, atm, kPa and more.",
    summaryEs: "Convierte entre bar, psi, atm, kPa y más.",
    keywords: ["pressure converter", "bar to psi", "psi to bar", "atm to kpa", "conversor de presion"],
    description: "Convert between bar, psi, atm, kPa and more.",
    descriptionEs: "Convierte entre bar, psi, atm, kPa y más.",
    category: "conversiones",
    kind: "converter",
    about: ["Free online pressure unit converter."],
    steps: ["Enter value and select units."],
    faq: [],
  },
];
