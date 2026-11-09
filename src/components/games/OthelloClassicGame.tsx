import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import { SIZE } from "./OthelloClassicGame.part1";
import { initialBoard, type Cell, type Board, deserializeBoard, validMoves, countDiscs, applyMove, updateUrl, aiBestMove, downloadBrandedPng } from "./OthelloClassicGame.part2";

export function OthelloClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState<Cell>(1);
  const [result, setResult] = useState<"black" | "white" | "draw" | null>(null);
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);
  const [history, setHistory] = useState<Board[]>([initialBoard()]);
  const [copied, setCopied] = useState(false);
  const [vsAi, setVsAi] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bParam = params.get("b");
    if (bParam) {
      const parsed = deserializeBoard(bParam);
      if (parsed) {
        setBoard(parsed.board);
        setTurn(parsed.turn);
        setHistory([parsed.board]);
        setResult(null);
        setLastMove(null);
        return;
      }
    }
  }, []);

  const moves = useMemo(() => validMoves(board, turn), [board, turn]);
  const scores = useMemo(() => countDiscs(board), [board]);

  const checkEnd = useCallback((nextBoard: Board, nextTurn: Cell) => {
    const opp = nextTurn === 1 ? 2 : 1;
    const myMoves = validMoves(nextBoard, nextTurn);
    const oppMoves = validMoves(nextBoard, opp);
    if (!myMoves.length && !oppMoves.length) {
      const { black, white } = countDiscs(nextBoard);
      if (black > white) setResult("black");
      else if (white > black) setResult("white");
      else setResult("draw");
      return true;
    }
    if (!myMoves.length) {
      setTurn(opp);
      return false;
    }
    return false;
  }, []);

  const play = useCallback((r: number, c: number) => {
    if (result) return;
    const next = applyMove(board, r, c, turn);
    if (!next) return;
    const nextHist = [...history, next];
    setHistory(nextHist);
    setBoard(next);
    setLastMove([r, c]);
    const opp: Cell = turn === 1 ? 2 : 1;
    const ended = checkEnd(next, opp);
    if (!ended) setTurn(opp);
    updateUrl(next, ended ? turn : opp);
  }, [board, turn, result, history, checkEnd]);

  // Simple AI: plays as White (2) when vsAi enabled
  useEffect(() => {
    if (!vsAi || result || turn !== 2) return;
    const timer = window.setTimeout(() => {
      const move = aiBestMove(board, 2);
      if (move) {
        play(move[0], move[1]);
      } else {
        // no moves, pass is handled by checkEnd on next human? but to force pass
        const opp: Cell = 1;
        const ended = checkEnd(board, opp);
        if (!ended) setTurn(opp);
        updateUrl(board, ended ? turn : opp);
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [vsAi, turn, board, result, play, checkEnd]);

  const reset = useCallback(() => {
    const init = initialBoard();
    setBoard(init);
    setTurn(1);
    setResult(null);
    setLastMove(null);
    setHistory([init]);
    updateUrl(init, 1);
  }, []);

  const undo = useCallback(() => {
    if (history.length <= 1 || result) return;
    const prev = history[history.length - 2]!;
    const nextHist = history.slice(0, -1);
    setHistory(nextHist);
    setBoard(prev);
    const prevTurn = turn === 1 ? 2 : 1;
    setTurn(prevTurn);
    setResult(null);
    setLastMove(null);
    updateUrl(prev, prevTurn);
  }, [history, turn, result]);

  const shareUrl = useCallback(async () => {
    updateUrl(board, turn);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* silent */
    }
  }, [board, turn]);

  const downloadPng = useCallback(() => {
    downloadBrandedPng(board, scores, result, es);
  }, [board, scores, result, es]);

  const toggleAi = useCallback(() => {
    setVsAi((v) => !v);
    if (result) return;
    // if switching to AI and it's AI turn, the effect will trigger
  }, [result]);

  let status: string;
  if (result === "draw") status = es ? "Empate" : "Draw";
  else if (result === "black") status = es ? "¡Gana Negro!" : "Black wins!";
  else if (result === "white") status = es ? "¡Gana Blanco!" : "White wins!";
  else if (!moves.length) status = es ? "Sin movimientos — pasa el turno" : "No moves — pass turn";
  else status = turn === 1 ? (es ? "Turno: Negro" : "Turn: Black") : es ? "Turno: Blanco" : "Turn: White";
  if (vsAi && turn === 2 && !result) status += es ? " (IA)" : " (AI)";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-1">
      <div className="flex flex-wrap justify-center gap-2">
        <GamePrimaryButton onClick={reset}>{es ? "Nueva partida" : "New game"}</GamePrimaryButton>
        <GameSecondaryButton onClick={undo}>{es ? "Deshacer" : "Undo"}</GameSecondaryButton>
        <GameSecondaryButton onClick={toggleAi}>
          {vsAi ? (es ? "Vs Humano" : "Vs Human") : es ? "Vs IA" : "Vs AI"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={shareUrl}>
          {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Compartir enlace" : "Share link"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={downloadPng}>
          {es ? "Descargar PNG" : "Download PNG"}
        </GameSecondaryButton>
      </div>

      <div className="flex items-center gap-4 text-sm font-bold">
        <span className="flex items-center gap-1 text-slate-100">
          <span className="inline-block h-4 w-4 rounded-full bg-black ring-1 ring-white/40" />
          {scores.black}
        </span>
        <span className="text-emerald-300/90">{status}</span>
        <span className="flex items-center gap-1 text-slate-100">
          <span className="inline-block h-4 w-4 rounded-full bg-white ring-1 ring-black/40" />
          {scores.white}
        </span>
      </div>

      <div
        className="grid gap-0.5 rounded-xl p-1.5 sm:gap-1 sm:p-2"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
          background: "linear-gradient(145deg, #14532d, #052e16)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        {board.flatMap((row, r) =>
          row.map((cell, c) => {
            const isValid = moves.some(([mr, mc]) => mr === r && mc === c);
            const isLast = lastMove && lastMove[0] === r && lastMove[1] === c;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                disabled={Boolean(result) || !isValid || (vsAi && turn === 2)}
                onClick={() => play(r, c)}
                className="relative flex aspect-square w-9 items-center justify-center rounded-sm bg-emerald-800/80 transition hover:bg-emerald-700/90 disabled:cursor-default sm:w-11"
                aria-label={es ? `Casilla ${r + 1}-${c + 1}` : `Square ${r + 1}-${c + 1}`}
              >
                {cell !== 0 && (
                  <div
                    className={`h-5/6 w-5/6 rounded-full shadow-inner ${isLast ? "ring-2 ring-amber-300" : ""}`}
                    style={{
                      background:
                        cell === 1
                          ? "radial-gradient(circle at 30% 30%, #444, #111)"
                          : "radial-gradient(circle at 30% 30%, #fff, #ccc)",
                    }}
                  />
                )}
                {isValid && !cell && (
                  <div className="h-2 w-2 rounded-full bg-amber-300/70 sm:h-2.5 sm:w-2.5" />
                )}
              </button>
            );
          }),
        )}
      </div>

      <p className="text-center text-xs text-emerald-100/60">
        {es
          ? "Negro empieza. Colocá una ficha para voltear las del rival en línea recta. El que tenga más fichas al final gana. Activá Vs IA para jugar contra la computadora. Descargá el PNG o compartí el enlace."
          : "Black starts. Place a disc to flip opponent discs in straight lines. Most discs at the end wins. Enable Vs AI to play against the computer. Download the PNG or share the link."}
      </p>
    </div>
  );
}
