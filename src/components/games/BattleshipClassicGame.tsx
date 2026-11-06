import { useCallback, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type CellState = "empty" | "ship" | "hit" | "miss" | "sunk";
type Phase = "placement" | "playing" | "over";
type Pos = [number, number];
type Ship = { id: string; cells: Pos[]; sunk: boolean };

const SIZE = 10;
const SHIPS = [
  { id: "carrier", len: 5, nameEn: "Carrier", nameEs: "Portaaviones" },
  { id: "battleship", len: 4, nameEn: "Battleship", nameEs: "Acorazado" },
  { id: "cruiser", len: 3, nameEn: "Cruiser", nameEs: "Crucero" },
  { id: "submarine", len: 3, nameEn: "Submarine", nameEs: "Submarino" },
  { id: "destroyer", len: 2, nameEn: "Destroyer", nameEs: "Destructor" },
];

function makeEmpty(): CellState[][] {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill("empty" as CellState));
}

function canPlace(board: CellState[][], r: number, c: number, len: number, horiz: boolean): boolean {
  for (let i = 0; i < len; i++) {
    const rr = horiz ? r : r + i;
    const cc = horiz ? c + i : c;
    if (rr >= SIZE || cc >= SIZE || board[rr]![cc] !== "empty") return false;
  }
  return true;
}

function placeShipCells(board: CellState[][], r: number, c: number, len: number, horiz: boolean): { board: CellState[][]; cells: Pos[] } {
  const next = board.map((row) => [...row]);
  const cells: Pos[] = [];
  for (let i = 0; i < len; i++) {
    const rr = horiz ? r : r + i;
    const cc = horiz ? c + i : c;
    next[rr]![cc] = "ship";
    cells.push([rr, cc]);
  }
  return { board: next, cells };
}

function randomPlace(): { board: CellState[][]; ships: Ship[] } {
  let board = makeEmpty();
  const ships: Ship[] = [];
  for (const ship of SHIPS) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 300) {
      const horiz = Math.random() > 0.5;
      const maxR = horiz ? SIZE : SIZE - ship.len + 1;
      const maxC = horiz ? SIZE - ship.len + 1 : SIZE;
      const r = Math.floor(Math.random() * maxR);
      const c = Math.floor(Math.random() * maxC);
      if (canPlace(board, r, c, ship.len, horiz)) {
        const res = placeShipCells(board, r, c, ship.len, horiz);
        board = res.board;
        ships.push({ id: ship.id, cells: res.cells, sunk: false });
        placed = true;
      }
      attempts++;
    }
  }
  return { board, ships };
}

function markSunkOnBoard(board: CellState[][], ships: Ship[]): CellState[][] {
  const next = board.map((row) => [...row]);
  for (const ship of ships) {
    if (ship.sunk) {
      for (const [r, c] of ship.cells) {
        next[r]![c] = "sunk";
      }
    }
  }
  return next;
}

export function BattleshipClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [phase, setPhase] = useState<Phase>("placement");
  const [ownBoard, setOwnBoard] = useState<CellState[][]>(makeEmpty);
  const [enemyBoard, setEnemyBoard] = useState<CellState[][]>(makeEmpty);
  const [enemyHidden, setEnemyHidden] = useState<CellState[][]>(makeEmpty);
  const [ownShips, setOwnShips] = useState<Ship[]>([]);
  const [enemyShips, setEnemyShips] = useState<Ship[]>([]);
  const [currentShip, setCurrentShip] = useState(0);
  const [horiz, setHoriz] = useState(true);
  const [message, setMessage] = useState(es ? "Colocá tus barcos" : "Place your ships");
  const [winner, setWinner] = useState<"player" | "ai" | null>(null);
  const [shots, setShots] = useState(0);
  const [aiShots, setAiShots] = useState(0);
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState<number | null>(null);
  const [aiHunt, setAiHunt] = useState<Pos[]>([]);
  const [aiLastHit, setAiLastHit] = useState<Pos | null>(null);

  const reset = () => {
    setPhase("placement");
    setOwnBoard(makeEmpty());
    setEnemyBoard(makeEmpty());
    setEnemyHidden(makeEmpty());
    setOwnShips([]);
    setEnemyShips([]);
    setCurrentShip(0);
    setHoriz(true);
    setMessage(es ? "Colocá tus barcos" : "Place your ships");
    setWinner(null);
    setShots(0);
    setAiShots(0);
    setSeed(null);
    setAiHunt([]);
    setAiLastHit(null);
  };

  const randomOwn = () => {
    const res = randomPlace();
    setOwnBoard(res.board);
    setOwnShips(res.ships);
    setCurrentShip(SHIPS.length);
    setMessage(es ? "Barcos al azar. Listo." : "Ships random. Ready.");
  };

  const startGame = () => {
    if (currentShip < SHIPS.length) return;
    const s = Math.floor(Math.random() * 1e9);
    setSeed(s);
    const enemy = randomPlace();
    setEnemyHidden(enemy.board);
    setEnemyShips(enemy.ships);
    setPhase("playing");
    setMessage(es ? "¡Dispará!" : "Fire!");
    const url = new URL(window.location.href);
    url.searchParams.set("seed", String(s));
    window.history.replaceState(null, "", url);
  };

  const placeAt = (r: number, c: number) => {
    if (phase !== "placement" || currentShip >= SHIPS.length) return;
    const shipDef = SHIPS[currentShip]!;
    if (!canPlace(ownBoard, r, c, shipDef.len, horiz)) {
      setMessage(es ? "No se puede colocar" : "Cannot place");
      return;
    }
    const res = placeShipCells(ownBoard, r, c, shipDef.len, horiz);
    setOwnBoard(res.board);
    setOwnShips((prev) => [...prev, { id: shipDef.id, cells: res.cells, sunk: false }]);
    setCurrentShip((s) => s + 1);
    setMessage(
      currentShip + 1 >= SHIPS.length
        ? es
          ? "Listo. Empezá."
          : "Ready. Start."
        : es
          ? "Siguiente barco"
          : "Next ship",
    );
  };

  const checkAndMarkSunk = (ships: Ship[], board: CellState[][], isOwn: boolean) => {
    let changed = false;
    const nextShips = ships.map((ship) => {
      if (ship.sunk) return ship;
      const allHit = ship.cells.every(([rr, cc]) => board[rr]![cc] === "hit" || board[rr]![cc] === "sunk");
      if (allHit) {
        changed = true;
        return { ...ship, sunk: true };
      }
      return ship;
    });
    if (changed) {
      const marked = markSunkOnBoard(board, nextShips);
      if (isOwn) {
        setOwnShips(nextShips);
        setOwnBoard(marked);
      } else {
        setEnemyShips(nextShips);
        setEnemyBoard(marked);
      }
      return nextShips.every((s) => s.sunk);
    }
    return ships.every((s) => s.sunk);
  };

  const aiShoot = useCallback(() => {
    if (phase !== "playing" || winner) return;
    let candidates: Pos[] = [];
    if (aiHunt.length > 0) {
      candidates = aiHunt.filter(([r, c]) => ownBoard[r]![c] !== "hit" && ownBoard[r]![c] !== "miss" && ownBoard[r]![c] !== "sunk");
    }
    if (candidates.length === 0) {
      // random unshot
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const st = ownBoard[r]![c]!;
          if (st === "empty" || st === "ship") candidates.push([r, c]);
        }
      }
    }
    if (candidates.length === 0) return;
    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)]!;
    const hit = ownBoard[r]![c] === "ship";
    setOwnBoard((b) => {
      const next = b.map((row) => [...row]);
      next[r]![c] = hit ? "hit" : "miss";
      return next;
    });
    setAiShots((s) => s + 1);
    setMessage(hit ? (es ? "IA impactó" : "AI hit") : es ? "IA agua" : "AI miss");

    if (hit) {
      setAiLastHit([r, c]);
      const dirs: Pos[] = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
      const nextHunt = dirs.filter(([rr,cc]) => rr>=0 && rr<SIZE && cc>=0 && cc<SIZE && (ownBoard[rr]![cc]==="empty" || ownBoard[rr]![cc]==="ship"));
      setAiHunt(nextHunt);
    } else {
      setAiHunt((h) => h.filter(([rr,cc]) => !(rr===r && cc===c)));
    }

    // check sunk after state update via timeout-ish (simple recheck)
    setTimeout(() => {
      const allSunk = checkAndMarkSunk(ownShips, ownBoard, true);
      if (allSunk) {
        setWinner("ai");
        setPhase("over");
        setMessage(es ? "IA ganó" : "AI won");
      }
    }, 50);
  }, [phase, winner, ownBoard, ownShips, aiHunt, es]);

  const shoot = (r: number, c: number) => {
    if (phase !== "playing" || winner) return;
    if (enemyBoard[r]![c] !== "empty") return;
    const hit = enemyHidden[r]![c] === "ship";
    setEnemyBoard((b) => {
      const next = b.map((row) => [...row]);
      next[r]![c] = hit ? "hit" : "miss";
      return next;
    });
    setShots((s) => s + 1);
    setMessage(hit ? (es ? "¡Impacto!" : "Hit!") : es ? "Agua" : "Miss");

    setTimeout(() => {
      const allSunk = checkAndMarkSunk(enemyShips, enemyBoard, false);
      if (allSunk) {
        setWinner("player");
        setPhase("over");
        setMessage(es ? "¡Ganaste!" : "You won!");
        return;
      }
      setTimeout(() => aiShoot(), 450);
    }, 50);
  };

  const cellClass = (state: CellState, isOwn: boolean) => {
    if (state === "hit") return "bg-rose-500";
    if (state === "sunk") return "bg-rose-700 ring-1 ring-rose-400";
    if (state === "miss") return "bg-sky-400/50";
    if (state === "ship" && isOwn) return "bg-slate-500";
    return "bg-slate-800/70 hover:bg-slate-700";
  };

  const ariaFor = (state: CellState, r: number, c: number, isOwn: boolean) => {
    const loc = es ? (isOwn ? "propia" : "enemiga") : (isOwn ? "own" : "enemy");
    const st =
      state === "hit" ? (es ? "impacto" : "hit") :
      state === "sunk" ? (es ? "hundido" : "sunk") :
      state === "miss" ? (es ? "agua" : "miss") :
      state === "ship" ? (es ? "barco" : "ship") : (es ? "vacío" : "empty");
    return `${loc} ${r+1}-${String.fromCharCode(65+c)} ${st}`;
  };

  const shareUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* silent */
    }
  }, []);

  const exportPng = useCallback(() => {
    const cell = 22;
    const pad = 16;
    const w = SIZE * cell * 2 + pad * 3;
    const h = SIZE * cell + pad * 2 + 40;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Hundir la Flota · UtiliHub" : "Battleship Classic · UtiliHub", w / 2, 22);
    const drawBoard = (board: CellState[][], ox: number, label: string) => {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px system-ui";
      ctx.fillText(label, ox + (SIZE * cell) / 2, 38);
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const st = board[r]![c]!;
          const x = ox + c * cell;
          const y = 48 + r * cell;
          ctx.fillStyle =
            st === "sunk"
              ? "#be123c"
              : st === "hit"
                ? "#f43f5e"
                : st === "miss"
                  ? "#38bdf8"
                  : st === "ship"
                    ? "#64748b"
                    : "#1e293b";
          ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        }
      }
    };
    drawBoard(ownBoard, pad, es ? "Tu flota" : "Your fleet");
    drawBoard(enemyBoard, pad * 2 + SIZE * cell, es ? "Enemigo" : "Enemy");
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `utilihub-battleship-${seed ?? "board"}.png`;
    a.click();
  }, [ownBoard, enemyBoard, es, seed]);

  return (
    <div className="mx-auto flex max-w-full flex-col items-center gap-3 px-2">
      <div className="flex flex-wrap gap-2">
        <GamePrimaryButton onClick={reset}>{es ? "Nuevo" : "New"}</GamePrimaryButton>
        {phase === "placement" && (
          <>
            <GameSecondaryButton onClick={randomOwn}>{es ? "Al azar" : "Random"}</GameSecondaryButton>
            <GameSecondaryButton onClick={() => setHoriz((h) => !h)}>
              {horiz ? (es ? "Horiz" : "Horiz") : es ? "Vert" : "Vert"}
            </GameSecondaryButton>
            <GamePrimaryButton onClick={startGame}>{es ? "Empezar" : "Start"}</GamePrimaryButton>
          </>
        )}
        {phase !== "placement" && (
          <>
            <GameSecondaryButton onClick={exportPng}>{es ? "PNG" : "PNG"}</GameSecondaryButton>
            <GameSecondaryButton onClick={shareUrl}>
              {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Compartir" : "Share"}
            </GameSecondaryButton>
          </>
        )}
        <span>
          {es ? "Disparos" : "Shots"}: {shots} / {es ? "IA" : "AI"} {aiShots}
        </span>
      </div>
      <p className="text-sm font-semibold text-emerald-100" role="status" aria-live="polite">{message}</p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div>
          <p className="text-xs text-center mb-1">{es ? "Tu flota" : "Your fleet"}</p>
          <div
            className="grid gap-px bg-slate-900 p-1 rounded"
            style={{ gridTemplateColumns: `repeat(10, minmax(18px,1fr))` }}
            role="grid"
            aria-label={es ? "Tu flota" : "Your fleet"}
          >
            {ownBoard.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`o${r}${c}`}
                  type="button"
                  onClick={() => placeAt(r, c)}
                  className={`aspect-square rounded-sm ${cellClass(cell, true)}`}
                  aria-label={ariaFor(cell, r, c, true)}
                  disabled={phase !== "placement"}
                />
              )),
            )}
          </div>
        </div>
        <div>
          <p className="text-xs text-center mb-1">{es ? "Enemigo" : "Enemy"}</p>
          <div
            className="grid gap-px bg-slate-900 p-1 rounded"
            style={{ gridTemplateColumns: `repeat(10, minmax(18px,1fr))` }}
            role="grid"
            aria-label={es ? "Grilla enemiga" : "Enemy grid"}
          >
            {enemyBoard.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`e${r}${c}`}
                  type="button"
                  onClick={() => shoot(r, c)}
                  className={`aspect-square rounded-sm ${cellClass(cell, false)}`}
                  aria-label={ariaFor(cell, r, c, false)}
                  disabled={phase !== "playing"}
                />
              )),
            )}
          </div>
        </div>
      </div>
      {winner && (
        <p className="font-bold text-emerald-300" role="status">
          {winner === "player" ? (es ? "¡Victoria!" : "Victory!") : es ? "Derrota" : "Defeat"}
        </p>
      )}
      <p className="text-[11px] text-white/50 max-w-md text-center">
        {es
          ? "Colocá barcos o al azar, luego dispará. La IA responde. Gana hundiendo la flota enemiga. PNG y enlace compartibles."
          : "Place ships or random, then shoot. AI responds. Win by sinking the enemy fleet. PNG and link shareable."}
      </p>
    </div>
  );
}
