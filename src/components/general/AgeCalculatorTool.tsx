import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function AgeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;
    const now = new Date();
    if (birth > now) return null;
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months, days };
  }, [birthDate]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `${result.years} años, ${result.months} meses, ${result.days} días`
      : `${result.years} years, ${result.months} months, ${result.days} days`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setBirthDate("1990-01-01");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Edad exacta" : "Exact age"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">
              {result.years} {es ? "años" : "years"}, {result.months} {es ? "meses" : "months"}, {result.days} {es ? "días" : "days"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce una fecha de nacimiento válida (pasada)" : "Enter a valid past birth date"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Fecha de nacimiento" : "Date of birth"}</span>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={fieldClass}
          max={new Date().toISOString().split("T")[0]}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula la edad precisa considerando años, meses y días completos."
          : "Calculates precise age accounting for full years, months, and days."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Nacido el 15/05/2000 → ~25 años (depende de hoy)" : "Born 2000-05-15 → ~25 years (depends on today)"}</p>
        <p>{es ? "Nacido el 01/01/1995 → ~31 años" : "Born 1995-01-01 → ~31 years"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
