import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_ROBOTS: Record<string, ToolSeoOverride> = {
  "generador-robots-txt": {
    metaTitle: "robots.txt Generator — Allow and Block Crawlers | UtiliHub",
    metaTitleEs: "Generador de robots.txt | UtiliHub",
    metaDescription:
      "Build a robots.txt with user-agent groups, Allow and Disallow paths, crawl-delay, and a sitemap. Check whether a path is blocked. Free, in the browser.",
    metaDescriptionEs:
      "Armá un robots.txt con grupos de user-agent, Allow y Disallow, crawl-delay y sitemap. Comprobá si una ruta queda bloqueada. Gratis, en el navegador.",
    about: [
      "A robots.txt file tells cooperating crawlers which paths they may fetch. Each group starts with User-agent, then one or more Allow or Disallow lines. A blank line separates groups. Sitemap is a full URL and sits outside the groups.",
      "The path check uses a longest-match rule: * matches any text and $ anchors the end. If two rules match the same length, Allow wins. A path with no matching rule is allowed. This is a preview, not a live crawl of your site.",
      "Disallow: / blocks the whole host for that agent. Disallow: /admin blocks /admin and /admin/users. Googlebot ignores Crawl-delay; some other bots still read it. Blocking a bot here does not remove pages already indexed.",
      "Nothing is uploaded. Copy the file or download robots.txt and place it at the site root, for example https://example.com/robots.txt.",
    ],
    aboutEs: [
      "Un robots.txt indica a los rastreadores que cooperan qué rutas pueden pedir. Cada grupo empieza con User-agent y sigue con Allow o Disallow. Una línea en blanco separa grupos. Sitemap es una URL completa y va fuera de los grupos.",
      "La prueba de ruta usa la coincidencia más larga: * vale por cualquier texto y $ ancla el final. Si dos reglas empatan en largo, gana Allow. Una ruta sin regla coincidente queda permitida. Es una vista previa, no un rastreo real del sitio.",
      "Disallow: / bloquea todo el host para ese agente. Disallow: /admin bloquea /admin y /admin/users. Googlebot ignora Crawl-delay; otros bots todavía lo leen. Bloquear acá no saca páginas que ya estén indexadas.",
      "No se sube nada. Copiá el archivo o descargá robots.txt y publicalo en la raíz, por ejemplo https://ejemplo.com/robots.txt.",
    ],
    steps: [
      "Pick a preset or add a user-agent group.",
      "Add Allow and Disallow paths that start with /.",
      "Optional: set crawl-delay, a comment, and an https sitemap URL.",
      "Check a sample path, then copy or download robots.txt.",
    ],
    stepsEs: [
      "Elegí un preset o agregá un grupo de user-agent.",
      "Sumá rutas Allow y Disallow que empiecen con /.",
      "Opcional: crawl-delay, un comentario y la URL https del sitemap.",
      "Probá una ruta de ejemplo y copiá o descargá robots.txt.",
    ],
    faq: [
      {
        q: "How do I block the whole site?",
        a: "Use User-agent: * and Disallow: /. That group matches every agent that does not have its own group. A path check of /blog returns blocked.",
      },
      {
        q: "How do I allow the site but hide /admin?",
        a: "Allow: / and Disallow: /admin. Longest match wins, so /admin/users is blocked and /blog stays allowed. Paths must start with /.",
      },
      {
        q: "Does Crawl-delay work on Google?",
        a: "No. Googlebot ignores Crawl-delay. A value of 10 is written for other bots. Leave it empty if you do not need it. Negative or non-numeric values are rejected.",
      },
      {
        q: "Where does the Sitemap line go?",
        a: "After the groups, as Sitemap: https://example.com/sitemap.xml. It must be an http or https URL. An empty sitemap is omitted.",
      },
      {
        q: "Is the file uploaded?",
        a: "No. Rules and the sitemap URL stay in the browser. Download robots.txt and upload it yourself to the site root.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo bloqueo todo el sitio?",
        a: "Usá User-agent: * y Disallow: /. Ese grupo cubre a los agentes sin grupo propio. Una prueba de /blog queda bloqueada.",
      },
      {
        q: "¿Cómo permito el sitio y oculto /admin?",
        a: "Allow: / y Disallow: /admin. Gana la coincidencia más larga: /admin/users queda bloqueada y /blog permitida. Las rutas deben empezar con /.",
      },
      {
        q: "¿Crawl-delay sirve en Google?",
        a: "No. Googlebot ignora Crawl-delay. Un 10 se escribe para otros bots. Dejalo vacío si no lo necesitás. Un negativo o un texto no numérico se rechaza.",
      },
      {
        q: "¿Dónde va la línea Sitemap?",
        a: "Después de los grupos, como Sitemap: https://ejemplo.com/sitemap.xml. Tiene que ser una URL http o https. Si queda vacía, no se escribe.",
      },
      {
        q: "¿Se sube el archivo?",
        a: "No. Las reglas y la URL del sitemap se quedan en el navegador. Descargá robots.txt y subilo vos a la raíz del sitio.",
      },
    ],
  },
};
