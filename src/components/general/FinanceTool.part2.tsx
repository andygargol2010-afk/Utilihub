// Part 2 of 3 — split from FinanceTool.tsx on 2026-11-04. Edit here; FinanceTool.tsx re-exports.
import { num, pmt, money, remainingBalance, pct } from "./FinanceTool.part1";

export function runOp(op: string, values: string[], es: boolean): string {
  const v = values.map(num);
  if (v.some((x) => !Number.isFinite(x))) throw new Error("Enter valid numbers in every field.");

  switch (op) {
    case "loan-payment": {
      const [P, rate, months] = v;
      const pay = pmt(P, rate, months);
      return es
        ? `Cuota mensual: ${money(pay, true)}\nTotal a pagar: ${money(pay * months, true)}\nIntereses totales: ${money(pay * months - P, true)}`
        : `Monthly payment: ${money(pay, false)}\nTotal paid: ${money(pay * months, false)}\nTotal interest: ${money(pay * months - P, false)}`;
    }
    case "loan-amortization": {
      const [P, rate, months] = v;
      const pay = pmt(P, rate, months);
      const total = pay * months;
      return es
        ? `Cuota fija: ${money(pay, true)}\nPagos: ${months}\nTotal pagado: ${money(total, true)}\nInterés total: ${money(total - P, true)}\nCapital: ${money(P, true)}`
        : `Fixed payment: ${money(pay, false)}\nPayments: ${months}\nTotal paid: ${money(total, false)}\nTotal interest: ${money(total - P, false)}\nPrincipal: ${money(P, false)}`;
    }
    case "compound-interest": {
      const [P, rate, years, nComp] = v;
      if (years < 0 || nComp <= 0) throw new Error("Years must be ≥ 0 and compounds per year > 0.");
      const A = P * Math.pow(1 + rate / 100 / nComp, nComp * years);
      return es
        ? `Valor futuro: ${money(A, true)}\nInterés ganado: ${money(A - P, true)}\nMúltiplo: ${(A / P).toLocaleString("es-ES", { maximumFractionDigits: 4 })}×`
        : `Future value: ${money(A, false)}\nInterest earned: ${money(A - P, false)}\nMultiple: ${(A / P).toLocaleString("en-US", { maximumFractionDigits: 4 })}×`;
    }
    case "early-repayment": {
      const [P, rate, months, paid] = v;
      if (!Number.isInteger(paid) || !Number.isInteger(months)) throw new Error("Term and payments made must be whole numbers.");
      const bal = remainingBalance(P, rate, months, paid);
      const pay = pmt(P, rate, months);
      return es
        ? `Saldo restante: ${money(Math.max(0, bal), true)}\nCuota original: ${money(pay, true)}\nPagos hechos: ${paid} de ${months}`
        : `Remaining balance: ${money(Math.max(0, bal), false)}\nOriginal payment: ${money(pay, false)}\nPayments made: ${paid} of ${months}`;
    }
    case "roi": {
      const [cost, finalV] = v;
      if (cost === 0) throw new Error("Cost cannot be 0.");
      const gain = finalV - cost;
      const roi = (gain / cost) * 100;
      return es
        ? `ROI: ${pct(roi, true)}\nGanancia neta: ${money(gain, true)}\nMúltiplo: ${(finalV / cost).toLocaleString("es-ES", { maximumFractionDigits: 4 })}×`
        : `ROI: ${pct(roi, false)}\nNet gain: ${money(gain, false)}\nMultiple: ${(finalV / cost).toLocaleString("en-US", { maximumFractionDigits: 4 })}×`;
    }
    case "cagr": {
      const [start, end, years] = v;
      if (start <= 0 || years <= 0) throw new Error("Start value and years must be positive.");
      const cagr = (Math.pow(end / start, 1 / years) - 1) * 100;
      return es
        ? `CAGR: ${pct(cagr, true)}\nInicio: ${money(start, true)} → Final: ${money(end, true)} en ${years} años`
        : `CAGR: ${pct(cagr, false)}\nStart: ${money(start, false)} → End: ${money(end, false)} over ${years} years`;
    }
    case "savings-goal": {
      const [goal, rate, months, startBal] = v;
      if (months <= 0) throw new Error("Months must be positive.");
      const r = rate / 100 / 12;
      let monthly: number;
      if (Math.abs(r) < 1e-12) {
        monthly = (goal - startBal) / months;
      } else {
        const growth = Math.pow(1 + r, months);
        monthly = (goal - startBal * growth) * (r / (growth - 1));
      }
      return es
        ? `Depósito mensual: ${money(monthly, true)}\nMeta: ${money(goal, true)}\nPartiendo de: ${money(startBal, true)} en ${months} meses`
        : `Monthly deposit: ${money(monthly, false)}\nGoal: ${money(goal, false)}\nStarting from: ${money(startBal, false)} over ${months} months`;
    }
    case "inflation": {
      const [present, rate, years] = v;
      if (years < 0) throw new Error("Years must be ≥ 0.");
      const future = present * Math.pow(1 + rate / 100, years);
      const real = present / Math.pow(1 + rate / 100, years);
      return es
        ? `Valor nominal futuro: ${money(future, true)}\nPoder de compra de ${money(present, true)} en ${years} años: ${money(real, true)}\nPérdida real: ${money(present - real, true)}`
        : `Future nominal value: ${money(future, false)}\nPurchasing power of ${money(present, false)} in ${years} years: ${money(real, false)}\nReal loss: ${money(present - real, false)}`;
    }
    case "portfolio": {
      const [total, a, b, c] = v;
      const sum = a + b + c;
      if (Math.abs(sum - 100) > 0.05) throw new Error("Weights A+B+C must add up to 100%.");
      return es
        ? `A (${pct(a, true)}): ${money((total * a) / 100, true)}\nB (${pct(b, true)}): ${money((total * b) / 100, true)}\nC (${pct(c, true)}): ${money((total * c) / 100, true)}\nTotal: ${money(total, true)}`
        : `A (${pct(a, false)}): ${money((total * a) / 100, false)}\nB (${pct(b, false)}): ${money((total * b) / 100, false)}\nC (${pct(c, false)}): ${money((total * c) / 100, false)}\nTotal: ${money(total, false)}`;
    }
    case "wacc": {
      const [E, D, Re, Rd, tax] = v;
      const V = E + D;
      if (V <= 0) throw new Error("Equity + debt must be positive.");
      const wacc = (E / V) * Re + (D / V) * Rd * (1 - tax / 100);
      return es
        ? `WACC: ${pct(wacc, true)}\nPeso equity: ${pct((E / V) * 100, true)}\nPeso deuda: ${pct((D / V) * 100, true)}`
        : `WACC: ${pct(wacc, false)}\nEquity weight: ${pct((E / V) * 100, false)}\nDebt weight: ${pct((D / V) * 100, false)}`;
    }
    case "hourly-rate": {
      const [pay, hours] = v;
      if (hours <= 0) throw new Error("Hours worked must be positive.");
      const rate = pay / hours;
      return es
        ? `Tarifa por hora: ${money(rate, true)}\nPago total: ${money(pay, true)} en ${hours} h`
        : `Hourly rate: ${money(rate, false)}\nTotal pay: ${money(pay, false)} over ${hours} h`;
    }
    case "basic-calc": {
      const [a, b, opCode] = v;
      const op = Math.round(opCode);
      let r: number;
      if (op === 1) r = a + b;
      else if (op === 2) r = a - b;
      else if (op === 3) r = a * b;
      else if (op === 4) {
        if (b === 0) throw new Error("Cannot divide by zero.");
        r = a / b;
      } else throw new Error("Operation must be 1 (add), 2 (sub), 3 (mul), or 4 (div).");
      const labels: Record<number, string> = es
        ? { 1: "Suma", 2: "Resta", 3: "Multiplicación", 4: "División" }
        : { 1: "Add", 2: "Subtract", 3: "Multiply", 4: "Divide" };
      return es ? `${labels[op]}: ${a} y ${b} = ${r}` : `${labels[op]}: ${a} and ${b} = ${r}`;
    }
    default:
      throw new Error("Finance operation not available.");
  }
}
