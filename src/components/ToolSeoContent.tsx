import type { CatalogTool } from "@/lib/all-tools";

export function ToolSeoContent({ tool }: { tool: CatalogTool }) {
  const hasDetails = tool.about.length > 0 || tool.steps.length > 0 || Boolean(tool.faq?.length);
  if (!hasDetails) return null;
  return <article className="mt-10 border-t border-border/70 pt-8" aria-labelledby="tool-guide-title">
    <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Guía de la herramienta</p><h2 id="tool-guide-title" className="mt-1 text-2xl font-black">{tool.name}: cómo funciona</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Información práctica para entender el resultado y utilizar esta herramienta correctamente.</p></div>
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_.9fr]">
      {tool.about.length > 0 && <section aria-labelledby="tool-about-title"><h3 id="tool-about-title" className="text-base font-bold">Sobre {tool.name}</h3><div className="mt-3 space-y-3">{tool.about.map((paragraph, index) => <p key={index} className="text-sm leading-6 text-muted-foreground">{paragraph}</p>)}</div></section>}
      {tool.steps.length > 0 && <section aria-labelledby="tool-steps-title"><h3 id="tool-steps-title" className="text-base font-bold">Cómo usarla</h3><ol className="mt-3 space-y-3">{tool.steps.map((step, index) => <li key={index} className="flex gap-3 text-sm leading-6 text-muted-foreground"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">{index + 1}</span><span>{step}</span></li>)}</ol></section>}
    </div>
    {tool.faq?.length ? <section className="mt-8 max-w-3xl" aria-labelledby="tool-faq-title"><h3 id="tool-faq-title" className="text-base font-bold">Preguntas frecuentes</h3><dl className="mt-3 divide-y divide-border rounded-xl border border-border/70 bg-card px-4">{tool.faq.map((item) => <div key={item.q} className="py-4"><dt className="font-semibold">{item.q}</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">{item.a}</dd></div>)}</dl></section> : null}
  </article>;
}
