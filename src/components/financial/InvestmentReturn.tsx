import { useMemo, useState } from "react";
import { FinancialField } from "./FinancialField";
import { FinancialResult } from "./FinancialResult";
import { formatNumber, parseNumber } from "@/lib/units";

export default function InvestmentReturn() {
  const [initial, setInitial] = useState("10000"), [final, setFinal] = useState("13500"), [years, setYears] = useState("2");
  const a = parseNumber(initial), b = parseNumber(final), y = parseNumber(years);
  const data = useMemo(() => {
    if (![a, b, y].every(Number.isFinite) || a <= 0 || b < 0 || y <= 0) return null;
    const profit = b - a;
    const roi = profit / a * 100;
    const annual = b === 0 ? -100 : (Math.pow(b / a, 1 / y) - 1) * 100;
    return { profit, roi, annual, multiple: b / a };
  }, [a, b, y]);

  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2"><FinancialField id="roi-initial" label="Capital inicial" value={initial} onChange={setInitial} suffix="$" /><FinancialField id="roi-final" label="Valor final" value={final} onChange={setFinal} suffix="$" /><FinancialField id="roi-years" label="Tiempo" value={years} onChange={setYears} suffix="años" /></div>
    {data ? <>
      <div className="grid gap-4 sm:grid-cols-3"><FinancialResult label="Beneficio / pérdida" value={`$ ${formatNumber(data.profit, 2)}`} /><FinancialResult label="ROI total" value={`${formatNumber(data.roi, 2)} %`} /><FinancialResult label="Rentabilidad anualizada" value={`${formatNumber(data.annual, 2)} %`} detail="CAGR aproximado." /></div>
      <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border p-4"><p className="text-xs text-muted-foreground">Capital final / inicial</p><p className="mt-1 font-mono text-xl font-semibold">×{formatNumber(data.multiple, 3)}</p></div><div className="rounded-xl border border-border/70 p-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Interpretación</p><p className="mt-1">Un ROI positivo indica crecimiento respecto al capital inicial; un ROI negativo indica pérdida. La rentabilidad anualizada supone un crecimiento compuesto uniforme.</p></div></div>
      <div className="rounded-xl border border-border/70 p-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Fórmulas</p><p className="mt-1 font-mono text-xs">ROI = (valor final − valor inicial) ÷ valor inicial × 100</p><p className="mt-1 font-mono text-xs">CAGR = (valor final ÷ valor inicial)^(1/años) − 1</p></div>
    </> : <p className="text-sm text-muted-foreground">Introduce un capital inicial positivo, un valor final no negativo y un plazo mayor que cero.</p>}
  </div>;
}
