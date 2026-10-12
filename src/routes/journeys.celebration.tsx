import { createFileRoute } from "@tanstack/react-router";
import { CelebrationJourney } from "@/components/journeys/CelebrationJourney";
import { absoluteUrl, hreflangLinks, ogImage, SITE_NAME, cleanDescription } from "@/lib/seo";

const title = "Celebration Journey | UtiliHub";
const description = cleanDescription("Guided multi-step celebration planner. Occasion, guests, budget breakdown, checklist, and live invite card. Shareable state.");

export const Route = createFileRoute("/journeys/celebration")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/journeys/celebration") },
      { property: "og:image", content: ogImage() },
      { property: "og:site_name", content: SITE_NAME },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/journeys/celebration") },
      ...hreflangLinks("/journeys/celebration", "/es/viajes/celebracion"),
    ],
  }),
  component: CelebrationPage,
});

function CelebrationPage() {
  return (
    <main className="container-page py-8">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Journey</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Celebration Journey</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Plan your event in guided steps. Visual occasion and guests, interactive budget, checklist, and a live invite card. Share the full state via URL.
        </p>
      </header>
      <CelebrationJourney locale="en" />
    </main>
  );
}
