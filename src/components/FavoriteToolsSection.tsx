import { Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { ALL_TOOLS } from "@/lib/all-tools";
import { useFavorites } from "@/hooks/use-favorites";
import { ToolCard } from "@/components/ToolCard";

export function FavoriteToolsSection() {
  const { favorites, ready } = useFavorites();
  if (!ready || favorites.length === 0) return null;
  const tools = favorites.map((slug) => ALL_TOOLS.find((tool) => tool.slug === slug)).filter(Boolean).slice(0, 12);
  if (!tools.length) return null;
  return <section className="container-page pb-14" aria-labelledby="favoritas">
    <div className="flex items-end justify-between gap-4"><div><p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.16em] text-primary"><Star className="size-3.5" fill="currentColor"/> Tu biblioteca</p><h2 id="favoritas" className="mt-2 text-2xl font-extrabold sm:text-3xl">Mis Herramientas Favoritas</h2><p className="mt-2 text-sm text-muted-foreground">Tus utilidades guardadas, listas para volver a usarlas.</p></div><Link to="/herramientas" className="hidden items-center gap-1 text-sm font-bold text-primary hover:underline sm:flex">Explorar más <ArrowRight className="size-4"/></Link></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.map((tool) => tool ? <ToolCard key={tool.slug} tool={tool} /> : null)}</div>
  </section>;
}
