import { useCallback, useEffect, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";

const W = 360;
const H = 520;
const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"];
const ORB_R = 18;

type Orb = { id: number; x: number; y: number; vy: number; color: string; size: number; fused: boolean; };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

export function ColorCascadeFusionGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const orbsRef = useRef<Orb[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nextId = useRef(1);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const gameOverRef = useRef(false);

  useEffect(() => setBest(readBestScore("color-cascade-fusion")), []);
  useEffect(() => { scoreRef.current = score; levelRef.current = level; gameOverRef.current = gameOver; }, [score, level, gameOver]);

  const spawnOrb = useCallback(() => {
    const col = Math.floor(Math.random() * COLORS.length);
    orbsRef.current.push({ id: nextId.current++, x: 30 + Math.random() * (W - 60), y: -ORB_R * 2, vy: 1.2 + levelRef.current * 0.15 + Math.random() * 0.5, color: COLORS[col], size: 1, fused: false });
  }, []);

  const hardReset = useCallback(() => {
    orbsRef.current = []; particlesRef.current = []; nextId.current = 1;
    setScore(0); setLevel(1); setGameOver(false); setRunning(true);
    scoreRef.current = 0; levelRef.current = 1; gameOverRef.current = false;
  }, []);

  useEffect(() => {
    if (!running) return;
    let raf = 0; let spawnAcc = 0;
    const tick = () => {
      if (!gameOverRef.current) {
        spawnAcc += 16;
        if (spawnAcc > Math.max(400, 900 - levelRef.current * 40)) { spawnAcc = 0; spawnOrb(); }
        for (const o of orbsRef.current) { o.y += o.vy; if (o.y > H - ORB_R * o.size - 10) { o.y = H - ORB_R * o.size - 10; o.vy = 0; } }
        particlesRef.current = particlesRef.current.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= 1; return p.life > 0; });
        if (orbsRef.current.some(o => o.y < 40 && o.vy === 0)) { setGameOver(true); gameOverRef.current = true; setRunning(false); }
      }
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0f0f1a"; ctx.fillRect(0, 0, W, H);
        for (const p of particlesRef.current) { ctx.globalAlpha = p.life / 40; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); }
        ctx.globalAlpha = 1;
        for (const o of orbsRef.current) {
          ctx.shadowBlur = 12; ctx.shadowColor = o.color; ctx.fillStyle = o.color;
          ctx.beginPath(); ctx.arc(o.x, o.y, ORB_R * o.size, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.beginPath(); ctx.arc(o.x - ORB_R * o.size * 0.3, o.y - ORB_R * o.size * 0.3, ORB_R * o.size * 0.25, 0, Math.PI * 2); ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, spawnOrb]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!running || gameOver) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    const hit = orbsRef.current.find(o => Math.hypot(o.x - mx, o.y - my) < ORB_R * o.size + 8);
    if (!hit) return;
    const group = new Set<Orb>();
    const queue = [hit];
    while (queue.length) {
      const cur = queue.pop()!;
      if (group.has(cur)) continue;
      group.add(cur);
      for (const o of orbsRef.current) {
        if (o.color === cur.color && !group.has(o) && Math.hypot(o.x - cur.x, o.y - cur.y) < ORB_R * (o.size + cur.size) * 1.3) queue.push(o);
      }
    }
    if (group.size < 2) return;
    const fusedSize = Math.min(3, 1 + Math.log2(group.size));
    const avgX = [...group].reduce((s, o) => s + o.x, 0) / group.size;
    const avgY = [...group].reduce((s, o) => s + o.y, 0) / group.size;
    orbsRef.current = orbsRef.current.filter(o => !group.has(o));
    orbsRef.current.push({ id: nextId.current++, x: avgX, y: avgY, vy: 0.5, color: hit.color, size: fusedSize, fused: true });
    const pts = group.size * 15 * levelRef.current;
    setScore(s => { const next = s + pts; setBest(b => writeBestScore("color-cascade-fusion", Math.max(b, next))); return next; });
    for (let i = 0; i < group.size * 6; i++) particlesRef.current.push({ x: avgX, y: avgY, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 - 2, life: 30 + Math.random() * 20, color: hit.color });
    if (scoreRef.current + pts > levelRef.current * 200) setLevel(l => l + 1);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 text-sm font-medium">
        <span>{es ? "Puntuaci\u00f3n" : "Score"}: {score}</span>
        <span>{es ? "Mejor" : "Best"}: {best}</span>
        <span>{es ? "Nivel" : "Level"}: {level}</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H} className="rounded-xl border border-white/10 shadow-lg cursor-pointer bg-black max-w-full" onClick={handleClick} style={{ aspectRatio: `${W}/${H}` }} />
      <div className="flex gap-3">
        {!running && !gameOver && <button onClick={hardReset} className="rounded-lg bg-cyan-600 px-5 py-2 font-semibold text-white">{es ? "Empezar" : "Start"}</button>}
        {gameOver && <button onClick={hardReset} className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white">{es ? "Reintentar" : "Retry"}</button>}
        {running && <button onClick={() => setRunning(false)} className="rounded-lg bg-zinc-700 px-5 py-2 font-semibold text-white">{es ? "Pausa" : "Pause"}</button>}
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground">{es ? "Haz clic en orbes del mismo color adyacentes para fusionarlos. Las cadenas dan m\u00e1s puntos. \u00a1No dejes que se amontonen!" : "Click adjacent matching-color orbs to fuse them. Chains score more. Don\u2019t let them pile up!"}</p>
    </div>
  );
}
