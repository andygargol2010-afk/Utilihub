import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_OPEN_GRAPH: Record<string, ToolSeoOverride> = {
  "generador-open-graph": {
    metaTitle: "Open Graph Tag Generator — Twitter Cards, Local | UtiliHub",
    metaTitleEs: "Generador Open Graph: Twitter cards, en el navegador | UtiliHub",
    metaDescription:
      "Build og:title, og:description, og:image, and twitter:card tags in the browser. A 13-character title stays under the 60-character soft limit. Images are not fetched.",
    metaDescriptionEs:
      "Armá og:title, og:description, og:image y twitter:card en el navegador. Un título de 13 caracteres queda bajo el límite blando de 60. No se descarga la imagen.",
    about: [
      "Open Graph tags are what Facebook, LinkedIn, Slack, and WhatsApp read for a link preview. Twitter cards use a parallel set of name attributes.",
      "This generator only writes the HTML snippet. It does not fetch og:image, so a broken image URL still looks valid here.",
      "og:title is warned past 60 characters and og:description past 200. Relative image or page URLs are rejected because crawlers resolve them inconsistently.",
    ],
    aboutEs: [
      "Las etiquetas Open Graph son las que leen Facebook, LinkedIn, Slack y WhatsApp para la vista previa. Las Twitter cards usan atributos name en paralelo.",
      "Este generador solo escribe el fragmento HTML. No descarga og:image, así que una URL rota igual se ve bien acá.",
      "og:title avisa después de 60 caracteres y og:description después de 200. URLs relativas de imagen o página se rechazan porque los crawlers las resuelven distinto.",
    ],
    steps: [
      "Enter the title, description, canonical URL, and absolute image URL.",
      "Pick website or article, and summary or summary_large_image.",
      "Copy the meta tags and paste them in the page head.",
    ],
    stepsEs: [
      "Ingresá título, descripción, URL canónica y URL absoluta de la imagen.",
      "Elegí website o article, y summary o summary_large_image.",
      "Copiá las meta tags y pegálas en el head de la página.",
    ],
    faq: [
      { q: "What does the kitchen timer example emit?", a: "Title Kitchen timer is 13 characters, under the 60 soft limit. Description A free browser timer for cooking. is 33 characters. Image https://utilihub.net/og/kitchen.jpg yields twitter:card summary_large_image and no errors." },
      { q: "Does this fetch the image?", a: "No. The snippet is built locally. A 200 response and the real dimensions are not checked." },
      { q: "Why does a missing image warn on summary_large_image?", a: "That card expects og:image and twitter:image. The tags are still emitted, with an image-missing warning. Switch to summary if you have no image." },
    ],
    faqEs: [
      { q: "¿Qué emite el ejemplo del timer de cocina?", a: "El título Kitchen timer tiene 13 caracteres, bajo el límite blando de 60. La descripción A free browser timer for cooking. tiene 33. La imagen https://utilihub.net/og/kitchen.jpg deja twitter:card summary_large_image y sin errores." },
      { q: "¿Esto descarga la imagen?", a: "No. El fragmento se arma en local. No se verifica un 200 ni las dimensiones reales." },
      { q: "¿Por qué una imagen vacía avisa en summary_large_image?", a: "Esa card espera og:image y twitter:image. Las tags igual se emiten, con aviso image-missing. Pasá a summary si no hay imagen." },
    ],
  },
};
