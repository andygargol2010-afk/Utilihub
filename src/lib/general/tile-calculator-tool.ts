import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-azulejos",
  "Tile Calculator",
  "hogar",
  "calculator",
  "Calculate how many tiles you need for a room including waste percentage. Enter room dimensions and tile size.",
  [
    "tile calculator",
    "how many tiles do I need",
    "calculadora azulejos",
    "cuántos azulejos necesito",
    "floor tile calculator",
  ],
  {
    title: "Tile Calculator — How Many Tiles for a Room | UtiliHub",
    description: "Free tile calculator. Enter room length and width plus tile size and waste % to get the number of tiles needed. Browser-only.",
  },
);
tool.faq.push(faq("How is the number of tiles calculated?", "Room area ÷ tile area, then add the waste percentage. Example: 3 m × 4 m room with 0.3 m × 0.3 m tiles and 10% waste."));
tool.faq.push(faq("What waste percentage should I use?", "Typically 5–15% depending on cuts and pattern. Use 10% as a safe default for most floors."));

export const TILE_CALCULATOR_TOOLS = [tool];
