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
    help: "Click/tap to place emitters (attractors). Drag to move. Double-click removes nearest. Particles form flowing ribbons with persistent fading trails, blooming orbs or swirling vortices.",
    emitters: "Emitters",
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
    help: "Clic/toque para colocar emisores (atractores). Arrastr\u00e1 para mover. Doble clic elimina el m\u00e1s cercano. Part\u00edculas forman cintas fluidas con estelas persistentes que se desvanecen, orbes blooming o v\u00f3rtices.",
    emitters: "Emisores",
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = parseInt(params.get("d") || "180", 10);
    const s = parseFloat(params.get("s") || "1.2");
    const b = parseFloat(params.get("b") || "0.7");
    const g = parseFloat(params.get("g") || "0.4");
    const w = parseFloat(params.get("w") || "0.2");
    const m = (params.get("m") as "ribbon" | "orb" | "vortex") || "ribbon";
    const p = (params.get("p") as keyof typeof palettes) || "aurora";
    if (!isNaN(d) && d >= 40 && d <= 300) setDensity(d);
    if (!isNaN(s) && s >= 0.2 && s <= 3) setSpeed(s);
    if (!isNaN(b) && b >= 0 && b <= 1) setBloom(b);
    if (!isNaN(g) && g >= 0 && g <= 2) setGravity(g);
    if (!isNaN(w) && w >= -1 && w <= 1) setWind(w);
    if (["ribbon", "orb", "vortex"].includes(m)) setMode(m);
    if (p in palettes) setPalette(p);
    const em = params.get("e");
    if (em) {
      const parts = em.split(";").filter(Boolean);
      const loaded: Emitter[] = [];
      parts.forEach((pt) => {
        const [xs, ys] = pt.split(",");
        const x = parseFloat(xs);
        const y = parseFloat(ys);
        if (!isNaN(x) && !isNaN(y)) {
          loaded.push({ x, y, id: nextId.current++, strength: 1 });
        }
      });
      emittersRef.current = loaded;
      setEmitterCount(loaded.length);
    }
  }, []);

  useEffect(() => {
    paramsRef.current = { density, speed, bloom, gravity, wind, mode, palette, paused };
  }, [density, speed, bloom, gravity, wind, mode, palette, paused]);

  const initParticles = useCallback((n: number, w: number, h: number) => {
    const ps: Particle[] = [];
    const pal = palettes[paramsRef.current.palette];
    for (let i = 0; i < Math.min(n, 300); i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ps.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 1.5 + Math.random() * 3,
        hue: pal.base + Math.random() * pal.range,
        life: 1,
        mode: paramsRef.current.mode,
        trail: [{ x, y }],
      });
    }
    particlesRef.current = ps;
  }, []);

  const findNearest = (x: number, y: number, maxDist = 48) => {
    let best: Emitter | null = null;
    let bestD2 = maxDist * maxDist;
    for (const e of emittersRef.current) {
      const dx = e.x - x;
      const dy = e.y - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) {
        bestD2 = d2;
        best = e;
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

    const getPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      if (paramsRef.current.paused) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      const now = Date.now();
      const isDouble = now - lastTap.current.time < 320 && Math.hypot(x - lastTap.current.x, y - lastTap.current.y) < 36;

      if (isDouble) {
        const nearest = findNearest(x, y, 60);
        if (nearest) {
          emittersRef.current = emittersRef.current.filter((em) => em.id !== nearest.id);
          setEmitterCount(emittersRef.current.length);
          lastTap.current.time = 0;
          return;
        }
      }

      const nearest = findNearest(x, y, 40);
      if (nearest) {
        dragId.current = nearest.id;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } else if (emittersRef.current.length < 8) {
        emittersRef.current.push({ x, y, id: nextId.current++, strength: 1 });
        setEmitterCount(emittersRef.current.length);
      }
      lastTap.current = { time: now, x, y };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragId.current == null) return;
      const { x, y } = getPos(e);
      const em = emittersRef.current.find((et) => et.id === dragId.current);
      if (em) {
        em.x = x;
        em.y = y;
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
      const { speed: spd, bloom: bl, gravity: g, wind: wn, mode: md, palette: palKey, paused: pau } = paramsRef.current;
      if (pau) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const pal = palettes[palKey];
      const ems = emittersRef.current;
      const ps = particlesRef.current;

      ctx.fillStyle = "rgba(4, 8, 20, 0.18)";
      ctx.fillRect(0, 0, w, h);

      // Emitters glow
      for (const em of ems) {
        const grad = ctx.createRadialGradient(em.x, em.y, 0, em.x, em.y, 42);
        grad.addColorStop(0, `hsla(${pal.base + 20}, 90%, 70%, 0.9)`);
        grad.addColorStop(0.4, `hsla(${pal.base}, 80%, 50%, 0.4)`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(em.x, em.y, 42, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of ps) {
        let ax = 0;
        let ay = wn * 0.15;
        for (const em of ems) {
          const dx = em.x - p.x;
          const dy = em.y - p.y;
          const dist2 = dx * dx + dy * dy;
          const dist = Math.sqrt(dist2) || 1;
          const force = g * em.strength / (dist2 * 0.008 + 28);
          ax += (dx / dist) * force;
          ay += (dy / dist) * force;
        }
        // Mode-specific behavior
        if (md === "vortex") {
          ax += -p.vy * 0.02;
          ay += p.vx * 0.02;
        } else if (md === "orb") {
          ax *= 0.6;
          ay *= 0.6;
        }
        p.vx += ax * spd;
        p.vy += ay * spd;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Update trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LEN) p.trail.shift();

        const speedMag = Math.hypot(p.vx, p.vy);
        const hue = (p.hue + speedMag * 4) % 360;
        const alpha = 0.6 + bl * 0.4;
        const blur = 4 + bl * 12 + speedMag * 1.5;

        // Draw fading trail (stronger visual for ribbon)
        if (md === "ribbon" && p.trail.length > 1) {
          ctx.shadowBlur = 0;
          ctx.lineWidth = Math.max(1, p.size * 0.6);
          ctx.lineCap = "round";
          for (let i = 1; i < p.trail.length; i++) {
            const tAlpha = (i / p.trail.length) * alpha * 0.7;
            ctx.globalAlpha = tAlpha;
            ctx.strokeStyle = `hsl(${hue}, 85%, 65%)`;
            ctx.beginPath();
            ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }

        // Particle head with bloom
        ctx.shadowColor = `hsl(${hue}, 85%, 60%)`;
        ctx.shadowBlur = blur;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        if (md === "ribbon") {
          ctx.arc(p.x, p.y, p.size * (0.8 + speedMag * 0.1), 0, Math.PI * 2);
        } else if (md === "orb") {
          ctx.arc(p.x, p.y, p.size * 1.4, 0, Math.PI * 2);
        } else {
          ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        }
        ctx.fillStyle = `hsl(${hue}, 90%, ${60 + bl * 15}%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
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
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0) {
      initParticles(density, rect.width, rect.height);
    }
  }, [density, mode, palette, initParticles]);

  const clearEmitters = () => {
    emittersRef.current = [];
    setEmitterCount(0);
  };

  const randomize = () => {
    const modes = ["ribbon", "orb", "vortex"] as const;
    const pals = Object.keys(palettes) as (keyof typeof palettes)[];
    setMode(modes[Math.floor(Math.random() * modes.length)]);
    setPalette(pals[Math.floor(Math.random() * pals.length)]);
    setDensity(80 + Math.floor(Math.random() * 180));
    setSpeed(0.6 + Math.random() * 1.8);
    setBloom(0.3 + Math.random() * 0.6);
    setGravity(0.1 + Math.random() * 1.2);
    setWind((Math.random() - 0.5) * 1.2);
  };

  const shareLink = async () => {
    trackEvent("share_click", { id: "aurora-particle-playground", type: "link", locale });
    const params = new URLSearchParams();
    params.set("d", String(density));
    params.set("s", speed.toFixed(2));
    params.set("b", bloom.toFixed(2));
    params.set("g", gravity.toFixed(2));
    params.set("w", wind.toFixed(2));
    params.set("m", mode);
    params.set("p", palette);
    if (emittersRef.current.length) {
      const eStr = emittersRef.current.map((e) => `${Math.round(e.x)},${Math.round(e.y)}`).join(";");
      params.set("e", eStr);
    }
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt(locale === "es" ? "Copi\u00e1 este enlace:" : "Copy this link:", url);
    }
  };

  const sharePng = () => {
    trackEvent("share_click", { id: "aurora-particle-playground", type: "png", locale });
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.drawImage(canvas, 0, 0);
    octx.fillStyle = "rgba(0,0,0,0.55)";
    octx.fillRect(0, off.height - 72, off.width, 72);
    octx.fillStyle = "#fff";
    octx.font = "bold 22px system-ui, sans-serif";
    octx.fillText(locale === "es" ? "Playground de Part\u00edculas Aurora" : "Aurora Particle Playground", 16, off.height - 42);
    octx.font = "14px system-ui, sans-serif";
    octx.fillText(`utilihub.com \u00b7 ${mode} \u00b7 ${palette} \u00b7 trails \u00b7 ${density} particles`, 16, off.height - 18);
    const a = document.createElement("a");
    a.href = off.toDataURL("image/png");
    a.download = `aurora-particle-${mode}-${palette}.png`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#040814] shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-[420px] w-full touch-none sm:h-[520px]"
          style={{ display: "block" }}
        />
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/40 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
          {t.emitters}: {emitterCount}
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.density} ({density})</span>
          <input type="range" min={40} max={300} step={10} value={density} onChange={(e) => setDensity(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.speed} ({speed.toFixed(2)})</span>
          <input type="range" min={0.2} max={3} step={0.1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.bloom} ({bloom.toFixed(2)})</span>
          <input type="range" min={0} max={1} step={0.05} value={bloom} onChange={(e) => setBloom(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.gravity} ({gravity.toFixed(2)})</span>
          <input type="range" min={0} max={2} step={0.05} value={gravity} onChange={(e) => setGravity(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.wind} ({wind.toFixed(2)})</span>
          <input type="range" min={-1} max={1} step={0.05} value={wind} onChange={(e) => setWind(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.mode}</span>
          <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="rounded border border-border bg-background px-2 py-1 text-sm">
            <option value="ribbon">Ribbon</option>
            <option value="orb">Orb</option>
            <option value="vortex">Vortex</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.palette}</span>
          <select value={palette} onChange={(e) => setPalette(e.target.value as any)} className="rounded border border-border bg-background px-2 py-1 text-sm">
            {Object.keys(palettes).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button type="button" onClick={() => setPaused((p) => !p)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">
            {paused ? t.resume : t.pause}
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
