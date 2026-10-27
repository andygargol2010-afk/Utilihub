import { createFileRoute, Link } from "@tanstack/react-router";
import { PulseCatch } from "@/components/playgrounds/PulseCatch";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Pulse Catch | UtiliHub";
const description = cleanDescription(
  "Schnelles Reaktionsspiel: Tippe auf die leuchtenden Funken, bevor sie erlöschen. Baue Combos auf, Partikelexplosionen und speichere deinen besten Score. Sofortiger visueller Impact.",
);

export const Route = createFileRoute("/de/pulse-catch")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:url", content: absoluteUrl("/de/pulse-catch") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/de/pulse-catch") },
      { rel: "alternate", hrefLang: "de", href: absoluteUrl("/de/pulse-catch") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/pulse-catch") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/pulse-catch") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/pulse-catch") },
    ],
  }),
  component: PulseCatchPageDe,
});

function PulseCatchPageDe() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Spiel · Reaktion</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Pulse Catch</h1>
        <p className="mt-3 text-muted-foreground">
          Tippe auf die <strong className="font-semibold text-foreground">leuchtenden Funken</strong>, bevor sie erlöschen. Baue Combos für mehr Punkte. Partikelexplosionen bei jedem Fang. Sofortiger visueller Impact.
        </p>
      </header>
      <PulseCatch locale="de" />

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
