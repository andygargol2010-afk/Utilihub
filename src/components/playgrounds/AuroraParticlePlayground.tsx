"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

type Locale = "en" | "es";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
  life: number;
}

interface Attractor {
  x: number;
  y: number;
  id: number;
  strength: number;
}

const labels = {
  en: {
    density: "Density",
    speed: "Flow speed",
    hue: "Hue shift",
    turbulence: "Turbulence",
    trailFade: "Trail fade",
    particleSize: "Particle size",
    strength: "Attractor strength",
    clear: "Clear attractors",
    reset: "Reset particles",
    sharePng: "Download PNG",
    shareUrl: "Copy share link",
    copied: "Copied!",
    help: "Click/tap to place magnetic attractors. Drag to move them. Right-click (or long-press) to delete the nearest. Particles form flowing aurora ribbons with persistent glowing trails that respond in real time. Tune density, speed, hue, turbulence, trail persistence, size and attractor strength. Try a color preset.",
    attractors: "Attractors",
    presets: "Color presets",
    aurora: "Aurora",
    neon: "Neon",
    sunset: "Sunset",
    ice: "Ice",
  },
  es: {
    density: "Densidad",
    speed: "Velocidad de flujo",
    hue: "Desplazamiento de tono",
    turbulence: "Turbulencia",
    trailFade: "Desvanecimiento de estela",
    particleSize: "Tamaño de partícula",
    strength: "Fuerza de atractores",
    clear: "Limpiar atractores",
    reset: "Reiniciar partículas",
    sharePng: "Descargar PNG",
    shareUrl: "Copiar enlace",
    copied: "¡Copiado!",
    help: "Clic/toque para colocar atractores magnéticos. Arrastrá para moverlos. Clic derecho (o pulsación larga) para borrar el más cercano. Las partículas forman cintas de aurora fluidas con estelas brillantes persistentes que responden en tiempo real. Ajustá densidad, velocidad, tono, turbulencia, persistencia de estela, tamaño y fuerza de atractores. Probá un preset de color.",
    attractors: "Atractores",
    presets: "Presets de color",
    aurora: "Aurora",
    neon: "Neón",
    sunset: "Atardecer",
    ice: "Hielo",
  },
};

const PRESETS = {
  aurora: { hue: 160, name: "aurora" },
  neon: { hue: 300, name: "neon" },
  sunset: { hue: 20, name: "sunset" },
  ice: { hue: 200, name: "ice" },
};

export function AuroraParticlePlayground({ locale }: { locale: Locale }) {
  const t = labels[locale];
  useEffect(() => {
    trackEvent("playground_open", { id: "aurora-particle-playground", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const attractorsRef = useRef<Attractor[]>([]);
  const nextId = useRef(1);
  const paramsRef = useRef({
    density: 120,
    speed: 1.4,
    hueShift: 180,
    turbulence: 0.3,
    trailFade: 0.06,
    particleSize: 1.6,
    strength: 1.2,
  });
  const dragId = useRef<number | null>(null);

  const [density, setDensity] = useState(120);
  const [speed, setSpeed] = useState(1.4);
  const [hueShift, setHueShift] = useState(180);
  const [turbulence, setTurbulence] = useState(0.3);
  const [trailFade, setTrailFade] = useState(0.06);
  const [particleSize, setParticleSize] = useState(1.6);
  const [strength, setStrength] = useState(1.2);
  const [copied, setCopied] = useState(false);
  const [attractorCount, setAttractorCount] = useState(0);

  useEffect(() => {
    paramsRef.current = { density, speed, hueShift, turbulence, trailFade, particleSize, strength };
  }, [density, speed, hueShift, turbulence, trailFade, particleSize, strength]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    const d = Number(qs.get("d"));
    if (d >= 40 && d <= 280) setDensity(d);
    const s = Number(qs.get("s"));
    if (s >= 0.4 && s <= 3) setSpeed(s);
    const h = Number(qs.get("h"));
    if (h >= 0 && h <= 360) setHueShift(h);
    const tb = Number(qs.get("tb"));
    if (tb >= 0 && tb <= 1.2) setTurbulence(tb);
    const tf = Number(qs.get("tf"));
    if (tf >= 0.02 && tf <= 0.15) setTrailFade(tf);
    const ps = Number(qs.get("ps"));
    if (ps >= 0.8 && ps <= 3) setParticleSize(ps);
    const st = Number(qs.get("st"));
    if (st >= 0.3 && st <= 3) setStrength(st);
    const aStr = qs.get("a");
    if (aStr) {
      const parts = aStr.split(";").filter(Boolean);
      const loaded: Attractor[] = [];
      for (const part of parts) {
        const [xs, ys] = part.split(",");
        const x = Number(xs);
        const y = Number(ys);
        if (Number.isFinite(x) && Number.isFinite(y)) {
          loaded.push({ x, y, id: nextId.current++, strength: 1 });
        }
      }
      if (loaded.length) {
        attractorsRef.current = loaded;
        setAttractorCount(loaded.length);
      }
    }
  }, []);

  const initParticles = useCallback((n: number, w: number, h: number) => {
    const ps: Particle[] = [];
    const mobile = w < 640;
    const budget = mobile ? Math.min(n, 100) : n;
    for (let i = 0; i < budget; i++) {
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        hue: Math.random() * 60 + 160,
        life: Math.random() * 100,
      });
    }
    particlesRef.current = ps;
  }, []);

  const findNearest = (x: number, y: number, maxDist = 48) => {
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particlesRef.current.length === 0) {
        initParticles(paramsRef.current.density, rect.width, rect.height);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const getPos = (e: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      const { x, y } = getPos(e);
      const nearest = findNearest(x, y);
      if (nearest) {
        dragId.current = nearest.id;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } else {
        attractorsRef.current.push({
          x,
          y,
          id: nextId.current++,
          strength: 1,
        });
        setAttractorCount(attractorsRef.current.length);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragId.current == null) return;
      const { x, y } = getPos(e);
      const a = attractorsRef.current.find((aa) => aa.id === dragId.current);
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

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const { x, y } = getPos(e);
      const nearest = findNearest(x, y, 60);
      if (nearest) {
        attractorsRef.current = attractorsRef.current.filter((a) => a.id !== nearest.id);
        setAttractorCount(attractorsRef.current.length);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("contextmenu", onContextMenu);

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { speed: sp, hueShift: hs, turbulence: tb, trailFade: tf, particleSize: psz, strength: st } = paramsRef.current;
      const atts = attractorsRef.current;
      const ps = particlesRef.current;

      // Persistent trails with tunable fade for aurora ribbons
      ctx.fillStyle = `rgba(4, 8, 18, ${tf})`;
      ctx.fillRect(0, 0, w, h);

      // Draw attractors as soft magnetic wells
      for (const a of atts) {
        const rad = 48;
        const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, rad);
        grad.addColorStop(0, "rgba(140, 220, 255, 0.55)");
        grad.addColorStop(0.4, "rgba(80, 180, 255, 0.25)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(a.x, a.y, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(a.x, a.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#e0f2fe";
        ctx.fill();
      }

      for (const p of ps) {
        let ax = 0;
        let ay = 0;
        for (const a of atts) {
          const dx = a.x - p.x;
          const dy = a.y - p.y;
          const dist2 = dx * dx + dy * dy;
          const dist = Math.sqrt(dist2) || 1;
          const force = (a.strength * st * 1.8) / (dist2 * 0.004 + 80);
          ax += (dx / dist) * force;
          ay += (dy / dist) * force;
        }
        // Turbulence
        ax += (Math.random() - 0.5) * tb * 0.8;
        ay += (Math.random() - 0.5) * tb * 0.8;

        p.vx += ax;
        p.vy += ay;
        p.vx *= 0.985;
        p.vy *= 0.985;
        const maxV = 5.5 * sp;
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > maxV) {
          p.vx = (p.vx / spd) * maxV;
          p.vy = (p.vy / spd) * maxV;
        }

        p.x += p.vx * sp;
        p.y += p.vy * sp;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        p.life += 1;
        const hue = (hs + p.hue + Math.sin(p.life * 0.02) * 20) % 360;
        const alpha = 0.55 + Math.min(0.4, spd * 0.08);

        // Glowing ribbon trail segment with size control
        const r = psz + Math.min(2.2, spd * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 85%, 68%, ${alpha})`;
        ctx.fill();

        // Soft bloom
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.2 + spd * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 90%, 75%, 0.12)`;
        ctx.fill();
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
      canvas.removeEventListener("contextmenu", onContextMenu);
    };
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0) {
      initParticles(density, rect.width, rect.height);
    }
  }, [density, initParticles]);

  const clearAttractors = () => {
    attractorsRef.current = [];
    setAttractorCount(0);
  };

  const resetParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    initParticles(density, rect.width, rect.height);
  };

  const applyPreset = (key: keyof typeof PRESETS) => {
    const p = PRESETS[key];
    setHueShift(p.hue);
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    trackEvent("share_click", { id: "aurora-particle-playground", locale, type: "png" });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = locale === "es" ? "playground-aurora-particulas.png" : "aurora-particle-playground.png";
    a.click();
  };

  const shareUrl = async () => {
    trackEvent("share_click", { id: "aurora-particle-playground", locale, type: "url" });
    const params = new URLSearchParams();
    params.set("d", String(density));
    params.set("s", speed.toFixed(2));
    params.set("h", String(Math.round(hueShift)));
    params.set("tb", turbulence.toFixed(2));
    params.set("tf", trailFade.toFixed(3));
    params.set("ps", particleSize.toFixed(1));
    params.set("st", strength.toFixed(2));
    if (attractorsRef.current.length) {
      const aStr = attractorsRef.current.map((a) => `${Math.round(a.x)},${Math.round(a.y)}`).join(";");
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
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#040812] shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-[420px] w-full touch-none sm:h-[520px]"
          style={{ display: "block" }}
        />
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/50 px-2 py-1 text-xs text-white/85 backdrop-blur-sm">
          {t.attractors}: {attractorCount}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{t.help}</p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">{t.presets}:</span>
        {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => applyPreset(k)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            {t[k]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.density} ({density})</span>
          <input
            type="range"
            min={40}
            max={280}
            step={10}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="accent-primary min-h-11"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.speed} ({speed.toFixed(2)})</span>
          <input
            type="range"
            min={0.4}
            max={3}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="accent-primary min-h-11"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.hue} ({Math.round(hueShift)})</span>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={hueShift}
            onChange={(e) => setHueShift(Number(e.target.value))}
            className="accent-primary min-h-11"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.turbulence} ({turbulence.toFixed(2)})</span>
          <input
            type="range"
            min={0}
            max={1.2}
            step={0.05}
            value={turbulence}
            onChange={(e) => setTurbulence(Number(e.target.value))}
            className="accent-primary min-h-11"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.trailFade} ({trailFade.toFixed(3)})</span>
          <input
            type="range"
            min={0.02}
            max={0.15}
            step={0.005}
            value={trailFade}
            onChange={(e) => setTrailFade(Number(e.target.value))}
            className="accent-primary min-h-11"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.particleSize} ({particleSize.toFixed(1)})</span>
          <input
            type="range"
            min={0.8}
            max={3}
            step={0.1}
            value={particleSize}
            onChange={(e) => setParticleSize(Number(e.target.value))}
            className="accent-primary min-h-11"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.strength} ({strength.toFixed(2)})</span>
          <input
            type="range"
            min={0.3}
            max={3}
            step={0.1}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="accent-primary min-h-11"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={clearAttractors}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          {t.clear}
        </button>
        <button
          type="button"
          onClick={resetParticles}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          {t.reset}
        </button>
        <button
          type="button"
          onClick={downloadPng}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
        >
          {t.sharePng}
        </button>
        <button
          type="button"
          onClick={shareUrl}
          className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium hover:bg-primary/20"
        >
          {copied ? t.copied : t.shareUrl}
        </button>
      </div>
    </div>
  );
}
