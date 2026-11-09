import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const SocialHookComposer = lazy(() =>
  import("@/components/growth/SocialHookComposer").then((m) => ({ default: m.SocialHookComposer })),
);

const title = "Compositor de Ganchos Sociales | UtiliHub";
const description = cleanDescription(
  "Laboratorio interactivo de plantillas para ganchos de redes sociales compartibles. Selecciona un patrón, rellena los huecos, ve la vista previa en vivo, copia el texto o descarga PNG con marca.",
);

export const Route = createFileRoute("/es/crecimiento/compositor-ganchos-sociales")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/crecimiento/compositor-ganchos-sociales") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/crecimiento/compositor-ganchos-sociales") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/crecimiento/compositor-ganchos-sociales") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/growth/social-hook-composer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/growth/social-hook-composer") },
    ],
  }),
  component: CompositorGanchosPage,
});

function CompositorGanchosPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">Crecimiento · Ganchos para compartir</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Compositor de Ganchos Sociales</h1>
        <p className="mt-3 text-muted-foreground">
          Selecciona un patrón de gancho probado, rellena los huecos y obtén una vista previa en vivo lista para copiar o compartir como PNG con marca.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <SocialHookComposer locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
