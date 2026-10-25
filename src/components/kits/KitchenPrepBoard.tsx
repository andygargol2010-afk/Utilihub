import { useEffect, useMemo, useState } from "react";
import { ChefHat, Check, Clock, Download, RotateCcw, Timer, GripVertical, ChevronDown } from "lucide-react";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const BASE_SERVINGS = 4;

type Ingredient = { id: string; en: string; es: string; amount: number; unit: string };
type Step = { id: string; en: string; es: string; duration: number };
type Recipe = { id: string; en: string; es: string; ingredients: Ingredient[]; steps: Step[] };

const RECIPES: Recipe[] = [
  {
    id: "chicken-bowl",
    en: "Chicken rice bowl",
    es: "Bowl de pollo y arroz",
    ingredients: [
      { id: "chicken", en: "Chicken breast", es: "Pechuga de pollo", amount: 500, unit: "g" },
      { id: "rice", en: "Rice", es: "Arroz", amount: 200, unit: "g" },
      { id: "veggies", en: "Mixed vegetables", es: "Verduras mixtas", amount: 300, unit: "g" },
      { id: "oil", en: "Olive oil", es: "Aceite de oliva", amount: 2, unit: "tbsp" },
      { id: "salt", en: "Salt", es: "Sal", amount: 1, unit: "tsp" },
      { id: "pepper", en: "Pepper", es: "Pimienta", amount: 0.5, unit: "tsp" },
    ],
    steps: [
      { id: "prep", en: "Prep ingredients", es: "Preparar ingredientes", duration: 10 },
      { id: "cook-rice", en: "Cook rice", es: "Cocinar arroz", duration: 15 },
      { id: "sear", en: "Sear chicken", es: "Sellar el pollo", duration: 8 },
      { id: "veggies", en: "Saut\u00e9 vegetables", es: "Saltear verduras", duration: 7 },
      { id: "combine", en: "Combine & season", es: "Combinar y sazonar", duration: 5 },
      { id: "rest", en: "Rest & plate", es: "Reposar y emplatar", duration: 3 },
    ],
  },
  {
    id: "veggie-stir",
    en: "Veggie stir-fry",
    es: "Salteado de verduras",
    ingredients: [
      { id: "tofu", en: "Firm tofu", es: "Tofu firme", amount: 300, unit: "g" },
      { id: "noodles", en: "Rice noodles", es: "Fideos de arroz", amount: 180, unit: "g" },
      { id: "broccoli", en: "Broccoli", es: "Br\u00f3coli", amount: 250, unit: "g" },
      { id: "pepper-bell", en: "Bell pepper", es: "Pimiento", amount: 150, unit: "g" },
      { id: "soy", en: "Soy sauce", es: "Salsa de soja", amount: 3, unit: "tbsp" },
      { id: "garlic", en: "Garlic", es: "Ajo", amount: 2, unit: "cloves" },
    ],
    steps: [
      { id: "soak", en: "Soak noodles", es: "Remojar fideos", duration: 8 },
      { id: "prep-veg", en: "Prep vegetables", es: "Preparar verduras", duration: 7 },
      { id: "sear-tofu", en: "Sear tofu", es: "Sellar tofu", duration: 6 },
      { id: "stir", en: "Stir-fry everything", es: "Saltear todo", duration: 6 },
      { id: "sauce", en: "Add sauce & toss", es: "Agregar salsa y mezclar", duration: 3 },
      { id: "plate", en: "Plate & garnish", es: "Emplatar y decorar", duration: 2 },
    ],
  },
  {
    id: "overnight-oats",
    en: "Overnight oats",
    es: "Avena nocturna",
    ingredients: [
      { id: "oats", en: "Rolled oats", es: "Avena en hojuelas", amount: 160, unit: "g" },
      { id: "milk", en: "Milk or plant milk", es: "Leche o vegetal", amount: 400, unit: "ml" },
      { id: "yogurt", en: "Yogurt", es: "Yogur", amount: 120, unit: "g" },
      { id: "fruit", en: "Mixed fruit", es: "Fruta mixta", amount: 200, unit: "g" },
      { id: "honey", en: "Honey or maple", es: "Miel o maple", amount: 2, unit: "tbsp" },
      { id: "chia", en: "Chia seeds", es: "Semillas de ch\u00eda", amount: 2, unit: "tbsp" },
    ],
    steps: [
      { id: "mix", en: "Mix oats & liquid", es: "Mezclar avena y l\u00edquido", duration: 3 },
      { id: "add-ins", en: "Add chia & sweetener", es: "Agregar ch\u00eda y endulzante", duration: 2 },
      { id: "portion", en: "Portion into jars", es: "Porcionar en frascos", duration: 4 },
      { id: "top", en: "Top with fruit", es: "Cubrir con fruta", duration: 3 },
      { id: "chill", en: "Chill overnight", es: "Enfriar toda la noche", duration: 480 },
      { id: "serve", en: "Stir & serve", es: "Revolver y servir", duration: 1 },
    ],
  },
];

const STORAGE_KEY = "utilihub-kit-kitchen-prep";

type Props = { locale?: "en" | "es" };

export function KitchenPrepBoard({ locale = "en" }: Props) {
  const es = locale === "es";
  const [recipeId, setRecipeId] = useState(RECIPES[0].id);
  const [servings, setServings] = useState(BASE_SERVINGS);
  const [checked, setChecked] = useState<string[]>([]);
  const [stepOrder, setStepOrder] = useState<string[]>(RECIPES[0].steps.map((s) => s.id));
  const [currentStep, setCurrentStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);

  const recipe = RECIPES.find((r) => r.id === recipeId) ?? RECIPES[0];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.recipeId === "string" && RECIPES.some((r) => r.id === parsed.recipeId)) setRecipeId(parsed.recipeId);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ recipeId, servings, checked, stepOrder, currentStep }));
    } catch { /* private */ }
  }, [recipeId, servings, checked, stepOrder, currentStep, ready]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Reset steps/order when recipe changes
  useEffect(() => {
    if (!ready) return;
    setStepOrder(recipe.steps.map((s) => s.id));
    setCurrentStep(0);
    setChecked([]);
    setTimerSeconds(0);
    setRunning(false);
  }, [recipeId]); // eslint-disable-line

  const scale = servings / BASE_SERVINGS;
  const orderedSteps = useMemo(
    () => stepOrder.map((id) => recipe.steps.find((s) => s.id === id)!).filter(Boolean),
    [stepOrder, recipe],
  );
  const current = orderedSteps[currentStep];
  const progress = Math.round(((currentStep + (running ? 0.5 : 0)) / Math.max(1, orderedSteps.length)) * 100);
  const checkedCount = checked.length;
  const suggestedSec = current ? Math.min(current.duration * 60, 3600) : 60; // cap display for overnight
  const ringProgress = Math.min(1, timerSeconds / Math.max(1, suggestedSec));
  const circumference = 2 * Math.PI * 42;

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href.split("?")[0]
      : es
        ? "https://utilihub.com/es/kits/preparacion-cocina"
        : "https://utilihub.com/kits/kitchen-prep";

  function selectRecipe(id: string) {
    setRecipeId(id);
    setRecipeOpen(false);
  }

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
    setRecipeId(RECIPES[0].id);
    setServings(BASE_SERVINGS);
    setChecked([]);
    setStepOrder(RECIPES[0].steps.map((s) => s.id));
    setCurrentStep(0);
    setTimerSeconds(0);
    setRunning(false);
  }

  function sharePng() {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 640;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 800, 640);
    // accent bar
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, 0, 8, 640);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 30px system-ui, sans-serif";
    ctx.fillText(es ? "Preparaci\u00f3n de cocina" : "Kitchen Prep Board", 40, 56);
    ctx.font = "18px system-ui, sans-serif";
    const recipeName = es ? recipe.es : recipe.en;
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(recipeName, 40, 92);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText(`${es ? "Porciones" : "Servings"}: ${servings}`, 40, 140);
    ctx.fillText(`${es ? "Progreso pasos" : "Steps progress"}: ${progress}%  (${currentStep + 1}/${orderedSteps.length})`, 40, 170);
    ctx.fillText(`${es ? "Ingredientes listos" : "Ingredients ready"}: ${checkedCount}/${recipe.ingredients.length}`, 40, 200);
    if (current) {
      ctx.fillText(`${es ? "Paso actual" : "Current step"}: ${es ? current.es : current.en}`, 40, 230);
    }
    // mini checklist of first 4 ingredients
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText(es ? "Lista r\u00e1pida:" : "Quick list:", 40, 280);
    recipe.ingredients.slice(0, 5).forEach((ing, i) => {
      const done = checked.includes(ing.id);
      const scaled = (ing.amount * scale).toFixed(ing.amount % 1 ? 1 : 0);
      ctx.fillStyle = done ? "#22c55e" : "#cbd5e1";
      ctx.fillText(`${done ? "\u2713" : "\u25cb"}  ${es ? ing.es : ing.en}  ${scaled} ${ing.unit}`, 40, 310 + i * 26);
    });
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("utilihub.com", 40, 600);
    ctx.fillStyle = "#22c55e";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText(es ? "Kit interactivo de preparaci\u00f3n" : "Interactive meal-prep kit", 40, 622);
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
            {es ? "Tablero de preparaci\u00f3n interactivo" : "Interactive prep board"}
          </p>
          <h2 id="kitchen-prep-board" className="mt-1 text-lg font-black flex items-center gap-2">
            <ChefHat className="size-5 text-primary" />
            {es ? "Preparaci\u00f3n de comida" : "Meal prep station"}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExperienceShareButton
            title={es ? "Preparaci\u00f3n de cocina" : "Kitchen Prep Board"}
            url={shareUrl}
            locale={locale}
          />
          <button type="button" onClick={sharePng} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-bold">
            <Download className="size-4" /> PNG
          </button>
          <button type="button" onClick={resetAll} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-bold">
            <RotateCcw className="size-4" /> {es ? "Reiniciar" : "Reset"}
          </button>
        </div>
      </div>

      {/* Live summary strip */}
      <div className="mt-4 flex flex-wrap gap-3 rounded-xl border border-border/60 bg-card/80 px-3 py-2.5 text-sm">
        <span className="font-semibold tabular-nums">
          {es ? "Porciones" : "Servings"}: <span className="text-primary">{servings}</span>
        </span>
        <span className="text-muted-foreground">\u00b7</span>
        <span className="font-semibold tabular-nums">
          {es ? "Ingredientes" : "Ingredients"}: <span className="text-primary">{checkedCount}/{recipe.ingredients.length}</span>
        </span>
        <span className="text-muted-foreground">\u00b7</span>
        <span className="font-semibold tabular-nums">
          {es ? "Progreso" : "Progress"}: <span className="text-primary">{progress}%</span>
        </span>
      </div>

      {/* Recipe selector */}
      <div className="mt-4 relative">
        <button
          type="button"
          onClick={() => setRecipeOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 text-left text-sm font-bold"
          aria-expanded={recipeOpen}
        >
          <span>{es ? recipe.es : recipe.en}</span>
          <ChevronDown className={`size-4 transition-transform ${recipeOpen ? "rotate-180" : ""}`} />
        </button>
        {recipeOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border border-border/70 bg-card shadow-lg">
            {RECIPES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => selectRecipe(r.id)}
                className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-muted ${r.id === recipeId ? "bg-primary/10 font-semibold" : ""}`}
              >
                {es ? r.es : r.en}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{es ? "Porciones" : "Servings"}</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setServings(Math.max(1, servings - 1))} className="size-9 rounded-full border text-lg leading-none">-</button>
                <span className="w-8 text-center font-black">{servings}</span>
                <button type="button" onClick={() => setServings(servings + 1)} className="size-9 rounded-full border text-lg leading-none">+</button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="text-sm font-bold mb-2">{es ? "Ingredientes" : "Ingredients"} ({checkedCount}/{recipe.ingredients.length})</div>
            <div className="space-y-1.5">
              {recipe.ingredients.map((ing) => {
                const scaled = (ing.amount * scale).toFixed(ing.amount % 1 ? 1 : 0);
                const isChecked = checked.includes(ing.id);
                return (
                  <button key={ing.id} type="button" onClick={() => toggleIng(ing.id)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${isChecked ? "bg-primary/10 line-through opacity-60" : "hover:bg-muted"}`}>
                    <Check className={`size-4 shrink-0 ${isChecked ? "text-primary" : "opacity-30"}`} />
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
                <div key={step.id} className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm ${i === currentStep ? "bg-primary/10 font-semibold" : ""}`}>
                  <GripVertical className="size-4 shrink-0 opacity-40" />
                  <span className="flex-1 min-w-0">{es ? step.es : step.en}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{step.duration >= 60 ? `${Math.round(step.duration / 60)}h` : `${step.duration}m`}</span>
                  <div className="flex shrink-0">
                    <button type="button" onClick={() => moveStep(i, -1)} disabled={i === 0} className="size-8 rounded border opacity-70 disabled:opacity-20 text-sm">\u2191</button>
                    <button type="button" onClick={() => moveStep(i, 1)} disabled={i === orderedSteps.length - 1} className="size-8 rounded border opacity-70 disabled:opacity-20 text-sm ml-1">\u2193</button>
                  </div>
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
              <div className="mt-3 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative size-28 shrink-0">
                  <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/40" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-primary transition-all duration-300"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - ringProgress)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="text-xl font-black tabular-nums">
                      {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 w-full">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={startTimer} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
                      {running ? (es ? "Reiniciar" : "Restart") : (es ? "Iniciar" : "Start")}
                    </button>
                    <button type="button" onClick={() => setRunning(false)} className="rounded-full border px-4 py-2 text-sm">
                      {es ? "Pausa" : "Pause"}
                    </button>
                    {currentStep < orderedSteps.length - 1 && (
                      <button type="button" onClick={() => { setCurrentStep(currentStep + 1); setTimerSeconds(0); setRunning(false); }} className="rounded-full border px-4 py-2 text-sm">
                        {es ? "Siguiente" : "Next"}
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{es ? "Tiempo sugerido" : "Suggested"}: {current.duration >= 60 ? `${Math.round(current.duration / 60)} h` : `${current.duration} min`}</div>
                  {ringProgress >= 1 && running && (
                    <div className="text-xs font-semibold text-primary">{es ? "\u00a1Tiempo cumplido!" : "Time's up!"}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default KitchenPrepBoard;
