import { createFileRoute, Link } from "@tanstack/react-router";
import { PulseCatch } from "@/components/playgrounds/PulseCatch";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Pulse Catch | UtiliHub";
const description = cleanDescription(
  "Jeu de réaction rapide : touchez les étincelles brillantes avant qu'elles ne s'éteignent. Construisez des combos, explosions de particules et enregistrez votre meilleur score. Impact visuel immédiat.",
);

export const Route = createFileRoute("/fr/pulse-catch")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:url", content: absoluteUrl("/fr/pulse-catch") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/fr/pulse-catch") },
      { rel: "alternate", hrefLang: "fr", href: absoluteUrl("/fr/pulse-catch") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/pulse-catch") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/pulse-catch") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/pulse-catch") },
    ],
  }),
  component: PulseCatchPageFr,
});

function PulseCatchPageFr() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Jeu · Réaction</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Pulse Catch</h1>
        <p className="mt-3 text-muted-foreground">
          Touchez les <strong className="font-semibold text-foreground">étincelles</strong> brillantes avant qu'elles ne s'éteignent. Construisez des combos pour plus de points. Explosions de particules à chaque capture. Impact visuel immédiat.
        </p>
      </header>
      <PulseCatch locale="fr" />

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
