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

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyRecipe(): Recipe {
  return {
    title: "",
    cuisine: "blank",
    steps: [
      { id: uid(), title: "", ingredients: [] },
    ],
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

  const addStep = () => {
    setRecipe((r) => ({
      ...r,
      steps: [...r.steps, { id: uid(), title: "", ingredients: [] }],
    }));
  };

  const updateStepTitle = (stepId: string, title: string) => {
    setRecipe((r) => ({
      ...r,
      steps: r.steps.map((s) => (s.id === stepId ? { ...s, title } : s)),
    }));
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
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, 0, 8, 600);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 32px system-ui, sans-serif";
    ctx.fillText(recipe.title || (es ? "Receta ensamblada" : "Assembled Recipe"), 40, 70);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(es ? "Kit de ensamblaje de recetas" : "Recipe Assembly Kit", 40, 100);
    let y = 150;
    recipe.steps.forEach((step, si) => {
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 18px system-ui, sans-serif";
      ctx.fillText(`${si + 1}. ${step.title || (es ? "Paso" : "Step")}`, 40, y);
      y += 28;
      step.ingredients.forEach((ing) => {
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "14px system-ui, sans-serif";
        ctx.fillText(`  • ${ing.qty} ${ing.unit} ${ing.name}`, 40, y);
        y += 22;
      });
      y += 10;
    });
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("utilihub.com", 40, 560);
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
          <select
            value={recipe.cuisine}
            onChange={(e) => setRecipe({ ...recipe, cuisine: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {CUISINES.map((c) => (
              <option key={c.id} value={c.id}>
                {es ? c.es : c.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {recipe.steps.map((step, si) => (
          <div key={step.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">
                {si + 1}
              </span>
              <input
                type="text"
                value={step.title}
                onChange={(e) => updateStepTitle(step.id, e.target.value)}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium"
                placeholder={es ? "Nombre del paso" : "Step name"}
              />
            </div>
            <div className="mt-3 space-y-2">
              {step.ingredients.map((ing) => (
                <div key={ing.id} className="flex flex-wrap items-center gap-2 text-sm">
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
                    className="flex-1 min-w-[120px] rounded border border-border px-2 py-1"
                    placeholder={es ? "Ingrediente" : "Ingredient"}
                  />
                  <input
                    type="text"
                    value={ing.notes}
                    onChange={(e) => updateIngredient(step.id, ing.id, "notes", e.target.value)}
                    className="w-32 rounded border border-border px-2 py-1"
                    placeholder={es ? "Notas" : "Notes"}
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(step.id, ing.id)}
                    className="rounded bg-destructive/10 px-2 py-1 text-xs text-destructive"
                  >
                    ×
                  </button>
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
        ))}
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
                <strong>
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
