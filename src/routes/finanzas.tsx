import { createFileRoute } from "@tanstack/react-router";
import { FinancialToolCard } from "@/components/FinancialToolCard";
import { FINANCIAL_TOOLS } from "@/lib/financial-tools";

export const Route = createFileRoute("/finanzas")({
  head: () => ({ meta: [{ title: "Calculadoras financieras online | UtiliHub" }, { name: "description", content: "Calculadoras financieras gratuitas para inversión, préstamos, ahorro, inflación, carteras, jubilación y renta fija." }] }),
  component: FinancialHub,
});

function FinancialHub() {
  return <main className="container-page py-6 sm:py-8"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Finanzas</p><h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Herramientas financieras</h1><p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">Calculadoras para inversión, ahorro, préstamos, inflación y carteras.</p></div><span className="shrink-0 text-xs font-semibold text-muted-foreground">{FINANCIAL_TOOLS.length} herramientas</span></div><div className="mt-5 divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">{FINANCIAL_TOOLS.map(tool => <FinancialToolCard key={tool.slug} tool={tool} />)}</div></main>;
}
