"use client";

import { useMemo, useState } from "react";

type Locale = "en" | "es";

interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number; // annual %
  minPayment: number;
}

const labels = {
  en: {
    title: "Debt Snowball vs Avalanche",
    add: "Add debt",
    name: "Name",
    balance: "Balance",
    rate: "Rate %",
    min: "Min payment",
    extra: "Extra monthly",
    snowball: "Snowball",
    avalanche: "Avalanche",
    months: "months",
    paid: "Paid",
    interest: "Interest",
    remaining: "Remaining",
    remove: "Remove",
    empty: "Add a debt to see the comparison.",
    faster: "pays off faster",
  },
  es: {
    title: "Bola de nieve vs Avalancha de deudas",
    add: "Agregar deuda",
    name: "Nombre",
    balance: "Saldo",
    rate: "Tasa %",
    min: "Pago mínimo",
    extra: "Extra mensual",
    snowball: "Bola de nieve",
    avalanche: "Avalancha",
    months: "meses",
    paid: "Pagado",
    interest: "Interés",
    remaining: "Restante",
    remove: "Quitar",
    empty: "Agregá una deuda para ver la comparación.",
    faster: "se paga antes",
  },
};

function simulate(debts: Debt[], method: "snowball" | "avalanche", extra: number) {
  if (debts.length === 0) return { months: 0, totalInterest: 0, timeline: [] as { month: number; paid: number }[] };
  const items = debts.map((d) => ({
    ...d,
    bal: d.balance,
    rateMonthly: d.rate / 100 / 12,
  }));
  let month = 0;
  let totalInterest = 0;
  const timeline: { month: number; paid: number }[] = [];
  const maxMonths = 360;

  while (items.some((i) => i.bal > 0.5) && month < maxMonths) {
    month++;
    let available = extra;
    // pay minimums + interest
    for (const i of items) {
      if (i.bal <= 0) continue;
      const interest = i.bal * i.rateMonthly;
      totalInterest += interest;
      i.bal += interest;
      const pay = Math.min(i.minPayment, i.bal);
      i.bal -= pay;
      available += Math.max(0, i.minPayment - pay);
    }
    // extra to target
    const active = items.filter((i) => i.bal > 0.5);
    if (active.length === 0) break;
    const target = method === "snowball"
      ? active.reduce((a, b) => (a.bal < b.bal ? a : b))
      : active.reduce((a, b) => (a.rate > b.rate ? a : b));
    const extraPay = Math.min(available, target.bal);
    target.bal -= extraPay;
    const totalPaid = items.reduce((s, i) => s + (i.balance - Math.max(0, i.bal)), 0);
    timeline.push({ month, paid: totalPaid });
  }
  return { months: month, totalInterest, timeline };
}

export function DebtVisualizer({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [debts, setDebts] = useState<Debt[]>([
    { id: "1", name: locale === "es" ? "Tarjeta" : "Card", balance: 2500, rate: 18, minPayment: 75 },
    { id: "2", name: locale === "es" ? "Préstamo" : "Loan", balance: 8000, rate: 9, minPayment: 180 },
  ]);
  const [extra, setExtra] = useState(100);
  const [form, setForm] = useState({ name: "", balance: "", rate: "", min: "" });

  const snow = useMemo(() => simulate(debts, "snowball", extra), [debts, extra]);
  const aval = useMemo(() => simulate(debts, "avalanche", extra), [debts, extra]);

  const addDebt = () => {
    const balance = Number(form.balance);
    const rate = Number(form.rate);
    const min = Number(form.min);
    if (!form.name || balance <= 0 || rate < 0 || min <= 0) return;
    setDebts((d) => [
      ...d,
      { id: Date.now().toString(), name: form.name, balance, rate, minPayment: min },
    ]);
    setForm({ name: "", balance: "", rate: "", min: "" });
  };

  const remove = (id: string) => setDebts((d) => d.filter((x) => x.id !== id));

  const maxMonths = Math.max(snow.months, aval.months, 1);
  const totalStart = debts.reduce((s, d) => s + d.balance, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:grid-cols-2">
        <div>
          <h3 className="font-semibold">{t.add}</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <input
              placeholder={t.name}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="col-span-2 rounded border px-2 py-1"
            />
            <input
              type="number"
              placeholder={t.balance}
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: e.target.value })}
              className="rounded border px-2 py-1"
            />
            <input
              type="number"
              placeholder={t.rate}
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
              className="rounded border px-2 py-1"
            />
            <input
              type="number"
              placeholder={t.min}
              value={form.min}
              onChange={(e) => setForm({ ...form, min: e.target.value })}
              className="rounded border px-2 py-1"
            />
            <button type="button" onClick={addDebt} className="rounded bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              +
            </button>
          </div>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.extra}: ${extra}</span>
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={extra}
            onChange={(e) => setExtra(Number(e.target.value))}
            className="accent-primary"
          />
        </label>
      </div>

      <div className="space-y-2">
        {debts.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
            <span>{d.name} — ${d.balance.toLocaleString()} @ {d.rate}% min ${d.minPayment}</span>
            <button type="button" onClick={() => remove(d.id)} className="text-xs text-red-600">
              {t.remove}
            </button>
          </div>
        ))}
        {debts.length === 0 && <p className="text-sm text-muted-foreground">{t.empty}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {(["snowball", "avalanche"] as const).map((method) => {
          const sim = method === "snowball" ? snow : aval;
          const progress = totalStart > 0 ? Math.min(100, (sim.timeline.at(-1)?.paid ?? 0) / totalStart * 100) : 0;
          return (
            <div key={method} className="rounded-2xl border p-4">
              <h3 className="font-bold">{method === "snowball" ? t.snowball : t.avalanche}</h3>
              <p className="text-sm text-muted-foreground">
                {sim.months} {t.months} · {t.interest} ${sim.totalInterest.toFixed(0)}
              </p>
              <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-xs">
                {sim.timeline.slice(-3).map((pt) => (
                  <div key={pt.month}>
                    M{pt.month}: {t.paid} ${pt.paid.toFixed(0)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {snow.months > 0 && aval.months > 0 && (
        <p className="text-center text-sm font-medium">
          {aval.months < snow.months ? t.avalanche : t.snowball} {t.faster} ({Math.abs(aval.months - snow.months)} {t.months})
        </p>
      )}
    </div>
  );
}
