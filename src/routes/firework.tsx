import { createFileRoute, Link } from "@tanstack/react-router";
import { FireworkSignature } from "@/components/playgrounds/FireworkSignature";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Firework Signature | UtiliHub";
const description = cleanDescription(
  "Type a short name or phrase. Fireworks launch, form the letters, then explode into a unique colored constellation. Tune burst size, spark density and mood. Shareable link, social buttons and PNG download.",
);

export const Route = createFileRoute("/firework")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/firework") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/firework") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/firework") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/firework") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/firework") },
    ],
  }),
  component: FireworkPage,
});

function FireworkPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Experience · Shareable</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Firework Signature</h1>
        <p className="mt-3 text-muted-foreground">
          Type a short name or phrase. Particles <strong className="font-semibold text-foreground">launch as fireworks that form the letters</strong> then explode into a unique colored constellation.
          Adjust burst size, spark density and mood colors — then share the link or download a PNG.
        </p>
      </header>
      <FireworkSignature locale="en" />

      <PlaygroundNextStep currentId="firework" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
