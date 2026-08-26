import { useMemo, useState } from "react";
import { FinancialField } from "./FinancialField";
import { FinancialResult } from "./FinancialResult";
import { formatNumber, parseNumber } from "@/lib/units";

export default function CompoundInterest() {
  const [p, setP] = useState("10000"), [monthly, setMonthly] = useState("500"), [rate, setRate] = useState("8"), [years, setYears] = useState("10");
  const initial = parseNumber(p), contribution = parseNumber(monthly), annualRate = parseNumber(rate), yearsNumber = parseNumber(years);
  const data = useMemo(() => {
    if (![initial, contribution, annualRate, yearsNumber].every(Number.isFinite) || initial < 0 || contribution < 0 || yearsNumber <= 0 || annualRate < 0) return null;
    const r = annualRate / 100 / 12;
    const n = Math.floor(yearsNumber * 12);
    const growth = Math.pow(1 + r, n);
    const fv = r === 0 ? initial + contribution * n : initial * growth + contribution * ((growth - 1) / r);
    const paid = initial + contribution * n;
    return { fv, paid, interest: fv - paid, n, growth };
  }, [initial, contribution, annualRate, yearsNumber]);

  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2"><FinancialField id="ci-initial" label="Capital inicial" value={p} onChange={setP} suffix="$" /><FinancialField id="ci-monthly" label="Aporte mensual" value={monthly} onChange={setMonthly} suffix="$" /><FinancialField id="ci-rate" label="Tasa anual estimada" value={rate} onChange={setRate} suffix="%" /><FinancialField id="ci-years" label="Plazo" value={years} onChange={setYears} suffix="años" /></div>
    {data ? <>
      <div className="grid gap-4 sm:grid-cols-3"><FinancialResult label="Capital final" value={`$ ${formatNumber(data.fv, 2)}`} detail="Aportes al final de cada mes." /><FinancialResult label="Total aportado" value={`$ ${formatNumber(data.paid, 2)}`} /><FinancialResult label="Intereses generados" value={`$ ${formatNumber(data.interest, 2)}`} detail={`${formatNumber(data.interest / data.fv * 100, 1)} % del capital final.`} /></div>
      <div className="rounded-xl border border-border/70 p-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Qué significa el resultado</p><p className="mt-1">La proyección combina el capital inicial con aportes mensuales y capitalización mensual. El efecto compuesto hace que los rendimientos de períodos anteriores también generen nuevos rendimientos.</p><p className="mt-2 font-mono text-xs">VF = P(1+r)^n + A × ((1+r)^n − 1) ÷ r</p></div>
      <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border p-4"><p className="text-xs text-muted-foreground">Meses simulados</p><p className="mt-1 font-mono text-xl font-semibold">{data.n.toLocaleString("es-AR")}</p></div><div className="rounded-xl border border-border p-4"><p className="text-xs text-muted-foreground">Multiplicador del capital inicial</p><p className="mt-1 font-mono text-xl font-semibold">×{formatNumber(data.growth, 2)}</p></div></div>
    </> : <p className="text-sm text-muted-foreground">Introduce valores válidos. El capital y los aportes no pueden ser negativos y el plazo debe ser mayor que cero.</p>}
    <p className="text-xs leading-5 text-muted-foreground">Es una proyección matemática, no una garantía de rentabilidad. La tasa se supone constante, con capitalización mensual y aportes al final de cada mes. No incluye impuestos, comisiones ni inflación.</p>
  </div>;
}
