import { makeTool, faq } from "./types";

const tool = makeTool(
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
);
tool.faq.push(
  faq(
    "How do I calculate how many tiles I need?",
    "Tiles = room area / effective tile area, where effective tile area = (tile length + grout) × (tile width + grout). Then add your waste factor, usually 10%.",
  ),
);
tool.faq.push(
  faq(
    "How many tiles come in a box?",
    "Boxes usually hold 10–15 tiles for standard formats. Total area per box is printed on the packaging, so boxes = total area needed (with waste) / area per box.",
  ),
);

export const TILE_CALCULATOR_TOOLS = [tool];
