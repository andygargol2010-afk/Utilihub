import { createFileRoute } from "@tanstack/react-router";
import { DailyProgressConstellation } from "@/components/experiences/DailyProgressConstellation";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Daily Progress Constellation | UtiliHub";
const description = cleanDescription(
  "Interactive return-visit canvas. Each daily visit lights a new star and builds your personal progress constellation. Shareable snapshots. No accounts.",
);

export const Route = createFileRoute("/daily-progress-constellation")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/daily-progress-constellation") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/daily-progress-constellation") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/daily-progress-constellation") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/daily-progress-constellation") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/daily-progress-constellation") },
    ],
  }),
  component: DailyProgressPage,
});

function DailyProgressPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Retention · Visual progress</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Daily Progress Constellation</h1>
        <p className="mt-3 text-muted-foreground">
          A return-visit canvas where each daily visit lights a new star. Build a personal constellation over time and share the snapshot.
        </p>
      </header>
      <DailyProgressConstellation locale="en" />
      <PlaygroundNextStep currentId="daily-progress-constellation" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
