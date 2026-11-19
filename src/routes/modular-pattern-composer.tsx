import { createFileRoute } from "@tanstack/react-router";
import { ModularPatternComposer } from "@/components/playgrounds/ModularPatternComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Modular Pattern Composer | UtiliHub";
const description = cleanDescription(
  "Place modular tiles on a grid with live procedural animations (flow, pulse, morph). Multi-layers, symmetry modes, tile library, palettes, playback controls. PNG share with baked title and tile count. URL deep-link. Distinct from freehand neon by repeatable systems.",
);

export const Route = createFileRoute("/modular-pattern-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/modular-pattern-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/modular-pattern-composer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/modular-pattern-composer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/modular-pattern-composer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/modular-pattern-composer") },
    ],
  }),
  component: ModularPatternPage,
});

function ModularPatternPage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/modular-pattern-composer");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-500">Studio · Composition</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Modular Pattern Composer</h1>
          </div>
          <ExperienceShareButton
            title="Modular Pattern Composer"
            url={shareUrl}
            locale="en"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Place modular tiles on a grid with <strong className="font-semibold text-foreground">live procedural animations</strong> (flow, pulse, morph). Symmetry multiplies placements. Distinct from freehand neon-layer by repeatable tile systems + animation playback. PNG share with title and tile count.
        </p>
      </header>
      <ModularPatternComposer locale="en" />
      <PlaygroundNextStep currentId="modular-pattern-composer" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
