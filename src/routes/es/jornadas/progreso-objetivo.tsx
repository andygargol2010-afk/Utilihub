import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const GoalProgressJourney = lazy(() =>
  import("@/components/journeys/GoalProgressJourney").then((m) => ({ default: m.GoalProgressJourney })),
);

const title = "Recorrido de Progreso de Objetivo | UtiliHub";
const description = cleanDescription(
  "Recorrido interactivo multi-etapa de progreso personal. Elige una categoría, marca etapas ordenadas, ve el progreso en vivo y comparte tu completado.",
);

export const Route = createFileRoute("/es/jornadas/progreso-objetivo")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/jornadas/progreso-objetivo") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/jornadas/progreso-objetivo") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/journeys/goal-progress") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/jornadas/progreso-objetivo") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/journeys/goal-progress") },
    ],
  }),
  component: GoalProgressPageEs,
});

function GoalProgressPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Jornada · Progreso de objetivo</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Recorrido de Progreso de Objetivo</h1>
        <p className="mt-3 text-muted-foreground">
          Elige una categoría de objetivo, avanza por etapas ordenadas con listas de verificación y observa cómo se llena tu barra de progreso.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <GoalProgressJourney locale="es" />
      </Suspense>
      <PlaygroundNextStep currentId="goal-progress-journey" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
