import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatNumber, parseNumber } from "@/lib/units";

type Mode = "of" | "share" | "change" | "discount" | "increase" | "vat";
const MODES: [Mode, string][] = [["of", "% de una cantidad"], ["share", "Qué % representa"], ["change", "Variación %"], ["discount", "Descuento"], ["increase", "Aumento"], ["vat", "IVA" ]];

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("of");
  const [a, setA] = useState("15");
  const [b, setB] = useState("240");

  const data = useMemo(() => {
    const x = parseNumber(a), y = parseNumber(b);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    switch (mode) {
      case "of": return { result: x * y / 100, label: "Resultado", formula: `${formatNumber(x)} % × ${formatNumber(y)} ÷ 100` };
      case "share": return y === 0 ? null : { result: x / y * 100, label: "Porcentaje", formula: `${formatNumber(x)} ÷ ${formatNumber(y)} × 100` };
      case "change": return x === 0 ? null : { result: (y - x) / Math.abs(x) * 100, label: "Variación", formula: `(${formatNumber(y)} − ${formatNumber(x)}) ÷ ${formatNumber(Math.abs(x))} × 100` };
      case "discount": return { result: y * (1 - x / 100), label: "Precio con descuento", formula: `${formatNumber(y)} × (1 − ${formatNumber(x)} ÷ 100)` , extra: y * x / 100 };
      case "increase": return { result: y * (1 + x / 100), label: "Precio con aumento", formula: `${formatNumber(y)} × (1 + ${formatNumber(x)} ÷ 100)`, extra: y * x / 100 };
      case "vat": return { result: y * (1 + x / 100), label: "Precio con IVA", formula: `${formatNumber(y)} × (1 + ${formatNumber(x)} ÷ 100)`, extra: y * x / 100 };
    }
  }, [a, b, mode]);

  const labels: Record<Mode, [string, string]> = {
    of: ["Porcentaje (%)", "Cantidad total"], share: ["Parte", "Total"], change: ["Valor inicial", "Valor final"],
    discount: ["Descuento (%)", "Precio original"], increase: ["Aumento (%)", "Precio original"], vat: ["IVA (%)", "Precio sin IVA"]
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Tipo de cálculo porcentual">{MODES.map(([id, label]) => <Button key={id} type="button" variant={mode === id ? "default" : "outline"} onClick={() => setMode(id)}>{label}</Button>)}</div>
    <div className="grid gap-4 sm:grid-cols-2">
      {[a, b].map((value, i) => <div key={i} className="space-y-2"><Label htmlFor={`pct-${i}`}>{labels[mode][i]}</Label><Input id={`pct-${i}`} inputMode="decimal" value={value} onChange={(event) => (i === 0 ? setA : setB)(event.target.value)} /></div>)}
    </div>
    <div className="rounded-xl bg-surface p-5">
      <p className="text-sm text-muted-foreground">{data?.label ?? "Resultado"}</p>
      <p aria-live="polite" className="font-mono text-3xl font-semibold">{data ? `${formatNumber(data.result, 2)}${["share", "change"].includes(mode) ? " %" : ""}` : "—"}</p>
      {data?.extra !== undefined && <p className="mt-2 text-sm text-muted-foreground">Importe correspondiente al porcentaje: {formatNumber(data.extra, 2)}</p>}
      {data?.formula && <p className="mt-2 text-sm text-muted-foreground">Fórmula: {data.formula}</p>}
    </div>
    <div className="rounded-xl border border-border/70 p-4 text-sm text-muted-foreground">
      <p className="font-semibold text-foreground">Cómo interpretar el resultado</p>
      <p className="mt-1">Los cálculos de descuento, aumento e IVA parten del precio indicado como base. Para quitar un IVA ya incluido, utiliza la relación precio final ÷ (1 + IVA/100).</p>
    </div>
  </div>;
}
