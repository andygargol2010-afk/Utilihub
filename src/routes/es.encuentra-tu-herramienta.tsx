import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const ToolMatchmaker = lazy(() =>
  import("@/components/tool-matchmaker/ToolMatchmaker").then((m) => ({ default: m.ToolMatchmaker })),
);

const title = "Encuentra tu herramienta — 3 preguntas, tu mejor opción en UtiliHub | UtiliHub";
const description = cleanDescription(
  "Responde tres preguntas rápidas y obtén un top 3 de los juegos, simuladores, kits y planificadores gratis que encajan con lo que quieres hacer ahora. Sin cuentas, nada sale de tu dispositivo.",
);

export const Route = createFileRoute("/es/encuentra-tu-herramienta")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/encuentra-tu-herramienta") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/encuentra-tu-herramienta") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/encuentra-tu-herramienta") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/find-your-tool") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/find-your-tool") },
    ],
  }),
  component: EncuentraTuHerramientaPage,
});

function EncuentraTuHerramientaPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Guía rápida · 3 preguntas</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Encuentra tu herramienta</h1>
        <p className="mt-3 text-muted-foreground">
          ¿No sabes por dónde empezar? Cuéntanos qué te apetece hacer y te llevamos al juego, simulador, kit o planificador que mejor encaja.
        </p>
      </header>
      <div className="max-w-2xl">
        <Suspense fallback={<div className="min-h-[360px] rounded-2xl border border-border bg-card" aria-busy="true" />}>
          <ToolMatchmaker locale="es" />
        </Suspense>
      </div>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
