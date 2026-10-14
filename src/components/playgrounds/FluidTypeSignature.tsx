"use client";
// Fluid Type Signature — living particle fluid that forms typed letters, responds to mouse/touch (2026-10-14)

import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";
type MoodId = "ocean" | "lava" | "galaxy" | "forest" | "aurora";
type Mode = "attract" | "repel";

interface Mood {
  id: MoodId;
  label: { en: string; es: string };
  hue: number;
  glow: string;
  bg: string;
  trail: string;
}

const MOODS: Mood[] = [
  { id: "ocean", label: { en: "Ocean", es: "Océano" }, hue: 205, glow: "rgba(60,140,255,0.85)", bg: "#041018", trail: "rgba(4,16,24,0.18)" },
  { id: "lava", label: { en: "Lava", es: "Lava" }, hue: 15, glow: "rgba(255,80,30,0.85)", bg: "#140804", trail: "rgba(20,8,4,0.18)" },
  { id: "galaxy", label: { en: "Galaxy", es: "Galaxia" }, hue: 270, glow: "rgba(160,80,255,0.85)", bg: "#0a0618", trail: "rgba(10,6,24,0.18)" },
  { id: "forest", label: { en: "Forest", es: "Bosque" }, hue: 130, glow: "rgba(40,180,80,0.85)", bg: "#06140c", trail: "rgba(6,20,12,0.18)" },
  { id: "aurora", label: { en: "Aurora", es: "Aurora" }, hue: 175, glow: "rgba(80,220,200,0.85)", bg: "#041216", trail: "rgba(4,18,22,0.18)" },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  size: number;
  hue: number;
}

const labels = {
  en: {
    message: "Your name or phrase",
    placeholder: "Fluid, UtiliHub…",
    density: "Particle density",
    viscosity: "Viscosity",
    mode: "Pointer mode",
    attract: "Attract",
    repel: "Repel",
    mood: "Color mood",
    shareX: "Share on X",
    shareWA: "WhatsApp",
    shareNative: "Share",
    copy: "Copy link",
    download: "Download PNG",
    copied: "Copied!",
    shared: "Shared!",
    help: "Type a short name. Particles form the letters as a living fluid that responds to mouse or touch (attract or repel). Tune density and viscosity, pick a mood, share or download.",
  },
  es: {
    message: "Tu nombre o frase",
    placeholder: "Fluido, UtiliHub…",
    density: "Densidad de partículas",
    viscosity: "Viscosidad",
    mode: "Modo de puntero",
    attract: "Atraer",
    repel: "Repeler",
    mood: "Ánimo de color",
    shareX: "Compartir en X",
    shareWA: "WhatsApp",
    shareNative: "Compartir",
    copy: "Copiar enlace",
    download: "Descargar PNG",
    copied: "¡Copiado!",
    shared: "¡Compartido!",
    help: "Escribí un nombre corto. Las partículas forman las letras como un fluido vivo que responde al mouse o toque (atraer o repeler). Ajustá densidad y viscosidad, elegí ánimo, compartí o descargá.",
  },
};

function sampleTextTargets(text: string, w: number, h: number): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  off.width = Math.floor(w);
  off.height = Math.floor(h);
  const ctx = off.getContext("2d");
  if (!ctx || !text.trim()) return [];
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${Math.min(h * 0.42, 100)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.trim().slice(0, 20), w / 2, h / 2);
  const data = ctx.getImageData(0, 0, w, h).data;
  const targets: { x: number; y: number }[] = [];
  const step = 4;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      if (data[i] > 140) targets.push({ x, y });
    }
  }
  return targets;
}

export function FluidTypeSignature({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const targetsRef = useRef<{ x: number; y: number }[]>([]);
  const pointerRef = useRef({ x: -999, y: -999, active: false });
  const paramsRef = useRef({ density: 280, viscosity: 0.92, text: "", mood: MOODS[0], mode: "attract" as Mode });
  const [text, setText] = useState("UtiliHub");
  const [density, setDensity] = useState(280);
  const [viscosity, setViscosity] = useState(0.92);
  const [mode, setMode] = useState<Mode>("attract");
  const [moodId, setMoodId] = useState<MoodId>("ocean");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const mood = MOODS.find((m) => m.id === moodId) || MOODS[0];

  useEffect(() => {
    paramsRef.current = { density, viscosity, text, mood, mode };
  }, [density, viscosity, text, mood, mode]);

  const regenerate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 600;
    const h = rect.height || 360;
    const targets = sampleTextTargets(text, w, h);
    targetsRef.current = targets;
    const n = Math.min(density, Math.max(80, targets.length * 1.2 || 120));
    const ps: Particle[] = [];
    const baseHue = mood.hue;
    for (let i = 0; i < n; i++) {
      const tgt = targets[i % Math.max(1, targets.length)] || { x: w / 2, y: h / 2 };
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        tx: tgt.x,
        ty: tgt.y,
        size: 1.6 + Math.random() * 2.4,
        hue: (baseHue + (Math.random() - 0.5) * 40) % 360,
      });
    }
    particlesRef.current = ps;
  }, [text, density, mood]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg") || "";
    const d = parseInt(params.get("d") || "280", 10);
    const v = parseFloat(params.get("v") || "0.92");
    const m = params.get("mood") as MoodId | null;
    const md = params.get("mode") as Mode | null;
    if (msg) setText(msg);
    if (!isNaN(d) && d >= 80 && d <= 450) setDensity(d);
    if (!isNaN(v) && v >= 0.75 && v <= 0.98) setViscosity(v);
    if (m && MOODS.some((x) => x.id === m)) setMoodId(m);
    if (md === "attract" || md === "repel") setMode(md);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(regenerate, 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, density, moodId, regenerate]);

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
    setTimeout(regenerate, 60);

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerup", onLeave);

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { viscosity: visc, mood: md, mode: mdMode } = paramsRef.current;
      const ps = particlesRef.current;
      const ptr = pointerRef.current;

      ctx.fillStyle = md.trail;
      ctx.fillRect(0, 0, w, h);

      for (const p of ps) {
        // Target attraction for letter form
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const formForce = 0.18 / (dist * 0.05 + 1);
        p.vx += (dx / dist) * formForce;
        p.vy += (dy / dist) * formForce;

        // Pointer interaction
        if (ptr.active) {
          const pdx = ptr.x - p.x;
          const pdy = ptr.y - p.y;
          const pdist = Math.hypot(pdx, pdy) || 1;
          if (pdist < 180) {
            const sign = mdMode === "attract" ? 1 : -1;
            const ptrForce = (mdMode === "attract" ? 0.35 : 0.55) / (pdist * 0.04 + 1);
            p.vx += sign * (pdx / pdist) * ptrForce;
            p.vy += sign * (pdy / pdist) * ptrForce;
          }
        }

        // Viscosity damping
        p.vx *= visc;
        p.vy *= visc;
        p.x += p.vx;
        p.y += p.vy;

        // Soft bounds
        if (p.x < 0 || p.x > w) p.vx *= -0.6;
        if (p.y < 0 || p.y > h) p.vy *= -0.6;

        const speed = Math.hypot(p.vx, p.vy);
        const hue = (p.hue + speed * 1.8) % 360;
        const alpha = Math.min(1, 0.45 + speed * 0.15);
        ctx.shadowColor = `hsla(${hue}, 85%, 60%, ${alpha})`;
        ctx.shadowBlur = 6 + speed * 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 75%, 60%, ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerup", onLeave);
    };
  }, [regenerate]);

  const buildUrl = () => {
    const params = new URLSearchParams();
    if (text.trim()) params.set("msg", text.trim());
    params.set("d", String(density));
    params.set("v", viscosity.toFixed(2));
    params.set("mode", mode);
    params.set("mood", moodId);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const getShareText = () => {
    const base = locale === "es"
      ? `Mira mi firma fluida 🌊 ${text.trim() || "UtiliHub"}`
      : `Check my fluid type signature 🌊 ${text.trim() || "UtiliHub"}`;
    return `${base} #UtiliHub #FluidType`;
  };

  const copyLink = async () => {
    const url = buildUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      prompt(locale === "es" ? "Copiá:" : "Copy:", url);
    }
  };

  const shareX = () => {
    const url = buildUrl();
    const txt = getShareText();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(url)}`, "_blank", "noopener");
  };

  const shareWA = () => {
    const url = buildUrl();
    const txt = locale === "es"
      ? `Mira mi firma fluida en UtiliHub: ${url}`
      : `Check my fluid type signature on UtiliHub: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
  };

  const shareNative = async () => {
    const url = buildUrl();
    const txt = getShareText();
    try {
      if (navigator.share) {
        await navigator.share({
          title: locale === "es" ? "Firma Fluida" : "Fluid Type Signature",
          text: txt,
          url,
        });
        setShared(true);
        setTimeout(() => setShared(false), 1800);
      } else {
        copyLink();
      }
    } catch {
      // cancelled
    }
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    off.width = canvas.width;
    off.height = canvas.height;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = mood.bg;
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(canvas, 0, 0);
    ctx.font = `${12 * dpr}px system-ui`;
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.textAlign = "right";
    ctx.fillText("UtiliHub · Fluid Type", off.width - 16, off.height - 16);
    const a = document.createElement("a");
    a.download = `fluid-type-${(text || "sig").slice(0, 18).replace(/\s+/g, "-")}.png`;
    a.href = off.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-50/70 via-white to-cyan-50/40 p-4 dark:from-sky-950/30 dark:via-background dark:to-cyan-950/20">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">{t.message}</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.placeholder}
            className="rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm outline-none ring-primary/30 focus:ring-2"
            maxLength={20}
            autoComplete="off"
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">{t.help}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.density}
          <input type="range" min={100} max={420} value={density} onChange={(e) => setDensity(+e.target.value)} className="accent-sky-500" />
          <span className="text-muted-foreground">{density}</span>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.viscosity}
          <input type="range" min={0.78} max={0.97} step={0.01} value={viscosity} onChange={(e) => setViscosity(+e.target.value)} className="accent-sky-500" />
          <span className="text-muted-foreground">{viscosity.toFixed(2)}</span>
        </label>
        <div className="flex flex-col gap-1 text-xs font-medium">
          {t.mode}
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setMode("attract")}
              className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition ${
                mode === "attract" ? "bg-sky-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {t.attract}
            </button>
            <button
              type="button"
              onClick={() => setMode("repel")}
              className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition ${
                mode === "repel" ? "bg-orange-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {t.repel}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs font-medium">
          {t.mood}
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMoodId(m.id)}
                className={`h-7 w-7 rounded-full border-2 transition ${moodId === m.id ? "border-foreground scale-110" : "border-transparent"}`}
                style={{ background: m.glow }}
                title={m.label[locale]}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#060c18] shadow-inner">
        <canvas ref={canvasRef} className="h-[min(52vh,420px)] w-full touch-none" style={{ touchAction: "none" }} />
      </div>

      <div className="flex flex-wrap gap-2">
        {canNativeShare && (
          <button type="button" onClick={shareNative} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">
            {shared ? t.shared : t.shareNative}
          </button>
        )}
        <button type="button" onClick={shareX} className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
          {t.shareX}
        </button>
        <button type="button" onClick={shareWA} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          {t.shareWA}
        </button>
        <button type="button" onClick={copyLink} className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted">
          {copied ? t.copied : t.copy}
        </button>
        <button type="button" onClick={downloadPng} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">
          {t.download}
        </button>
      </div>
    </div>
  );
}
