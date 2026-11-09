import { useEffect, useMemo, useState } from "react";
import { type Locale } from "./PaperAirplaneKit.part1";
import { DESIGNS } from "./PaperAirplaneKit.part2";

export function PaperAirplaneKit({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const pt = locale === "pt";
  const [designId, setDesignId] = useState(DESIGNS[0].id);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [copied, setCopied] = useState(false);
  const [challenge, setChallenge] = useState<"distance" | "stunt" | "none">("none");

  const design = DESIGNS.find((d) => d.id === designId) || DESIGNS[0];
  const steps = pt ? design.stepsPt : es ? design.stepsEs : design.stepsEn;
  const name = pt ? design.namePt : es ? design.nameEs : design.nameEn;
  const desc = pt ? design.descPt : es ? design.descEs : design.descEn;

  useEffect(() => {
    setChecked(new Array(steps.length).fill(false));
  }, [designId, steps.length]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("design");
    if (d && DESIGNS.some((dd) => dd.id === d)) setDesignId(d);
    const ch = params.get("challenge");
    if (ch === "distance" || ch === "stunt") setChallenge(ch);
  }, []);

  const updateUrl = (newDesign?: string, newChallenge?: string) => {
    const params = new URLSearchParams(window.location.search);
    if (newDesign) params.set("design", newDesign);
    if (newChallenge) params.set("challenge", newChallenge);
    else if (newChallenge === "") params.delete("challenge");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const progress = useMemo(() => {
    const done = checked.filter(Boolean).length;
    return { done, total: steps.length, pct: steps.length ? Math.round((done / steps.length) * 100) : 0 };
  }, [checked, steps.length]);

  const nextStepIndex = useMemo(() => checked.findIndex((c) => !c), [checked]);

  const challengeScore = useMemo(() => {
    if (challenge === "none" || progress.pct < 100) return 0;
    const base = challenge === "distance" ? design.distanceScore : design.stuntScore;
    return Math.round(base * (progress.pct / 100));
  }, [challenge, progress.pct, design]);

  const toggleStep = (i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const resetSteps = () => {
    setChecked(new Array(steps.length).fill(false));
  };

  const selectDesign = (id: string) => {
    setDesignId(id);
    updateUrl(id);
  };

  const selectChallenge = (ch: "distance" | "stunt" | "none") => {
    setChallenge(ch);
    updateUrl(undefined, ch === "none" ? "" : ch);
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
    ctx.fillText(pt ? "Kit de avião de papel" : es ? "Kit de avión de papel" : "Paper Airplane Kit", 40, 100);
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText(`${pt ? "Progresso" : es ? "Progreso" : "Progress"}: ${progress.pct}% (${progress.done}/${progress.total})`, 40, 140);
    if (challenge !== "none" && progress.pct === 100) {
      ctx.fillText(`${pt ? "Desafio" : es ? "Reto" : "Challenge"}: ${challenge === "distance" ? (pt ? "Distância" : es ? "Distancia" : "Distance") : (pt ? "Acrobacia" : es ? "Acrobacia" : "Stunt")} · ${challengeScore}`, 40, 170);
    }
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
    let y = challenge !== "none" ? 210 : 200;
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
  const wingWidth = design.id === "glider" ? 180 : design.id === "delta" ? 160 : design.id === "stunt" ? 140 : 100;
  const noseLength = design.id === "dart" ? 120 : design.id === "delta" ? 100 : 90;
  const completedRatio = progress.pct / 100;

  const safetyTips = pt
    ? [
        "Use papel leve (carta ou A4) e dobre com cuidado para não rasgar.",
        "Não lance em direção a pessoas, janelas ou tetos.",
        "Teste em espaços abertos e seguros.",
        "Supervise crianças pequenas durante a dobragem e o lançamento.",
      ]
    : es
    ? [
        "Usa papel ligero (carta o A4) y pliega con cuidado para no rasgar.",
        "No lances hacia personas, ventanas o techos.",
        "Prueba en espacios abiertos y seguros.",
        "Supervisa a niños pequeños durante el plegado y el lanzamiento.",
      ]
    : [
        "Use light paper (letter or A4) and fold carefully to avoid tearing.",
        "Do not throw toward people, windows, or ceilings.",
        "Test in open, safe outdoor spaces.",
        "Supervise young children during folding and launching.",
      ];

  const materials = pt
    ? ["1 folha de papel carta ou A4", "Superfície plana para dobrar", "Espaço aberto para testar (opcional)"]
    : es
    ? ["1 hoja de papel carta o A4", "Superficie plana para plegar", "Espacio abierto para probar (opcional)"]
    : ["1 sheet of letter or A4 paper", "Flat surface for folding", "Open space to test (optional)"];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="design-select" className="text-sm font-bold">{pt ? "Design" : es ? "Diseño" : "Design"}</label>
        <select
          id="design-select"
          value={designId}
          onChange={(e) => selectDesign(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-3 text-base min-h-[48px]"
          aria-describedby="design-desc"
        >
          {DESIGNS.map((d) => (
            <option key={d.id} value={d.id}>
              {pt ? d.namePt : es ? d.nameEs : d.nameEn}
            </option>
          ))}
        </select>
        <p id="design-desc" className="mt-1 text-sm text-muted-foreground">{desc}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {pt ? `Tempo estimado: ~${design.timeMin} min` : es ? `Tiempo estimado: ~${design.timeMin} min` : `Estimated time: ~${design.timeMin} min`}
        </p>
      </div>

      {/* Materials */}
      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <h3 className="font-bold text-sm">{pt ? "Materiais" : es ? "Materiales" : "Materials"}</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
          {materials.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-4" aria-live="polite">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{pt ? "Progresso de dobras" : es ? "Progreso de pliegues" : "Fold progress"}</span>
          <span className="text-muted-foreground">
            {progress.done}/{progress.total} · {progress.pct}% · ~{design.folds} {pt ? "dobras" : es ? "pliegues" : "folds"}
          </span>
        </div>
        <div className="mt-2 h-3 w-full rounded-full bg-muted" role="progressbar" aria-valuenow={progress.pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${progress.pct}%` }} />
        </div>
        {nextStepIndex >= 0 && (
          <p className="mt-2 text-xs text-primary font-medium">
            {pt ? `Próximo passo: ${nextStepIndex + 1}` : es ? `Siguiente paso: ${nextStepIndex + 1}` : `Next step: ${nextStepIndex + 1}`}
          </p>
        )}
      </div>

      {/* Challenge mode */}
      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <label className="text-sm font-bold">{pt ? "Modo desafio (opcional)" : es ? "Modo reto (opcional)" : "Challenge mode (optional)"}</label>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={pt ? "Modo de desafio" : es ? "Modo de reto" : "Challenge mode"}>
          {(["none", "distance", "stunt"] as const).map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => selectChallenge(ch)}
              className={`rounded-lg px-4 py-3 text-sm font-medium border min-h-[44px] ${
                challenge === ch ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border"
              }`}
              aria-pressed={challenge === ch}
            >
              {ch === "none" ? (pt ? "Nenhum" : es ? "Ninguno" : "None") : ch === "distance" ? (pt ? "Distância" : es ? "Distancia" : "Distance") : (pt ? "Acrobacia" : es ? "Acrobacia" : "Stunt")}
            </button>
          ))}
        </div>
        {challenge !== "none" && (
          <p className="mt-2 text-sm text-muted-foreground">
            {pt
              ? `Complete todos os passos para ver sua pontuação de ${challenge === "distance" ? "distância" : "acrobacia"}.`
              : es
              ? `Completa todos los pasos para ver tu puntuación de ${challenge === "distance" ? "distancia" : "acrobacia"}.`
              : `Complete all steps to see your ${challenge} score.`}
          </p>
        )}
        {challenge !== "none" && progress.pct === 100 && (
          <div className="mt-3 rounded-lg bg-primary/10 p-3 text-center font-bold text-primary" aria-live="polite">
            {pt ? "Pontuação do desafio" : es ? "Puntuación del reto" : "Challenge score"}: {challengeScore} / 100
          </div>
        )}
      </div>

      {/* Live CSS preview - mobile friendly */}
      <div className="flex justify-center py-6 overflow-hidden">
        <div
          className="relative transition-all duration-300 max-w-full"
          style={{
            width: `${Math.min(wingWidth + noseLength, 280)}px`,
            height: "80px",
            opacity: 0.4 + completedRatio * 0.6,
            transform: `rotate(${design.id === "stunt" ? -8 : 0}deg) scale(${0.7 + completedRatio * 0.3})`,
          }}
          role="img"
          aria-label={pt ? `Prévia do avião ${name}, progresso ${progress.pct}%` : es ? `Vista previa del avión ${name}, progreso ${progress.pct}%` : `Preview of ${name} airplane, progress ${progress.pct}%`}
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
          {/* simple tail */}
          <div
            className="absolute bg-sky-500"
            style={{
              left: `${noseLength + wingWidth * 0.3}px`,
              top: "28px",
              width: "24px",
              height: "24px",
              clipPath: "polygon(0 0, 100% 50%, 0 100%)",
            }}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">{pt ? "Passos de dobragem" : es ? "Pasos de plegado" : "Fold steps"}</h2>
          <button
            type="button"
            onClick={resetSteps}
            className="text-xs text-muted-foreground underline hover:text-foreground min-h-[44px] px-2"
          >
            {pt ? "Reiniciar passos" : es ? "Reiniciar pasos" : "Reset steps"}
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {pt ? "Marque cada passo ao completá-lo. O próximo passo é destacado." : es ? "Marca cada paso al completarlo. El siguiente paso se resalta." : "Check off each step as you complete it. The next step is highlighted."}
        </p>
        <div className="mt-3 space-y-3" role="list">
          {steps.map((step, i) => (
            <label
              key={i}
              role="listitem"
              className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer hover:bg-accent/50 min-h-[60px] ${
                nextStepIndex === i ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
              }`}
            >
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggleStep(i)}
                className="mt-0.5 size-5 shrink-0"
                aria-label={`${pt ? "Passo" : es ? "Paso" : "Step"} ${i + 1}: ${step}`}
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
        <div className="rounded-xl bg-primary/10 p-4 text-center font-bold text-primary" aria-live="assertive">
          {pt ? "Avião pronto para voar!" : es ? "¡Avión listo para volar!" : "Plane ready to fly!"}
        </div>
      )}

      {/* Safety tips */}
      <div className="rounded-2xl border border-border bg-card/50 p-4">
        <h3 className="font-bold text-sm">{pt ? "Dicas de segurança" : es ? "Consejos de seguridad" : "Safety tips"}</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
          {safetyTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="button" onClick={copyLink} className="rounded-lg bg-secondary px-4 py-3 text-sm font-medium min-w-[120px] min-h-[48px]">
          {copied ? (pt ? "Link copiado!" : es ? "¡Enlace copiado!" : "Link copied!") : pt ? "Copiar link" : es ? "Copiar enlace" : "Copy link"}
        </button>
        <button type="button" onClick={sharePng} className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground min-w-[140px] min-h-[48px]">
          {pt ? "Baixar PNG" : es ? "Descargar PNG" : "Download PNG"}
        </button>
      </div>
    </div>
  );
}
