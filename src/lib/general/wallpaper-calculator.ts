import { makeTool } from "./types";

/** Gap: tile and paint tools cover hard surfaces, not wallpaper drops and rolls. */
export const WALLPAPER_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-papel-pintado",
    "Wallpaper roll calculator",
    "hogar",
    "formula",
    "Estimate wallpaper strips and rolls from wall size, roll dimensions, and pattern repeat.",
    [
      "wallpaper calculator",
      "wallpaper rolls",
      "how many wallpaper rolls",
      "pattern repeat wallpaper",
      "calculadora papel pintado",
      "rollos de papel pintado",
      "cuantos rollos de empapelado",
      "rapport papel pintado",
    ],
    {
      mode: "wallpaper-calculator",
      title: "Wallpaper calculator — rolls and pattern repeat | UtiliHub",
      description:
        "Calculate wallpaper strips and rolls from wall length, height, roll size, and pattern repeat. Euro and wide-roll presets. Free in the browser.",
    },
  ),
];
