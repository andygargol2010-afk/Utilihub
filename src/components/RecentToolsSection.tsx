import { Link } from "@tanstack/react-router";
import { Clock3 } from "lucide-react";
import { ALL_TOOLS, toolHref } from "@/lib/all-tools";
import { useRecentTools } from "@/hooks/use-recent-tools";

export function RecentToolsSection() {
  const { recent, ready } = useRecentTools();
  if (!ready || recent.length === 0) return null;
  const tools = recent.map((slug) => ALL_TOOLS.find((tool) => tool.slug === slug)).filter(Boolean);
  if (!tools.length) return null;
  return (
    <section className="container-page pb-14" aria-labelledby="recientes">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.16em] text-primary"><Clock3 className="size-3.5" /> Tu actividad</p>
          <h2 id="recientes" className="mt-2 text-2xl font-extrabold sm:text-3xl">Usadas recientemente</h2>
          <p className="mt-2 text-sm text-muted-foreground">Vuelve rápidamente a las herramientas que acabas de utilizar.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => tool ? (
          <Link key={tool.slug} to={toolHref(tool)} className="surface-card group p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift">
            <p className="font-bold group-hover:text-primary">{tool.name}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.summary}</p>
          </Link>
        ) : null)}
      </div>
    </section>
  );
}
