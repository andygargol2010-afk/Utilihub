import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const RecipeAssemblyKit = lazy(() =>
  import("@/components/kits/RecipeAssemblyKit").then((m) => ({ default: m.RecipeAssemblyKit })),
);

const title = "Kit de Ensamblaje de Receta | UtiliHub";
const description = cleanDescription(
  "Kit interactivo de ensamblaje de recetas multi-paso. Elige cocina, agrega tarjetas de ingredientes a pasos ordenados, ve timeline y lista de compras, comparte PNG o URL.",
);

export const Route = createFileRoute("/es/kits/ensamblaje-receta")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/kits/ensamblaje-receta") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/kits/ensamblaje-receta") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits/ensamblaje-receta") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits/recipe-assembly") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits/recipe-assembly") },
    ],
  }),
  component: EnsamblajeRecetaPage,
});

function EnsamblajeRecetaPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Ensamblador de recetas</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Kit de Ensamblaje de Receta</h1>
        <p className="mt-3 text-muted-foreground">
          Construye recetas multi-paso agregando tarjetas de ingredientes discretas a pasos ordenados. Ve vista previa y lista de compras.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <RecipeAssemblyKit locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
