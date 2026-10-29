import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const RecipeAssemblyKit = lazy(() =>
  import("@/components/kits/RecipeAssemblyKit").then((m) => ({ default: m.RecipeAssemblyKit })),
);

const title = "Recipe Assembly Kit | UtiliHub";
const description = cleanDescription(
  "Interactive multi-step recipe assembly kit. Pick a cuisine, add discrete ingredient cards to ordered steps, see live timeline and shopping list, share PNG or URL.",
);

export const Route = createFileRoute("/kits/recipe-assembly")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/kits/recipe-assembly") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/kits/recipe-assembly") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits/recipe-assembly") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits/ensamblaje-receta") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits/recipe-assembly") },
    ],
  }),
  component: RecipeAssemblyPage,
});

function RecipeAssemblyPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Recipe assembler</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Recipe Assembly Kit</h1>
        <p className="mt-3 text-muted-foreground">
          Build multi-step recipes by adding discrete ingredient cards to ordered steps. See live preview and shopping list.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <RecipeAssemblyKit locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
