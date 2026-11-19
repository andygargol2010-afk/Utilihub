import { createFileRoute } from "@tanstack/react-router";
import { PrismTrailComposer } from "@/components/playgrounds/PrismTrailComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Prism Trail Composer | UtiliHub";
const description = cleanDescription(
  "Freehand multi-layer light-prism trails. Draw paths that split into rainbow refraction beams with live bloom, adjustable dispersion and speed. Persistent trails with particle afterglow. Export shareable PNG.",
);

export const Route = createFileRoute("/studio/prism-trail-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/studio/prism-trail-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/studio/prism-trail-composer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/studio/prism-trail-composer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/studio/compositor-estela-prisma") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/studio/prism-trail-composer") },
    ],
  }),
  component: PrismTrailPage,
});

function PrismTrailPage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/studio/prism-trail-composer");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Studio · Composition</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Prism Trail Composer</h1>
          </div>
          <ExperienceShareButton
            title="Prism Trail Composer"
            url={shareUrl}
            locale="en"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Draw freehand paths that split into <strong className="font-semibold text-foreground">rainbow refraction beams</strong> with live bloom, adjustable dispersion and particle speed. Trails persist with colorful afterglow. Export a shareable PNG of your light composition.
        </p>
      </header>
      <PrismTrailComposer locale="en" />

      <PlaygroundNextStep currentId="prism-trail-composer" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
