import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Playgrounds | UtiliHub";
const description = cleanDescription(
  "Playgrounds visuales interactivos en el navegador. Experimentá con partículas, física y controles en vivo.",
);

export const Route = createFileRoute("/es/playgrounds/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds") },
    ],
  }),
  component: PlaygroundsHubEs,
});

function PlaygroundsHubEs() {
  return (
    <div className="container-page py-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">En vivo · Visual · Interactivo</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Playgrounds</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Pequeños experimentos visuales. Cambiá parámetros y mirá el resultado al instante.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/es/playgrounds/particulas"
          className="group flex flex-col rounded-3xl border border-sky-900/15 bg-gradient-to-br from-sky-50 via-white to-cyan-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            ✨
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Partículas</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Partículas interactivas</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            El mouse atrae o repele. Gravedad, fricción, estelas, color por velocidad. Canvas en vivo.
          </span>
          <span className="mt-5 text-sm font-bold text-sky-700">Abrir playground →</span>
        </Link>

        <Link
          to="/es/playgrounds/deuda-bola-nieve"
          className="group flex flex-col rounded-3xl border border-emerald-900/15 bg-gradient-to-br from-emerald-50 via-white to-teal-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            📉
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Deudas</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Bola de nieve vs Avalancha</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Agregá deudas y mirá cómo compiten ambos métodos con barras de progreso y timeline en vivo.
          </span>
          <span className="mt-5 text-sm font-bold text-emerald-700">Abrir playground →</span>
        </Link>

        <Link
          to="/es/playgrounds/plano-planta"
          className="group flex flex-col rounded-3xl border border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            🏠
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Estudio</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Estudio de plano de planta</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Componé habitaciones y muebles. Arrastrá, rotá, colores de paredes, área en vivo y URL para compartir.
          </span>
          <span className="mt-5 text-sm font-bold text-amber-700">Abrir estudio →</span>
        </Link>

        <Link
          to="/es/playgrounds/constelacion"
          className="group flex flex-col rounded-3xl border border-indigo-900/15 bg-gradient-to-br from-indigo-50 via-white to-violet-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            ⭐
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Compartir</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Estudio de Constelaciones</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Arrastrá estrellas, conectá líneas, cargá mitos. Estado completo en URL compartible.
          </span>
          <span className="mt-5 text-sm font-bold text-indigo-700">Abrir estudio →</span>
        </Link>

        <Link
          to="/es/playgrounds/plano-asientos"
          className="group flex flex-col rounded-3xl border border-rose-900/15 bg-gradient-to-br from-rose-50 via-white to-pink-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-rose-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            👥
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Estudio</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Estudio de Plano de Asientos</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Arrastrá invitados a mesas. Avisos de capacidad en vivo y URL compartible del arreglo.
          </span>
          <span className="mt-5 text-sm font-bold text-rose-700">Abrir estudio →</span>
        </Link>
      </div>
    </div>
  );
}
