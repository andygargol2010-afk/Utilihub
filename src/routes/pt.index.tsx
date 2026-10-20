import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo";

const titlePt = "UtiliHub · Ferramentas online grátis, studios 3D e jogos";
const descriptionPt =
  "Ferramentas online gratuitas, modelador de casas 3D e jogos no navegador. Calcule, converta, desenhe e jogue — sem cadastro.";

export const Route = createFileRoute("/pt/")({
  head: () => ({
    meta: [
      { title: titlePt },
      { name: "description", content: descriptionPt },
      {
        name: "keywords",
        content:
          "ferramentas online, modelador casas 3D, jogos grátis navegador, calculadoras, UtiliHub, português",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: titlePt },
      { property: "og:description", content: descriptionPt },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: titlePt },
      { name: "twitter:description", content: descriptionPt },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/") },
    ],
  }),
  component: PortugueseHome,
});

function PortugueseHome() {
  return (
    <div className="pb-12">
      <section className="border-b border-border/70 bg-gradient-to-b from-background to-muted/30">
        <div className="container-page py-12 sm:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-primary">
            Ferramentas, studios e jogos
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Ferramentas online grátis para resolver em segundos.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Calcule e converta tarefas do dia a dia — mais studios 3D avançados e jogos grátis no navegador. Sem cadastro. Versão em português (pt-BR).
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/pt/pulse-catch"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lift hover:-translate-y-0.5 hover:opacity-95"
            >
              Jogar Pulse Catch
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
            <span>Sem cadastro</span>
            <span>Grátis</span>
            <span>Privacidade local</span>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        <h2 className="text-2xl font-bold">Experiências disponíveis</h2>
        <p className="mt-2 text-muted-foreground">
          Comece com o jogo de reação Pulse Catch. Mais páginas em português chegarão em breve.
        </p>
        <ul className="mt-6 space-y-3">
          <li>
            <Link to="/pt/pulse-catch" className="font-semibold text-primary hover:underline">
              Pulse Catch — jogo de reação rápida
            </Link>
            <p className="text-sm text-muted-foreground">
              Toque nas faíscas brilhantes antes que se apaguem. Construa combos e registre sua melhor pontuação.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
