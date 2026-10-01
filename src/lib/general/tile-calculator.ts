import { makeTool } from "./types";

export const TILE_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-baldosas",
    "Tile calculator",
    "hogar",
    "formula",
    "Estimate how many floor or wall tiles and boxes you need from room size, tile size, grout, and waste.",
    ["tile calculator", "floor tile calculator", "calculadora de baldosas", "azulejos", "ceramic tiles", "tiles per box"],
    {
      mode: "tile-calculator",
      title: "Tile calculator — tiles and boxes needed | UtiliHub",
      description:
        "Calculate floor or wall tiles from room size, tile dimensions, grout, openings, and waste. Free in the browser, no signup.",
    },
  ),
];
