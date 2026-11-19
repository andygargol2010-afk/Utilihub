import { createFileRoute } from "@tanstack/react-router";
import { FloorPlanStudio } from "@/components/playgrounds/FloorPlanStudio";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Floor Plan Studio | UtiliHub";
const description = cleanDescription(
  "Interactive 2D floor plan compositor. Add, move and rotate rooms and furniture. Live area calculation, wall colors and shareable URL.",
);

export const Route = createFileRoute("/playgrounds/floor-plan")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/playgrounds/floor-plan") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/playgrounds/floor-plan") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/floor-plan") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/plano-planta") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/floor-plan") },
    ],
  }),
  component: FloorPlanPageEn,
});

function FloorPlanPageEn() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Studio</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Floor Plan Studio</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Compose rooms and furniture on a live canvas. Drag to move, rotate, change wall colors and see total area update instantly. Share your plan via URL.
        </p>
      </header>
      <FloorPlanStudio locale="en" />

      <PlaygroundNextStep currentId="floor-plan" locale="en" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
