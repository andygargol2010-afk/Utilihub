import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const StreakConstellation = lazy(() =>
  import("@/components/experiences/StreakConstellation").then((m) => ({ default: m.StreakConstellation })),
);

const title = "Streak Constellation | UtiliHub";
const description = cleanDescription(
  "Daily streak constellation visualizer. Check in, place interactive stars on a growing map, export branded PNG and share a URL that restores progress. EN+ES.",
);

export const Route = createFileRoute("/streak-constellation")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/streak-constellation") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/streak-constellation") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/streak-constellation") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/constelacion-racha") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/streak-constellation") },
    ],
  }),
  component: StreakPage,
});

function StreakPage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/streak-constellation");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Retention \u00b7 Streak</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Streak Constellation</h1>
          </div>
          <ExperienceShareButton title="Streak Constellation" url={shareUrl} locale="en" variant="button" className="shrink-0" />
        </div>
        <p className="mt-3 text-muted-foreground">
          Check in daily, place stars interactively on a growing constellation, export a branded PNG and share a deep-link that restores your progress.
        </p>
      </header>
      <Suspense fallback={<div className="aspect-[16/9] animate-pulse rounded-2xl bg-muted" />}>
        <StreakConstellation locale="en" />
      </Suspense>
      <PlaygroundNextStep currentId="streak-constellation" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
