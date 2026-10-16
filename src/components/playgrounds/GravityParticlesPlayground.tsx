"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

type Locale = "en" | "es";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
}

interface Attractor {
  x: number;
  y: number;
  id: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
}

const labels = {
  en: {
    count: "Particle count",
    gravity: "Gravity strength",
    friction: "Friction",
    trails: "Trails",
    clear: "Clear attractors",
    reset: "Reset particles",
    share: "Copy share link",
    copied: "Copied!",
    help: "Click/tap to place attractors. Drag to move them. Double-click/tap removes nearest. Particles orbit in real time.",
    attractors: "Attractors",
  },
  es: {
    count: "Cantidad de partículas",
    gravity: "Fuerza de gravedad",
    friction: "Fricción",
    trails: "Estelas",
    clear: "Limpiar atrayentes",
    reset: "Reiniciar partículas",
    share: "Copiar enlace",
    copied: "¡Copiado!",
    help: "Clic/toque para colocar atrayentes. Arrastrá para moverlos. Doble clic/toque elimina el más cercano. Las partículas orbitan en tiempo real.",
    attractors: "Atrayentes",
  },
};

export function GravityParticlesPlayground({ locale }: { locale: Locale }) {
  const t = labels[locale];
  useEffect(() => {
    trackEvent("playground_open", { id: "gravity-particles", locale });
  }, [locale]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const attractorsRef = useRef<Attractor[]>([]);
  const starsRef = useRef<Star[]>([]);
  const nextId = useRef(1);
  const paramsRef = useRef({
    count: 200,
    gravity: 0.8,
    friction: 0.007,
    trails: true,
  });
  const dragId = useRef<number | null>(null);
  const lastTap = useRef({ time: 0, x: 0, y: 0 });

  const [count, setCount] = useState(200);
  const [gravity, setGravity] = useState(0.8);
  const [friction, setFriction] = useState(0.007);
  const [trails, setTrails] = useState(true);
  const [copied, setCopied] = useState(false);
  const [attractorCount, setAttractorCount] = useState(0);

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = parseInt(params.get("count") || "200", 10);
    const g = parseFloat(params.get("g") || "0.8");
    const f = parseFloat(params.get("f") || "0.007");
    const tr = params.get("trails") !== "0";
    const attrs = params.get("a");
    if (!isNaN(c) && c >= 50 && c <= 600) setCount(c);
    if (!isNaN(g) && g >= 0.1 && g <= 3) setGravity(g);
    if (!isNaN(f) && f >= 0 && f <= 0.05) setFriction(f);
    setTrails(tr);
    if (attrs) {
      const parts = attrs.split(";").filter(Boolean);
      const loaded: Attractor[] = [];
      parts.forEach((p) => {
        const [xs, ys] = p.split(",");
        const x = parseFloat(xs);
        const y = parseFloat(ys);
        if (!isNaN(x) && !isNaN(y)) {
          loaded.push({ x, y, id: nextId.current++ });
        }
      });
      attractorsRef.current = loaded;
      setAttractorCount(loaded.length);
    }
  }, []);

  useEffect(() => {
    paramsRef.current = { count, gravity, friction, trails };
  }, [count, gravity, friction, trails]);

  const initParticles = useCallback((n: number, w: number, h: number) => {
    const ps: Particle[] = [];
    for (let i = 0; i < n; i++) {
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: 1.2 + Math.random() * 2.2,
        hue: 180 + Math.random() * 80,
      });
    }
    particlesRef.current = ps;
  }, []);

  const initStars = useCallback((w: number, h: number) => {
    const stars: Star[] = [];
    const n = Math.floor((w * h) / 2800);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 1.1,
        a: 0.25 + Math.random() * 0.55,
      });
    }
    starsRef.current = stars;
  }, []);

  const findNearest = (x: number, y: number, maxDist = 40) => {
    let best: Attractor | null = null;
    let bestD2 = maxDist * maxDist;
    for (const a of attractorsRef.current) {
      const dx = a.x - x;
      const dy = a.y - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) {
        bestD2 = d2;
        best = a;
      }
    }
    return best;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.scale(dpr, dpr);
      if (particlesRef.current.length === 0) {
        initParticles(paramsRef.current.count, rect.width, rect.height);
      }
      initStars(rect.width, rect.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const getPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      const { x, y } = getPos(e);
      const now = Date.now();
      const isDouble = now - lastTap.current.time < 320 && Math.hypot(x - lastTap.current.x, y - lastTap.current.y) < 30;

      if (isDouble) {
        const nearest = findNearest(x, y, 50);
        if (nearest) {
          attractorsRef.current = attractorsRef.current.filter((a) => a.id !== nearest.id);
          setAttractorCount(attractorsRef.current.length);
          lastTap.current.time = 0;
          return;
        }
      }

      const nearest = findNearest(x, y, 36);
      if (nearest) {
        dragId.current = nearest.id;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } else {
        attractorsRef.current.push({ x, y, id: nextId.current++ });
        setAttractorCount(attractorsRef.current.length);
      }
      lastTap.current = { time: now, x, y };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragId.current == null) return;
      const { x, y } = getPos(e);
      const a = attractorsRef.current.find((at) => at.id === dragId.current);
      if (a) {
        a.x = x;
        a.y = y;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      dragId.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { gravity: g, friction: fr, trails: tr } = paramsRef.current;
      const attrs = attractorsRef.current;
      const ps = particlesRef.current;
      const stars = starsRef.current;

      if (tr) {
        ctx.fillStyle = "rgba(8, 12, 28, 0.16)";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = "#080c1c";
        ctx.fillRect(0, 0, w, h);
      }

      // Starfield
      ctx.fillStyle = "#c7d2fe";
      for (const s of stars) {
        ctx.globalAlpha = s.a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw attractors with glow
      for (const a of attrs) {
        const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 36);
        grad.addColorStop(0, "rgba(255, 200, 80, 0.98)");
        grad.addColorStop(0.35, "rgba(255, 130, 50, 0.55)");
        grad.addColorStop(0.7, "rgba(255, 90, 30, 0.18)");
        grad.addColorStop(1, "rgba(255, 80, 20, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(a.x, a.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#fffbeb";
        ctx.fill();
      }

      const damp = 1 - fr;
      for (const p of ps) {
        let ax = 0;
        let ay = 0;
        for (const a of attrs) {
          const dx = a.x - p.x;
          const dy = a.y - p.y;
          const dist2 = dx * dx + dy * dy;
          const dist = Math.sqrt(dist2) || 1;
          const force = g / (dist2 * 0.012 + 36);
          ax += (dx / dist) * force;
          ay += (dy / dist) * force;
        }
        p.vx += ax;
        p.vy += ay;
        p.vx *= damp;
        p.vy *= damp;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const speed = Math.hypot(p.vx, p.vy);
        const hue = (p.hue + speed * 7) % 360;
        ctx.shadowColor = `hsl(${hue}, 90%, 65%)`;
        ctx.shadowBlur = 6 + speed * 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, 85%, 68%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, [initParticles, initStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0) {
      initParticles(count, rect.width, rect.height);
    }
  }, [count, initParticles]);

  const clearAttractors = () => {
    attractorsRef.current = [];
    setAttractorCount(0);
  };

  const resetParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    initParticles(count, rect.width, rect.height);
  };

  const share = async () => {
    trackEvent("share_click", { id: "gravity-particles", locale });
    const params = new URLSearchParams();
    params.set("count", String(count));
    params.set("g", gravity.toFixed(2));
    params.set("f", friction.toFixed(3));
    params.set("trails", trails ? "1" : "0");
    if (attractorsRef.current.length) {
      const aStr = attractorsRef.current
        .map((a) => `${Math.round(a.x)},${Math.round(a.y)}`)
        .join(";");
      params.set("a", aStr);
    }
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt(locale === "es" ? "Copiá este enlace:" : "Copy this link:", url);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#080c1c] shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-[420px] w-full touch-none sm:h-[520px]"
          style={{ display: "block" }}
        />
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/40 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
          {t.attractors}: {attractorCount}
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.count} ({count})</span>
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="accent-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.gravity} ({gravity.toFixed(2)})</span>
          <input
            type="range"
            min={0.1}
            max={2.5}
            step={0.05}
            value={gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
            className="accent-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.friction} ({friction.toFixed(3)})</span>
          <input
            type="range"
            min={0}
            max={0.03}
            step={0.001}
            value={friction}
            onChange={(e) => setFriction(Number(e.target.value))}
            className="accent-primary"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={trails}
            onChange={(e) => setTrails(e.target.checked)}
            className="accent-primary"
          />
          {t.trails}
        </label>

        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
          <button
            type="button"
            onClick={clearAttractors}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {t.clear}
          </button>
          <button
            type="button"
            onClick={resetParticles}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {t.reset}
          </button>
          <button
            type="button"
            onClick={share}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            {copied ? t.copied : t.share}
          </button>
        </div>

        <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-4">
          {t.help}
        </p>
      </div>
    </div>
  );
}
