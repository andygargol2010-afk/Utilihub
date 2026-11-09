// Part 2 of 3 — split from PathfinderGame.tsx on 2026-11-04. Edit here; PathfinderGame.tsx re-exports.
import { type Algo } from "./PathfinderGame.part1";

export type Tool = "wall" | "erase" | "start" | "goal";
export type Cell = { r: number; c: number };

export const ROWS = 12;
export const COLS = 16;

export function key(r: number, c: number) {
  return `${r},${c}`;
}

export function neighbors(r: number, c: number): Cell[] {
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

export function heuristic(a: Cell, b: Cell) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

export type Frame = {
  visited: string[];
  frontier: string[];
  path: string[];
  done: boolean;
  found: boolean;
};

export function runSearch(walls: Set<string>, start: Cell, goal: Cell, algo: Algo): Frame[] {
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

export function randomMaze(start: Cell, goal: Cell): Set<string> {
  const walls = new Set<string>();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if ((r === start.r && c === start.c) || (r === goal.r && c === goal.c)) continue;
      if (Math.random() < 0.28) walls.add(key(r, c));
    }
  }
  return walls;
}
