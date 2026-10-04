import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Search, SlidersHorizontal, Star, Tag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_CATEGORIES, ALL_TOOLS } from "@/lib/all-tools";
import { ToolCard } from "@/components/ToolCard";
import { useFavorites } from "@/hooks/use-favorites";
import { spanishCategoryName, spanishToolName, spanishToolPath } from "@/lib/i18n/es";
import { facetsWithCounts, toolMatchesTag } from "@/lib/tool-tags";

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
const STOP = new Set(["de", "la", "el", "los", "las", "para", "por", "un", "una", "y", "o", "en", "the", "a", "an", "and", "or", "for", "to", "of", "in"]);
const categoryButtonClass = "min-h-11 shrink-0 rounded-full px-3 text-xs font-semibold";

export function SpanishToolSearch({ initialCategory, compactHome = false }: { initialCategory?: string; compactHome?: boolean }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState<string>(initialCategory ?? "all");
  const [tag, setTag] = useState<string>("all");
  const { favorites, toggle, ready } = useFavorites();

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), 160);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    setTag("all");
  }, [category]);

  const index = useMemo(
    () =>
      ALL_TOOLS.map((tool) => {
        const esName = spanishToolName(tool);
        return {
          tool,
          name: normalize(esName),
          enName: normalize(tool.name),
          text: normalize(`${esName} ${tool.name} ${tool.summary} ${tool.description} ${tool.keywords.join(" ")}`),
          keywords: tool.keywords.map(normalize),
        };
      }),
    [],
  );

  const categoryTools = useMemo(() => {
    if (category === "all") return ALL_TOOLS;
    return ALL_TOOLS.filter((t) => t.category === category);
  }, [category]);

  const facets = useMemo(
    () => facetsWithCounts(categoryTools, category, "es"),
    [categoryTools, category],
  );

  const results = useMemo(() => {
    const tokens = normalize(debouncedQuery).split(/\s+/).filter((token) => token.length > 1 && !STOP.has(token));
    return index
      .filter(({ tool }) => category === "all" || tool.category === category)
      .filter(({ tool }) => tag === "all" || toolMatchesTag(tool, tag))
      .map((item) => {
        if (!tokens.length) return { tool: item.tool, score: 0 };
        let score = 0;
        for (const token of tokens) {
          if (item.name === token || item.enName === token) score += 100;
          else if (item.name.startsWith(token) || item.enName.startsWith(token)) score += 40;
          else if (item.name.includes(token) || item.enName.includes(token)) score += 25;
          else if (item.keywords.some((k) => k === token)) score += 30;
          else if (item.keywords.some((k) => k.includes(token))) score += 15;
          else if (item.text.includes(token)) score += 5;
        }
        return { tool: item.tool, score: score === tokens.length * 5 ? 0 : score };
      })
      .filter(({ score }) => !tokens.length || score > 0)
      .sort((a, b) => b.score - a.score || spanishToolName(a.tool).localeCompare(spanishToolName(b.tool), "es"))
      .map(({ tool }) => tool);
  }, [category, index, tag, debouncedQuery]);

  const favTools = useMemo(() => ALL_TOOLS.filter((t) => favorites.includes(t.slug)), [favorites]);
  const compactResults = results.slice(0, 6);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
  }

  if (compactHome) {
    return (
      <div className="relative">
        <form onSubmit={onSubmit} className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Buscar una herramienta…"
            aria-label="Buscar herramientas por nombre o palabra clave"
            className="h-12 rounded-xl border-border/70 bg-card pl-11 text-base shadow-sm"
          />
          {debouncedQuery && compactResults.length > 0 && (
            <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-xl border border-border bg-card shadow-lift">
              {compactResults.map((tool) => (
                <Link
                  key={tool.slug}
                  to={spanishToolPath(tool) as never}
                  className="block border-b border-border/60 px-4 py-3 last:border-0 hover:bg-accent"
                >
                  <span className="block text-sm font-bold">{spanishToolName(tool)}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{spanishCategoryName(tool.category)}</span>
                </Link>
              ))}
            </div>
          )}
          {debouncedQuery && compactResults.length === 0 && (
            <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground shadow-lift" role="status">
              No se encontraron herramientas para «{query}».
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border/70 bg-surface/45 p-2.5 sm:p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Buscar una herramienta…"
            aria-label="Buscar herramientas por nombre, descripción o palabra clave"
            className="h-12 rounded-lg border-transparent bg-card pl-11 text-base shadow-none focus-visible:border-primary/40"
          />
        </div>
        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filtrar por categoría">
          <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
          <Button type="button" size="sm" variant={category === "all" ? "default" : "outline"} onClick={() => setCategory("all")} className={categoryButtonClass}>
            Todas
          </Button>
          {ALL_CATEGORIES.map((c) => (
            <Button key={c.slug} type="button" variant={category === c.slug ? "default" : "outline"} size="sm" onClick={() => setCategory(c.slug)} className={categoryButtonClass}>
              {spanishCategoryName(c.slug)}
            </Button>
          ))}
        </div>
        {facets.length > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filtrar por tema">
            <Tag className="size-4 shrink-0 text-muted-foreground" />
            <Button type="button" size="sm" variant={tag === "all" ? "default" : "outline"} onClick={() => setTag("all")} className={categoryButtonClass}>
              Temas
            </Button>
            {facets.map((f) => (
              <Button
                key={f.id}
                type="button"
                size="sm"
                variant={tag === f.id ? "default" : "outline"}
                onClick={() => setTag((prev) => (prev === f.id ? "all" : f.id))}
                className={categoryButtonClass}
              >
                {f.label}
                <span className="ml-1 opacity-70">{f.count}</span>
              </Button>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs font-semibold text-muted-foreground" aria-live="polite">
          {results.length} herramienta{results.length === 1 ? "" : "s"}
          {category !== "all" ? ` · ${spanishCategoryName(category)}` : ""}
          {tag !== "all" ? ` · ${facets.find((f) => f.id === tag)?.label ?? tag}` : ""}
        </p>
      </div>

      {ready && favTools.length > 0 && !query && tag === "all" && category === "all" && (
        <section aria-labelledby="favorites-es">
          <div className="mb-2 flex items-center gap-2">
            <Star className="size-4 fill-highlight text-highlight" />
            <h2 id="favorites-es" className="text-sm font-bold">Tus favoritas</h2>
          </div>
          <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
            {favTools.map((t) => (
              <ToolCard key={t.slug} tool={t} locale="es" isFavorite onToggleFavorite={toggle} />
            ))}
          </div>
        </section>
      )}

      <div aria-live="polite">
        {results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">
            No hay herramientas que coincidan con «{query || tag}».
          </p>
        ) : (
          <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
            {results.map((t) => (
              <ToolCard key={t.slug} tool={t} locale="es" isFavorite={favorites.includes(t.slug)} onToggleFavorite={toggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
