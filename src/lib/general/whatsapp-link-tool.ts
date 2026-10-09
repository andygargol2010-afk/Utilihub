import { makeTool } from "./types";

/** Gap: UTM and vCard builders exist. Neither builds a wa.me link, and neither refuses a local trunk prefix. */
export const WHATSAPP_LINK_TOOLS = [
  makeTool(
    "generador-enlace-whatsapp",
    "WhatsApp click-to-chat link",
    "productividad",
    "generator",
    "Build a wa.me link from a country code and an optional message. A local trunk zero does not invent a country code.",
    [
      "whatsapp link generator",
      "wa.me link builder",
      "click to chat whatsapp",
      "whatsapp message link",
      "generador enlace whatsapp",
      "crear link de whatsapp",
      "enlace wa.me con mensaje",
      "generador click to chat",
    ],
    {
      mode: "whatsapp-link",
      title: "WhatsApp Click-to-Chat Link Generator | UtiliHub",
      description:
        "Build a wa.me link from a country code and an optional message. Empty numbers and local trunk zeros do not invent a link. Runs in the browser.",
    },
  ),
];
