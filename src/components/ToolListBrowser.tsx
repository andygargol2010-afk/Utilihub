import { useMemo, useState, type ReactNode } from "react";
import { Search, Tag } from "lucide-react";
import { facetsWithCounts, toolMatchesTag } from "@/lib/tool-tags";

export type BrowseableTool = {
  id: string;
  name: string;
  /** Extra text used only for filtering (summary, keywords…). */
  searchText?: string;
  slug?: string;
  keywords?: string[];
  kind?: string;
  summary?: string;
  category?: string;
};

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function letterOf(name: string) {
  const ch = normalize(name).charAt(0);
  return ch >= "a" && ch <= "z" ? ch.toUpperCase() : "#";
}

const PAGE_SIZE = 20;

/**
 * Mobile-friendly tool list: local search, intent tags, A–Z jump, progressive reveal.
 */
export function ToolListBrowser<T extends BrowseableTool>({
  tools,
  locale = "en",
  renderItem,
  pageSize = PAGE_SIZE,
  searchPlaceholder,
  categorySlug,
}: {
  tools: T[];
  locale?: "en" | "es";
  renderItem: (tool: T) => ReactNode;
  pageSize?: number;
  searchPlaceholder?: string;
  /** Internal category slug for curated facet chips (e.g. finanzas, matematicas). */
  categorySlug?: string;
}) {
  const es = locale === "es";
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(pageSize);
  const [activeLetter, setActiveLetter] = useState<string | "all">("all");
  const [activeTag, setActiveTag] = useState<string | "all">("all");

  const facets = useMemo(
    () => facetsWithCounts(tools, categorySlug ?? "all", locale),
    [tools, categorySlug, locale],
  );

  const filtered = useMemo(() => {
    const tokens = normalize(query)
      .split(/\s+/)
      .filter((t) => t.length > 1);
    let list = tools;
    if (tokens.length) {
      list = tools.filter((tool) => {
        const hay = normalize(`${tool.name} ${tool.searchText ?? ""}`);
        return tokens.every((token) => hay.includes(token));
      });
    }
    if (activeTag !== "all") {
      list = list.filter((tool) =>
        toolMatchesTag(
          {
            slug: tool.slug ?? tool.id,
            name: tool.name,
            keywords: tool.keywords,
            kind: tool.kind,
            summary: tool.summary ?? tool.searchText,
          },
          activeTag,
        ),
      );
    }
    if (activeLetter !== "all") {
      list = list.filter((tool) => letterOf(tool.name) === activeLetter);
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name, es ? "es" : "en"));
  }, [tools, query, activeLetter, activeTag, es]);

  const letters = useMemo(() => {
    const set = new Set<string>();
    for (const tool of tools) set.add(letterOf(tool.name));
    return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"].filter(
      (L) => set.has(L),
    );
  }, [tools]);

  const shown = filtered.slice(0, visible);
  const remaining = Math.max(0, filtered.length - shown.length);

  const placeholder =
    searchPlaceholder ?? (es ? "Buscar en esta lista…" : "Search in this list…");

  const resetPage = () => setVisible(pageSize);

  return (
    <div className="space-y-3">
      <div className="sticky top-16 z-20 -mx-1 space-y-2 bg-background/95 px-1 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-12 w-full rounded-xl border border-border/70 bg-card pl-11 pr-3 text-base shadow-sm focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        {facets.length > 0 && (
          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="toolbar"
            aria-label={es ? "Filtrar por tema" : "Filter by topic"}
          >
            <Tag className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <button
              type="button"
              onClick={() => {
                setActiveTag("all");
                resetPage();
              }}
              className={`min-h-9 shrink-0 rounded-full px-3 text-xs font-bold ${
                activeTag === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {es ? "Temas" : "Topics"}
            </button>
            {facets.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setActiveTag((prev) => (prev === f.id ? "all" : f.id));
                  resetPage();
                }}
                className={`min-h-9 shrink-0 rounded-full px-3 text-xs font-semibold ${
                  activeTag === f.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                {f.label}
                <span className="ml-1 opacity-70">{f.count}</span>
              </button>
            ))}
          </div>
        )}

        {letters.length > 4 && (
          <div
            className="flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="toolbar"
            aria-label={es ? "Saltar por letra" : "Jump by letter"}
          >
            <button
              type="button"
              onClick={() => {
                setActiveLetter("all");
                resetPage();
              }}
              className={`min-h-9 shrink-0 rounded-full px-3 text-xs font-bold ${
                activeLetter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {es ? "Todas" : "All"}
            </button>
            {letters.map((L) => (
              <button
                key={L}
                type="button"
                onClick={() => {
                  setActiveLetter(L);
                  resetPage();
                }}
                className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
                  activeLetter === L
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                {L}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs font-semibold text-muted-foreground" aria-live="polite">
          {es
            ? `${filtered.length} de ${tools.length} herramientas`
            : `${filtered.length} of ${tools.length} tools`}
          {activeTag !== "all" ? ` · ${facets.find((f) => f.id === activeTag)?.label ?? activeTag}` : ""}
          {activeLetter !== "all" ? ` · ${activeLetter}` : ""}
          {query.trim() ? ` · “${query.trim()}”` : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">
          {es ? `No hay coincidencias.` : `No matches.`}
        </p>
      ) : (
        <>
          <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
            {shown.map((tool) => (
              <div key={tool.id}>{renderItem(tool)}</div>
            ))}
          </div>

          {remaining > 0 && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setVisible((v) => v + pageSize)}
                className="inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-5 text-sm font-bold hover:border-primary/40 hover:bg-accent"
              >
                {es
                  ? `Mostrar ${Math.min(pageSize, remaining)} más (${remaining} restantes)`
                  : `Show ${Math.min(pageSize, remaining)} more (${remaining} left)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
