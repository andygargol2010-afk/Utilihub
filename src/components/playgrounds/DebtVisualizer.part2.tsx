"use client";
// Part 2 of 3 — split from DebtVisualizer.tsx on 2026-11-04. Edit here; DebtVisualizer.tsx re-exports.

export interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number; // annual %
  minPayment: number;
}

export const labels = {
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
    edit: "Edit",
    save: "Save",
    empty: "Add a debt to see the comparison.",
    faster: "pays off faster",
    share: "Copy summary",
    copied: "Copied!",
    timeline: "Timeline",
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
    edit: "Editar",
    save: "Guardar",
    empty: "Agregá una deuda para ver la comparación.",
    faster: "se paga antes",
    share: "Copiar resumen",
    copied: "¡Copiado!",
    timeline: "Línea de tiempo",
  },
};

export function simulate(debts: Debt[], method: "snowball" | "avalanche", extra: number) {
  if (debts.length === 0) return { months: 0, totalInterest: 0, timeline: [] as { month: number; paid: number; interest: number }[] };
  const items = debts.map((d) => ({
    ...d,
    bal: Math.max(0, d.balance),
    rateMonthly: Math.max(0, d.rate) / 100 / 12,
  }));
  let month = 0;
  let totalInterest = 0;
  const timeline: { month: number; paid: number; interest: number }[] = [];
  const maxMonths = 360;
  const startTotal = items.reduce((s, i) => s + i.bal, 0);

  while (items.some((i) => i.bal > 0.5) && month < maxMonths) {
    month++;
    let monthInterest = 0;
    // Accrue interest
    for (const i of items) {
      if (i.bal <= 0) continue;
      const interest = i.bal * i.rateMonthly;
      i.bal += interest;
      monthInterest += interest;
      totalInterest += interest;
    }
    // Pay minimums
    let availableExtra = extra;
    for (const i of items) {
      if (i.bal <= 0) continue;
      const pay = Math.min(i.minPayment, i.bal);
      i.bal -= pay;
    }
    // Apply extra to target
    const active = items.filter((i) => i.bal > 0.5);
    if (active.length === 0) break;
    const target = method === "snowball"
      ? active.reduce((a, b) => (a.bal < b.bal ? a : b))
      : active.reduce((a, b) => (a.rate > b.rate ? a : b));
    const extraPay = Math.min(availableExtra, target.bal);
    target.bal -= extraPay;

    const totalPaid = startTotal + totalInterest - items.reduce((s, i) => s + Math.max(0, i.bal), 0);
    if (month % 3 === 0 || month <= 6 || active.length <= 1) {
      timeline.push({ month, paid: Math.max(0, totalPaid), interest: totalInterest });
    }
  }
  return { months: month, totalInterest, timeline };
}
