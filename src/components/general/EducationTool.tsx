import { useEffect, useMemo, useRef, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { generateEducationTest, type EducationDifficulty, type EducationLevel } from "@/lib/general/education-engine";
import { useDailyStreak } from "@/hooks/use-daily-streak";

export function EducationTool({ tool }: { tool: GeneralTool }) {
  const [level, setLevel] = useState<EducationLevel>("secundaria");
  const [difficulty, setDifficulty] = useState<EducationDifficulty>("media");
  const [count, setCount] = useState("10");
  const [challenge, setChallenge] = useState(false);
  const [mode, setMode] = useState<"global" | "question">("global");
  const [seconds, setSeconds] = useState("60");
  const [generated, setGenerated] = useState<ReturnType<typeof generateEducationTest>>([]);
  const [submitted, setSubmitted] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const deadlineRef = useRef<number | null>(null);
  const questionDeadlinesRef = useRef<Record<number, number>>({});
  const { streak, recordActivity } = useDailyStreak();
  const subject = String(tool.config?.subject ?? "");
  const topic = String(tool.config?.topic ?? "").replaceAll("-", " ");
  const title = useMemo(() => `${subject} · ${topic}`, [subject, topic]);

  const getLimit = () => Math.max(5, Math.min(3600, Number(seconds) || 60));

  const generate = () => {
    const next = generateEducationTest(String(tool.config?.topic ?? ""), level, difficulty, Number(count));
    const limit = getLimit();
    setGenerated(next);
    setSubmitted({});
    setCurrent(0);
    setCompleted(false);
    setTimedOut(false);
    setElapsedSeconds(0);
    startedAtRef.current = Date.now();
    questionDeadlinesRef.current = {};
    deadlineRef.current = challenge && mode === "global" ? Date.now() + limit * 1000 : null;
    if (challenge && mode === "question" && next.length > 0) {
      questionDeadlinesRef.current[0] = Date.now() + limit * 1000;
    }
    setRemaining(challenge ? limit : 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finish = (timeout = false) => {
    if (completed) return;
    const started = startedAtRef.current;
    const elapsed = started ? Math.max(1, Math.round((Date.now() - started) / 1000)) : 0;
    setElapsedSeconds(elapsed);
    setTimedOut(timeout);
    setCompleted(true);
    deadlineRef.current = null;
    questionDeadlinesRef.current = {};
    recordActivity();
  };

  useEffect(() => {
    if (!challenge || !generated.length || completed) return;
    const interval = window.setInterval(() => {
      if (mode === "global") {
        const deadline = deadlineRef.current;
        if (!deadline) return;
        const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        setRemaining(next);
        if (next === 0) finish(true);
        return;
      }

      let deadline = questionDeadlinesRef.current[current];
      if (!deadline) {
        deadline = Date.now() + getLimit() * 1000;
        questionDeadlinesRef.current[current] = deadline;
      }
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) finish(true);
    }, 250);
    return () => window.clearInterval(interval);
  }, [challenge, generated.length, completed, mode, current]);

  const score = generated.reduce((n, q, i) => n + (submitted[i] === q.answer ? 1 : 0), 0);
  const answered = Object.keys(submitted).filter((key) => submitted[Number(key)] >= 0).length;
  const progress = generated.length ? Math.round((completed ? 100 : (answered / generated.length) * 100)) : 0;
  const question = generated[current];
  const speed = elapsedSeconds > 0 ? Math.round((answered / elapsedSeconds) * 60) : 0;

  return <div className="space-y-5">
    <div className="rounded-xl border bg-muted/30 p-4"><p className="font-semibold">{title}</p><p className="text-sm text-muted-foreground">Configura el nivel, dificultad y cantidad. UtiliHub genera automáticamente el test.</p></div>
    <div className="grid gap-4 sm:grid-cols-3">
      <label className="space-y-1"><span className="text-sm font-medium">Nivel educativo</span><select name="nivel" data-share-param="nivel" value={level} onChange={e => setLevel(e.target.value as EducationLevel)} className="h-11 w-full rounded-xl border bg-background px-3"><option value="primaria">Primaria</option><option value="secundaria">Secundaria</option><option value="universidad">Universidad</option></select></label>
      <label className="space-y-1"><span className="text-sm font-medium">Dificultad</span><select name="dificultad" data-share-param="dificultad" value={difficulty} onChange={e => setDifficulty(e.target.value as EducationDifficulty)} className="h-11 w-full rounded-xl border bg-background px-3"><option value="facil">Fácil</option><option value="media">Media</option><option value="dificil">Difícil</option></select></label>
      <label className="space-y-1"><span className="text-sm font-medium">Cantidad de preguntas</span><input name="cantidad" data-share-param="cantidad" type="number" min="1" max="50" value={count} onChange={e => setCount(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3" /></label>
    </div>
    <div className="rounded-xl border p-4 space-y-4"><label className="flex items-center gap-3"><input type="checkbox" checked={challenge} onChange={e => setChallenge(e.target.checked)} /><span className="font-semibold">Modo desafío contrarreloj</span></label>{challenge && <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1"><span className="text-sm font-medium">Tiempo</span><select name="modo-tiempo" data-share-param="modo-tiempo" value={mode} onChange={e => setMode(e.target.value as "global" | "question")} className="h-11 w-full rounded-xl border bg-background px-3"><option value="global">Por test</option><option value="question">Por pregunta</option></select></label><label className="space-y-1"><span className="text-sm font-medium">Segundos</span><input name="segundos" data-share-param="segundos" type="number" min="5" max="3600" value={seconds} onChange={e => setSeconds(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3" /></label></div>}</div>
    <button onClick={generate} className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground">Generar test</button>
    {generated.length > 0 && <div className="space-y-4 rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold">Test generado</h3><p className="text-sm text-muted-foreground">Pregunta {Math.min(current + 1, generated.length)} de {generated.length} · {answered} respondidas</p></div><div className="text-right"><span className="text-sm font-semibold">{progress}%</span>{challenge && !completed && <p className="text-xs font-bold text-primary">⏱ {remaining}s</p>}<p className="text-xs text-muted-foreground">🔥 {streak} días de racha</p></div></div>
      <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} /></div>
      {!completed && question && <fieldset className="rounded-xl border p-4"><legend className="px-1 text-sm font-bold">Pregunta {current + 1}</legend><p className="mb-3">{question.text}</p><div className="space-y-2">{question.options.map((option, j) => <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3"><input type="radio" name={`question-${current}`} checked={submitted[current] === j} onChange={() => setSubmitted(s => ({ ...s, [current]: j }))} /><span>{option}</span></label>)}</div><div className="mt-4 flex justify-between gap-2"><button type="button" disabled={current === 0} onClick={() => setCurrent(i => Math.max(0, i - 1))} className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40">Anterior</button>{current < generated.length - 1 ? <button type="button" onClick={() => setCurrent(i => i + 1)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Siguiente</button> : <button type="button" onClick={() => finish(false)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Finalizar test</button>}</div></fieldset>}
      {completed && <div className="rounded-xl bg-muted/40 p-5 text-center"><p className="text-2xl font-black">{score}/{generated.length}</p><p className="mt-1 font-semibold">Test finalizado</p><p className="mt-2 text-sm text-muted-foreground">{challenge ? `Velocidad: ${speed} respuestas por minuto · Tiempo real: ${elapsedSeconds}s${timedOut ? " · Tiempo agotado" : ""}.` : "Puedes generar otro test cuando quieras."}</p><p className="mt-2 text-sm font-semibold">🔥 {streak} días de racha</p></div>}
    </div>}
  </div>;
}
