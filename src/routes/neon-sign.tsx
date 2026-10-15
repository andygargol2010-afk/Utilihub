import { createFileRoute } from "@tanstack/react-router";
import { NeonSignature } from "@/components/playgrounds/NeonSignature";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Neon Signature Studio | UtiliHub";
const description = cleanDescription(
  "Type text and turn it into a glowing animated neon sign. Tube glow, flicker, color from hash or picker. Download PNG and share via URL. Neon text generator.",
);

export const Route = createFileRoute("/neon-sign")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/neon-sign") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/neon-sign") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/neon-sign") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/neon-sign") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/neon-sign") },
    ],
  }),
  component: NeonSignPage,
});

function NeonSignPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600">Experience · Shareable</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Neon Signature Studio</h1>
        <p className="mt-3 text-muted-foreground">
          Type any text. It becomes a <strong className="font-semibold text-foreground">glowing animated neon tube sign</strong> with flicker and color derived from a hash or the hue slider.
          Immediate visual payoff. Download a PNG or share the URL state.
        </p>
      </header>
      <NeonSignature locale="en" />

      <PlaygroundNextStep currentId="neon-sign" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
