import { createFileRoute, Link } from "@tanstack/react-router";
import { OrbitDefenderArcadeGame } from "@/components/games/OrbitDefenderArcadeGame";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Orbit Defender Arcade | UtiliHub";
const description = cleanDescription(
  "Defenda um planeta brilhante das ondas de asteroides. Aponte interceptores, construa combos, desbloqueie power-ups e sobreviva à dificuldade crescente. Impacto visual imediato.",
);

export const Route = createFileRoute("/pt/orbit-defender-arcade")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/orbit-defender-arcade") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/orbit-defender-arcade") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/orbit-defender-arcade") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/juegos/arcade-defensor-orbita") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/games/orbit-defender-arcade") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/games/orbit-defender-arcade") },
    ],
  }),
  component: OrbitDefenderPagePt,
});

function OrbitDefenderPagePt() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Jogo · Arcade</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Orbit Defender Arcade</h1>
        <p className="mt-3 text-muted-foreground">
          Defenda um <strong className="font-semibold text-foreground">planeta</strong> brilhante das ondas de asteroides. Aponte seus interceptores, construa combos para mais pontos e desbloqueie power-ups. Sobreviva à dificuldade crescente.
        </p>
      </header>
      <OrbitDefenderArcadeGame locale="pt" />

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
