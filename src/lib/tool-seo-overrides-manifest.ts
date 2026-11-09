import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_MANIFEST: Record<string, ToolSeoOverride> = {
  "generador-manifest-pwa": {
    metaTitle: "PWA Manifest Generator — web app manifest | UtiliHub",
    metaTitleEs: "Generador de manifest PWA — web app manifest | UtiliHub",
    metaDescription:
      "Build a W3C web app manifest with name, start URL, display mode, and theme colors. Empty name or a bad color does not invent a file. Runs in the browser.",
    metaDescriptionEs:
      "Armá un web app manifest W3C con nombre, URL de inicio, display y colores. Nombre vacío o color inválido no inventa un archivo. Corre en el navegador.",
    about: [
      "This writes a manifest.webmanifest object. It does not generate icons, a service worker, or Open Graph tags.",
      "A relative start URL must begin with a single slash. Absolute URLs must be https.",
      "Icons are included only when you paste a path. The tool does not invent an icon URL.",
    ],
    aboutEs: [
      "Escribe un objeto manifest.webmanifest. No genera íconos, service worker ni etiquetas Open Graph.",
      "Una URL de inicio relativa debe empezar con una sola barra. Las absolutas tienen que ser https.",
      "El ícono entra solo si pegás una ruta. La herramienta no inventa una URL de ícono.",
    ],
    steps: [
      "Enter the app name, or use the UtiliHub example.",
      "Set the start URL, display mode, and optional theme colors.",
      "Copy the JSON. An empty name, a bad hex color, or a sizes value without an icon does not produce a file.",
    ],
    stepsEs: [
      "Ingresá el nombre de la app, o usá el ejemplo UtiliHub.",
      "Definí la URL de inicio, el modo display y los colores opcionales.",
      "Copiá el JSON. Nombre vacío, color hex inválido o sizes sin ícono no produce un archivo.",
    ],
    faq: [
      {
        q: "What does the UtiliHub example emit?",
        a: "name UtiliHub, short_name Hub, start_url /, display standalone, theme_color #0f766e, background_color #f8fafc, lang en. No icons array.",
      },
      {
        q: "What happens if the name is empty?",
        a: "No file is produced. The tool does not invent an app name.",
      },
      {
        q: "Is the manifest uploaded?",
        a: "No. The JSON is built in the browser. Nothing is sent.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué emite el ejemplo UtiliHub?",
        a: "name UtiliHub, short_name Hub, start_url /, display standalone, theme_color #0f766e, background_color #f8fafc, lang en. Sin array de íconos.",
      },
      {
        q: "¿Qué pasa si el nombre está vacío?",
        a: "No se produce un archivo. La herramienta no inventa un nombre de app.",
      },
      {
        q: "¿Se sube el manifest?",
        a: "No. El JSON se arma en el navegador. No se envía nada.",
      },
    ],
  },
};
