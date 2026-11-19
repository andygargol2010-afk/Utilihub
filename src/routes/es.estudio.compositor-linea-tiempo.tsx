import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const TimelineEventComposer = lazy(() =>
  import("@/components/studio/TimelineEventComposer").then((m) => ({ default: m.TimelineEventComposer })),
);

const title = "Compositor de Línea de Tiempo | UtiliHub";
const description = cleanDescription(
  "Compositor interactivo de eventos en línea de tiempo. Añade tarjetas de eventos, reordénalas, ve una línea de tiempo SVG vertical en vivo y comparte con URL deep-link.",
);

export const Route = createFileRoute("/es/estudio/compositor-linea-tiempo")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/estudio/compositor-linea-tiempo") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/estudio/compositor-linea-tiempo") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/estudio/compositor-linea-tiempo") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/studio/timeline-composer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/studio/timeline-composer") },
    ],
  }),
  component: CompositorLineaPage,
});

function CompositorLineaPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Estudio · Composición</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Compositor de Línea de Tiempo</h1>
        <p className="mt-3 text-muted-foreground">
          Añade y reordena tarjetas de eventos. Observa cómo se actualiza la línea de tiempo SVG vertical en vivo. URL deep-link para compartir.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <TimelineEventComposer locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
