import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Luggage } from "lucide-react";
import { ITEMS } from "./TravelPackingBoard.part1";
import { type Props, STORAGE_KEY, LIMIT_KG } from "./TravelPackingBoard.part2";

export function TravelPackingBoard({ locale = "en" }: Props) {
  const es = locale === "es";
  const [packed, setPacked] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setPacked(parsed.filter((id): id is string => typeof id === "string" && ITEMS.some((i) => i.id === id)));
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(packed));
    } catch {
      /* private mode */
    }
  }, [packed, ready]);

  const totalWeight = useMemo(
    () => ITEMS.filter((item) => packed.includes(item.id)).reduce((sum, item) => sum + item.weight, 0),
    [packed],
  );

  const progress = Math.min(100, (totalWeight / LIMIT_KG) * 100);
  const over = totalWeight > LIMIT_KG;
  const itemCount = packed.length;

  function toggle(id: string) {
    setPacked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function reset() {
    setPacked([]);
  }

  return (
    <section className="mt-8 rounded-2xl border border-border/70 bg-surface/55 p-4 sm:p-5" aria-labelledby="travel-packing-board">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">
            {es ? "Maleta visual interactiva" : "Interactive visual suitcase"}
          </p>
          <h2 id="travel-packing-board" className="mt-1 text-lg font-black">
            {es ? "Armá tu packing" : "Build your packing"}
          </h2>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {itemCount} {es ? "items" : "items"} · {totalWeight.toFixed(1)} kg
        </p>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        {es
          ? "Hacé clic en los ítems para agregar o quitar. Las barras de peso y progreso se actualizan al instante. Límite de cabina: 10 kg."
          : "Click items to add or remove. Weight and progress bars update instantly. Cabin limit: 10 kg."}
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ITEMS.map((item) => {
              const isPacked = packed.includes(item.id);
              const label = es ? item.es : item.en;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                    isPacked
                      ? "border-primary bg-primary/10 font-semibold text-primary"
                      : "border-border/70 bg-card hover:border-primary/40"
                  }`}
                  aria-pressed={isPacked}
                >
                  <div className="font-medium">{label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{item.weight} kg</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Luggage className="size-4 text-primary" />
              {es ? "Peso de la maleta" : "Suitcase weight"}
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums">
              {totalWeight.toFixed(1)} <span className="text-base font-semibold text-muted-foreground">/ {LIMIT_KG} kg</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-300 ${over ? "bg-destructive" : "bg-primary"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={`mt-2 text-xs font-semibold ${over ? "text-destructive" : "text-muted-foreground"}`}>
              {over
                ? es
                  ? "¡Sobre el límite de cabina!"
                  : "Over cabin limit!"
                : es
                  ? `${(LIMIT_KG - totalWeight).toFixed(1)} kg libres`
                  : `${(LIMIT_KG - totalWeight).toFixed(1)} kg remaining`}
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="text-sm font-bold">{es ? "Progreso de items" : "Items progress"}</div>
            <div className="mt-2 text-2xl font-black tabular-nums">
              {itemCount} <span className="text-base font-semibold text-muted-foreground">/ {ITEMS.length}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${(itemCount / ITEMS.length) * 100}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-bold"
          >
            <RotateCcw className="size-4" />
            {es ? "Reiniciar maleta" : "Reset suitcase"}
          </button>
        </div>
      </div>
    </section>
  );
}
