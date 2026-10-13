import { createFileRoute } from "@tanstack/react-router";
import { ParticleSignaturePlayground } from "@/components/playgrounds/ParticleSignaturePlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Particle Signature Playground | UtiliHub";
const description = cleanDescription(
  "Type a name or phrase to generate a unique shareable particle signature. Watch particles orbit the seeded attractors. Mobile-friendly, instant share link.",
);

export const Route = createFileRoute("/playgrounds/particle-signature")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/playgrounds/particle-signature") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/playgrounds/particle-signature") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/particle-signature") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/firma-particulas") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/particle-signature") },
    ],
  }),
  component: ParticleSignaturePage,
});

function ParticleSignaturePage() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Particle Signature</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Generate a unique visual signature from any name or phrase. Particles orbit the text-seeded attractors. Share your link.
        </p>
      </header>
      <ParticleSignaturePlayground locale="en" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
