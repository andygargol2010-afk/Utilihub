import { createFileRoute } from "@tanstack/react-router";
import { GravityRibbonCanvas } from "@/components/playgrounds/GravityRibbonCanvas";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Gravity Ribbon Canvas | UtiliHub";
const description = cleanDescription(
  "Sketch freeform paths that become flowing gravity ribbons. Particles follow them with glowing trails. Tune attraction, speed, themes. Touch-friendly.",
);

export const Route = createFileRoute("/playgrounds/gravity-ribbon-canvas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/playgrounds/gravity-ribbon-canvas") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/playgrounds/gravity-ribbon-canvas") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/gravity-ribbon-canvas") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/lienzo-cintas-gravedad") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/gravity-ribbon-canvas") },
    ],
  }),
  component: GravityRibbonPageEn,
});

function GravityRibbonPageEn() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Gravity Ribbon Canvas</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Draw freeform ribbons. Particles are pulled toward them and leave persistent glowing trails that form temporary signatures. Multiple ribbons interact.
        </p>
      </header>
      <GravityRibbonCanvas locale="en" />

      <PlaygroundNextStep currentId="gravity-ribbon-canvas" locale="en" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
