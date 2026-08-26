import { useMemo, useState } from "react";
import { FinancialField } from "./FinancialField";
import { FinancialResult } from "./FinancialResult";
import { formatNumber, parseNumber } from "@/lib/units";

export default function SavingsGoal() {
  const [target, setTarget] = useState("25000"), [initial, setInitial] = useState("5000"), [rate, setRate] = useState("5"), [months, setMonths] = useState("36");
  const goal = parseNumber(target), start = parseNumber(initial), annual = parseNumber(rate), m = Math.floor(parseNumber(months));
  const data = useMemo(() => {
    if (![goal, start, annual, m].every(Number.isFinite) || goal <= 0 || start < 0 || annual < 0 || m <= 0 || start > goal) return null;
    const r = annual / 100 / 12;
    const growth = Math.pow(1 + r, m);
    const monthly = r === 0 ? (goal - start) / m : (goal - start * growth) * r / (growth - 1);
    const contribution = Math.max(0, monthly);
    const interest = goal - start - contribution * m;
    return { monthly: contribution, interest, months: m };
  }, [goal, start, annual, m]);

  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2"><FinancialField id="goal-target" label="Objetivo de ahorro" value={target} onChange={setTarget} suffix="$" /><FinancialField id="goal-start" label="Ahorro actual" value={initial} onChange={setInitial} suffix="$" /><FinancialField id="goal-rate" label="Tasa anual estimada" value={rate} onChange={setRate} suffix="%" /><FinancialField id="goal-months" label="Plazo" value={months} onChange={setMonths} suffix="meses" /></div>
    {data ? <>
      <div className="grid gap-4 sm:grid-cols-2"><FinancialResult label="Aporte mensual necesario" value={`$ ${formatNumber(data.monthly, 2)}`} detail="Aporte al final de cada mes." /><FinancialResult label="Intereses estimados" value={`$ ${formatNumber(data.interest, 2)}`} detail="Según la tasa constante introducida." /></div>
      <div className="rounded-xl border border-border/70 p-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Cómo se interpreta</p><p className="mt-1">El aporte calculado es el importe mensual aproximado necesario para alcanzar el objetivo en el plazo indicado, partiendo del ahorro actual y suponiendo una rentabilidad constante.</p><p className="mt-2 font-mono text-xs">Aporte = (Meta − Inicial × (1+r)^n) × r ÷ ((1+r)^n − 1)</p></div>
    </> : <p className="text-sm text-muted-foreground">Introduce un objetivo y un plazo positivos. El ahorro actual debe estar entre cero y el objetivo para esta simulación.</p>}
    <p className="text-xs leading-5 text-muted-foreground">Es una proyección matemática. No considera impuestos, comisiones, inflación, cambios de rendimiento ni aportes realizados en fechas distintas al final de cada mes.</p>
  </div>;
}
