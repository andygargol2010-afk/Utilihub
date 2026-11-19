import { createFileRoute } from "@tanstack/react-router";
import { EchoWaveSignature } from "@/components/playgrounds/EchoWaveSignature";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Echo Wave Signature | UtiliHub";
const description = cleanDescription(
  "Type a name or phrase. Generate a unique multi-layer animated waveform from character frequencies and hash. Click to pluck ripples that interfere. Shareable PNG download.",
);

export const Route = createFileRoute("/echo-wave")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/echo-wave") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/echo-wave") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/echo-wave") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/echo-wave") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/echo-wave") },
    ],
  }),
  component: EchoWavePage,
});

function EchoWavePage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Experience · Shareable</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Echo Wave Signature</h1>
        <p className="mt-3 text-muted-foreground">
          Type a name or phrase. A unique <strong className="font-semibold text-foreground">multi-layer sine waveform</strong> emerges from character code frequencies and hash.
          Click or drag on the canvas to pluck ripples that interfere with the waves. Download a PNG to share.
        </p>
      </header>
      <EchoWaveSignature locale="en" />

      <PlaygroundNextStep currentId="echo-wave" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
