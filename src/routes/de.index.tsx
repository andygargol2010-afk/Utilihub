import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo";

const titleDe = "UtiliHub · Kostenlose Online-Tools, 3D-Studios und Spiele";
const descriptionDe =
  "Kostenlose Online-Tools, 3D-Hausmodellierer und Browser-Spiele. Berechnen, konvertieren, zeichnen und spielen — ohne Anmeldung.";

export const Route = createFileRoute("/de/")({
  head: () => ({
    meta: [
      { title: titleDe },
      { name: "description", content: descriptionDe },
      {
        name: "keywords",
        content:
          "Online-Tools, 3D-Hausmodellierer, kostenlose Browser-Spiele, Rechner, UtiliHub, Deutsch",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: titleDe },
      { property: "og:description", content: descriptionDe },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:url", content: absoluteUrl("/de") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: titleDe },
      { name: "twitter:description", content: descriptionDe },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/de") },
      { rel: "alternate", hrefLang: "de", href: absoluteUrl("/de") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/") },
    ],
  }),
  component: GermanHome,
});

function GermanHome() {
  return (
    <div className="pb-12">
      <section className="border-b border-border/70 bg-gradient-to-b from-background to-muted/30">
        <div className="container-page py-12 sm:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-primary">
            Tools, Studios und Spiele
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Kostenlose Online-Tools, um Aufgaben in Sekunden zu lösen.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Berechnen und konvertieren Sie Alltagsaufgaben — plus fortgeschrittene 3D-Studios und kostenlose Browser-Spiele. Ohne Anmeldung. Deutsche Version.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/de/fluid-ink-flow-playground"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lift hover:-translate-y-0.5 hover:opacity-95"
            >
              Fluid Ink Flow ausprobieren
            </Link>
            <Link
              to="/de/pulse-catch"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-primary/30 bg-card px-5 py-3 text-sm font-bold text-primary hover:bg-primary/5"
            >
              Pulse Catch spielen
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
            <span>Ohne Anmeldung</span>
            <span>Kostenlos</span>
            <span>Lokale Privatsphäre</span>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        <h2 className="text-2xl font-bold">Verfügbare Erlebnisse</h2>
        <p className="mt-2 text-muted-foreground">
          Interaktive Spielplätze und Spiele auf Deutsch. Weitere Seiten folgen bald.
        </p>
        <ul className="mt-6 space-y-4">
          <li>
            <Link to="/de/fluid-ink-flow-playground" className="font-semibold text-primary hover:underline">
              Fluid Ink Flow Playground — zähflüssige mehrfarbige Tinte
            </Link>
            <p className="text-sm text-muted-foreground">
              Zeichnen Sie freihändige Striche, die zu zähflüssiger mehrfarbiger fließender Tinte werden. Stellen Sie Viskosität, Dichte, Gravitation und Oberflächenspannung ein.
            </p>
          </li>
          <li>
            <Link to="/de/pulse-catch" className="font-semibold text-primary hover:underline">
              Pulse Catch — schnelles Reaktionsspiel
            </Link>
            <p className="text-sm text-muted-foreground">
              Tippe auf die leuchtenden Funken, bevor sie erlöschen. Baue Combos auf und speichere deinen besten Score.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
