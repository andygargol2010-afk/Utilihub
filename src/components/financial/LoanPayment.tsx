import { useMemo, useState } from "react";
import { FinancialField } from "./FinancialField";
import { FinancialResult } from "./FinancialResult";
import { formatNumber, parseNumber } from "@/lib/units";

export default function LoanPayment() {
  const [principal, setPrincipal] = useState("100000"), [rate, setRate] = useState("10"), [months, setMonths] = useState("60");
  const p = parseNumber(principal), annual = parseNumber(rate), n = Math.floor(parseNumber(months));
  const data = useMemo(() => {
    if (![p, annual, n].every(Number.isFinite) || p <= 0 || annual < 0 || n <= 0) return null;
    const r = annual / 100 / 12;
    const payment = r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = payment * n;
    return { payment, total, interest: total - p, interestPct: (total - p) / total * 100, r };
  }, [p, annual, n]);

  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2"><FinancialField id="loan-p" label="Capital del préstamo" value={principal} onChange={setPrincipal} suffix="$" /><FinancialField id="loan-rate" label="Tasa anual nominal" value={rate} onChange={setRate} suffix="%" /><FinancialField id="loan-months" label="Plazo" value={months} onChange={setMonths} suffix="meses" /></div>
    {data ? <>
      <div className="grid gap-4 sm:grid-cols-3"><FinancialResult label="Cuota mensual" value={`$ ${formatNumber(data.payment, 2)}`} /><FinancialResult label="Total pagado" value={`$ ${formatNumber(data.total, 2)}`} /><FinancialResult label="Intereses" value={`$ ${formatNumber(data.interest, 2)}`} detail={`${formatNumber(data.interestPct, 1)} % del total pagado.`} /></div>
      <div className="rounded-xl border border-border/70 p-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Cómo se calcula</p><p className="mt-1">La cuota usa el sistema de amortización con pagos constantes. La tasa anual se convierte a una tasa mensual y se aplica durante el número de cuotas indicado.</p><p className="mt-2 font-mono text-xs">Cuota = P × r × (1+r)^n ÷ ((1+r)^n − 1)</p></div>
    </> : <p className="text-sm text-muted-foreground">Introduce un capital positivo, una tasa no negativa y un plazo mayor que cero.</p>}
    <p className="text-xs leading-5 text-muted-foreground">Es una simulación matemática de tasa fija y pagos mensuales constantes. No incluye comisiones, impuestos, seguros, gastos de apertura, inflación ni otros costes del crédito. La tasa nominal no equivale necesariamente a la TAE/CFT de una oferta real.</p>
  </div>;
}
