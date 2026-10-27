import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo";

const titleFr = "UtiliHub · Outils en ligne gratuits, studios 3D et jeux";
const descriptionFr =
  "Outils en ligne gratuits, modeleur de maisons 3D et jeux dans le navigateur. Calculez, convertissez, dessinez et jouez — sans inscription.";

export const Route = createFileRoute("/fr/")({
  head: () => ({
    meta: [
      { title: titleFr },
      { name: "description", content: descriptionFr },
      {
        name: "keywords",
        content:
          "outils en ligne, modeleur maisons 3D, jeux gratuits navigateur, calculatrices, UtiliHub, français",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: titleFr },
      { property: "og:description", content: descriptionFr },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:url", content: absoluteUrl("/fr") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: titleFr },
      { name: "twitter:description", content: descriptionFr },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/fr") },
      { rel: "alternate", hrefLang: "fr", href: absoluteUrl("/fr") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/") },
    ],
  }),
  component: FrenchHome,
});

function FrenchHome() {
  return (
    <div className="pb-12">
      <section className="border-b border-border/70 bg-gradient-to-b from-background to-muted/30">
        <div className="container-page py-12 sm:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-primary">
            Outils, studios et jeux
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Outils en ligne gratuits pour résoudre en secondes.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Calculez et convertissez les tâches du quotidien — plus des studios 3D avancés et des jeux gratuits dans le navigateur. Sans inscription. Version en français.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/fr/fluid-ink-flow-playground"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lift hover:-translate-y-0.5 hover:opacity-95"
            >
              Essayer Fluid Ink Flow
            </Link>
            <Link
              to="/fr/pulse-catch"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-primary/30 bg-card px-5 py-3 text-sm font-bold text-primary hover:bg-primary/5"
            >
              Jouer à Pulse Catch
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
            <span>Sans inscription</span>
            <span>Gratuit</span>
            <span>Confidentialité locale</span>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        <h2 className="text-2xl font-bold">Expériences disponibles</h2>
        <p className="mt-2 text-muted-foreground">
          Terrains de jeu et jeux interactifs en français. Plus de pages arriveront bientôt.
        </p>
        <ul className="mt-6 space-y-4">
          <li>
            <Link to="/fr/fluid-ink-flow-playground" className="font-semibold text-primary hover:underline">
              Fluid Ink Flow Playground — encre visqueuse multicolore
            </Link>
            <p className="text-sm text-muted-foreground">
              Dessinez des traits à main levée qui deviennent de l'encre visqueuse multicolore qui coule. Ajustez viscosité, densité, gravité et tension superficielle.
            </p>
          </li>
          <li>
            <Link to="/fr/pulse-catch" className="font-semibold text-primary hover:underline">
              Pulse Catch — jeu de réaction rapide
            </Link>
            <p className="text-sm text-muted-foreground">
              Touchez les étincelles brillantes avant qu'elles ne s'éteignent. Construisez des combos et enregistrez votre meilleur score.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
