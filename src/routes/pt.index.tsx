import { Suspense, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DeferredHomeReviews } from "@/components/DeferredHomeReviews";
import { HomeCatalogSlot } from "@/components/home-catalog-slot";
import { absoluteUrl, ogImage, SITE_NAME, websiteSchema } from "@/lib/seo";
import { loadHomeCatalog } from "./-pt.index.part1";
import { titlePt, descriptionPt, goRandomExperiencePt, HomeToolCount, HomeSearch, DailyExperienceSpotlight, ExperienceDiscoveryRail, HomeCatalogRest } from "./-pt.index.part2";

export const Route = createFileRoute("/pt/")({
  head: () => ({
    meta: [
      { title: titlePt },
      { name: "description", content: descriptionPt },
      {
        name: "keywords",
        content:
          "ferramentas online, modelador casas 3D, jogos grátis navegador, calculadoras, ferramentas avançadas, UtiliHub",
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
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/") },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({ ...websiteSchema(), url: absoluteUrl("/pt"), inLanguage: "pt" }),
      },
    ],
  }),
  component: PortugueseHome,
});

function PortugueseHome() {
  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle(() => void loadHomeCatalog(), { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(() => void loadHomeCatalog(), 400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="pb-12">
      <style>{
        /* Critical CSS so home LCP (h1) paints before the full styles.css */
        `.hero-gradient{background:linear-gradient(180deg,var(--color-card) 0%,var(--color-background) 100%)}` +
        `.container-page{width:100%;margin-inline:auto;max-width:84rem;padding-inline:clamp(1rem,3vw,2rem)}` +
        `h1{font-family:"Plus Jakarta Sans","Plus Jakarta Fallback",ui-sans-serif,system-ui,sans-serif;font-weight:700;letter-spacing:-0.025em;line-height:1.12}` +
        `.shadow-lift{box-shadow:0 1px 2px rgba(15,23,42,.05),0 8px 24px -12px rgba(15,23,42,.12)}` +
        `.surface-card{background:var(--color-card);border:1px solid var(--color-border);border-radius:.75rem;box-shadow:0 1px 2px rgba(15,23,42,.04)}`
      }</style>
      <section className="hero-gradient border-b border-border">
        <div className="container-page py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary">
              <Suspense fallback={<span>Ferramentas grátis</span>}>
                <HomeToolCount locale="pt" />
              </Suspense>{" "}
              · grátis · sem cadastro
            </p>
            <h1 className="mt-3 text-4xl tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Ferramentas online grátis para resolver o que você precisa em segundos.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Calcule e converta tarefas do dia a dia — mais estúdios 3D avançados e jogos grátis. Tudo funciona no seu navegador.
            </p>
            <div className="mx-auto mt-8 min-h-14 max-w-2xl text-left">
              <Suspense fallback={<div className="h-14 animate-pulse rounded-lg border border-border bg-card" />}>
                <HomeSearch locale="pt" />
              </Suspense>
            </div>
            <nav aria-label="Categorias populares" className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
              {[
                ["/category/math", "Matemática"],
                ["/finance", "Finanças"],
                ["/category/converters", "Conversores"],
                ["/category/text", "Texto"],
                ["/category/developer", "Desenvolvimento"],
                ["/category/advanced-tools", "Ferramentas avançadas"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="inline-flex min-h-9 items-center rounded-md border border-border bg-card px-3 font-medium text-foreground hover:border-primary/40 hover:text-primary"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/pt/ferramentas"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Ver todas as ferramentas <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                to="/pt/jogos"
                className="inline-flex min-h-11 items-center rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Jogar
              </Link>
            </div>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <button type="button" onClick={goRandomExperiencePt} className="min-h-9 underline-offset-4 hover:text-foreground hover:underline" data-event="random-experience-click">
                Experiência aleatória
              </button>
            </p>
          </div>
        </div>
      </section>
      <div className="container-page">
        <Suspense fallback={<HomeCatalogSlot />}>
          <HomeCatalogRest locale="pt" />
        </Suspense>
      </div>
      <Suspense fallback={<div className="container-page py-6 min-h-[280px]" aria-hidden />}>
        <ExperienceDiscoveryRail locale="pt" />
      </Suspense>
      <Suspense fallback={<div className="container-page py-4 min-h-[120px]" aria-hidden />}>
        <DailyExperienceSpotlight locale="pt" />
      </Suspense>
      <div className="container-page">
        <DeferredHomeReviews locale="pt" />
      </div>
    </div>
  );
}
