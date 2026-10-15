import { useEffect, useRef, useState } from "react";

type Spark = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  radius: number;
};

type Burst = {
  x: number;
  y: number;
  particles: { x: number; y: number; vx: number; vy: number; life: number }[];
};

export function PulseCatch({ locale }: { locale: "en" | "es" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(0);
  const sparksRef = useRef<Spark[]>([]);
  const burstsRef = useRef<Burst[]>([]);
  const idRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastSpawn = useRef(0);

  const t = {
    start: locale === "es" ? "Empezar" : "Start",
    score: locale === "es" ? "Puntos" : "Score",
    combo: locale === "es" ? "Combo" : "Combo",
    best: locale === "es" ? "Mejor" : "Best",
    tip: locale === "es" ? "Tocá las chispas antes de que se apaguen" : "Tap sparks before they fade",
  };

  useEffect(() => {
    const stored = Number(localStorage.getItem("pulse-catch-best") || 0);
    setBest(stored);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (now: number) => {
      if (!running || now - lastSpawn.current < 700) return;
      lastSpawn.current = now;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      sparksRef.current.push({
        id: idRef.current++,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        life: 180,
        maxLife: 180,
        hue: 180 + Math.random() * 120,
        radius: 12 + Math.random() * 8,
      });
    };

    const loop = (now: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "#07070b";
      ctx.fillRect(0, 0, w, h);

      // soft vignette
      const g = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, Math.max(w, h) * 0.7);
      g.addColorStop(0, "rgba(20,20,40,0.2)");
      g.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      if (running) spawn(now);

      // update & draw sparks
      sparksRef.current = sparksRef.current.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 1;
        if (s.x < 0 || s.x > w || s.y < 0 || s.y > h || s.life <= 0) {
          if (running && s.life <= 0) setCombo(1);
          return false;
        }
        const alpha = Math.max(0.15, s.life / s.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 24;
        ctx.shadowColor = `hsl(${s.hue}, 100%, 60%)`;
        ctx.fillStyle = `hsl(${s.hue}, 100%, 65%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      // bursts
      burstsRef.current = burstsRef.current.filter((b) => {
        b.particles = b.particles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 1;
          if (p.life <= 0) return false;
          ctx.globalAlpha = p.life / 30;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
          return true;
        });
        return b.particles.length > 0;
      });
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [running]);

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!running) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let caught = false;
    sparksRef.current = sparksRef.current.filter((s) => {
      const d = Math.hypot(s.x - x, s.y - y);
      if (d < s.radius + 18) {
        caught = true;
        const pts = Math.round(10 * combo);
        setScore((prev) => {
          const next = prev + pts;
          if (next > best) {
            setBest(next);
            localStorage.setItem("pulse-catch-best", String(next));
          }
          return next;
        });
        setCombo((c) => Math.min(c + 1, 12));
        // burst
        const particles = Array.from({ length: 14 }, () => ({
          x: s.x,
          y: s.y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 30,
        }));
        burstsRef.current.push({ x: s.x, y: s.y, particles });
        return false;
      }
      return true;
    });
    if (!caught) setCombo(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
        <span>{t.score}: <span className="text-cyan-400">{score}</span></span>
        <span>{t.combo}: <span className="text-fuchsia-400">x{combo}</span></span>
        <span>{t.best}: <span className="text-amber-300">{best}</span></span>
        {!running && (
          <button
            type="button"
            onClick={() => {
              setScore(0);
              setCombo(1);
              sparksRef.current = [];
              setRunning(true);
            }}
            className="rounded-full bg-cyan-500 px-4 py-1.5 text-black hover:bg-cyan-400"
          >
            {t.start}
          </button>
        )}
        {running && (
          <button
            type="button"
            onClick={() => setRunning(false)}
            className="rounded-full border border-white/20 px-4 py-1.5 hover:bg-white/5"
          >
            {locale === "es" ? "Pausa" : "Pause"}
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{t.tip}</p>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black" style={{ height: 420 }}>
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-crosshair touch-none"
          onPointerDown={onPointer}
        />
      </div>
    </div>
  );
}
