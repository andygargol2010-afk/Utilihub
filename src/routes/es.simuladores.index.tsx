import { createFileRoute, Link } from "@tanstack/react-router";
import { SIMULATORS, simBadge, simSummary, simTagLabel, type SimTheme } from "@/lib/simulators/catalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Simuladores gráficos gratis | UtiliHub";
const description = cleanDescription(
  "Simuladores interactivos de física y química en el navegador. Movimiento molecular, gravedad, péndulo — sin registro.",
);

const CARD: Record<SimTheme, string> = {
  lab: "border-teal-900/15 bg-gradient-to-br from-teal-50 via-white to-cyan-50/80 hover:border-teal-500/50 hover:shadow-teal-900/10",
  cosmos:
    "border-violet-900/15 bg-gradient-to-br from-violet-50 via-white to-indigo-50/80 hover:border-violet-500/50 hover:shadow-violet-900/10",
  clockwork:
    "border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 hover:border-amber-500/50 hover:shadow-amber-900/10",
};

const BADGE: Record<SimTheme, string> = {
  lab: "bg-teal-100 text-teal-800",
  cosmos: "bg-violet-100 text-violet-800",
  clockwork: "bg-amber-100 text-amber-900",
};

const CTA: Record<SimTheme, string> = {
  lab: "text-teal-700",
  cosmos: "text-violet-700",
  clockwork: "text-amber-800",
};

export const Route = createFileRoute("/es/simuladores/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/simuladores") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/simuladores") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/simuladores") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/simulators") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/simulators") },
    ],
  }),
  component: SimulatorsHubEs,
});

function SimulatorsHubEs() {
  return (
    <div className="sim-skin min-h-[70vh] bg-gradient-to-b from-slate-50 via-background to-background">
      <div className="container-page py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Lab · Cosmos · Clockwork</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Simuladores</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Cada simulación tiene su propio lenguaje visual — no un canvas oscuro genérico. Explorá sistemas, cambiá
          parámetros y mirá el resultado en vivo.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SIMULATORS.map((sim) => (
            <Link
              key={sim.slug}
              to="/es/simuladores/$slug"
              params={{ slug: sim.slugEs }}
              className={`group flex flex-col rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${CARD[sim.theme]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-4xl" aria-hidden>
                  {sim.emoji}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${BADGE[sim.theme]}`}>
                  {simBadge(sim, "es")}
                </span>
              </div>
              <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {simTagLabel(sim.tag, "es")}
              </span>
              <span className="mt-1 text-xl font-bold text-slate-900">{sim.nameEs}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{simSummary(sim, "es")}</span>
              <span className={`mt-5 text-sm font-bold ${CTA[sim.theme]}`}>Abrir simulador →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
