import { makeTool } from "./types";

/** Gap: tile and flooring count indoor sheets; gravel is loose bulk. This counts patio pavers, border, joints, and a crushed-stone base. */
export const PAVER_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-adoquines",
    "Patio paver calculator",
    "hogar",
    "formula",
    "Count patio pavers from area, paver size, and joint gap, with an optional border course, polymeric sand bags, and crushed-stone base.",
    [
      "paver calculator",
      "how many pavers do I need",
      "patio paver calculator",
      "paver base calculator",
      "polymeric sand calculator",
      "calculadora de adoquines",
      "cuantos adoquines necesito",
      "adoquines para patio",
      "base de adoquines",
      "arena polimerica adoquines",
    ],
    {
      mode: "paver-calculator",
      title: "Patio Paver Calculator — Count and Base | UtiliHub",
      description:
        "Estimate patio paver count from area, size, and joint gap. Optional border course, polymeric sand bags, and crushed-stone base. Free, in the browser.",
    },
  ),
];
