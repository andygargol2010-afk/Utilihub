import { createFileRoute, Link } from "@tanstack/react-router";
import { PongGame } from "@/components/games/PongGame";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Pong | UtiliHub";
const description = cleanDescription(
  "Jogo clássico de Pong: duelo de paletas contra a CPU. Controle suave, pontuação e melhor marca local. Impacto visual imediato.",
);

export const Route = createFileRoute("/pt/pong")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/pong") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/pong") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/pong") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/juegos/pong") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/games/pong") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/games/pong") },
    ],
  }),
  component: PongPagePt,
});

function PongPagePt() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Jogo · Arcade</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Pong</h1>
        <p className="mt-3 text-muted-foreground">
          Duelo clássico de <strong className="font-semibold text-foreground">paletas</strong> contra a CPU. Controles suaves com mouse ou teclas. Construa sua melhor pontuação.
        </p>
      </header>
      <PongGame locale="pt" />

      <div className="mt-8">
        <Link to="/pt" className="text-sm font-semibold text-primary hover:underline">
          ← Voltar ao início em português
        </Link>
      </div>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
