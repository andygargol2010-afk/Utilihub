import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  COLOR_HEX,
  DIGIT_COLORS,
  MULTIPLIER_COLORS,
  RESISTOR_PRESETS,
  TCR_COLORS,
  TOLERANCE_COLORS,
  colorLabel,
  decodeResistor,
  formatOhms,
  type BandColor,
  type BandCount,
} from "@/lib/general/resistor-bands";

type Locale = "en" | "es";

const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const ROLE_COLORS: Record<"digit" | "multiplier" | "tolerance" | "tcr", BandColor[]> = {
  digit: DIGIT_COLORS,
  multiplier: MULTIPLIER_COLORS,
  tolerance: TOLERANCE_COLORS,
  tcr: TCR_COLORS,
};

export function ResistorBandsTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [count, setCount] = useState<BandCount>(4);
  const [bands, setBands] = useState<BandColor[]>(["brown", "black", "red", "gold"]);
  const [copied, setCopied] = useState(false);

  const roles = useMemo(() => {
    if (count === 4) return ["digit", "digit", "multiplier", "tolerance"] as const;
    if (count === 5) return ["digit", "digit", "digit", "multiplier", "tolerance"] as const;
    return ["digit", "digit", "digit", "multiplier", "tolerance", "tcr"] as const;
  }, [count]);

  const result = useMemo(() => decodeResistor(bands.slice(0, count), count), [bands, count]);

  function setCountSafe(next: BandCount) {
    setCount(next);
    setBands((prev) => {
      const base = prev.slice(0, next);
      while (base.length < next) base.push(next === 6 && base.length === 5 ? "brown" : "black");
      if (next >= 4) base[next === 4 ? 3 : 4] = TOLERANCE_COLORS.includes(base[next === 4 ? 3 : 4]) ? base[next === 4 ? 3 : 4] : "gold";
      return base;
    });
  }

  function setBand(index: number, color: BandColor) {
    setBands((prev) => prev.map((c, i) => (i === index ? color : c)));
  }

  const summary = result.status === "ok"
    ? [
        `${es ? "Valor" : "Value"}: ${formatOhms(result.ohms, es)}`,
        `${es ? "Tolerancia" : "Tolerance"}: ±${result.tolerancePct}%`,
        `${es ? "Rango" : "Range"}: ${formatOhms(result.min, es)} – ${formatOhms(result.max, es)}`,
        result.tcrPpm != null ? `${es ? "Coeficiente" : "Tempco"}: ${result.tcrPpm} ppm/°C` : "",
      ].filter(Boolean).join("\n")
    : "";

  async function copyResult() {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const invalid = result.status === "invalid"
    ? es
      ? "Dorado, plateado o ninguno no valen como dígito. Revisá multiplicador, tolerancia o ppm."
      : "Gold, silver, or none cannot be a digit. Check multiplier, tolerance, or ppm."
    : es
      ? "Código EIA local. No mide la pieza."
      : "Local EIA code. It does not measure the part.";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {([4, 5, 6] as BandCount[]).map((n) => (
          <button key={n} type="button" className={buttonClass} onClick={() => setCountSafe(n)} aria-pressed={count === n}>
            {n} {es ? "bandas" : "bands"}
          </button>
        ))}
        {RESISTOR_PRESETS.map((p) => (
          <button key={p.id} type="button" className={buttonClass} onClick={() => { setCount(p.count); setBands(p.bands); }}>
            {p.id === "1k5" ? "1 kΩ" : p.id === "10k1" ? "10 kΩ" : "4.7 kΩ"}
          </button>
        ))}
        <button type="button" className={buttonClass} onClick={() => { setCount(4); setBands(["brown", "black", "red", "gold"]); }}>
          {es ? "Reiniciar" : "Reset"}
        </button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={!summary}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
      </div>
      <div className="flex h-10 items-center gap-1 overflow-hidden rounded-full border bg-muted/40 px-3">
        {bands.slice(0, count).map((color, i) => (
          <span key={i} className="h-6 flex-1 rounded-sm border" style={{ background: COLOR_HEX[color] }} title={colorLabel(color, es)} />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {roles.map((role, index) => (
          <label key={`${role}-${index}`} className="space-y-1 text-sm">
            <span className="text-muted-foreground">
              {es ? "Banda" : "Band"} {index + 1} · {role === "digit" ? (es ? "dígito" : "digit") : role === "multiplier" ? (es ? "multiplicador" : "multiplier") : role === "tolerance" ? (es ? "tolerancia" : "tolerance") : "ppm/°C"}
            </span>
            <select className="h-11 w-full rounded-xl border bg-background px-3 text-base" value={bands[index]} onChange={(e) => setBand(index, e.target.value as BandColor)}>
              {ROLE_COLORS[role].map((color) => (
                <option key={color} value={color}>{colorLabel(color, es)}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{invalid}</p>
      {result.status === "ok" ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Ohmios" : "Ohms"}</dt>
            <dd className="font-mono text-lg">{formatOhms(result.ohms, es)}</dd>
          </div>
          <div className="rounded-xl border p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Tolerancia" : "Tolerance"}</dt>
            <dd className="font-mono text-lg">±{result.tolerancePct}%</dd>
          </div>
          <div className="rounded-xl border p-3 sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Ventana" : "Window"}</dt>
            <dd className="text-sm">{formatOhms(result.min, es)} – {formatOhms(result.max, es)}{result.tcrPpm != null ? ` · ${result.tcrPpm} ppm/°C` : ""}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
