import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Search, Star, Tag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_CATEGORIES, ALL_TOOLS, type CatalogTool } from "@/lib/all-tools";
import { ToolCard } from "@/components/ToolCard";
import { useFavorites } from "@/hooks/use-favorites";
import { spanishCategoryName, spanishToolName, spanishToolPath, spanishToolSummary } from "@/lib/i18n/es";
import { facetsWithCounts, toolMatchesTag } from "@/lib/tool-tags";

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
const STOP = new Set(["de", "la", "el", "los", "las", "para", "por", "un", "una", "y", "o", "en", "the", "a", "an", "and", "or", "for", "to", "of", "in"]);
const categoryButtonClass = "min-h-11 shrink-0 rounded-full px-3 text-xs font-semibold";
const PAGE_SIZE = 30;

export function SpanishToolSearch({ initialCategory, compactHome = false }: { initialCategory?: string; compactHome?: boolean }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState<string>(initialCategory ?? "all");
  const [tag, setTag] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [indexReady, setIndexReady] = useState(false);
  const { favorites, toggle, ready } = useFavorites();

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), 160);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (indexReady) return;
    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle(() => setIndexReady(true), { timeout: 1200 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setIndexReady(true), 250);
    return () => window.clearTimeout(id);
  }, [indexReady]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
    setTag("all");
  }, [category]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [tag, debouncedQuery]);

  const buildIndex = indexReady || query.length > 0;
  const index = useMemo(() => {
    if (!buildIndex) return [];
    return ALL_TOOLS.map((tool) => {
      const esName = spanishToolName(tool);
      return {
        tool,
        esName,
        text: normalize(`${esName} ${tool.name} ${spanishToolSummary(tool)} ${tool.summary} ${tool.description} ${tool.keywords.join(" ")}`),
      };
    });
  }, [buildIndex]);

  const results = useMemo(() => {
    let list = index;
    if (category !== "all") {
      list = list.filter((x) => x.tool.category === category);
    }
    if (tag !== "all") {
      list = list.filter((x) => toolMatchesTag(x.tool, tag));
    }
    const q = normalize(debouncedQuery);
    if (!q) return list.map((x) => x.tool);
    const tokens = q.split(/\s+/).filter((t) => t && !STOP.has(t));
    if (!tokens.length) return list.map((x) => x.tool);
    return list
      .map((x) => {
        let score = 0;
        for (const t of tokens) {
          if (x.text.includes(t)) score += 1;
          if (normalize(x.esName).includes(t)) score += 2;
        }
        return { tool: x.tool, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || spanishToolName(a.tool).localeCompare(spanishToolName(b.tool), "es"))
      .map((x) => x.tool);
  }, [index, category, tag, debouncedQuery]);

  const shown = results.slice(0, visible);
  const remaining = Math.max(0, results.length - visible);
  const staticTools = useMemo(() => {
    let list = ALL_TOOLS;
    if (category !== "all") list = list.filter((t) => t.category === category);
    return list.slice(0, PAGE_SIZE);
  }, [category]);

  const facets = useMemo(() => facetsWithCounts(ALL_TOOLS), []);

  if (compactHome) {
    return (
      <form
        role="search"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          const q = query.trim();
          if (q) window.location.href = `/es/herramientas?q=${encodeURIComponent(q)}`;
          else window.location.href = "/es/herramientas";
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar una herramienta…"
          className="h-12 rounded-xl border-border/80 bg-background pl-10 pr-24 text-sm"
          aria-label="Buscar herramientas"
        />
        <Button type="submit" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg">
          Buscar
        </Button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!indexReady) setIndexReady(true);
            }}
            placeholder="Buscar una herramienta…"
            className="h-12 rounded-xl pl-10 text-sm"
            aria-label="Buscar herramientas por nombre, descripción o palabra clave"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`${categoryButtonClass} ${category === "all" ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-accent"}`}
          onClick={() => setCategory("all")}
        >
          Todas
        </button>
        {ALL_CATEGORIES.map((c) => (
          <button
            key={c.slug}
            type="button"
            className={`${categoryButtonClass} ${category === c.slug ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-accent"}`}
            onClick={() => setCategory(c.slug)}
          >
            {spanishCategoryName(c.slug)}
          </button>
        ))}
      </div>

      {ready && favorites.length > 0 && (
        <section aria-labelledby="fav-title">
          <h2 id="fav-title" className="mb-2 flex items-center gap-2 text-sm font-bold">
            <Star className="size-4 text-amber-500" /> Tus favoritas
          </h2>
          <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
            {favorites
              .map((slug) => ALL_TOOLS.find((t) => t.slug === slug))
              .filter((t): t is CatalogTool => Boolean(t))
              .map((t) => (
                <ToolCard key={t.slug} tool={t} locale="es" isFavorite onToggleFavorite={toggle} />
              ))}
          </div>
        </section>
      )}

      <div aria-live="polite">
        {!indexReady && !query ? (
          <StaticListing tools={staticTools} />
        ) : results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">
            No hay herramientas que coincidan con «{query || tag}».
          </p>
        ) : (
          <>
            <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
              {shown.map((t) => (
                <ToolCard key={t.slug} tool={t} locale="es" isFavorite={favorites.includes(t.slug)} onToggleFavorite={toggle} />
              ))}
            </div>
            {remaining > 0 && (
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-5 text-sm font-bold hover:border-primary/40 hover:bg-accent"
                >
                  Mostrar {Math.min(PAGE_SIZE, remaining)} más ({remaining} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StaticListing({ tools }: { tools: CatalogTool[] }) {
  return (
    <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
      {tools.map((tool) => (
        <article
          key={tool.slug}
          className="flex min-h-14 items-center gap-3 border-b border-border/70 px-1 py-2 last:border-b-0 sm:min-h-16"
        >
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-xs font-black text-primary"
          >
            {spanishCategoryName(tool.category).slice(0, 1)}
          </span>
          <a href={spanishToolPath(tool)} className="min-w-0 flex-1 rounded-md py-1">
            <span className="block truncate text-sm font-bold">{spanishToolName(tool)}</span>
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">{spanishToolSummary(tool)}</span>
          </a>
          <span className="size-11 shrink-0" aria-hidden="true" />
        </article>
      ))}
    </div>
  );
}
