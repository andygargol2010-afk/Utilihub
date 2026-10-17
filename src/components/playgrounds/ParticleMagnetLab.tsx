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

interface Magnet {
  x: number;
  y: number;
  id: number;
  polarity: 1 | -1; // 1 attract, -1 repel
  strength: number;
}

const labels = {
  en: {
    count: "Particle count",
    strength: "Magnet strength",
    polarity: "Default polarity",
    attract: "Attract",
    repel: "Repel",
    colorMode: "Color mode",
    speed: "Speed",
    field: "Field",
    clear: "Clear magnets",
    reset: "Reset particles",
    sharePng: "Download PNG",
    shareUrl: "Copy share link",
    copied: "Copied!",
    help: "Click/tap to place magnets. Drag to move. Double-click/tap removes nearest. Right-click or long-press toggles polarity of nearest magnet. Particles stream and leave fading trails that show the field. Use pause to inspect the field. Toggle field arrows for a grid of force directions.",
    magnets: "Magnets",
    selected: "Selected",
    none: "none",
    pause: "Pause",
    resume: "Resume",
    random: "Random magnets",
    fieldArrows: "Field arrows",
  },
  es: {
    count: "Cantidad de partículas",
    strength: "Fuerza del imán",
    polarity: "Polaridad por defecto",
    attract: "Atraer",
    repel: "Repeler",
    colorMode: "Modo de color",
    speed: "Velocidad",
    field: "Campo",
    clear: "Limpiar imanes",
    reset: "Reiniciar partículas",
    sharePng: "Descargar PNG",
    shareUrl: "Copiar enlace",
    copied: "¡Copiado!",
    help: "Clic/toque para colocar imanes. Arrastrá para mover. Doble clic/toque elimina el más cercano. Clic derecho o pulsación larga alterna la polaridad del imán más cercano. Las partículas fluyen y dejan estelas que visualizan el campo. Usá pausa para inspeccionar el campo. Activá flechas de campo para una grilla de direcciones de fuerza.",
    magnets: "Imanes",
    selected: "Seleccionado",
    none: "ninguno",
    pause: "Pausar",
    resume: "Reanudar",
    random: "Imanes aleatorios",
    fieldArrows: "Flechas de campo",
  },
};

export function ParticleMagnetLab({ locale }: { locale: Locale }) {
  const t = labels[locale];
  useEffect(() => {
    trackEvent("playground_open", { id: "particle-magnet-lab", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const magnetsRef = useRef<Magnet[]>([]);
  const nextId = useRef(1);
  const paramsRef = useRef({
    count: 160,
    strength: 1.2,
    defaultPolarity: 1 as 1 | -1,
    colorMode: "speed" as "speed" | "field",
  });
  const dragId = useRef<number | null>(null);
  const lastTap = useRef({ time: 0, x: 0, y: 0 });
  const longPressTimer = useRef<number | null>(null);

  const [count, setCount] = useState(160);
  const [strength, setStrength] = useState(1.2);
  const [defaultPolarity, setDefaultPolarity] = useState<1 | -1>(1);
  const [colorMode, setColorMode] = useState<"speed" | "field">("speed");
  const [copied, setCopied] = useState(false);
  const [magnetCount, setMagnetCount] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [showFieldArrows, setShowFieldArrows] = useState(false);

  useEffect(() => {
    paramsRef.current = { count, strength, defaultPolarity, colorMode };
  }, [count, strength, defaultPolarity, colorMode]);

  // Load shared URL state once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    const c = Number(qs.get("c"));
    if (c >= 60 && c <= 320) setCount(c);
    const s = Number(qs.get("s"));
    if (s >= 0.3 && s <= 2.8) setStrength(s);
    const p = qs.get("p");
    if (p === "1" || p === "-1") setDefaultPolarity(p === "1" ? 1 : -1);
    const cm = qs.get("cm");
    if (cm === "speed" || cm === "field") setColorMode(cm);
    if (qs.get("fa") === "1") setShowFieldArrows(true);
    const mStr = qs.get("m");
    if (mStr) {
      const parts = mStr.split(";").filter(Boolean);
      const loaded: Magnet[] = [];
      for (const part of parts) {
        const [xs, ys, ps] = part.split(",");
        const x = Number(xs);
        const y = Number(ys);
        const pol = ps === "-1" ? -1 : 1;
        if (Number.isFinite(x) && Number.isFinite(y)) {
          loaded.push({
            x,
            y,
            id: nextId.current++,
            polarity: pol,
            strength: Number.isFinite(s) ? s : 1.2,
          });
        }
      }
      if (loaded.length) {
        magnetsRef.current = loaded;
        setMagnetCount(loaded.length);
      }
    }
  }, []);

  const initParticles = useCallback((n: number, w: number, h: number) => {
    const ps: Particle[] = [];
    const mobile = w < 640;
    const budget = mobile ? Math.min(n, 140) : n;
    for (let i = 0; i < budget; i++) {
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: 1.1 + Math.random() * 1.8,
        hue: Math.random() * 360,
      });
    }
    particlesRef.current = ps;
  }, []);

  const findNearest = (x: number, y: number, maxDist = 40) => {
    let best: Magnet | null = null;
    let bestD2 = maxDist * maxDist;
    for (const m of magnetsRef.current) {
      const dx = m.x - x;
      const dy = m.y - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) {
        bestD2 = d2;
        best = m;
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
        initParticles(paramsRef.current.count, rect.width, rect.height);
      }
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
        const nearest = findNearest(x, y, 56);
        if (nearest) {
          magnetsRef.current = magnetsRef.current.filter((m) => m.id !== nearest.id);
          setMagnetCount(magnetsRef.current.length);
          setSelectedId(null);
          lastTap.current.time = 0;
          return;
        }
      }

      const nearest = findNearest(x, y, 42);
      if (nearest) {
        dragId.current = nearest.id;
        setSelectedId(nearest.id);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        // long-press toggle polarity
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        longPressTimer.current = window.setTimeout(() => {
          nearest.polarity = nearest.polarity === 1 ? -1 : 1;
          setMagnetCount(magnetsRef.current.length); // force re-render via count
          longPressTimer.current = null;
        }, 520);
      } else {
        magnetsRef.current.push({
          x,
          y,
          id: nextId.current++,
          polarity: paramsRef.current.defaultPolarity,
          strength: paramsRef.current.strength,
        });
        setMagnetCount(magnetsRef.current.length);
        setSelectedId(null);
      }
      lastTap.current = { time: now, x, y };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragId.current == null) return;
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      const { x, y } = getPos(e);
      const m = magnetsRef.current.find((mm) => mm.id === dragId.current);
      if (m) {
        m.x = x;
        m.y = y;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      dragId.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nearest = findNearest(x, y, 56);
      if (nearest) {
        nearest.polarity = nearest.polarity === 1 ? -1 : 1;
        setSelectedId(nearest.id);
        setMagnetCount(magnetsRef.current.length);
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
      const { strength: g, colorMode: cm } = paramsRef.current;
      const mags = magnetsRef.current;
      const ps = particlesRef.current;

      // Fading trails
      ctx.fillStyle = "rgba(6, 10, 22, 0.08)";
      ctx.fillRect(0, 0, w, h);

      // Draw magnets
      for (const m of mags) {
        const col = m.polarity > 0 ? "rgba(80, 200, 255, 0.9)" : "rgba(255, 90, 120, 0.9)";
        const glow = m.polarity > 0 ? "rgba(80, 200, 255, 0.35)" : "rgba(255, 90, 120, 0.35)";
        const rad = 32 + m.strength * 10;
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, rad);
        grad.addColorStop(0, col);
        grad.addColorStop(0.5, glow);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(m.x, m.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.fillStyle = m.polarity > 0 ? "#0ea5e9" : "#f43f5e";
        ctx.font = "bold 12px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(m.polarity > 0 ? "+" : "−", m.x, m.y);
        if (selectedId === m.id) {
          ctx.beginPath();
          ctx.arc(m.x, m.y, 16, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.7)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Optional field arrows (coarse grid, lightweight)
      if (showFieldArrows && mags.length > 0) {
        const cols = 10;
        const rows = 6;
        const dx = w / cols;
        const dy = h / rows;
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 1.2;
        for (let ix = 0; ix < cols; ix++) {
          for (let iy = 0; iy < rows; iy++) {
            const sx = (ix + 0.5) * dx;
            const sy = (iy + 0.5) * dy;
            let fax = 0;
            let fay = 0;
            for (const m of mags) {
              const ddx = m.x - sx;
              const ddy = m.y - sy;
              const dist2 = ddx * ddx + ddy * ddy;
              const dist = Math.sqrt(dist2) || 1;
              const force = (m.strength * m.polarity * g) / (dist2 * 0.008 + 40);
              fax += (ddx / dist) * force;
              fay += (ddy / dist) * force;
            }
            const mag = Math.hypot(fax, fay);
            if (mag < 0.05) continue;
            const len = Math.min(18, 6 + mag * 8);
            const ang = Math.atan2(fay, fax);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
            ctx.stroke();
            // small head
            const hx = sx + Math.cos(ang) * len;
            const hy = sy + Math.sin(ang) * len;
            ctx.beginPath();
            ctx.moveTo(hx, hy);
            ctx.lineTo(hx - Math.cos(ang - 0.5) * 5, hy - Math.sin(ang - 0.5) * 5);
            ctx.moveTo(hx, hy);
            ctx.lineTo(hx - Math.cos(ang + 0.5) * 5, hy - Math.sin(ang + 0.5) * 5);
            ctx.stroke();
          }
        }
      }

      for (const p of ps) {
        let field = 0;
        if (!paused) {
          let ax = 0;
          let ay = 0;
          for (const m of mags) {
            const dx = m.x - p.x;
            const dy = m.y - p.y;
            const dist2 = dx * dx + dy * dy;
            const dist = Math.sqrt(dist2) || 1;
            const force = (m.strength * m.polarity * g) / (dist2 * 0.008 + 40);
            ax += (dx / dist) * force;
            ay += (dy / dist) * force;
            field += Math.abs(force);
          }
          p.vx += ax;
          p.vy += ay;
          p.vx *= 0.992;
          p.vy *= 0.992;
          const maxV = 8;
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > maxV) {
            p.vx = (p.vx / sp) * maxV;
            p.vy = (p.vy / sp) * maxV;
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }

        const speed = Math.hypot(p.vx, p.vy);
        let hue = p.hue;
        if (cm === "speed") {
          hue = (200 + speed * 18) % 360;
        } else {
          hue = (field * 40) % 360;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, 80%, 65%)`;
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
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };
  }, [initParticles, selectedId, showFieldArrows]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0) {
      initParticles(count, rect.width, rect.height);
    }
  }, [count, initParticles]);

  const addRandomMagnets = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const n = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      magnetsRef.current.push({
        x: 40 + Math.random() * (rect.width - 80),
        y: 40 + Math.random() * (rect.height - 80),
        id: nextId.current++,
        polarity: Math.random() > 0.5 ? 1 : -1,
        strength: paramsRef.current.strength,
      });
    }
    setMagnetCount(magnetsRef.current.length);
    setSelectedId(null);
  };

  const clearMagnets = () => {
    magnetsRef.current = [];
    setMagnetCount(0);
    setSelectedId(null);
  };

  const resetParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    initParticles(count, rect.width, rect.height);
  };

  const toggleSelectedPolarity = () => {
    if (selectedId == null) return;
    const m = magnetsRef.current.find((mm) => mm.id === selectedId);
    if (m) {
      m.polarity = m.polarity === 1 ? -1 : 1;
      setMagnetCount(magnetsRef.current.length);
    }
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    trackEvent("share_click", { id: "particle-magnet-lab", locale, type: "png" });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = locale === "es" ? "laboratorio-imanes.png" : "particle-magnet-lab.png";
    a.click();
  };

  const shareUrl = async () => {
    trackEvent("share_click", { id: "particle-magnet-lab", locale, type: "url" });
    const params = new URLSearchParams();
    params.set("c", String(count));
    params.set("s", strength.toFixed(2));
    params.set("p", defaultPolarity === 1 ? "1" : "-1");
    params.set("cm", colorMode);
    if (showFieldArrows) params.set("fa", "1");
    if (magnetsRef.current.length) {
      const mStr = magnetsRef.current
        .map((m) => `${Math.round(m.x)},${Math.round(m.y)},${m.polarity}`)
        .join(";");
      params.set("m", mStr);
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
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#060a16] shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-[420px] w-full touch-none sm:h-[520px]"
          style={{ display: "block" }}
        />
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/40 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
          {t.magnets}: {magnetCount}
          {selectedId != null ? ` · ${t.selected}` : ""}
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.count} ({count})</span>
          <input
            type="range"
            min={60}
            max={320}
            step={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="accent-primary min-h-11"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.strength} ({strength.toFixed(2)})</span>
          <input
            type="range"
            min={0.3}
            max={2.8}
            step={0.1}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="accent-primary min-h-11"
          />
        </label>

        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.polarity}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDefaultPolarity(1)}
              className={`min-h-11 rounded-lg px-3 py-2 text-xs font-semibold ${defaultPolarity === 1 ? "bg-sky-500 text-white" : "border border-border bg-background"}`}
            >
              {t.attract}
            </button>
            <button
              type="button"
              onClick={() => setDefaultPolarity(-1)}
              className={`min-h-11 rounded-lg px-3 py-2 text-xs font-semibold ${defaultPolarity === -1 ? "bg-rose-500 text-white" : "border border-border bg-background"}`}
            >
              {t.repel}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.colorMode}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setColorMode("speed")}
              className={`min-h-11 rounded-lg px-3 py-2 text-xs font-semibold ${colorMode === "speed" ? "bg-primary text-primary-foreground" : "border border-border bg-background"}`}
            >
              {t.speed}
            </button>
            <button
              type="button"
              onClick={() => setColorMode("field")}
              className={`min-h-11 rounded-lg px-3 py-2 text-xs font-semibold ${colorMode === "field" ? "bg-primary text-primary-foreground" : "border border-border bg-background"}`}
            >
              {t.field}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
          <button
            type="button"
            onClick={clearMagnets}
            className="min-h-11 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold"
          >
            {t.clear}
          </button>
          <button
            type="button"
            onClick={resetParticles}
            className="min-h-11 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold"
          >
            {t.reset}
          </button>
          <button
            type="button"
            onClick={toggleSelectedPolarity}
            className="min-h-11 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold"
          >
            {locale === "es" ? "Alternar seleccionado" : "Toggle selected"}
          </button>
          <button
            type="button"
            onClick={addRandomMagnets}
            className="min-h-11 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold"
          >
            {t.random}
          </button>
          <button
            type="button"
            onClick={() => setShowFieldArrows((v) => !v)}
            className={`min-h-11 rounded-lg px-3 py-2 text-xs font-semibold ${showFieldArrows ? "bg-violet-600 text-white" : "border border-border bg-background"}`}
          >
            {t.fieldArrows}
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="min-h-11 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold"
          >
            {paused ? t.resume : t.pause}
          </button>
          <button
            type="button"
            onClick={downloadPng}
            className="min-h-11 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            {t.sharePng}
          </button>
          <button
            type="button"
            onClick={shareUrl}
            className="min-h-11 rounded-lg border border-primary bg-background px-3 py-2 text-xs font-semibold"
          >
            {copied ? t.copied : t.shareUrl}
          </button>
        </div>

        <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-4">
          {t.help}
        </p>
      </div>
    </div>
  );
}
