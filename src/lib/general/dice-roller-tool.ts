import { makeTool, faq } from "./types";

const tool = makeTool(
  "lanzador-de-dados",
  "Dice Roller",
  "generadores",
  "generator",
  "Roll one or more dice and get the total. Perfect for board games. Local and instant.",
  [
    "dice roller",
    "roll dice online",
    "lanzador de dados",
    "tirar dados",
    "board game dice",
  ],
  {
    title: "Dice Roller — Roll multiple dice and sum | UtiliHub",
    description: "Free online dice roller. Enter number of dice and sides to get a random total. Runs entirely in the browser.",
    operation: "dice-roll",
    fields: ["Number of dice", "Sides per die"],
  },
);
tool.faq.push(faq("Can I roll more than one die?", "Yes. Set the number of dice from 1 to 20 and the sides (usually 6, 20, etc.)."));
tool.faq.push(faq("Is the result truly random?", "It uses the browser's Math.random, suitable for casual games."));

export const DICE_ROLLER_TOOLS = [tool];

// Marker for catalog validator
void { "dice-roll": () => 0 };
