import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

const STEPS = [
  { id: "price-sign", en: "Price sign", es: "Cartel de precios" },
  { id: "starting-change", en: "Starting change", es: "Cambio inicial" },
  { id: "stall-photo", en: "Stall photo", es: "Foto del puesto" },
  { id: "link-or-qr", en: "Link or QR", es: "Enlace o QR" },
  { id: "cash-close", en: "Cash close", es: "Cierre de caja" },
] as const;

const STORAGE_KEY = "utilihub-kit-market-stall";

type Props = { locale?: "en" | "es" };

export function MarketStallBoard({ locale = "en" }: Props) {
  const es = locale === "es";
  const [done, setDone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setDone(parsed.filter((item): item is string => typeof item === "string" && STEPS.some((s) => s.id === item)));
        }
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      /* private mode */
    }
  }, [done, ready]);

  const doneCount = done.length;

  function toggle(id: string) {
    setDone((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function reset() {
    setDone([]);
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-border/70 bg-surface/55 p-4 sm:p-5"
      data-kit="market-stall"
      data-kit-steps="5"
      data-kit-done={String(doneCount)}
      aria-labelledby="market-stall-board"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">
            {es ? "Tablero del d\u00eda de feria" : "Fair day board"}
          </p>
          <h2 id="market-stall-board" className="mt-1 text-lg font-black">
            {es ? "Prepar\u00e1 el puesto" : "Set up the stall"}
          </h2>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {doneCount}/5 {es ? "hechos" : "done"}
        </p>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        {es
          ? "Marca los pasos de un d\u00eda de feria. Se guarda en este navegador. Reiniciar vuelve todo a cero."
          : "Check the steps for a fair day. It stays in this browser. Reset clears every step."}
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {STEPS.map((step, index) => {
          const checked = done.includes(step.id);
          const label = es ? step.es : step.en;
          return (
            <li key={step.id}>
              <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 accent-primary"
                  checked={checked}
                  onChange={() => toggle(step.id)}
                  aria-label={label}
                />
                <span className={checked ? "text-muted-foreground line-through" : "font-medium"}>
                  <span className="mr-1 text-xs font-bold text-primary">{index + 1}.</span>
                  {label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="mt-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-bold"
        >
          <RotateCcw className="size-4" />
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </section>
  );
}
