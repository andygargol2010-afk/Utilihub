import { useEffect, useMemo, useState } from "react";
import { type Locale } from "./AdsenseComplianceKit.part1";
import { type CheckId, CHECKS, readiness, PRESETS } from "./AdsenseComplianceKit.part2";

export function AdsenseComplianceKit({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [checked, setChecked] = useState<Record<CheckId, boolean>>(
    Object.fromEntries(CHECKS.map((c) => [c.id, false])) as Record<CheckId, boolean>,
  );
  const [copied, setCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const c = params.get("c");
    if (c && c.length === CHECKS.length) {
      const next: Record<CheckId, boolean> = { ...checked };
      CHECKS.forEach((ch, i) => {
        next[ch.id] = c[i] === "1";
      });
      setChecked(next);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const bits = CHECKS.map((ch) => (checked[ch.id] ? "1" : "0")).join("");
    const url = new URL(window.location.href);
    if (bits.includes("1")) url.searchParams.set("c", bits);
    else url.searchParams.delete("c");
    window.history.replaceState({}, "", url.toString());
  }, [checked]);

  const score = useMemo(() => {
    const totalWeight = CHECKS.reduce((s, c) => s + c.weight, 0);
    const got = CHECKS.reduce((s, c) => s + (checked[c.id] ? c.weight : 0), 0);
    return Math.round((got / totalWeight) * 100);
  }, [checked]);

  const level = useMemo(() => readiness(score, es), [score, es]);

  const missing = useMemo(
    () => CHECKS.filter((c) => !checked[c.id]),
    [checked],
  );

  const toggle = (id: CheckId) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const applyPreset = (ids: CheckId[]) => {
    const next = Object.fromEntries(CHECKS.map((c) => [c.id, false])) as Record<CheckId, boolean>;
    ids.forEach((id) => {
      next[id] = true;
    });
    setChecked(next);
  };

  const reset = () => {
    setChecked(Object.fromEntries(CHECKS.map((c) => [c.id, false])) as Record<CheckId, boolean>);
  };

  const generateCanvas = (): HTMLCanvasElement | null => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 680;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grd = ctx.createLinearGradient(0, 0, 800, 680);
    grd.addColorStop(0, "#0f172a");
    grd.addColorStop(1, "#1e293b");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 800, 680);

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, 0, 12, 680);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(es ? "Puntaje de Cumplimiento AdSense" : "AdSense Compliance Score", 40, 56);

    ctx.font = "bold 88px system-ui, sans-serif";
    ctx.fillStyle = level.color;
    ctx.textAlign = "center";
    ctx.fillText(`${score}`, 400, 175);
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("/ 100", 400, 205);

    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.fillStyle = level.color;
    ctx.fillText(level.label, 400, 240);

    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#e2e8f0";
    let y = 290;
    CHECKS.forEach((ch) => {
      const mark = checked[ch.id] ? "✓" : "○";
      const label = es ? ch.label.es : ch.label.en;
      ctx.fillText(`${mark}  ${label}`, 50, y);
      y += 26;
    });

    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("utilihub.app", 760, 650);

    return canvas;
  };

  const downloadPng = () => {
    const canvas = generateCanvas();
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "adsense-compliance-score.png";
    a.click();
  };

  const copyImage = async () => {
    const canvas = generateCanvas();
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch {
      /* ignore */
    }
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

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {es ? "Puntaje en vivo" : "Live score"}
            </p>
            <p className="text-5xl font-black tabular-nums">{score}</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: level.color }}>
              {level.label}
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {CHECKS.filter((c) => checked[c.id]).length} / {CHECKS.length} {es ? "ítems" : "items"}
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-muted-foreground self-center">
          {es ? "Presets:" : "Presets:"}
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.checks)}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium hover:bg-muted/40"
          >
            {es ? p.label.es : p.label.en}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {CHECKS.map((ch) => (
          <label
            key={ch.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 hover:bg-muted/40"
          >
            <input
              type="checkbox"
              checked={checked[ch.id]}
              onChange={() => toggle(ch.id)}
              className="mt-1 h-5 w-5 rounded border-border"
            />
            <div className="flex-1">
              <p className="font-semibold">{es ? ch.label.es : ch.label.en}</p>
              <p className="mt-1 text-sm text-muted-foreground">{es ? ch.tip.es : ch.tip.en}</p>
              {!checked[ch.id] && (
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  {es ? "Sugerencia: " : "Suggestion: "}
                  {es ? ch.suggestion.es : ch.suggestion.en}
                </p>
              )}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{ch.weight} pts</span>
          </label>
        ))}
      </div>

      {missing.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            {es ? "Próximos pasos sugeridos" : "Suggested next steps"}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-300">
            {missing.slice(0, 4).map((m) => (
              <li key={m.id}>{es ? m.suggestion.es : m.suggestion.en}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={downloadPng}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          {es ? "Descargar PNG del puntaje" : "Download score PNG"}
        </button>
        <button
          type="button"
          onClick={copyImage}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {imageCopied ? (es ? "¡Imagen copiada!" : "Image copied!") : es ? "Copiar imagen" : "Copy image"}
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {copied ? (es ? "¡Enlace copiado!" : "Link copied!") : es ? "Copiar enlace" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
