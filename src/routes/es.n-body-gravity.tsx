import { createFileRoute } from "@tanstack/react-router";
import { NBodyGravitySim } from "@/components/playgrounds/NBodyGravitySim";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Simulador de Gravedad N-Cuerpos | UtiliHub";
const description = cleanDescription(
  "Simulador interactivo de gravedad N-cuerpos: agreg\u00e1 cuerpos celestes con masa, velocidad, color. Din\u00e1mica gravitacional en vivo, estelas, colisiones suaves, zoom/pan, escala de tiempo, preajustes. Compartir PNG + enlace profundo. ES.",
);

export const Route = createFileRoute("/es/n-body-gravity")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/n-body-gravity") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/n-body-gravity") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/n-body-gravity") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/n-body-gravity") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/n-body-gravity") },
    ],
  }),
  component: NBodyPageEs,
});

function NBodyPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Simulador · Interactivo</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Simulador de Gravedad N-Cuerpos</h1>
        <p className="mt-3 text-muted-foreground">
          Agreg\u00e1 cuerpos celestes con masa, velocidad inicial, color y tama\u00f1o ajustables. Observ\u00e1 la din\u00e1mica gravitacional en vivo con estelas de part\u00edculas, manejo de colisiones suaves, c\u00e1mara zoom/pan, controles de escala de tiempo, pausa/reinicio y preajustes (estrellas binarias, mini sistema solar, c\u00famulo ca\u00f3tico). Compartir PNG + enlace profundo para condiciones iniciales.
        </p>
      </header>
      <NBodyGravitySim locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
