import { createFileRoute, Link } from "@tanstack/react-router";
import { SnakeGame } from "@/components/games/SnakeGame";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Snake | UtiliHub";
const description = cleanDescription(
  "Jeu classique du serpent : mangez, grandissez et évitez les murs. Contrôles fluides, score et meilleur score local. Impact visuel immédiat.",
);

export const Route = createFileRoute("/fr/snake")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:url", content: absoluteUrl("/fr/snake") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/fr/snake") },
      { rel: "alternate", hrefLang: "fr", href: absoluteUrl("/fr/snake") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/juegos/snake") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/games/snake") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/games/snake") },
    ],
  }),
  component: SnakePageFr,
});

function SnakePageFr() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Jeu · Arcade</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Snake</h1>
        <p className="mt-3 text-muted-foreground">
          Mangez les <strong className="font-semibold text-foreground">pommes</strong>, grandissez et évitez les murs. Contrôles fluides par glissement ou flèches. Construisez votre meilleur score.
        </p>
      </header>
      <SnakeGame locale="fr" />

      <div className="mt-8">
        <Link to="/fr" className="text-sm font-semibold text-primary hover:underline">
          ← Retour à l'accueil en français
        </Link>
      </div>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
