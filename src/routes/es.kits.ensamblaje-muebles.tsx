import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const FurnitureAssemblyKit = lazy(() =>
  import("@/components/kits/FurnitureAssemblyKit").then((m) => ({ default: m.FurnitureAssemblyKit })),
);

const title = "Kit de Ensamblaje de Muebles | UtiliHub";
const description = cleanDescription(
  "Kit interactivo de ensamblaje de muebles flatpack. Selecciona estantería, escritorio o silla, ensambla partes discretas en pasos ordenados, ve diagrama live, progreso y comparte PNG o URL.",
);

export const Route = createFileRoute("/es/kits/ensamblaje-muebles")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/kits/ensamblaje-muebles") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/kits/ensamblaje-muebles") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits/ensamblaje-muebles") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits/furniture-assembly-kit") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits/furniture-assembly-kit") },
    ],
  }),
  component: EnsamblajeMueblesPage,
});

function EnsamblajeMueblesPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Ensamblador de muebles</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Kit de Ensamblaje de Muebles</h1>
        <p className="mt-3 text-muted-foreground">
          Ensambla muebles flatpack colocando partes discretas en pasos ordenados. Ve diagrama live y progreso.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <FurnitureAssemblyKit locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
