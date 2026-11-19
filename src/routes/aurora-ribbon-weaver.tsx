import { createFileRoute } from "@tanstack/react-router";
import { AuroraRibbonWeaver } from "@/components/playgrounds/AuroraRibbonWeaver";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Aurora Ribbon Weaver | UtiliHub";
const description = cleanDescription(
  "Draw freehand or waypoint paths that become flowing multi-ribbon aurora streams. Adjust width, speed, bloom, density and gravity. Live preview, PNG share with branding, EN+ES.",
);

export const Route = createFileRoute("/aurora-ribbon-weaver")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/aurora-ribbon-weaver") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/aurora-ribbon-weaver") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/aurora-ribbon-weaver") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/aurora-ribbon-weaver") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/aurora-ribbon-weaver") },
    ],
  }),
  component: AuroraRibbonPage,
});

function AuroraRibbonPage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/aurora-ribbon-weaver");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Playground · Shareable</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Aurora Ribbon Weaver</h1>
          </div>
          <ExperienceShareButton
            title="Aurora Ribbon Weaver"
            url={shareUrl}
            locale="en"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Draw freehand paths that become <strong className="font-semibold text-foreground">flowing multi-ribbon aurora streams</strong> with adjustable width, speed, bloom and particle density. Distinct ribbon-weaving composition + aurora bloom aesthetic.
        </p>
      </header>
      <AuroraRibbonWeaver locale="en" />

      <PlaygroundNextStep currentId="aurora-ribbon-weaver" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
