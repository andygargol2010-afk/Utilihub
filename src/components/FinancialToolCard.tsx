import { Link } from "@tanstack/react-router";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { FinancialTool } from "@/lib/financial-tools";

export function FinancialToolCard({ tool }: { tool: FinancialTool }) {
  return <article className="group flex min-h-14 items-center gap-3 border-b border-border/70 px-1 py-2 last:border-b-0 sm:min-h-16">
    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-xs font-black text-primary">F</span>
    <Link to="/finanzas/$slug" params={{ slug: tool.slug }} className="min-w-0 flex-1 rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <span className="block truncate text-sm font-bold group-hover:text-primary">{tool.name}</span>
      <span className="mt-0.5 block truncate text-xs text-muted-foreground">{tool.summary}</span>
    </Link>
    <div className="grid size-11 shrink-0 place-items-center"><FavoriteButton slug={tool.slug} name={tool.name} /></div>
  </article>;
}
