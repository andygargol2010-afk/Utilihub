import { useCallback, useEffect, useState } from "react";
import { type Locale } from "./ChoiceStoryJourney.part1";
import { decodePath, STAGES, ENDINGS, encodePath } from "./ChoiceStoryJourney.part2";

export function ChoiceStoryJourney({ locale }: { locale: Locale }) {
  const [path, setPath] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["start"];
    const params = new URLSearchParams(window.location.search);
    return decodePath(params.get("path"));
  });
  const [copied, setCopied] = useState(false);

  const currentId = path[path.length - 1];
  const isEnding = currentId.startsWith("end-");
  const stage = STAGES.find((s) => s.id === currentId);
  const ending = isEnding ? ENDINGS[currentId] : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("path", encodePath(path));
    window.history.replaceState({}, "", url.toString());
  }, [path]);

  const choose = useCallback((next: string) => {
    setPath((prev) => [...prev, next]);
  }, []);

  const goBack = useCallback(() => {
    setPath((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const reset = () => setPath(["start"]);

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
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const accent = ending?.accent || "#64748b";
    const grad = ctx.createLinearGradient(0, 0, 800, 500);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(0.6, "#1e293b");
    grad.addColorStop(1, accent + "33");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 500);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 8, 500);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 36px system-ui, sans-serif";
    const title = ending ? ending.title[locale] : "Choice Story Journey";
    ctx.fillText(title, 40, 90);
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    const sum = ending ? ending.summary[locale] : "Journey in progress";
    const words = sum.split(" ");
    let line = "";
    let y = 150;
    for (const w of words) {
      const test = line + w + " ";
      if (ctx.measureText(test).width > 700) {
        ctx.fillText(line, 40, y);
        line = w + " ";
        y += 28;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, 40, y);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`utilihub.com · ${path.slice(0, -1).join(" → ")}`, 40, 430);
    ctx.fillText("Share your choice path", 40, 460);
    const link = document.createElement("a");
    link.download = "choice-story-ending.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const progress = Math.min(path.length, 5);
  const stepLabels = locale === "es" 
    ? ["Inicio", "Elección 1", "Elección 2", "Elección 3", "Final"]
    : ["Start", "Choice 1", "Choice 2", "Choice 3", "Ending"];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex gap-1" role="progressbar" aria-valuenow={progress} aria-valuemin={1} aria-valuemax={5}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 text-center">
            <div
              className={`h-2 rounded ${
                i < progress - 1
                  ? "bg-primary"
                  : i === progress - 1
                  ? "bg-primary ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
                  : "bg-muted"
              }`}
            />
            <span className={`mt-1 block text-[10px] ${i === progress - 1 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              {stepLabels[i]}
            </span>
          </div>
        ))}
      </div>
      {stage && !isEnding && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-lg font-medium">{stage.text[locale]}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {stage.choices.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => choose(c.next)}
                className="min-h-11 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
                aria-label={c.text[locale]}
              >
                {c.text[locale]}
              </button>
            ))}
          </div>
          {path.length > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="mt-3 min-h-10 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground"
            >
              {locale === "es" ? "Volver" : "Back"}
            </button>
          )}
        </div>
      )}
      {ending && (
        <div 
          className="rounded-2xl border border-primary/30 bg-accent/40 p-5 text-center"
          style={{ borderColor: ending.accent + "55" }}
        >
          <div className="mx-auto mb-3 h-1 w-16 rounded-full" style={{ background: ending.accent }} />
          <h2 className="text-2xl font-black">{ending.title[locale]}</h2>
          <p className="mt-2 text-muted-foreground">{ending.summary[locale]}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {locale === "es" ? "Camino" : "Path"}: {path.slice(0, -1).join(" → ")}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={sharePng}
              className="min-h-11 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              {locale === "es" ? "Compartir PNG" : "Share PNG"}
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="min-h-11 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold"
            >
              {copied
                ? locale === "es" ? "¡Copiado!" : "Copied!"
                : locale === "es" ? "Copiar enlace" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={goBack}
              className="min-h-11 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold"
            >
              {locale === "es" ? "Volver" : "Back"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="min-h-11 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold"
            >
              {locale === "es" ? "Empezar de nuevo" : "Start over"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
