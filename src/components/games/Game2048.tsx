import { useCallback, useEffect, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton } from "./GameShell";

type Board = number[][];

function emptyBoard(): Board {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
}

function spawn(board: Board): Board {
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (!board[r]![c]) empty.push([r, c]);
  if (!empty.length) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]!;
  const next = board.map((row) => row.slice());
  next[r]![c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function initBoard(): Board {
  return spawn(spawn(emptyBoard()));
}

function slideRow(row: number[]): { row: number[]; gained: number } {
  const filtered = row.filter((n) => n !== 0);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const v = filtered[i]! * 2;
      out.push(v);
      gained += v;
      i++;
    } else {
      out.push(filtered[i]!);
    }
  }
  while (out.length < 4) out.push(0);
  return { row: out, gained };
}

function transpose(b: Board): Board {
  return [0, 1, 2, 3].map((c) => [0, 1, 2, 3].map((r) => b[r]![c]!));
}

function applyLeft(b: Board): { board: Board; gained: number } {
  let gained = 0;
  const board = b.map((row) => {
    const { row: nr, gained: g } = slideRow(row);
    gained += g;
    return nr;
  });
  return { board, gained };
}

function move(board: Board, dir: "L" | "R" | "U" | "D"): { board: Board; gained: number; moved: boolean } {
  let working = board.map((r) => r.slice());
  let gained = 0;

  if (dir === "L") {
    const res = applyLeft(working);
    working = res.board;
    gained = res.gained;
  } else if (dir === "R") {
    const flipped = working.map((r) => r.slice().reverse());
    const res = applyLeft(flipped);
    working = res.board.map((r) => r.slice().reverse());
    gained = res.gained;
  } else if (dir === "U") {
    const t = transpose(working);
    const res = applyLeft(t);
    working = transpose(res.board);
    gained = res.gained;
  } else {
    const t = transpose(working).map((r) => r.slice().reverse());
    const res = applyLeft(t);
    working = transpose(res.board.map((r) => r.slice().reverse()));
    gained = res.gained;
  }

  const moved = working.some((row, r) => row.some((v, c) => v !== board[r]![c]));
  return { board: working, gained, moved };
}

function canMove(board: Board) {
  for (const dir of ["L", "R", "U", "D"] as const) {
    if (move(board, dir).moved) return true;
  }
  return false;
}

const TILE: Record<number, { bg: string; color: string; size: string }> = {
  0: { bg: "#cdc1b4", color: "transparent", size: "text-2xl" },
  2: { bg: "#eee4da", color: "#776e65", size: "text-3xl" },
  4: { bg: "#ede0c8", color: "#776e65", size: "text-3xl" },
  8: { bg: "#f2b179", color: "#f9f6f2", size: "text-3xl" },
  16: { bg: "#f59563", color: "#f9f6f2", size: "text-3xl" },
  32: { bg: "#f67c5f", color: "#f9f6f2", size: "text-3xl" },
  64: { bg: "#f65e3b", color: "#f9f6f2", size: "text-3xl" },
  128: { bg: "#edcf72", color: "#f9f6f2", size: "text-2xl" },
  256: { bg: "#edcc61", color: "#f9f6f2", size: "text-2xl" },
  512: { bg: "#edc850", color: "#f9f6f2", size: "text-2xl" },
  1024: { bg: "#edc53f", color: "#f9f6f2", size: "text-xl" },
  2048: { bg: "#edc22e", color: "#f9f6f2", size: "text-xl" },
};

function tileStyle(v: number) {
  return TILE[v] ?? { bg: "#3c3a32", color: "#f9f6f2", size: "text-lg" };
}

export function Game2048({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState<Board>(() => initBoard());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setBest(readBestScore("2048"));
  }, []);

  const reset = useCallback(() => {
    setBoard(initBoard());
    setScore(0);
    setWon(false);
    setOver(false);
  }, []);

  const applyDir = useCallback(
    (dir: "L" | "R" | "U" | "D") => {
      if (over) return;
      const { board: next, gained, moved } = move(board, dir);
      if (!moved) return;
      const withSpawn = spawn(next);
      const newScore = score + gained;
      setBoard(withSpawn);
      setScore(newScore);
      setBest((b) => writeBestScore("2048", Math.max(b, newScore)));
      if (!won && withSpawn.some((row) => row.some((v) => v >= 2048))) setWon(true);
      if (!canMove(withSpawn)) setOver(true);
    },
    [board, over, score, won],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, "L" | "R" | "U" | "D"> = {
        ArrowLeft: "L",
        ArrowRight: "R",
        ArrowUp: "U",
        ArrowDown: "D",
        a: "L",
        d: "R",
        w: "U",
        s: "D",
        A: "L",
        D: "R",
        W: "U",
        S: "D",
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        applyDir(dir);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyDir]);

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex gap-2">
          <div className="rounded-lg px-3 py-1.5 text-center" style={{ background: "#bbada0" }}>
            <div className="text-[10px] font-bold uppercase tracking-wide text-white/80">{es ? "Puntos" : "Score"}</div>
            <div className="text-lg font-black tabular-nums text-white">{score}</div>
          </div>
          <div className="rounded-lg px-3 py-1.5 text-center" style={{ background: "#bbada0" }}>
            <div className="text-[10px] font-bold uppercase tracking-wide text-white/80">{es ? "Mejor" : "Best"}</div>
            <div className="text-lg font-black tabular-nums text-white">{best}</div>
          </div>
        </div>
        <GamePrimaryButton onClick={reset}>{es ? "Nuevo" : "New"}</GamePrimaryButton>
      </div>

      {(won || over) && (
        <p className="text-sm font-bold text-emerald-300">
          {over ? (es ? "Sin movimientos" : "No moves left") : es ? "¡2048!" : "You reached 2048!"}
        </p>
      )}

      <div
        className="touch-none rounded-xl p-3 shadow-lg"
        style={{ background: "#bbada0" }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (t) setTouchStart({ x: t.clientX, y: t.clientY });
        }}
        onTouchEnd={(e) => {
          const t = e.changedTouches[0];
          if (!touchStart || !t) return;
          const dx = t.clientX - touchStart.x;
          const dy = t.clientY - touchStart.y;
          if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
          if (Math.abs(dx) > Math.abs(dy)) applyDir(dx > 0 ? "R" : "L");
          else applyDir(dy > 0 ? "D" : "U");
          setTouchStart(null);
        }}
      >
        <div className="grid grid-cols-4 gap-2.5">
          {board.flatMap((row, r) =>
            row.map((v, c) => {
              const style = tileStyle(v);
              return (
                <div
                  key={`${r}-${c}`}
                  className={`flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-md font-black sm:h-[4.75rem] sm:w-[4.75rem] ${style.size}`}
                  style={{
                    background: style.bg,
                    color: style.color,
                    boxShadow: v ? "0 2px 0 rgba(0,0,0,0.12)" : undefined,
                  }}
                >
                  {v || ""}
                </div>
              );
            }),
          )}
        </div>
      </div>

      <p className="text-center text-[11px] text-white/50">
        {es ? "Flechas / WASD o swipe" : "Arrows / WASD or swipe"}
      </p>
    </div>
  );
}
