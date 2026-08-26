import { Clock3, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { allToolBySlug, toolHref } from "@/lib/all-tools";

export function RecentToolsSection() {
  const { recent, ready, clear } = useRecentTools();
  if (!ready || recent.length === 0) return null;
  const tools = recent.map((item) => allToolBySlug(item.slug)).filter(Boolean);
  if (!tools.length) return null;

  return <section className="container-page pb-12" aria-labelledby="recientes">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2"><Clock3 className="size-4 text-primary" /><h2 id="recientes" className="text-xl font-extrabold">Usadas recientemente</h2></div>
      <button type="button" onClick={clear} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Borrar historial reciente"><X className="size-3.5" /> Borrar</button>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{tools.slice(0, 8).map((tool) => <Link key={tool!.slug} to={toolHref(tool!)} className="surface-card group p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift"><p className="font-semibold group-hover:text-primary">{tool!.name}</p><p className="mt-1 text-xs text-muted-foreground">{tool!.summary}</p></Link>)}</div>
  </section>;
}
