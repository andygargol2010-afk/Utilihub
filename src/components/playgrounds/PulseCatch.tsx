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
  trail: { x: number; y: number }[];
};

type Burst = {
  x: number;
  y: number;
  particles: { x: number; y: number; vx: number; vy: number; life: number; hue: number }[];
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
  const elapsedRef = useRef(0);

  const t = {
    start: locale === "es" ? "Empezar" : "Start",
    score: locale === "es" ? "Puntos" : "Score",
    combo: locale === "es" ? "Combo" : "Combo",
    best: locale === "es" ? "Mejor" : "Best",
    tip: locale === "es" ? "Tocá las chispas antes de que se apaguen. ¡Mantené el combo!" : "Tap sparks before they fade. Keep the combo!",
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (now: number) => {
      const interval = Math.max(280, 750 - elapsedRef.current * 0.15);
      if (!running || now - lastSpawn.current < interval) return;
      lastSpawn.current = now;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      sparksRef.current.push({
        id: idRef.current++,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        life: 160,
        maxLife: 160,
        hue: 160 + Math.random() * 140,
        radius: 11 + Math.random() * 9,
        trail: [],
      });
    };

    const loop = (now: number) => {
      if (running) elapsedRef.current += 16;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "#05050a";
      ctx.fillRect(0, 0, w, h);

      // vignette
      const g = ctx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, Math.max(w, h) * 0.72);
      g.addColorStop(0, "rgba(30,20,50,0.15)");
      g.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      if (running) spawn(now);

      // sparks + trails
      sparksRef.current = sparksRef.current.filter((s) => {
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 10) s.trail.shift();
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 1;
        if (s.x < -20 || s.x > w + 20 || s.y < -20 || s.y > h + 20 || s.life <= 0) {
          if (running && s.life <= 0) setCombo(1);
          return false;
        }
        const alpha = Math.max(0.2, s.life / s.maxLife);

        // trail
        ctx.save();
        for (let i = 0; i < s.trail.length; i++) {
          const p = s.trail[i];
          const ta = (i / s.trail.length) * alpha * 0.45;
          ctx.globalAlpha = ta;
          ctx.fillStyle = `hsl(${s.hue}, 100%, 60%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, s.radius * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // core + bloom
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 36;
        ctx.shadowColor = `hsl(${s.hue}, 100%, 65%)`;
        ctx.fillStyle = `hsl(${s.hue}, 100%, 72%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      // bursts
      burstsRef.current = burstsRef.current.filter((b) => {
        b.particles = b.particles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.06;
          p.life -= 1;
          if (p.life <= 0) return false;
          ctx.globalAlpha = p.life / 28;
          ctx.fillStyle = `hsl(${p.hue}, 100%, 70%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
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
      if (d < s.radius + 22) {
        caught = true;
        const pts = Math.round(8 * combo + s.radius);
        setScore((prev) => {
          const next = prev + pts;
          if (next > best) {
            setBest(next);
            localStorage.setItem("pulse-catch-best", String(next));
          }
          return next;
        });
        setCombo((c) => Math.min(c + 1, 15));
        const n = 12 + combo * 2;
        const particles = Array.from({ length: n }, () => ({
          x: s.x,
          y: s.y,
          vx: (Math.random() - 0.5) * 5.5,
          vy: (Math.random() - 0.5) * 5.5 - 1,
          life: 28,
          hue: s.hue + (Math.random() - 0.5) * 40,
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
              burstsRef.current = [];
              elapsedRef.current = 0;
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
