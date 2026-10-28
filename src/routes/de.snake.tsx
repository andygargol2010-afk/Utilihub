import { createFileRoute, Link } from "@tanstack/react-router";
import { SnakeGame } from "@/components/games/SnakeGame";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Snake | UtiliHub";
const description = cleanDescription(
  "Klassisches Schlangenspiel: iss, wachse und vermeide die Wände. Flüssige Steuerung, Score und lokaler Bestwert. Sofortiger visueller Impact.",
);

export const Route = createFileRoute("/de/snake")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:url", content: absoluteUrl("/de/snake") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/de/snake") },
      { rel: "alternate", hrefLang: "de", href: absoluteUrl("/de/snake") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/juegos/snake") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/games/snake") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/games/snake") },
    ],
  }),
  component: SnakePageDe,
});

function SnakePageDe() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Spiel · Arcade</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Snake</h1>
        <p className="mt-3 text-muted-foreground">
          Iss die <strong className="font-semibold text-foreground">Äpfel</strong>, wachse und vermeide die Wände. Flüssige Steuerung per Wischen oder Pfeiltasten. Baue deinen Bestwert auf.
        </p>
      </header>
      <SnakeGame locale="de" />

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
