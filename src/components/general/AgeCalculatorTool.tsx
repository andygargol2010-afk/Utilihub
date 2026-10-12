import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function calculateAge(birth: Date, today: Date) {
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const daysToBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays, daysToBirthday };
}

export function AgeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const today = new Date();
  const defaultBirth = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
  const defaultStr = defaultBirth.toISOString().slice(0, 10);

  const [birthStr, setBirthStr] = useState(defaultStr);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!birthStr) return null;
    const birth = new Date(birthStr + "T00:00:00");
    if (isNaN(birth.getTime()) || birth > today) return null;
    return calculateAge(birth, today);
  }, [birthStr, today]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Edad: ${result.years} años, ${result.months} meses, ${result.days} días. Días vividos: ${result.totalDays}. Próximo cumpleaños en ${result.daysToBirthday} días.`
      : `Age: ${result.years} years, ${result.months} months, ${result.days} days. Days lived: ${result.totalDays}. Next birthday in ${result.daysToBirthday} days.`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setBirthStr(defaultStr);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Edad exacta" : "Exact age"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">
              {result.years} {es ? "años" : "years"}, {result.months} {es ? "meses" : "months"}, {result.days} {es ? "días" : "days"}
            </p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Días vividos: ${result.totalDays.toLocaleString()} · Próximo cumpleaños en ${result.daysToBirthday} días`
                : `Days lived: ${result.totalDays.toLocaleString()} · Next birthday in ${result.daysToBirthday} days`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresá una fecha de nacimiento válida en el pasado" : "Enter a valid past birth date"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Fecha de nacimiento" : "Birth date"}</span>
          <input type="date" value={birthStr} onChange={(e) => setBirthStr(e.target.value)} className={fieldClass} max={today.toISOString().slice(0, 10)} />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
