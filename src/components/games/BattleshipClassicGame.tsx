import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type CellState = "empty" | "ship" | "hit" | "miss" | "sunk";
type Phase = "placement" | "playing" | "over";

const SIZE = 10;
const SHIPS = [
  { id: "carrier", len: 5, nameEn: "Carrier", nameEs: "Portaaviones" },
  { id: "battleship", len: 4, nameEn: "Battleship", nameEs: "Acorazado" },
  { id: "cruiser", len: 3, nameEn: "Cruiser", nameEs: "Crucero" },
  { id: "submarine", len: 3, nameEn: "Submarine", nameEs: "Submarino" },
  { id: "destroyer", len: 2, nameEn: "Destroyer", nameEs: "Destructor" },
];

function makeEmpty(): CellState[][] {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill("empty"));
}

function canPlace(board: CellState[][], r: number, c: number, len: number, horiz: boolean): boolean {
  for (let i = 0; i < len; i++) {
    const rr = horiz ? r : r + i;
    const cc = horiz ? c + i : c;
    if (rr >= SIZE || cc >= SIZE || board[rr]![cc] !== "empty") return false;
  }
  return true;
}

function placeShip(board: CellState[][], r: number, c: number, len: number, horiz: boolean): CellState[][] {
  const next = board.map((row) => [...row]);
  for (let i = 0; i < len; i++) {
    const rr = horiz ? r : r + i;
    const cc = horiz ? c + i : c;
    next[rr]![cc] = "ship";
  }
  return next;
}

function randomPlace(): CellState[][] {
  let board = makeEmpty();
  for (const ship of SHIPS) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 200) {
      const horiz = Math.random() > 0.5;
      const maxR = horiz ? SIZE : SIZE - ship.len + 1;
      const maxC = horiz ? SIZE - ship.len + 1 : SIZE;
      const r = Math.floor(Math.random() * maxR);
      const c = Math.floor(Math.random() * maxC);
      if (canPlace(board, r, c, ship.len, horiz)) {
        board = placeShip(board, r, c, ship.len, horiz);
        placed = true;
      }
      attempts++;
    }
  }
  return board;
}

export function BattleshipClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [phase, setPhase] = useState<Phase>("placement");
  const [ownBoard, setOwnBoard] = useState<CellState[][]>(makeEmpty);
  const [enemyBoard, setEnemyBoard] = useState<CellState[][]>(makeEmpty);
  const [enemyHidden, setEnemyHidden] = useState<CellState[][]>(makeEmpty);
  const [currentShip, setCurrentShip] = useState(0);
  const [horiz, setHoriz] = useState(true);
  const [message, setMessage] = useState(es ? "Colocá tus barcos" : "Place your ships");
  const [winner, setWinner] = useState<"player" | "ai" | null>(null);
  const [shots, setShots] = useState(0);

  const reset = () => {
    setPhase("placement");
    setOwnBoard(makeEmpty());
    setEnemyBoard(makeEmpty());
    setEnemyHidden(makeEmpty());
    setCurrentShip(0);
    setHoriz(true);
    setMessage(es ? "Colocá tus barcos" : "Place your ships");
    setWinner(null);
    setShots(0);
  };

  const randomOwn = () => {
    setOwnBoard(randomPlace());
    setCurrentShip(SHIPS.length);
    setMessage(es ? "Barcos al azar. Listo." : "Ships random. Ready.");
  };

  const startGame = () => {
    if (currentShip < SHIPS.length) return;
    setEnemyHidden(randomPlace());
    setPhase("playing");
    setMessage(es ? "¡Dispará!" : "Fire!");
  };

  const placeAt = (r: number, c: number) => {
    if (phase !== "placement" || currentShip >= SHIPS.length) return;
    const ship = SHIPS[currentShip]!;
    if (!canPlace(ownBoard, r, c, ship.len, horiz)) {
      setMessage(es ? "No se puede colocar" : "Cannot place");
      return;
    }
    setOwnBoard(placeShip(ownBoard, r, c, ship.len, horiz));
    setCurrentShip((s) => s + 1);
    setMessage(currentShip + 1 >= SHIPS.length ? (es ? "Listo. Empezá." : "Ready. Start.") : (es ? "Siguiente barco" : "Next ship"));
  };

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
    setMessage(hit ? (es ? "¡Impacto!" : "Hit!") : (es ? "Agua" : "Miss"));
    const remainingShips = enemyHidden.flat().filter((x) => x === "ship").length;
    const hits = enemyBoard.flat().filter((x) => x === "hit").length + (hit ? 1 : 0);
    if (hit && hits >= remainingShips) {
      setWinner("player");
      setPhase("over");
      setMessage(es ? "¡Ganaste!" : "You won!");
    }
  };

  const cellClass = (state: CellState, isOwn: boolean) => {
    if (state === "hit") return "bg-rose-500";
    if (state === "miss") return "bg-sky-400/50";
    if (state === "ship" && isOwn) return "bg-slate-500";
    return "bg-slate-800/70 hover:bg-slate-700";
  };

  return (
    <div className="mx-auto flex max-w-full flex-col items-center gap-3 px-2">
      <div className="flex flex-wrap gap-2">
        <GamePrimaryButton onClick={reset}>{es ? "Nuevo" : "New"}</GamePrimaryButton>
        {phase === "placement" && (
          <>
            <GameSecondaryButton onClick={randomOwn}>{es ? "Al azar" : "Random"}</GameSecondaryButton>
            <GameSecondaryButton onClick={() => setHoriz((h) => !h)}>{horiz ? (es ? "Horiz" : "Horiz") : (es ? "Vert" : "Vert")}</GameSecondaryButton>
            <GamePrimaryButton onClick={startGame}>{es ? "Empezar" : "Start"}</GamePrimaryButton>
          </>
        )}
        <span>{es ? "Disparos" : "Shots"}: {shots}</span>
      </div>
      <p className="text-sm font-semibold text-emerald-100">{message}</p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div>
          <p className="text-xs text-center mb-1">{es ? "Tu flota" : "Your fleet"}</p>
          <div className="grid gap-px bg-slate-900 p-1 rounded" style={{ gridTemplateColumns: `repeat(10, minmax(20px,1fr))` }}>
            {ownBoard.map((row, r) => row.map((cell, c) => (
              <button key={`o${r}${c}`} type="button" onClick={() => placeAt(r, c)} className={`aspect-square rounded-sm ${cellClass(cell, true)}`} />
            )))}
          </div>
        </div>
        <div>
          <p className="text-xs text-center mb-1">{es ? "Enemigo" : "Enemy"}</p>
          <div className="grid gap-px bg-slate-900 p-1 rounded" style={{ gridTemplateColumns: `repeat(10, minmax(20px,1fr))` }}>
            {enemyBoard.map((row, r) => row.map((cell, c) => (
              <button key={`e${r}${c}`} type="button" onClick={() => shoot(r, c)} className={`aspect-square rounded-sm ${cellClass(cell, false)}`} />
            )))}
          </div>
        </div>
      </div>
      {winner && <p className="font-bold text-emerald-300">{winner === "player" ? (es ? "¡Victoria!" : "Victory!") : ""}</p>}
      <p className="text-[11px] text-white/50 max-w-md text-center">{es ? "Colocá barcos o al azar, luego dispará. Gana hundiendo la flota enemiga." : "Place ships or random, then shoot. Win by sinking the enemy fleet."}</p>
    </div>
  );
}
