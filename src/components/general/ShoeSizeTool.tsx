import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { matchShoeSize, SHOE_PRESETS, type ShoeSystem } from "@/lib/general/shoe-size";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const SYSTEMS: ShoeSystem[] = ["eu", "uk", "usM", "usW", "cm"];

function systemLabel(system: ShoeSystem, es: boolean) {
  if (system === "eu") return "EU";
  if (system === "uk") return "UK";
  if (system === "usM") return es ? "US hombre" : "US men";
  if (system === "usW") return es ? "US mujer" : "US women";
  return es ? "cm (largo del pie)" : "cm (foot length)";
}

export function ShoeSizeTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [system, setSystem] = useState<ShoeSystem>(SHOE_PRESETS.eu42.system);
  const [raw, setRaw] = useState(SHOE_PRESETS.eu42.value);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => matchShoeSize(system, raw), [system, raw]);

  const statusText = (() => {
    if (result.status === "empty") return es ? "Escribí una talla para convertirla." : "Enter a size to convert it.";
    if (result.status === "invalid") return es ? "Usá un número, con coma o punto si hay media talla." : "Use a number. A comma or dot is fine for half sizes.";
    if (result.status === "range") return es ? "Fuera de la tabla adulta (35–48 EU / 22–31 cm)." : "Outside the adult chart (EU 35–48 / 22–31 cm).";
    if (!result.exact) return es ? "No hay coincidencia exacta: se muestra la fila más cercana." : "No exact match: showing the nearest chart row.";
    return es ? "Coincidencia exacta en la tabla." : "Exact chart match.";
  })();

  const summary = result.row
    ? [
        `EU: ${result.row.eu}`,
        `UK: ${result.row.uk}`,
        `${es ? "US hombre" : "US men"}: ${result.row.usM}`,
        `${es ? "US mujer" : "US women"}: ${result.row.usW}`,
        `${es ? "Largo" : "Length"}: ${result.row.cm.toFixed(1)} cm`,
        statusText,
      ].join("\n")
    : "";

  async function copyResult() {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span>{es ? "Sistema de origen" : "From system"}</span>
          <select className={inputClass} value={system} onChange={(e) => setSystem(e.target.value as ShoeSystem)}>
            {SYSTEMS.map((item) => (
              <option key={item} value={item}>{systemLabel(item, es)}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Talla" : "Size"}</span>
          <input className={inputClass} inputMode="decimal" value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="42" />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => { setSystem(SHOE_PRESETS.eu42.system); setRaw(SHOE_PRESETS.eu42.value); }}>EU 42</button>
        <button type="button" className={buttonClass} onClick={() => { setSystem(SHOE_PRESETS.usW8.system); setRaw(SHOE_PRESETS.usW8.value); }}>{es ? "US mujer 8" : "US women 8"}</button>
        <button type="button" className={buttonClass} onClick={() => setRaw("")}>{es ? "Limpiar" : "Reset"}</button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={!summary}>{copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar" : "Copy")}</button>
      </div>
      <p className="text-sm">{statusText}</p>
      {result.row && result.status !== "range" ? (
        <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-xl border p-3"><dt className="text-muted-foreground">EU</dt><dd className="text-lg font-semibold">{result.row.eu}</dd></div>
          <div className="rounded-xl border p-3"><dt className="text-muted-foreground">UK</dt><dd className="text-lg font-semibold">{result.row.uk}</dd></div>
          <div className="rounded-xl border p-3"><dt className="text-muted-foreground">{es ? "US hombre" : "US men"}</dt><dd className="text-lg font-semibold">{result.row.usM}</dd></div>
          <div className="rounded-xl border p-3"><dt className="text-muted-foreground">{es ? "US mujer" : "US women"}</dt><dd className="text-lg font-semibold">{result.row.usW}</dd></div>
          <div className="rounded-xl border p-3"><dt className="text-muted-foreground">{es ? "Largo" : "Length"}</dt><dd className="text-lg font-semibold">{result.row.cm.toFixed(1)} cm</dd></div>
        </dl>
      ) : null}
      <p className="text-xs text-muted-foreground">
        {es
          ? "Tabla adulta de planificación (Mondopoint de venta). Las marcas pueden variar media talla. Medí el pie en cm para la fila más estable."
          : "Adult planning chart (retail Mondopoint). Brands can differ by half a size. Measuring foot length in cm is the steadier row."}
      </p>
    </div>
  );
}
