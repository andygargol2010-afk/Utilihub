import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const MoleculeBuilderKit = lazy(() =>
  import("@/components/kits/MoleculeBuilderKit").then((m) => ({ default: m.MoleculeBuilderKit })),
);

const title = "Constructor de Moléculas | UtiliHub";
const description = cleanDescription(
  "Kit interactivo constructor de moléculas. Coloca átomos comunes (C, H, O, N), conéctalos con enlaces simples/dobles/triples y ve la fórmula molecular y masa molar en vivo.",
);

export const Route = createFileRoute("/es/constructor-moleculas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/constructor-moleculas") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/constructor-moleculas") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/constructor-moleculas") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/molecule-builder-kit") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/molecule-builder-kit") },
    ],
  }),
  component: ConstructorPage,
});

function ConstructorPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Química</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Constructor de Moléculas</h1>
        <p className="mt-3 text-muted-foreground">
          Coloca átomos comunes en la cuadrícula, conéctalos con enlaces y observa la fórmula molecular y la masa molar estimada en vivo.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <MoleculeBuilderKit locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
