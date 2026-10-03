import { makeTool } from "./types";

/** Gap: oven C/F tools convert temperature only. This maps oven time and temperature to an air-fryer setting, and back. */
export const AIRFRYER_CALCULATOR_TOOLS = [
  makeTool(
    "conversor-freidora-aire",
    "Air fryer conversion calculator",
    "cocina",
    "formula",
    "Convert oven temperature and time to an air fryer setting, or the other way around, with food presets.",
    [
      "air fryer conversion",
      "oven to air fryer",
      "air fryer time and temperature",
      "air fryer conversion chart",
      "conversor freidora de aire",
      "horno a freidora de aire",
      "tiempo freidora de aire",
      "temperatura freidora de aire",
    ],
    {
      mode: "airfryer-calculator",
      title: "Air fryer conversion calculator | UtiliHub",
      description:
        "Convert oven temperature and time to an air fryer setting, or reverse it. Food presets, °C/°F, and a check-early window. Free in the browser.",
    },
  ),
];
