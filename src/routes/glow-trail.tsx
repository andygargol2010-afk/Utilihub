import { createFileRoute } from "@tanstack/react-router";
import { GlowTrailComposer } from "@/components/playgrounds/GlowTrailComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Glow Trail Composer | UtiliHub";
const description = cleanDescription(
  "Draw glowing light trails that leave persistent particle afterglows, blooms, and looping animations. Color gradients, thickness controls, shareable snapshot and URL state.",
);

export const Route = createFileRoute("/glow-trail")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/glow-trail") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/glow-trail") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/glow-trail") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/glow-trail") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/glow-trail") },
    ],
  }),
  component: GlowTrailPage,
});

function GlowTrailPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600">Studio · Shareable</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Glow Trail Composer</h1>
        <p className="mt-3 text-muted-foreground">
          Draw with mouse or finger. Glowing light trails leave <strong className="font-semibold text-foreground">persistent particle afterglows and blooms</strong> that keep animating. Adjust thickness and gradient colors. Immediate visual payoff. Share the URL or snapshot PNG.
        </p>
      </header>
      <GlowTrailComposer locale="en" />

      <PlaygroundNextStep currentId="glow-trail" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
