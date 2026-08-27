import type { CatalogTool } from "@/lib/all-tools";

export function ToolResultGuide({ tool }: { tool: CatalogTool }) {
  const firstAbout = tool.about?.[0];
  if (!firstAbout) return null;
  return <aside className="rounded-lg border border-border/70 bg-surface/45 p-3" aria-label={`Información sobre ${tool.name}`}>
    <p className="text-sm leading-6 text-muted-foreground">{firstAbout}</p>
  </aside>;
}
