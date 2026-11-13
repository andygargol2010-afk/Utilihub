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

  useEffect(() => {
    const a = parseAnswers(window.location.search);
    setAnswers(a);
    setStep(a.g && a.t && a.o ? 3 : 0);
    ready.current = true;
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    window.history.replaceState(null, "", `${window.location.pathname}${step === 3 ? buildQuery(answers) : ""}`);
    headingRef.current?.focus();
  }, [step, answers]);

  const results = useMemo(() => (step === 3 ? pickTop(answers, locale, round) : []), [step, answers, locale, round]);

  const choose = (key: "g" | "t" | "o", id: string) => {
    const next = { ...answers, [key]: id } as Answers;
    setAnswers(next);
    setRound(0);
    const n = step + 1;
    setStep(n);
    setAnnounce(n === 3 ? t.announceResult : `${t.announceStep} ${n + 1}`);
  };

  const cur = STEPS[step];

  const labelOf = (list: Choice<string>[], id: string | null) => {
    const c = list.find((x) => x.id === id);
    return c ? `${c.emoji} ${c[locale].label}` : "";
  };

  return (
    <div>
      <div className="sr-only" aria-live="polite" role="status">{announce}</div>

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
            <button type="button" onClick={() => setStep(step - 1)} className="mt-5 text-sm font-semibold text-muted-foreground underline underline-offset-4">
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
                <a href={m.path} className="btn-press inline-flex min-h-[44px] items-center justify-center rounded-xl bg-cyan-500 px-5 font-bold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500">
                  {t.open}
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => { setRound(round + 1); setAnnounce(t.announceReroll); }}
              className="btn-press min-h-[44px] rounded-xl border border-border px-4 font-semibold"
            >
              {t.reroll}
            </button>
            <button
              type="button"
              onClick={() => { setAnswers({ g: null, t: null, o: null }); setRound(0); setStep(0); }}
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
