import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { generateEducationTest, type EducationDifficulty, type EducationLevel } from "@/lib/general/education-engine";
import { useDailyStreak } from "@/hooks/use-daily-streak";

type EducationMode = "practice" | "exam" | "review";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function EducationTool({ tool }: { tool: GeneralTool }) {
  const [level, setLevel] = useState<EducationLevel>("secundaria");
  const [difficulty, setDifficulty] = useState<EducationDifficulty>("media");
  const [count, setCount] = useState("10");
  const [mode, setMode] = useState<EducationMode>("practice");
  const [randomize, setRandomize] = useState(true);
  const [challenge, setChallenge] = useState(false);
  const [timeMode, setTimeMode] = useState<"global" | "question">("global");
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
  const { streak, recordActivity } = useDailyStreak();
  const subject = String(tool.config?.subject ?? "");
  const topic = String(tool.config?.topic ?? "").replaceAll("-", " ");
  const title = useMemo(() => `${subject} · ${topic}`, [subject, topic]);

  const generate = () => {
    const requested = clamp(Number.parseInt(count, 10) || 10, 1, 50);
    const requestedSeconds = clamp(Number.parseInt(seconds, 10) || 60, 5, 3600);
    const base = generateEducationTest(String(tool.config?.topic ?? ""), level, difficulty, requested);
    const next = randomize ? [...base].sort(() => Math.random() - 0.5) : base;

    setCount(String(requested));
    setSeconds(String(requestedSeconds));
    setGenerated(next);
    setSubmitted({});
    setCurrent(0);
    setCompleted(false);
    setTimedOut(false);
    setElapsedSeconds(0);
    startedAtRef.current = Date.now();
    deadlineRef.current = challenge ? Date.now() + requestedSeconds * 1000 : null;
    setRemaining(challenge ? requestedSeconds : 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finish = (timeout = false) => {
    if (completed || !generated.length) return;
    const started = startedAtRef.current;
    const elapsed = started ? Math.max(1, Math.round((Date.now() - started) / 1000)) : 0;
    setElapsedSeconds(elapsed);
    setTimedOut(timeout);
    setCompleted(true);
    deadlineRef.current = null;
    recordActivity();
  };

  useEffect(() => {
    if (!challenge || !generated.length || completed || !deadlineRef.current) return;
    const interval = window.setInterval(() => {
      const deadline = deadlineRef.current;
      if (!deadline) return;
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) finish(true);
    }, 250);
    return () => window.clearInterval(interval);
  }, [challenge, generated.length, completed]);

  useEffect(() => {
    if (!challenge || timeMode !== "question" || !generated.length || completed || !deadlineRef.current) return;
    const limit = clamp(Number.parseInt(seconds, 10) || 60, 5, 3600);
    deadlineRef.current = Date.now() + limit * 1000;
    setRemaining(limit);
  }, [current, timeMode, challenge, generated.length, completed, seconds]);

  const score = generated.reduce((total, question, index) => total + (submitted[index] === question.answer ? 1 : 0), 0);
  const answered = Object.keys(submitted).filter((key) => submitted[Number(key)] >= 0).length;
  const progress = generated.length ? Math.round((completed ? 100 : ((current + (submitted[current] !== undefined ? 1 : 0)) / generated.length) * 100)) : 0;
  const question = generated[current];
  const speed = elapsedSeconds > 0 ? Math.round((answered / elapsedSeconds) * 60) : 0;
  const percentage = generated.length ? Math.round((score / generated.length) * 100) : 0;
  const canGoBack = mode !== "exam" && current > 0;

  return <div className="space-y-5">
    <div className="rounded-xl border bg-muted/30 p-4">
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">Configura nivel, dificultad, cantidad y modo. Las preguntas se generan localmente y el resultado se mantiene en esta sesión.</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="space-y-1"><span className="text-sm font-medium">Nivel educativo</span><select name="nivel" data-share-param="nivel" value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)} className="h-11 w-full rounded-xl border bg-background px-3"><option value="primaria">Primaria</option><option value="secundaria">Secundaria</option><option value="universidad">Universidad</option></select></label>
      <label className="space-y-1"><span className="text-sm font-medium">Dificultad</span><select name="dificultad" data-share-param="dificultad" value={difficulty} onChange={(e) => setDifficulty(e.target.value as EducationDifficulty)} className="h-11 w-full rounded-xl border bg-background px-3"><option value="facil">Fácil</option><option value="media">Media</option><option value="dificil">Difícil</option></select></label>
      <label className="space-y-1"><span className="text-sm font-medium">Cantidad</span><input name="cantidad" data-share-param="cantidad" type="number" min="1" max="50" value={count} onChange={(e) => setCount(e.target.value)} onBlur={() => setCount(String(clamp(Number.parseInt(count, 10) || 10, 1, 50)))} className="h-11 w-full rounded-xl border bg-background px-3" /></label>
      <label className="space-y-1"><span className="text-sm font-medium">Modo</span><select name="modo" data-share-param="modo" value={mode} onChange={(e) => setMode(e.target.value as EducationMode)} className="h-11 w-full rounded-xl border bg-background px-3"><option value="practice">Práctica</option><option value="exam">Examen</option><option value="review">Repaso</option></select></label>
    </div>

    <div className="rounded-xl border p-4 space-y-4">
      <label className="flex items-center gap-3"><input type="checkbox" checked={randomize} onChange={(e) => setRandomize(e.target.checked)} /><span className="font-semibold">Preguntas aleatorias</span></label>
      <label className="flex items-center gap-3"><input type="checkbox" checked={challenge} onChange={(e) => setChallenge(e.target.checked)} /><span className="font-semibold">Modo desafío contrarreloj</span></label>
      {challenge && <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1"><span className="text-sm font-medium">Tiempo</span><select name="modo-tiempo" data-share-param="modo-tiempo" value={timeMode} onChange={(e) => setTimeMode(e.target.value as "global" | "question")} className="h-11 w-full rounded-xl border bg-background px-3"><option value="global">Por test</option><option value="question">Por pregunta</option></select></label><label className="space-y-1"><span className="text-sm font-medium">Segundos</span><input name="segundos" data-share-param="segundos" type="number" min="5" max="3600" value={seconds} onChange={(e) => setSeconds(e.target.value)} onBlur={() => setSeconds(String(clamp(Number.parseInt(seconds, 10) || 60, 5, 3600)))} className="h-11 w-full rounded-xl border bg-background px-3" /></label></div>}
      <p className="text-xs text-muted-foreground">Práctica permite volver a preguntas anteriores. Examen bloquea retrocesos para simular una evaluación. Repaso muestra las respuestas y correcciones sin presión de tiempo.</p>
    </div>

    <button type="button" onClick={generate} className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground">{mode === "review" ? "Generar repaso" : mode === "exam" ? "Comenzar examen" : "Generar práctica"}</button>

    {generated.length > 0 && mode === "review" && !completed && <ReviewMode questions={generated} submitted={submitted} setSubmitted={setSubmitted} onFinish={() => finish(false)} />}

    {generated.length > 0 && mode !== "review" && <div className="space-y-4 rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold">{mode === "exam" ? "Examen" : "Práctica"}</h3><p className="text-sm text-muted-foreground">Pregunta {Math.min(current + 1, generated.length)} de {generated.length} · {answered} respondidas</p></div><div className="text-right"><span className="text-sm font-semibold">{progress}%</span>{challenge && !completed && <p className="text-xs font-bold text-primary">⏱ {remaining}s</p>}<p className="text-xs text-muted-foreground">🔥 {streak} días de racha</p></div></div>
      <div className="h-2 overflow-hidden rounded-full bg-muted" aria-label="Progreso del test"><div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} /></div>
      {!completed && question && <fieldset className="rounded-xl border p-4"><legend className="px-1 text-sm font-bold">Pregunta {current + 1}</legend><p className="mb-3">{question.text}</p><div className="space-y-2">{question.options.map((option, index) => <label key={`${index}-${option}`} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 has-[:checked]:border-primary"><input type="radio" name={`question-${current}`} checked={submitted[current] === index} onChange={() => setSubmitted((state) => ({ ...state, [current]: index }))} /><span>{option}</span></label>)}</div><div className="mt-4 flex justify-between gap-2"><button type="button" disabled={!canGoBack} onClick={() => setCurrent((index) => Math.max(0, index - 1))} className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40">Anterior</button>{current < generated.length - 1 ? <button type="button" onClick={() => setCurrent((index) => index + 1)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Siguiente</button> : <button type="button" disabled={answered < generated.length} onClick={() => finish(false)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40">Finalizar test</button>}</div></fieldset>}
      {completed && <div className="rounded-xl bg-muted/40 p-5 text-center" role="status"><p className="text-2xl font-black">{score}/{generated.length}</p><p className="mt-1 font-semibold">{percentage}% · {percentage >= 90 ? "Excelente resultado" : percentage >= 70 ? "Buen resultado" : "Sigue practicando"}</p><p className="mt-2 text-sm text-muted-foreground">{challenge ? `Velocidad: ${speed} respuestas por minuto · Tiempo real: ${elapsedSeconds}s${timedOut ? " · Tiempo agotado" : ""}.` : "Puedes revisar las respuestas o generar otro test."}</p><p className="mt-2 text-sm font-semibold">🔥 {streak} días de racha</p><div className="mt-4 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => { setMode("review"); setCompleted(false); }} className="rounded-lg border px-4 py-2 text-sm font-semibold">Revisar respuestas</button><button type="button" onClick={generate} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Nuevo test</button></div></div>}
    </div>}
  </div>;
}

function ReviewMode({ questions, submitted, setSubmitted, onFinish }: { questions: ReturnType<typeof generateEducationTest>; submitted: Record<number, number>; setSubmitted: Dispatch<SetStateAction<Record<number, number>>>; onFinish: () => void }) {
  return <div className="space-y-4 rounded-xl border p-4"><div><h3 className="font-bold">Repaso y corrección</h3><p className="text-sm text-muted-foreground">Responde cada pregunta y comprueba inmediatamente la respuesta correcta.</p></div>{questions.map((question, index) => { const answer = submitted[index]; const checked = answer !== undefined; const correct = answer === question.answer; return <fieldset key={`${index}-${question.text}`} className="rounded-xl border p-4"><legend className="px-1 text-sm font-bold">Pregunta {index + 1}</legend><p className="mb-3">{question.text}</p><div className="space-y-2">{question.options.map((option, optionIndex) => <label key={`${optionIndex}-${option}`} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3"><input type="radio" name={`review-${index}`} checked={answer === optionIndex} onChange={() => setSubmitted((state) => ({ ...state, [index]: optionIndex }))} /><span>{option}</span></label>)}</div>{checked && <p className={`mt-3 rounded-lg p-3 text-sm ${correct ? "bg-emerald-500/10" : "bg-destructive/10"}`} role="status">{correct ? "✓ Correcta" : `✗ Incorrecta. Respuesta correcta: ${question.options[question.answer]}`}</p>}</fieldset>; })}<button type="button" onClick={onFinish} className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground">Terminar repaso</button></div>;
}
