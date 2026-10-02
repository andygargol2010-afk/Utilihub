import { makeTool } from "./types";

/** Gap: tile, paint, wallpaper, and concrete cover finishes and slabs, not plasterboard sheets. */
export const DRYWALL_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-pladur",
    "Drywall sheet calculator",
    "hogar",
    "formula",
    "Estimate plasterboard sheets, screws, joint compound, and tape from wall size and openings.",
    [
      "drywall calculator",
      "how many drywall sheets",
      "plasterboard calculator",
      "drywall screws and mud",
      "calculadora de pladur",
      "placas de yeso laminado",
      "cuantas placas de pladur",
      "tornillos y pasta de juntas",
    ],
    {
      mode: "drywall-calculator",
      title: "Drywall calculator — sheets, screws, mud | UtiliHub",
      description:
        "Estimate drywall sheets, screws, joint compound, and tape from wall length, height, openings, and optional ceiling. Free in the browser.",
    },
  ),
];
