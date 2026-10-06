import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  addDays,
  calculateSchengen,
  formatIso,
  newStayId,
  parseIso,
  todayIso,
  validateSchengen,
  type SchengenStay,
} from "@/lib/general/schengen";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function stay(entry: string, exit: string): SchengenStay {
  return { id: newStayId(), entry, exit };
}

export function SchengenCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [reference, setReference] = useState(todayIso);
  const [stays, setStays] = useState<SchengenStay[]>(() => {
    const end = todayIso();
    const startDate = parseIso(end);
    const start = startDate ? formatIso(addDays(startDate, -9)) : end;
    return [stay(start, end)];
  });
  const [copied, setCopied] = useState(false);

  const issues = useMemo(() => validateSchengen(reference, stays, es), [reference, stays, es]);
  const result = useMemo(
    () => (issues.length ? null : calculateSchengen(reference, stays)),
    [issues, reference, stays],
  );

  function applyPreset(kind: "ten" | "full" | "split") {
    const ref = parseIso(reference) ?? parseIso(todayIso());
    if (!ref) return;
    const end = formatIso(ref);
    if (kind === "ten") {
      setStays([stay(formatIso(addDays(ref, -9)), end)]);
      return;
    }
    if (kind === "full") {
      setStays([stay(formatIso(addDays(ref, -89)), end)]);
      return;
    }
    setStays([
      stay(formatIso(addDays(ref, -40)), formatIso(addDays(ref, -21))),
      stay(formatIso(addDays(ref, -12)), end),
    ]);
  }

  function reset() {
    const end = todayIso();
    const startDate = parseIso(end);
    setReference(end);
    setStays([stay(startDate ? formatIso(addDays(startDate, -9)) : end, end)]);
  }

  async function copySummary() {
    if (!result) return;
    const lines = [
      es ? `Ventana: ${result.windowStart} → ${result.windowEnd} (180 días)` : `Window: ${result.windowStart} → ${result.windowEnd} (180 days)`,
      es ? `Usados: ${result.used} días` : `Used: ${result.used} days`,
      es ? `Restantes: ${result.remaining} días` : `Remaining: ${result.remaining} days`,
      es ? `Exceso: ${result.overstay} días` : `Overstay: ${result.overstay} days`,
    ];
    if (result.nextFreeDate) {
      lines.push(
        es
          ? `Próximo día que sale de la ventana: ${result.nextFreeDate}`
          : `Next day that drops out: ${result.nextFreeDate}`,
      );
    }
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => applyPreset("ten")}>
          {es ? "Viaje de 10 días" : "10-day trip"}
        </button>
        <button type="button" className={buttonClass} onClick={() => applyPreset("full")}>
          {es ? "90 días justos" : "Exactly 90 days"}
        </button>
        <button type="button" className={buttonClass} onClick={() => applyPreset("split")}>
          {es ? "Dos estancias" : "Two stays"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <label className="block space-y-1 text-sm">
        <span>{es ? "Fecha de referencia" : "Reference date"}</span>
        <input className={inputClass} type="date" value={reference} onChange={(event) => setReference(event.target.value)} />
      </label>

      <div className="space-y-3">
        {stays.map((item, index) => (
          <fieldset key={item.id} className="space-y-3 rounded-2xl border p-3">
            <legend className="px-1 text-sm font-medium">{es ? `Estancia ${index + 1}` : `Stay ${index + 1}`}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1 text-sm">
                <span>{es ? "Entrada" : "Entry"}</span>
                <input
                  className={inputClass}
                  type="date"
                  value={item.entry}
                  onChange={(event) =>
                    setStays((current) => current.map((stay) => (stay.id === item.id ? { ...stay, entry: event.target.value } : stay)))
                  }
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span>{es ? "Salida" : "Exit"}</span>
                <input
                  className={inputClass}
                  type="date"
                  value={item.exit}
                  onChange={(event) =>
                    setStays((current) => current.map((stay) => (stay.id === item.id ? { ...stay, exit: event.target.value } : stay)))
                  }
                />
              </label>
            </div>
            <button
              type="button"
              className={buttonClass}
              onClick={() => setStays((current) => current.filter((stay) => stay.id !== item.id))}
            >
              {es ? "Quitar estancia" : "Remove stay"}
            </button>
          </fieldset>
        ))}
      </div>

      <button type="button" className={buttonClass} onClick={() => setStays((current) => [...current, stay("", "")])}>
        {es ? "Agregar estancia" : "Add stay"}
      </button>

      {issues.length > 0 ? (
        <ul className="space-y-1 rounded-2xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
          {issues.map((issue) => (
            <li key={issue.field}>{issue.message}</li>
          ))}
        </ul>
      ) : result ? (
        <div className="space-y-2 rounded-2xl border p-3">
          <p className="text-sm text-muted-foreground">
            {es
              ? `Ventana de 180 días: ${result.windowStart} → ${result.windowEnd}`
              : `180-day window: ${result.windowStart} → ${result.windowEnd}`}
          </p>
          <dl className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-muted p-2">
              <dt className="text-xs text-muted-foreground">{es ? "Usados" : "Used"}</dt>
              <dd className="text-xl font-semibold">{result.used}</dd>
            </div>
            <div className="rounded-xl bg-muted p-2">
              <dt className="text-xs text-muted-foreground">{es ? "Restantes" : "Left"}</dt>
              <dd className="text-xl font-semibold">{result.remaining}</dd>
            </div>
            <div className="rounded-xl bg-muted p-2">
              <dt className="text-xs text-muted-foreground">{es ? "Exceso" : "Over"}</dt>
              <dd className="text-xl font-semibold">{result.overstay}</dd>
            </div>
          </dl>
          <ul className="space-y-1 text-sm">
            {result.stays.map((stay, index) => (
              <li key={stay.id}>
                {es
                  ? `Estancia ${index + 1}: ${stay.days} días inclusivos, ${stay.inWindow} dentro de la ventana.`
                  : `Stay ${index + 1}: ${stay.days} inclusive days, ${stay.inWindow} inside the window.`}
              </li>
            ))}
          </ul>
          <p className="text-sm">
            {result.nextFreeDate
              ? es
                ? `El ${result.nextFreeDate} sale un día de la ventana (${result.daysUntilOneFree} días después).`
                : `On ${result.nextFreeDate} one day drops out (${result.daysUntilOneFree} days later).`
              : es
                ? "No hay días usados que puedan salir de la ventana."
                : "No used days can drop out of the window."}
          </p>
          <button type="button" className={buttonClass} onClick={copySummary}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resumen" : "Copy summary"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
