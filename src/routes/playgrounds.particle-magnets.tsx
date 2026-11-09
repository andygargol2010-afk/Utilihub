import { createFileRoute } from "@tanstack/react-router";
import { ParticleMagnetLab } from "@/components/playgrounds/ParticleMagnetLab";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Particle Magnet Lab | UtiliHub";
const description = cleanDescription(
  "Place attract and repel magnets on an open canvas. Particles stream and leave fading trails that visualize the magnetic field. Drag, tune strength, color modes, PNG share.",
);

export const Route = createFileRoute("/playgrounds/particle-magnets")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/playgrounds/particle-magnets") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/playgrounds/particle-magnets") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/particle-magnets") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/imanes-particulas") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/particle-magnets") },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Particle Magnet Lab</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Place magnets that attract or repel. Free particles stream and leave organic fading trails that reveal the field. Drag, tune, share.
        </p>
      </header>
      <ParticleMagnetLab locale="en" />

      <PlaygroundNextStep currentId="particle-magnet-lab" locale="en" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
