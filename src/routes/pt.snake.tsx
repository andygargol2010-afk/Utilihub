import { createFileRoute, Link } from "@tanstack/react-router";
import { SnakeGame } from "@/components/games/SnakeGame";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Snake | UtiliHub";
const description = cleanDescription(
  "Jogo cl\u00e1ssico da cobra: coma, cres\u00e7a e n\u00e3o bata nas paredes. Controles suaves, pontua\u00e7\u00e3o e melhor marca local. Impacto visual imediato.",
);

export const Route = createFileRoute("/pt/snake")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/snake") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/snake") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/snake") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/juegos/snake") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/games/snake") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/games/snake") },
    ],
  }),
  component: SnakePagePt,
});

function SnakePagePt() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Jogo \u00b7 Arcade</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Snake</h1>
        <p className="mt-3 text-muted-foreground">
          Coma as <strong className="font-semibold text-foreground">ma\u00e7\u00e3s</strong>, cres\u00e7a e evite as paredes. Controles suaves com deslize ou setas. Construa sua melhor pontua\u00e7\u00e3o.
        </p>
      </header>
      <SnakeGame locale="pt" />

      <div className="mt-8">
        <Link to="/pt" className="text-sm font-semibold text-primary hover:underline">
          \u2190 Voltar ao in\u00edcio em portugu\u00eas
        </Link>
      </div>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
