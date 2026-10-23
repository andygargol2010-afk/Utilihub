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
  life: number;
  mode: "ribbon" | "orb" | "vortex";
  trail: { x: number; y: number }[];
}

interface Emitter {
  x: number;
  y: number;
  id: number;
  strength: number;
}

const labels = {
  en: {
    density: "Density",
    speed: "Speed",
    bloom: "Bloom intensity",
    gravity: "Gravity",
    wind: "Wind",
    mode: "Mode",
    palette: "Palette",
    pause: "Pause",
    resume: "Resume",
    randomize: "Randomize",
    clear: "Clear emitters",
    sharePng: "Download PNG",
    shareLink: "Copy link",
    copied: "Copied!",
    help: "Click/tap to place emitters. Drag to move. Double-click removes nearest. Toggle Attract/Repel. Hover for dynamic pointer force. Particles form flowing ribbons with persistent fading trails, blooming orbs or swirling vortices.",
    emitters: "Emitters",
    polarity: "Polarity",
    attract: "Attract",
    repel: "Repel",
  },
  es: {
    density: "Densidad",
    speed: "Velocidad",
    bloom: "Intensidad bloom",
    gravity: "Gravedad",
    wind: "Viento",
    mode: "Modo",
    palette: "Paleta",
    pause: "Pausa",
    resume: "Reanudar",
    randomize: "Aleatorio",
    clear: "Limpiar emisores",
    sharePng: "Descargar PNG",
    shareLink: "Copiar enlace",
    copied: "\u00a1Copiado!",
    help: "Clic/toque para colocar emisores. Arrastr\u00e1 para mover. Doble clic elimina el m\u00e1s cercano. Altern\u00e1 Atraer/Repeler. Hover para fuerza din\u00e1mica del puntero. Part\u00edculas forman cintas fluidas con estelas persistentes que se desvanecen, orbes blooming o v\u00f3rtices.",
    emitters: "Emisores",
    polarity: "Polaridad",
    attract: "Atraer",
    repel: "Repeler",
  },
};

const palettes = {
  aurora: { base: 140, range: 80 },
  neon: { base: 280, range: 60 },
  sunset: { base: 20, range: 40 },
  cosmic: { base: 220, range: 100 },
  ocean: { base: 190, range: 50 },
};

const TRAIL_LEN = 10;

export function AuroraParticlePlayground({ locale }: { locale: Locale }) {
  const t = labels[locale];
  useEffect(() => {
    trackEvent("playground_open", { id: "aurora-particle-playground", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const emittersRef = useRef<Emitter[]>([]);
  const nextId = useRef(1);
  const paramsRef = useRef({
    density: 180,
    speed: 1.2,
    bloom: 0.7,
    gravity: 0.4,
    wind: 0.2,
    mode: "ribbon" as "ribbon" | "orb" | "vortex",
    palette: "aurora" as keyof typeof palettes,
    paused: false,
    polarity: "attract" as "attract" | "repel",
  });
  const dragId = useRef<number | null>(null);
  const lastTap = useRef({ time: 0, x: 0, y: 0 });

  const [density, setDensity] = useState(180);
  const [speed, setSpeed] = useState(1.2);
  const [bloom, setBloom] = useState(0.7);
  const [gravity, setGravity] = useState(0.4);
  const [wind, setWind] = useState(0.2);
  const [mode, setMode] = useState<"ribbon" | "orb" | "vortex">("ribbon");
  const [palette, setPalette] = useState<keyof typeof palettes>("aurora");
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emitterCount, setEmitterCount] = useState(0);
  const [polarity, setPolarity] = useState<"attract" | "repel">("attract");
  const pointerRef = useRef<{x: number; y: number; active: boolean}>({x: 0, y: 0, active: false});

  useEffect(() => {
    paramsRef.current = { density, speed, bloom, gravity, wind, mode, palette, paused, polarity };
  }, [density, speed, bloom, gravity, wind, mode, palette, paused, polarity]);

  const spawn = useCallback((count: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    for (let i = 0; i < count; i++) {
      const p = palettes[paramsRef.current.palette];
      particlesRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 1.2 + Math.random() * 2.4,
        hue: p.base + Math.random() * p.range,
        life: 200 + Math.random() * 200,
        mode: paramsRef.current.mode,
        trail: [],
      });
    }
  }, []);

  useEffect(() => {
    spawn(density);
  }, [density, spawn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      const p = paramsRef.current;
      if (p.paused) { raf = requestAnimationFrame(loop); return; }

      ctx.fillStyle = "rgba(4,8,20,0.18)";
      ctx.fillRect(0, 0, w, h);

      const emitters = emittersRef.current;
      const ptr = pointerRef.current;

      for (const part of particlesRef.current) {
        let fx = 0, fy = 0;
        for (const em of emitters) {
          const dx = em.x - part.x, dy = em.y - part.y;
          const dist = Math.hypot(dx, dy) || 1;
          const force = (em.strength * 40) / (dist * dist);
          const sign = p.polarity === "attract" ? 1 : -1;
          fx += (dx / dist) * force * sign;
          fy += (dy / dist) * force * sign;
        }
        if (ptr.active) {
          const dx = ptr.x - part.x, dy = ptr.y - part.y;
          const dist = Math.hypot(dx, dy) || 1;
          const force = 18 / (dist * 0.4 + 1);
          const sign = p.polarity === "attract" ? 1 : -1;
          fx += (dx / dist) * force * sign;
          fy += (dy / dist) * force * sign;
        }
        part.vx += fx * 0.02 + p.wind * 0.015;
        part.vy += fy * 0.02 + p.gravity * 0.012;
        part.vx *= 0.985;
        part.vy *= 0.985;
        part.x += part.vx * p.speed;
        part.y += part.vy * p.speed;
        if (part.x < 0) part.x += w; if (part.x > w) part.x -= w;
        if (part.y < 0) part.y += h; if (part.y > h) part.y -= h;
        part.life -= 0.4;
        if (part.life < 0) {
          part.x = Math.random() * w;
          part.y = Math.random() * h;
          part.life = 200 + Math.random() * 200;
          part.trail = [];
        }
        part.trail.push({ x: part.x, y: part.y });
        if (part.trail.length > TRAIL_LEN) part.trail.shift();

        const alpha = Math.max(0.15, part.life / 400);
        if (p.mode === "ribbon" && part.trail.length > 2) {
          ctx.beginPath();
          ctx.moveTo(part.trail[0].x, part.trail[0].y);
          for (let i = 1; i < part.trail.length; i++) ctx.lineTo(part.trail[i].x, part.trail[i].y);
          ctx.strokeStyle = `hsla(${part.hue}, 80%, 65%, ${alpha * 0.7})`;
          ctx.lineWidth = part.size * 0.8;
          ctx.shadowColor = `hsla(${part.hue}, 90%, 70%, ${p.bloom})`;
          ctx.shadowBlur = 12 * p.bloom;
          ctx.stroke();
        } else if (p.mode === "orb") {
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size * 1.4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${part.hue}, 75%, 62%, ${alpha})`;
          ctx.shadowColor = `hsla(${part.hue}, 90%, 70%, ${p.bloom})`;
          ctx.shadowBlur = 16 * p.bloom;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${part.hue + Math.sin(part.life * 0.1) * 20}, 70%, 60%, ${alpha})`;
          ctx.shadowColor = `hsla(${part.hue}, 85%, 65%, ${p.bloom})`;
          ctx.shadowBlur = 10 * p.bloom;
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      // Draw emitters
      for (const em of emitters) {
        ctx.beginPath();
        ctx.arc(em.x, em.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = p.polarity === "attract" ? "rgba(100,255,180,0.85)" : "rgba(255,100,140,0.85)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const pt = pos(e);
    const now = Date.now();
    const near = emittersRef.current.find((em) => Math.hypot(em.x - pt.x, em.y - pt.y) < 18);
    if (near) {
      if (now - lastTap.current.time < 280 && Math.hypot(pt.x - lastTap.current.x, pt.y - lastTap.current.y) < 20) {
        emittersRef.current = emittersRef.current.filter((em) => em.id !== near.id);
        setEmitterCount(emittersRef.current.length);
        dragId.current = null;
      } else {
        dragId.current = near.id;
      }
    } else {
      emittersRef.current.push({ x: pt.x, y: pt.y, id: nextId.current++, strength: 1 });
      setEmitterCount(emittersRef.current.length);
    }
    lastTap.current = { time: now, x: pt.x, y: pt.y };
    pointerRef.current = { ...pt, active: true };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const pt = pos(e);
    pointerRef.current = { ...pt, active: true };
    if (dragId.current != null) {
      const em = emittersRef.current.find((em) => em.id === dragId.current);
      if (em) { em.x = pt.x; em.y = pt.y; }
    }
  };

  const onPointerUp = () => { dragId.current = null; pointerRef.current.active = false; };

  const randomize = () => {
    const modes: Array<"ribbon" | "orb" | "vortex"> = ["ribbon", "orb", "vortex"];
    const pals = Object.keys(palettes) as Array<keyof typeof palettes>;
    setMode(modes[Math.floor(Math.random() * modes.length)]);
    setPalette(pals[Math.floor(Math.random() * pals.length)]);
    setDensity(120 + Math.floor(Math.random() * 180));
    setSpeed(0.6 + Math.random() * 1.4);
    setBloom(0.3 + Math.random() * 0.7);
    setGravity(Math.random() * 0.8);
    setWind((Math.random() - 0.5) * 0.6);
    setPolarity(Math.random() > 0.5 ? "attract" : "repel");
    trackEvent("playground_randomize", { id: "aurora-particle-playground", locale });
  };

  const clearEmitters = () => { emittersRef.current = []; setEmitterCount(0); };

  const shareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("d", String(density));
    url.searchParams.set("s", String(speed));
    url.searchParams.set("b", String(bloom));
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sharePng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `aurora-particles-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#040814] shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-[420px] w-full touch-none sm:h-[520px]"
          style={{ display: "block" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/40 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
          {t.emitters}: {emitterCount}
        </div>
      </div>
      <div className="grid gap-3 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-medium">
          {t.density}
          <input type="range" min={40} max={320} value={density} onChange={(e) => setDensity(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {t.speed}
          <input type="range" min={0.3} max={2.5} step={0.05} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {t.bloom}
          <input type="range" min={0} max={1} step={0.05} value={bloom} onChange={(e) => setBloom(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {t.gravity}
          <input type="range" min={0} max={1} step={0.05} value={gravity} onChange={(e) => setGravity(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {t.wind}
          <input type="range" min={-0.5} max={0.5} step={0.02} value={wind} onChange={(e) => setWind(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {t.mode}
          <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-xs">
            <option value="ribbon">Ribbon</option>
            <option value="orb">Orb</option>
            <option value="vortex">Vortex</option>
          </select>
        </label>
        <label className="text-xs font-medium">
          {t.palette}
          <select value={palette} onChange={(e) => setPalette(e.target.value as any)} className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-xs">
            {Object.keys(palettes).map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button type="button" onClick={() => setPaused((p) => !p)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">
            {paused ? t.resume : t.pause}
          </button>
          <button type="button" onClick={() => setPolarity((p) => p === "attract" ? "repel" : "attract")} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">
            {t.polarity}: {polarity === "attract" ? t.attract : t.repel}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
          <button type="button" onClick={randomize} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">{t.randomize}</button>
          <button type="button" onClick={clearEmitters} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">{t.clear}</button>
          <button type="button" onClick={shareLink} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">{copied ? t.copied : t.shareLink}</button>
          <button type="button" onClick={sharePng} className="rounded-lg bg-primary/80 px-3 py-1.5 text-xs font-semibold text-primary-foreground">{t.sharePng}</button>
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-4">{t.help}</p>
      </div>
    </div>
  );
}
