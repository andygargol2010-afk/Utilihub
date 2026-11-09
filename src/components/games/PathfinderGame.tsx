import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import { type Algo } from "./PathfinderGame.part1";
import { type Cell, ROWS, COLS, type Tool, type Frame, runSearch, key, randomMaze } from "./PathfinderGame.part2";

export function PathfinderGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [walls, setWalls] = useState<Set<string>>(() => new Set());
  const [start, setStart] = useState<Cell>({ r: 2, c: 2 });
  const [goal, setGoal] = useState<Cell>({ r: ROWS - 3, c: COLS - 3 });
  const [tool, setTool] = useState<Tool>("wall");
  const [algo, setAlgo] = useState<Algo>("bfs");
  const [frames, setFrames] = useState<Frame[]>([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const paintRef = useRef(false);

  useEffect(() => {
    setBest(readBestLow("pathfinder"));
  }, []);

  const frame = frames[frameIdx];
  const visited = useMemo(() => new Set(frame?.visited ?? []), [frame]);
  const frontier = useMemo(() => new Set(frame?.frontier ?? []), [frame]);
  const path = useMemo(() => new Set(frame?.path ?? []), [frame]);

  const run = useCallback(() => {
    const f = runSearch(walls, start, goal, algo);
    setFrames(f);
    setFrameIdx(0);
    setPlaying(true);
    const last = f[f.length - 1];
    if (last?.found && last.path.length) {
      setBest(writeBestLow("pathfinder", last.path.length - 1));
    }
  }, [algo, goal, start, walls]);

  useEffect(() => {
    if (!playing || frames.length === 0) return;
    if (frameIdx >= frames.length - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setFrameIdx((i) => i + 1), 28);
    return () => window.clearTimeout(t);
  }, [playing, frameIdx, frames.length]);

  const paint = (r: number, c: number) => {
    if (frames.length) {
      setFrames([]);
      setFrameIdx(0);
      setPlaying(false);
    }
    const k = key(r, c);
    if (tool === "start") {
      if (walls.has(k)) return;
      setStart({ r, c });
      return;
    }
    if (tool === "goal") {
      if (walls.has(k)) return;
      setGoal({ r, c });
      return;
    }
    if ((r === start.r && c === start.c) || (r === goal.r && c === goal.c)) return;
    setWalls((w) => {
      const next = new Set(w);
      if (tool === "wall") next.add(k);
      else next.delete(k);
      return next;
    });
  };

  const clearWalls = () => {
    setWalls(new Set());
    setFrames([]);
    setPlaying(false);
  };

  const maze = () => {
    setWalls(randomMaze(start, goal));
    setFrames([]);
    setPlaying(false);
  };

  const last = frames[frames.length - 1];
  const pathLen = last?.found ? last.path.length - 1 : null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <style>{`
        .pf-board {
          background: linear-gradient(160deg, #0f172a, #020617);
          box-shadow: 0 14px 36px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(148,163,184,0.12);
        }
        .pf-cell {
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
        }
        .pf-wall {
          background: repeating-linear-gradient(45deg, #0f172a, #0f172a 3px, #1e293b 3px, #1e293b 6px) !important;
        }
        .pf-path {
          box-shadow: 0 0 10px rgba(251,191,36,0.55) !important;
        }
      `}</style>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["wall", es ? "Pared" : "Wall"],
            ["erase", es ? "Borrar" : "Erase"],
            ["start", es ? "Inicio" : "Start"],
            ["goal", es ? "Meta" : "Goal"],
          ] as const
        ).map(([t, label]) => (
          <GameSecondaryButton key={t} active={tool === t} onClick={() => setTool(t)}>
            {label}
          </GameSecondaryButton>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <GameSecondaryButton active={algo === "bfs"} onClick={() => setAlgo("bfs")}>
          BFS
        </GameSecondaryButton>
        <GameSecondaryButton active={algo === "astar"} onClick={() => setAlgo("astar")}>
          A*
        </GameSecondaryButton>
        <GamePrimaryButton onClick={run}>{es ? "Buscar" : "Find path"}</GamePrimaryButton>
        <GameSecondaryButton onClick={maze}>{es ? "Laberinto" : "Maze"}</GameSecondaryButton>
        <GameSecondaryButton onClick={clearWalls}>{es ? "Limpiar" : "Clear"}</GameSecondaryButton>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-emerald-100/75">
        <span>
          {es ? "Visitados" : "Visited"}:{" "}
          <strong className="text-white">{frame?.visited.length ?? 0}</strong>
        </span>
        {pathLen != null && (
          <span>
            {es ? "Largo del camino" : "Path length"}:{" "}
            <strong className="text-amber-300">{pathLen}</strong>
          </span>
        )}
        {best != null && (
          <span>
            {es ? "Mejor" : "Best"}: <strong className="text-amber-200">{best}</strong>
          </span>
        )}
        {last?.done && !last.found && (
          <span className="text-rose-300">{es ? "Sin camino" : "No path"}</span>
        )}
      </div>

      <div
        className="pf-board select-none rounded-2xl border border-white/10 p-2.5"
        onMouseLeave={() => {
          paintRef.current = false;
        }}
        onMouseUp={() => {
          paintRef.current = false;
        }}
        onTouchEnd={() => {
          paintRef.current = false;
        }}
      >
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const r = Math.floor(i / COLS);
            const c = i % COLS;
            const k = key(r, c);
            const isStart = r === start.r && c === start.c;
            const isGoal = r === goal.r && c === goal.c;
            const isWall = walls.has(k);
            const isPath = path.has(k);
            const isFront = frontier.has(k);
            const isVis = visited.has(k);

            let bg = "bg-slate-700/70";
            let extra = "";
            if (isWall) { bg = "bg-slate-950"; extra = "pf-wall"; }
            else if (isPath) { bg = "bg-amber-400"; extra = "pf-path"; }
            else if (isFront) bg = "bg-sky-500/75";
            else if (isVis) bg = "bg-emerald-700/55";
            if (isStart) { bg = "bg-emerald-400"; extra = ""; }
            if (isGoal) { bg = "bg-rose-400"; extra = ""; }

            return (
              <button
                key={k}
                type="button"
                aria-label={`cell ${r},${c}`}
                className={`pf-cell aspect-square rounded-[3px] ${bg} ${extra} transition-colors duration-100`}
                onMouseDown={() => {
                  paintRef.current = true;
                  paint(r, c);
                }}
                onMouseEnter={() => {
                  if (paintRef.current && (tool === "wall" || tool === "erase")) paint(r, c);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  paintRef.current = true;
                  paint(r, c);
                }}
              />
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-white/50">
        {es
          ? "Verde = inicio · Rojo = meta · Ámbar = camino · Celeste = frontera · Verde oscuro = visitado"
          : "Green = start · Red = goal · Amber = path · Sky = frontier · Dark green = visited"}
      </p>
    </div>
  );
}
