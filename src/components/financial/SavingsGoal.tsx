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
    const projectedInitial = start * growth;
    const monthly = r === 0 ? (goal - start) / m : (goal - projectedInitial) * r / (growth - 1);
    const contribution = Math.max(0, monthly);
    const finalBalance = contribution === 0 ? projectedInitial : goal;
    const contributions = contribution * m;
    const interest = finalBalance - start - contributions;
    const surplus = Math.max(0, finalBalance - goal);
    const alreadyReached = contribution === 0 && projectedInitial >= goal;
    return { monthly: contribution, interest, months: m, finalBalance, surplus, alreadyReached };
  }, [goal, start, annual, m]);

  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2"><FinancialField id="goal-target" label="Objetivo de ahorro" value={target} onChange={setTarget} suffix="$" /><FinancialField id="goal-start" label="Ahorro actual" value={initial} onChange={setInitial} suffix="$" /><FinancialField id="goal-rate" label="Tasa anual estimada" value={rate} onChange={setRate} suffix="%" /><FinancialField id="goal-months" label="Plazo" value={months} onChange={setMonths} suffix="meses" /></div>
    {data ? <>
      <div className="grid gap-4 sm:grid-cols-2"><FinancialResult label="Aporte mensual necesario" value={`$ ${formatNumber(data.monthly, 2)}`} detail={data.alreadyReached ? "No necesitas realizar aportes para alcanzar la meta con estos supuestos." : "Aporte al final de cada mes."} /><FinancialResult label="Intereses estimados" value={`$ ${formatNumber(data.interest, 2)}`} detail="Ganancia matemática acumulada sobre el ahorro y los aportes." /></div>
      <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border p-4"><p className="text-xs text-muted-foreground">Saldo proyectado al final</p><p className="mt-1 font-mono text-xl font-semibold">$ {formatNumber(data.finalBalance, 2)}</p></div><div className="rounded-xl border border-border p-4"><p className="text-xs text-muted-foreground">Margen sobre la meta</p><p className="mt-1 font-mono text-xl font-semibold">$ {formatNumber(data.surplus, 2)}</p></div></div>
      <div className="rounded-xl border border-border/70 p-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Cómo se interpreta</p><p className="mt-1">El aporte se supone al final de cada mes y la tasa se capitaliza mensualmente. Si el ahorro inicial por sí solo alcanza la meta antes o al final del plazo, el aporte necesario es cero y los intereses se calculan sobre el saldo que realmente se proyecta, no sobre la meta.</p><p className="mt-2 font-mono text-xs">Aporte = (Meta − Inicial × (1+r)^n) × r ÷ ((1+r)^n − 1)</p></div>
    </> : <p className="text-sm text-muted-foreground">Introduce un objetivo y un plazo positivos. El ahorro actual debe estar entre cero y el objetivo para esta simulación.</p>}
    <p className="text-xs leading-5 text-muted-foreground">Es una proyección matemática. No considera impuestos, comisiones, inflación, cambios de rendimiento ni aportes realizados en fechas distintas al final de cada mes.</p>
  </div>;
}
