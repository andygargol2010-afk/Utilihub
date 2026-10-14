import { createFileRoute } from "@tanstack/react-router";
import { KaleidoscopeMandalaStudio } from "@/components/playgrounds/KaleidoscopeMandalaStudio";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Kaleidoscope Mandala Studio | UtiliHub";
const description = cleanDescription(
  "Draw with mouse or finger and watch instant rotational symmetry bloom into mandalas. Neon, sparkle, glow and ink brushes. Export PNG.",
);

export const Route = createFileRoute("/playgrounds/kaleidoscope-mandala")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/playgrounds/kaleidoscope-mandala") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/playgrounds/kaleidoscope-mandala") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/kaleidoscope-mandala") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/kaleidoscopio-mandala") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/kaleidoscope-mandala") },
    ],
  }),
  component: KaleidoscopePageEn,
});

function KaleidoscopePageEn() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Kaleidoscope Mandala Studio</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Draw freely. Every stroke is mirrored in real time across 4, 6 or 8-fold rotational symmetry — instant blooming mandalas. Switch brushes and colors live. Export a high-res PNG or share.
        </p>
      </header>
      <KaleidoscopeMandalaStudio locale="en" />

      <PlaygroundNextStep currentId="kaleidoscope-mandala" locale="en" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
