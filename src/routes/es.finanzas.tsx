import { createFileRoute, Link } from "@tanstack/react-router";
import { ALL_TOOLS } from "@/lib/all-tools";
import { absoluteUrl } from "@/lib/seo";
import { spanishToolName, spanishToolPath } from "@/lib/i18n/es";

export const Route = createFileRoute("/es/finanzas")({
  head: () => ({
    meta: [{ title: "Calculadoras financieras | UtiliHub" }, { name: "description", content: "Calculadoras financieras gratuitas para inversiones, ahorro, préstamos, inflación y planificación." }, { name: "robots", content: "index, follow" }, { property: "og:locale", content: "es_ES" }],
    links: [{ rel: "canonical", href: absoluteUrl("/es/finanzas") }, { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/finanzas") }, { rel: "alternate", hrefLang: "en", href: absoluteUrl("/finanzas") }, { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/finanzas") }],
  }),
  component: SpanishFinanceIndex,
});

function SpanishFinanceIndex() {
  const tools = ALL_TOOLS.filter((tool) => tool.category === "finanzas");
  return <main className="container-page py-10"><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Finanzas</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Calculadoras financieras</h1><p className="mt-3 max-w-2xl text-muted-foreground">Analiza inversiones, ahorro, préstamos, inflación y otros escenarios financieros con cálculos en el navegador.</p><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{tools.map((tool) => <Link key={tool.slug} to={spanishToolPath(tool) as any} className="rounded-xl border border-border/70 bg-card p-4 hover:border-primary/45"><h2 className="font-bold">{spanishToolName(tool)}</h2><p className="mt-1 text-xs text-muted-foreground">Calculadora financiera gratuita.</p></Link>)}</div></main>;
}
