import { makeTool } from "./types";

/** Gap: drywall counts gypsum boards and joint compound. This sizes plywood, OSB, and MDF sheets. */
export const SHEET_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-tableros",
    "Plywood sheet calculator",
    "hogar",
    "formula",
    "Estimate plywood, OSB, and MDF sheets for a floor or wall from area, openings, sheet size, and waste.",
    [
      "plywood calculator",
      "how many sheets of plywood",
      "OSB sheathing calculator",
      "MDF sheet calculator",
      "4x8 plywood calculator",
      "calculadora de contrachapado",
      "cuantas placas de OSB",
      "calculadora de tableros",
      "placas de MDF para mueble",
      "tableros de 1220x2440",
    ],
    {
      mode: "sheet-calculator",
      title: "Plywood Sheet Calculator — OSB and MDF | UtiliHub",
      description:
        "Estimate plywood, OSB, and MDF sheets from area, openings, and sheet size. Waste and weight included. Free, in the browser.",
    },
  ),
];
