import { makeTool } from "./types";

/** Gap: fence is a linear run; laminate flooring is indoor planks. This estimates outdoor deck boards, joists, and screws. */
export const DECK_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-deck",
    "Deck board calculator",
    "hogar",
    "formula",
    "Estimate deck boards, joists, and screws from deck size, board width, gap, joist spacing, and waste.",
    [
      "deck board calculator",
      "decking calculator",
      "how many deck boards",
      "deck joist spacing calculator",
      "calculadora de deck",
      "calculadora tarima exterior",
      "cuantas tablas para deck",
      "separacion de vigas deck",
    ],
    {
      mode: "deck-calculator",
      title: "Deck board calculator — boards, joists, screws | UtiliHub",
      description:
        "Estimate deck boards, joists, and screws from length, width, board size, gap, and joist spacing. Patio presets included. Free in the browser.",
    },
  ),
];
