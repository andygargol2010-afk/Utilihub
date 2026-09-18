import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Search, SlidersHorizontal, Star, Tag } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_CATEGORIES, ALL_TOOLS, toolHref } from "@/lib/all-tools";
import { ToolCard } from "@/components/ToolCard";
import { useFavorites } from "@/hooks/use-favorites";
import { facetsWithCounts, toolMatchesTag } from "@/lib/tool-tags";

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
const STOP = new Set([
  "de",
  "la",
  "el",
  "los",
  "las",
  "para",
  "por",
  "un",
  "una",
  "y",
  "o",
  "en",
  "the",
  "a",
  "an",
  "and",
  "or",
  "for",
  "to",
  "of",
  "in",
]);

const PAGE_SIZE = 30;

export function ToolSearch({
  initialCategory,
  compactHome = false,
}: {
  initialCategory?: string;
  compactHome?: boolean;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState<string>(initialCategory ?? "all");
  const [tag, setTag] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const { favorites, toggle, ready } = useFavorites();

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), 160);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
    setTag("all");
  }, [category]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [tag, debouncedQuery]);

  const index = useMemo(
    () =>
      ALL_TOOLS.map((tool) => ({
        tool,
        name: normalize(tool.name),
        text: normalize(`${tool.name} ${tool.summary} ${tool.description} ${tool.keywords.join(" ")}`),
      })),
    [],
  );

  const categoryTools = useMemo(() => {
    if (category === "all") return ALL_TOOLS;
    return ALL_TOOLS.filter((t) => t.category === category);
  }, [category]);

  const facets = useMemo(
    () => facetsWithCounts(categoryTools, category, "en"),
    [categoryTools, category],
  );

  const results = useMemo(() => {
    const tokens = normalize(debouncedQuery)
      .split(/\s+/)
      .filter((token) => token.length > 1 && !STOP.has(token));
    return index
      .filter(({ tool }) => category === "all" || tool.category === category)
      .filter(({ tool }) => tag === "all" || toolMatchesTag(tool, tag))
      .map((item) => {
        if (!tokens.length) return { tool: item.tool, score: 0 };
        let score = 0;
        for (const token of tokens) {
          if (item.name === token) score += 100;
          else if (item.name.startsWith(token)) score += 40;
          else if (item.name.includes(token)) score += 25;
          else if (item.tool.keywords.some((k) => normalize(k) === token)) score += 30;
          else if (item.tool.keywords.some((k) => normalize(k).includes(token))) score += 15;
          else if (item.text.includes(token)) score += 5;
        }
        return { tool: item.tool, score: score === tokens.length * 5 ? 0 : score };
      })
      .filter(({ score }) => !tokens.length || score > 0)
      .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
      .map(({ tool }) => tool);
  }, [category, index, tag, debouncedQuery]);

  const compactResults = debouncedQuery.trim() ? results.slice(0, 6) : [];
  const shown = results.slice(0, visible);
  const remaining = Math.max(0, results.length - shown.length);

  const submitCompactSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("q") ?? "");
    const normalizedValue = normalize(value);
    if (normalizedValue.length < 2) return;
    const match =
      compactResults[0] ??
      ALL_TOOLS.find((tool) =>
        normalize(`${tool.name} ${tool.summary} ${tool.description} ${tool.keywords.join(" ")}`).includes(
          normalizedValue,
        ),
      );
    if (match) {
      void navigate({ to: toolHref(match) as never });
    }
  };

  const favTools = ready ? ALL_TOOLS.filter((tool) => favorites.includes(tool.slug)) : [];
  const categoryButtonClass = "min-h-11 shrink-0 rounded-full px-3 text-xs font-semibold";

  return (
    <div className="space-y-5">
      <div className="sticky top-16 z-20 rounded-xl border border-border/70 bg-background/95 p-2.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:p-3">
        <form className="relative" onSubmit={compactHome ? submitCompactSearch : undefined}>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onInput={(e) => setQuery(e.currentTarget.value)}
            placeholder="Search a tool…"
            aria-label="Search tools by name, description, or keyword"
            className="h-12 rounded-lg border-transparent bg-card pl-11 text-base shadow-none focus-visible:border-primary/40"
          />
          {compactHome && compactResults.length > 0 && (
            <div
              className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lift"
              role="listbox"
              aria-label="Search results"
            >
              {compactResults.map((tool) => (
                <Link
                  key={tool.slug}
                  to={toolHref(tool)}
                  role="option"
                  className="block rounded-lg px-3 py-2.5 hover:bg-accent"
                >
                  <span className="block text-sm font-bold">{tool.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">{tool.summary}</span>
                </Link>
              ))}
            </div>
          )}
          {compactHome && query.trim() && compactResults.length === 0 && debouncedQuery.trim() && (
            <div
              className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground shadow-lift"
              role="status"
            >
              No tools found for «{query}».
            </div>
          )}
        </form>
        {!compactHome && (
          <div
            className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Filter by category"
          >
            <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
            <Button
              type="button"
              size="sm"
              variant={category === "all" ? "default" : "outline"}
              onClick={() => setCategory("all")}
              className={categoryButtonClass}
            >
              All
            </Button>
            {ALL_CATEGORIES.map((c) => (
              <Button
                key={c.slug}
                type="button"
                variant={category === c.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(c.slug)}
                className={categoryButtonClass}
              >
                {c.name}
              </Button>
            ))}
          </div>
        )}
        {!compactHome && facets.length > 0 && (
          <div
            className="mt-1.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Filter by topic"
          >
            <Tag className="size-4 shrink-0 text-muted-foreground" />
            <Button
              type="button"
              size="sm"
              variant={tag === "all" ? "default" : "outline"}
              onClick={() => setTag("all")}
              className={categoryButtonClass}
            >
              Topics
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
        {!compactHome && (
          <p className="mt-2 text-xs font-semibold text-muted-foreground" aria-live="polite">
            {results.length} tool{results.length === 1 ? "" : "s"}
            {category !== "all" ? ` · ${ALL_CATEGORIES.find((c) => c.slug === category)?.name ?? category}` : ""}
            {tag !== "all" ? ` · ${facets.find((f) => f.id === tag)?.label ?? tag}` : ""}
          </p>
        )}
      </div>
      {!compactHome && favTools.length > 0 && !query && tag === "all" && category === "all" && (
        <section aria-labelledby="favorites">
          <div className="mb-2 flex items-center gap-2">
            <Star className="size-4 fill-highlight text-highlight" />
            <h2 id="favorites" className="text-sm font-bold">
              Your favorites
            </h2>
          </div>
          <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
            {favTools.map((t) => (
              <ToolCard key={t.slug} tool={t} isFavorite onToggleFavorite={toggle} />
            ))}
          </div>
        </section>
      )}
      {!compactHome && (
        <div aria-live="polite">
          {results.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">
              No tools match «{query || tag}».
            </p>
          ) : (
            <>
              <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
                {shown.map((t) => (
                  <ToolCard
                    key={t.slug}
                    tool={t}
                    isFavorite={favorites.includes(t.slug)}
                    onToggleFavorite={toggle}
                  />
                ))}
              </div>
              {remaining > 0 && (
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-5 text-sm font-bold hover:border-primary/40 hover:bg-accent"
                  >
                    Show {Math.min(PAGE_SIZE, remaining)} more ({remaining} left)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
