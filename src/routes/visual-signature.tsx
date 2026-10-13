import { createFileRoute, Link } from "@tanstack/react-router";
import { ParticleSignaturePlayground } from "@/components/playgrounds/ParticleSignaturePlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Visual Signature | UtiliHub";
const description = cleanDescription(
  "Type your name and generate a unique particle visual signature. Shareable, instant, and a doorway to more experiences on UtiliHub.",
);

export const Route = createFileRoute("/visual-signature")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/visual-signature") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/visual-signature") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/visual-signature") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/firma-visual") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/visual-signature") },
    ],
  }),
  component: VisualSignaturePage,
});

function VisualSignaturePage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 text-center sm:text-left">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Visual experience
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Visual Signature
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Type your name or a phrase and watch a unique particle signature come to life.
          Share the link or keep exploring more experiences.
        </p>
      </header>

      <ParticleSignaturePlayground locale="en" />

      <div className="mt-8 flex flex-col items-center gap-3 sm:items-start">
        <Link
          to="/experiences"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          Explore more experiences →
        </Link>
        <p className="text-xs text-muted-foreground">
          Playgrounds, simulators, games, and interactive studios.
        </p>
      </div>

      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
