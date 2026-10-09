import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_WHATSAPP: Record<string, ToolSeoOverride> = {
  "generador-enlace-whatsapp": {
    metaTitle: "WhatsApp Click-to-Chat Link Generator | UtiliHub",
    metaTitleEs: "Generador de enlace de WhatsApp — wa.me | UtiliHub",
    metaDescription:
      "Build a wa.me link from a country code and an optional message. Empty numbers and local trunk zeros do not invent a link. Runs in the browser.",
    metaDescriptionEs:
      "Armá un enlace wa.me con código de país y un mensaje opcional. Un número vacío o un 0 local no inventa un enlace. Corre en el navegador.",
    about: [
      "This builds a https://wa.me link. It does not send a message or open WhatsApp.",
      "The number must include a country code. A leading 0 or 00 is rejected instead of guessing a country.",
      "An optional message is URL-encoded. Messages over 500 characters are not truncated.",
    ],
    aboutEs: [
      "Arma un enlace https://wa.me. No envía el mensaje ni abre WhatsApp.",
      "El número tiene que incluir código de país. Un 0 o 00 inicial se rechaza en vez de adivinar el país.",
      "El mensaje opcional se codifica en la URL. Más de 500 caracteres no se recortan.",
    ],
    steps: [
      "Enter +1 415 555 2671 or use the example.",
      "Add a message, or clear it for a number-only link.",
      "Copy the wa.me URL. Reset clears both fields.",
    ],
    stepsEs: [
      "Ingresá +1 415 555 2671 o usá el ejemplo.",
      "Agregá un mensaje, o vacialo para un enlace solo con el número.",
      "Copiá la URL wa.me. Reiniciar vacía los dos campos.",
    ],
    faq: [
      {
        q: "What does +1 415 555 2671 and Hello become?",
        a: "https://wa.me/14155552671?text=Hello",
      },
      {
        q: "What does 5491155551234 with no message become?",
        a: "https://wa.me/5491155551234. No text parameter is added.",
      },
      {
        q: "Why is 011 5555 1234 rejected?",
        a: "A leading 0 is a local trunk prefix. The tool does not invent a country code.",
      },
    ],
    faqEs: [
      {
        q: "¿En qué queda +1 415 555 2671 con Hello?",
        a: "https://wa.me/14155552671?text=Hello",
      },
      {
        q: "¿En qué queda 5491155551234 sin mensaje?",
        a: "https://wa.me/5491155551234. No se agrega el parámetro text.",
      },
      {
        q: "¿Por qué se rechaza 011 5555 1234?",
        a: "El 0 inicial es un prefijo local. La herramienta no inventa un código de país.",
      },
    ],
  },
};
