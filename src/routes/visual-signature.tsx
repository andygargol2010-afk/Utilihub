import { createFileRoute, Link } from "@tanstack/react-router";
import { TextParticlesPlayground } from "@/components/playgrounds/TextParticlesPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Visual Signature | UtiliHub";
const description = cleanDescription(
  "Type your name and watch particles fly in to form the letters. Shareable, downloadable, and a doorway to more experiences on UtiliHub.",
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
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
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
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
          Experience · Shareable
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Visual Signature</h1>
        <p className="mt-3 text-muted-foreground">
          Type your name: particles move and <strong className="font-semibold text-foreground">form the letters</strong>.
          Share the link or download a PNG — more experiences wait below.
        </p>
        <ol className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-slate-600">
          <li className="rounded-full bg-violet-100 px-3 py-1">1 · Type</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">2 · Letters form</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">3 · Share or download</li>
        </ol>
      </header>

      <TextParticlesPlayground locale="en" entryMode />

      <section className="mt-10 space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Keep exploring</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/experiences"
            className="group rounded-2xl border border-violet-900/15 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>
              ✨
            </span>
            <p className="mt-2 text-base font-bold text-slate-900">Experiences hub</p>
            <p className="mt-1 text-sm text-slate-600">Playgrounds, simulators, games, and studios.</p>
            <span className="mt-3 inline-block text-sm font-bold text-violet-700 group-hover:underline">
              Open hub →
            </span>
          </Link>
          <Link
            to="/playgrounds/particle-signature"
            className="group rounded-2xl border border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>
              🌀
            </span>
            <p className="mt-2 text-base font-bold text-slate-900">Attractor orbits</p>
            <p className="mt-1 text-sm text-slate-600">Spheres that pull particles — the previous playground.</p>
            <span className="mt-3 inline-block text-sm font-bold text-amber-700 group-hover:underline">
              Open playground →
            </span>
          </Link>
        </div>
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          Or go back to the{" "}
          <Link to="/" className="font-semibold text-primary hover:underline">
            UtiliHub home
          </Link>
          .
        </p>
      </section>

      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
