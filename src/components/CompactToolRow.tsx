import { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { ALL_CATEGORIES, type CatalogTool } from "@/lib/all-tools";
import { englishToolSlug } from "@/lib/route-slugs";
import { spanishCategoryName, spanishToolName } from "@/lib/i18n/es";
import { useFavorites } from "@/hooks/use-favorites";
import { INTENT_TAGS, tagsForTool } from "@/lib/tool-tags";

export const CompactToolRow = memo(function CompactToolRow({
  tool,
  isFavorite: controlledFavorite,
  onToggleFavorite,
  locale = "en",
}: {
  tool: CatalogTool;
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string) => void;
  locale?: "en" | "es";
}) {
  const { favorites, toggle, ready } = useFavorites();
  const internalFavorite = ready && favorites.includes(tool.slug);
  const isFavorite = onToggleFavorite ? !!controlledFavorite : internalFavorite;
  const toggleFavorite = () => (onToggleFavorite ? onToggleFavorite(tool.slug) : toggle(tool.slug));
  const category = ALL_CATEGORIES.find((c) => c.slug === tool.category);
  const isSpanish = locale === "es";
  const displayName = isSpanish ? spanishToolName(tool) : tool.name;
  const categoryLabel = isSpanish ? spanishCategoryName(tool.category) : category?.name ?? tool.category;
  const displaySummary = tool.summary?.trim()
    ? tool.summary
    : isSpanish
      ? categoryLabel
      : "";

  const tagLabels = useMemo(() => {
    const ids = tagsForTool(tool).slice(0, 2);
    return ids
      .map((id) => INTENT_TAGS.find((t) => t.id === id))
      .filter(Boolean)
      .map((t) => (isSpanish ? t!.labelEs : t!.label));
  }, [tool, isSpanish]);

  const route = isSpanish
    ? tool.category === "finanzas"
      ? "/es/finanzas/$slug"
      : "/es/herramientas/$slug"
    : tool.category === "finanzas"
      ? "/finance/$slug"
      : "/tools/$slug";
  const slug = isSpanish ? tool.slug : englishToolSlug(tool);

  return (
    <article
      className="tool-card-row group relative flex min-h-[4.25rem] items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 transition-[border-color,box-shadow,transform,background-color] duration-200 last:border-b-0 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card hover:shadow-[0_12px_28px_-16px_rgba(67,56,202,0.35)] sm:min-h-[4.5rem]"
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-xs font-black text-primary shadow-sm ring-1 ring-primary/10 transition group-hover:ring-primary/25"
      >
        {categoryLabel.slice(0, 1)}
      </span>
      <Link
        to={route}
        params={{ slug }}
        className="min-w-0 flex-1 rounded-md py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="block truncate text-sm font-bold tracking-tight group-hover:text-primary">
          {displayName}
        </span>
        {displaySummary ? (
          <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-muted-foreground">
            {displaySummary}
          </span>
        ) : null}
        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex max-w-[10rem] truncate rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            {categoryLabel}
          </span>
          {tagLabels.map((label) => (
            <span
              key={label}
              className="inline-flex max-w-[8rem] truncate rounded-full border border-border/80 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </span>
      </Link>
      <button
        type="button"
        onClick={toggleFavorite}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? `${isSpanish ? "Quitar" : "Remove"} ${displayName} ${isSpanish ? "de favoritos" : "from favorites"}`
            : `${isSpanish ? "Añadir" : "Add"} ${displayName} ${isSpanish ? "a favoritos" : "to favorites"}`
        }
        className={
          isFavorite
            ? "grid size-11 shrink-0 place-items-center rounded-xl bg-highlight/25 text-amber-600 ring-1 ring-amber-500/40 transition hover:bg-highlight/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-amber-300"
            : "grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-accent hover:text-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        }
      >
        <Star className="size-4" fill={isFavorite ? "currentColor" : "none"} strokeWidth={isFavorite ? 0 : 2} />
      </button>
    </article>
  );
});
