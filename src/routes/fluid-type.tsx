import { createFileRoute, Link } from "@tanstack/react-router";
import { FluidTypeSignature } from "@/components/playgrounds/FluidTypeSignature";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Fluid Type Signature | UtiliHub";
const description = cleanDescription(
  "Type a short name or phrase. Particles form the letters as a living fluid that responds to mouse or touch (attract or repel). Tune density, viscosity and mood. Shareable link, social buttons and PNG download.",
);

export const Route = createFileRoute("/fluid-type")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/fluid-type") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/fluid-type") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/fluid-type") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/fluid-type") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/fluid-type") },
    ],
  }),
  component: FluidTypePage,
});

function FluidTypePage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">Experience · Shareable</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Fluid Type Signature</h1>
        <p className="mt-3 text-muted-foreground">
          Type a short name or phrase. Particles <strong className="font-semibold text-foreground">form the letters as a living fluid</strong> that responds to mouse or touch (attract or repel modes).
          Adjust particle density, viscosity and color moods — then share the link or download a PNG.
        </p>
      </header>
      <FluidTypeSignature locale="en" />
      <section className="mt-10">
        <h2 className="text-lg font-bold">Keep exploring</h2>
        <Link to="/experiences" className="mt-3 inline-block text-sm font-bold text-sky-700 hover:underline">
          Experiences hub →
        </Link>
      </section>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
