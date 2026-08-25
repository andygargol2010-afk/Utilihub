import { Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { FinancialTool } from "@/lib/financial-tools";

export function FinancialToolCard({ tool }: { tool: FinancialTool }) {
  return <article className="surface-card group p-5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"><div className="flex items-start justify-between gap-3"><span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">Finanzas</span><FavoriteButton slug={tool.slug} name={tool.name} /></div><Link to="/finanzas/$slug" params={{ slug: tool.slug }} className="mt-3 block"><h3 className="text-lg font-bold group-hover:text-primary">{tool.name}</h3><p className="mt-1.5 text-sm leading-5 text-muted-foreground">{tool.summary}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">Calcular <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></span></Link></article>;
}
