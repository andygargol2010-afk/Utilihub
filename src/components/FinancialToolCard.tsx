import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { FinancialTool } from "@/lib/financial-tools";
import { englishToolSlug } from "@/lib/route-slugs";
import { useFavorites } from "@/hooks/use-favorites";

export function FinancialToolCard({ tool, locale = "en" }: { tool: FinancialTool; locale?: "en" | "es" }) {
  const { favorites, toggle, ready } = useFavorites();
  const isFavorite = ready && favorites.includes(tool.slug);
  const isSpanish = locale === "es";
  const categoryLabel = isSpanish ? "Finanzas" : "Finance";

  return (
    <article className="tool-card-row group relative flex min-h-[4.25rem] items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 transition-[border-color,box-shadow,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card hover:shadow-[0_12px_28px_-16px_rgba(67,56,202,0.35)] sm:min-h-[4.5rem]">
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-xs font-black text-primary shadow-sm ring-1 ring-primary/10 transition group-hover:ring-primary/25"
      >
        F
      </span>
      <Link
        to={isSpanish ? "/es/finanzas/$slug" : "/finance/$slug"}
        params={{ slug: isSpanish ? tool.slug : englishToolSlug(tool) }}
        className="min-w-0 flex-1 rounded-md py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="block truncate text-sm font-bold tracking-tight group-hover:text-primary">{tool.name}</span>
        {tool.summary ? (
          <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-muted-foreground">{tool.summary}</span>
        ) : null}
        <span className="mt-1.5 inline-flex rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
          {categoryLabel}
        </span>
      </Link>
      <button
        type="button"
        onClick={() => toggle(tool.slug)}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? `${isSpanish ? "Quitar" : "Remove"} ${tool.name} ${isSpanish ? "de favoritos" : "from favorites"}`
            : `${isSpanish ? "Añadir" : "Add"} ${tool.name} ${isSpanish ? "a favoritos" : "to favorites"}`
        }
        className={
          isFavorite
            ? "btn-press grid size-11 shrink-0 place-items-center rounded-xl bg-highlight/25 text-amber-600 ring-1 ring-amber-500/40 transition hover:bg-highlight/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-amber-300"
            : "btn-press grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-accent hover:text-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        }
      >
        <Star className="size-4" fill={isFavorite ? "currentColor" : "none"} strokeWidth={isFavorite ? 0 : 2} />
      </button>
    </article>
  );
}
