import { useCallback, useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";

type Part = {
  id: string;
  name: string;
  type: "board" | "screw" | "dowel" | "leg" | "top";
  qty: number;
};

type Step = {
  id: string;
  title: string;
  parts: Part[];
  completed: boolean;
};

type Furniture = {
  type: string;
  difficulty: "easy" | "normal";
  steps: Step[];
};

const TYPES = [
  { id: "shelf", en: "Simple Shelf", es: "Estantería simple" },
  { id: "desk", en: "Desk", es: "Escritorio" },
  { id: "chair", en: "Chair", es: "Silla" },
];

const PRESETS: Record<string, Record<string, { steps: Omit<Step, "id" | "completed">[] }>> = {
  shelf: {
    easy: {
      steps: [
        { title: "Attach sides", parts: [{ id: "", name: "Side panel", type: "board", qty: 2 }] },
        { title: "Add shelves", parts: [{ id: "", name: "Shelf board", type: "board", qty: 2 }, { id: "", name: "Dowels", type: "dowel", qty: 8 }] },
      ],
    },
    normal: {
      steps: [
        { title: "Base frame", parts: [{ id: "", name: "Side panel", type: "board", qty: 2 }, { id: "", name: "Screws", type: "screw", qty: 4 }] },
        { title: "Middle shelves", parts: [{ id: "", name: "Shelf board", type: "board", qty: 3 }, { id: "", name: "Dowels", type: "dowel", qty: 12 }] },
        { title: "Top and finish", parts: [{ id: "", name: "Top board", type: "board", qty: 1 }, { id: "", name: "Screws", type: "screw", qty: 4 }] },
      ],
    },
  },
  desk: {
    easy: {
      steps: [
        { title: "Legs", parts: [{ id: "", name: "Leg", type: "leg", qty: 4 }] },
        { title: "Top", parts: [{ id: "", name: "Desktop", type: "top", qty: 1 }, { id: "", name: "Screws", type: "screw", qty: 8 }] },
      ],
    },
    normal: {
      steps: [
        { title: "Frame", parts: [{ id: "", name: "Leg", type: "leg", qty: 4 }, { id: "", name: "Support beam", type: "board", qty: 2 }] },
        { title: "Surface", parts: [{ id: "", name: "Desktop", type: "top", qty: 1 }, { id: "", name: "Screws", type: "screw", qty: 12 }] },
        { title: "Cable tray", parts: [{ id: "", name: "Tray board", type: "board", qty: 1 }, { id: "", name: "Dowels", type: "dowel", qty: 4 }] },
      ],
    },
  },
  chair: {
    easy: {
      steps: [
        { title: "Seat base", parts: [{ id: "", name: "Seat board", type: "board", qty: 1 }, { id: "", name: "Legs", type: "leg", qty: 4 }] },
        { title: "Back", parts: [{ id: "", name: "Backrest", type: "board", qty: 1 }, { id: "", name: "Screws", type: "screw", qty: 6 }] },
      ],
    },
    normal: {
      steps: [
        { title: "Legs & stretchers", parts: [{ id: "", name: "Leg", type: "leg", qty: 4 }, { id: "", name: "Stretcher", type: "board", qty: 2 }] },
        { title: "Seat", parts: [{ id: "", name: "Seat board", type: "board", qty: 1 }, { id: "", name: "Screws", type: "screw", qty: 8 }] },
        { title: "Backrest", parts: [{ id: "", name: "Backrest", type: "board", qty: 1 }, { id: "", name: "Dowels", type: "dowel", qty: 4 }] },
      ],
    },
  },
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyFurniture(): Furniture {
  return { type: "shelf", difficulty: "normal", steps: [] };
}

function loadPreset(type: string, diff: "easy" | "normal"): Furniture {
  const preset = PRESETS[type]?.[diff];
  if (!preset) return emptyFurniture();
  return {
    type,
    difficulty: diff,
    steps: preset.steps.map((s) => ({
      id: uid(),
      title: s.title,
      parts: s.parts.map((p) => ({ ...p, id: uid() })),
      completed: false,
    })),
  };
}

function encodeState(f: Furniture): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify({ t: f.type, d: f.difficulty, s: f.steps.map(st => ({ id: st.id, title: st.title, completed: st.completed, parts: st.parts })) }))));
  } catch {
    return "";
  }
}

function decodeState(s: string | null): Furniture | null {
  if (!s) return null;
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(s))));
    return {
      type: data.t || "shelf",
      difficulty: data.d || "normal",
      steps: (data.s || []).map((st: any) => ({
        id: st.id || uid(),
        title: st.title || "",
        completed: !!st.completed,
        parts: (st.parts || []).map((p: any) => ({ ...p, id: p.id || uid() })),
      })),
    };
  } catch {
    return null;
  }
}

export function FurnitureAssemblyKit({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [furn, setFurn] = useState<Furniture>(() => {
    if (typeof window === "undefined") return loadPreset("shelf", "normal");
    const params = new URLSearchParams(window.location.search);
    const decoded = decodeState(params.get("a"));
    if (decoded && decoded.steps.length) return decoded;
    const type = params.get("type") || "shelf";
    const diff = (params.get("diff") as "easy" | "normal") || "normal";
    return loadPreset(type, diff);
  });
  const [copied, setCopied] = useState(false);
  const [dragStep, setDragStep] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const encoded = encodeState(furn);
    if (encoded) url.searchParams.set("a", encoded);
    else url.searchParams.delete("a");
    url.searchParams.set("type", furn.type);
    url.searchParams.set("diff", furn.difficulty);
    window.history.replaceState({}, "", url.toString());
  }, [furn]);

  const progress = useMemo(() => {
    const done = furn.steps.filter((s) => s.completed).length;
    return {
      done,
      total: furn.steps.length,
      pct: furn.steps.length ? Math.round((done / furn.steps.length) * 100) : 0,
    };
  }, [furn]);

  const setType = (type: string) => {
    setFurn(loadPreset(type, furn.difficulty));
  };

  const setDifficulty = (diff: "easy" | "normal") => {
    setFurn(loadPreset(furn.type, diff));
  };

  const toggleStep = (stepId: string) => {
    setFurn((f) => ({
      ...f,
      steps: f.steps.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s)),
    }));
  };

  const moveStep = (from: number, to: number) => {
    if (to < 0 || to >= furn.steps.length) return;
    setFurn((f) => {
      const next = [...f.steps];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return { ...f, steps: next };
    });
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
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 800, 640);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(0, 0, 8, 640);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 32px system-ui, sans-serif";
    const typeLabel = TYPES.find((t) => t.id === furn.type);
    ctx.fillText(typeLabel ? (es ? typeLabel.es : typeLabel.en) : "Furniture", 40, 70);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`${es ? "Kit de ensamblaje" : "Furniture Assembly Kit"} · ${furn.difficulty}`, 40, 100);
    let y = 150;
    furn.steps.forEach((step, si) => {
      ctx.fillStyle = step.completed ? "#22c55e" : "#e2e8f0";
      ctx.font = "bold 18px system-ui, sans-serif";
      ctx.fillText(`${si + 1}. ${step.title} ${step.completed ? "✓" : ""}`, 40, y);
      y += 28;
      step.parts.forEach((p) => {
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "14px system-ui, sans-serif";
        ctx.fillText(`  • ${p.qty}× ${p.name}`, 40, y);
        y += 22;
      });
      y += 8;
    });
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("utilihub.app", 40, 610);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "furniture-assembly.png";
    a.click();
  };

  const Diagram = () => {
    const completedSteps = furn.steps.filter(s => s.completed).length;
    const total = furn.steps.length || 1;
    const fill = (completedSteps / total) * 100;
    return (
      <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border bg-muted/30">
        <div className="absolute inset-x-4 bottom-4 flex flex-col items-center gap-1">
          {furn.type === "shelf" && (
            <>
              <div className="h-3 w-40 rounded bg-amber-600/80" style={{ opacity: fill > 60 ? 1 : 0.4 }} />
              <div className="h-3 w-36 rounded bg-amber-500/80" style={{ opacity: fill > 30 ? 1 : 0.4 }} />
              <div className="h-3 w-40 rounded bg-amber-600/80" style={{ opacity: fill > 0 ? 1 : 0.4 }} />
              <div className="flex gap-8">
                <div className="h-24 w-3 rounded bg-amber-800/80" />
                <div className="h-24 w-3 rounded bg-amber-800/80" />
              </div>
            </>
          )}
          {furn.type === "desk" && (
            <div className="flex flex-col items-center">
              <div className="h-4 w-48 rounded bg-slate-400/80" style={{ opacity: fill > 40 ? 1 : 0.4 }} />
              <div className="mt-2 flex gap-32">
                <div className="h-16 w-3 rounded bg-slate-600/80" />
                <div className="h-16 w-3 rounded bg-slate-600/80" />
              </div>
            </div>
          )}
          {furn.type === "chair" && (
            <div className="flex flex-col items-center">
              <div className="h-20 w-3 rounded bg-amber-700/80" style={{ opacity: fill > 50 ? 1 : 0.4 }} />
              <div className="h-3 w-24 rounded bg-amber-500/80" style={{ opacity: fill > 20 ? 1 : 0.4 }} />
              <div className="mt-1 flex gap-16">
                <div className="h-12 w-2 rounded bg-amber-800/80" />
                <div className="h-12 w-2 rounded bg-amber-800/80" />
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
          {es ? "Vista ensamblada" : "Assembled view"} · {progress.pct}%
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold">{es ? "Tipo de mueble" : "Furniture type"}</label>
          <select
            value={furn.type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {TYPES.map((t) => (
              <option key={t.id} value={t.id}>{es ? t.es : t.en}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold">{es ? "Dificultad" : "Difficulty"}</label>
          <select
            value={furn.difficulty}
            onChange={(e) => setDifficulty(e.target.value as "easy" | "normal")}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="easy">{es ? "Fácil" : "Easy"}</option>
            <option value="normal">{es ? "Normal" : "Normal"}</option>
          </select>
        </div>
      </div>

      <Diagram />

      <div className="rounded-2xl border border-border bg-card/50 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{es ? "Progreso" : "Progress"}</span>
          <span className="text-muted-foreground">
            {progress.done}/{progress.total} {es ? "pasos" : "steps"} · {progress.pct}%
          </span>
        </div>
        <div className="mt-2 flex gap-1">
          {furn.steps.map((s, i) => (
            <div
              key={s.id}
              className={`h-2 flex-1 rounded-full ${s.completed ? "bg-primary" : "bg-muted"}`}
              title={`${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {furn.steps.map((step, si) => (
          <div
            key={step.id}
            draggable
            onDragStart={() => setDragStep(step.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (!dragStep || dragStep === step.id) return;
              const from = furn.steps.findIndex((s) => s.id === dragStep);
              if (from >= 0) moveStep(from, si);
              setDragStep(null);
            }}
            className={`rounded-2xl border p-4 ${step.completed ? "border-primary/40 bg-card" : "border-border bg-card"}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className={`flex size-8 items-center justify-center rounded-full text-xs font-black ${step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {si + 1}
              </span>
              <span className="flex-1 font-medium">{step.title}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveStep(si, si - 1)} disabled={si === 0} className="rounded bg-secondary px-2 py-1 text-xs disabled:opacity-40">↑</button>
                <button type="button" onClick={() => moveStep(si, si + 1)} disabled={si === furn.steps.length - 1} className="rounded bg-secondary px-2 py-1 text-xs disabled:opacity-40">↓</button>
                <button type="button" onClick={() => toggleStep(step.id)} className="rounded bg-primary/10 px-2 py-1 text-xs">
                  {step.completed ? (es ? "Deshacer" : "Undo") : (es ? "Completar" : "Complete")}
                </button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {step.parts.map((p) => (
                <span key={p.id} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {p.qty}× {p.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copyLink} className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium">
          {copied ? (es ? "¡Copiado!" : "Copied!") : (es ? "Copiar enlace" : "Copy link")}
        </button>
        <button type="button" onClick={sharePng} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          {es ? "Compartir PNG" : "Share PNG"}
        </button>
        <button type="button" onClick={() => setFurn(loadPreset(furn.type, furn.difficulty))} className="rounded-lg border border-border px-4 py-2 text-sm">
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
