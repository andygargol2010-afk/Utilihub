import { createFileRoute, Link } from "@tanstack/react-router";
import { ParticlePostcard } from "@/components/playgrounds/ParticlePostcard";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Particle Postcard | UtiliHub";
const description = cleanDescription(
  "Type a short message. Particles swarm to form glowing text. Tune density, strength and mood colors. Shareable link, social buttons and PNG download.",
);

export const Route = createFileRoute("/postcard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/postcard") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/postcard") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/postcard") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/postcard") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/postcard") },
    ],
  }),
  component: PostcardPage,
});

function PostcardPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Experience · Shareable</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Particle Postcard</h1>
        <p className="mt-3 text-muted-foreground">
          Type a short message. Particles <strong className="font-semibold text-foreground">swarm to form the text</strong> with glowing trails.
          Adjust density, swarm strength and mood colors — then share the link or download a PNG.
        </p>
      </header>
      <ParticlePostcard locale="en" />
      <section className="mt-10">
        <h2 className="text-lg font-bold">Keep exploring</h2>
        <Link to="/experiences" className="mt-3 inline-block text-sm font-bold text-violet-700 hover:underline">
          Experiences hub →
        </Link>
      </section>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
