"use client";
// Viral Firework Signature — particles launch, settle into letter shapes, then burst (2026-10-14)

import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";
type MoodId = "aurora" | "neon" | "sunset" | "ocean" | "ember" | "cosmic";

interface Mood {
  id: MoodId;
  label: { en: string; es: string };
  hue: number;
  glow: string;
  bg: string;
  trail: string;
}

const MOODS: Mood[] = [
  { id: "aurora", label: { en: "Aurora", es: "Aurora" }, hue: 160, glow: "rgba(100,255,200,0.85)", bg: "#041216", trail: "rgba(4,18,22,0.28)" },
  { id: "neon", label: { en: "Neon", es: "Neón" }, hue: 300, glow: "rgba(255,80,220,0.85)", bg: "#0c0418", trail: "rgba(12,4,24,0.28)" },
  { id: "sunset", label: { en: "Sunset", es: "Atardecer" }, hue: 20, glow: "rgba(255,140,80,0.85)", bg: "#16080a", trail: "rgba(22,8,10,0.28)" },
  { id: "ocean", label: { en: "Ocean", es: "Océano" }, hue: 205, glow: "rgba(80,160,255,0.85)", bg: "#040c1c", trail: "rgba(4,12,28,0.28)" },
  { id: "ember", label: { en: "Ember", es: "Brasa" }, hue: 8, glow: "rgba(255,90,40,0.85)", bg: "#140604", trail: "rgba(20,6,4,0.28)" },
  { id: "cosmic", label: { en: "Cosmic", es: "Cósmico" }, hue: 260, glow: "rgba(180,100,255,0.85)", bg: "#0a0618", trail: "rgba(10,6,24,0.28)" },
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
  life: number;
  phase: "launch" | "form" | "burst" | "residual";
  /** Frames spent in form before burst */
  hold: number;
  residualX?: number;
  residualY?: number;
}

const labels = {
  en: {
    message: "Your name or phrase",
    placeholder: "UtiliHub, Hello…",
    density: "Spark density",
    burst: "Burst size",
    mood: "Color mood",
    shareX: "Share on X",
    shareWA: "WhatsApp",
    shareNative: "Share",
    copy: "Copy link",
    download: "Download PNG",
    copied: "Copied!",
    shared: "Shared!",
    help: "Type a short name. Fireworks launch, form the letters, then explode into a unique constellation. Tune burst & density, pick a mood, share or download.",
  },
  es: {
    message: "Tu nombre o frase",
    placeholder: "UtiliHub, Hola…",
    density: "Densidad de chispas",
    burst: "Tamaño de estallido",
    mood: "Ánimo de color",
    shareX: "Compartir en X",
    shareWA: "WhatsApp",
    shareNative: "Compartir",
    copy: "Copiar enlace",
    download: "Descargar PNG",
    copied: "¡Copiado!",
    shared: "¡Compartido!",
    help: "Escribí un nombre corto. Los fuegos artificiales se lanzan, forman las letras y explotan en una constelación única. Ajustá estallido y densidad, elegí ánimo, compartí o descargá.",
  },
};

function sampleTextTargets(text: string, w: number, h: number): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  const W = Math.max(1, Math.floor(w));
  const H = Math.max(1, Math.floor(h));
  off.width = W;
  off.height = H;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx || !text.trim()) return [];
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  const fontSize = Math.min(H * 0.42, Math.max(28, W / Math.max(4, text.trim().length * 0.55)));
  ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.trim().slice(0, 24), W / 2, H / 2);
  const data = ctx.getImageData(0, 0, W, H).data;
  const targets: { x: number; y: number }[] = [];
  const step = Math.max(3, Math.floor(Math.min(W, H) / 80));
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const i = (y * W + x) * 4;
      if (data[i] > 128) targets.push({ x, y });
    }
  }
  return targets;
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function FireworkSignature({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const targetsRef = useRef<{ x: number; y: number }[]>([]);
  const paramsRef = useRef({ density: 220, burst: 1.4, text: "", mood: MOODS[0] });
  const [text, setText] = useState("UtiliHub");
  const [density, setDensity] = useState(220);
  const [burst, setBurst] = useState(1.4);
  const [moodId, setMoodId] = useState<MoodId>("aurora");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;
  const seedRef = useRef(hashSeed("UtiliHub"));

  const mood = MOODS.find((m) => m.id === moodId) || MOODS[0];

  useEffect(() => {
    paramsRef.current = { density, burst, text, mood };
    seedRef.current = hashSeed(text || "UtiliHub");
  }, [density, burst, text, mood]);

  const regenerate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 600;
    const h = rect.height || 360;
    const targets = sampleTextTargets(text, w, h);
    targetsRef.current = targets;
    const n =
      targets.length > 0
        ? Math.min(density, Math.max(80, targets.length))
        : Math.min(density, 120);
    const ps: Particle[] = [];
    const baseHue = mood.hue;
    const seed = seedRef.current;
    for (let i = 0; i < n; i++) {
      const tgt =
        targets.length > 0
          ? targets[i % targets.length]
          : { x: w / 2 + (Math.random() - 0.5) * w * 0.3, y: h * 0.45 };
      const rx = (Math.sin(seed * 0.001 + i * 0.7) * 0.5 + 0.5) * w;
      const ry = (Math.cos(seed * 0.0013 + i * 0.5) * 0.5 + 0.5) * h * 0.7 + h * 0.1;
      // Stagger starts so the letter fills in a wave, not one blob
      const delaySpread = (i / Math.max(1, n)) * 18;
      ps.push({
        x: tgt.x + (Math.random() - 0.5) * 30,
        y: h + 20 + Math.random() * 50 + delaySpread,
        vx: (Math.random() - 0.5) * 1.2,
        // Mild upward speed — seek handles the rest (no rocket overshoot)
        vy: -2.2 - Math.random() * 1.8,
        tx: tgt.x,
        ty: tgt.y,
        size: 1.6 + Math.random() * 2,
        hue: (baseHue + (Math.random() - 0.5) * 40 + 360) % 360,
        life: 1,
        phase: "launch",
        hold: 0,
        residualX: rx,
        residualY: ry,
      });
    }
    particlesRef.current = ps;
  }, [text, density, mood]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg") || "";
    const d = parseInt(params.get("d") || "220", 10);
    const b = parseFloat(params.get("b") || "1.4");
    const m = params.get("mood") as MoodId | null;
    if (msg) setText(msg);
    if (!isNaN(d) && d >= 50 && d <= 400) setDensity(d);
    if (!isNaN(b) && b >= 0.6 && b <= 2.8) setBurst(b);
    if (m && MOODS.some((x) => x.id === m)) setMoodId(m);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(regenerate, 320);
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
    const boot = window.setTimeout(regenerate, 80);

    const FORM_HOLD_FRAMES = 90; // ~1.5s visible letter shape before burst

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { burst: bst, mood: md } = paramsRef.current;
      const ps = particlesRef.current;

      ctx.fillStyle = md.trail;
      ctx.fillRect(0, 0, w, h);

      for (const p of ps) {
        if (p.phase === "launch") {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          // Strong seek toward letter pixel — no continuous upward bias
          const seek = Math.min(0.55, 0.12 + dist * 0.0025);
          p.vx += (dx / dist) * seek;
          p.vy += (dy / dist) * seek;
          p.vx *= 0.88;
          p.vy *= 0.88;
          // Cap speed so they don't overshoot targets
          const spd = Math.hypot(p.vx, p.vy);
          if (spd > 7) {
            p.vx = (p.vx / spd) * 7;
            p.vy = (p.vy / spd) * 7;
          }
          if (dist < 8) {
            p.x = p.tx;
            p.y = p.ty;
            p.vx = 0;
            p.vy = 0;
            p.phase = "form";
            p.hold = 0;
          }
        } else if (p.phase === "form") {
          // Soft spring lock on letter pixel so the glyph stays readable
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx += dx * 0.18;
          p.vy += dy * 0.18;
          p.vx *= 0.75;
          p.vy *= 0.75;
          p.hold += 1;
          if (p.hold >= FORM_HOLD_FRAMES) {
            p.phase = "burst";
            const angle = Math.random() * Math.PI * 2;
            const power = (4 + Math.random() * 8) * bst;
            p.vx = Math.cos(angle) * power;
            p.vy = Math.sin(angle) * power;
            p.life = 1;
          }
        } else if (p.phase === "burst") {
          p.life -= 0.014;
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.vy += 0.05;
          if (p.life < 0.28) {
            p.phase = "residual";
            p.life = 0.9;
          }
        } else if (p.phase === "residual" && p.residualX != null && p.residualY != null) {
          const dx = p.residualX - p.x;
          const dy = p.residualY - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          const force = 0.1 / (dist * 0.04 + 1);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.life = Math.min(1, p.life + 0.003);
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.life <= 0) continue;

        const speed = Math.hypot(p.vx, p.vy);
        const hue = (p.hue + speed * 2) % 360;
        const alpha = Math.max(0.2, p.life);
        const r = p.size * (p.phase === "burst" ? 1.35 : p.phase === "form" ? 1.15 : 1);
        ctx.shadowColor = `hsla(${hue}, 85%, 60%, ${alpha})`;
        ctx.shadowBlur = p.phase === "form" ? 10 : 6 + speed * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 62%, ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(boot);
      window.removeEventListener("resize", resize);
    };
  }, [regenerate]);

  const buildUrl = () => {
    const params = new URLSearchParams();
    if (text.trim()) params.set("msg", text.trim());
    params.set("d", String(density));
    params.set("b", burst.toFixed(2));
    params.set("mood", moodId);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const getShareText = () => {
    const base =
      locale === "es"
        ? `Mirá mi firma de fuegos artificiales 🎆 ${text.trim() || "UtiliHub"}`
        : `Check my firework signature 🎆 ${text.trim() || "UtiliHub"}`;
    return `${base} #UtiliHub #FireworkSignature`;
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
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener",
    );
  };

  const shareWA = () => {
    const url = buildUrl();
    const txt =
      locale === "es"
        ? `Mirá mi firma de fuegos artificiales en UtiliHub: ${url}`
        : `Check my firework signature on UtiliHub: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, "_blank", "noopener");
  };

  const shareNative = async () => {
    const url = buildUrl();
    const txt = getShareText();
    try {
      if (navigator.share) {
        await navigator.share({
          title: locale === "es" ? "Firma de fuegos artificiales" : "Firework Signature",
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
    ctx.fillText("UtiliHub · Firework", off.width - 16, off.height - 16);
    const a = document.createElement("a");
    a.download = `firework-${(text || "sig").slice(0, 18).replace(/\s+/g, "-")}.png`;
    a.href = off.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 p-4 dark:from-amber-950/30 dark:via-background dark:to-orange-950/20">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">{t.message}</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.placeholder}
            className="rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm outline-none ring-primary/30 focus:ring-2"
            maxLength={24}
            autoComplete="off"
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">{t.help}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.density}
          <input type="range" min={80} max={360} value={density} onChange={(e) => setDensity(+e.target.value)} className="accent-amber-500" />
          <span className="text-muted-foreground">{density}</span>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          {t.burst}
          <input type="range" min={0.7} max={2.6} step={0.1} value={burst} onChange={(e) => setBurst(+e.target.value)} className="accent-amber-500" />
          <span className="text-muted-foreground">{burst.toFixed(1)}</span>
        </label>
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

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#080c1c] shadow-inner">
        <canvas ref={canvasRef} className="h-[min(52vh,420px)] w-full touch-none" />
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
        <button type="button" onClick={downloadPng} className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700">
          {t.download}
        </button>
      </div>
    </div>
  );
}
