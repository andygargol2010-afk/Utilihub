import { createFileRoute } from "@tanstack/react-router";
import { ConstellationStudio } from "@/components/playgrounds/ConstellationStudio";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Constellation Share Studio | UtiliHub";
const description = cleanDescription(
  "Drag stars, connect lines, load myth presets and share your constellation via URL. Live sky preview.",
);

export const Route = createFileRoute("/playgrounds/constellation")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/playgrounds/constellation") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/playgrounds/constellation") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/constellation") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/constelacion") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/constellation") },
    ],
  }),
  component: ConstellationPageEn,
});

function ConstellationPageEn() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Constellation Share Studio</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Drag stars across the night sky, connect them into lines, load classic myths, and share the exact constellation with a link.
        </p>
      </header>
      <ConstellationStudio locale="en" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
