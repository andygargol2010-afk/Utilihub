import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const SocialHookComposer = lazy(() =>
  import("@/components/growth/SocialHookComposer").then((m) => ({ default: m.SocialHookComposer })),
);

const title = "Social Hook Composer | UtiliHub";
const description = cleanDescription(
  "Interactive template lab for shareable social media hooks. Select a pattern, fill blanks, see live preview, copy text or download branded PNG.",
);

export const Route = createFileRoute("/growth/social-hook-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/growth/social-hook-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/growth/social-hook-composer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/growth/social-hook-composer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/crecimiento/compositor-ganchos-sociales") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/growth/social-hook-composer") },
    ],
  }),
  component: SocialHookPage,
});

function SocialHookPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">Growth · Share hooks</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Social Hook Composer</h1>
        <p className="mt-3 text-muted-foreground">
          Select a proven hook pattern, fill the blanks, and get a live preview ready to copy or share as a branded PNG.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <SocialHookComposer locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
