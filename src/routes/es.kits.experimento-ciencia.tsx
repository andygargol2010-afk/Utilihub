import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const ScienceExperimentKit = lazy(() =>
  import("@/components/kits/ScienceExperimentKit").then((m) => ({ default: m.ScienceExperimentKit })),
);

const title = "Kit de Experimento de Ciencia | UtiliHub";
const description = cleanDescription(
  "Kit interactivo de experimentos de ciencia para niños. Selecciona un tema, revisa materiales, sigue pasos guiados con casillas y sigue el progreso.",
);

export const Route = createFileRoute("/es/kits/experimento-ciencia")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/kits/experimento-ciencia") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/kits/experimento-ciencia") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits/experimento-ciencia") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits/science-experiment") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits/science-experiment") },
    ],
  }),
  component: ExperimentoCienciaPage,
});

function ExperimentoCienciaPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Experimentos de ciencia</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Kit de Experimento de Ciencia</h1>
        <p className="mt-3 text-muted-foreground">
          Selecciona un tema, revisa la lista de materiales y sigue los pasos guiados con casillas de verificación. Sigue tu progreso.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <ScienceExperimentKit locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
