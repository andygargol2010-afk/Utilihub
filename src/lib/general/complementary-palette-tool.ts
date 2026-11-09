import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-paleta-complementaria",
  "Complementary Color Palette Generator",
  "diseno",
  "design",
  "Generate the complementary color of any HEX base color for balanced palettes.",
  [
    "complementary color generator",
    "color palette generator",
    "generador paleta complementaria",
    "color complementario",
    "hex complementary",
  ],
  {
    title: "Complementary Color Palette Generator | UtiliHub",
    description: "Free complementary color generator. Enter a HEX color and get its complementary pair instantly. No signup.",
  },
);
tool.faq.push(faq("What is a complementary color?", "The color opposite on the color wheel, created by inverting RGB channels (255 - channel)."));

export const COMPLEMENTARY_PALETTE_TOOLS = [tool];
