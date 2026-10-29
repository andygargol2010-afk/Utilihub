import { useCallback, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton } from "./GameShell";

const WORDS_EN = [
  "REACT", "TYPESCRIPT", "UTILIHUB", "ALGORITHM", "CANVAS", "BROWSER", "COMPONENT", "FUNCTION",
  "VARIABLE", "INTERFACE", "ASYNC", "PROMISE", "HOOK", "STATE", "EFFECT", "ROUTER",
];

const WORDS_ES = [
  "REACT", "TYPESCRIPT", "UTILIHUB", "ALGORITMO", "LIENZO", "NAVEGADOR", "COMPONENTE", "FUNCION",
  "VARIABLE", "INTERFAZ", "ASINCRONO", "PROMESA", "GANCHO", "ESTADO", "EFECTO", "ENRUTADOR",
];

const MAX_MISSES = 6;

function randomWord(list: string[]) {
  return list[Math.floor(Math.random() * list.length)]!;
}

export function HangmanGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const words = es ? WORDS_ES : WORDS_EN;

  const [word, setWord] = useState(() => randomWord(words));
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [misses, setMisses] = useState(0);

  const revealed = useMemo(
    () => word.split("").map((c) => (guessed.has(c) ? c : "_")),
    [word, guessed],
  );

  const won = revealed.every((c) => c !== "_");
  const lost = misses >= MAX_MISSES;
  const over = won || lost;

  const guess = useCallback(
    (letter: string) => {
      if (over || guessed.has(letter)) return;
      const next = new Set(guessed);
      next.add(letter);
      setGuessed(next);
      if (!word.includes(letter)) setMisses((m) => m + 1);
    },
    [over, guessed, word],
  );

  const reset = useCallback(() => {
    setWord(randomWord(words));
    setGuessed(new Set());
    setMisses(0);
  }, [words]);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-2">
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">
          {es ? "Fallos" : "Misses"}: {misses} / {MAX_MISSES}
        </p>
        {/* Simple progressive stick figure indicator */}
        <div className="relative h-24 w-24" aria-hidden>
          <svg viewBox="0 0 100 120" className="h-full w-full">
            {/* Gallows base */}
            <line x1="10" y1="110" x2="70" y2="110" stroke="#94a3b8" strokeWidth="4" />
            <line x1="30" y1="110" x2="30" y2="10" stroke="#94a3b8" strokeWidth="4" />
            <line x1="30" y1="10" x2="70" y2="10" stroke="#94a3b8" strokeWidth="4" />
            <line x1="70" y1="10" x2="70" y2="25" stroke="#94a3b8" strokeWidth="4" />
            {misses >= 1 && <circle cx="70" cy="35" r="10" fill="none" stroke="#f87171" strokeWidth="3" />}
            {misses >= 2 && <line x1="70" y1="45" x2="70" y2="75" stroke="#f87171" strokeWidth="3" />}
            {misses >= 3 && <line x1="70" y1="55" x2="55" y2="65" stroke="#f87171" strokeWidth="3" />}
            {misses >= 4 && <line x1="70" y1="55" x2="85" y2="65" stroke="#f87171" strokeWidth="3" />}
            {misses >= 5 && <line x1="70" y1="75" x2="55" y2="95" stroke="#f87171" strokeWidth="3" />}
            {misses >= 6 && <line x1="70" y1="75" x2="85" y2="95" stroke="#f87171" strokeWidth="3" />}
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1 sm:gap-2" role="group" aria-label={es ? "Palabra" : "Word"}>
        {revealed.map((c, i) => (
          <span
            key={i}
            className="flex h-10 w-8 items-center justify-center rounded border border-white/20 bg-white/5 text-lg font-bold text-white sm:h-12 sm:w-10 sm:text-xl"
          >
            {c}
          </span>
        ))}
      </div>

      {over && (
        <p className={`text-lg font-black ${won ? "text-emerald-300" : "text-rose-300"}`}>
          {won ? (es ? "¡Ganaste!" : "You win!") : es ? `Perdiste. Era: ${word}` : `You lose. It was: ${word}`}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2" style={{ maxWidth: "100%" }}>
        {letters.map((L) => {
          const used = guessed.has(L);
          const correct = used && word.includes(L);
          return (
            <button
              key={L}
              type="button"
              disabled={used || over}
              onClick={() => guess(L)}
              className={`min-h-9 min-w-8 rounded-lg px-2 text-sm font-bold transition active:scale-95 disabled:opacity-40 sm:min-h-10 sm:min-w-9 ${
                used
                  ? correct
                    ? "bg-emerald-600/80 text-white"
                    : "bg-rose-600/60 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              aria-label={L}
            >
              {L}
            </button>
          );
        })}
      </div>

      <GamePrimaryButton onClick={reset}>{es ? "Nueva palabra" : "New word"}</GamePrimaryButton>
    </div>
  );
}
