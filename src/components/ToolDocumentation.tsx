import type { CatalogTool } from "@/lib/all-tools";

export function ToolDocumentation({ tool }: { tool: CatalogTool }) {
  const hasContent = tool.about.length > 0 || tool.steps.length > 0 || Boolean(tool.faq?.length);
  if (!hasContent) return null;
  return <details className="mt-10 border-t border-border/70 pt-3">
    <summary className="min-h-11 cursor-pointer list-none rounded-lg px-3 py-3 text-sm font-semibold text-foreground hover:bg-accent [&::-webkit-details-marker]:hidden">
      💡 Fórmulas, documentación y preguntas frecuentes
    </summary>
    <div className="space-y-7 px-3 pb-4 pt-4">
      {tool.about.length > 0 && <section><h2 className="text-base font-bold">Sobre {tool.name}</h2>{tool.about.map((p, i) => <p key={i} className="mt-2 text-sm leading-6 text-muted-foreground">{p}</p>)}</section>}
      {tool.steps.length > 0 && <section><h2 className="text-base font-bold">Cómo usar {tool.name.toLowerCase()}</h2><ol className="mt-3 space-y-2">{tool.steps.map((s, i) => <li key={i} className="flex gap-3 text-sm text-muted-foreground"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">{i + 1}</span><span>{s}</span></li>)}</ol></section>}
      {tool.faq?.length ? <section><h2 className="text-base font-bold">Preguntas frecuentes</h2><dl className="mt-2 divide-y divide-border">{tool.faq.map((f) => <div key={f.q} className="py-3"><dt className="text-sm font-semibold">{f.q}</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">{f.a}</dd></div>)}</dl></section> : null}
    </div>
  </details>;
}
