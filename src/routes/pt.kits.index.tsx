import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/pt/kits/")({
  head: () => ({
    meta: [
      { title: "Kits de trabalho e interativos | UtiliHub" },
      { name: "description", content: "Kits guiados e interativos em português. Monte circuitos, aviões de papel e mais com listas de materiais e previews." },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Kits de trabalho e interativos | UtiliHub" },
      { property: "og:description", content: "Kits guiados e interativos em português." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/kits") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/kits") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/kits") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits") },
    ],
  }),
  component: PortugueseKitsHub,
});

function PortugueseKitsHub() {
  return (
    <div className="container-page py-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Guiado · Interativo · Educacional</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Kits</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Monte projetos passo a passo ou use kits de trabalho para encadear ferramentas. Tudo no navegador.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/pt/kit-circuito-simples"
          className="group flex flex-col rounded-3xl border border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            ⚡
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Circuito</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Kit de Circuito Simples</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Coloque bateria, interruptor, resistor e LED. Conecte fios e veja o LED acender.
          </span>
          <span className="mt-5 text-sm font-bold text-amber-700">Abrir kit →</span>
        </Link>

        <Link
          to="/pt/kit-aviao-papel"
          className="group flex flex-col rounded-3xl border border-sky-900/15 bg-gradient-to-br from-sky-50 via-white to-indigo-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            ✈️
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Papel</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Kit de Avião de Papel</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Escolha o design, siga as dobras e veja o preview ao vivo do avião.
          </span>
          <span className="mt-5 text-sm font-bold text-sky-700">Abrir kit →</span>
        </Link>

        <Link
          to="/kits"
          className="group flex flex-col rounded-3xl border border-violet-900/15 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            💼
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Trabalho</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Kits de Trabalho</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Encadeie ferramentas por objetivo: freelancers, SEO, documentos, estudantes.
          </span>
          <span className="mt-5 text-sm font-bold text-violet-700">Ver kits →</span>
        </Link>
      </div>
    </div>
  );
}
