import { createFileRoute } from "@tanstack/react-router";
import { DailyProgressConstellation } from "@/components/experiences/DailyProgressConstellation";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Constelación de Progreso Diario | UtiliHub";
const description = cleanDescription(
  "Canvas interactivo de visitas de retorno. Cada visita diaria enciende una nueva estrella y construye tu constelación personal de progreso. Snapshots compartibles. Sin cuentas.",
);

export const Route = createFileRoute("/es/daily-progress-constellation")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/daily-progress-constellation") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/daily-progress-constellation") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/daily-progress-constellation") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/daily-progress-constellation") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/daily-progress-constellation") },
    ],
  }),
  component: DailyProgressPageEs,
});

function DailyProgressPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Retención · Progreso visual</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Constelación de Progreso Diario</h1>
        <p className="mt-3 text-muted-foreground">
          Canvas de visitas de retorno donde cada visita diaria enciende una nueva estrella. Construí una constelación personal a lo largo del tiempo y compartí el snapshot.
        </p>
      </header>
      <DailyProgressConstellation locale="es" />
      <PlaygroundNextStep currentId="daily-progress-constellation" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
