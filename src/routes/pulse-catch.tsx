import { createFileRoute } from "@tanstack/react-router";
import { PulseCatch } from "@/components/playgrounds/PulseCatch";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Pulse Catch | UtiliHub";
const description = cleanDescription(
  "Fast reaction game: catch glowing sparks before they fade. Build combos, particle bursts, track your best score. Immediate visual payoff. Shareable high score.",
);

export const Route = createFileRoute("/pulse-catch")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/pulse-catch") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pulse-catch") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/pulse-catch") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/pulse-catch") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/pulse-catch") },
    ],
  }),
  component: PulseCatchPage,
});

function PulseCatchPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Game · Reaction</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Pulse Catch</h1>
        <p className="mt-3 text-muted-foreground">
          Catch glowing <strong className="font-semibold text-foreground">sparks</strong> before they fade. Build combos for bigger points. Particle bursts on every catch. Immediate visual payoff.
        </p>
      </header>
      <PulseCatch locale="en" />

      <PlaygroundNextStep currentId="pulse-catch" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
