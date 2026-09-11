import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { ALL_CATEGORIES, type CatalogTool } from "@/lib/all-tools";
import { englishToolSlug } from "@/lib/route-slugs";
import { spanishCategoryName, spanishToolName, spanishToolPath } from "@/lib/i18n/es";
import { useFavorites } from "@/hooks/use-favorites";

export const CompactToolRow = memo(function CompactToolRow({ tool, isFavorite: controlledFavorite, onToggleFavorite, locale = "en" }: { tool: CatalogTool; isFavorite?: boolean; onToggleFavorite?: (slug: string) => void; locale?: "en" | "es" }) {
  const { favorites, toggle, ready } = useFavorites();
  const internalFavorite = ready && favorites.includes(tool.slug);
  const isFavorite = onToggleFavorite ? !!controlledFavorite : internalFavorite;
  const toggleFavorite = () => onToggleFavorite ? onToggleFavorite(tool.slug) : toggle(tool.slug);
  const category = ALL_CATEGORIES.find((c) => c.slug === tool.category);
  const isSpanish = locale === "es";
  const displayName = isSpanish ? spanishToolName(tool) : tool.name;
  const displaySummary = isSpanish ? `Herramienta gratuita de ${spanishCategoryName(tool.category).toLowerCase()}.` : tool.summary;
  const route = isSpanish ? (tool.category === "finanzas" ? "/es/finanzas/$slug" : "/es/herramientas/$slug") : (tool.category === "finanzas" ? "/finance/$slug" : "/tools/$slug");
  const slug = isSpanish ? tool.slug : englishToolSlug(tool);
  const toolLink = <Link to={route} params={{ slug }} className="min-w-0 flex-1 rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
    <span className="block truncate text-sm font-bold group-hover:text-primary">{displayName}</span>
    <span className="mt-0.5 block truncate text-xs text-muted-foreground">{displaySummary}</span>
  </Link>;

  return <article className="group flex min-h-14 items-center gap-3 border-b border-border/70 px-1 py-2 last:border-b-0 sm:min-h-16">
    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-xs font-black text-primary">{(isSpanish ? spanishCategoryName(tool.category) : category?.name)?.slice(0, 1) ?? "U"}</span>
    {toolLink}
    <button type="button" onClick={toggleFavorite} aria-pressed={isFavorite} aria-label={isFavorite ? `${isSpanish ? "Quitar" : "Remove"} ${displayName} ${isSpanish ? "de favoritos" : "from favorites"}` : `${isSpanish ? "Añadir" : "Add"} ${displayName} ${isSpanish ? "a favoritos" : "to favorites"}`} className="grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <Star className="size-4" fill={isFavorite ? "currentColor" : "none"} />
    </button>
  </article>;
});
