import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const DailyChallengeHub = lazy(() =>
  import("@/components/daily-challenge/DailyChallengeHub").then((m) => ({ default: m.DailyChallengeHub })),
);

const title = "Reto diario — un objetivo de juego gratis cada día | UtiliHub";
const description = cleanDescription(
  "Un nuevo objetivo de juego gratis cada día. Jugalo, marcalo como hecho, construí tu racha y completá el calendario de 28 días. Sin cuentas, todo queda en tu dispositivo.",
);

export const Route = createFileRoute("/es/reto-diario")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/reto-diario") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/reto-diario") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/reto-diario") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/daily-challenge") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/daily-challenge") },
    ],
  }),
  component: DailyChallengePage,
});

function DailyChallengePage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Retención · Hábito diario</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Reto diario</h1>
        <p className="mt-3 text-muted-foreground">
          Cada día UTC elige un juego de UtiliHub y un objetivo. Cumplilo, mantené tu racha y completá el calendario.
        </p>
      </header>
      <div className="max-w-2xl">
        <Suspense fallback={<div className="min-h-[360px] rounded-2xl border border-border bg-card" aria-busy="true" />}>
          <DailyChallengeHub locale="es" />
        </Suspense>
      </div>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
