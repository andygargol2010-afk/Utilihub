import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-color-aleatorio",
  "Random Color Generator",
  "diseno",
  "generator",
  "Generate a random color and see its HEX and RGB values. Instant and local.",
  [
    "random color",
    "color generator",
    "generador de colores",
    "hex color generator",
    "rgb color",
    "color aleatorio",
  ],
  {
    title: "Random Color Generator — HEX & RGB online | UtiliHub",
    description: "Free online random color generator. Get a random color with HEX and RGB values instantly in your browser. No signup required.",
  },
);
tool.faq.push(faq("Is the color truly random?", "Yes, it uses the browser's Math.random for each channel."));
tool.faq.push(faq("Can I copy the values?", "Yes. Use the copy buttons for HEX or RGB."));
tool.faq.push(faq("Does it work offline?", "Once the page is loaded, yes — all generation happens in the browser."));

export const RANDOM_COLOR_TOOLS = [tool];

void { "random-color": () => 0 };
