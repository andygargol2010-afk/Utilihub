import { createFileRoute } from "@tanstack/react-router";
import { NeonSignatureComposer } from "@/components/playgrounds/NeonSignatureComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Neon Signature Composer | UtiliHub";
const description = cleanDescription(
  "Draw freehand multi-layer neon signatures. Persistent glowing paths, adjustable intensity, color gradients, sparkles. Touch-friendly visual composition studio.",
);

export const Route = createFileRoute("/studio/neon-signature-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/studio/neon-signature-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/studio/neon-signature-composer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/studio/neon-signature-composer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/studio/compositor-firma-neon") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/studio/neon-signature-composer") },
    ],
  }),
  component: NeonSignatureComposerPage,
});

function NeonSignatureComposerPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600">Studio · Composition</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Neon Signature Composer</h1>
        <p className="mt-3 text-muted-foreground">
          Draw freehand multi-layer strokes that become persistent neon paths with flowing glow, adjustable intensity, and optional sparkles. Compose temporary light signatures with high visual payoff.
        </p>
      </header>
      <NeonSignatureComposer locale="en" />

      <PlaygroundNextStep currentId="neon-signature-composer" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
