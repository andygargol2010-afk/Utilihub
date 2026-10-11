import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-nombre-usuario",
  "Random Username Generator",
  "generadores",
  "generator",
  "Generate random usernames for accounts, games, or social profiles. Instant and local.",
  [
    "random username",
    "username generator",
    "generador de nombres de usuario",
    "random handle",
    "nombre de usuario aleatorio",
    "username creator",
  ],
  {
    title: "Random Username Generator — Create handles online | UtiliHub",
    description: "Free online random username generator. Create unique usernames with custom length and style instantly in your browser. No signup required.",
  },
);
tool.faq.push(faq("Is it truly random?", "Yes, it uses the browser's Math.random to pick characters and patterns."));
tool.faq.push(faq("Can I set the length?", "Yes. Choose between 6 and 16 characters."));
tool.faq.push(faq("Does it work offline?", "Once the page is loaded, yes — all generation happens in the browser."));
tool.faq.push(faq("Are usernames unique?", "They are randomly generated each time; collisions are extremely unlikely for casual use."));

export const RANDOM_USERNAME_TOOLS = [tool];

void { "random-username": () => 0 };
