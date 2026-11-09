import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const ScienceExperimentKit = lazy(() =>
  import("@/components/kits/ScienceExperimentKit").then((m) => ({ default: m.ScienceExperimentKit })),
);

const title = "Science Experiment Kit | UtiliHub";
const description = cleanDescription(
  "Interactive kids science experiment kit builder. Select a theme, review materials, follow guided steps with checkoffs, and track progress.",
);

export const Route = createFileRoute("/kits/science-experiment")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/kits/science-experiment") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/kits/science-experiment") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits/science-experiment") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits/experimento-ciencia") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits/science-experiment") },
    ],
  }),
  component: ScienceExperimentPage,
});

function ScienceExperimentPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Science experiments</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Science Experiment Kit</h1>
        <p className="mt-3 text-muted-foreground">
          Select a theme, review the materials list, and follow guided steps with checkoffs. Track your progress.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <ScienceExperimentKit locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
