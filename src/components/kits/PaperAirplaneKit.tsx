import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";

type Design = {
  id: string;
  nameEn: string;
  nameEs: string;
  stepsEn: string[];
  stepsEs: string[];
  folds: number;
  descEn: string;
  descEs: string;
};

const DESIGNS: Design[] = [
  {
    id: "dart",
    nameEn: "Classic Dart",
    nameEs: "Dardo clásico",
    descEn: "Fast, pointed nose for distance.",
    descEs: "Nariz puntiaguda y rápida para distancia.",
    folds: 6,
    stepsEn: [
      "Fold paper in half lengthwise, crease, open",
      "Fold top corners to center crease",
      "Fold top edges to center again",
      "Fold in half along original crease",
      "Fold wings down evenly",
      "Adjust wing angle and launch",
    ],
    stepsEs: [
      "Dobla el papel por la mitad a lo largo, marca y abre",
      "Dobla las esquinas superiores hacia el pliegue central",
      "Dobla los bordes superiores al centro de nuevo",
      "Dobla por la mitad a lo largo del pliegue original",
      "Dobla las alas hacia abajo de forma pareja",
      "Ajusta el ángulo de las alas y lanza",
    ],
  },
  {
    id: "glider",
    nameEn: "Glider",
    nameEs: "Planeador",
    descEn: "Wider wings for smooth, long glides.",
    descEs: "Alas más anchas para planeos largos y suaves.",
    folds: 5,
    stepsEn: [
      "Fold in half, crease, open",
      "Fold top corners to center",
      "Fold top point down to meet bottom",
      "Fold in half and create wide wings",
      "Slight upward wing tips for stability",
    ],
    stepsEs: [
      "Dobla por la mitad, marca y abre",
      "Dobla las esquinas superiores al centro",
      "Dobla la punta superior hacia abajo hasta el fondo",
      "Dobla por la mitad y crea alas anchas",
      "Punta de alas ligeramente hacia arriba para estabilidad",
    ],
  },
  {
    id: "stunt",
    nameEn: "Stunt Plane",
    nameEs: "Avión de acrobacias",
    descEn: "Loops and tricks with balanced folds.",
    descEs: "Bucles y trucos con pliegues equilibrados.",
    folds: 7,
    stepsEn: [
      "Fold in half lengthwise and open",
      "Fold top corners inward",
      "Fold top down once more",
      "Fold sides to center for body",
      "Fold in half",
      "Create smaller elevators on wings",
      "Test short throws for loops",
    ],
    stepsEs: [
      "Dobla por la mitad a lo largo y abre",
      "Dobla las esquinas superiores hacia adentro",
      "Dobla la parte superior hacia abajo una vez más",
      "Dobla los lados al centro para el cuerpo",
      "Dobla por la mitad",
      "Crea elevadores más pequeños en las alas",
      "Prueba lanzamientos cortos para bucles",
    ],
  },
];

export function PaperAirplaneKit({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [designId, setDesignId] = useState(DESIGNS[0].id);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [copied, setCopied] = useState(false);

  const design = DESIGNS.find((d) => d.id === designId) || DESIGNS[0];
  const steps = es ? design.stepsEs : design.stepsEn;
  const name = es ? design.nameEs : design.nameEn;
  const desc = es ? design.descEs : design.descEn;

  useEffect(() => {
    setChecked(new Array(steps.length).fill(false));
  }, [designId, steps.length]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("design");
    if (d && DESIGNS.some((dd) => dd.id === d)) setDesignId(d);
  }, []);

  const updateUrl = (newDesign?: string) => {
    const params = new URLSearchParams(window.location.search);
    if (newDesign) params.set("design", newDesign);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const progress = useMemo(() => {
    const done = checked.filter(Boolean).length;
    return { done, total: steps.length, pct: steps.length ? Math.round((done / steps.length) * 100) : 0 };
  }, [checked, steps.length]);

  const toggleStep = (i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const selectDesign = (id: string) => {
    setDesignId(id);
    updateUrl(id);
  };

  const copyLink = async () => {
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
    ctx.fillStyle = "#06b6d4";
    ctx.fillRect(0, 0, 8, 640);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 32px system-ui, sans-serif";
    ctx.fillText(name, 40, 70);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(es ? "Kit de avión de papel" : "Paper Airplane Kit", 40, 100);
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText(`${es ? "Progreso" : "Progress"}: ${progress.pct}% (${progress.done}/${progress.total})`, 40, 140);
    // simple plane silhouette
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(200, 280);
    ctx.lineTo(520, 320);
    ctx.lineTo(200, 360);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "14px system-ui, sans-serif";
    let y = 200;
    steps.forEach((step, i) => {
      const mark = checked[i] ? "✓" : "○";
      ctx.fillStyle = checked[i] ? "#22c55e" : "#cbd5e1";
      ctx.fillText(`${mark} ${i + 1}. ${step}`, 40, y);
      y += 22;
    });
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("utilihub.com", 40, 610);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `paper-airplane-${designId}.png`;
    a.click();
  };

  // CSS plane shape based on design and progress
  const wingWidth = design.id === "glider" ? 180 : design.id === "stunt" ? 140 : 100;
  const noseLength = design.id === "dart" ? 120 : 90;
  const completedRatio = progress.pct / 100;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="text-sm font-bold">{es ? "Diseño" : "Design"}</label>
        <select
          value={designId}
          onChange={(e) => selectDesign(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-3 text-base"
        >
          {DESIGNS.map((d) => (
            <option key={d.id} value={d.id}>
              {es ? d.nameEs : d.nameEn}
            </option>
          ))}
        </select>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{es ? "Progreso de pliegues" : "Fold progress"}</span>
          <span className="text-muted-foreground">
            {progress.done}/{progress.total} · {progress.pct}% · ~{design.folds} {es ? "pliegues" : "folds"}
          </span>
        </div>
        <div className="mt-2 h-3 w-full rounded-full bg-muted">
          <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${progress.pct}%` }} />
        </div>
      </div>

      {/* Live CSS preview */}
      <div className="flex justify-center py-6">
        <div
          className="relative transition-all duration-300"
          style={{
            width: `${wingWidth + noseLength}px`,
            height: "80px",
            opacity: 0.4 + completedRatio * 0.6,
            transform: `rotate(${design.id === "stunt" ? -8 : 0}deg) scale(${0.7 + completedRatio * 0.3})`,
          }}
          aria-hidden
        >
          {/* fuselage / nose */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-sky-400"
            style={{
              width: `${noseLength}px`,
              height: "16px",
              clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
            }}
          />
          {/* left wing */}
          <div
            className="absolute bg-sky-300"
            style={{
              left: `${noseLength - 20}px`,
              top: "0",
              width: `${wingWidth}px`,
              height: "40px",
              clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
              transform: "rotate(-12deg)",
            }}
          />
          {/* right wing */}
          <div
            className="absolute bg-sky-300"
            style={{
              left: `${noseLength - 20}px`,
              bottom: "0",
              width: `${wingWidth}px`,
              height: "40px",
              clipPath: "polygon(0 50%, 100% 100%, 100% 0)",
              transform: "rotate(12deg)",
            }}
          />
        </div>
      </div>

      <div>
        <h2 className="font-bold text-lg">{es ? "Pasos de plegado" : "Fold steps"}</h2>
        <div className="mt-3 space-y-3">
          {steps.map((step, i) => (
            <label key={i} className="flex items-start gap-4 rounded-xl border border-border p-4 cursor-pointer hover:bg-accent/50">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggleStep(i)}
                className="mt-0.5 size-5 shrink-0"
                aria-label={`${es ? "Paso" : "Step"} ${i + 1}`}
              />
              <span className={checked[i] ? "line-through text-muted-foreground" : ""}>
                <span className="font-medium">{i + 1}. </span>
                {step}
              </span>
            </label>
          ))}
        </div>
      </div>

      {progress.pct === 100 && (
        <div className="rounded-xl bg-primary/10 p-4 text-center font-bold text-primary">
          {es ? "¡Avión listo para volar!" : "Plane ready to fly!"}
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="button" onClick={copyLink} className="rounded-lg bg-secondary px-4 py-3 text-sm font-medium min-w-[120px]">
          {copied ? (es ? "¡Enlace copiado!" : "Link copied!") : es ? "Copiar enlace" : "Copy link"}
        </button>
        <button type="button" onClick={sharePng} className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground min-w-[140px]">
          {es ? "Descargar PNG" : "Download PNG"}
        </button>
      </div>
    </div>
  );
}
