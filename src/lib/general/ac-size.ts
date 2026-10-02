import { makeTool } from "./types";

export const AC_SIZE_TOOLS = [
  makeTool(
    "calculadora-btu",
    "Air conditioner size calculator",
    "hogar",
    "formula",
    "Estimate the split AC size for a room in BTU, frigorías, and kW from area, ceiling height, sun, and occupancy.",
    [
      "btu calculator",
      "air conditioner size",
      "room ac calculator",
      "calculadora de btu",
      "frigorias aire acondicionado",
      "calculadora de frigorias",
    ],
    {
      mode: "ac-size",
      title: "Air conditioner size calculator — BTU and frigorías | UtiliHub",
      description:
        "Estimate split AC capacity from room size, ceiling height, sun, windows, and people. Results in BTU/h, frigorías/h, and kW. Free in the browser.",
    },
  ),
];
