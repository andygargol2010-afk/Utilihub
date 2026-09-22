import { useCallback, useEffect, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton } from "./GameShell";

type Dir = "L" | "R" | "U" | "D";

type Tile = {
  id: number;
  value: number;
  r: number;
  c: number;
  born?: boolean;
  merged?: boolean;
};

const GAP = 10;
const CELL = 72;
const PAD = 12;
const BOARD = PAD * 2 + CELL * 4 + GAP * 3;

let nextId = 1;
function uid() {
  return nextId++;
}

const TILE_STYLE: Record<number, { bg: string; color: string; size: string }> = {
  2: { bg: "#eee4da", color: "#776e65", size: "28px" },
  4: { bg: "#ede0c8", color: "#776e65", size: "28px" },
  8: { bg: "#f2b179", color: "#f9f6f2", size: "28px" },
  16: { bg: "#f59563", color: "#f9f6f2", size: "28px" },
  32: { bg: "#f67c5f", color: "#f9f6f2", size: "28px" },
  64: { bg: "#f65e3b", color: "#f9f6f2", size: "28px" },
  128: { bg: "#edcf72", color: "#f9f6f2", size: "24px" },
  256: { bg: "#edcc61", color: "#f9f6f2", size: "24px" },
  512: { bg: "#edc850", color: "#f9f6f2", size: "24px" },
  1024: { bg: "#edc53f", color: "#f9f6f2", size: "20px" },
  2048: { bg: "#edc22e", color: "#f9f6f2", size: "20px" },
};

function styleFor(v: number) {
  return TILE_STYLE[v] ?? { bg: "#3c3a32", color: "#f9f6f2", size: "18px" };
}

function pos(r: number, c: number) {
  return {
    x: PAD + c * (CELL + GAP),
    y: PAD + r * (CELL + GAP),
  };
}

function emptyCells(tiles: Tile[]): [number, number][] {
  const taken = new Set(tiles.map((t) => `${t.r},${t.c}`));
  const out: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (!taken.has(`${r},${c}`)) out.push([r, c]);
  }
  return out;
}

function spawnTile(tiles: Tile[]): Tile | null {
  const empty = emptyCells(tiles);
  if (!empty.length) return null;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]!;
  return { id: uid(), value: Math.random() < 0.9 ? 2 : 4, r, c, born: true };
}

function initTiles(): Tile[] {
  const a = spawnTile([]);
  const b = a ? spawnTile([a]) : null;
  return [a, b].filter(Boolean) as Tile[];
}

function slideLine(
  line: Tile[],
  place: (indexInLine: number) => { r: number; c: number },
): { tiles: Tile[]; gained: number } {
  const compact = line.slice();
  const result: Tile[] = [];
  let gained = 0;
  let slot = 0;
  let i = 0;
  while (i < compact.length) {
    const cur = compact[i]!;
    if (i + 1 < compact.length && compact[i + 1]!.value === cur.value) {
      const other = compact[i + 1]!;
      const p = place(slot);
      result.push({
        id: cur.id,
        value: cur.value * 2,
        r: p.r,
        c: p.c,
        merged: true,
      });
      gained += cur.value * 2;
      void other;
      i += 2;
      slot++;
    } else {
      const p = place(slot);
      result.push({ id: cur.id, value: cur.value, r: p.r, c: p.c });
      i += 1;
      slot++;
    }
  }
  return { tiles: result, gained };
}

function moveTiles(tiles: Tile[], dir: Dir): { tiles: Tile[]; gained: number; moved: boolean } {
  const clear = tiles.map((t) => ({ ...t, born: false, merged: false }));
  let gained = 0;
  const next: Tile[] = [];

  if (dir === "L" || dir === "R") {
    for (let r = 0; r < 4; r++) {
      const row = clear.filter((t) => t.r === r).sort((a, b) => a.c - b.c);
      const ordered = dir === "L" ? row : row.slice().reverse();
      const { tiles: slid, gained: g } = slideLine(ordered, (i) => ({
        r,
        c: dir === "L" ? i : 3 - i,
      }));
      next.push(...slid);
      gained += g;
    }
  } else {
    for (let c = 0; c < 4; c++) {
      const col = clear.filter((t) => t.c === c).sort((a, b) => a.r - b.r);
      const ordered = dir === "U" ? col : col.slice().reverse();
      const { tiles: slid, gained: g } = slideLine(ordered, (i) => ({
        r: dir === "U" ? i : 3 - i,
        c,
      }));
      next.push(...slid);
      gained += g;
    }
  }

  const moved =
    next.length !== clear.length ||
    next.some((t) => {
      const old = clear.find((o) => o.id === t.id);
      return !old || old.r !== t.r || old.c !== t.c || old.value !== t.value;
    });

  return { tiles: next, gained, moved };
}

function canMove(tiles: Tile[]): boolean {
  if (emptyCells(tiles).length) return true;
  for (const dir of ["L", "R", "U", "D"] as Dir[]) {
    if (moveTiles(tiles, dir).moved) return true;
  }
  return false;
}

export function Game2048({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [tiles, setTiles] = useState<Tile[]>(() => initTiles());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const [animOn, setAnimOn] = useState(true);
  const lockRef = useRef(false);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setBest(readBestScore("2048"));
  }, []);

  const reset = useCallback(() => {
    nextId = 1;
    setAnimOn(false);
    setTiles(initTiles());
    setScore(0);
    setWon(false);
    setOver(false);
    lockRef.current = false;
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimOn(true)));
  }, []);

  const applyDir = useCallback(
    (dir: Dir) => {
      if (over || lockRef.current) return;
      const { tiles: moved, gained, moved: didMove } = moveTiles(tiles, dir);
      if (!didMove) return;

      lockRef.current = true;
      setTiles(moved);
      setScore((s) => {
        const n = s + gained;
        setBest((b) => writeBestScore("2048", Math.max(b, n)));
        return n;
      });

      window.setTimeout(() => {
        setTiles((cur) => {
          const cleaned = cur.map((t) => ({ ...t, born: false, merged: false }));
          const baby = spawnTile(cleaned);
          const final = baby ? [...cleaned, baby] : cleaned;
          if (!won && final.some((t) => t.value >= 2048)) setWon(true);
          if (!canMove(final)) setOver(true);
          return final;
        });
        lockRef.current = false;
      }, 160);
    },
    [tiles, over, won],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
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
      <style>{`
        @keyframes uh2048-pop {
          0% { transform: scale(0.55); opacity: 0.5; }
          70% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes uh2048-merge {
          0% { transform: scale(1); }
          45% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .uh2048-born { animation: uh2048-pop 0.22s ease-out; }
        .uh2048-merged { animation: uh2048-merge 0.2s ease-out; }
      `}</style>

      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex gap-2">
          <div className="rounded-lg px-3 py-1.5 text-center" style={{ background: "#bbada0" }}>
            <div className="text-[10px] font-bold uppercase tracking-wide text-white/80">
              {es ? "Puntos" : "Score"}
            </div>
            <div className="text-lg font-black tabular-nums text-white">{score}</div>
          </div>
          <div className="rounded-lg px-3 py-1.5 text-center" style={{ background: "#bbada0" }}>
            <div className="text-[10px] font-bold uppercase tracking-wide text-white/80">
              {es ? "Mejor" : "Best"}
            </div>
            <div className="text-lg font-black tabular-nums text-white">{best}</div>
          </div>
        </div>
        <GamePrimaryButton onClick={reset}>{es ? "Nuevo" : "New"}</GamePrimaryButton>
      </div>

      {(won || over) && (
        <p className="text-sm font-bold text-emerald-300">
          {over
            ? es
              ? "Sin movimientos"
              : "No moves left"
            : es
              ? "¡2048! Podés seguir jugando"
              : "2048! Keep going"}
        </p>
      )}

      <div
        className="relative touch-none rounded-xl shadow-lg"
        style={{ width: BOARD, height: BOARD, background: "#bbada0", maxWidth: "100%" }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (t) touchRef.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touchRef.current;
          const t = e.changedTouches[0];
          if (!start || !t) return;
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
          if (Math.abs(dx) > Math.abs(dy)) applyDir(dx > 0 ? "R" : "L");
          else applyDir(dy > 0 ? "D" : "U");
        }}
      >
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => {
            const { x, y } = pos(r, c);
            return (
              <div
                key={`slot-${r}-${c}`}
                className="absolute rounded-md"
                style={{
                  left: x,
                  top: y,
                  width: CELL,
                  height: CELL,
                  background: "#cdc1b4",
                }}
              />
            );
          }),
        )}

        {tiles.map((t) => {
          const { x, y } = pos(t.r, t.c);
          const st = styleFor(t.value);
          return (
            <div
              key={t.id}
              className="absolute"
              style={{
                left: x,
                top: y,
                width: CELL,
                height: CELL,
                transition: animOn ? "left 120ms ease-in-out, top 120ms ease-in-out" : "none",
                zIndex: t.merged ? 2 : 1,
              }}
            >
              <div
                className={`flex h-full w-full items-center justify-center rounded-md font-black ${
                  t.born ? "uh2048-born" : t.merged ? "uh2048-merged" : ""
                }`}
                style={{
                  background: st.bg,
                  color: st.color,
                  fontSize: st.size,
                  boxShadow: "0 2px 0 rgba(0,0,0,0.12)",
                }}
              >
                {t.value}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-white/50">
        {es ? "Flechas / WASD o swipe — las fichas se deslizan" : "Arrows / WASD or swipe — tiles slide"}
      </p>
    </div>
  );
}
