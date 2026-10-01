import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_UTM: Record<string, ToolSeoOverride> = {
  "generador-utm": {
    metaTitle: "UTM link builder free online | UtiliHub",
    metaTitleEs: "Generador de enlaces UTM gratis | UtiliHub",
    metaDescription:
      "Build a campaign URL with utm_source, utm_medium, utm_campaign, term, and content. Copy a trackable link in the browser.",
    metaDescriptionEs:
      "Armá una URL de campaña con utm_source, utm_medium, utm_campaign, término y contenido. Copiá el enlace rastreable en el navegador.",
    about: [
      "Add the landing page and the campaign fields Google Analytics and other tools expect: source, medium, and campaign. Term and content are optional.",
      "The builder encodes values, can lowercase them, and replaces any UTM parameters already on the URL. Nothing is uploaded.",
    ],
    aboutEs: [
      "Agregá la página de destino y los campos que esperan Google Analytics y otras herramientas: origen, medio y campaña. Término y contenido son opcionales.",
      "El generador codifica los valores, puede pasarlos a minúsculas y reemplaza parámetros UTM que ya estén en la URL. No se sube nada.",
    ],
    steps: [
      "Paste the landing page URL. https:// is added if you omit the protocol.",
      "Enter source, medium, and campaign. Use a preset medium or type your own.",
      "Add term or content if you need them, then copy the finished link.",
    ],
    stepsEs: [
      "Pegá la URL de destino. Si omitís el protocolo, se agrega https://.",
      "Ingresá origen, medio y campaña. Podés usar un medio sugerido o escribir el tuyo.",
      "Sumá término o contenido si los necesitás y copiá el enlace final.",
    ],
    faq: [
      {
        q: "Which fields are required?",
        a: "Source, medium, and campaign are required. Term and content stay empty unless you fill them.",
      },
      {
        q: "Should UTM values be lowercase?",
        a: "Yes for consistent reports. The lowercase option is on by default and does not change the page path.",
      },
      {
        q: "Does this send the URL anywhere?",
        a: "No. The link is built locally in the browser.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué campos son obligatorios?",
        a: "Origen, medio y campaña son obligatorios. Término y contenido quedan vacíos si no los completás.",
      },
      {
        q: "¿Conviene escribir los UTM en minúsculas?",
        a: "Sí, para que los reportes no se partan. La opción de minúsculas está activa por defecto y no cambia la ruta de la página.",
      },
      {
        q: "¿Se envía la URL a algún servidor?",
        a: "No. El enlace se arma en el navegador.",
      },
    ],
  },
};
