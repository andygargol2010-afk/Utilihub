"use client";
import { useMemo, useState } from "react";
import { type Locale } from "./DebtVisualizer.part1";
import { labels, type Debt, simulate } from "./DebtVisualizer.part2";

export function DebtVisualizer({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [debts, setDebts] = useState<Debt[]>([
    { id: "1", name: locale === "es" ? "Tarjeta" : "Card", balance: 2500, rate: 18, minPayment: 75 },
    { id: "2", name: locale === "es" ? "Préstamo" : "Loan", balance: 8000, rate: 9, minPayment: 180 },
  ]);
  const [extra, setExtra] = useState(100);
  const [form, setForm] = useState({ name: "", balance: "", rate: "", min: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const snow = useMemo(() => simulate(debts, "snowball", extra), [debts, extra]);
  const aval = useMemo(() => simulate(debts, "avalanche", extra), [debts, extra]);

  const addDebt = () => {
    const balance = Number(form.balance);
    const rate = Number(form.rate);
    const min = Number(form.min);
    if (!form.name.trim() || balance <= 0 || rate < 0 || min <= 0) return;
    setDebts((d) => [
      ...d,
      { id: Date.now().toString(), name: form.name.trim(), balance, rate, minPayment: min },
    ]);
    setForm({ name: "", balance: "", rate: "", min: "" });
  };

  const remove = (id: string) => setDebts((d) => d.filter((x) => x.id !== id));

  const updateDebt = (id: string, patch: Partial<Debt>) => {
    setDebts((d) => d.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const totalStart = debts.reduce((s, d) => s + d.balance, 0);

  const copySummary = async () => {
    const text = `${t.title}\nExtra: $${extra}\n${t.snowball}: ${snow.months} ${t.months}, ${t.interest} $${snow.totalInterest.toFixed(0)}\n${t.avalanche}: ${aval.months} ${t.months}, ${t.interest} $${aval.totalInterest.toFixed(0)}\nDebts: ${debts.map(d => `${d.name} $${d.balance}@${d.rate}%`).join(", ")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

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
              className="col-span-2 rounded border px-2 py-2 sm:py-1"
            />
            <input
              type="number"
              placeholder={t.balance}
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: e.target.value })}
              className="rounded border px-2 py-2 sm:py-1"
            />
            <input
              type="number"
              placeholder={t.rate}
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
              className="rounded border px-2 py-2 sm:py-1"
            />
            <input
              type="number"
              placeholder={t.min}
              value={form.min}
              onChange={(e) => setForm({ ...form, min: e.target.value })}
              className="rounded border px-2 py-2 sm:py-1"
            />
            <button type="button" onClick={addDebt} className="rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground sm:py-1">
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
          <button
            type="button"
            onClick={copySummary}
            className="mt-2 rounded border px-3 py-1 text-xs font-medium hover:bg-surface"
          >
            {copied ? t.copied : t.share}
          </button>
        </label>
      </div>

      <div className="space-y-2">
        {debts.map((d) => (
          <div key={d.id} className="flex flex-col gap-2 rounded border px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
            {editing === d.id ? (
              <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
                <input
                  value={d.name}
                  onChange={(e) => updateDebt(d.id, { name: e.target.value })}
                  className="rounded border px-1 py-1"
                />
                <input
                  type="number"
                  value={d.balance}
                  onChange={(e) => updateDebt(d.id, { balance: Number(e.target.value) })}
                  className="rounded border px-1 py-1"
                />
                <input
                  type="number"
                  value={d.rate}
                  onChange={(e) => updateDebt(d.id, { rate: Number(e.target.value) })}
                  className="rounded border px-1 py-1"
                />
                <input
                  type="number"
                  value={d.minPayment}
                  onChange={(e) => updateDebt(d.id, { minPayment: Number(e.target.value) })}
                  className="rounded border px-1 py-1"
                />
              </div>
            ) : (
              <span className="flex-1">{d.name} — ${d.balance.toLocaleString()} @ {d.rate}% min ${d.minPayment}</span>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(editing === d.id ? null : d.id)} className="text-xs text-primary">
                {editing === d.id ? t.save : t.edit}
              </button>
              <button type="button" onClick={() => remove(d.id)} className="text-xs text-red-600">
                {t.remove}
              </button>
            </div>
          </div>
        ))}
        {debts.length === 0 && <p className="text-sm text-muted-foreground">{t.empty}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {(["snowball", "avalanche"] as const).map((method) => {
          const sim = method === "snowball" ? snow : aval;
          const progress = totalStart > 0 ? Math.min(100, (sim.timeline.at(-1)?.paid ?? 0) / (totalStart + sim.totalInterest) * 100) : 0;
          return (
            <div key={method} className="rounded-2xl border p-4">
              <h3 className="font-bold">{method === "snowball" ? t.snowball : t.avalanche}</h3>
              <p className="text-sm text-muted-foreground">
                {sim.months} {t.months} · {t.interest} ${sim.totalInterest.toFixed(0)}
              </p>
              <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 max-h-32 overflow-y-auto text-xs">
                <div className="font-medium">{t.timeline}</div>
                {sim.timeline.slice(-6).map((pt) => (
                  <div key={pt.month}>
                    M{pt.month}: {t.paid} ${pt.paid.toFixed(0)} · {t.interest} ${pt.interest.toFixed(0)}
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
