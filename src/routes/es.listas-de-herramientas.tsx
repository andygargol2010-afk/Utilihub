import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const ToolPlaylists = lazy(() =>
  import("@/components/tool-playlists/ToolPlaylists").then((m) => ({ default: m.ToolPlaylists })),
);

const title = "Listas de herramientas — flujos paso a paso con herramientas gratis | UtiliHub";
const description = cleanDescription(
  "Elige un objetivo como planificar una mudanza, organizar una cena o salir de deudas y sigue una lista ordenada de herramientas gratis de UtiliHub, cada paso con una razón breve. Sin cuentas, nada sale de tu dispositivo.",
);

export const Route = createFileRoute("/es/listas-de-herramientas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/listas-de-herramientas") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/listas-de-herramientas") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/listas-de-herramientas") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/tool-playlists") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/tool-playlists") },
    ],
  }),
  component: ListasDeHerramientasPage,
});

function ListasDeHerramientasPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Flujos curados</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Listas de herramientas</h1>
        <p className="mt-3 text-muted-foreground">
          Elige un objetivo y sigue una lista corta y ordenada de herramientas reales de UtiliHub. Cada paso explica por qué va ahora y se abre con un toque.
        </p>
      </header>
      <div className="max-w-2xl">
        <Suspense fallback={<div className="min-h-[320px] rounded-2xl border border-border bg-card" aria-busy="true" />}>
          <ToolPlaylists locale="es" />
        </Suspense>
      </div>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
