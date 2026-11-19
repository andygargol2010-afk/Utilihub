import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/pt/playgrounds/")({
  head: () => ({
    meta: [
      { title: "Playgrounds interativos | UtiliHub" },
      { name: "description", content: "Experimentos visuais interativos em português. Altere parâmetros e veja o resultado imediatamente." },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Playgrounds interativos | UtiliHub" },
      { property: "og:description", content: "Experimentos visuais interativos em português." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/playgrounds") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/playgrounds") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/playgrounds") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds") },
    ],
  }),
  component: PortuguesePlaygroundsHub,
});

function PortuguesePlaygroundsHub() {
  return (
    <div className="container-page py-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Ao vivo · Visual · Interativo</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Playgrounds</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Experimentos visuais pequenos. Altere parâmetros e veja o resultado imediatamente.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/pt/aurora-particle-playground"
          className="group flex flex-col rounded-3xl border border-sky-900/15 bg-gradient-to-br from-sky-50 via-white to-indigo-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            ✨
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Partículas</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Playground de Partículas Aurora</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Atraia ou repila partículas com o mouse. Gravidade, atrito, rastros, cor por velocidade.
          </span>
          <span className="mt-5 text-sm font-bold text-sky-700">Abrir playground →</span>
        </Link>

        <Link
          to="/pt/n-body-gravity"
          className="group flex flex-col rounded-3xl border border-violet-900/15 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            🪐
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Física</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Gravidade N-Corpos</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Simule corpos orbitando sob gravidade. Clique para adicionar massas e veja as trajetórias.
          </span>
          <span className="mt-5 text-sm font-bold text-violet-700">Abrir playground →</span>
        </Link>

        <Link
          to="/pt/color-cascade-fusion"
          className="group flex flex-col rounded-3xl border border-fuchsia-900/15 bg-gradient-to-br from-fuchsia-50 via-white to-pink-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            🌈
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Estúdio</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Cascata de Cor</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Misture cores em cascata interativa. Exporte PNG e compartilhe o estado.
          </span>
          <span className="mt-5 text-sm font-bold text-fuchsia-700">Abrir estúdio →</span>
        </Link>

        <Link
          to="/pt/aura-card"
          className="group flex flex-col rounded-3xl border border-indigo-900/15 bg-gradient-to-br from-indigo-50 via-white to-violet-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            👤
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Compartilhar</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Cartão de Aura</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Gere um cartão visual personalizado com base em parâmetros. Compartilhe via URL.
          </span>
          <span className="mt-5 text-sm font-bold text-indigo-700">Abrir estúdio →</span>
        </Link>

        <Link
          to="/pt/neon-layer-composer"
          className="group flex flex-col rounded-3xl border border-cyan-900/15 bg-gradient-to-br from-cyan-50 via-white to-sky-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            💠
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Estúdio</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Compositor de Camadas Neon</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Empilhe camadas neon interativas. Ajuste brilho e compartilhe.
          </span>
          <span className="mt-5 text-sm font-bold text-cyan-700">Abrir estúdio →</span>
        </Link>

        <Link
          to="/pt/solar-system-scale-explorer"
          className="group flex flex-col rounded-3xl border border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            🌍
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Educacional</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Explorador de Escala do Sistema Solar</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Visualize distâncias e tamanhos reais do sistema solar em escala interativa.
          </span>
          <span className="mt-5 text-sm font-bold text-amber-700">Abrir explorador →</span>
        </Link>
      </div>
    </div>
  );
}
