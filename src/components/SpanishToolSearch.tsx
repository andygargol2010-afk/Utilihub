import { useMemo, useState } from "react";
import { Search, Tag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_CATEGORIES, ALL_TOOLS } from "@/lib/all-tools";
import { spanishCategoryName, spanishToolName, spanishToolPath } from "@/lib/i18n/es";

function normalize(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); }

export function SpanishToolSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const index = useMemo(() => ALL_TOOLS.map((tool) => ({ tool, text: normalize(`${tool.name} ${tool.slug} ${tool.keywords.join(" ")}`) })), []);
  const results = useMemo(() => {
    const q = normalize(query);
    return index.filter(({ tool, text }) => (category === "all" || tool.category === category) && (!q || text.includes(q) || normalize(spanishToolName(tool)).includes(q))).map(({ tool }) => tool);
  }, [category, index, query]);
  return <div className="space-y-5">
    <div className="rounded-xl border border-border/70 bg-surface/45 p-2.5 sm:p-3">
      <div className="relative"><Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Buscar una herramienta…" aria-label="Buscar herramientas por nombre o palabra clave" className="h-12 rounded-lg border-transparent bg-card pl-11 text-base shadow-none focus-visible:border-primary/40" /></div>
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filtrar por categoría"><Tag className="size-4 shrink-0 text-muted-foreground" /><Button type="button" size="sm" variant={category === "all" ? "default" : "outline"} onClick={() => setCategory("all")} className="min-h-11 shrink-0 rounded-full px-3 text-xs font-semibold">Todas</Button>{ALL_CATEGORIES.map((item) => <Button key={item.slug} type="button" size="sm" variant={category === item.slug ? "default" : "outline"} onClick={() => setCategory(item.slug)} className="min-h-11 shrink-0 rounded-full px-3 text-xs font-semibold">{spanishCategoryName(item.slug)}</Button>)}</div>
    </div>
    <div aria-live="polite">{results.length === 0 ? <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">No se encontraron herramientas para «{query || spanishCategoryName(category)}».</p> : <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">{results.map((tool) => <Link key={tool.slug} to={spanishToolPath(tool) as any} className="block rounded-lg px-3 py-3 hover:bg-accent"><span className="block text-sm font-bold">{spanishToolName(tool)}</span><span className="mt-0.5 block text-xs text-muted-foreground">{spanishCategoryName(tool.category)}</span></Link>)}</div>}</div>
  </div>;
}
