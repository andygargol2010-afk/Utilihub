import { createFileRoute, Link } from "@tanstack/react-router";
import { FluidInkFlowPlayground } from "@/components/playgrounds/FluidInkFlowPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Fluid Ink Flow Spielplatz | UtiliHub";
const description = cleanDescription(
  "Zeichnen Sie freihändige Striche, die zu zähflüssiger mehrfarbiger fließender Tinte werden. Stellen Sie die Viskosität, die Dichte, die Gravitation und die Oberflächenspannung ein. Live-Mischung, Pause, Zufall, gebrandetes PNG.",
);

export const Route = createFileRoute("/de/fluid-ink-flow-playground")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:url", content: absoluteUrl("/de/fluid-ink-flow-playground") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/de/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "de", href: absoluteUrl("/de/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/fluid-ink-flow-playground") },
    ],
  }),
  component: FluidInkFlowPageDe,
});

function FluidInkFlowPageDe() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Spielplatz · Teilbar</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Fluid Ink Flow Spielplatz</h1>
        <p className="mt-3 text-muted-foreground">
          Zeichnen Sie freihändige Striche, die zu <strong className="font-semibold text-foreground">zähflüssiger mehrfarbiger fließender Tinte</strong> werden mit einstellbarer Viskosität, Farbmischung bei Überlappungen, Partikeldichte, Gravitation und Oberflächenspannung.
          Pausieren, randomisieren oder löschen — dann ein gebrandetes PNG teilen.
        </p>
      </header>
      <FluidInkFlowPlayground locale="de" />

      <div className="mt-8">
        <Link to="/de" className="text-sm font-semibold text-primary hover:underline">
          ← Zurück zur deutschen Startseite
        </Link>
      </div>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
