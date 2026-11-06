import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const GoalProgressJourney = lazy(() =>
  import("@/components/journeys/GoalProgressJourney").then((m) => ({ default: m.GoalProgressJourney })),
);

const title = "Goal Progress Journey | UtiliHub";
const description = cleanDescription(
  "Interactive multi-stage personal goal progress journey. Choose a category, check off ordered stages, see live progress, and share your completion.",
);

export const Route = createFileRoute("/journeys/goal-progress")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/journeys/goal-progress") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/journeys/goal-progress") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/journeys/goal-progress") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/jornadas/progreso-objetivo") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/journeys/goal-progress") },
    ],
  }),
  component: GoalProgressPage,
});

function GoalProgressPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Journey · Goal progress</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Goal Progress Journey</h1>
        <p className="mt-3 text-muted-foreground">
          Choose a goal category, work through ordered stages with checklists, and watch your progress bar fill.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <GoalProgressJourney locale="en" />
      </Suspense>
      <PlaygroundNextStep currentId="goal-progress-journey" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
