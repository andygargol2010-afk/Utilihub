import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const StreakConstellation = lazy(() =>
  import("@/components/experiences/StreakConstellation").then((m) => ({ default: m.StreakConstellation })),
);

const title = "Constelaci\u00f3n de Racha | UtiliHub";
const description = cleanDescription(
  "Visualizador de constelaci\u00f3n de racha diaria. Hac\u00e9 check-in, coloc\u00e1 estrellas interactivas en un mapa creciente, export\u00e1 PNG con marca y compart\u00ed un URL que restaura el progreso. EN+ES.",
);

export const Route = createFileRoute("/es/constelacion-racha")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/constelacion-racha") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/constelacion-racha") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/constelacion-racha") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/streak-constellation") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/streak-constellation") },
    ],
  }),
  component: StreakPageEs,
});

function StreakPageEs() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/es/constelacion-racha");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Retenci\u00f3n \u00b7 Racha</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Constelaci\u00f3n de Racha</h1>
          </div>
          <ExperienceShareButton title="Constelaci\u00f3n de Racha" url={shareUrl} locale="es" variant="button" className="shrink-0" />
        </div>
        <p className="mt-3 text-muted-foreground">
          Hac\u00e9 check-in diario, coloc\u00e1 estrellas de forma interactiva en una constelaci\u00f3n creciente, export\u00e1 un PNG con marca y compart\u00ed un deep-link que restaura tu progreso.
        </p>
      </header>
      <Suspense fallback={<div className="aspect-[16/9] animate-pulse rounded-2xl bg-muted" />}>
        <StreakConstellation locale="es" />
      </Suspense>
      <PlaygroundNextStep currentId="streak-constellation" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
