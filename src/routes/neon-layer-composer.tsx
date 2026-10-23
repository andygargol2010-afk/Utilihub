import { createFileRoute } from "@tanstack/react-router";
import { NeonLayerComposer } from "@/components/playgrounds/NeonLayerComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Neon Layer Composer | UtiliHub";
const description = cleanDescription(
  "Freehand multi-layer neon drawing canvas. Adjustable bloom, radial/mirror/kaleidoscope symmetry, stroke-attached particle emitters that fade with gravity and wind. Rich neon/aurora/sunset palettes. Title overlay baked into PNG share. URL deep-link.",
);

export const Route = createFileRoute("/neon-layer-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/neon-layer-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/neon-layer-composer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/neon-layer-composer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/neon-layer-composer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/neon-layer-composer") },
    ],
  }),
  component: NeonLayerPage,
});

function NeonLayerPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-500">Studio · Composition</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Neon Layer Composer</h1>
        <p className="mt-3 text-muted-foreground">
          Draw freehand multi-layer neon with <strong className="font-semibold text-foreground">symmetry modes</strong>, bloom, and particles that emit along your strokes then fade under gravity and wind. Title overlay baked into the PNG. Distinct from prism trails by layered neon + kaleidoscope emission.
        </p>
      </header>
      <NeonLayerComposer locale="en" />
      <PlaygroundNextStep currentId="neon-layer-composer" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
