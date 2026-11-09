import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { getToolShowcase } from "@/lib/tool-showcase";
import { showcaseUi } from "@/lib/showcase-ui";
import { values } from "./MathTool.part1";
import { calculate } from "./MathTool.part2";

function MiniChart({ data, es }: { data: number[]; es: boolean }) {
  if (data.length < 2) return null;
  const visible = data.slice(0, 24);
  const min = Math.min(...visible);
  const max = Math.max(...visible);
  const span = max - min || 1;
  return (
    <section className="rounded-xl border border-border bg-background p-4" aria-label={es ? "Gráfico de datos" : "Data chart"}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{es ? "Vista de datos" : "Data view"}</h3>
        <span className="text-xs text-muted-foreground">
          {data.length} {es ? "valores" : "values"}
          {data.length > 24 ? (es ? " · primeros 24" : " · first 24") : ""}
        </span>
      </div>
      <div className="flex h-32 items-end gap-1 overflow-hidden" role="img" aria-label={es ? "Gráfico de barras de los valores introducidos" : "Bar chart of entered values"}>
        {visible.map((value, i) => (
          <div
            key={`${i}-${value}`}
            className="min-w-1 flex-1 rounded-t-sm bg-primary/70"
            style={{ height: `${Math.max(4, ((value - min) / span) * 100)}%` }}
            title={`${value}`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </section>
  );
}

export function MathTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const es = locale === "es";
  const showcase = getToolShowcase(tool.slug);
  const ui = showcaseUi(showcase?.accent);
  const premium = Boolean(showcase);
  const [raw, setRaw] = useState("");
  const [rawB, setRawB] = useState("");
  const [out, setOut] = useState("");
  const [error, setError] = useState("");
  const needsSecond = ["percentil", "z-score", "correlacion", "covarianza"].includes(tool.slug);
  const chartData = useMemo(() => values(raw), [raw]);
  const calculateClick = () => {
    try {
      setError("");
      setOut(calculate(tool.slug, raw, rawB, es));
    } catch (e) {
      setOut("");
      setError(e instanceof Error ? e.message : es ? "No se pudo calcular el resultado." : "Could not calculate the result.");
    }
  };

  const fieldClass = ui?.fieldTall ?? "min-h-40 w-full rounded-xl border bg-background p-4";
  const btnClass = ui?.btn ?? "rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`stats-input-${tool.slug}`} className="mb-2 block text-sm font-semibold">
          {needsSecond && ["correlacion", "covarianza"].includes(tool.slug)
            ? es
              ? "Primera serie de datos"
              : "First data series"
            : es
              ? "Lista de números"
              : "Number list"}
        </label>
        <textarea
          id={`stats-input-${tool.slug}`}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={es ? "p. ej., 5 10 15 20 o 5, 10, 15, 20" : "e.g. 5 10 15 20 or 5, 10, 15, 20"}
          className={fieldClass}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {es
            ? "Separa los valores con espacios, comas, punto y coma o saltos de línea."
            : "Separate values with spaces, commas, semicolons, or line breaks."}
        </p>
      </div>
      {needsSecond && (
        <div>
          <label htmlFor={`stats-second-${tool.slug}`} className="mb-2 block text-sm font-semibold">
            {["correlacion", "covarianza"].includes(tool.slug)
              ? es
                ? "Segunda serie de datos"
                : "Second data series"
              : tool.slug === "percentil"
                ? es
                  ? "Percentil (0–100)"
                  : "Percentile (0–100)"
                : es
                  ? "Valor a estandarizar"
                  : "Value to standardize"}
          </label>
          <textarea
            id={`stats-second-${tool.slug}`}
            value={rawB}
            onChange={(e) => setRawB(e.target.value)}
            placeholder={
              ["correlacion", "covarianza"].includes(tool.slug)
                ? es
                  ? "p. ej., 2 4 6 8"
                  : "e.g. 2 4 6 8"
                : tool.slug === "percentil"
                  ? es
                    ? "p. ej., 75"
                    : "e.g. 75"
                  : es
                    ? "p. ej., 12"
                    : "e.g. 12"
            }
            className={fieldClass.replace("min-h-32", "min-h-24").replace("min-h-28", "min-h-20")}
          />
        </div>
      )}
      {chartData.length > 1 && <MiniChart data={chartData} es={es} />}
      <button type="button" onClick={calculateClick} className={btnClass}>
        {es ? "Calcular" : "Calculate"}
      </button>
      {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">{error}</p>}
      {out && (
        <output
          aria-live="polite"
          className={`block whitespace-pre-wrap rounded-2xl border p-4 font-medium ${ui ? ui.out : "bg-muted/30"}`}
        >
          {out}
        </output>
      )}
    </div>
  );
}
