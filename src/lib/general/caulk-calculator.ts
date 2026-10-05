import { makeTool } from "./types";

/** Gap: baseboard counts trim boards; paint counts wall area. This sizes sealant tubes from joint length and bead. */
export const CAULK_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-silicona",
    "Caulk and sealant calculator",
    "hogar",
    "formula",
    "Estimate silicone, acrylic, or polyurethane tubes from joint length, bead size, and a fillet or butt profile.",
    [
      "caulk calculator",
      "how many tubes of caulk",
      "silicone sealant calculator",
      "caulk coverage calculator",
      "sealant bead calculator",
      "calculadora de silicona",
      "cuantos tubos de silicona",
      "calculadora de sellador",
      "cobertura de cartucho de silicona",
      "junta de silicona milimetros",
    ],
    {
      mode: "caulk-calculator",
      title: "Caulk Calculator — Tubes and Bead Size | UtiliHub",
      description:
        "Estimate silicone or acrylic tubes from joint length and bead size. Fillet or butt joint, 300 ml and 10.1 oz tubes. Free, in the browser.",
    },
  ),
];
