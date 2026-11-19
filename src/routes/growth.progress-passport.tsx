import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const ProgressPassport = lazy(() =>
  import("@/components/growth/ProgressPassport").then((m) => ({ default: m.ProgressPassport })),
);

const title = "Progress Passport | UtiliHub";
const description = cleanDescription(
  "Interactive digital progress passport. Earn stamps by completing UtiliHub experiences, track progress, download branded PNG or share link.",
);

export const Route = createFileRoute("/growth/progress-passport")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/growth/progress-passport") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/growth/progress-passport") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/growth/progress-passport") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/crecimiento/pasaporte-progreso") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/growth/progress-passport") },
    ],
  }),
  component: ProgressPassportPage,
});

function ProgressPassportPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Growth · Retention</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Progress Passport</h1>
        <p className="mt-3 text-muted-foreground">
          Earn discrete stamps across UtiliHub kits, games and simulators. Watch your collection grow, then share a branded PNG or deep-link.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <ProgressPassport locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
