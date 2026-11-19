import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const MoleculeBuilderKit = lazy(() =>
  import("@/components/kits/MoleculeBuilderKit").then((m) => ({ default: m.MoleculeBuilderKit })),
);

const title = "Molecule Builder Kit | UtiliHub";
const description = cleanDescription(
  "Interactive molecule builder. Place common atoms (C, H, O, N), connect with single/double/triple bonds, see live molecular formula and molar mass.",
);

export const Route = createFileRoute("/molecule-builder-kit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/molecule-builder-kit") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/molecule-builder-kit") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/molecule-builder-kit") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/constructor-moleculas") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/molecule-builder-kit") },
    ],
  }),
  component: MoleculePage,
});

function MoleculePage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Chemistry</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Molecule Builder Kit</h1>
        <p className="mt-3 text-muted-foreground">
          Place common atoms on the grid, connect them with bonds, and see the live molecular formula and estimated molar mass.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <MoleculeBuilderKit locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
