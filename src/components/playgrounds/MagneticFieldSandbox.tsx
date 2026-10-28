"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

type Locale = "en" | "es";

interface Pole {
  id: number;
  x: number;
  y: number;
  polarity: 1 | -1; // 1 = N, -1 = S
  strength: number;
}

interface Particle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

const labels = {
  en: {
    placeN: "Place North",
    placeS: "Place South",
    clear: "Clear poles",
    strength: "Strength",
    lines: "Field lines",
    sharePng: "Download branded PNG",
    shareUrl: "Copy share link",
    copied: "Copied!",
    help: "Click the canvas to place a pole (use the buttons to choose North or South). Drag poles to move them. Field lines update live. Double-click a pole to remove it. Particles flow along the field.",
    poles: "Poles",
    north: "N",
    south: "S",
    presets: "Presets",
    dipole: "Dipole",
    twoN: "Two North",
    applyStrength: "Apply strength to all",
  },
  es: {
    placeN: "Colocar Norte",
    placeS: "Colocar Sur",
    clear: "Limpiar polos",
    strength: "Fuerza",
    lines: "Líneas de campo",
    sharePng: "Descargar PNG con marca",
    shareUrl: "Copiar enlace",
    copied: "¡Copiado!",
    help: "Hacé clic en el lienzo para colocar un polo (usá los botones para elegir Norte o Sur). Arrastrá los polos para moverlos. Las líneas de campo se actualizan en vivo. Doble clic en un polo para eliminarlo. Las partículas fluyen a lo largo del campo.",
    poles: "Polos",
    north: "N",
    south: "S",
    presets: "Presets",
    dipole: "Dipolo",
    twoN: "Dos Norte",
    applyStrength: "Aplicar fuerza a todos",
  },
};

export function MagneticFieldSandbox({ locale }: { locale: Locale }) {
  const t = labels[locale];
  useEffect(() => {
    trackEvent("playground_open", { id: "magnetic-field-sandbox", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const polesRef = useRef<Pole[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nextId = useRef(1);
  const dragId = useRef<number | null>(null);
  const lastTap = useRef({ time: 0, x: 0, y: 0 });

  const [placeMode, setPlaceMode] = useState<1 | -1>(1);
  const [strength, setStrength] = useState(1.5);
  const [lineCount, setLineCount] = useState(12);
  const [copied, setCopied] = useState(false);
  const [poleCount, setPoleCount] = useState(0);

  const paramsRef = useRef({ strength, lineCount });
  useEffect(() => {
    paramsRef.current = { strength, lineCount };
  }, [strength, lineCount]);

  // Load from URL once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    const pStr = qs.get("p");
    if (pStr) {
      const loaded: Pole[] = [];
      for (const part of pStr.split(";").filter(Boolean)) {
        const [xs, ys, pol] = part.split(",");
        const x = Number(xs);
        const y = Number(ys);
        const polarity = pol === "-1" ? -1 : 1;
        if (Number.isFinite(x) && Number.isFinite(y)) {
          loaded.push({ id: nextId.current++, x, y, polarity, strength: 1.5 });
        }
      }
      if (loaded.length) {
        polesRef.current = loaded;
        setPoleCount(loaded.length);
      }
    }
  }, []);

  const computeField = (x: number, y: number, poles: Pole[]) => {
    let fx = 0;
    let fy = 0;
    for (const p of poles) {
      const dx = x - p.x;
      const dy = y - p.y;
      const r2 = dx * dx + dy * dy + 16;
      const r = Math.sqrt(r2);
      const mag = (p.strength * p.polarity) / r2;
      fx += mag * (dx / r);
      fy += mag * (dy / r);
    }
    return { fx, fy };
  };

  const traceLines = useCallback((w: number, h: number, poles: Pole[], nLines: number, phase: number) => {
    const lines: { points: { x: number; y: number }[]; color: string }[] = [];
    const nPoles = poles.filter((p) => p.polarity > 0);
    if (nPoles.length === 0) return lines;
    const seedsPer = Math.max(2, Math.floor(nLines / Math.max(1, nPoles.length)));
    for (const np of nPoles) {
      for (let s = 0; s < seedsPer; s++) {
        const ang = (s / seedsPer) * Math.PI * 2 + phase;
        let x = np.x + Math.cos(ang) * 22;
        let y = np.y + Math.sin(ang) * 22;
        const points: { x: number; y: number }[] = [];
        const maxSteps = w < 640 ? 50 : 80;
        for (let step = 0; step < maxSteps; step++) {
          points.push({ x, y });
          const f = computeField(x, y, poles);
          const len = Math.hypot(f.fx, f.fy) || 0.001;
          const stepSize = 5;
          x += (f.fx / len) * stepSize;
          y += (f.fy / len) * stepSize;
          if (x < -20 || x > w + 20 || y < -20 || y > h + 20) break;
          // stop near any S pole
          let nearS = false;
          for (const sp of poles) {
            if (sp.polarity < 0 && Math.hypot(x - sp.x, y - sp.y) < 18) {
              nearS = true;
              break;
            }
          }
          if (nearS) break;
        }
        if (points.length > 4) {
          lines.push({ points, color: "rgba(120, 200, 255, 0.75)" });
        }
      }
    }
    return lines;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let phase = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      const isDouble =
        now - lastTap.current.time < 350 && Math.hypot(x - lastTap.current.x, y - lastTap.current.y) < 28;

      if (isDouble) {
        let best: Pole | null = null;
        let bestD = 36;
        for (const p of polesRef.current) {
          const d = Math.hypot(p.x - x, p.y - y);
          if (d < bestD) {
            bestD = d;
            best = p;
          }
        }
        if (best) {
          polesRef.current = polesRef.current.filter((p) => p.id !== best!.id);
          setPoleCount(polesRef.current.length);
          lastTap.current.time = 0;
          return;
        }
      }

      let nearest: Pole | null = null;
      let bestD = 32;
      for (const p of polesRef.current) {
        const d = Math.hypot(p.x - x, p.y - y);
        if (d < bestD) {
          bestD = d;
          nearest = p;
        }
      }
      if (nearest) {
        dragId.current = nearest.id;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      } else {
        polesRef.current.push({
          id: nextId.current++,
          x,
          y,
          polarity: placeMode,
          strength: paramsRef.current.strength,
        });
        setPoleCount(polesRef.current.length);
      }
      lastTap.current = { time: now, x, y };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragId.current == null) return;
      const { x, y } = getPos(e);
      const p = polesRef.current.find((pp) => pp.id === dragId.current);
      if (p) {
        p.x = x;
        p.y = y;
      }
    };

    const onPointerUp = () => {
      dragId.current = null;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      phase += 0.012;

      // background
      ctx.fillStyle = "#060a16";
      ctx.fillRect(0, 0, w, h);

      const poles = polesRef.current;
      const { lineCount: nL } = paramsRef.current;
      const lines = traceLines(w, h, poles, Math.min(nL, w < 640 ? 8 : 16), phase);

      // draw field lines
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      for (const line of lines) {
        if (line.points.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);
        for (let i = 1; i < line.points.length; i++) {
          ctx.lineTo(line.points[i].x, line.points[i].y);
        }
        ctx.strokeStyle = line.color;
        ctx.stroke();
      }

      // particles flowing along field
      const maxParticles = w < 640 ? 18 : 32;
      if (poles.length > 0 && particlesRef.current.length < maxParticles && Math.random() < 0.4) {
        const np = poles.find((p) => p.polarity > 0) || poles[0];
        const ang = Math.random() * Math.PI * 2;
        particlesRef.current.push({
          x: np.x + Math.cos(ang) * 24,
          y: np.y + Math.sin(ang) * 24,
          life: 0,
          maxLife: 80 + Math.random() * 40,
        });
      }

      particlesRef.current = particlesRef.current.filter((pt) => {
        pt.life += 1;
        if (pt.life > pt.maxLife) return false;
        const f = computeField(pt.x, pt.y, poles);
        const len = Math.hypot(f.fx, f.fy) || 0.001;
        const speed = 2.4;
        pt.x += (f.fx / len) * speed;
        pt.y += (f.fy / len) * speed;
        if (pt.x < -10 || pt.x > w + 10 || pt.y < -10 || pt.y > h + 10) return false;
        // fade near S poles
        for (const sp of poles) {
          if (sp.polarity < 0 && Math.hypot(pt.x - sp.x, pt.y - sp.y) < 16) return false;
        }
        return true;
      });

      ctx.fillStyle = "rgba(180, 230, 255, 0.85)";
      for (const pt of particlesRef.current) {
        const alpha = 1 - pt.life / pt.maxLife;
        ctx.globalAlpha = alpha * 0.9;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // draw poles
      for (const p of poles) {
        const isN = p.polarity > 0;
        const fill = isN ? "#ef4444" : "#3b82f6";
        const glow = isN ? "rgba(239,68,68,0.4)" : "rgba(59,130,246,0.4)";
        const rad = 18;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 2.2);
        g.addColorStop(0, fill);
        g.addColorStop(0.6, glow);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(isN ? "N" : "S", p.x, p.y);
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
  }, [placeMode, traceLines]);

  const clearPoles = () => {
    polesRef.current = [];
    particlesRef.current = [];
    setPoleCount(0);
  };

  const applyStrengthToAll = () => {
    const s = paramsRef.current.strength;
    for (const p of polesRef.current) {
      p.strength = s;
    }
  };

  const loadPreset = (kind: "dipole" | "twoN") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const s = paramsRef.current.strength;
    if (kind === "dipole") {
      polesRef.current = [
        { id: nextId.current++, x: cx - 70, y: cy, polarity: 1, strength: s },
        { id: nextId.current++, x: cx + 70, y: cy, polarity: -1, strength: s },
      ];
    } else {
      polesRef.current = [
        { id: nextId.current++, x: cx - 60, y: cy - 40, polarity: 1, strength: s },
        { id: nextId.current++, x: cx + 60, y: cy + 40, polarity: 1, strength: s },
      ];
    }
    setPoleCount(polesRef.current.length);
    particlesRef.current = [];
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    trackEvent("share_click", { id: "magnetic-field-sandbox", locale, type: "png" });
    const off = document.createElement("canvas");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    off.width = canvas.width;
    off.height = canvas.height;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.drawImage(canvas, 0, 0);
    // branding
    octx.fillStyle = "rgba(0,0,0,0.55)";
    octx.fillRect(12 * dpr, off.height - 48 * dpr, 280 * dpr, 32 * dpr);
    octx.fillStyle = "#fff";
    octx.font = `${14 * dpr}px system-ui, sans-serif`;
    octx.textBaseline = "middle";
    octx.fillText(
      locale === "es" ? "UtiliHub · Sandbox Campo Magnético" : "UtiliHub · Magnetic Field Sandbox",
      20 * dpr,
      off.height - 32 * dpr,
    );
    const url = off.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = locale === "es" ? "sandbox-campo-magnetico.png" : "magnetic-field-sandbox.png";
    a.click();
  };

  const shareUrl = async () => {
    trackEvent("share_click", { id: "magnetic-field-sandbox", locale, type: "url" });
    const params = new URLSearchParams();
    if (polesRef.current.length) {
      const pStr = polesRef.current
        .map((p) => `${Math.round(p.x)},${Math.round(p.y)},${p.polarity}`)
        .join(";");
      params.set("p", pStr);
    }
    const url = `${window.location.origin}${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
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
          className="h-[380px] w-full touch-none sm:h-[500px]"
          style={{ display: "block" }}
        />
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/40 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
          {t.poles}: {poleCount}
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
          <span className="text-sm font-medium">{t.placeN} / {t.placeS}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPlaceMode(1)}
              className={`min-h-11 flex-1 rounded-lg px-3 text-sm font-semibold ${placeMode === 1 ? "bg-red-600 text-white" : "bg-muted"}`}
            >
              {t.north}
            </button>
            <button
              type="button"
              onClick={() => setPlaceMode(-1)}
              className={`min-h-11 flex-1 rounded-lg px-3 text-sm font-semibold ${placeMode === -1 ? "bg-blue-600 text-white" : "bg-muted"}`}
            >
              {t.south}
            </button>
          </div>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.strength} ({strength.toFixed(1)})</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="accent-primary min-h-11"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.lines} ({lineCount})</span>
          <input
            type="range"
            min={4}
            max={24}
            step={2}
            value={lineCount}
            onChange={(e) => setLineCount(Number(e.target.value))}
            className="accent-primary min-h-11"
          />
        </label>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={clearPoles}
            className="min-h-11 rounded-lg bg-muted px-3 text-sm font-medium"
          >
            {t.clear}
          </button>
          <button
            type="button"
            onClick={applyStrengthToAll}
            className="min-h-11 rounded-lg bg-muted px-3 text-xs font-medium"
          >
            {t.applyStrength}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium self-center">{t.presets}:</span>
        <button
          type="button"
          onClick={() => loadPreset("dipole")}
          className="min-h-11 rounded-lg border border-border px-3 text-sm font-medium"
        >
          {t.dipole}
        </button>
        <button
          type="button"
          onClick={() => loadPreset("twoN")}
          className="min-h-11 rounded-lg border border-border px-3 text-sm font-medium"
        >
          {t.twoN}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={downloadPng}
          className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          {t.sharePng}
        </button>
        <button
          type="button"
          onClick={shareUrl}
          className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium"
        >
          {copied ? t.copied : t.shareUrl}
        </button>
      </div>

      <p className="text-sm text-muted-foreground">{t.help}</p>
    </div>
  );
}
