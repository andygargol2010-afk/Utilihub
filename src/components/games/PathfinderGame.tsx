import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Algo = "bfs" | "astar";
type Tool = "wall" | "erase" | "start" | "goal";
type Cell = { r: number; c: number };

const ROWS = 12;
const COLS = 16;

function key(r: number, c: number) {
  return `${r},${c}`;
}

function neighbors(r: number, c: number): Cell[] {
  const out: Cell[] = [];
  for (const [dr, dc] of [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ] as const) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push({ r: nr, c: nc });
  }
  return out;
}

function heuristic(a: Cell, b: Cell) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

type Frame = {
  visited: string[];
  frontier: string[];
  path: string[];
  done: boolean;
  found: boolean;
};

function runSearch(walls: Set<string>, start: Cell, goal: Cell, algo: Algo): Frame[] {
  const frames: Frame[] = [];
  const wall = (r: number, c: number) => walls.has(key(r, c));
  const visited = new Set<string>();
  const came = new Map<string, string | null>();
  const gScore = new Map<string, number>();

  type Node = { cell: Cell; f: number };
  const open: Node[] = [{ cell: start, f: algo === "astar" ? heuristic(start, goal) : 0 }];
  came.set(key(start.r, start.c), null);
  gScore.set(key(start.r, start.c), 0);

  const snapshot = (frontier: Cell[], done: boolean, found: boolean, path: Cell[]) => {
    frames.push({
      visited: [...visited],
      frontier: frontier.map((c) => key(c.r, c.c)),
      path: path.map((c) => key(c.r, c.c)),
      done,
      found,
    });
  };

  snapshot([start], false, false, []);

  let foundPath: Cell[] | null = null;

  while (open.length) {
    if (algo === "astar") open.sort((a, b) => a.f - b.f);
    const cur = open.shift()!.cell;
    const ck = key(cur.r, cur.c);
    if (visited.has(ck)) continue;
    visited.add(ck);

    if (cur.r === goal.r && cur.c === goal.c) {
      const path: Cell[] = [];
      let k: string | null = ck;
      while (k) {
        const [r, c] = k.split(",").map(Number) as [number, number];
        path.push({ r, c });
        k = came.get(k) ?? null;
      }
      path.reverse();
      foundPath = path;
      snapshot(
        open.map((n) => n.cell),
        true,
        true,
        path,
      );
      break;
    }

    for (const n of neighbors(cur.r, cur.c)) {
      if (wall(n.r, n.c)) continue;
      const nk = key(n.r, n.c);
      if (visited.has(nk)) continue;
      const tentative = (gScore.get(ck) ?? 0) + 1;
      if (tentative < (gScore.get(nk) ?? Infinity)) {
        came.set(nk, ck);
        gScore.set(nk, tentative);
        const f = algo === "astar" ? tentative + heuristic(n, goal) : tentative;
        open.push({ cell: n, f });
      }
    }

    snapshot(
      open.map((n) => n.cell),
      false,
      false,
      [],
    );

    if (frames.length > ROWS * COLS * 2) break;
  }

  if (!foundPath) snapshot([], true, false, []);
  return frames;
}

function randomMaze(start: Cell, goal: Cell): Set<string> {
  const walls = new Set<string>();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if ((r === start.r && c === start.c) || (r === goal.r && c === goal.c)) continue;
      if (Math.random() < 0.28) walls.add(key(r, c));
    }
  }
  return walls;
}

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
        className="select-none rounded-2xl border border-white/10 bg-black/50 p-2"
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

            let bg = "bg-slate-800/80";
            if (isWall) bg = "bg-slate-950";
            else if (isPath) bg = "bg-amber-400";
            else if (isFront) bg = "bg-sky-500/70";
            else if (isVis) bg = "bg-emerald-700/60";
            if (isStart) bg = "bg-emerald-400";
            if (isGoal) bg = "bg-rose-400";

            return (
              <button
                key={k}
                type="button"
                aria-label={`cell ${r},${c}`}
                className={`aspect-square rounded-[3px] ${bg} transition-colors`}
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
