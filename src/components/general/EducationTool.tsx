import { useEffect, useMemo, useRef, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { EDUCATION_SUBJECTS, educationTopicTitle } from "@/lib/general/education";
import {
  generateEducationTest,
  type EducationDifficulty,
  type EducationLevel,
  type GeneratedQuestion,
} from "@/lib/general/education-engine";
import { useDailyStreak } from "@/hooks/use-daily-streak";

const LEVELS: Array<[EducationLevel, string]> = [
  ["primaria", "Primary"],
  ["secundaria", "Secondary"],
  ["universidad", "University"],
];
const DIFFICULTIES: Array<[EducationDifficulty, string]> = [
  ["facil", "Easy"],
  ["media", "Medium"],
  ["dificil", "Hard"],
];
const ES_LEVELS: Record<string, string> = { Primary: "Primaria", Secondary: "Secundaria", University: "Universidad" };
const ES_DIFFICULTIES: Record<string, string> = { Easy: "Fácil", Medium: "Media", Hard: "Difícil" };

/** Map tool config topic → question-bank key (subject-aware for collisions like energia). */
function resolveBankTopic(subjectSlug: string, topicSlug: string): string {
  if (subjectSlug === "fisica" && topicSlug === "energia") return "energia-fisica";
  if (subjectSlug === "ciencias-naturales" && topicSlug === "energia") return "energia-naturales";
  return topicSlug;
}

function subjectDisplayName(subjectSlug: string, locale: "en" | "es"): string {
  const row = EDUCATION_SUBJECTS.find(([slug]) => slug === subjectSlug);
  if (!row) return educationTopicTitle(subjectSlug);
  if (locale === "es") {
    const esNames: Record<string, string> = {
      matematicas: "Matemáticas",
      lengua: "Lengua y literatura",
      fisica: "Física",
      quimica: "Química",
      biologia: "Biología",
      historia: "Historia",
      geografia: "Geografía",
      ingles: "Inglés",
      informatica: "Informática",
      economia: "Economía",
      filosofia: "Filosofía",
      "ciencias-naturales": "Ciencias naturales",
    };
    return esNames[subjectSlug] ?? educationTopicTitle(subjectSlug);
  }
  return row[1];
}

export function EducationTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const es = locale === "es";
  const [level, setLevel] = useState<EducationLevel>("secundaria");
  const [difficulty, setDifficulty] = useState<EducationDifficulty>("media");
  const [count, setCount] = useState("10");
  const [challenge, setChallenge] = useState(false);
  const [mode, setMode] = useState<"global" | "question">("global");
  const [seconds, setSeconds] = useState("60");
  const [generated, setGenerated] = useState<GeneratedQuestion[]>([]);
  const [shortfallNote, setShortfallNote] = useState("");
  const [submitted, setSubmitted] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [genError, setGenError] = useState("");
  const started = useRef<number | null>(null);
  const deadline = useRef<number | null>(null);
  const completedRef = useRef(false);
  const { streak, recordActivity } = useDailyStreak();

  const subjectSlug = String(tool.config?.subject ?? "");
  const topicSlug = String(tool.config?.topic ?? "");
  const bankTopic = resolveBankTopic(subjectSlug, topicSlug);
  const subjectName = subjectDisplayName(subjectSlug, locale);
  const topicName = educationTopicTitle(topicSlug);
  const title = useMemo(() => `${subjectName} · ${topicName}`, [subjectName, topicName]);

  const finish = (timeout = false) => {
    if (completedRef.current) return;
    completedRef.current = true;
    const t = started.current;
    setElapsed(t ? Math.max(1, Math.round((Date.now() - t) / 1000)) : 0);
    setTimedOut(timeout);
    setCompleted(true);
    deadline.current = null;
    recordActivity();
  };

  const generate = () => {
    const n = Math.max(1, Math.min(20, Number.parseInt(count, 10) || 10));
    setCount(String(n));
    setGenError("");
    setShortfallNote("");

    const result = generateEducationTest(bankTopic, level, difficulty, n);
    const { questions, requested, available } = result;

    if (!questions.length) {
      setGenerated([]);
      setGenError(
        available === 0
          ? es
            ? `No hay preguntas de ${levelLabelFor(level, es)} · ${difficultyLabelFor(difficulty, es)} para este tema. Probá otra combinación de nivel o dificultad.`
            : `No questions match ${levelLabelFor(level, es)} · ${difficultyLabelFor(difficulty, es)} for this topic. Try another level or difficulty.`
          : es
            ? "No se pudieron generar preguntas. Probá de nuevo."
            : "Could not generate questions. Try again.",
      );
      return;
    }

    completedRef.current = false;
    setGenerated(questions);
    setSubmitted({});
    setCurrent(0);
    setCompleted(false);
    setTimedOut(false);
    setElapsed(0);
    started.current = Date.now();
    const limit = Math.max(5, Math.min(3600, Number(seconds) || 60));
    deadline.current = challenge ? Date.now() + limit * 1000 : null;
    setRemaining(challenge ? limit : 0);

    if (questions.length < requested) {
      setShortfallNote(
        es
          ? `Solo hay ${available} pregunta${available === 1 ? "" : "s"} con nivel ${levelLabelFor(level, es)} y dificultad ${difficultyLabelFor(difficulty, es)}. Se generaron ${questions.length} de ${requested} pedidas (sin mezclar otras combinaciones).`
          : `Only ${available} question${available === 1 ? "" : "s"} match ${levelLabelFor(level, es)} · ${difficultyLabelFor(difficulty, es)}. Generated ${questions.length} of ${requested} requested (no mismatched fillers).`,
      );
    }
  };

  useEffect(() => {
    if (!challenge || mode !== "global" || !generated.length || completed || !deadline.current) return;
    const id = window.setInterval(() => {
      const d = deadline.current;
      if (!d) return;
      const n = Math.max(0, Math.ceil((d - Date.now()) / 1000));
      setRemaining(n);
      if (n === 0) finish(true);
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge, mode, generated.length, completed]);

  useEffect(() => {
    if (!challenge || mode !== "question" || !generated.length || completed) return;
    const limit = Math.max(5, Math.min(3600, Number(seconds) || 60));
    deadline.current = Date.now() + limit * 1000;
    setRemaining(limit);
    const id = window.setInterval(() => {
      const d = deadline.current;
      if (!d) return;
      const n = Math.max(0, Math.ceil((d - Date.now()) / 1000));
      setRemaining(n);
      if (n === 0) finish(true);
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, mode, challenge, generated.length, completed, seconds]);

  const score = generated.reduce((n, q, i) => n + (submitted[i] === q.answer ? 1 : 0), 0);
  const answered = Object.keys(submitted).filter((k) => submitted[Number(k)] >= 0).length;
  const progress = generated.length ? Math.round((answered / generated.length) * 100) : 0;
  const question = generated[current];
  const speed = elapsed ? Math.round((answered / elapsed) * 60) : 0;
  const levelLabel = levelLabelFor(level, es);
  const difficultyLabel = difficultyLabelFor(difficulty, es);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-muted/30 p-4">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">
          {es
            ? "Elige nivel, dificultad y cantidad. Solo se usan preguntas que coincidan exactamente con tu configuración."
            : "Choose level, difficulty, and count. Only questions that match your settings exactly are used."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">{es ? "Nivel educativo" : "Education level"}</legend>
          <div className="grid gap-2">
            {LEVELS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={level === value}
                onClick={() => setLevel(value)}
                className={`rounded-xl border px-3 py-2 text-left font-medium ${
                  level === value ? "border-primary bg-primary/10 text-primary" : "bg-background hover:bg-muted"
                }`}
              >
                {es ? ES_LEVELS[label] : label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">{es ? "Dificultad" : "Difficulty"}</legend>
          <div className="grid gap-2">
            {DIFFICULTIES.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={difficulty === value}
                onClick={() => setDifficulty(value)}
                className={`rounded-xl border px-3 py-2 text-left font-medium ${
                  difficulty === value ? "border-primary bg-primary/10 text-primary" : "bg-background hover:bg-muted"
                }`}
              >
                {es ? ES_DIFFICULTIES[label] : label}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="space-y-2">
          <span className="text-sm font-medium">{es ? "Número de preguntas" : "Number of questions"}</span>
          <input
            type="number"
            min="1"
            max="20"
            step="1"
            inputMode="numeric"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="h-11 w-full rounded-xl border bg-background px-3"
          />
          <span className="text-xs text-muted-foreground">
            {es ? "Hasta 20, solo si el banco tiene suficientes del mismo nivel y dificultad." : "Up to 20, only if the bank has enough at that level and difficulty."}
          </span>
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm">
        <span className="font-semibold">{es ? "Configuración:" : "Settings:"}</span> {levelLabel} · {difficultyLabel} ·{" "}
        {count || "0"} {es ? "preguntas" : "questions"}
      </div>

      <div className="space-y-4 rounded-xl border p-4">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={challenge} onChange={(e) => setChallenge(e.target.checked)} />
          <span className="font-semibold">{es ? "Modo desafío con tiempo" : "Timed challenge mode"}</span>
        </label>
        {challenge && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium">{es ? "Tiempo" : "Time"}</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "global" | "question")}
                className="h-11 w-full rounded-xl border bg-background px-3"
              >
                <option value="global">{es ? "Por cuestionario" : "Per quiz"}</option>
                <option value="question">{es ? "Por pregunta" : "Per question"}</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">{es ? "Segundos" : "Seconds"}</span>
              <input
                type="number"
                min="5"
                max="3600"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                className="h-11 w-full rounded-xl border bg-background px-3"
              />
            </label>
          </div>
        )}
      </div>

      <button type="button" onClick={generate} className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground">
        {es ? "Generar cuestionario" : "Generate quiz"}
      </button>

      {genError && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {genError}
        </p>
      )}

      {shortfallNote && (
        <p role="status" className="rounded-xl border border-amber-300/60 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-100">
          {shortfallNote}
        </p>
      )}

      {generated.length > 0 && (
        <div className="space-y-4 rounded-xl border p-4">
          <div className="flex justify-between gap-3">
            <div>
              <h3 className="font-bold">{es ? "Cuestionario generado" : "Generated quiz"}</h3>
              <p className="text-sm text-muted-foreground">
                {es
                  ? `Pregunta ${current + 1} de ${generated.length} · ${answered} respondidas · ${levelLabel} · ${difficultyLabel}`
                  : `Question ${current + 1} of ${generated.length} · ${answered} answered · ${levelLabel} · ${difficultyLabel}`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold">{progress}%</span>
              {challenge && !completed && <p className="text-xs font-bold text-primary">⏱ {remaining}s</p>}
              <p className="text-xs text-muted-foreground">
                🔥 {streak} {es ? "días" : "days"}
              </p>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>

          {!completed && question && (
            <fieldset className="rounded-xl border p-4">
              <legend className="px-1 text-sm font-bold">
                {es ? "Pregunta" : "Question"} {current + 1}
              </legend>
              <p className="mb-3">{question.text}</p>
              <div className="space-y-2">
                {question.options.map((option, j) => (
                  <label key={`${current}-${j}-${option}`} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3">
                    <input
                      type="radio"
                      name={`question-${current}`}
                      checked={submitted[current] === j}
                      onChange={() => setSubmitted((s) => ({ ...s, [current]: j }))}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex justify-between gap-2">
                <button
                  type="button"
                  disabled={current === 0}
                  onClick={() => setCurrent((i) => Math.max(0, i - 1))}
                  className="rounded-lg border px-4 py-2 disabled:opacity-40"
                >
                  {es ? "Anterior" : "Previous"}
                </button>
                {current < generated.length - 1 ? (
                  <button type="button" onClick={() => setCurrent((i) => i + 1)} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
                    {es ? "Siguiente" : "Next"}
                  </button>
                ) : (
                  <button type="button" onClick={() => finish(false)} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
                    {es ? "Terminar cuestionario" : "Finish quiz"}
                  </button>
                )}
              </div>
            </fieldset>
          )}

          {completed && (
            <div className="rounded-xl bg-muted/40 p-5 text-center">
              <p className="text-2xl font-black">
                {score}/{generated.length}
              </p>
              <p className="font-semibold">{es ? "Cuestionario terminado" : "Quiz finished"}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {challenge
                  ? `${es ? "Velocidad" : "Speed"}: ${speed} ${es ? "respuestas/min" : "answers/min"} · ${elapsed}s${
                      timedOut ? (es ? " · Tiempo agotado" : " · Time up") : ""
                    }.`
                  : es
                    ? "Puedes generar otro cuestionario cuando quieras."
                    : "You can generate another quiz anytime."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function levelLabelFor(level: EducationLevel, es: boolean) {
  const en = LEVELS.find((x) => x[0] === level)?.[1] ?? level;
  return es ? ES_LEVELS[en] ?? en : en;
}

function difficultyLabelFor(difficulty: EducationDifficulty, es: boolean) {
  const en = DIFFICULTIES.find((x) => x[0] === difficulty)?.[1] ?? difficulty;
  return es ? ES_DIFFICULTIES[en] ?? en : en;
}
