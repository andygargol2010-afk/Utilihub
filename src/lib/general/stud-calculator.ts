import { makeTool } from "./types";

/** Gap: drywall counts sheets; siding counts panels. This orders studs, plates, and extras for a framed wall. */
export const STUD_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-montantes",
    "Wall stud calculator",
    "hogar",
    "formula",
    "Estimate studs, top and bottom plates, and extra king or jack studs for a framed wall from length, height, and on-center spacing.",
    [
      "wall stud calculator",
      "how many studs do I need",
      "16 inch on center stud calculator",
      "framing calculator studs and plates",
      "2x4 wall stud count",
      "calculadora de montantes",
      "cuantos montantes necesito",
      "montantes cada 40 cm",
      "tabique de madera calculadora",
      "soleras y montantes de muro",
    ],
    {
      mode: "stud-calculator",
      title: "Wall Stud Calculator — 16 in OC Count | UtiliHub",
      description:
        "Count wall studs, plates, and extra opening studs from length and on-center spacing. Free, in the browser.",
    },
  ),
];