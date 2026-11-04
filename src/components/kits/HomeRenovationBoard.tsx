import { useEffect, useMemo, useState } from "react";
import { Calculator, Clock, Copy, Ruler, CheckCircle2, Timer, Calendar, StickyNote, Trash2, Palette, DollarSign, ShoppingCart } from "lucide-react";

const STEPS = [
  { id: "measure", en: "Measure room", es: "Medir habitación" },
  { id: "materials", en: "Calculate materials", es: "Calcular materiales" },
  { id: "costs", en: "Estimate costs", es: "Estimar costos" },
  { id: "timeline", en: "Set timeline", es: "Definir cronograma" },
  { id: "review", en: "Review plan", es: "Revisar plan" },
] as const;

const STORAGE_KEY = "utilihub-kit-home-renovation";

type Props = { locale?: "en" | "es" };

type State = {
  length: number;
  width: number;
  height: number;
  floorPrice: number;
  paintPrice: number;
  coverage: number;
  wastePct: number;
  completed: string[];
  startDate: string;
  days: number;
  notes: string[];
  floorColor: string;
  wallColor: string;
  budget: number;
  bought: string[];
};

const DEFAULT: State = {
  length: 4,
  width: 3.5,
  height: 2.5,
  floorPrice: 25,
  paintPrice: 12,
  coverage: 10,
  wastePct: 10,
  completed: [],
  startDate: new Date().toISOString().slice(0, 10),
  days: 14,
  notes: [],
  floorColor: "#a8a29e",
  wallColor: "#e7e5e4",
  budget: 1000,
  bought: [],
};

export function HomeRenovationBoard({ locale = "en" }: Props) {
  const es = locale === "es";
  const [state, setState] = useState<State>(DEFAULT);
  const [ready, setReady] = useState(false);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState({
          ...DEFAULT,
          ...parsed,
          completed: Array.isArray(parsed.completed) ? parsed.completed : [],
          notes: Array.isArray(parsed.notes) ? parsed.notes : [],
          bought: Array.isArray(parsed.bought) ? parsed.bought : [],
        });
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* private */
    }
  }, [state, ready]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const floorArea = state.length * state.width;
  const wallArea = 2 * (state.length + state.width) * state.height;
  const wasteMul = 1 + state.wastePct / 100;
  const floorWithWaste = floorArea * wasteMul;
  const paintLiters = (wallArea / Math.max(state.coverage, 1)) * wasteMul;
  const floorCost = floorWithWaste * state.floorPrice;
  const paintCost = paintLiters * state.paintPrice;
  const totalCost = floorCost + paintCost;
  const progress = (state.completed.length / STEPS.length) * 100;
  const budgetPct = state.budget > 0 ? Math.min(100, (totalCost / state.budget) * 100) : 0;
  const overBudget = state.budget > 0 && totalCost > state.budget;

  const endDate = useMemo(() => {
    const d = new Date(state.startDate);
    d.setDate(d.getDate() + state.days);
    return d.toISOString().slice(0, 10);
  }, [state.startDate, state.days]);

  function update(key: keyof State, value: number | string | string[]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function toggleStep(id: string) {
    setState((prev) => ({
      ...prev,
      completed: prev.completed.includes(id) ? prev.completed.filter((x) => x !== id) : [...prev.completed, id],
    }));
  }

  function toggleBought(id: string) {
    setState((prev) => ({
      ...prev,
      bought: prev.bought.includes(id) ? prev.bought.filter((x) => x !== id) : [...prev.bought, id],
    }));
  }

  function addNote() {
    const text = noteDraft.trim();
    if (!text) return;
    setState((prev) => ({ ...prev, notes: [text, ...prev.notes].slice(0, 12) }));
    setNoteDraft("");
  }

  function removeNote(index: number) {
    setState((prev) => ({ ...prev, notes: prev.notes.filter((_, i) => i !== index) }));
  }

  function copySlip() {
    const notesLine = state.notes.length
      ? (es ? ` Notas: ${state.notes.length}.` : ` Notes: ${state.notes.length}.`)
      : "";
    const colorLine = es
      ? ` Colores: piso ${state.floorColor}, paredes ${state.wallColor}.`
      : ` Colors: floor ${state.floorColor}, walls ${state.wallColor}.`;
    const budgetLine = state.budget > 0
      ? (es
          ? ` Presupuesto: $${state.budget.toFixed(0)} (est. $${totalCost.toFixed(0)}${overBudget ? " — exceso" : ""}).`
          : ` Budget: $${state.budget.toFixed(0)} (est. $${totalCost.toFixed(0)}${overBudget ? " — over" : ""}).`)
      : "";
    const shopLine = state.bought.length
      ? (es ? ` Comprado: ${state.bought.join(", ")}.` : ` Bought: ${state.bought.join(", ")}.`)
      : "";
    const text = es
      ? `Plan de renovación: ${floorArea.toFixed(1)} m² piso (+${state.wastePct}% desperdicio → ${floorWithWaste.toFixed(1)} m²), ${paintLiters.toFixed(1)} L pintura, ~$${totalCost.toFixed(0)} total.${budgetLine}${shopLine} Cronograma: ${state.startDate} a ${endDate} (${state.days} días).${colorLine}${notesLine}`
      : `Renovation plan: ${floorArea.toFixed(1)} m² floor (+${state.wastePct}% waste → ${floorWithWaste.toFixed(1)} m²), ${paintLiters.toFixed(1)} L paint, ~$${totalCost.toFixed(0)} total.${budgetLine}${shopLine} Timeline: ${state.startDate} to ${endDate} (${state.days} days).${colorLine}${notesLine}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const mins = Math.floor(timer / 60);
  const secs = timer % 60;

  const svgW = 200;
  const svgH = 140;
  const scale = Math.min(svgW / Math.max(state.length, 1), svgH / Math.max(state.width, 1)) * 0.8;
  const roomW = state.length * scale;
  const roomH = state.width * scale;
  const offsetX = (svgW - roomW) / 2;
  const offsetY = (svgH - roomH) / 2;

  return (
    <section className="mt-8 rounded-2xl border border-border/70 bg-surface/55 p-4 sm:p-5" aria-labelledby="renovation-board">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">
            {es ? "Tablero de renovación" : "Renovation board"}
          </p>
          <h2 id="renovation-board" className="mt-1 text-lg font-black">
            {es ? "Plan de habitación interactivo" : "Interactive room plan"}
          </h2>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {state.completed.length}/{STEPS.length} {es ? "pasos" : "steps"}
        </p>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        {es
          ? "Medí dimensiones, calculá materiales (con desperdicio), costos en vivo, presupuesto visual, lista de compra, elegí colores, pegá resultados, marcá el checklist, definí el cronograma y usá el temporizador de foco. Todo local."
          : "Enter dimensions, see live materials (with waste), costs, visual budget, shopping checklist, pick colors, paste results, check off steps, set a timeline, and use the focus timer. All local."}
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Ruler className="size-4 text-primary" />
              {es ? "Dimensiones (m)" : "Dimensions (m)"}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["length", "width", "height"] as const).map((key) => (
                <label key={key} className="text-xs">
                  <span className="font-medium">{es ? { length: "Largo", width: "Ancho", height: "Alto" }[key] : { length: "Length", width: "Width", height: "Height" }[key]}</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={state[key]}
                    onChange={(e) => update(key, parseFloat(e.target.value) || 0)}
                    className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-sm"
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <svg width={svgW} height={svgH} className="rounded border border-border/50 bg-muted/30" aria-label={es ? "Esquema de la habitación" : "Room sketch"}>
                <rect x={offsetX} y={offsetY} width={roomW} height={roomH} fill={state.floorColor} stroke="hsl(var(--primary))" strokeWidth="2" />
                <rect x={offsetX + roomW * 0.35} y={offsetY + roomH - 8} width={roomW * 0.3} height={8} fill={state.wallColor} />
                <text x={svgW / 2} y={offsetY - 4} textAnchor="middle" fontSize="10" fill="currentColor">{state.length.toFixed(1)} m</text>
                <text x={offsetX - 4} y={svgH / 2} textAnchor="end" fontSize="10" fill="currentColor" transform={`rotate(-90 ${offsetX - 4} ${svgH / 2})`}>{state.width.toFixed(1)} m</text>
                <text x={svgW / 2} y={offsetY + roomH / 2} textAnchor="middle" fontSize="9" fill="currentColor">{state.height.toFixed(1)} m alt</text>
              </svg>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5">
                <Palette className="size-3.5" />
                {es ? "Piso" : "Floor"}
                <input type="color" value={state.floorColor} onChange={(e) => update("floorColor", e.target.value)} className="h-6 w-10 cursor-pointer rounded border" />
              </label>
              <label className="flex items-center gap-1.5">
                <Palette className="size-3.5" />
                {es ? "Paredes" : "Walls"}
                <input type="color" value={state.wallColor} onChange={(e) => update("wallColor", e.target.value)} className="h-6 w-10 cursor-pointer rounded border" />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Calculator className="size-4 text-primary" />
              {es ? "Materiales y costos" : "Materials & costs"}
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>{es ? "Área piso" : "Floor area"}</span><span className="font-semibold tabular-nums">{floorArea.toFixed(1)} m²</span></div>
              <div className="flex justify-between"><span>{es ? "Piso c/ desperdicio" : "Floor w/ waste"}</span><span className="font-semibold tabular-nums">{floorWithWaste.toFixed(1)} m²</span></div>
              <div className="flex justify-between"><span>{es ? "Área paredes" : "Wall area"}</span><span className="font-semibold tabular-nums">{wallArea.toFixed(1)} m²</span></div>
              <div className="flex justify-between"><span>{es ? "Pintura (est. c/ desp.)" : "Paint (est. w/ waste)"}</span><span className="font-semibold tabular-nums">{paintLiters.toFixed(1)} L</span></div>
              <div className="flex justify-between border-t border-border/50 pt-2"><span>{es ? "Costo total est." : "Est. total cost"}</span><span className="font-black tabular-nums">${totalCost.toFixed(0)}</span></div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <label>
                {es ? "$/m² piso" : "$ / m² floor"}
                <input type="number" value={state.floorPrice} onChange={(e) => update("floorPrice", parseFloat(e.target.value) || 0)} className="mt-1 w-full rounded border px-2 py-1" />
              </label>
              <label>
                {es ? "$/L pintura" : "$ / L paint"}
                <input type="number" value={state.paintPrice} onChange={(e) => update("paintPrice", parseFloat(e.target.value) || 0)} className="mt-1 w-full rounded border px-2 py-1" />
              </label>
              <label>
                {es ? "% desperdicio" : "% waste"}
                <input type="number" min="0" max="50" value={state.wastePct} onChange={(e) => update("wastePct", parseFloat(e.target.value) || 0)} className="mt-1 w-full rounded border px-2 py-1" />
              </label>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs font-medium">
                <DollarSign className="size-3.5" />
                {es ? "Presupuesto" : "Budget"}
                <input type="number" min="0" value={state.budget} onChange={(e) => update("budget", parseFloat(e.target.value) || 0)} className="ml-auto w-24 rounded border px-2 py-0.5 text-right" />
              </div>
              {state.budget > 0 && (
                <div className="mt-2">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full transition-all ${overBudget ? "bg-destructive" : "bg-primary"}`} style={{ width: `${budgetPct}%` }} />
                  </div>
                  <p className={`mt-1 text-xs ${overBudget ? "text-destructive" : "text-muted-foreground"}`}>
                    {overBudget
                      ? (es ? `Exceso de $${(totalCost - state.budget).toFixed(0)}` : `Over by $${(totalCost - state.budget).toFixed(0)}`)
                      : (es ? `${budgetPct.toFixed(0)}% del presupuesto` : `${budgetPct.toFixed(0)}% of budget`)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="text-sm font-bold">{es ? "Checklist de progreso" : "Progress checklist"}</div>
            <div className="mt-3 space-y-2">
              {STEPS.map((step) => {
                const done = state.completed.includes(step.id);
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                      done ? "border-primary bg-primary/10" : "border-border/70"
                    }`}
                    aria-pressed={done}
                  >
                    <CheckCircle2 className={`size-4 ${done ? "text-primary" : "text-muted-foreground"}`} />
                    {es ? step.es : step.en}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <ShoppingCart className="size-4 text-primary" />
              {es ? "Lista de compra" : "Shopping list"}
            </div>
            <div className="mt-3 space-y-2">
              {[
                { id: "floor", en: `Flooring ~${floorWithWaste.toFixed(1)} m²`, es: `Piso ~${floorWithWaste.toFixed(1)} m²` },
                { id: "paint", en: `Paint ~${paintLiters.toFixed(1)} L`, es: `Pintura ~${paintLiters.toFixed(1)} L` },
              ].map((item) => {
                const done = state.bought.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleBought(item.id)}
                    className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                      done ? "border-primary bg-primary/10" : "border-border/70"
                    }`}
                    aria-pressed={done}
                  >
                    <CheckCircle2 className={`size-4 ${done ? "text-primary" : "text-muted-foreground"}`} />
                    {es ? item.es : item.en}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Calendar className="size-4 text-primary" />
              {es ? "Cronograma" : "Timeline"}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <label>
                {es ? "Inicio" : "Start"}
                <input type="date" value={state.startDate} onChange={(e) => update("startDate", e.target.value)} className="mt-1 w-full rounded border px-2 py-1" />
              </label>
              <label>
                {es ? "Días" : "Days"}
                <input type="number" min="1" value={state.days} onChange={(e) => update("days", parseInt(e.target.value) || 1)} className="mt-1 w-full rounded border px-2 py-1" />
              </label>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {es ? `Fin estimado: ${endDate}` : `Est. end: ${endDate}`}
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Timer className="size-4 text-primary" />
              {es ? "Temporizador de foco" : "Focus timer"}
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums">
              {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setRunning((r) => !r)} className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                {running ? (es ? "Pausa" : "Pause") : (es ? "Iniciar" : "Start")}
              </button>
              <button type="button" onClick={() => { setRunning(false); setTimer(0); }} className="rounded-full border px-3 py-1 text-sm font-bold">
                {es ? "Reset" : "Reset"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <StickyNote className="size-4 text-primary" />
              {es ? "Resultados pegados" : "Pasted results"}
            </div>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder={es ? "Pegá aquí un resultado de otra herramienta..." : "Paste a result from another tool here..."}
              className="mt-2 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
              rows={2}
            />
            <button type="button" onClick={addNote} className="mt-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              {es ? "Agregar nota" : "Add note"}
            </button>
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
              {state.notes.map((note, i) => (
                <div key={i} className="flex items-start gap-2 rounded border border-border/60 bg-muted/40 px-2 py-1.5 text-xs">
                  <p className="flex-1 whitespace-pre-wrap break-words">{note}</p>
                  <button type="button" onClick={() => removeNote(i)} className="shrink-0 text-muted-foreground hover:text-destructive" aria-label={es ? "Eliminar" : "Remove"}>
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
              {state.notes.length === 0 && (
                <p className="text-xs text-muted-foreground">{es ? "Sin notas aún." : "No notes yet."}</p>
              )}
            </div>
          </div>

          <button type="button" onClick={copySlip} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-bold">
            <Copy className="size-4" />
            {copied ? (es ? "¡Copiado!" : "Copied!") : (es ? "Copiar resumen" : "Copy summary")}
          </button>
        </div>
      </div>
    </section>
  );
}
