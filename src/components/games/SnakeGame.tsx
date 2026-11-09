import { useCallback, useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import { COLS } from "./SnakeGame.part1";
import { type Dir, type Pt, initialSnake, randomFood, opposite, STEP_MS, DELTA, ROWS, paint, W, H } from "./SnakeGame.part2";

export function SnakeGame({ locale = "en" }: { locale?: "en" | "es" | "pt" | "fr" | "de" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<"menu" | "hint" | "play" | "dead">("menu");
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dirRef = useRef<Dir>("R");
  const pendingRef = useRef<Dir>("R");
  const snakeRef = useRef<Pt[]>(initialSnake());
  const prevRef = useRef<Pt[] | null>(null);
  const foodRef = useRef<Pt>(randomFood(initialSnake()));
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const phaseRef = useRef<"menu" | "hint" | "play" | "dead">("menu");
  const pausedRef = useRef(false);
  const stepAtRef = useRef(0);
  const progressRef = useRef(1);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const hintUntilRef = useRef(0);
  const mobileRef = useRef(false);
  const locRef = useRef(locale);
  locRef.current = locale;

  useEffect(() => {
    const b = readBestScore("snake");
    setBest(b);
    bestRef.current = b;
    const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const sync = () => {
      setIsMobile(mq.matches);
      mobileRef.current = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const hardReset = useCallback(() => {
    const s = initialSnake();
    snakeRef.current = s;
    prevRef.current = null;
    const f = randomFood(s);
    foodRef.current = f;
    dirRef.current = "R";
    pendingRef.current = "R";
    setScore(0);
    scoreRef.current = 0;
    setPhase("menu");
    phaseRef.current = "menu";
    setPaused(false);
    pausedRef.current = false;
    progressRef.current = 1;
    stepAtRef.current = 0;
  }, []);

  const beginPlay = useCallback(() => {
    const s = initialSnake();
    snakeRef.current = s;
    prevRef.current = null;
    const f = randomFood(s);
    foodRef.current = f;
    dirRef.current = "R";
    pendingRef.current = "R";
    setScore(0);
    scoreRef.current = 0;
    progressRef.current = 1;
    setPhase("hint");
    phaseRef.current = "hint";
    hintUntilRef.current = performance.now() + 1400;
    stepAtRef.current = performance.now() + 1400;
    setPaused(false);
    pausedRef.current = false;
  }, []);

  const nudge = useCallback(
    (next: Dir) => {
      if (phaseRef.current === "menu" || phaseRef.current === "dead") {
        beginPlay();
        if (!opposite("R", next)) pendingRef.current = next;
        return;
      }
      if (opposite(dirRef.current, next)) return;
      pendingRef.current = next;
      if (phaseRef.current === "hint") {
        setPhase("play");
        phaseRef.current = "play";
        stepAtRef.current = performance.now();
      }
    },
    [beginPlay],
  );

  // Paint + logic in one RAF loop — no setState per frame (was the main jank source)
  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      const ph = phaseRef.current;
      if ((ph === "play" || ph === "hint") && !pausedRef.current) {
        if (ph === "hint" && now >= hintUntilRef.current) {
          setPhase("play");
          phaseRef.current = "play";
          stepAtRef.current = now;
        }
        const active = phaseRef.current === "play" || now >= hintUntilRef.current;
        if (active) {
          if (!stepAtRef.current) stepAtRef.current = now;
          // Catch up at most one step per frame so motion never teleports
          if (now - stepAtRef.current >= STEP_MS) {
            stepAtRef.current += STEP_MS;
            // If we're more than 2 steps behind (tab background), resync
            if (now - stepAtRef.current > STEP_MS * 2) stepAtRef.current = now;
            const nextDir = pendingRef.current;
            dirRef.current = nextDir;
            const cur = snakeRef.current;
            const d = DELTA[nextDir];
            const head = cur[0]!;
            const nx = head.x + d.x;
            const ny = head.y + d.y;
            if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || cur.some((p) => p.x === nx && p.y === ny)) {
              setPhase("dead");
              phaseRef.current = "dead";
              const nb = writeBestScore("snake", Math.max(bestRef.current, scoreRef.current));
              bestRef.current = nb;
              setBest(nb);
              progressRef.current = 1;
            } else {
              const nextHead = { x: nx, y: ny };
              const ate = nx === foodRef.current.x && ny === foodRef.current.y;
              const body = ate ? cur : cur.slice(0, -1);
              const nextSnake = [nextHead, ...body];
              prevRef.current = cur;
              snakeRef.current = nextSnake;
              if (ate) {
                const ns = scoreRef.current + 1;
                scoreRef.current = ns;
                setScore(ns);
                foodRef.current = randomFood(nextSnake);
              }
            }
          }
          progressRef.current = Math.min(1, Math.max(0, (now - stepAtRef.current) / STEP_MS));
        }
      }

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        paint(
          ctx,
          snakeRef.current,
          prevRef.current,
          foodRef.current,
          dirRef.current,
          scoreRef.current,
          progressRef.current,
          phaseRef.current,
          bestRef.current,
          locRef.current,
          mobileRef.current,
        );
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "U",
        ArrowDown: "D",
        ArrowLeft: "L",
        ArrowRight: "R",
        w: "U",
        s: "D",
        a: "L",
        d: "R",
        W: "U",
        S: "D",
        A: "L",
        D: "R",
      };
      const next = map[e.key];
      if (next) {
        e.preventDefault();
        nudge(next);
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (phaseRef.current === "menu" || phaseRef.current === "dead") beginPlay();
        else if (phaseRef.current === "play") {
          setPaused((p) => {
            // p === true → currently paused, about to resume
            if (p) stepAtRef.current = performance.now() - progressRef.current * STEP_MS;
            pausedRef.current = !p;
            return !p;
          });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nudge, beginPlay]);

  const onTouchStart = (e: ReactTouchEvent) => {
    if (phaseRef.current === "play" || phaseRef.current === "hint") e.preventDefault();
    const t = e.touches[0];
    if (t) touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    const t = e.changedTouches[0];
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      if (phaseRef.current === "menu" || phaseRef.current === "dead") beginPlay();
      return;
    }
    const next: Dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "R" : "L") : dy > 0 ? "D" : "U";
    nudge(next);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-100/90">
        <span>
          {locale === "pt" ? "Melhor" : locale === "es" ? "Mejor" : locale === "fr" ? "Meilleur" : locale === "de" ? "Bester" : "Best"}: <span className="tabular-nums text-amber-300">{best}</span>
        </span>
        <div className="flex gap-2">
          {(phase === "menu" || phase === "dead") && (
            <GamePrimaryButton onClick={beginPlay}>{locale === "pt" ? "Jogar" : locale === "es" ? "Jugar" : locale === "fr" ? "Jouer" : locale === "de" ? "Spielen" : "Play"}</GamePrimaryButton>
          )}
          {(phase === "play" || phase === "hint") && (
            <GameSecondaryButton
              active={paused}
              onClick={() => {
                setPaused((p) => {
                  if (p) stepAtRef.current = performance.now() - progressRef.current * STEP_MS;
                  pausedRef.current = !p;
                  return !p;
                });
              }}
            >
              {paused
                ? (locale === "pt" ? "Seguir" : locale === "es" ? "Seguir" : locale === "fr" ? "Reprendre" : locale === "de" ? "Fortsetzen" : "Resume")
                : (locale === "pt" ? "Pausa" : locale === "es" ? "Pausa" : locale === "fr" ? "Pause" : locale === "de" ? "Pause" : "Pause")}
            </GameSecondaryButton>
          )}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="max-w-full touch-none rounded-2xl shadow-lg"
        style={{ width: "min(100%, 420px)", height: "auto" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />

      {isMobile && (
        <div className="grid grid-cols-3 gap-2">
          <span />
          <button type="button" aria-label={locale === "pt" ? "Cima" : locale === "es" ? "Arriba" : locale === "fr" ? "Haut" : locale === "de" ? "Oben" : "Up"} onPointerDown={(e) => { e.preventDefault(); nudge("U"); }} className="flex h-14 w-14 items-center justify-center justify-self-center rounded-2xl bg-white/20 text-xl font-bold text-white active:scale-95 active:bg-white/35">\u25b2</button>
          <span />
          <button type="button" aria-label={locale === "pt" ? "Esquerda" : locale === "es" ? "Izquierda" : locale === "fr" ? "Gauche" : locale === "de" ? "Links" : "Left"} onPointerDown={(e) => { e.preventDefault(); nudge("L"); }} className="flex h-14 w-14 items-center justify-center justify-self-center rounded-2xl bg-white/20 text-xl font-bold text-white active:scale-95 active:bg-white/35">\u25c0</button>
          <button type="button" aria-label={locale === "pt" ? "Baixo" : locale === "es" ? "Abajo" : locale === "fr" ? "Bas" : locale === "de" ? "Unten" : "Down"} onPointerDown={(e) => { e.preventDefault(); nudge("D"); }} className="flex h-14 w-14 items-center justify-center justify-self-center rounded-2xl bg-white/20 text-xl font-bold text-white active:scale-95 active:bg-white/35">\u25bc</button>
          <button type="button" aria-label={locale === "pt" ? "Direita" : locale === "es" ? "Derecha" : locale === "fr" ? "Droite" : locale === "de" ? "Rechts" : "Right"} onPointerDown={(e) => { e.preventDefault(); nudge("R"); }} className="flex h-14 w-14 items-center justify-center justify-self-center rounded-2xl bg-white/20 text-xl font-bold text-white active:scale-95 active:bg-white/35">\u25b6</button>
        </div>
      )}

      <p className="text-center text-[11px] text-white/50">
        {isMobile
          ? locale === "pt"
            ? "Deslize no tabuleiro ou use os botões"
            : locale === "es"
              ? "Deslizá en el tablero o usá los botones"
              : locale === "fr"
                ? "Glissez sur le plateau ou utilisez les boutons"
                : locale === "de"
                  ? "Wischen auf dem Spielfeld oder die Tasten verwenden"
                  : "Swipe on the board or use the buttons"
          : locale === "pt"
            ? "Setas / WASD · espaço = pausa"
            : locale === "es"
              ? "Flechas / WASD · espacio = pausa"
              : locale === "fr"
                ? "Flèches / WASD · espace = pause"
                : locale === "de"
                  ? "Pfeiltasten / WASD · Leertaste = Pause"
                  : "Arrow keys / WASD · space = pause"}
      </p>
    </div>
  );
}
