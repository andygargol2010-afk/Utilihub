import type {GeneralTool} from "@/lib/general/types";

export function MaintenanceTool({tool}:{tool:GeneralTool}){
  return <section className="rounded-2xl border border-border bg-muted/20 p-6" role="status" aria-live="polite">
    <div className="space-y-2">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Implementación no disponible</p>
      <h2 className="text-xl font-bold">Herramienta en mantenimiento</h2>
      <p className="text-sm text-muted-foreground">Esta herramienta está registrada, pero su implementación específica aún no está disponible. No se ejecutará una herramienta genérica para evitar resultados incorrectos.</p>
      <p className="font-mono text-xs text-muted-foreground">slug: {tool.slug}</p>
    </div>
  </section>;
}
