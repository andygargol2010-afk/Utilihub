import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_CATEGORIES, ALL_TOOLS } from "@/lib/all-tools";
import { ToolCard } from "@/components/ToolCard";
import { useFavorites } from "@/hooks/use-favorites";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function fuzzyScore(query: string, text: string) {
  if (!query) return 0;
  if (text === query) return 1000;
  if (text.startsWith(query)) return 700 - text.length;
  const index = text.indexOf(query);
  if (index >= 0) return 500 - index;
  let cursor = 0;
  let gaps = 0;
  for (const char of query) {
    const found = text.indexOf(char, cursor);
    if (found < 0) return -1;
    gaps += found - cursor;
    cursor = found + 1;
  }
  return 180 - gaps - Math.max(0, text.length - query.length) * 0.02;
}

export function ToolSearch({ initialCategory }: { initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const { favorites, toggle, ready } = useFavorites();

  const results = useMemo(() => {
    const q = normalize(query);
    return ALL_TOOLS
      .filter((tool) => (category === "all" || tool.category === category) && (!onlyFavorites || favorites.includes(tool.slug)))
      .map((tool) => {
        const name = normalize(tool.name);
        const summary = normalize(tool.summary);
        const keywords = normalize(tool.keywords.join(" "));
        const searchable = `${name} ${summary} ${keywords}`;
        const score = q ? Math.max(fuzzyScore(q, name) + 220, fuzzyScore(q, searchable)) : 0;
        return { tool, score };
      })
      .filter(({ score }) => !q || score >= 0)
      .sort((a, b) => q ? b.score - a.score : a.tool.name.localeCompare(b.tool.name, "es"))
      .map(({ tool }) => tool);
  }, [query, category, onlyFavorites, favorites]);

  const favoriteTools = ready ? ALL_TOOLS.filter((tool) => favorites.includes(tool.slug)) : [];

  return <div className="space-y-7">
    <div className="rounded-2xl border border-border bg-surface/55 p-3 sm:p-4">
      <div className="relative"><Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar: porcentaje, contraseñas, interés compuesto…" aria-label="Buscar herramientas" className="h-12 border-border/70 bg-card pl-11 text-base shadow-sm" /></div>
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
        <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
        <Button type="button" size="sm" variant={category === "all" ? "default" : "outline"} onClick={() => setCategory("all")} className="shrink-0 rounded-lg">Todas</Button>
        {ALL_CATEGORIES.map((item) => <Button key={item.slug} type="button" variant={category === item.slug ? "default" : "outline"} size="sm" onClick={() => setCategory(item.slug)} className="shrink-0 rounded-lg">{item.name}</Button>)}
        <Button type="button" size="sm" variant={onlyFavorites ? "default" : "outline"} onClick={() => setOnlyFavorites((value) => !value)} className="ml-auto shrink-0 rounded-lg" disabled={!ready}><Star className="mr-1.5 size-3.5" /> Favoritos</Button>
      </div>
    </div>
    {favoriteTools.length > 0 && !query && !onlyFavorites && <section aria-labelledby="favoritos"><div className="mb-4 flex items-center gap-2"><Star className="size-4 fill-highlight text-highlight" /><h2 id="favoritos" className="text-lg font-bold">Tus favoritos</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{favoriteTools.map((tool) => <ToolCard key={tool.slug} tool={tool} isFavorite onToggleFavorite={toggle} />)}</div></section>}
    <div aria-live="polite" aria-busy={!ready}>{results.length === 0 ? <p className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">No hay herramientas que coincidan con «{query}».</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.map((tool) => <ToolCard key={tool.slug} tool={tool} isFavorite={favorites.includes(tool.slug)} onToggleFavorite={toggle} />)}</div>}</div>
  </div>;
}
