import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { getToolShowcase } from "@/lib/tool-showcase";
import { showcaseUi } from "@/lib/showcase-ui";
import { runOp } from "./FinanceTool.part2";

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
