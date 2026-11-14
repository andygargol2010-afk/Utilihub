import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const EmbedStudio = lazy(() =>
  import("@/components/growth/EmbedStudio").then((m) => ({ default: m.EmbedStudio })),
);

const title = "Embed Studio — Add UtiliHub Games to Your Site | UtiliHub";
const description = cleanDescription(
  "Pick a UtiliHub game, choose size, theme and language, preview it live and copy a ready-to-paste iframe snippet for your blog or classroom page.",
);

export const Route = createFileRoute("/growth/embed-studio")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/growth/embed-studio") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/growth/embed-studio") },
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
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Growth · Embed</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Embed Studio</h1>
        <p className="mt-3 text-muted-foreground">
          Put a UtiliHub game on your own blog, class page or site. Pick a game, size, theme and language, preview it live, then copy the iframe snippet.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <EmbedStudio locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
