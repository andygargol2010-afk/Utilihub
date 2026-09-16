import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { getToolShowcase } from "@/lib/tool-showcase";
import { showcaseUi } from "@/lib/showcase-ui";

const num = (v: string) => Number(String(v).trim().replace(",", "."));
const money = (v: number, es: boolean) =>
  v.toLocaleString(es ? "es-ES" : "en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const pct = (v: number, es: boolean) =>
  `${v.toLocaleString(es ? "es-ES" : "en-US", { maximumFractionDigits: 4 })}%`;

function pmt(principal: number, annualRatePct: number, months: number) {
  if (months <= 0) throw new Error("Term must be positive.");
  if (principal <= 0) throw new Error("Principal must be positive.");
  const r = annualRatePct / 100 / 12;
  if (Math.abs(r) < 1e-12) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

function remainingBalance(principal: number, annualRatePct: number, months: number, paid: number) {
  if (paid < 0 || paid > months) throw new Error("Payments made must be between 0 and the term.");
  const r = annualRatePct / 100 / 12;
  const payment = pmt(principal, annualRatePct, months);
  if (Math.abs(r) < 1e-12) return Math.max(0, principal - payment * paid);
  return principal * Math.pow(1 + r, paid) - payment * ((Math.pow(1 + r, paid) - 1) / r);
}

function runOp(op: string, values: string[], es: boolean): string {
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
      const [P, rate, months] = v as never;
      void months;
      const [P2, rate2, years, nComp] = v;
      if (years < 0 || nComp <= 0) throw new Error("Years must be ≥ 0 and compounds per year > 0.");
      const A = P2 * Math.pow(1 + rate2 / 100 / nComp, nComp * years);
      return es
        ? `Valor futuro: ${money(A, true)}\nInterés ganado: ${money(A - P2, true)}\nMúltiplo: ${(A / P2).toLocaleString("es-ES", { maximumFractionDigits: 4 })}×`
        : `Future value: ${money(A, false)}\nInterest earned: ${money(A - P2, false)}\nMultiple: ${(A / P2).toLocaleString("en-US", { maximumFractionDigits: 4 })}×`;
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

const ES_FIELD: Record<string, string> = {
  Principal: "Capital",
  "Annual rate %": "Tasa anual %",
  "Term (months)": "Plazo (meses)",
  "Compounds per year": "Capitalizaciones / año",
  Years: "Años",
  "Payments made": "Pagos realizados",
  Cost: "Costo",
  "Final value": "Valor final",
  "Start value": "Valor inicial",
  "End value": "Valor final",
  "Goal amount": "Meta de ahorro",
  Months: "Meses",
  "Starting balance": "Saldo inicial",
  "Present amount": "Monto actual",
  "Annual inflation %": "Inflación anual %",
  "Total capital": "Capital total",
  "Weight A %": "Peso A %",
  "Weight B %": "Peso B %",
  "Weight C %": "Peso C %",
  "Equity value": "Valor equity",
  "Debt value": "Valor deuda",
  "Cost of equity %": "Costo equity %",
  "Cost of debt %": "Costo deuda %",
  "Tax rate %": "Tasa impositiva %",
  "Total pay": "Pago total",
  "Hours worked": "Horas trabajadas",
  "Value A": "Valor A",
  "Value B": "Valor B",
  "Operation (1=add 2=sub 3=mul 4=div)": "Operación (1=suma 2=resta 3=mul 4=div)",
};

export function FinanceTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const es = locale === "es";
  const showcase = getToolShowcase(tool.slug);
  const ui = showcaseUi(showcase?.accent);
  const op = String((tool.config ?? {}).operation ?? "");
  const rawFields = (tool.config?.fields ?? []) as string[];
  const fields = rawFields.map((label) => (es ? ES_FIELD[label] ?? label : label));
  const [values, setValues] = useState<string[]>(fields.map(() => ""));
  const [out, setOut] = useState("");

  const run = () => {
    try {
      setOut(runOp(op, values, es));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid input.";
      const map: Record<string, string> = {
        "Enter valid numbers in every field.": "Introduce números válidos en todos los campos.",
        "Term must be positive.": "El plazo debe ser positivo.",
        "Principal must be positive.": "El capital debe ser positivo.",
        "Payments made must be between 0 and the term.": "Los pagos realizados deben estar entre 0 y el plazo.",
        "Cost cannot be 0.": "El costo no puede ser 0.",
        "Start value and years must be positive.": "El valor inicial y los años deben ser positivos.",
        "Months must be positive.": "Los meses deben ser positivos.",
        "Years must be ≥ 0.": "Los años deben ser ≥ 0.",
        "Years must be ≥ 0 and compounds per year > 0.": "Años ≥ 0 y capitalizaciones por año > 0.",
        "Weights A+B+C must add up to 100%.": "Los pesos A+B+C deben sumar 100%.",
        "Equity + debt must be positive.": "Equity + deuda debe ser positivo.",
        "Term and payments made must be whole numbers.": "Plazo y pagos realizados deben ser enteros.",
        "Finance operation not available.": "Operación financiera no disponible.",
        "Hours worked must be positive.": "Las horas trabajadas deben ser positivas.",
        "Cannot divide by zero.": "No se puede dividir por cero.",
        "Operation must be 1 (add), 2 (sub), 3 (mul), or 4 (div).": "La operación debe ser 1 (suma), 2 (resta), 3 (mul) o 4 (div).",
        "Invalid input.": "Entrada no válida.",
      };
      setOut(es ? map[msg] ?? msg : msg);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((label, i) => (
          <label key={`${label}-${i}`} className="space-y-1">
            <span className="text-sm font-medium">{label}</span>
            <input
              type="number"
              inputMode="decimal"
              value={values[i] ?? ""}
              onChange={(e) => setValues((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
              className={ui?.field ?? "h-11 w-full rounded-xl border bg-background px-3"}
            />
          </label>
        ))}
      </div>
      <button type="button" onClick={run} className={ui?.btn ?? "rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground"}>
        {es ? "Calcular" : "Calculate"}
      </button>
      {out && (
        <output className={`block whitespace-pre-wrap rounded-2xl border p-4 ${ui ? `${ui.out} font-medium` : "bg-muted/30"}`}>
          {out}
        </output>
      )}
    </div>
  );
}
