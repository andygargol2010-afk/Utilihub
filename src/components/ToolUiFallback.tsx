export function ToolUiFallback({ locale = "en" }: { locale?: "en" | "es" }) {
  const es = locale === "es";
  return (
    <div className="space-y-3" role="status" aria-live="polite" aria-busy="true">
      <p className="text-sm text-muted-foreground">{es ? "Cargando herramienta…" : "Loading tool…"}</p>
      <div className="h-11 animate-pulse rounded-xl bg-muted" />
      <div className="h-11 animate-pulse rounded-xl bg-muted" />
      <div className="h-28 animate-pulse rounded-xl bg-muted" />
      <div className="h-11 w-1/3 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
