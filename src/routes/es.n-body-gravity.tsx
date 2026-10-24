import { createFileRoute } from "@tanstack/react-router";
import { NBodyGravitySim } from "@/components/playgrounds/NBodyGravitySim";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Simulador de Gravedad N-Cuerpos | UtiliHub";
const description = cleanDescription(
  "Simulador interactivo de gravedad N-cuerpos: agregá cuerpos celestes con masa, velocidad, color. Dinámica gravitacional en vivo, estelas, colisiones suaves, zoom/pan, escala de tiempo, preajustes. Compartir PNG + enlace profundo. ES.",
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
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/es/n-body-gravity");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Simulador · Interactivo</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Simulador de Gravedad N-Cuerpos</h1>
          </div>
          <ExperienceShareButton
            title="Simulador de Gravedad N-Cuerpos"
            url={shareUrl}
            locale="es"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Agregá cuerpos celestes con masa, velocidad inicial, color y tamaño ajustables. Observá la dinámica gravitacional en vivo con estelas de partículas, manejo de colisiones suaves, cámara zoom/pan, controles de escala de tiempo, pausa/reinicio y preajustes (estrellas binarias, mini sistema solar, cúmulo caótico). Compartir PNG + enlace profundo para condiciones iniciales.
        </p>
      </header>
      <NBodyGravitySim locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
