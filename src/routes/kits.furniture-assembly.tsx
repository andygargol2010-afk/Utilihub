import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const FurnitureAssemblyKit = lazy(() =>
  import("@/components/kits/FurnitureAssemblyKit").then((m) => ({ default: m.FurnitureAssemblyKit })),
);

const title = "Furniture Assembly Kit | UtiliHub";
const description = cleanDescription(
  "Interactive flatpack furniture assembly kit. Select shelf, desk or chair, assemble discrete parts in ordered steps, see live diagram, progress and share PNG or URL.",
);

export const Route = createFileRoute("/kits/furniture-assembly-kit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/kits/furniture-assembly-kit") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/kits/furniture-assembly-kit") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits/furniture-assembly-kit") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits/ensamblaje-muebles") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits/furniture-assembly-kit") },
    ],
  }),
  component: FurnitureAssemblyPage,
});

function FurnitureAssemblyPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Furniture assembler</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Furniture Assembly Kit</h1>
        <p className="mt-3 text-muted-foreground">
          Assemble flatpack furniture by placing discrete parts into ordered steps. See live diagram and progress.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <FurnitureAssemblyKit locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
