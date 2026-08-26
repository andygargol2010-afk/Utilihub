import { useMemo, useState } from "react";
import { FinancialField } from "./FinancialField";
import { FinancialResult } from "./FinancialResult";
import { formatNumber, parseNumber } from "@/lib/units";

export default function Inflation() {
  const [amount, setAmount] = useState("100000"), [rate, setRate] = useState("4"), [years, setYears] = useState("10");
  const a = parseNumber(amount), annual = parseNumber(rate), y = parseNumber(years);
  const data = useMemo(() => {
    if (![a, annual, y].every(Number.isFinite) || a < 0 || y < 0 || annual <= -100) return null;
    const r = annual / 100;
    const factor = Math.pow(1 + r, y);
    const future = a * factor;
    const purchasingPower = a / factor;
    return { future, purchasingPower, factor, cumulative: (factor - 1) * 100 };
  }, [a, annual, y]);

  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2"><FinancialField id="inflation-amount" label="Cantidad actual" value={amount} onChange={setAmount} suffix="$" /><FinancialField id="inflation-rate" label="Inflación anual estimada" value={rate} onChange={setRate} suffix="%" /><FinancialField id="inflation-years" label="Horizonte" value={years} onChange={setYears} suffix="años" /></div>
    {data ? <>
      <div className="grid gap-4 sm:grid-cols-2"><FinancialResult label="Cantidad equivalente futura" value={`$ ${formatNumber(data.future, 2)}`} detail="Dinero necesario para conservar el poder de compra de hoy." /><FinancialResult label="Poder adquisitivo futuro" value={`$ ${formatNumber(data.purchasingPower, 2)}`} detail="Valor de la cantidad inicial expresado en dinero de hoy." /></div>
      <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border p-4"><p className="text-xs text-muted-foreground">Inflación acumulada del período</p><p className="mt-1 font-mono text-xl font-semibold">{formatNumber(data.cumulative, 2)} %</p></div><div className="rounded-xl border border-border p-4"><p className="text-xs text-muted-foreground">Factor de precios</p><p className="mt-1 font-mono text-xl font-semibold">×{formatNumber(data.factor, 4)}</p></div></div>
      <div className="rounded-xl border border-border/70 p-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Fórmula</p><p className="mt-1 font-mono text-xs">Valor futuro = valor actual × (1 + inflación)^años</p><p className="mt-1">Las tasas anuales se capitalizan; por eso una inflación del 4 % durante 10 años no equivale exactamente al 40 % acumulado.</p></div>
    </> : <p className="text-sm text-muted-foreground">Introduce una cantidad no negativa, una inflación superior a −100 % y un horizonte no negativo.</p>}
    <p className="text-xs leading-5 text-muted-foreground">Es una simulación matemática con una tasa constante, no una previsión económica. La inflación real puede variar cada año y según el país o índice utilizado.</p>
  </div>;
}
