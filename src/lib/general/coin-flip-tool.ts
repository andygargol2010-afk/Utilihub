import { makeTool, faq } from "./types";

const tool = makeTool(
  "lanzador-de-moneda",
  "Coin Flip",
  "generadores",
  "generator",
  "Flip a virtual coin for heads or tails. Instant and local.",
  [
    "coin flip",
    "heads or tails",
    "lanzador de moneda",
    "cara o cruz",
    "random decision",
  ],
  {
    title: "Coin Flip — Heads or tails online | UtiliHub",
    description: "Free online coin flip. Get a random heads or tails result instantly in the browser.",
    operation: "coin-flip",
    fields: ["Dummy"],
  },
);
tool.faq.push(faq("Is it fair?", "Yes, uses Math.random for 50/50."));
tool.faq.push(faq("Can I use it for decisions?", "Yes, for casual choices."));

export const COIN_FLIP_TOOLS = [tool];

void { "coin-flip": () => 0 };
