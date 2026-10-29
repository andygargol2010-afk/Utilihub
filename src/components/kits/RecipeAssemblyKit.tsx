import { useCallback, useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";

type Ingredient = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  notes: string;
};

type Step = {
  id: string;
  title: string;
  ingredients: Ingredient[];
};

type Recipe = {
  title: string;
  cuisine: string;
  steps: Step[];
};

const CUISINES = [
  { id: "blank", en: "Blank", es: "En blanco" },
  { id: "mexican", en: "Mexican", es: "Mexicana" },
  { id: "italian", en: "Italian", es: "Italiana" },
  { id: "asian", en: "Asian", es: "Asiática" },
  { id: "american", en: "American", es: "Americana" },
];

const PRESETS: Record<string, { title: string; steps: Omit<Step, "id">[] }> = {
  mexican: {
    title: "Tacos al pastor",
    steps: [
      {
        title: "Marinate",
        ingredients: [
          { id: "", name: "pork", qty: 500, unit: "g", notes: "thin slices" },
          { id: "", name: "achiote paste", qty: 2, unit: "tbsp", notes: "" },
          { id: "", name: "pineapple", qty: 100, unit: "g", notes: "diced" },
        ],
      },
      {
        title: "Assemble",
        ingredients: [
          { id: "", name: "corn tortillas", qty: 8, unit: "pcs", notes: "" },
          { id: "", name: "onion", qty: 1, unit: "pcs", notes: "chopped" },
          { id: "", name: "cilantro", qty: 10, unit: "g", notes: "" },
        ],
      },
    ],
  },
  italian: {
    title: "Spaghetti carbonara",
    steps: [
      {
        title: "Sauce",
        ingredients: [
          { id: "", name: "eggs", qty: 3, unit: "pcs", notes: "" },
          { id: "", name: "pecorino", qty: 50, unit: "g", notes: "grated" },
          { id: "", name: "black pepper", qty: 1, unit: "tsp", notes: "" },
        ],
      },
      {
        title: "Pasta",
        ingredients: [
          { id: "", name: "spaghetti", qty: 400, unit: "g", notes: "" },
          { id: "", name: "guanciale", qty: 100, unit: "g", notes: "diced" },
        ],
      },
    ],
  },
  asian: {
    title: "Stir-fry",
    steps: [
      {
        title: "Prep",
        ingredients: [
          { id: "", name: "vegetables", qty: 300, unit: "g", notes: "mixed" },
          { id: "", name: "soy sauce", qty: 2, unit: "tbsp", notes: "" },
          { id: "", name: "garlic", qty: 2, unit: "cloves", notes: "" },
        ],
      },
      {
        title: "Cook",
        ingredients: [
          { id: "", name: "rice", qty: 200, unit: "g", notes: "cooked" },
          { id: "", name: "oil", qty: 1, unit: "tbsp", notes: "" },
        ],
      },
    ],
  },
  american: {
    title: "Classic burger",
    steps: [
      {
        title: "Patty",
        ingredients: [
          { id: "", name: "ground beef", qty: 200, unit: "g", notes: "" },
          { id: "", name: "salt", qty: 0.5, unit: "tsp", notes: "" },
          { id: "", name: "pepper", qty: 0.25, unit: "tsp", notes: "" },
        ],
      },
      {
        title: "Build",
        ingredients: [
          { id: "", name: "bun", qty: 1, unit: "pcs", notes: "" },
          { id: "", name: "cheese", qty: 1, unit: "slice", notes: "" },
          { id: "", name: "lettuce", qty: 1, unit: "leaf", notes: "" },
        ],
      },
    ],
  },
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyRecipe(): Recipe {
  return {
    title: "",
    cuisine: "blank",
    steps: [{ id: uid(), title: "", ingredients: [] }],
  };
}

function withIds(preset: typeof PRESETS[string]): Recipe {
  return {
    title: preset.title,
    cuisine: "blank",
    steps: preset.steps.map((s) => ({
      id: uid(),
      title: s.title,
      ingredients: s.ingredients.map((i) => ({ ...i, id: uid() })),
    })),
  };
}

function encodeRecipe(r: Recipe): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(r))));
  } catch {
    return "";
  }
}

function decodeRecipe(s: string | null): Recipe | null {
  if (!s) return null;
  try {
    return JSON.parse(decodeURIComponent(escape(atob(s))));
  } catch {
    return null;
  }
}

export function RecipeAssemblyKit({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [recipe, setRecipe] = useState<Recipe>(() => {
    if (typeof window === "undefined") return emptyRecipe();
    const params = new URLSearchParams(window.location.search);
    return decodeRecipe(params.get("r")) || emptyRecipe();
  });
  const [copied, setCopied] = useState(false);
  const [dragStep, setDragStep] = useState<string | null>(null);
  const [dragIng, setDragIng] = useState<{ stepId: string; ingId: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const encoded = encodeRecipe(recipe);
    if (encoded) url.searchParams.set("r", encoded);
    else url.searchParams.delete("r");
    window.history.replaceState({}, "", url.toString());
  }, [recipe]);

  const shoppingList = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; unit: string }>();
    for (const step of recipe.steps) {
      for (const ing of step.ingredients) {
        const key = `${ing.name.toLowerCase()}|${ing.unit}`;
        const prev = map.get(key);
        if (prev) prev.qty += ing.qty;
        else map.set(key, { name: ing.name, qty: ing.qty, unit: ing.unit });
      }
    }
    return Array.from(map.values());
  }, [recipe]);

  const progress = useMemo(() => {
    const filled = recipe.steps.filter((s) => s.ingredients.length > 0).length;
    return {
      filled,
      total: recipe.steps.length,
      pct: recipe.steps.length ? Math.round((filled / recipe.steps.length) * 100) : 0,
    };
  }, [recipe]);

  const addStep = () => {
    setRecipe((r) => ({
      ...r,
      steps: [...r.steps, { id: uid(), title: "", ingredients: [] }],
    }));
  };

  const removeStep = (stepId: string) => {
    setRecipe((r) => {
      if (r.steps.length <= 1) return r;
      return { ...r, steps: r.steps.filter((s) => s.id !== stepId) };
    });
  };

  const updateStepTitle = (stepId: string, title: string) => {
    setRecipe((r) => ({
      ...r,
      steps: r.steps.map((s) => (s.id === stepId ? { ...s, title } : s)),
    }));
  };

  const moveStep = (from: number, to: number) => {
    if (to < 0 || to >= recipe.steps.length) return;
    setRecipe((r) => {
      const next = [...r.steps];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return { ...r, steps: next };
    });
  };

  const addIngredient = (stepId: string) => {
    setRecipe((r) => ({
      ...r,
      steps: r.steps.map((s) =>
        s.id === stepId
          ? {
              ...s,
              ingredients: [
                ...s.ingredients,
                { id: uid(), name: "", qty: 1, unit: "g", notes: "" },
              ],
            }
          : s,
      ),
    }));
  };

  const updateIngredient = (
    stepId: string,
    ingId: string,
    field: keyof Ingredient,
    value: string | number,
  ) => {
    setRecipe((r) => ({
      ...r,
      steps: r.steps.map((s) =>
        s.id === stepId
          ? {
              ...s,
              ingredients: s.ingredients.map((i) =>
                i.id === ingId ? { ...i, [field]: value } : i,
              ),
            }
          : s,
      ),
    }));
  };

  const removeIngredient = (stepId: string, ingId: string) => {
    setRecipe((r) => ({
      ...r,
      steps: r.steps.map((s) =>
        s.id === stepId
          ? { ...s, ingredients: s.ingredients.filter((i) => i.id !== ingId) }
          : s,
      ),
    }));
  };

  const moveIngredient = (stepId: string, from: number, to: number) => {
    setRecipe((r) => ({
      ...r,
      steps: r.steps.map((s) => {
        if (s.id !== stepId) return s;
        if (to < 0 || to >= s.ingredients.length) return s;
        const next = [...s.ingredients];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        return { ...s, ingredients: next };
      }),
    }));
  };

  const applyPreset = (cuisineId: string) => {
    const preset = PRESETS[cuisineId];
    if (!preset) return;
    setRecipe((r) => ({
      ...withIds(preset),
      cuisine: cuisineId,
      title: r.title || preset.title,
    }));
  };

  const copyLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const sharePng = () => {
    const lineH = 22;
    const headerH = 160;
    const stepsH = recipe.steps.reduce(
      (acc, s) => acc + 28 + s.ingredients.length * lineH + 12,
      0,
    );
    const shopH = Math.max(80, shoppingList.length * lineH + 40);
    const totalH = Math.max(640, headerH + stepsH + shopH + 40);
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = totalH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 800, totalH);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, 0, 8, totalH);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 32px system-ui, sans-serif";
    ctx.fillText(recipe.title || (es ? "Receta ensamblada" : "Assembled Recipe"), 40, 70);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    const cuisineLabel = CUISINES.find((c) => c.id === recipe.cuisine);
    ctx.fillText(
      `${es ? "Kit de ensamblaje" : "Recipe Assembly Kit"} · ${cuisineLabel ? (es ? cuisineLabel.es : cuisineLabel.en) : ""}`,
      40,
      100,
    );
    let y = 150;
    recipe.steps.forEach((step, si) => {
      const done = step.ingredients.length > 0;
      ctx.fillStyle = done ? "#22c55e" : "#e2e8f0";
      ctx.font = "bold 18px system-ui, sans-serif";
      ctx.fillText(`${si + 1}. ${step.title || (es ? "Paso" : "Step")}`, 40, y);
      y += 28;
      step.ingredients.forEach((ing) => {
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "14px system-ui, sans-serif";
        const note = ing.notes ? ` (${ing.notes})` : "";
        ctx.fillText(`  • ${ing.qty} ${ing.unit} ${ing.name}${note}`, 40, y);
        y += lineH;
      });
      y += 10;
    });
    y += 16;
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText(es ? "Lista de compras" : "Shopping list", 40, y);
    y += 26;
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    if (shoppingList.length === 0) {
      ctx.fillText(es ? "Sin ingredientes" : "No ingredients", 40, y);
    } else {
      shoppingList.forEach((item) => {
        ctx.fillText(`• ${item.qty} ${item.unit} ${item.name}`, 40, y);
        y += lineH;
      });
    }
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("utilihub.com", 40, totalH - 24);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "recipe-assembly.png";
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold">{es ? "Título de la receta" : "Recipe title"}</label>
          <input
            type="text"
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            placeholder={es ? "Mi receta" : "My recipe"}
          />
        </div>
        <div>
          <label className="text-sm font-bold">{es ? "Cocina base" : "Base cuisine"}</label>
          <div className="mt-1 flex gap-2">
            <select
              value={recipe.cuisine}
              onChange={(e) => setRecipe({ ...recipe, cuisine: e.target.value })}
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm"
            >
              {CUISINES.map((c) => (
                <option key={c.id} value={c.id}>
                  {es ? c.es : c.en}
                </option>
              ))}
            </select>
            {recipe.cuisine !== "blank" && PRESETS[recipe.cuisine] && (
              <button
                type="button"
                onClick={() => applyPreset(recipe.cuisine)}
                className="rounded-lg bg-secondary px-3 py-2 text-xs font-medium"
              >
                {es ? "Cargar ejemplo" : "Load sample"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{es ? "Progreso" : "Progress"}</span>
          <span className="text-muted-foreground">
            {progress.filled}/{progress.total} {es ? "pasos con ingredientes" : "steps with ingredients"} · {progress.pct}%
          </span>
        </div>
        <div className="mt-2 flex gap-1">
          {recipe.steps.map((s, i) => (
            <div
              key={s.id}
              className={`h-2 flex-1 rounded-full ${s.ingredients.length > 0 ? "bg-primary" : "bg-muted"}`}
              title={`${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {recipe.steps.map((step, si) => {
          const done = step.ingredients.length > 0;
          return (
            <div
              key={step.id}
              draggable
              onDragStart={() => setDragStep(step.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (!dragStep || dragStep === step.id) return;
                const from = recipe.steps.findIndex((s) => s.id === dragStep);
                if (from >= 0) moveStep(from, si);
                setDragStep(null);
              }}
              className={`rounded-2xl border p-4 ${done ? "border-primary/40 bg-card" : "border-border bg-card"}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-black ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {si + 1}
                </span>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStepTitle(step.id, e.target.value)}
                  className="min-w-[140px] flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium"
                  placeholder={es ? "Nombre del paso" : "Step name"}
                />
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveStep(si, si - 1)}
                    disabled={si === 0}
                    className="rounded bg-secondary px-2 py-1 text-xs disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(si, si + 1)}
                    disabled={si === recipe.steps.length - 1}
                    className="rounded bg-secondary px-2 py-1 text-xs disabled:opacity-40"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    disabled={recipe.steps.length <= 1}
                    className="rounded bg-destructive/10 px-2 py-1 text-xs text-destructive disabled:opacity-40"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {step.ingredients.map((ing, ii) => (
                  <div
                    key={ing.id}
                    draggable
                    onDragStart={() => setDragIng({ stepId: step.id, ingId: ing.id })}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (!dragIng || dragIng.stepId !== step.id || dragIng.ingId === ing.id) return;
                      const from = step.ingredients.findIndex((i) => i.id === dragIng.ingId);
                      if (from >= 0) moveIngredient(step.id, from, ii);
                      setDragIng(null);
                    }}
                    className="flex flex-wrap items-center gap-2 text-sm"
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={ing.qty}
                      onChange={(e) => updateIngredient(step.id, ing.id, "qty", parseFloat(e.target.value) || 0)}
                      className="w-16 rounded border border-border px-2 py-1"
                    />
                    <input
                      type="text"
                      value={ing.unit}
                      onChange={(e) => updateIngredient(step.id, ing.id, "unit", e.target.value)}
                      className="w-16 rounded border border-border px-2 py-1"
                      placeholder="g"
                    />
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => updateIngredient(step.id, ing.id, "name", e.target.value)}
                      className="min-w-[120px] flex-1 rounded border border-border px-2 py-1"
                      placeholder={es ? "Ingrediente" : "Ingredient"}
                    />
                    <input
                      type="text"
                      value={ing.notes}
                      onChange={(e) => updateIngredient(step.id, ing.id, "notes", e.target.value)}
                      className="w-28 rounded border border-border px-2 py-1"
                      placeholder={es ? "Notas" : "Notes"}
                    />
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveIngredient(step.id, ii, ii - 1)}
                        disabled={ii === 0}
                        className="rounded bg-secondary px-1.5 py-1 text-xs disabled:opacity-40"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveIngredient(step.id, ii, ii + 1)}
                        disabled={ii === step.ingredients.length - 1}
                        className="rounded bg-secondary px-1.5 py-1 text-xs disabled:opacity-40"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeIngredient(step.id, ing.id)}
                        className="rounded bg-destructive/10 px-2 py-1 text-xs text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addIngredient(step.id)}
                  className="mt-1 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium"
                >
                  {es ? "+ Ingrediente" : "+ Ingredient"}
                </button>
              </div>
            </div>
          );
        })}
        <button
          type="button"
          onClick={addStep}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          {es ? "+ Paso" : "+ Step"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-sm font-black uppercase tracking-wide text-primary">
            {es ? "Vista previa" : "Live preview"}
          </h3>
          <div className="mt-2 space-y-2 text-sm">
            {recipe.steps.map((step, si) => (
              <div key={step.id}>
                <strong className={step.ingredients.length > 0 ? "text-primary" : ""}>
                  {si + 1}. {step.title || (es ? "Paso" : "Step")}
                </strong>
                <ul className="ml-4 list-disc">
                  {step.ingredients.map((ing) => (
                    <li key={ing.id}>
                      {ing.qty} {ing.unit} {ing.name} {ing.notes && `(${ing.notes})`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-sm font-black uppercase tracking-wide text-primary">
            {es ? "Lista de compras" : "Shopping list"}
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {shoppingList.map((item, i) => (
              <li key={i}>
                {item.qty} {item.unit} {item.name}
              </li>
            ))}
            {shoppingList.length === 0 && (
              <li className="text-muted-foreground">{es ? "Agrega ingredientes" : "Add ingredients"}</li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={sharePng}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          {es ? "Descargar PNG" : "Download PNG"}
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-bold"
        >
          {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Copiar enlace" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
