import { useEffect, useMemo, useRef, useState } from "react";
import { buildQuery, parseAnswers, pickTop, type Answers } from "@/lib/tool-matchmaker/logic";
import { GOALS, OUTPUTS, STEP_TITLES, TIMES, type Choice, type Locale } from "@/lib/tool-matchmaker/taxonomy";

const T = {
  en: {
    step: "Step",
    of: "of",
    back: "Back",
    restart: "Start over",
    resultTitle: "Your best matches",
    resultLead: "Ranked for what you told us.",
    why: "Why this fits",
    open: "Open",
    reroll: "Try something different",
    your: "Your answers",
    announceStep: "Question",
    announceResult: "Showing your top three matches.",
    announceReroll: "Showing three different matches.",
    copy: "Copy link",
    copied: "Link copied",
    copyFail: "Could not copy. Copy the address bar link instead.",
    backAnn: "Back to question",
    png: "Download card",
    pngDone: "Card downloaded",
    cardTitle: "My best UtiliHub matches",
  },
  es: {
    step: "Paso",
    of: "de",
    back: "Atrás",
    restart: "Empezar de nuevo",
    resultTitle: "Tus mejores opciones",
    resultLead: "Ordenadas según lo que nos contaste.",
    why: "Por qué encaja",
    open: "Abrir",
    reroll: "Probar algo distinto",
    your: "Tus respuestas",
    announceStep: "Pregunta",
    announceResult: "Mostrando tus tres mejores opciones.",
    announceReroll: "Mostrando tres opciones distintas.",
    copy: "Copiar enlace",
    copied: "Enlace copiado",
    copyFail: "No se pudo copiar. Copia el enlace de la barra de direcciones.",
    backAnn: "Volviendo a la pregunta",
    png: "Descargar tarjeta",
    pngDone: "Tarjeta descargada",
    cardTitle: "Mis mejores opciones en UtiliHub",
  },
} as const;

const STEPS: { key: "g" | "t" | "o"; choices: Choice<string>[] }[] = [
  { key: "g", choices: GOALS },
  { key: "t", choices: TIMES },
  { key: "o", choices: OUTPUTS },
];

export function ToolMatchmaker({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [answers, setAnswers] = useState<Answers>({ g: null, t: null, o: null });
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(0);
  const [announce, setAnnounce] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ready = useRef(false);
  const interacted = useRef(false);

  useEffect(() => {
    const a = parseAnswers(window.location.search);
    setAnswers(a);
    setStep(a.g && a.t && a.o ? 3 : 0);
    ready.current = true;
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    window.history.replaceState(null, "", `${window.location.pathname}${step === 3 ? buildQuery(answers) : ""}`);
    if (interacted.current) headingRef.current?.focus();
  }, [step, answers]);

  const results = useMemo(() => (step === 3 ? pickTop(answers, locale, round) : []), [step, answers, locale, round]);

  const choose = (key: "g" | "t" | "o", id: string) => {
    interacted.current = true;
    const next = { ...answers, [key]: id } as Answers;
    setAnswers(next);
    setRound(0);
    const n = step + 1;
    setStep(n);
    setAnnounce(n === 3 ? t.announceResult : `${t.announceStep} ${n + 1}`);
  };

  const cur = STEPS[step];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}${buildQuery(answers)}`);
      setAnnounce(t.copied);
    } catch {
      setAnnounce(t.copyFail);
    }
  };

  const downloadCard = () => {
    const c = document.createElement("canvas");
    c.width = 1080;
    c.height = 1080;
    const x = c.getContext("2d");
    if (!x) return;
    x.fillStyle = "#0b1220";
    x.fillRect(0, 0, 1080, 1080);
    x.fillStyle = "#06b6d4";
    x.fillRect(0, 0, 1080, 14);
    x.textBaseline = "top";
    x.fillStyle = "#06b6d4";
    x.font = "700 34px system-ui, sans-serif";
    x.fillText("UtiliHub", 70, 70);
    x.fillStyle = "#ffffff";
    x.font = "800 56px system-ui, sans-serif";
    x.fillText(t.cardTitle, 70, 130, 940);
    x.fillStyle = "#94a3b8";
    x.font = "500 30px system-ui, sans-serif";
    x.fillText([labelOf(GOALS, answers.g), labelOf(TIMES, answers.t), labelOf(OUTPUTS, answers.o)].join("  ·  "), 70, 215, 940);
    const wrap = (text: string, y: number) => {
      const words = text.split(" ");
      let line = "";
      let yy = y;
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (x.measureText(test).width > 780 && line) { x.fillText(line, 190, yy); line = w; yy += 36; } else line = test;
      }
      x.fillText(line, 190, yy);
    };
    results.forEach((m, i) => {
      const y = 300 + i * 220;
      x.fillStyle = "#111b30";
      x.fillRect(70, y, 940, 190);
      x.fillStyle = "#06b6d4";
      x.beginPath();
      x.arc(130, y + 95, 36, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = "#06121a";
      x.font = "800 40px system-ui, sans-serif";
      x.textAlign = "center";
      x.fillText(String(i + 1), 130, y + 74);
      x.textAlign = "left";
      x.fillStyle = "#ffffff";
      x.font = "800 38px system-ui, sans-serif";
      x.fillText(m.name, 190, y + 28, 780);
      x.fillStyle = "#94a3b8";
      x.font = "500 26px system-ui, sans-serif";
      wrap(m.reason, y + 88);
    });
    x.fillStyle = "#64748b";
    x.font = "600 28px system-ui, sans-serif";
    x.fillText(locale === "es" ? "utilihub.net/es/encuentra-tu-herramienta" : "utilihub.net/find-your-tool", 70, 990);
    const a = document.createElement("a");
    a.download = "utilihub-matches.png";
    a.href = c.toDataURL("image/png");
    a.click();
    setAnnounce(t.pngDone);
  };

  const labelOf = (list: Choice<string>[], id: string | null) => {
    const c = list.find((x) => x.id === id);
    return c ? `${c.emoji} ${c[locale].label}` : "";
  };

  return (
    <div>
      <div className="sr-only" aria-live="polite" role="status" aria-atomic="true">{announce}</div>

      {cur ? (
        <section aria-labelledby="mm-q">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">
            {t.step} {step + 1} {t.of} 3
          </p>
          <div className="mt-2 flex gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-cyan-500" : "bg-muted"}`} />
            ))}
          </div>
          <h2 id="mm-q" ref={headingRef} tabIndex={-1} className="mt-4 text-2xl font-black tracking-tight outline-none">
            {STEP_TITLES[locale][step] ?? ""}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {cur.choices.map((c) => {
              const selected = answers[cur.key] === c.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => choose(cur.key, c.id)}
                    className="surface-card btn-press flex min-h-[72px] w-full items-center gap-3 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <span className="text-3xl" aria-hidden="true">{c.emoji}</span>
                    <span>
                      <span className="block font-bold">{c[locale].label}</span>
                      <span className="block text-sm text-muted-foreground">{c[locale].hint}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {step > 0 && (
            <button type="button" onClick={() => { interacted.current = true; setStep(step - 1); setAnnounce(`${t.backAnn} ${step}`); }} className="mt-5 text-sm font-semibold text-muted-foreground underline underline-offset-4">
              {t.back}
            </button>
          )}
        </section>
      ) : (
        <section aria-labelledby="mm-r">
          <h2 id="mm-r" ref={headingRef} tabIndex={-1} className="text-2xl font-black tracking-tight outline-none">
            {t.resultTitle}
          </h2>
          <p className="mt-1 text-muted-foreground">{t.resultLead}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="font-semibold">{t.your}:</span>{" "}
            {[labelOf(GOALS, answers.g), labelOf(TIMES, answers.t), labelOf(OUTPUTS, answers.o)].join(" · ")}
          </p>
          <ol className="mt-4 space-y-3">
            {results.map((m, i) => (
              <li key={m.target.id} className="surface-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-black text-cyan-500" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{m.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">{t.why}:</span> {m.reason}
                  </p>
                </div>
                <a href={m.path} className="btn-press motion-reduce:transform-none motion-reduce:transition-none inline-flex min-h-[44px] items-center justify-center rounded-xl bg-cyan-500 px-5 font-bold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500">
                  {t.open}
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => { setRound(round + 1); setAnnounce(t.announceReroll); }}
              className="btn-press min-h-[44px] motion-reduce:transform-none motion-reduce:transition-none rounded-xl border border-border px-4 font-semibold"
            >
              {t.reroll}
            </button>
            <button type="button" onClick={copyLink} className="btn-press min-h-[44px] motion-reduce:transform-none motion-reduce:transition-none rounded-xl border border-border px-4 font-semibold">
              {t.copy}
            </button>
            <button type="button" onClick={downloadCard} className="btn-press min-h-[44px] motion-reduce:transform-none motion-reduce:transition-none rounded-xl border border-border px-4 font-semibold">
              {t.png}
            </button>
            <button
              type="button"
              onClick={() => { interacted.current = true; setAnswers({ g: null, t: null, o: null }); setRound(0); setStep(0); }}
              className="min-h-[44px] px-2 text-sm font-semibold text-muted-foreground underline underline-offset-4"
            >
              {t.restart}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
