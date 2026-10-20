import { createFileRoute, Link } from "@tanstack/react-router";
import { PulseCatch } from "@/components/playgrounds/PulseCatch";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Pulse Catch | UtiliHub";
const description = cleanDescription(
  "Jogo de reação rápida: toque nas faíscas brilhantes antes que se apaguem. Construa combos, explosões de partículas e registre sua melhor pontuação. Impacto visual imediato.",
);

export const Route = createFileRoute("/pt/pulse-catch")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/pulse-catch") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/pulse-catch") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/pulse-catch") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/pulse-catch") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/pulse-catch") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/pulse-catch") },
    ],
  }),
  component: PulseCatchPagePt,
});

function PulseCatchPagePt() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Jogo · Reação</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Pulse Catch</h1>
        <p className="mt-3 text-muted-foreground">
          Toque nas <strong className="font-semibold text-foreground">faíscas</strong> brilhantes antes que se apaguem. Construa combos para mais pontos. Explosões de partículas em cada captura. Impacto visual imediato.
        </p>
      </header>
      <PulseCatch locale="pt" />

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
