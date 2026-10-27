import { createFileRoute, Link } from "@tanstack/react-router";
import { PongGame } from "@/components/games/PongGame";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Pong | UtiliHub";
const description = cleanDescription(
  "Jeu classique de Pong : duel de palettes contre la CPU. Contrôles fluides, score et meilleur score local. Impact visuel immédiat.",
);

export const Route = createFileRoute("/fr/pong")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:url", content: absoluteUrl("/fr/pong") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/fr/pong") },
      { rel: "alternate", hrefLang: "fr", href: absoluteUrl("/fr/pong") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/juegos/pong") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/games/pong") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/games/pong") },
    ],
  }),
  component: PongPageFr,
});

function PongPageFr() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Jeu · Arcade</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Pong</h1>
        <p className="mt-3 text-muted-foreground">
          Duel classique de <strong className="font-semibold text-foreground">palettes</strong> contre la CPU. Contrôles fluides avec la souris ou les flèches. Construisez votre meilleur score.
        </p>
      </header>
      <PongGame locale="fr" />

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
