import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const ChoiceStoryJourney = lazy(() =>
  import("@/components/journeys/ChoiceStoryJourney").then((m) => ({ default: m.ChoiceStoryJourney })),
);

const title = "Choice Story Journey | UtiliHub";
const description = cleanDescription(
  "Interactive narrative choice journey. Click through branching decision cards, track progress waypoints, and reach unique endings with a shareable summary card.",
);

export const Route = createFileRoute("/choice-story-journey")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/choice-story-journey") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/choice-story-journey") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/choice-story-journey") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/viaje-historia-elecciones") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/choice-story-journey") },
    ],
  }),
  component: ChoiceStoryPage,
});

function ChoiceStoryPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Journey · Narrative choices</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Choice Story Journey</h1>
        <p className="mt-3 text-muted-foreground">
          Select from branching decision cards at each stage. Watch your progress waypoints fill as you reach one of several endings.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" /> }>
        <ChoiceStoryJourney locale="en" />
      </Suspense>
      <PlaygroundNextStep currentId="choice-story-journey" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
