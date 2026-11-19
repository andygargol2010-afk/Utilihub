import { createFileRoute } from "@tanstack/react-router";
import { AuraCardComposer } from "@/components/playgrounds/AuraCardComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Aura Card Composer | UtiliHub";
const description = cleanDescription(
  "Design a personal aura card with color schemes, particle density, bloom and background gradients. Custom quote or name baked into a high-quality PNG. Shareable visual delight.",
);

export const Route = createFileRoute("/aura-card")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/aura-card") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/aura-card") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/aura-card") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/aura-card") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/aura-card") },
    ],
  }),
  component: AuraCardPage,
});

function AuraCardPage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/aura-card");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Shareable · Aura</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Aura Card Composer</h1>
          </div>
          <ExperienceShareButton
            title="Aura Card Composer"
            url={shareUrl}
            locale="en"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Design your personal <strong className="font-semibold text-foreground">aura card</strong> with selectable color schemes, particle density, bloom and background gradients. Add a custom quote or name — then download a high-quality PNG with the title baked in.
        </p>
      </header>
      <AuraCardComposer locale="en" />

      <PlaygroundNextStep currentId="aura-card-share" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
