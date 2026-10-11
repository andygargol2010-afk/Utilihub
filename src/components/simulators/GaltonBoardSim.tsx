import { useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 480;
const H = 560;

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  row: number;
  col: number;
  active: boolean;
  bin?: number;
};

export function GaltonBoardSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rows, setRows] = useState(8);
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(false);
  const [ballsDropped, setBallsDropped] = useState(0);
  const [bins, setBins] = useState<number[]>([]);

  const rowsRef = useRef(rows);
  const speedRef = useRef(speed);
  const runningRef = useRef(running);
  const ballsRef = useRef<Ball[]>([]);
  const binsRef = useRef<number[]>([]);
  const pegsRef = useRef<{ x: number; y: number; row: number; col: number }[]>([]);

  rowsRef.current = rows;
  speedRef.current = speed;
  runningRef.current = running;

  function buildPegs(n: number) {
    const pegs: { x: number; y: number; row: number; col: number }[] = [];
    const marginX = 40;
    const usableW = W - marginX * 2;
    const pegSpacingY = (H - 140) / (n + 1);
    for (let r = 0; r < n; r++) {
      const count = r + 1;
      const spacing = usableW / (n + 1);
      const startX = W / 2 - ((count - 1) * spacing) / 2;
      for (let c = 0; c < count; c++) {
        pegs.push({
          x: startX + c * spacing,
          y: 60 + r * pegSpacingY,
          row: r,
          col: c,
        });
      }
    }
    return pegs;
  }

  function resetBoard(n = rowsRef.current) {
    pegsRef.current = buildPegs(n);
    ballsRef.current = [];
    const numBins = n + 1;
    binsRef.current = Array(numBins).fill(0);
    setBins([...binsRef.current]);
    setBallsDropped(0);
  }

  useEffect(() => {
    resetBoard(rows);
  }, [rows]);

  function dropBall() {
    const startX = W / 2 + (Math.random() - 0.5) * 4;
    ballsRef.current.push({
      x: startX,
      y: 20,
      vx: 0,
      vy: 0.5,
      row: -1,
      col: 0,
      active: true,
    });
    setBallsDropped((d) => d + 1);
    setRunning(true);
  }

  function dropMany(n = 20) {
    for (let i = 0; i < n; i++) {
      setTimeout(() => dropBall(), i * 40);
    }
  }

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.04, (now - last) / 1000) * speedRef.current * 2.2;
      last = now;

      const pegs = pegsRef.current;
      const balls = ballsRef.current;
      const nRows = rowsRef.current;
      const numBins = nRows + 1;
      const binW = (W - 40) / numBins;

      if (runningRef.current) {
        for (const ball of balls) {
          if (!ball.active) continue;
          ball.vy += 0.18 * dt * 60;
          ball.y += ball.vy * dt * 60;
          ball.x += ball.vx * dt * 60;
          ball.vx *= 0.98;

          for (const peg of pegs) {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 10 && ball.y < peg.y + 4 && ball.vy > 0) {
              const dir = Math.random() < 0.5 ? -1 : 1;
              ball.vx = dir * (1.8 + Math.random() * 0.6);
              ball.vy = Math.max(0.4, ball.vy * 0.3);
              ball.y = peg.y - 10;
              ball.row = peg.row;
              break;
            }
          }

          const floorY = H - 50;
          if (ball.y > floorY) {
            ball.active = false;
            ball.y = floorY;
            const binIdx = Math.max(0, Math.min(numBins - 1, Math.floor((ball.x - 20) / binW)));
            ball.bin = binIdx;
            binsRef.current[binIdx] = (binsRef.current[binIdx] || 0) + 1;
          }
        }
        setBins([...binsRef.current]);
      }

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#94a3b8";
      for (const peg of pegs) {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      const maxCount = Math.max(1, ...binsRef.current);
      const floorY = H - 50;
      for (let i = 0; i < numBins; i++) {
        const count = binsRef.current[i] || 0;
        const h = (count / maxCount) * 90;
        const x = 20 + i * binW;
        ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
        ctx.fillRect(x + 1, floorY - h, binW - 2, h);
        ctx.strokeStyle = "#334155";
        ctx.strokeRect(x, floorY, binW, 40);
      }

      ctx.fillStyle = "#38bdf8";
      for (const ball of balls) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(es ? "Tablero de Galton" : "Galton board", W / 2, 18);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [es]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4" data-sim="galton-board">
      <div className="w-full rounded-2xl border border-sky-500/25 bg-sky-950/40 p-3">
        <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-sky-200/85">
          {es ? "Máquina de Galton · campana de Gauss" : "Galton board · Gaussian bell"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <SimPrimaryButton theme="lab" onClick={() => dropBall()}>
            {es ? "Soltar bola" : "Drop ball"}
          </SimPrimaryButton>
          <SimPrimaryButton theme="lab" onClick={() => dropMany(30)}>
            {es ? "Soltar 30" : "Drop 30"}
          </SimPrimaryButton>
          <SimSecondaryButton
            theme="lab"
            onClick={() => {
              setRunning(false);
              resetBoard();
            }}
          >
            {es ? "Reiniciar" : "Reset"}
          </SimSecondaryButton>
        </div>
      </div>

      <div className="grid w-full max-w-sm gap-3 text-xs text-sky-50/90">
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Filas de clavos" : "Peg rows"}</span>
            <span className="tabular-nums text-sky-300">{rows}</span>
          </span>
          <input
            type="range"
            min={5}
            max={12}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer accent-sky-400"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Velocidad" : "Speed"}</span>
            <span className="tabular-nums text-sky-300">{speed.toFixed(1)}×</span>
          </span>
          <input
            type="range"
            min={0.4}
            max={2.5}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer accent-sky-400"
          />
        </label>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full max-w-[480px] rounded-2xl border border-sky-500/30 bg-[#0f172a]"
        role="img"
        aria-label={es ? "Tablero de Galton con bolas cayendo" : "Galton board with falling balls"}
      />

      <p className="text-center text-xs text-sky-100/70">
        {es
          ? `Bolas soltadas: ${ballsDropped}. La distribución tiende a una campana de Gauss.`
          : `Balls dropped: ${ballsDropped}. Distribution approaches a Gaussian bell curve.`}
      </p>
    </div>
  );
}
