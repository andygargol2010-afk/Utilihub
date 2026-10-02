import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import {
  type Difficulty,
  type GameEvent,
  START,
  DAYS,
  buildMonth,
  money,
} from "./budget-survivor-logic";

type Phase = "setup" | "playing" | "won" | "lost";

export function BudgetSurvivorGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [phase, setPhase] = useState<Phase>("setup");
  const [balance, setBalance] = useState(0);
  const [day, setDay] = useState(1);
  const [queue, setQueue] = useState<GameEvent[]>([]);
  const [index, setIndex] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [best, setBest] = useState(0);

  useEffect(() => {
    setBest(readBestScore("budget-survivor"));
  }, []);

  const current = phase === "playing" ? queue[index] : undefined;

  const start = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setBalance(START[diff]);
    setDay(1);
    setQueue(buildMonth(diff));
    setIndex(0);
    setLog([]);
    setPhase("playing");
  }, []);

  const finishWin = useCallback((finalBalance: number) => {
    setPhase("won");
    setBest(writeBestScore("budget-survivor", finalBalance));
  }, []);

  const applyAndAdvance = useCallback(
    (delta: number, note: string) => {
      const next = balance + delta;
      setLog((L) => [note, ...L].slice(0, 8));
      setBalance(next);
      if (next < 0) {
        setPhase("lost");
        return;
      }
      const nextIndex = index + 1;
      if (nextIndex >= queue.length) {
        setDay(DAYS);
        finishWin(next);
        return;
      }
      setIndex(nextIndex);
      setDay(queue[nextIndex]!.day);
    },
    [balance, finishWin, index, queue],
  );

  const onPay = () => {
    if (!current) return;
    const title = es ? current.titleEs : current.titleEn;
    applyAndAdvance(current.amount, `${title}: ${money(current.amount, es)}`);
  };

  const onAlt = () => {
    if (!current || current.altAmount == null) return;
    const label = es ? current.altLabelEs ?? "Alternativa" : current.altLabelEn ?? "Alternative";
    applyAndAdvance(current.altAmount, `${label}: ${money(current.altAmount, es)}`);
  };

  const onSkip = () => {
    if (!current || !current.skippable || current.kind === "bill") return;
    const title = es ? current.titleEs : current.titleEn;
    applyAndAdvance(0, es ? `${title}: omitido` : `${title}: skipped`);
  };

  const progress = useMemo(() => Math.min(100, Math.round((day / DAYS) * 100)), [day]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      {phase === "setup" && (
        <>
          <p className="text-center text-sm text-emerald-100/80">
            {es
              ? "Elegí dificultad. Tenés que llegar al día 28 sin saldo negativo."
              : "Pick a difficulty. Reach day 28 without a negative balance."}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {(
              [
                ["easy", es ? "Fácil" : "Easy", START.easy],
                ["medium", es ? "Media" : "Medium", START.medium],
                ["hard", es ? "Difícil" : "Hard", START.hard],
              ] as const
            ).map(([key, label, cash]) => (
              <GameSecondaryButton key={key} active={difficulty === key} onClick={() => setDifficulty(key)}>
                {label} · ${cash}
              </GameSecondaryButton>
            ))}
          </div>
          <div className="flex justify-center">
            <GamePrimaryButton onClick={() => start(difficulty)}>
              {es ? "Empezar el mes" : "Start the month"}
            </GamePrimaryButton>
          </div>
          {best > 0 && (
            <p className="text-center text-xs text-amber-200/90">
              {es ? "Mejor saldo final" : "Best ending balance"}: ${best}
            </p>
          )}
        </>
      )}

      {(phase === "playing" || phase === "won" || phase === "lost") && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: es ? "Día" : "Day", value: `${day}/${DAYS}` },
              { label: es ? "Saldo" : "Balance", value: `$${balance}` },
              { label: es ? "Mejor" : "Best", value: best ? `$${best}` : "—" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-black/40 px-2 py-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/60">{s.label}</p>
                <p
                  className={`mt-0.5 text-base font-bold tabular-nums ${
                    s.label === (es ? "Saldo" : "Balance") && balance < 120 ? "text-amber-300" : "text-white"
                  }`}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {phase === "playing" && current && (
            <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/70">
                {current.kind === "income"
                  ? es
                    ? "Ingreso"
                    : "Income"
                  : current.kind === "optional"
                    ? es
                      ? "Opcional"
                      : "Optional"
                    : current.kind === "surprise"
                      ? es
                        ? "Sorpresa"
                        : "Surprise"
                      : es
                        ? "Gasto"
                        : "Bill"}{" "}
                · {es ? "Día" : "Day"} {current.day}
              </p>
              <h2 className="mt-1 text-lg font-bold text-white">{es ? current.titleEs : current.titleEn}</h2>
              <p className="mt-1 text-sm text-white/65">{es ? current.descEs : current.descEn}</p>
              <p
                className={`mt-3 text-2xl font-black tabular-nums ${
                  current.amount >= 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {money(current.amount, es)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <GamePrimaryButton onClick={onPay}>
                  {current.amount >= 0 ? (es ? "Cobrar" : "Collect") : es ? "Pagar" : "Pay"}
                </GamePrimaryButton>
                {current.altAmount != null && (
                  <GameSecondaryButton onClick={onAlt}>
                    {(es ? current.altLabelEs : current.altLabelEn) ?? (es ? "Alternativa" : "Alternative")}{" "}
                    ({money(current.altAmount, es)})
                  </GameSecondaryButton>
                )}
                {current.skippable && current.kind !== "bill" && (
                  <GameSecondaryButton onClick={onSkip}>{es ? "Omitir" : "Skip"}</GameSecondaryButton>
                )}
              </div>
            </div>
          )}

          {phase === "won" && (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-center">
              <p className="text-lg font-black text-emerald-300">
                {es ? "¡Sobreviviste el mes!" : "You survived the month!"}
              </p>
              <p className="mt-1 text-sm text-white/70">
                {es ? "Saldo final" : "Ending balance"}: ${balance}
              </p>
              <div className="mt-3 flex justify-center">
                <GamePrimaryButton onClick={() => setPhase("setup")}>
                  {es ? "Jugar de nuevo" : "Play again"}
                </GamePrimaryButton>
              </div>
            </div>
          )}

          {phase === "lost" && (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-center">
              <p className="text-lg font-black text-rose-300">
                {es ? "Te quedaste sin plata" : "You ran out of money"}
              </p>
              <p className="mt-1 text-sm text-white/70">
                {es ? `Día ${day} · saldo` : `Day ${day} · balance`} ${balance}
              </p>
              <div className="mt-3 flex justify-center">
                <GamePrimaryButton onClick={() => setPhase("setup")}>
                  {es ? "Reintentar" : "Try again"}
                </GamePrimaryButton>
              </div>
            </div>
          )}

          {log.length > 0 && (
            <ul className="space-y-1 rounded-2xl border border-white/5 bg-black/30 p-3 text-xs text-white/55">
              {log.map((line, i) => (
                <li key={`${i}-${line}`} className="truncate">
                  · {line}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
