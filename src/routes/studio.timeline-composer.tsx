import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const TimelineEventComposer = lazy(() =>
  import("@/components/studio/TimelineEventComposer").then((m) => ({ default: m.TimelineEventComposer })),
);

const title = "Timeline Event Composer | UtiliHub";
const description = cleanDescription(
  "Interactive timeline event composer. Add event cards, reorder them, see a live vertical SVG timeline, and share via deep-link URL.",
);

export const Route = createFileRoute("/studio/timeline-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/studio/timeline-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/studio/timeline-composer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/studio/timeline-composer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/estudio/compositor-linea-tiempo") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/studio/timeline-composer") },
    ],
  }),
  component: TimelineComposerPage,
});

function TimelineComposerPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Studio · Composition</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Timeline Event Composer</h1>
        <p className="mt-3 text-muted-foreground">
          Add and reorder event cards. Watch the live vertical SVG timeline update. Deep-link URL for sharing.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <TimelineEventComposer locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
