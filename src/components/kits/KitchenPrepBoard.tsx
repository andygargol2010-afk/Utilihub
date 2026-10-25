import { useEffect, useMemo, useState } from "react";
import { ChefHat, Check, Clock, Download, RotateCcw, Timer, GripVertical } from "lucide-react";

const BASE_SERVINGS = 4;

const INGREDIENTS = [
  { id: "chicken", en: "Chicken breast", es: "Pechuga de pollo", amount: 500, unit: "g" },
  { id: "rice", en: "Rice", es: "Arroz", amount: 200, unit: "g" },
  { id: "veggies", en: "Mixed vegetables", es: "Verduras mixtas", amount: 300, unit: "g" },
  { id: "oil", en: "Olive oil", es: "Aceite de oliva", amount: 2, unit: "tbsp" },
  { id: "salt", en: "Salt", es: "Sal", amount: 1, unit: "tsp" },
  { id: "pepper", en: "Pepper", es: "Pimienta", amount: 0.5, unit: "tsp" },
] as const;

const STEPS = [
  { id: "prep", en: "Prep ingredients", es: "Preparar ingredientes", duration: 10 },
  { id: "cook-rice", en: "Cook rice", es: "Cocinar arroz", duration: 15 },
  { id: "sear", en: "Sear chicken", es: "Sellar el pollo", duration: 8 },
  { id: "veggies", en: "Sauté vegetables", es: "Saltear verduras", duration: 7 },
  { id: "combine", en: "Combine & season", es: "Combinar y sazonar", duration: 5 },
  { id: "rest", en: "Rest & plate", es: "Reposar y emplatar", duration: 3 },
] as const;

const STORAGE_KEY = "utilihub-kit-kitchen-prep";

type Props = { locale?: "en" | "es" };

export function KitchenPrepBoard({ locale = "en" }: Props) {
  const es = locale === "es";
  const [servings, setServings] = useState(BASE_SERVINGS);
  const [checked, setChecked] = useState<string[]>([]);
  const [stepOrder, setStepOrder] = useState<string[]>(STEPS.map((s) => s.id));
  const [currentStep, setCurrentStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.servings === "number") setServings(parsed.servings);
        if (Array.isArray(parsed.checked)) setChecked(parsed.checked);
        if (Array.isArray(parsed.stepOrder)) setStepOrder(parsed.stepOrder);
        if (typeof parsed.currentStep === "number") setCurrentStep(parsed.currentStep);
      }
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ servings, checked, stepOrder, currentStep }));
    } catch { /* private */ }
  }, [servings, checked, stepOrder, currentStep, ready]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const scale = servings / BASE_SERVINGS;
  const orderedSteps = useMemo(
    () => stepOrder.map((id) => STEPS.find((s) => s.id === id)!).filter(Boolean),
    [stepOrder],
  );
  const current = orderedSteps[currentStep];
  const progress = Math.round(((currentStep + (running ? 0.5 : 0)) / orderedSteps.length) * 100);
  const checkedCount = checked.length;

  function toggleIng(id: string) {
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function moveStep(index: number, dir: -1 | 1) {
    const next = [...stepOrder];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setStepOrder(next);
    if (currentStep === index) setCurrentStep(target);
    else if (currentStep === target) setCurrentStep(index);
  }

  function startTimer() {
    setTimerSeconds(0);
    setRunning(true);
  }

  function resetAll() {
    setServings(BASE_SERVINGS);
    setChecked([]);
    setStepOrder(STEPS.map((s) => s.id));
    setCurrentStep(0);
    setTimerSeconds(0);
    setRunning(false);
  }

  function sharePng() {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 32px system-ui";
    ctx.fillText(es ? "Preparación de cocina" : "Kitchen Prep Board", 40, 70);
    ctx.font = "20px system-ui";
    ctx.fillText(`${es ? "Porciones" : "Servings"}: ${servings} · ${es ? "Progreso" : "Progress"}: ${progress}%`, 40, 120);
    ctx.fillText("utilihub.com", 40, 560);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "kitchen-prep.png";
    a.click();
  }

  return (
    <section className="mt-8 rounded-2xl border border-border/70 bg-surface/55 p-4 sm:p-5" aria-labelledby="kitchen-prep-board">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">
            {es ? "Tablero de preparación interactivo" : "Interactive prep board"}
          </p>
          <h2 id="kitchen-prep-board" className="mt-1 text-lg font-black flex items-center gap-2">
            <ChefHat className="size-5 text-primary" />
            {es ? "Preparación de comida" : "Meal prep station"}
          </h2>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={sharePng} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-bold">
            <Download className="size-4" /> PNG
          </button>
          <button type="button" onClick={resetAll} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-bold">
            <RotateCcw className="size-4" /> {es ? "Reiniciar" : "Reset"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{es ? "Porciones" : "Servings"}</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setServings(Math.max(1, servings - 1))} className="size-8 rounded-full border">-</button>
                <span className="w-8 text-center font-black">{servings}</span>
                <button type="button" onClick={() => setServings(servings + 1)} className="size-8 rounded-full border">+</button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="text-sm font-bold mb-2">{es ? "Ingredientes" : "Ingredients"} ({checkedCount}/{INGREDIENTS.length})</div>
            <div className="space-y-1.5">
              {INGREDIENTS.map((ing) => {
                const scaled = (ing.amount * scale).toFixed(ing.amount % 1 ? 1 : 0);
                const isChecked = checked.includes(ing.id);
                return (
                  <button key={ing.id} type="button" onClick={() => toggleIng(ing.id)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm ${isChecked ? "bg-primary/10 line-through opacity-60" : "hover:bg-muted"}`}>
                    <Check className={`size-4 ${isChecked ? "text-primary" : "opacity-30"}`} />
                    <span className="flex-1">{es ? ing.es : ing.en}</span>
                    <span className="text-xs font-semibold tabular-nums">{scaled} {ing.unit}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center justify-between text-sm font-bold">
              <span>{es ? "Pasos" : "Steps"}</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 space-y-1">
              {orderedSteps.map((step, i) => (
                <div key={step.id} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${i === currentStep ? "bg-primary/10 font-semibold" : ""}`}>
                  <GripVertical className="size-4 opacity-40" />
                  <span className="flex-1">{es ? step.es : step.en}</span>
                  <span className="text-xs text-muted-foreground">{step.duration}m</span>
                  <button type="button" onClick={() => moveStep(i, -1)} disabled={i === 0} className="px-1 opacity-60 disabled:opacity-20">↑</button>
                  <button type="button" onClick={() => moveStep(i, 1)} disabled={i === orderedSteps.length - 1} className="px-1 opacity-60 disabled:opacity-20">↓</button>
                </div>
              ))}
            </div>
          </div>

          {current && (
            <div className="rounded-xl border border-border/70 bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Timer className="size-4 text-primary" />
                {es ? current.es : current.en}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-black tabular-nums">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")}
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={startTimer} className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                    {running ? (es ? "Reiniciar" : "Restart") : (es ? "Iniciar" : "Start")}
                  </button>
                  <button type="button" onClick={() => setRunning(false)} className="rounded-full border px-3 py-1 text-sm">Pause</button>
                  {currentStep < orderedSteps.length - 1 && (
                    <button type="button" onClick={() => { setCurrentStep(currentStep + 1); setTimerSeconds(0); setRunning(false); }} className="rounded-full border px-3 py-1 text-sm">
                      {es ? "Siguiente" : "Next"}
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">{es ? "Tiempo sugerido" : "Suggested"}: {current.duration} min</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default KitchenPrepBoard;
