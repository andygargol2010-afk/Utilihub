import { createFileRoute } from "@tanstack/react-router";
import { SeatingChartStudio } from "@/components/playgrounds/SeatingChartStudio";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Event Seating Chart Studio | UtiliHub";
const description = cleanDescription(
  "Interactive drag-and-drop event seating chart. Assign guests to tables, see live capacity warnings, and share the full arrangement via URL.",
);

export const Route = createFileRoute("/playgrounds/seating-chart")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/playgrounds/seating-chart") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/playgrounds/seating-chart") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/seating-chart") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/plano-asientos") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/seating-chart") },
    ],
  }),
  component: SeatingChartPageEn,
});

function SeatingChartPageEn() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Studio</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Event Seating Chart Studio</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Drag guests onto visual tables. Live capacity feedback and warnings. Share the full seating arrangement via URL.
        </p>
      </header>
      <SeatingChartStudio locale="en" />

      <PlaygroundNextStep currentId="seating-chart" locale="en" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
