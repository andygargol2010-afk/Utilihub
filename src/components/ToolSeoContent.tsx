import type { CatalogTool } from "@/lib/all-tools";
import { spanishToolName } from "@/lib/i18n/es";
import { resolvedToolSeo, toolSeoOverride } from "@/lib/tool-seo-overrides";

/** Spanish guide when a tool has EN catalog copy but no aboutEs/stepsEs/faqEs override. */
function spanishGuideFallback(
  displayName: string,
  tool: CatalogTool,
): {
  about: string[];
  steps: string[];
  faq: { q: string; a: string }[];
} {
  const kind = (tool.kind || "").toLowerCase();
  const slug = (tool.slug || "").toLowerCase();
  const summaryEs = typeof tool.summaryEs === "string" && tool.summaryEs.trim() ? tool.summaryEs.trim() : "";
  const summary =
    summaryEs ||
    (typeof tool.summary === "string" && tool.summary.trim()
      ? tool.summary.trim()
      : "");

  const baseAbout = summary
    ? [
        `${displayName} es una herramienta gratuita de UtiliHub. ${summary}`,
        "Todo el procesamiento compatible se ejecuta en tu navegador: tus archivos no se suben a un servidor.",
      ]
    : [
        `${displayName} es una herramienta gratuita de UtiliHub. Funciona en tu navegador, sin registro ni instalación.`,
        "Todo el procesamiento compatible se ejecuta en tu dispositivo.",
      ];

  // Image tools (PNG→JPG, compress, crop, resize, etc.)
  if (kind === "image" || kind === "media") {
    return {
      about: baseAbout,
      steps: [
        "Elegí o arrastrá la imagen que quieras procesar (se queda en tu dispositivo).",
        "Ajustá las opciones si la herramienta lo permite (calidad, tamaño, formato).",
        "Procesá y descargá el resultado al instante, sin subir el archivo a internet.",
      ],
      faq: [
        {
          q: "¿Se sube mi imagen a un servidor?",
          a: "No. La conversión y el procesamiento se hacen en tu navegador. El archivo no se envía a UtiliHub.",
        },
        {
          q: "¿Qué formatos puedo usar?",
          a: "En general PNG, JPG y WebP, según la herramienta. El selector de archivos ya filtra los tipos compatibles.",
        },
        {
          q: "¿Necesito crear una cuenta?",
          a: "No. Podés usar la herramienta de inmediato, sin registro.",
        },
      ],
    };
  }

  // PDF tools
  if (kind === "pdf") {
    return {
      about: baseAbout,
      steps: [
        "Seleccioná el PDF (o los PDFs) que quieras procesar.",
        "Indicá páginas, orden o rotación si la herramienta lo pide.",
        "Procesá y descargá el archivo resultante. Todo corre en tu navegador cuando es posible.",
      ],
      faq: [
        {
          q: "¿Mi PDF se sube a un servidor?",
          a: "No en las operaciones compatibles: se procesan en tu navegador y el resultado se descarga localmente.",
        },
        {
          q: "¿Necesito crear una cuenta?",
          a: "No. Podés usar la herramienta de inmediato, sin registro.",
        },
      ],
    };
  }

  // Document tools (metadata, CSV, markdown, text-diff, batch names)
  if (kind === "document") {
    return {
      about: baseAbout,
      steps: [
        "Cargá el archivo o pegá el texto / CSV / Markdown que quieras analizar.",
        "Ejecutá el proceso: la herramienta lee o transforma el contenido en tu navegador.",
        "Revisá el resultado (metadatos, diferencias, HTML, nombres normalizados) y copialo si lo necesitás.",
      ],
      faq: [
        {
          q: "¿Se sube mi archivo o texto a un servidor?",
          a: "No en las operaciones compatibles. El análisis se hace en tu dispositivo.",
        },
        {
          q: "¿Necesito crear una cuenta?",
          a: "No. Podés usar la herramienta de inmediato, sin registro.",
        },
      ],
    };
  }

  // Design / color tools
  if (
    kind === "design" ||
    kind === "color" ||
    slug.includes("color") ||
    slug.includes("rgb") ||
    slug.includes("hsl") ||
    slug.includes("hex") ||
    slug.includes("contraste") ||
    slug.includes("paleta") ||
    slug.includes("gradiente")
  ) {
    return {
      about: baseAbout,
      steps: [
        "Ingresá el color en HEX (por ejemplo #2563eb) o los valores que pida la herramienta.",
        "Revisá el resultado (conversión, contraste, mezcla o código CSS) en la misma pantalla.",
        "Copiá el valor o el snippet generado para usarlo en tu diseño o CSS.",
      ],
      faq: [
        {
          q: "¿Qué formato de color debo usar?",
          a: "La mayoría de estas herramientas trabajan con HEX de 6 dígitos. Algunas también muestran RGB o HSL en el resultado.",
        },
        {
          q: "¿Necesito crear una cuenta?",
          a: "No. Podés usar la herramienta de inmediato, sin registro.",
        },
      ],
    };
  }

  // Text / encode tools
  if (kind === "text" || kind === "code" || kind === "encode") {
    return {
      about: baseAbout,
      steps: [
        "Pegá o escribí el texto que quieras procesar.",
        "Ejecutá la acción (convertir, contar, ordenar, codificar, etc.).",
        "Copiá el resultado o usalo en el siguiente paso de tu flujo.",
      ],
      faq: [
        {
          q: "¿Se guarda el texto que escribo?",
          a: "No. El procesamiento es local en tu navegador; no se almacena en servidores de UtiliHub.",
        },
        {
          q: "¿Necesito crear una cuenta?",
          a: "No. Podés usar la herramienta de inmediato, sin registro.",
        },
      ],
    };
  }

  // Converters / units
  if (kind === "converter" || kind === "conversion" || kind === "unit") {
    return {
      about: baseAbout,
      steps: [
        "Ingresá el valor que quieras convertir y, si aplica, elegí las unidades de origen y destino.",
        "El resultado se calcula al instante en la misma pantalla.",
        "Copiá el valor convertido si lo necesitás en otro lugar.",
      ],
      faq: [
        {
          q: "¿Los resultados son exactos?",
          a: "Usamos factores de conversión estándar. Para usos críticos (legales, médicos o industriales) verificá con una fuente oficial.",
        },
        {
          q: "¿Necesito crear una cuenta?",
          a: "No. Podés usar la herramienta de inmediato, sin registro.",
        },
      ],
    };
  }

  // Default (calculators, finance, health, generic)
  return {
    about: baseAbout,
    steps: [
      "Completá los campos con los valores que quieras calcular o procesar.",
      "El resultado se actualiza al instante en la misma pantalla.",
      "Copiá, compartí o exportá el resultado si la herramienta lo permite.",
    ],
    faq: [
      {
        q: "¿Los resultados son vinculantes o reemplazan asesoramiento profesional?",
        a: "No. Son orientativos y se calculan en tu dispositivo. No sustituyen el criterio de un profesional.",
      },
      {
        q: "¿Necesito crear una cuenta?",
        a: "No. Podés usar la herramienta de inmediato, sin registro.",
      },
    ],
  };
}

export function ToolSeoContent({
  tool,
  locale = "en",
}: {
  tool: CatalogTool;
  locale?: "en" | "es";
}) {
  const override = toolSeoOverride(tool.slug);
  const resolved = resolvedToolSeo(tool);
  const displayName = locale === "es" ? spanishToolName(tool) : tool.name;
  const fallbackEs = locale === "es" ? spanishGuideFallback(displayName, tool) : null;

  // Never surface English catalog SEO copy on /es/* pages.
  const about =
    locale === "es"
      ? override?.aboutEs?.length
        ? override.aboutEs
        : resolved.about.length
          ? fallbackEs!.about
          : []
      : resolved.about;
  const steps =
    locale === "es"
      ? override?.stepsEs?.length
        ? override.stepsEs
        : resolved.steps.length
          ? fallbackEs!.steps
          : []
      : resolved.steps;
  const faq =
    locale === "es"
      ? override?.faqEs?.length
        ? override.faqEs
        : resolved.faq.length
          ? fallbackEs!.faq
          : []
      : resolved.faq;

  const hasDetails = about.length > 0 || steps.length > 0 || faq.length > 0;
  if (!hasDetails) return null;

  const guideLabel = locale === "es" ? "Guía de la herramienta" : "Tool guide";
  const howTitle =
    locale === "es" ? `${displayName}: cómo funciona` : `${displayName}: how it works`;
  const howLead =
    locale === "es"
      ? "Información práctica para entender el resultado y usar bien esta herramienta."
      : "Practical information to understand the result and use this tool correctly.";
  const aboutTitle = locale === "es" ? `Sobre ${displayName}` : `About ${displayName}`;
  const stepsTitle = locale === "es" ? "Cómo usarla" : "How to use it";
  const faqTitle = locale === "es" ? "Preguntas frecuentes" : "Frequently asked questions";

  return (
    <article className="mt-10 border-t border-border/70 pt-8" aria-labelledby="tool-guide-title">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{guideLabel}</p>
        <h2 id="tool-guide-title" className="mt-1 text-2xl font-black">
          {howTitle}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{howLead}</p>
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_.9fr]">
        {about.length > 0 && (
          <section aria-labelledby="tool-about-title">
            <h3 id="tool-about-title" className="text-base font-bold">
              {aboutTitle}
            </h3>
            <div className="mt-3 space-y-3">
              {about.map((paragraph, index) => (
                <p key={index} className="text-sm leading-6 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}
        {steps.length > 0 && (
          <section aria-labelledby="tool-steps-title">
            <h3 id="tool-steps-title" className="text-base font-bold">
              {stepsTitle}
            </h3>
            <ol className="mt-3 space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
      {faq.length > 0 ? (
        <section className="mt-8 max-w-3xl" aria-labelledby="tool-faq-title">
          <h3 id="tool-faq-title" className="text-base font-bold">
            {faqTitle}
          </h3>
          <dl className="mt-3 divide-y divide-border rounded-xl border border-border/70 bg-card px-4">
            {faq.map((item) => (
              <div key={item.q} className="py-4">
                <dt className="font-semibold">{item.q}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </article>
  );
}
