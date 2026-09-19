import { useCallback, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const COLS = 7;
const ROWS = 6;
type Cell = 0 | 1 | 2;
type Mode = "cpu" | "pvp";

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]);
}
function drop(board: Cell[][], col: number, player: Cell): Cell[][] | null {
  if (board[0]![col]) return null;
  const next = board.map((r) => r.slice() as Cell[]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!next[r]![col]) { next[r]![col] = player; return next; }
  }
  return null;
}
function winner(board: Cell[][]): Cell | "draw" | null {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]] as const;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const p = board[r]![c]; if (!p) continue;
    for (const [dr,dc] of dirs) {
      let ok = true;
      for (let k = 1; k < 4; k++) {
        const rr = r+dr*k, cc = c+dc*k;
        if (rr<0||rr>=ROWS||cc<0||cc>=COLS||board[rr]![cc]!==p) { ok=false; break; }
      }
      if (ok) return p;
    }
  }
  if (board[0]!.every(Boolean)) return "draw";
  return null;
}
function evalBoard(board: Cell[][], player: Cell): number {
  let s = 0;
  const opp = player === 1 ? 2 : 1;
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
    if (board[r]![c]===player) s+=1;
    if (board[r]![c]===opp) s-=1;
  }
  // prefer center
  for (let r=0;r<ROWS;r++) if (board[r]![3]===player) s+=3;
  return s;
}
function bestCpu(board: Cell[][]): number {
  const order = [3,2,4,1,5,0,6];
  let bestCol = order.find((c)=>!board[0]![c]) ?? 0;
  let best = -Infinity;
  for (const c of order) {
    const next = drop(board, c, 2);
    if (!next) continue;
    const w = winner(next);
    if (w===2) return c;
    // block human win
    const block = drop(board, c, 1);
    if (block && winner(block)===1) { bestCol=c; best=1e9; continue; }
    const score = evalBoard(next, 2);
    if (score > best) { best = score; bestCol = c; }
  }
  return bestCol;
}

export function ConnectFourGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState<Cell>(1);
  const [mode, setMode] = useState<Mode>("cpu");
  const [result, setResult] = useState<Cell | "draw" | null>(null);
  const reset = useCallback(() => { setBoard(emptyBoard()); setTurn(1); setResult(null); }, []);
  const playCol = useCallback((col: number) => {
    if (result) return;
    if (mode === "cpu" && turn !== 1) return;
    const next = drop(board, col, turn);
    if (!next) return;
    const w = winner(next);
    setBoard(next);
    if (w) { setResult(w); return; }
    if (mode === "pvp") { setTurn(turn === 1 ? 2 : 1); return; }
    setTurn(2);
    window.setTimeout(() => {
      setBoard((cur) => {
        if (winner(cur)) return cur;
        const after = drop(cur, bestCpu(cur), 2);
        if (!after) return cur;
        const cw = winner(after);
        if (cw) setResult(cw); else setTurn(1);
        return after;
      });
    }, 280);
  }, [board, mode, result, turn]);
  let status: string;
  if (result === "draw") status = es ? "Empate" : "Draw";
  else if (result === 1) status = es ? "Gana Rojo" : "Red wins";
  else if (result === 2) status = mode === "cpu" ? (es ? "Gana la CPU" : "CPU wins") : (es ? "Gana Amarillo" : "Yellow wins");
  else if (mode === "cpu" && turn === 2) status = es ? "CPU pensando…" : "CPU thinking…";
  else status = turn === 1 ? (es ? "Turno: Rojo" : "Turn: Red") : (es ? "Turno: Amarillo" : "Turn: Yellow");
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        <GameSecondaryButton active={mode==="cpu"} onClick={()=>{setMode("cpu");reset();}}>Vs CPU</GameSecondaryButton>
        <GameSecondaryButton active={mode==="pvp"} onClick={()=>{setMode("pvp");reset();}}>{es?"2 jugadores":"2 players"}</GameSecondaryButton>
        <GamePrimaryButton onClick={reset}>{es?"Nueva":"New"}</GamePrimaryButton>
      </div>
      <p className="text-sm font-bold text-emerald-300/90">{status}</p>
      <div className="rounded-2xl bg-[#1e3a5f] p-2 sm:p-3">
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({length:COLS},(_,c)=>(
            <button key={`h-${c}`} type="button" disabled={Boolean(result)||(mode==="cpu"&&turn!==1)} onClick={()=>playCol(c)}
              className="h-8 rounded-md bg-white/10 text-xs font-bold text-white/70 hover:bg-white/20 disabled:opacity-40">▼</button>
          ))}
          {board.flatMap((row,r)=>row.map((cell,c)=>(
            <div key={`${r}-${c}`} className={`flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11 ${
              cell===1?"bg-rose-500":cell===2?"bg-amber-400":"bg-[#0c1e33]"}`} />
          )))}
        </div>
      </div>
    </div>
  );
}
