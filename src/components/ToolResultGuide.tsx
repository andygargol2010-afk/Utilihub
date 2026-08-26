import type { CatalogTool } from "@/lib/all-tools";

export function ToolResultGuide({ tool }: { tool: CatalogTool }) {
  const firstAbout = tool.about?.[0];
  if (!firstAbout) return null;
  return <aside className="rounded-xl border border-border bg-muted/30 p-4" aria-label="Interpretación del resultado">
    <h2 className="text-sm font-bold">Cómo interpretar el resultado</h2>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{firstAbout}</p>
    <p className="mt-2 text-xs leading-5 text-muted-foreground">Comprueba siempre que las unidades de entrada sean compatibles y que el resultado corresponda al contexto de tu cálculo.</p>
  </aside>;
}
