import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_LOREM: Record<string, ToolSeoOverride> = {
  "generador-lorem-ipsum": {
    metaTitle: "Lorem Ipsum Generator — Placeholder text | UtiliHub",
    metaTitleEs: "Generador Lorem Ipsum — Texto de relleno | UtiliHub",
    metaDescription:
      "Generate classic Lorem Ipsum dummy text. Customize paragraphs, sentences, and words per sentence. Copy with one click. Runs entirely in your browser.",
    metaDescriptionEs:
      "Generá texto Lorem Ipsum clásico. Personalizá párrafos, oraciones y palabras. Copiá con un clic. Corre por completo en tu navegador.",
    about: [
      "Classic Lorem Ipsum placeholder text generated locally from a fixed word list.",
      "Adjust the number of paragraphs, sentences per paragraph, and words per sentence.",
      "Perfect for mockups, designs, and testing layouts without real content.",
      "Nothing is uploaded; generation and copy happen entirely in the browser.",
    ],
    aboutEs: [
      "Texto de relleno Lorem Ipsum clásico generado localmente desde una lista fija de palabras.",
      "Ajustá la cantidad de párrafos, oraciones por párrafo y palabras por oración.",
      "Ideal para mockups, diseños y pruebas de maquetación sin contenido real.",
      "Nada se sube; la generación y la copia ocurren enteramente en el navegador.",
    ],
    steps: [
      "Set the number of paragraphs, sentences, and words using the sliders.",
      "The text updates instantly.",
      "Click Copy to place it on your clipboard, or Reset to defaults.",
    ],
    stepsEs: [
      "Elegí la cantidad de párrafos, oraciones y palabras con los controles.",
      "El texto se actualiza al instante.",
      "Hacé clic en Copiar para llevarlo al portapapeles, o Reiniciar para los valores por defecto.",
    ],
    faq: [
      {
        q: "Is this real Lorem Ipsum?",
        a: "Yes, it uses the classic Latin placeholder words in random order to produce dummy text.",
      },
      {
        q: "Can I control the length?",
        a: "Yes. Use the sliders for paragraphs (1–10), sentences per paragraph (1–8), and words per sentence (4–15).",
      },
      {
        q: "Does it send data anywhere?",
        a: "No. Generation and copying happen entirely in your browser.",
      },
    ],
  },
};
