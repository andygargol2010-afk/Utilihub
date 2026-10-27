import { createFileRoute } from "@tanstack/react-router";
import { FluidInkFlowPlayground } from "@/components/playgrounds/FluidInkFlowPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Fluid Ink Flow Playground | UtiliHub";
const description = cleanDescription(
  "Draw freehand strokes that become viscous flowing multi-color ink. Adjust viscosity, density, gravity and surface tension. Live mixing, pause, randomize, PNG share with branding.",
);

export const Route = createFileRoute("/fluid-ink-flow-playground")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/fluid-ink-flow-playground") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "fr", href: absoluteUrl("/fr/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/fluid-ink-flow-playground") },
    ],
  }),
  component: FluidInkFlowPage,
});

function FluidInkFlowPage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/fluid-ink-flow-playground");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Playground · Shareable</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Fluid Ink Flow Playground</h1>
          </div>
          <ExperienceShareButton
            title="Fluid Ink Flow Playground"
            url={shareUrl}
            locale="en"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Draw freehand strokes that become <strong className="font-semibold text-foreground">viscous flowing multi-color ink</strong> with adjustable viscosity, color mixing on overlaps, particle density, gravity and surface tension.
          Pause, randomize or clear — then share a branded PNG.
        </p>
      </header>
      <FluidInkFlowPlayground locale="en" />

      <PlaygroundNextStep currentId="fluid-ink-flow-playground" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
