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
  rare?: boolean;
};

type Burst = {
  x: number;
  y: number;
  particles: { x: number; y: number; vx: number; vy: number; life: number; hue: number; size?: number }[];
};

type Floater = {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
  hue: number;
  big?: boolean;
};

type Ring = {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  hue: number;
};

export function PulseCatch({ locale }: { locale: "en" | "es" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(0);
  const sparksRef = useRef<Spark[]>([]);
  const burstsRef = useRef<Burst[]>([]);
  const floatersRef = useRef<Floater[]>([]);
  const ringsRef = useRef<Ring[]>([]);
  const missFlashRef = useRef(0);
  const comboPulseRef = useRef(0);
  const newBestFlashRef = useRef(0);
  const idRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastSpawn = useRef(0);
  const elapsedRef = useRef(0);
  const comboRef = useRef(1);
  const bestRef = useRef(0);

  const t = {
    start: locale === "es" ? "Empezar" : "Start",
    score: locale === "es" ? "Puntos" : "Score",
    combo: locale === "es" ? "Combo" : "Combo",
    best: locale === "es" ? "Mejor" : "Best",
    tip:
      locale === "es"
        ? "Tocá las chispas antes de que se apaguen. ¡Mantené el combo! Doradas = más puntos."
        : "Tap sparks before they fade. Keep the combo! Golden = more points.",
  };

  useEffect(() => {
    const stored = Number(localStorage.getItem("pulse-catch-best") || 0);
    setBest(stored);
    bestRef.current = stored;
  }, []);

  useEffect(() => {
    comboRef.current = combo;
  }, [combo]);

  useEffect(() => {
    bestRef.current = best;
  }, [best]);

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
      const interval = Math.max(240, 700 - elapsedRef.current * 0.2);
      if (!running || now - lastSpawn.current < interval) return;
      lastSpawn.current = now;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const rare = Math.random() < 0.08;
      sparksRef.current.push({
        id: idRef.current++,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (rare ? 0.9 : 1.4),
        vy: (Math.random() - 0.5) * (rare ? 0.9 : 1.4),
        life: rare ? 210 : 145,
        maxLife: rare ? 210 : 145,
        hue: rare ? 45 + Math.random() * 25 : 160 + Math.random() * 140,
        radius: rare ? 16 + Math.random() * 6 : 10 + Math.random() * 8,
        trail: [],
        rare,
      });
    };

    const loop = (now: number) => {
      if (running) elapsedRef.current += 16;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "#05050a";
      ctx.fillRect(0, 0, w, h);

      // subtle ambient dots
      ctx.save();
      ctx.globalAlpha = 0.18;
      for (let i = 0; i < 40; i++) {
        const ax = (i * 97 + now * 0.02) % w;
        const ay = (i * 53 + now * 0.015) % h;
        ctx.fillStyle = "#7dd3fc";
        ctx.beginPath();
        ctx.arc(ax, ay, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // vignette
      const g = ctx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, Math.max(w, h) * 0.72);
      g.addColorStop(0, "rgba(30,20,50,0.15)");
      g.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // new best gold flash
      if (newBestFlashRef.current > 0) {
        const a = newBestFlashRef.current / 30;
        ctx.save();
        ctx.globalAlpha = a * 0.35;
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
        newBestFlashRef.current -= 1;
      }

      // miss flash (red edge)
      if (missFlashRef.current > 0) {
        const a = missFlashRef.current / 18;
        ctx.save();
        ctx.globalAlpha = a * 0.55;
        const mg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.7);
        mg.addColorStop(0, "transparent");
        mg.addColorStop(1, "#ff2244");
        ctx.fillStyle = mg;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
        missFlashRef.current -= 1;
      }

      // combo pulse (cyan ring)
      if (comboPulseRef.current > 0) {
        const t = 1 - comboPulseRef.current / 22;
        ctx.save();
        ctx.globalAlpha = (1 - t) * 0.45;
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 40 + t * Math.min(w, h) * 0.35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        comboPulseRef.current -= 1;
      }

      if (running) spawn(now);

      // expanding rings
      ringsRef.current = ringsRef.current.filter((r) => {
        r.r += (r.maxR - r.r) * 0.18;
        r.life -= 1;
        if (r.life <= 0) return false;
        const a = r.life / 22;
        ctx.save();
        ctx.globalAlpha = a * 0.7;
        ctx.strokeStyle = `hsl(${r.hue}, 100%, 65%)`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        return true;
      });

      // sparks + trails
      sparksRef.current = sparksRef.current.filter((s) => {
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 12) s.trail.shift();
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 1;
        if (s.x < -20 || s.x > w + 20 || s.y < -20 || s.y > h + 20 || s.life <= 0) {
          if (running && s.life <= 0) {
            setCombo(1);
            comboRef.current = 1;
            missFlashRef.current = 18;
          }
          return false;
        }
        const alpha = Math.max(0.25, s.life / s.maxLife);

        // trail
        ctx.save();
        for (let i = 0; i < s.trail.length; i++) {
          const p = s.trail[i];
          const ta = (i / s.trail.length) * alpha * 0.5;
          ctx.globalAlpha = ta;
          ctx.fillStyle = `hsl(${s.hue}, 100%, ${s.rare ? 55 : 60}%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, s.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // core + bloom
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = s.rare ? 48 : 36;
        ctx.shadowColor = `hsl(${s.hue}, 100%, 65%)`;
        ctx.fillStyle = `hsl(${s.hue}, 100%, ${s.rare ? 62 : 72}%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = alpha * 0.95;
        ctx.fillStyle = s.rare ? "#fef3c7" : "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * (s.rare ? 0.42 : 0.35), 0, Math.PI * 2);
        ctx.fill();
        if (s.rare) {
          ctx.globalAlpha = alpha * 0.6;
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
        return true;
      });

      // bursts
      burstsRef.current = burstsRef.current.filter((b) => {
        b.particles = b.particles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05;
          p.life -= 1;
          if (p.life <= 0) return false;
          ctx.globalAlpha = p.life / 30;
          ctx.fillStyle = `hsl(${p.hue}, 100%, 70%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size || 2.5, 0, Math.PI * 2);
          ctx.fill();
          return true;
        });
        return b.particles.length > 0;
      });

      // floating score labels
      floatersRef.current = floatersRef.current.filter((f) => {
        f.y -= f.big ? 0.6 : 0.9;
        f.life -= 1;
        if (f.life <= 0) return false;
        const a = f.life / f.maxLife;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.font = `bold ${f.big ? 22 : 14 + (1 - a) * 6}px system-ui, sans-serif`;
        ctx.fillStyle = `hsl(${f.hue}, 100%, 70%)`;
        ctx.textAlign = "center";
        ctx.shadowBlur = f.big ? 16 : 8;
        ctx.shadowColor = `hsl(${f.hue}, 100%, 50%)`;
        ctx.fillText(f.text, f.x, f.y);
        ctx.restore();
        return true;
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
      if (d < s.radius + 24) {
        caught = true;
        const c = comboRef.current;
        const base = s.rare ? 22 : 8;
        const pts = Math.round(base * c + s.radius);
        setScore((prev) => {
          const next = prev + pts;
          if (next > bestRef.current) {
            setBest(next);
            bestRef.current = next;
            localStorage.setItem("pulse-catch-best", String(next));
            newBestFlashRef.current = 30;
            floatersRef.current.push({
              x: s.x,
              y: s.y - 28,
              text: locale === "es" ? "¡NUEVO MEJOR!" : "NEW BEST!",
              life: 50,
              maxLife: 50,
              hue: 45,
              big: true,
            });
          }
          return next;
        });
        const nextCombo = Math.min(c + 1, 20);
        setCombo(nextCombo);
        comboRef.current = nextCombo;
        if (nextCombo === 5 || nextCombo === 10 || nextCombo === 15 || nextCombo === 20) {
          comboPulseRef.current = 22;
        }
        floatersRef.current.push({
          x: s.x,
          y: s.y - 8,
          text: `+${pts}`,
          life: 36,
          maxLife: 36,
          hue: s.hue,
        });
        ringsRef.current.push({
          x: s.x,
          y: s.y,
          r: s.radius,
          maxR: s.radius + 48 + c * 3,
          life: 22,
          hue: s.hue,
        });
        const n = (s.rare ? 20 : 12) + c * 2;
        const particles = Array.from({ length: n }, () => ({
          x: s.x,
          y: s.y,
          vx: (Math.random() - 0.5) * (s.rare ? 7 : 5.5),
          vy: (Math.random() - 0.5) * (s.rare ? 7 : 5.5) - 1,
          life: s.rare ? 36 : 28,
          hue: s.hue + (Math.random() - 0.5) * 40,
          size: s.rare ? 3.2 : 2.4,
        }));
        burstsRef.current.push({ x: s.x, y: s.y, particles });
        return false;
      }
      return true;
    });
    if (!caught) {
      setCombo(1);
      comboRef.current = 1;
      missFlashRef.current = 18;
    }
  };

  const comboPct = Math.min(100, ((combo - 1) / 19) * 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
        <span>
          {t.score}: <span className="text-cyan-400">{score}</span>
        </span>
        <span>
          {t.combo}: <span className="text-fuchsia-400">x{combo}</span>
        </span>
        <span>
          {t.best}: <span className="text-amber-300">{best}</span>
        </span>
        {!running && (
          <button
            type="button"
            onClick={() => {
              setScore(0);
              setCombo(1);
              comboRef.current = 1;
              sparksRef.current = [];
              burstsRef.current = [];
              floatersRef.current = [];
              ringsRef.current = [];
              missFlashRef.current = 0;
              comboPulseRef.current = 0;
              newBestFlashRef.current = 0;
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
      <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-150"
          style={{ width: `${comboPct}%` }}
        />
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
