import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Lang = "js" | "python";
type Phase = "idle" | "running" | "done";

type Snippet = { lang: Lang; id: string; code: string };

const SNIPPETS: Snippet[] = [
  { lang: "js", id: "js-map", code: "const doubled = nums.map((n) => n * 2);" },
  { lang: "js", id: "js-filter", code: "const active = users.filter((u) => u.active);" },
  { lang: "js", id: "js-reduce", code: "const total = items.reduce((sum, item) => sum + item.price, 0);" },
  { lang: "js", id: "js-fetch", code: "const data = await fetch(url).then((r) => r.json());" },
  { lang: "js", id: "js-destruct", code: "const { id, name, email } = user;" },
  {
    lang: "js",
    id: "js-loop",
    code: "for (const item of list) {\n  if (!item) continue;\n  process(item);\n}",
  },
  {
    lang: "js",
    id: "js-class",
    code: "class Counter {\n  constructor() { this.n = 0; }\n  inc() { this.n += 1; }\n}",
  },
  { lang: "python", id: "py-comp", code: "squares = [n * n for n in range(10)]" },
  { lang: "python", id: "py-dict", code: "counts = {k: v for k, v in pairs}" },
  { lang: "python", id: "py-fstring", code: 'msg = f"Hello, {name}! You have {n} items."' },
  {
    lang: "python",
    id: "py-def",
    code: "def greet(name: str) -> str:\n    return f\"Hi, {name}\"",
  },
  {
    lang: "python",
    id: "py-with",
    code: "with open(path, \"r\", encoding=\"utf-8\") as f:\n    text = f.read()",
  },
  {
    lang: "python",
    id: "py-sort",
    code: "items.sort(key=lambda x: x[\"score\"], reverse=True)",
  },
];

const HS_KEY = "utilihub-code-type-race-best-wpm";

function pickSnippet(lang: Lang | "all", avoidId?: string): Snippet {
  const pool = SNIPPETS.filter((s) => (lang === "all" ? true : s.lang === lang) && s.id !== avoidId);
  const list = pool.length ? pool : SNIPPETS;
  return list[Math.floor(Math.random() * list.length)]!;
}

function readBest(): number {
  try {
    const raw = localStorage.getItem(HS_KEY);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function writeBest(wpm: number) {
  try {
    const prev = readBest();
    if (wpm > prev) localStorage.setItem(HS_KEY, String(Math.round(wpm)));
  } catch {
    /* ignore */
  }
}

export function CodeTypeRaceGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [langFilter, setLangFilter] = useState<Lang | "all">("all");
  const [snippet, setSnippet] = useState<Snippet>(() => pickSnippet("all"));
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [best, setBest] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setBest(readBest());
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    const id = window.setInterval(() => setTick((t) => t + 1), 200);
    return () => window.clearInterval(id);
  }, [phase]);

  const target = snippet.code;

  const elapsedMs = useMemo(() => {
    if (!startedAt) return 0;
    const end = endedAt ?? Date.now();
    return Math.max(0, end - startedAt);
    // tick forces refresh while running
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt, endedAt, tick, phase]);

  const correctChars = useMemo(() => {
    let n = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === target[i]) n++;
      else break;
    }
    return n;
  }, [typed, target]);

  const hasMismatch = typed.length > correctChars;

  const stats = useMemo(() => {
    const minutes = elapsedMs / 60000;
    const wpm = minutes > 0 ? correctChars / 5 / minutes : 0;
    const strokes = typed.length;
    const accuracy = strokes > 0 ? (correctChars / strokes) * 100 : 100;
    return { wpm, accuracy, minutes };
  }, [elapsedMs, correctChars, typed.length]);

  const resetRound = useCallback(
    (nextLang: Lang | "all" = langFilter) => {
      const next = pickSnippet(nextLang, snippet.id);
      setSnippet(next);
      setTyped("");
      setPhase("idle");
      setStartedAt(null);
      setEndedAt(null);
      setErrors(0);
      window.setTimeout(() => inputRef.current?.focus(), 50);
    },
    [langFilter, snippet.id],
  );

  const onChange = (value: string) => {
    if (phase === "done") return;

    if (phase === "idle" && value.length > 0) {
      setPhase("running");
      setStartedAt(Date.now());
    }

    // Count a new error when the latest char diverges
    if (value.length > typed.length) {
      const i = value.length - 1;
      if (value[i] !== target[i]) setErrors((e) => e + 1);
    }

    // Don't allow typing far past the first error (keep one wrong char visible)
    let next = value;
    let ok = 0;
    for (let i = 0; i < next.length; i++) {
      if (next[i] === target[i]) ok = i + 1;
      else {
        next = next.slice(0, i + 1);
        break;
      }
    }

    setTyped(next);

    if (ok === target.length) {
      const end = Date.now();
      setEndedAt(end);
      setPhase("done");
      const mins = startedAt ? (end - startedAt) / 60000 : 0;
      const finalWpm = mins > 0 ? target.length / 5 / mins : 0;
      writeBest(finalWpm);
      setBest(readBest());
    }
  };

  const chars = useMemo(() => {
    return target.split("").map((ch, i) => {
      let state: "pending" | "ok" | "bad" | "cursor" = "pending";
      if (i < correctChars) state = "ok";
      else if (i === correctChars && hasMismatch) state = "bad";
      else if (i === correctChars) state = "cursor";
      return { ch, state, i };
    });
  }, [target, correctChars, hasMismatch]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", es ? "Todos" : "All"],
              ["js", "JavaScript"],
              ["python", "Python"],
            ] as const
          ).map(([key, label]) => (
            <GameSecondaryButton
              key={key}
              active={langFilter === key}
              onClick={() => {
                setLangFilter(key);
                resetRound(key);
              }}
            >
              {label}
            </GameSecondaryButton>
          ))}
        </div>
        <GamePrimaryButton onClick={() => resetRound()}>{es ? "Nuevo snippet" : "New snippet"}</GamePrimaryButton>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          {
            label: es ? "Tiempo" : "Time",
            value: `${(elapsedMs / 1000).toFixed(1)}s`,
          },
          { label: "WPM", value: stats.wpm ? stats.wpm.toFixed(0) : "—" },
          {
            label: es ? "Precisión" : "Accuracy",
            value: `${stats.accuracy.toFixed(0)}%`,
          },
          {
            label: es ? "Mejor WPM" : "Best WPM",
            value: best ? String(best) : "—",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-center"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/60">{s.label}</p>
            <p className="mt-0.5 text-lg font-bold tabular-nums text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/50 p-4 sm:p-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/70">
          {snippet.lang === "js" ? "JavaScript" : "Python"}
          {phase === "done" ? (es ? " · Completado" : " · Done") : ""}
        </p>
        <pre
          className="max-h-48 overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed sm:text-base"
          aria-hidden
        >
          {chars.map(({ ch, state, i }) => {
            const display = ch === "\n" ? "↵\n" : ch === " " ? "·" : ch;
            const cls =
              state === "ok"
                ? "text-emerald-300"
                : state === "bad"
                  ? "bg-rose-500/40 text-rose-100"
                  : state === "cursor"
                    ? "border-b-2 border-emerald-400 text-white/90"
                    : "text-white/35";
            return (
              <span key={i} className={cls}>
                {display}
              </span>
            );
          })}
        </pre>
      </div>

      <label className="block">
        <span className="sr-only">{es ? "Escribí el código" : "Type the code"}</span>
        <textarea
          ref={inputRef}
          value={typed}
          onChange={(e) => onChange(e.target.value)}
          disabled={phase === "done"}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          rows={4}
          placeholder={es ? "Empezá a escribir aquí…" : "Start typing here…"}
          className="w-full resize-y rounded-2xl border border-emerald-400/20 bg-slate-950/80 px-4 py-3 font-mono text-sm text-emerald-50 outline-none ring-emerald-400/30 placeholder:text-white/30 focus:ring-2 disabled:opacity-60 sm:text-base"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/55">
        <span>
          {es ? "Errores de tecla" : "Key errors"}: {" "}
          <strong className="text-white/80">{errors}</strong>
        </span>
        {phase === "done" && (
          <span className="font-semibold text-emerald-300">
            {es
              ? `Listo · ${stats.wpm.toFixed(0)} WPM · ${stats.accuracy.toFixed(0)}% precisión`
              : `Finished · ${stats.wpm.toFixed(0)} WPM · ${stats.accuracy.toFixed(0)}% accuracy`}
          </span>
        )}
        {phase === "idle" && (
          <span>{es ? "El reloj arranca con la primera tecla." : "The clock starts on the first key."}</span>
        )}
      </div>

      {phase === "done" && (
        <div className="flex justify-center">
          <GamePrimaryButton onClick={() => resetRound()}>{es ? "Otra ronda" : "Play again"}</GamePrimaryButton>
        </div>
      )}
    </div>
  );
}
