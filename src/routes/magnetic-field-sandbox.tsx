import { createFileRoute } from "@tanstack/react-router";
import { MagneticFieldSandbox } from "@/components/playgrounds/MagneticFieldSandbox";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Magnetic Field Sandbox | UtiliHub";
const description = cleanDescription(
  "Place and drag north and south magnetic poles. Live animated field lines update in real time. Share setups via URL or branded PNG. Educational magnetic field visualizer.",
);

export const Route = createFileRoute("/magnetic-field-sandbox")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/magnetic-field-sandbox") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/magnetic-field-sandbox") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/magnetic-field-sandbox") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/sandbox-campo-magnetico") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/magnetic-field-sandbox") },
    ],
  }),
  component: MagneticFieldPage,
});

function MagneticFieldPage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/magnetic-field-sandbox");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Playground · Shareable</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Magnetic Field Sandbox</h1>
          </div>
          <ExperienceShareButton
            title="Magnetic Field Sandbox"
            url={shareUrl}
            locale="en"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Place <strong className="font-semibold text-foreground">north and south poles</strong> and watch live field lines curve between them. Drag to rearrange, adjust strength and line density, then export a branded PNG or share the setup via URL.
        </p>
      </header>
      <MagneticFieldSandbox locale="en" />

      <PlaygroundNextStep currentId="magnetic-field-sandbox" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
