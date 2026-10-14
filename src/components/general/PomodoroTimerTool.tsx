import { useState, useEffect, useRef, useCallback } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";
const primaryBtn = `${buttonClass} bg-primary text-primary-foreground`;

type Phase = "work" | "shortBreak" | "longBreak";

export function PomodoroTimerTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [workMin, setWorkMin] = useState(25);
  const [shortMin, setShortMin] = useState(5);
  const [longMin, setLongMin] = useState(15);
  const [cyclesBeforeLong, setCyclesBeforeLong] = useState(4);
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completedWork, setCompletedWork] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phaseSeconds = useCallback(
    (p: Phase) => {
      if (p === "work") return workMin * 60;
      if (p === "shortBreak") return shortMin * 60;
      return longMin * 60;
    },
    [workMin, shortMin, longMin],
  );

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // phase complete
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (secondsLeft !== 0 || !running) return;
    // finished a phase
    setRunning(false);
    if (phase === "work") {
      const nextCount = completedWork + 1;
      setCompletedWork(nextCount);
      if (nextCount % cyclesBeforeLong === 0) {
        setPhase("longBreak");
        setSecondsLeft(longMin * 60);
      } else {
        setPhase("shortBreak");
        setSecondsLeft(shortMin * 60);
      }
    } else {
      setPhase("work");
      setSecondsLeft(workMin * 60);
    }
  }, [secondsLeft, running, phase, completedWork, cyclesBeforeLong, workMin, shortMin, longMin]);

  function start() {
    if (secondsLeft <= 0) setSecondsLeft(phaseSeconds(phase));
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setPhase("work");
    setSecondsLeft(workMin * 60);
    setCompletedWork(0);
  }

  function skip() {
    setRunning(false);
    if (phase === "work") {
      const nextCount = completedWork + 1;
      setCompletedWork(nextCount);
      if (nextCount % cyclesBeforeLong === 0) {
        setPhase("longBreak");
        setSecondsLeft(longMin * 60);
      } else {
        setPhase("shortBreak");
        setSecondsLeft(shortMin * 60);
      }
    } else {
      setPhase("work");
      setSecondsLeft(workMin * 60);
    }
  }

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const display = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  const phaseLabel =
    phase === "work"
      ? es
        ? "Trabajo"
        : "Work"
      : phase === "shortBreak"
        ? es
          ? "Descanso corto"
          : "Short break"
        : es
          ? "Descanso largo"
          : "Long break";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3 text-center">
        <p className="text-sm text-muted-foreground">{phaseLabel}</p>
        <p className="text-5xl font-semibold tabular-nums tracking-tight">{display}</p>
        <p className="text-sm">
          {es ? "Sesiones de trabajo completadas" : "Completed work sessions"}: {completedWork}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {!running ? (
          <button type="button" className={primaryBtn} onClick={start}>
            {es ? "Iniciar" : "Start"}
          </button>
        ) : (
          <button type="button" className={primaryBtn} onClick={pause}>
            {es ? "Pausar" : "Pause"}
          </button>
        )}
        <button type="button" className={buttonClass} onClick={skip}>
          {es ? "Saltar" : "Skip"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "Trabajo (min)" : "Work (min)"}</span>
          <input
            type="number"
            min={1}
            max={120}
            value={workMin}
            disabled={running}
            onChange={(e) => {
              const v = Math.max(1, Math.min(120, parseInt(e.target.value, 10) || 25));
              setWorkMin(v);
              if (phase === "work" && !running) setSecondsLeft(v * 60);
            }}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "Descanso corto" : "Short break"}</span>
          <input
            type="number"
            min={1}
            max={60}
            value={shortMin}
            disabled={running}
            onChange={(e) => {
              const v = Math.max(1, Math.min(60, parseInt(e.target.value, 10) || 5));
              setShortMin(v);
              if (phase === "shortBreak" && !running) setSecondsLeft(v * 60);
            }}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "Descanso largo" : "Long break"}</span>
          <input
            type="number"
            min={1}
            max={60}
            value={longMin}
            disabled={running}
            onChange={(e) => {
              const v = Math.max(1, Math.min(60, parseInt(e.target.value, 10) || 15));
              setLongMin(v);
              if (phase === "longBreak" && !running) setSecondsLeft(v * 60);
            }}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "Ciclos hasta largo" : "Cycles to long"}</span>
          <input
            type="number"
            min={1}
            max={12}
            value={cyclesBeforeLong}
            disabled={running}
            onChange={(e) => setCyclesBeforeLong(Math.max(1, Math.min(12, parseInt(e.target.value, 10) || 4)))}
            className={fieldClass}
          />
        </label>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {es
          ? "La t\u00e9cnica Pomodoro alterna bloques de trabajo con descansos cortos y un descanso largo cada N ciclos."
          : "The Pomodoro technique alternates work blocks with short breaks and a long break every N cycles."}
      </p>
    </div>
  );
}
