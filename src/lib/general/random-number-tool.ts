import { makeTool } from "./types";

export const RANDOM_NUMBER_TOOLS = [
  makeTool(
    "generador-numero-aleatorio",
    "Random Number Generator",
    "generadores",
    "generator",
    "Generate a random integer between a minimum and maximum. Instant, local, no signup.",
    [
      "random number generator",
      "random integer",
      "generador de numero aleatorio",
      "numero aleatorio",
      "random between min max",
    ],
    {
      title: "Random Number Generator — Min to max integer | UtiliHub",
      description: "Free random number generator. Enter minimum and maximum to get a random integer in range. Runs in the browser.",
      operation: "random-int",
      fields: ["Minimum", "Maximum"],
    },
  ),
];

// Marker so catalog validator sees an implementation for operation random-int
// (actual switch lives in ConfiguredTool.tsx as case"random-int":)
void { "random-int": () => 0 };
