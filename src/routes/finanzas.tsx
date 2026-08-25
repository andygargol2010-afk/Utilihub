import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Calculator, ChartNoAxesCombined, PiggyBank, ReceiptText, WalletCards } from "lucide-react";
import { FINANCIAL_TOOLS } from "@/lib/financial-tools";

const ICONS = [ChartNoAxesCombined, ReceiptText, WalletCards, PiggyBank, Calculator];

export const Route = createFileRoute("/finanzas")({
  head: () => ({
    meta: [
      { title: "Calculadoras financieras online | UtiliHub" },
      { name: "description", content: "Calculadoras financieras gratuitas para inversión, préstamos, ahorro, inflación, carteras, jubilación y renta fija." },
    ],
  }),
  component: FinancialHub,
});

function FinancialHub() {
  return (
    <main className="container-page py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Finanzas</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Herramientas financieras</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Calculadoras para inversión, ahorro, préstamos, inflación, carteras, jubilación, bonos y valoración. Las fórmulas se ejecutan en tu navegador.</p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FINANCIAL_TOOLS.map((tool, i) => {
          const Icon = ICONS[i % ICONS.length];
          const href = `/finanzas/${encodeURIComponent(tool.slug)}`;
          return (
            <a
              key={tool.slug}
              href={href}
              className="surface-card group p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary"><Icon className="size-5" /></span>
              <h2 className="mt-5 text-xl font-bold group-hover:text-primary">{tool.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">Calcular <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </a>
          );
        })}
      </div>
      <p className="mt-10 max-w-2xl text-xs leading-5 text-muted-foreground">Los resultados son estimaciones matemáticas. No sustituyen asesoramiento financiero ni incorporan automáticamente impuestos, comisiones o cambios futuros del mercado.</p>
    </main>
  );
}
