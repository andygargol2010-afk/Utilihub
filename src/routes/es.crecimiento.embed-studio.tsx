import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const EmbedStudio = lazy(() =>
  import("@/components/growth/EmbedStudio").then((m) => ({ default: m.EmbedStudio })),
);

const title = "Embed Studio — Juegos de UtiliHub en tu sitio | UtiliHub";
const description = cleanDescription(
  "Elige un juego de UtiliHub, define tamaño, tema e idioma, míralo en vivo y copia un iframe listo para pegar en tu blog o página de clase.",
);

export const Route = createFileRoute("/es/crecimiento/embed-studio")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/crecimiento/embed-studio") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/crecimiento/embed-studio") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/growth/embed-studio") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/crecimiento/embed-studio") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/growth/embed-studio") },
    ],
  }),
  component: EmbedStudioPage,
});

function EmbedStudioPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Crecimiento · Embed</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Embed Studio</h1>
        <p className="mt-3 text-muted-foreground">
          Pon un juego de UtiliHub en tu blog, página de clase o sitio. Elige juego, tamaño, tema e idioma, mira la vista previa y copia el código iframe.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <EmbedStudio locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
