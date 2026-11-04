import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Piece = 0 | 1 | 2 | 3 | 4;
type Board = Piece[][];
type Pos = [number, number];
type Move = { from: Pos; to: Pos; captures: Pos[] };

const SIZE = 8;

function isRed(p: Piece) { return p === 1 || p === 2; }
function isBlack(p: Piece) { return p === 3 || p === 4; }
function isKing(p: Piece) { return p === 2 || p === 4; }
function owner(p: Piece): "red" | "black" | null {
  if (isRed(p)) return "red";
  if (isBlack(p)) return "black";
  return null;
}

function initialBoard(): Board {
  const b: Board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0) as Piece[]);
  for (let r = 0; r < 3; r++) for (let c = 0; c < SIZE; c++) if ((r + c) % 2 === 1) b[r]![c] = 3;
  for (let r = 5; r < 8; r++) for (let c = 0; c < SIZE; c++) if ((r + c) % 2 === 1) b[r]![c] = 1;
  return b;
}

function inBounds(r: number, c: number) { return r >= 0 && r < SIZE && c >= 0 && c < SIZE; }

function getDirections(p: Piece): [number, number][] {
  if (p === 1) return [[-1, -1], [-1, 1]];
  if (p === 3) return [[1, -1], [1, 1]];
  return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
}

function findMoves(board: Board, player: "red" | "black", forceCapture = true): Move[] {
  const moves: Move[] = [];
  const captures: Move[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r]![c]!;
      if (owner(p) !== player) continue;
      const dirs = getDirections(p);
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (inBounds(nr, nc) && board[nr]![nc] === 0) moves.push({ from: [r, c], to: [nr, nc], captures: [] });
        const jr = r + 2 * dr, jc = c + 2 * dc;
        if (inBounds(jr, jc) && board[jr]![jc] === 0) {
          const midR = r + dr, midC = c + dc;
          const mid = board[midR]![midC]!;
          if (mid !== 0 && owner(mid) !== player) captures.push({ from: [r, c], to: [jr, jc], captures: [[midR, midC]] });
        }
      }
    }
  }
  const multi: Move[] = [];
  for (const cap of captures) {
    const temp = applyMove(board, cap);
    const cont = findSingleJumpsFrom(temp, cap.to[0], cap.to[1], player);
    for (const extra of cont) multi.push({ from: cap.from, to: extra.to, captures: [...cap.captures, ...extra.captures] });
  }
  const allCaps = [...captures, ...multi];
  if (forceCapture && allCaps.length) return allCaps;
  return [...moves, ...allCaps];
}

function findSingleJumpsFrom(board: Board, r: number, c: number, player: "red" | "black"): Move[] {
  const p = board[r]![c]!;
  if (owner(p) !== player) return [];
  const dirs = getDirections(p);
  const jumps: Move[] = [];
  for (const [dr, dc] of dirs) {
    const jr = r + 2 * dr, jc = c + 2 * dc;
    if (inBounds(jr, jc) && board[jr]![jc] === 0) {
      const midR = r + dr, midC = c + dc;
      const mid = board[midR]![midC]!;
      if (mid !== 0 && owner(mid) !== player) jumps.push({ from: [r, c], to: [jr, jc], captures: [[midR, midC]] });
    }
  }
  return jumps;
}

function applyMove(board: Board, move: Move): Board {
  const next = board.map((row) => [...row]) as Board;
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;
  let piece = next[fr]![fc]!;
  next[fr]![fc] = 0;
  for (const [cr, cc] of move.captures) next[cr]![cc] = 0;
  if (piece === 1 && tr === 0) piece = 2;
  if (piece === 3 && tr === 7) piece = 4;
  next[tr]![tc] = piece;
  return next;
}

function hasPieces(board: Board, player: "red" | "black") {
  for (const row of board) for (const p of row) if (owner(p) === player) return true;
  return false;
}

function aiMove(board: Board, player: "red" | "black"): Move | null {
  const moves = findMoves(board, player);
  if (!moves.length) return null;
  const caps = moves.filter((m) => m.captures.length);
  const pool = caps.length ? caps : moves;
  pool.sort((a, b) => b.captures.length - a.captures.length);
  return pool[0]!;
}

function serializeBoard(board: Board, turn: "red" | "black", userSide: "red" | "black"): string {
  return `${board.flat().join("")}|${turn}|${userSide}`;
}

function deserializeBoard(s: string): { board: Board; turn: "red" | "black"; userSide: "red" | "black" } | null {
  const parts = s.split("|");
  if (parts.length < 2 || parts[0].length !== 64) return null;
  const cells = parts[0].split("").map((c) => {
    const n = parseInt(c, 10);
    return (n >= 0 && n <= 4 ? n : 0) as Piece;
  });
  const board: Board = [];
  for (let r = 0; r < SIZE; r++) board.push(cells.slice(r * SIZE, (r + 1) * SIZE) as Piece[]);
  const turn = parts[1] === "black" ? "black" : "red";
  const userSide = parts[2] === "black" ? "black" : "red";
  return { board, turn, userSide };
}

function updateUrl(board: Board, turn: "red" | "black", userSide: "red" | "black") {
  const url = new URL(window.location.href);
  url.searchParams.set("b", serializeBoard(board, turn, userSide));
  window.history.replaceState(null, "", url);
}

function downloadBrandedPng(board: Board, result: string | null, es: boolean) {
  const canvas = document.createElement("canvas");
  const cell = 48; const pad = 24; const header = 60; const footer = 40;
  const w = SIZE * cell + pad * 2; const h = header + SIZE * cell + footer + pad;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d"); if (!ctx) return;
  ctx.fillStyle = "#1c1917"; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fef3c7"; ctx.font = "bold 22px system-ui, sans-serif"; ctx.textAlign = "center";
  ctx.fillText("UtiliHub — Checkers Classic", w / 2, 36);
  ctx.font = "16px system-ui, sans-serif"; ctx.fillStyle = "#f8fafc";
  const scoreText = result ? (es ? (result === "draw" ? "Empate" : result === "red" ? "Gana Rojo" : "Gana Negro") : (result === "draw" ? "Draw" : result === "red" ? "Red wins" : "Black wins")) : (es ? "Partida en curso" : "Game in progress");
  ctx.fillText(scoreText, w / 2, header - 8);
  const ox = pad; const oy = header;
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    const x = ox + c * cell; const y = oy + r * cell;
    const isDark = (r + c) % 2 === 1;
    ctx.fillStyle = isDark ? "#92400e" : "#fef3c7"; ctx.fillRect(x, y, cell - 1, cell - 1);
    const cellVal = board[r]![c];
    if (cellVal !== 0) {
      ctx.beginPath(); ctx.arc(x + cell / 2, y + cell / 2, cell * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = isRed(cellVal) ? "#dc2626" : "#1e293b"; ctx.fill();
      if (isKing(cellVal)) { ctx.fillStyle = "#fbbf24"; ctx.font = "bold 20px system-ui"; ctx.textAlign = "center"; ctx.fillText("♔", x + cell / 2, y + cell / 2 + 7); }
    }
  }
  ctx.fillStyle = "#fbbf24"; ctx.font = "12px system-ui, sans-serif"; ctx.fillText("utilihub-ten.vercel.app", w / 2, h - 16);
  canvas.toBlob((blob) => { if (!blob) return; const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "utilihub-checkers.png"; a.click(); URL.revokeObjectURL(a.href); }, "image/png");
}

type Snapshot = { board: Board; turn: "red" | "black"; selected: Pos | null; result: "red" | "black" | "draw" | null };

export function CheckersClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState<"red" | "black">("red");
  const [userSide, setUserSide] = useState<"red" | "black">("red");
  const [vsAi, setVsAi] = useState(true);
  const [selected, setSelected] = useState<Pos | null>(null);
  const [result, setResult] = useState<"red" | "black" | "draw" | null>(null);
  const [lastMove, setLastMove] = useState<Pos | null>(null);
  const [copied, setCopied] = useState(false);
  const [cursor, setCursor] = useState<Pos>([5, 0]);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [continuing, setContinuing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bParam = params.get("b");
    if (bParam) {
      const parsed = deserializeBoard(bParam);
      if (parsed) {
        setBoard(parsed.board); setTurn(parsed.turn); setUserSide(parsed.userSide);
        setResult(null); setSelected(null); setLastMove(null); setHistory([]); setContinuing(false);
        return;
      }
    }
  }, []);

  const moves = useMemo(() => continuing && selected ? findSingleJumpsFrom(board, selected[0], selected[1], turn) : findMoves(board, turn), [board, turn, continuing, selected]);

  const selectable = useMemo(() => { const s = new Set<string>(); for (const m of moves) s.add(`${m.from[0]},${m.from[1]}`); return s; }, [moves]);

  const possible = useMemo(() => selected ? moves.filter((m) => m.from[0] === selected[0] && m.from[1] === selected[1]) : [], [moves, selected]);

  const checkEnd = useCallback((next: Board, nextTurn: "red" | "black") => {
    if (!hasPieces(next, "red") || !hasPieces(next, "black")) { setResult(!hasPieces(next, "red") ? "black" : "red"); return true; }
    if (!findMoves(next, nextTurn).length) { setResult(nextTurn === "red" ? "black" : "red"); return true; }
    return false;
  }, []);

  const doMove = useCallback((move: Move) => {
    if (result) return;
    setHistory((h) => [...h.slice(-20), { board, turn, selected, result }]);
    const next = applyMove(board, move);
    setBoard(next); setLastMove(move.to);
    const opp: "red" | "black" = turn === "red" ? "black" : "red";
    if (checkEnd(next, opp)) { setSelected(null); setContinuing(false); updateUrl(next, turn, userSide); return; }
    if (move.captures.length > 0) {
      const cont = findSingleJumpsFrom(next, move.to[0], move.to[1], turn);
      if (cont.length) { setSelected(move.to); setContinuing(true); updateUrl(next, turn, userSide); return; }
    }
    setSelected(null); setContinuing(false); setTurn(opp); updateUrl(next, opp, userSide);
  }, [board, turn, result, checkEnd, userSide, selected]);

  const onSquare = useCallback((r: number, c: number) => {
    if (result || (vsAi && turn !== userSide)) return;
    const p = board[r]![c]!;
    if (owner(p) === turn && selectable.has(`${r},${c}`) && !continuing) { setSelected([r, c]); return; }
    if (selected) { const m = possible.find((mv) => mv.to[0] === r && mv.to[1] === c); if (m) doMove(m); }
  }, [board, turn, result, vsAi, userSide, selectable, selected, possible, doMove, continuing]);

  useEffect(() => {
    if (!vsAi || result || turn === userSide || continuing) return;
    const t = window.setTimeout(() => { const m = aiMove(board, turn); if (m) doMove(m); else checkEnd(board, turn === "red" ? "black" : "red"); }, 600);
    return () => window.clearTimeout(t);
  }, [vsAi, turn, userSide, board, result, doMove, checkEnd, continuing]);

  const undo = useCallback(() => {
    if (!history.length || result) return;
    const prev = history[history.length - 1]!;
    setHistory((h) => h.slice(0, -1));
    setBoard(prev.board); setTurn(prev.turn); setSelected(prev.selected); setResult(prev.result); setContinuing(false); setLastMove(null);
    updateUrl(prev.board, prev.turn, userSide);
  }, [history, result, userSide]);

  const reset = useCallback(() => {
    const init = initialBoard();
    setBoard(init); setTurn("red"); setResult(null); setSelected(null); setLastMove(null); setCursor([5, 0]); setHistory([]); setContinuing(false);
    updateUrl(init, "red", userSide);
  }, [userSide]);

  const setSide = (side: "red" | "black") => { setUserSide(side); reset(); };

  const shareUrl = useCallback(async () => {
    updateUrl(board, turn, userSide);
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch {}
  }, [board, turn, userSide]);

  const downloadPng = useCallback(() => downloadBrandedPng(board, result, es), [board, result, es]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (result) return;
      const [cr, cc] = cursor;
      if (e.key === "ArrowUp" && cr > 0) setCursor([cr - 1, cc]);
      else if (e.key === "ArrowDown" && cr < 7) setCursor([cr + 1, cc]);
      else if (e.key === "ArrowLeft" && cc > 0) setCursor([cr, cc - 1]);
      else if (e.key === "ArrowRight" && cc < 7) setCursor([cr, cc + 1]);
      else if (e.key === "Enter" || e.key === " ") { onSquare(cr, cc); e.preventDefault(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursor, onSquare, result]);

  let status = result === "draw" ? (es ? "Empate" : "Draw") : result === "red" ? (es ? "¡Gana Rojo!" : "Red wins!") : result === "black" ? (es ? "¡Gana Negro!" : "Black wins!") : continuing ? (es ? "Continuá el salto" : "Continue jump") : (turn === "red" ? (es ? "Turno: Rojo" : "Turn: Red") : (es ? "Turno: Negro" : "Turn: Black"));
  if (vsAi && turn !== userSide && !result) status += es ? " (IA)" : " (AI)";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-1">
      <div className="flex flex-wrap justify-center gap-2">
        <GamePrimaryButton onClick={reset}>{es ? "Nueva partida" : "New game"}</GamePrimaryButton>
        <GameSecondaryButton onClick={undo} disabled={!history.length || Boolean(result)}>{es ? "Deshacer" : "Undo"}</GameSecondaryButton>
        <GameSecondaryButton onClick={() => setSide("red")} active={userSide === "red"}>{es ? "Jugar Rojo" : "Play Red"}</GameSecondaryButton>
        <GameSecondaryButton onClick={() => setSide("black")} active={userSide === "black"}>{es ? "Jugar Negro" : "Play Black"}</GameSecondaryButton>
        <GameSecondaryButton onClick={() => setVsAi((v) => !v)} active={vsAi}>{vsAi ? (es ? "Vs IA" : "Vs AI") : (es ? "Vs Humano" : "Vs Human")}</GameSecondaryButton>
        <GameSecondaryButton onClick={shareUrl}>{copied ? (es ? "¡Copiado!" : "Copied!") : (es ? "Compartir enlace" : "Share link")}</GameSecondaryButton>
        <GameSecondaryButton onClick={downloadPng}>{es ? "Descargar PNG" : "Download PNG"}</GameSecondaryButton>
      </div>
      <div className="text-sm font-bold text-emerald-300/90">{status}</div>
      <div className="grid gap-0.5 rounded-xl p-1.5 sm:gap-1 sm:p-2 touch-manipulation" style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`, background: "linear-gradient(145deg, #1c1917, #0c0a09)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: "min(100%, 28rem)" }} tabIndex={0} role="grid" aria-label={es ? "Tablero de damas" : "Checkers board"}>
        {board.flatMap((row, r) => row.map((cell, c) => {
          const isDark = (r + c) % 2 === 1;
          const isSel = selected && selected[0] === r && selected[1] === c;
          const isTarget = possible.some((m) => m.to[0] === r && m.to[1] === c);
          const isLast = lastMove && lastMove[0] === r && lastMove[1] === c;
          const canSelect = selectable.has(`${r},${c}`);
          const isCursor = cursor[0] === r && cursor[1] === c;
          return (
            <button key={`${r}-${c}`} type="button" disabled={!isDark || Boolean(result) || (vsAi && turn !== userSide)} onClick={() => onSquare(r, c)} className={`relative flex aspect-square w-9 items-center justify-center sm:w-11 ${isDark ? "bg-amber-900/90" : "bg-amber-100/20"} ${isSel ? "ring-2 ring-amber-400" : ""} ${isTarget ? "ring-2 ring-emerald-400" : ""} ${isCursor ? "ring-2 ring-blue-400" : ""}`} aria-label={es ? `Casilla ${r+1}-${c+1}${cell ? (isRed(cell) ? " roja" : " negra") + (isKing(cell) ? " rey" : "") : ""}` : `Square ${r+1}-${c+1}${cell ? (isRed(cell) ? " red" : " black") + (isKing(cell) ? " king" : "") : ""}`} role="gridcell">
              {cell !== 0 && <div className={`flex h-5/6 w-5/6 items-center justify-center rounded-full shadow-inner text-xs font-bold ${isLast ? "ring-2 ring-amber-300" : ""}`} style={{ background: isRed(cell) ? "radial-gradient(circle at 30% 30%, #f87171, #b91c1c)" : "radial-gradient(circle at 30% 30%, #475569, #0f172a)", color: isRed(cell) ? "#fff" : "#f8fafc" }}>{isKing(cell) ? "♔" : ""}</div>}
              {isTarget && cell === 0 && <div className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />}
              {canSelect && !isSel && cell !== 0 && <div className="absolute inset-0 rounded-full ring-1 ring-amber-200/40" />}
            </button>
          );
        }))}
      </div>
      <p className="text-center text-xs text-emerald-100/60">{es ? "Las rojas empiezan abajo. Mové en diagonal, capturá saltando. Si hay más saltos posibles debés continuar. Al llegar al extremo te convertís en rey. Usá flechas + Enter o toque. Deshacer, compartir enlace o PNG." : "Red starts at the bottom. Move diagonally, capture by jumping. If more jumps are possible you must continue. Reach the far side to become a king. Use arrows + Enter or touch. Undo, share link or PNG."}</p>
    </div>
  );
}
