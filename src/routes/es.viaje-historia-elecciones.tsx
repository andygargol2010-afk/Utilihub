import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const ChoiceStoryJourney = lazy(() =>
  import("@/components/journeys/ChoiceStoryJourney").then((m) => ({ default: m.ChoiceStoryJourney })),
);

const title = "Viaje de Historia con Elecciones | UtiliHub";
const description = cleanDescription(
  "Viaje narrativo interactivo con elecciones. Haz clic en tarjetas de decisión ramificadas, sigue waypoints de progreso y llega a finales únicos con tarjeta resumen compartible.",
);

export const Route = createFileRoute("/es/viaje-historia-elecciones")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/viaje-historia-elecciones") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/viaje-historia-elecciones") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/viaje-historia-elecciones") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/choice-story-journey") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/choice-story-journey") },
    ],
  }),
  component: ViajeHistoriaPage,
});

function ViajeHistoriaPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Viaje · Elecciones narrativas</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Viaje de Historia con Elecciones</h1>
        <p className="mt-3 text-muted-foreground">
          Selecciona entre tarjetas de decisión ramificadas en cada etapa. Observa cómo se llenan los waypoints de progreso hasta llegar a uno de varios finales.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" /> }>
        <ChoiceStoryJourney locale="es" />
      </Suspense>
      <PlaygroundNextStep currentId="choice-story-journey" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
