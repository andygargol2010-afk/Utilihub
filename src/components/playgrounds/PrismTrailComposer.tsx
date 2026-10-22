import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Point = { x: number; y: number };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

type Trail = { points: Point[]; created: number };

type ColorScheme = "rainbow" | "neon" | "pastel" | "fire";
type BgPreset = "void" | "nebula" | "grid" | "midnight";

const SCHEMES: Record<ColorScheme, string[]> = {
  rainbow: ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#8b00ff"],
  neon: ["#ff00ff", "#00ffff", "#39ff14", "#ff073a", "#fe019a", "#0ff0fc", "#bc13fe"],
  pastel: ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff"],
  fire: ["#ff6b00", "#ff9500", "#ffb700", "#ffd000", "#ff4d00", "#e63900", "#c1121f"],
};

export function PrismTrailComposer({ locale = "en" }: { locale?: "en" | "es" }) {
  useEffect(() => {
    trackEvent("playground_open", { id: "prism-trail-composer", locale });
  }, [locale]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<Trail[]>([]);
  const [dispersion, setDispersion] = useState(12);
  const [speed, setSpeed] = useState(1);
  const [bloom, setBloom] = useState(18);
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [prismAngle, setPrismAngle] = useState(90);
  const [scheme, setScheme] = useState<ColorScheme>("rainbow");
  const [density, setDensity] = useState(5);
  const [mirror, setMirror] = useState(false);
  const [vMirror, setVMirror] = useState(false);
  const [gravity, setGravity] = useState(0.4);
  const [fade, setFade] = useState(0);
  const [bg, setBg] = useState<BgPreset>("void");
  const [smooth, setSmooth] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const animRef = useRef<number>(0);

  const colors = SCHEMES[scheme];

  const labels = {
    en: {
      dispersion: "Dispersion",
      speed: "Particle speed",
      bloom: "Bloom",
      width: "Stroke width",
      angle: "Prism angle",
      scheme: "Color scheme",
      density: "Particle density",
      mirror: "H-Mirror",
      vMirror: "V-Mirror",
      gravity: "Gravity",
      fade: "Trail fade",
      bg: "Background",
      smooth: "Smooth trails",
      clear: "Clear",
      undo: "Undo",
      export: "Snapshot PNG",
      share: "Share",
      hint: "Draw freehand — prism beams with bloom, schemes, mirrors, gravity, fade, smooth trails and background presets",
      schemes: { rainbow: "Rainbow", neon: "Neon", pastel: "Pastel", fire: "Fire" } as Record<ColorScheme, string>,
      bgs: { void: "Void", nebula: "Nebula", grid: "Grid", midnight: "Midnight" } as Record<BgPreset, string>,
    },
    es: {
      dispersion: "Dispersión",
      speed: "Velocidad partículas",
      bloom: "Bloom",
      width: "Grosor trazo",
      angle: "Ángulo prisma",
      scheme: "Esquema de color",
      density: "Densidad partículas",
      mirror: "Espejo H",
      vMirror: "Espejo V",
      gravity: "Gravedad",
      fade: "Desvanecimiento",
      bg: "Fondo",
      smooth: "Suavizar trazos",
      clear: "Limpiar",
      undo: "Deshacer",
      export: "Captura PNG",
      share: "Compartir",
      hint: "Dibujá a mano alzada — haces de prisma con bloom, esquemas, espejos, gravedad, desvanecimiento, suavizado y fondos",
      schemes: { rainbow: "Arcoíris", neon: "Neón", pastel: "Pastel", fire: "Fuego" } as Record<ColorScheme, string>,
      bgs: { void: "Vacío", nebula: "Nebulosa", grid: "Cuadrícula", midnight: "Medianoche" } as Record<BgPreset, string>,
    },
  }[locale];

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const d = params.get("d");
      const s = params.get("s");
      const b = params.get("b");
      const w = params.get("w");
      const a = params.get("a");
      const c = params.get("c") as ColorScheme | null;
      const dens = params.get("dens");
      const m = params.get("m");
      const vm = params.get("vm");
      const g = params.get("g");
      const f = params.get("f");
      if (d && !isNaN(Number(d))) setDispersion(Math.max(0, Math.min(40, Number(d))));
      if (s && !isNaN(Number(s))) setSpeed(Math.max(0.2, Math.min(3, Number(s))));
      if (b && !isNaN(Number(b))) setBloom(Math.max(0, Math.min(40, Number(b))));
      if (w && !isNaN(Number(w))) setStrokeWidth(Math.max(2, Math.min(16, Number(w))));
      if (a && !isNaN(Number(a))) setPrismAngle(Math.max(0, Math.min(180, Number(a))));
      if (c && SCHEMES[c]) setScheme(c);
      if (dens && !isNaN(Number(dens))) setDensity(Math.max(1, Math.min(12, Number(dens))));
      if (m === "1") setMirror(true);
      if (vm === "1") setVMirror(true);
      if (g && !isNaN(Number(g))) setGravity(Math.max(0, Math.min(2, Number(g))));
      if (f && !isNaN(Number(f))) setFade(Math.max(0, Math.min(10, Number(f))));
      const bgP = params.get("bg") as BgPreset | null;
      if (bgP && ["void", "nebula", "grid", "midnight"].includes(bgP)) setBg(bgP);
      if (params.get("sm") === "0") setSmooth(false);
    } catch {}
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("d", String(dispersion));
    params.set("s", String(speed));
    params.set("b", String(bloom));
    params.set("w", String(strokeWidth));
    params.set("a", String(prismAngle));
    params.set("c", scheme);
    params.set("dens", String(density));
    params.set("m", mirror ? "1" : "0");
    params.set("vm", vMirror ? "1" : "0");
    params.set("g", String(gravity));
    params.set("f", String(fade));
    params.set("bg", bg);
    params.set("sm", smooth ? "1" : "0");
    const next = `${window.location.pathname}?${params.toString()}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [dispersion, speed, bloom, strokeWidth, prismAngle, scheme, density, mirror, vMirror, gravity, fade, bg, smooth]);

  const spawnParticles = useCallback(
    (x: number, y: number, n = 5) => {
      const count = Math.max(1, Math.round(n * (density / 5)));
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = (0.3 + Math.random() * 1.4) * speed;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 1,
          maxLife: 0.7 + Math.random() * 0.9,
          size: 1.5 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    },
    [speed, density, colors],
  );

  const drawTrail = useCallback(
    (ctx: CanvasRenderingContext2D, trail: Point[], w: number, h: number, flipX: boolean, flipY: boolean, alpha: number) => {
      if (trail.length < 2 || alpha <= 0) return;
      const angleRad = (prismAngle * Math.PI) / 180;
      const layers = colors.length;
      for (let li = 0; li < layers; li++) {
        const offset = (li - (layers - 1) / 2) * (dispersion / 100);
        ctx.beginPath();
        const first = trail[0];
        let dx = 0,
          dy = 0;
        if (trail.length > 1) {
          const next = trail[1];
          const tx = next.x - first.x;
          const ty = next.y - first.y;
          const len = Math.hypot(tx, ty) || 1;
          const px = -ty / len;
          const py = tx / len;
          dx = (px * Math.cos(angleRad) - py * Math.sin(angleRad)) * offset;
          dy = (px * Math.sin(angleRad) + py * Math.cos(angleRad)) * offset;
        }
        const fx = flipX ? 1 - (first.x + dx) : first.x + dx;
        const fy = flipY ? 1 - (first.y + dy) : first.y + dy;
        ctx.moveTo(fx * w, fy * h);
        for (let i = 1; i < trail.length; i++) {
          const p = trail[i];
          let odx = 0,
            ody = 0;
          if (i < trail.length - 1) {
            const nx = trail[i + 1].x - trail[i - 1].x;
            const ny = trail[i + 1].y - trail[i - 1].y;
            const len = Math.hypot(nx, ny) || 1;
            const px = -ny / len;
            const py = nx / len;
            odx = (px * Math.cos(angleRad) - py * Math.sin(angleRad)) * offset;
            ody = (px * Math.sin(angleRad) + py * Math.cos(angleRad)) * offset;
          }
          const px = flipX ? 1 - (p.x + odx) : p.x + odx;
          const py = flipY ? 1 - (p.y + ody) : p.y + ody;
          ctx.lineTo(px * w, py * h);
        }
        ctx.strokeStyle = colors[li];
        ctx.lineWidth = Math.max(1.5, strokeWidth - li * 0.35);
        ctx.shadowColor = colors[li];
        ctx.shadowBlur = bloom + dispersion * 0.25;
        ctx.globalAlpha = 0.82 * alpha;
        ctx.stroke();
      }
    },
    [dispersion, bloom, strokeWidth, prismAngle, colors],
  );

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    // Background presets
    if (bg === "void") {
      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, w, h);
    } else if (bg === "midnight") {
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, w, h);
    } else if (bg === "nebula") {
      const g = ctx.createRadialGradient(w * 0.3, h * 0.4, 0, w * 0.5, h * 0.5, w * 0.8);
      g.addColorStop(0, "#1a0a2e");
      g.addColorStop(0.45, "#0d1b2a");
      g.addColorStop(1, "#050510");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 97) % 100) / 100 * w;
        const sy = ((i * 53) % 100) / 100 * h;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.6 + (i % 3) * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (bg === "grid") {
      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(100,120,180,0.12)";
      ctx.lineWidth = 1;
      const step = Math.max(24, w / 20);
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const now = Date.now();
    trailsRef.current.forEach((t) => {
      const ageSec = (now - t.created) / 1000;
      const alpha = fade > 0 ? Math.max(0, 1 - ageSec * fade * 0.15) : 1;
      if (alpha <= 0) return;
      const pts = t.points;
      drawTrail(ctx, pts, w, h, false, false, alpha);
      if (mirror) drawTrail(ctx, pts, w, h, true, false, alpha);
      if (vMirror) drawTrail(ctx, pts, w, h, false, true, alpha);
      if (mirror && vMirror) drawTrail(ctx, pts, w, h, true, true, alpha);
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Particles
    particlesRef.current.forEach((p) => {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha * 0.75;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = Math.min(24, bloom * 0.6);
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.size * alpha * 1.4, 0, Math.PI * 2);
      ctx.fill();
      if (mirror) {
        ctx.beginPath();
        ctx.arc((1 - p.x) * w, p.y * h, p.size * alpha * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (vMirror) {
        ctx.beginPath();
        ctx.arc(p.x * w, (1 - p.y) * h, p.size * alpha * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (mirror && vMirror) {
        ctx.beginPath();
        ctx.arc((1 - p.x) * w, (1 - p.y) * h, p.size * alpha * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [bloom, mirror, vMirror, fade, bg, drawTrail]);

  useEffect(() => {
    const loop = () => {
      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx * 0.0025 * speed,
          y: p.y + p.vy * 0.0025 * speed,
          vy: p.vy + gravity * 0.004,
          life: p.life - 0.014,
          size: p.size * 0.992,
        }))
        .filter((p) => p.life > 0);
      // Cap particles for mobile CWV
      if (particlesRef.current.length > 400) {
        particlesRef.current = particlesRef.current.slice(-300);
      }
      // Fade out old trails
      if (fade > 0) {
        const now = Date.now();
        trailsRef.current = trailsRef.current.filter((t) => {
          const ageSec = (now - t.created) / 1000;
          return ageSec * fade * 0.15 < 1.1;
        });
      }
      redraw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [redraw, speed, gravity, fade]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const sizePx = Math.min(rect.width, Math.min(window.innerWidth - 24, 760));
      canvas.width = sizePx;
      canvas.height = sizePx * 0.7;
      redraw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [redraw]);

  const getPos = (e: React.PointerEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDrawing(true);
    const p = getPos(e);
    trailsRef.current.push({ points: [p], created: Date.now() });
    spawnParticles(p.x, p.y, 10);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const p = getPos(e);
    const last = trailsRef.current[trailsRef.current.length - 1];
    if (last) {
      if (smooth && last.points.length > 0) {
        const prev = last.points[last.points.length - 1];
        const sx = prev.x * 0.55 + p.x * 0.45;
        const sy = prev.y * 0.55 + p.y * 0.45;
        last.points.push({ x: sx, y: sy });
      } else {
        last.points.push(p);
      }
    }
    spawnParticles(p.x, p.y, 3);
  };

  const onPointerUp = () => setIsDrawing(false);

  const clear = () => {
    trailsRef.current = [];
    particlesRef.current = [];
  };

  const undo = () => {
    if (trailsRef.current.length > 0) {
      trailsRef.current.pop();
    }
  };

  const exportPng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    try {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `prism-trail-utilihub-${Date.now()}.png`;
      a.click();
    } finally {
      setTimeout(() => setExporting(false), 400);
    }
  };

  const share = async () => {
    trackEvent("share_click", { id: "prism-trail-composer", locale });
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!blob) return;
      const file = new File([blob], "prism-trail.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Prism Trail Composer UtiliHub",
          text: labels.hint,
          url: window.location.href,
        });
      } else {
        await exportPng();
      }
    } catch {
      exportPng();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.dispersion}
          <input
            type="range"
            min={0}
            max={40}
            value={dispersion}
            onChange={(e) => setDispersion(Number(e.target.value))}
            className="w-24 accent-violet-500"
          />
          <span className="w-6 text-right">{dispersion}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.speed}
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-cyan-500"
          />
          <span className="w-8 text-right">{speed.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.bloom}
          <input
            type="range"
            min={0}
            max={40}
            value={bloom}
            onChange={(e) => setBloom(Number(e.target.value))}
            className="w-24 accent-pink-500"
          />
          <span className="w-6 text-right">{bloom}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.width}
          <input
            type="range"
            min={2}
            max={16}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-24 accent-amber-500"
          />
          <span className="w-6 text-right">{strokeWidth}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.angle}
          <input
            type="range"
            min={0}
            max={180}
            value={prismAngle}
            onChange={(e) => setPrismAngle(Number(e.target.value))}
            className="w-24 accent-emerald-500"
          />
          <span className="w-8 text-right">{prismAngle}°</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.density}
          <input
            type="range"
            min={1}
            max={12}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-24 accent-fuchsia-500"
          />
          <span className="w-6 text-right">{density}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.gravity}
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
            className="w-24 accent-orange-500"
          />
          <span className="w-8 text-right">{gravity.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.fade}
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={fade}
            onChange={(e) => setFade(Number(e.target.value))}
            className="w-24 accent-rose-500"
          />
          <span className="w-6 text-right">{fade}</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.scheme}
          <select
            value={scheme}
            onChange={(e) => setScheme(e.target.value as ColorScheme)}
            className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm font-medium text-foreground"
          >
            {(Object.keys(SCHEMES) as ColorScheme[]).map((k) => (
              <option key={k} value={k}>
                {labels.schemes[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <input
            type="checkbox"
            checked={mirror}
            onChange={(e) => setMirror(e.target.checked)}
            className="h-4 w-4 accent-violet-500"
          />
          {labels.mirror}
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <input
            type="checkbox"
            checked={vMirror}
            onChange={(e) => setVMirror(e.target.checked)}
            className="h-4 w-4 accent-violet-500"
          />
          {labels.vMirror}
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <input
            type="checkbox"
            checked={smooth}
            onChange={(e) => setSmooth(e.target.checked)}
            className="h-4 w-4 accent-cyan-500"
          />
          {labels.smooth}
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.bg}
          <select
            value={bg}
            onChange={(e) => setBg(e.target.value as BgPreset)}
            className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm font-medium text-foreground"
          >
            {(Object.keys(labels.bgs) as BgPreset[]).map((k) => (
              <option key={k} value={k}>
                {labels.bgs[k]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={undo} className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
          {labels.undo}
        </button>
        <button type="button" onClick={clear} className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
          {labels.clear}
        </button>
        <button type="button" onClick={exportPng} disabled={exporting} className="min-h-[44px] rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60">
          {exporting ? "…" : labels.export}
        </button>
        <button type="button" onClick={share} className="min-h-[44px] rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">
          {labels.share}
        </button>
      </div>

      <div className="relative mx-auto max-w-[760px] overflow-hidden rounded-2xl border border-slate-700/40 bg-black shadow-2xl">
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none cursor-crosshair"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 select-none text-[10px] sm:text-xs text-white/55 px-2 text-center">
          {labels.hint}
        </p>
      </div>
    </div>
  );
}
