import { useCallback, useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

/**
 * Classic Pac-Man–style maze (28×26 tiles).
 * # wall · . pellet · o power · - ghost door · space empty path
 */
const MAZE_RAW = [
  "############################",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#o####.#####.##.#####.####o#",
  "#..........................#",
  "#.####.##.########.##.####.#",
  "#......##....##....##......#",
  "######.##### ## #####.######",
  "     #.##### ## #####.#     ",
  "     #.##          ##.#     ",
  "     #.## ###--### ##.#     ",
  "######.## #      # ##.######",
  "      .   #      #   .      ",
  "######.## #      # ##.######",
  "     #.## ######## ##.#     ",
  "     #.##          ##.#     ",
  "     #.## ######## ##.#     ",
  "######.## ######## ##.######",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#o..##.......  .......##..o#",
  "###.##.##.########.##.##.###",
  "#......##....##....##......#",
  "#.##########.##.##########.#",
  "#..........................#",
  "############################",
];

const ROWS = MAZE_RAW.length;
const COLS = MAZE_RAW[0]!.length;
const CELL = 14;
const W = COLS * CELL;
const H = ROWS * CELL;
const STEP_MS = 140;
const GHOST_STEP = 150;
const FRIGHT_MS = 6000;
const LIVES0 = 3;

type Dir = "U" | "D" | "L" | "R";
type Pt = { x: number; y: number };

const DELTA: Record<Dir, Pt> = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};
const DIRS: Dir[] = ["U", "D", "L", "R"];

function opposite(a: Dir, b: Dir) {
  return (a === "U" && b === "D") || (a === "D" && b === "U") || (a === "L" && b === "R") || (a === "R" && b === "L");
}

type CellKind = "wall" | "pellet" | "power" | "empty" | "door";

function parseMaze(): { grid: CellKind[][]; pellets: number } {
  const grid: CellKind[][] = [];
  let pellets = 0;
  for (let r = 0; r < ROWS; r++) {
    const row: CellKind[] = [];
    const line = MAZE_RAW[r]!;
    for (let c = 0; c < COLS; c++) {
      const ch = line[c] ?? "#";
      if (ch === "#") row.push("wall");
      else if (ch === ".") {
        row.push("pellet");
        pellets++;
      } else if (ch === "o") {
        row.push("power");
        pellets++;
      } else if (ch === "-") row.push("door");
      else row.push("empty");
    }
    grid.push(row);
  }
  return { grid, pellets };
}

function wrap(x: number, y: number): Pt {
  let nx = x;
  if (nx < 0) nx = COLS - 1;
  if (nx >= COLS) nx = 0;
  return { x: nx, y };
}

function walkable(grid: CellKind[][], x: number, y: number, allowDoor = false): boolean {
  if (y < 0 || y >= ROWS) return false;
  const p = wrap(x, y);
  const cell = grid[p.y]![p.x]!;
  if (cell === "wall") return false;
  if (cell === "door") return allowDoor;
  return true;
}

type Ghost = {
  x: number;
  y: number;
  dir: Dir;
  color: string;
  name: string;
  corner: Pt;
};

function initialGhosts(): Ghost[] {
  return [
    { x: 13, y: 11, dir: "U", color: "#ef4444", name: "blinky", corner: { x: COLS - 2, y: 1 } },
    { x: 12, y: 13, dir: "L", color: "#f472b6", name: "pinky", corner: { x: 1, y: 1 } },
    { x: 13, y: 13, dir: "U", color: "#22d3ee", name: "inky", corner: { x: COLS - 2, y: ROWS - 2 } },
    { x: 14, y: 13, dir: "R", color: "#fb923c", name: "clyde", corner: { x: 1, y: ROWS - 2 } },
  ];
}

function dist(a: Pt, b: Pt) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function pickGhostDir(g: Ghost, grid: CellKind[][], target: Pt, frightened: boolean): Dir {
  const options: Dir[] = [];
  for (const d of DIRS) {
    if (opposite(g.dir, d)) continue;
    const nx = g.x + DELTA[d].x;
    const ny = g.y + DELTA[d].y;
    if (walkable(grid, nx, ny, true)) options.push(d);
  }
  if (options.length === 0) {
    for (const d of DIRS) {
      const nx = g.x + DELTA[d].x;
      const ny = g.y + DELTA[d].y;
      if (walkable(grid, nx, ny, true)) return d;
    }
    return g.dir;
  }
  if (frightened) {
    return options[Math.floor(Math.random() * options.length)]!;
  }
  let best = options[0]!;
  let bestD = Infinity;
  for (const d of options) {
    const p = wrap(g.x + DELTA[d].x, g.y + DELTA[d].y);
    const dd = dist(p, target);
    if (dd < bestD) {
      bestD = dd;
      best = d;
    }
  }
  return best;
}

function drawMaze(ctx: CanvasRenderingContext2D, grid: CellKind[][]) {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, W, H);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r]![c] !== "wall") continue;
      const x = c * CELL;
      const y = r * CELL;
      ctx.fillStyle = "#0c1a4a";
      ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 1.5, y + 1.5, CELL - 3, CELL - 3);
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r]![c] !== "door") continue;
      ctx.fillStyle = "#f9a8d4";
      ctx.fillRect(c * CELL + 2, r * CELL + CELL / 2 - 1, CELL - 4, 2);
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const k = grid[r]![c]!;
      const cx = c * CELL + CELL / 2;
      const cy = r * CELL + CELL / 2;
      if (k === "pellet") {
        ctx.beginPath();
        ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#fde68a";
        ctx.fill();
      } else if (k === "power") {
        ctx.beginPath();
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fbbf24";
        ctx.fill();
      }
    }
  }
}

function drawPac(ctx: CanvasRenderingContext2D, x: number, y: number, dir: Dir, mouth: number) {
  const cx = x * CELL + CELL / 2;
  const cy = y * CELL + CELL / 2;
  const r = CELL * 0.42;
  const open = 0.25 + mouth * 0.35;
  let start = open;
  let end = Math.PI * 2 - open;
  if (dir === "R") {
    start = open;
    end = Math.PI * 2 - open;
  } else if (dir === "L") {
    start = Math.PI + open;
    end = Math.PI - open;
  } else if (dir === "U") {
    start = -Math.PI / 2 + open;
    end = -Math.PI / 2 - open + Math.PI * 2;
  } else {
    start = Math.PI / 2 + open;
    end = Math.PI / 2 - open + Math.PI * 2;
  }
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, start, end, false);
  ctx.closePath();
  ctx.fillStyle = "#facc15";
  ctx.fill();
  const eyeOff = CELL * 0.12;
  let ex = cx;
  let ey = cy - eyeOff;
  if (dir === "L") {
    ex = cx - eyeOff * 0.3;
    ey = cy - eyeOff;
  } else if (dir === "R") {
    ex = cx + eyeOff * 0.3;
    ey = cy - eyeOff;
  } else if (dir === "U") {
    ex = cx - eyeOff;
    ey = cy - eyeOff * 0.5;
  } else {
    ex = cx - eyeOff;
    ey = cy + eyeOff * 0.2;
  }
  ctx.beginPath();
  ctx.arc(ex, ey, 1.6, 0, Math.PI * 2);
  ctx.fillStyle = "#0f172a";
  ctx.fill();
}

function drawGhost(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  frightened: boolean,
  flash: boolean,
) {
  const cx = x * CELL + CELL / 2;
  const cy = y * CELL + CELL / 2;
  const r = CELL * 0.4;
  const body = frightened ? (flash ? "#fff" : "#1d4ed8") : color;
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(cx, cy - 1, r, Math.PI, 0);
  ctx.lineTo(cx + r, cy + r * 0.7);
  const waves = 3;
  const step = (2 * r) / waves;
  for (let i = 0; i < waves; i++) {
    const wx = cx + r - i * step - step / 2;
    ctx.quadraticCurveTo(wx, cy + r * 0.35, wx - step / 2, cy + r * 0.7);
  }
  ctx.closePath();
  ctx.fill();
  if (!frightened) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 2, 2.4, 0, Math.PI * 2);
    ctx.arc(cx + 3, cy - 2, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.arc(cx - 2.5, cy - 2, 1.2, 0, Math.PI * 2);
    ctx.arc(cx + 3.5, cy - 2, 1.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = flash ? "#1e3a8a" : "#fff";
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 2, 1.5, 0, Math.PI * 2);
    ctx.arc(cx + 3, cy - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

type Phase = "menu" | "ready" | "play" | "dead" | "win";

export function PacManGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(LIVES0);
  const [phase, setPhase] = useState<Phase>("menu");
  const [paused, setPaused] = useState(false);

  const gridRef = useRef<CellKind[][]>([]);
  const pelletsLeftRef = useRef(0);
  const pacRef = useRef({ x: 13, y: 19, dir: "L" as Dir, next: "L" as Dir });
  const ghostsRef = useRef<Ghost[]>(initialGhosts());
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const livesRef = useRef(LIVES0);
  const phaseRef = useRef<Phase>("menu");
  const pausedRef = useRef(false);
  const frightUntilRef = useRef(0);
  const ghostChainRef = useRef(0);
  const stepAtRef = useRef(0);
  const ghostAtRef = useRef(0);
  const mouthRef = useRef(0);
  const readyUntilRef = useRef(0);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const esRef = useRef(es);
  esRef.current = es;

  useEffect(() => {
    const b = readBestScore("pacman");
    setBest(b);
    bestRef.current = b;
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const resetLevel = useCallback((keepScore: boolean) => {
    const { grid, pellets } = parseMaze();
    gridRef.current = grid.map((row) => [...row]);
    pelletsLeftRef.current = pellets;
    pacRef.current = { x: 13, y: 19, dir: "L", next: "L" };
    ghostsRef.current = initialGhosts();
    frightUntilRef.current = 0;
    ghostChainRef.current = 0;
    if (!keepScore) {
      scoreRef.current = 0;
      setScore(0);
      livesRef.current = LIVES0;
      setLives(LIVES0);
    }
  }, []);

  const beginPlay = useCallback(() => {
    resetLevel(false);
    setPhase("ready");
    phaseRef.current = "ready";
    readyUntilRef.current = performance.now() + 1500;
    stepAtRef.current = performance.now() + 1500;
    ghostAtRef.current = performance.now() + 1500;
    setPaused(false);
    pausedRef.current = false;
  }, [resetLevel]);

  const afterDeath = useCallback(() => {
    if (livesRef.current <= 0) {
      setPhase("dead");
      phaseRef.current = "dead";
      const nb = writeBestScore("pacman", Math.max(bestRef.current, scoreRef.current));
      bestRef.current = nb;
      setBest(nb);
      return;
    }
    pacRef.current = { x: 13, y: 19, dir: "L", next: "L" };
    ghostsRef.current = initialGhosts();
    frightUntilRef.current = 0;
    setPhase("ready");
    phaseRef.current = "ready";
    readyUntilRef.current = performance.now() + 1200;
    stepAtRef.current = performance.now() + 1200;
    ghostAtRef.current = performance.now() + 1200;
  }, []);

  const setDir = useCallback(
    (d: Dir) => {
      const ph = phaseRef.current;
      if (ph === "menu" || ph === "dead" || ph === "win") {
        beginPlay();
        pacRef.current.next = d;
        return;
      }
      pacRef.current.next = d;
      if (ph === "ready") {
        setPhase("play");
        phaseRef.current = "play";
        const now = performance.now();
        stepAtRef.current = now;
        ghostAtRef.current = now;
      }
    },
    [beginPlay],
  );

  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      const ph = phaseRef.current;
      if (ph === "ready" && now >= readyUntilRef.current) {
        setPhase("play");
        phaseRef.current = "play";
        stepAtRef.current = now;
        ghostAtRef.current = now;
      }

      if (ph === "play" && !pausedRef.current) {
        if (now - stepAtRef.current >= STEP_MS) {
          stepAtRef.current += STEP_MS;
          if (now - stepAtRef.current > STEP_MS * 2) stepAtRef.current = now;
          const pac = pacRef.current;
          const grid = gridRef.current;
          const tryDir = pac.next;
          const tx = pac.x + DELTA[tryDir].x;
          const ty = pac.y + DELTA[tryDir].y;
          if (walkable(grid, tx, ty, false)) {
            pac.dir = tryDir;
          }
          const nx = pac.x + DELTA[pac.dir].x;
          const ny = pac.y + DELTA[pac.dir].y;
          if (walkable(grid, nx, ny, false)) {
            const w = wrap(nx, ny);
            pac.x = w.x;
            pac.y = w.y;
          }
          const cell = grid[pac.y]![pac.x]!;
          if (cell === "pellet") {
            grid[pac.y]![pac.x] = "empty";
            pelletsLeftRef.current--;
            scoreRef.current += 10;
            setScore(scoreRef.current);
          } else if (cell === "power") {
            grid[pac.y]![pac.x] = "empty";
            pelletsLeftRef.current--;
            scoreRef.current += 50;
            setScore(scoreRef.current);
            frightUntilRef.current = now + FRIGHT_MS;
            ghostChainRef.current = 0;
          }
          if (pelletsLeftRef.current <= 0) {
            setPhase("win");
            phaseRef.current = "win";
            const nb = writeBestScore("pacman", Math.max(bestRef.current, scoreRef.current));
            bestRef.current = nb;
            setBest(nb);
          }
          mouthRef.current = (mouthRef.current + 1) % 4;
        }

        if (now - ghostAtRef.current >= GHOST_STEP) {
          ghostAtRef.current += GHOST_STEP;
          if (now - ghostAtRef.current > GHOST_STEP * 2) ghostAtRef.current = now;
          const frightened = now < frightUntilRef.current;
          const pac = pacRef.current;
          const grid = gridRef.current;
          for (const g of ghostsRef.current) {
            const target =
              frightened
                ? g.corner
                : g.name === "clyde" && dist(g, pac) < 8
                  ? g.corner
                  : { x: Math.round(pac.x), y: Math.round(pac.y) };
            const aim =
              !frightened && g.name === "pinky"
                ? {
                    x: Math.round(pac.x) + DELTA[pac.dir].x * 4,
                    y: Math.round(pac.y) + DELTA[pac.dir].y * 4,
                  }
                : target;
            g.dir = pickGhostDir(g, grid, aim, frightened);
            const nx = g.x + DELTA[g.dir].x;
            const ny = g.y + DELTA[g.dir].y;
            if (walkable(grid, nx, ny, true)) {
              const w = wrap(nx, ny);
              g.x = w.x;
              g.y = w.y;
            }
          }
        }

        if (phaseRef.current === "play") {
          const pac = pacRef.current;
          const frightened = now < frightUntilRef.current;
          for (let i = 0; i < ghostsRef.current.length; i++) {
            const g = ghostsRef.current[i]!;
            if (Math.abs(g.x - pac.x) < 0.6 && Math.abs(g.y - pac.y) < 0.6) {
              if (frightened) {
                const pts = 200 * Math.pow(2, ghostChainRef.current);
                ghostChainRef.current = Math.min(ghostChainRef.current + 1, 3);
                scoreRef.current += pts;
                setScore(scoreRef.current);
                g.x = 13;
                g.y = 13;
                g.dir = "U";
              } else {
                livesRef.current -= 1;
                setLives(livesRef.current);
                afterDeath();
                break;
              }
            }
          }
        }
      }

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        if (!gridRef.current.length) {
          const p = parseMaze();
          gridRef.current = p.grid;
          pelletsLeftRef.current = p.pellets;
        }
        const grid = gridRef.current;
        drawMaze(ctx, grid);
        const pac = pacRef.current;
        const mouth = (Math.sin(mouthRef.current * 0.9) + 1) / 2;
        if (phaseRef.current !== "dead" || livesRef.current > 0) {
          drawPac(ctx, pac.x, pac.y, pac.dir, mouth);
        }
        const frightened = now < frightUntilRef.current;
        const flash = frightened && frightUntilRef.current - now < 2000 && Math.floor(now / 150) % 2 === 0;
        for (const g of ghostsRef.current) {
          drawGhost(ctx, g.x, g.y, g.color, frightened, flash);
        }

        ctx.fillStyle = "rgba(2,6,23,0.75)";
        ctx.fillRect(0, 0, W, 16);
        ctx.fillStyle = "#fde68a";
        ctx.font = "bold 10px system-ui,sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${esRef.current ? "Pts" : "Score"} ${scoreRef.current}`, 6, 11);
        ctx.textAlign = "right";
        ctx.fillText("❤️".repeat(Math.max(0, livesRef.current)), W - 6, 11);
        ctx.textAlign = "left";

        if (phaseRef.current === "menu" || phaseRef.current === "dead" || phaseRef.current === "win") {
          ctx.fillStyle = "rgba(0,0,0,0.55)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#facc15";
          ctx.font = "bold 22px system-ui,sans-serif";
          ctx.textAlign = "center";
          const title =
            phaseRef.current === "win"
              ? esRef.current
                ? "¡Nivel completo!"
                : "Level clear!"
              : phaseRef.current === "dead"
                ? "Game Over"
                : "PAC-MAN";
          ctx.fillText(title, W / 2, H / 2 - 20);
          ctx.fillStyle = "#e2e8f0";
          ctx.font = "12px system-ui,sans-serif";
          ctx.fillText(
            esRef.current ? "Espacio o tocá para jugar" : "Space or tap to play",
            W / 2,
            H / 2 + 8,
          );
          ctx.fillText(`${esRef.current ? "Mejor" : "Best"}: ${bestRef.current}`, W / 2, H / 2 + 28);
          ctx.textAlign = "left";
        } else if (phaseRef.current === "ready") {
          ctx.fillStyle = "#facc15";
          ctx.font = "bold 16px system-ui,sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(esRef.current ? "¡Listo!" : "Ready!", W / 2, H / 2);
          ctx.textAlign = "left";
        } else if (pausedRef.current) {
          ctx.fillStyle = "rgba(0,0,0,0.4)";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 16px system-ui,sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(esRef.current ? "Pausa" : "Paused", W / 2, H / 2);
          ctx.textAlign = "left";
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [afterDeath]);

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
        setDir(next);
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (phaseRef.current === "menu" || phaseRef.current === "dead" || phaseRef.current === "win") {
          beginPlay();
        } else if (phaseRef.current === "play" || phaseRef.current === "ready") {
          setPaused((p) => {
            pausedRef.current = !p;
            return !p;
          });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDir, beginPlay]);

  const onTouchStart = (e: ReactTouchEvent) => {
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
    if (Math.abs(dx) < 14 && Math.abs(dy) < 14) {
      if (phaseRef.current === "menu" || phaseRef.current === "dead" || phaseRef.current === "win") beginPlay();
      return;
    }
    const next: Dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "R" : "L") : dy > 0 ? "D" : "U";
    setDir(next);
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-100/90">
        <span>
          {es ? "Mejor" : "Best"}: <span className="tabular-nums text-amber-300">{best}</span>
        </span>
        <span className="tabular-nums text-white">
          {score} · {"❤️".repeat(Math.max(0, lives))}
        </span>
        <div className="flex gap-2">
          {(phase === "menu" || phase === "dead" || phase === "win") && (
            <GamePrimaryButton onClick={beginPlay}>{es ? "Jugar" : "Play"}</GamePrimaryButton>
          )}
          {(phase === "play" || phase === "ready") && (
            <>
              <GameSecondaryButton
                active={paused}
                onClick={() => {
                  setPaused((p) => {
                    pausedRef.current = !p;
                    return !p;
                  });
                }}
              >
                {paused ? (es ? "Seguir" : "Resume") : es ? "Pausa" : "Pause"}
              </GameSecondaryButton>
              <GamePrimaryButton onClick={beginPlay}>{es ? "Reiniciar" : "Restart"}</GamePrimaryButton>
            </>
          )}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="touch-none rounded-xl border border-blue-500/30 bg-slate-950 shadow-[0_0_40px_rgba(37,99,235,0.25)]"
        style={{ width: "100%", maxWidth: W, height: "auto" }}
      />
      <p className="text-center text-[11px] text-white/50">
        {es
          ? "Flechas / WASD o deslizá · espacio = pausa / nueva partida · comé puntos y evitá fantasmas"
          : "Arrows / WASD or swipe · space = pause / new game · eat dots, avoid ghosts"}
      </p>
    </div>
  );
}
