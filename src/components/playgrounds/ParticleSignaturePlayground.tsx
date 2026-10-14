"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";

type MoodId = "seed" | "aurora" | "neon" | "sunset" | "ocean" | "ember" | "mono";

interface Mood {
  id: MoodId;
  label: { en: string; es: string };
  /** Base hue when not using text seed */
  hue: number;
  /** Hue spread for particles */
  spread: number;
  /** Attract glow RGB */
  glow: [number, number, number];
  /** Trail / clear rgba */
  trail: string;
  /** Solid bg for PNG export */
  bg: string;
  swatch: string;
}

const MOODS: Mood[] = [
  {
    id: "seed",
    label: { en: "From text", es: "Del texto" },
    hue: 200,
    spread: 40,
    glow: [190, 150, 255],
    trail: "rgba(8, 12, 28, 0.2)",
    bg: "#080c1c",
    swatch: "linear-gradient(135deg,#a78bfa,#38bdf8,#f472b6)",
  },
  {
    id: "aurora",
    label: { en: "Aurora", es: "Aurora" },
    hue: 160,
    spread: 50,
    glow: [100, 255, 200],
    trail: "rgba(4, 18, 22, 0.22)",
    bg: "#041216",
    swatch: "linear-gradient(135deg,#34d399,#22d3ee,#a78bfa)",
  },
  {
    id: "neon",
    label: { en: "Neon", es: "Neón" },
    hue: 300,
    spread: 35,
    glow: [255, 80, 220],
    trail: "rgba(12, 4, 24, 0.22)",
    bg: "#0c0418",
    swatch: "linear-gradient(135deg,#f0abfc,#e879f9,#22d3ee)",
  },
  {
    id: "sunset",
    label: { en: "Sunset", es: "Atardecer" },
    hue: 20,
    spread: 45,
    glow: [255, 140, 80],
    trail: "rgba(22, 8, 10, 0.22)",
    bg: "#16080a",
    swatch: "linear-gradient(135deg,#fb923c,#f472b6,#fbbf24)",
  },
  {
    id: "ocean",
    label: { en: "Ocean", es: "Océano" },
    hue: 205,
    spread: 30,
    glow: [80, 160, 255],
    trail: "rgba(4, 12, 28, 0.22)",
    bg: "#040c1c",
    swatch: "linear-gradient(135deg,#38bdf8,#3b82f6,#6366f1)",
  },
  {
    id: "ember",
    label: { en: "Ember", es: "Brasa" },
    hue: 8,
    spread: 25,
    glow: [255, 90, 40],
    trail: "rgba(20, 6, 4, 0.22)",
    bg: "#140604",
    swatch: "linear-gradient(135deg,#ef4444,#f97316,#fbbf24)",
  },
  {
    id: "mono",
    label: { en: "Mono", es: "Mono" },
    hue: 0,
    spread: 0,
    glow: [220, 220, 230],
    trail: "rgba(10, 10, 14, 0.25)",
    bg: "#0a0a0e",
    swatch: "linear-gradient(135deg,#e5e7eb,#9ca3af,#6b7280)",
  },
];

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

const labels = {
  en: {
    text: "Your name or phrase",
    placeholder: "e.g. Alex, UtiliHub, good vibes…",
    count: "Particles",
    gravity: "Gravity",
    mood: "Color mood",
    generate: "Regenerate",
    share: "Share signature",
    download: "Download PNG",
    downloading: "Saving…",
    copied: "Link copied!",
    shared: "Shared!",
    help: "Type anything — particles form a unique orbit. Tap the canvas to add attractors. Share the link or download a PNG.",
    emptyHint: "Type your name above to generate your visual signature",
    tip: "Tip: shorter names look sharper. Try your nickname.",
  },
  es: {
    text: "Tu nombre o frase",
    placeholder: "ej. Sofía, UtiliHub, buenas vibras…",
    count: "Partículas",
    gravity: "Gravedad",
    mood: "Estado de color",
    generate: "Regenerar",
    share: "Compartir firma",
    download: "Descargar PNG",
    downloading: "Guardando…",
    copied: "¡Enlace copiado!",
    shared: "¡Compartido!",
    help: "Escribí cualquier cosa — las partículas forman una órbita única. Tocá el canvas para sumar atrayentes. Compartí el enlace o descargá un PNG.",
    emptyHint: "Escribí tu nombre arriba para generar tu firma visual",
    tip: "Tip: los nombres cortos se ven más nítidos. Probá tu apodo.",
  },
};

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function moodById(id: string | null): Mood {
  return MOODS.find((m) => m.id === id) || MOODS[0];
}

export function ParticleSignaturePlayground({
  locale,
  entryMode = false,
}: {
  locale: Locale;
  entryMode?: boolean;
}) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const attractorsRef = useRef<Attractor[]>([]);
  const nextId = useRef(1);
  const moodRef = useRef<Mood>(MOODS[0]);
  const paramsRef = useRef({ count: 180, gravity: 1.0, text: "" });
  const [text, setText] = useState("");
  const [count, setCount] = useState(entryMode ? 200 : 180);
  const [gravity, setGravity] = useState(entryMode ? 1.15 : 1.0);
  const [moodId, setMoodId] = useState<MoodId>("seed");
  const [copied, setCopied] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    moodRef.current = moodById(moodId);
  }, [moodId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txt = params.get("sig") || "";
    const c = parseInt(params.get("count") || String(entryMode ? 200 : 180), 10);
    const g = parseFloat(params.get("g") || String(entryMode ? 1.15 : 1.0));
    const m = params.get("mood");
    if (m && MOODS.some((x) => x.id === m)) setMoodId(m as MoodId);
    if (txt) {
      setText(txt);
      setHasSignature(true);
    }
    if (!isNaN(c) && c >= 50 && c <= 400) setCount(c);
    if (!isNaN(g) && g >= 0.2 && g <= 2.5) setGravity(g);
    if (txt) {
      setTimeout(() => generateFromText(txt), 60);
    } else if (entryMode) {
      setTimeout(() => generateFromText(locale === "es" ? "Firma" : "Signature"), 80);
    }
    if (entryMode && !txt) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [entryMode, locale]);

  useEffect(() => {
    paramsRef.current = { count, gravity, text };
  }, [count, gravity, text]);

  const baseHueFor = useCallback(
    (str: string, mood: Mood) => {
      if (mood.id === "seed") return hashString(str || "utilihub") % 360;
      if (mood.id === "mono") return 0;
      return mood.hue;
    },
    [],
  );

  const generateFromText = useCallback(
    (str: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 600;
      const h = rect.height || 420;
      const seed = hashString(str || "utilihub");
      const n = 3 + (seed % 5);
      const attrs: Attractor[] = [];
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 + (seed % 100) / 100;
        const r = Math.min(w, h) * (0.18 + (seed % 50) / 200);
        attrs.push({
          x: w / 2 + Math.cos(angle) * r,
          y: h / 2 + Math.sin(angle) * r,
          id: nextId.current++,
        });
      }
      attractorsRef.current = attrs;
      const mood = moodRef.current;
      const baseHue = baseHueFor(str, mood);
      const spread = mood.spread;
      const ps: Particle[] = [];
      const nParticles = paramsRef.current.count;
      for (let i = 0; i < nParticles; i++) {
        ps.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: 1.4 + Math.random() * 2,
          hue:
            mood.id === "mono"
              ? 0
              : (baseHue + (Math.random() - 0.5) * spread + Math.random() * (spread * 0.3)) % 360,
        });
      }
      particlesRef.current = ps;
      if (str.trim()) setHasSignature(true);
    },
    [baseHueFor],
  );

  const recolorParticles = useCallback(
    (str: string, mood: Mood) => {
      const baseHue = baseHueFor(str, mood);
      const spread = mood.spread;
      for (const p of particlesRef.current) {
        p.hue =
          mood.id === "mono"
            ? 0
            : (baseHue + (Math.random() - 0.5) * spread + Math.random() * (spread * 0.3)) % 360;
      }
    },
    [baseHueFor],
  );

  const initParticles = useCallback((n: number, w: number, h: number, baseHue = 200) => {
    const ps: Particle[] = [];
    for (let i = 0; i < n; i++) {
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: 1.3 + Math.random() * 2.1,
        hue: (baseHue + Math.random() * 60) % 360,
      });
    }
    particlesRef.current = ps;
  }, []);

  // Live mood switch without full regenerate
  useEffect(() => {
    const mood = moodById(moodId);
    moodRef.current = mood;
    if (particlesRef.current.length > 0) {
      recolorParticles(paramsRef.current.text || text, mood);
    }
  }, [moodId, recolorParticles, text]);

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
      attractorsRef.current.push({ x, y, id: nextId.current++ });
      setHasSignature(true);
    };

    canvas.addEventListener("pointerdown", onPointerDown);

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { gravity: g } = paramsRef.current;
      const attrs = attractorsRef.current;
      const ps = particlesRef.current;
      const mood = moodRef.current;
      const [gr, gg, gb] = mood.glow;

      ctx.fillStyle = mood.trail;
      ctx.fillRect(0, 0, w, h);

      for (const a of attrs) {
        const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 36);
        grad.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, 0.95)`);
        grad.addColorStop(0.35, `rgba(${gr}, ${gg}, ${gb}, 0.35)`);
        grad.addColorStop(1, `rgba(${gr}, ${gg}, ${gb}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(a.x, a.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = mood.id === "mono" ? "#f3f4f6" : "#f5f3ff";
        ctx.fill();
      }

      const damp = 0.992;
      for (const p of ps) {
        let ax = 0;
        let ay = 0;
        for (const a of attrs) {
          const dx = a.x - p.x;
          const dy = a.y - p.y;
          const dist2 = dx * dx + dy * dy;
          const dist = Math.sqrt(dist2) || 1;
          const force = g / (dist2 * 0.01 + 40);
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
        if (mood.id === "mono") {
          const light = 55 + Math.min(30, speed * 8);
          ctx.shadowColor = `hsl(0, 0%, ${light}%)`;
          ctx.shadowBlur = 3 + speed;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(0, 0%, ${light + 10}%)`;
          ctx.fill();
        } else {
          const hue = (p.hue + speed * 4) % 360;
          ctx.shadowColor = `hsl(${hue}, 85%, 62%)`;
          ctx.shadowBlur = 4 + speed * 1.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${hue}, 80%, 65%)`;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && attractorsRef.current.length === 0) {
      initParticles(count, rect.width, rect.height);
    } else if (text.trim()) {
      generateFromText(text);
    }
  }, [count, initParticles, generateFromText, text]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) return;
    debounceRef.current = window.setTimeout(() => {
      generateFromText(text);
    }, 380);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, generateFromText]);

  const onGenerate = () => generateFromText(text || (locale === "es" ? "Firma" : "Signature"));

  const buildShareUrl = () => {
    const params = new URLSearchParams();
    if (text.trim()) params.set("sig", text.trim());
    params.set("count", String(count));
    params.set("g", gravity.toFixed(2));
    if (moodId !== "seed") params.set("mood", moodId);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const share = async () => {
    const url = buildShareUrl();
    const title =
      locale === "es"
        ? `Mi firma visual${text.trim() ? `: ${text.trim()}` : ""}`
        : `My visual signature${text.trim() ? `: ${text.trim()}` : ""}`;
    const shareData = {
      title,
      text:
        locale === "es"
          ? "Mirá mi firma de partículas en UtiliHub"
          : "Check out my particle signature on UtiliHub",
      url,
    };
    try {
      if (typeof navigator.share === "function" && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      /* cancelled */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt(locale === "es" ? "Copiá este enlace:" : "Copy this link:", url);
    }
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    try {
      const mood = moodRef.current;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const ctx = off.getContext("2d");
      if (!ctx) return;

      // Solid background (no trail translucency)
      ctx.fillStyle = mood.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.scale(dpr, dpr);

      const attrs = attractorsRef.current;
      const ps = particlesRef.current;
      const [gr, gg, gb] = mood.glow;

      for (const a of attrs) {
        const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 36);
        grad.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, 0.95)`);
        grad.addColorStop(0.35, `rgba(${gr}, ${gg}, ${gb}, 0.4)`);
        grad.addColorStop(1, `rgba(${gr}, ${gg}, ${gb}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(a.x, a.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#f5f3ff";
        ctx.fill();
      }

      for (const p of ps) {
        const speed = Math.hypot(p.vx, p.vy);
        if (mood.id === "mono") {
          const light = 60 + Math.min(25, speed * 8);
          ctx.shadowColor = `hsl(0, 0%, ${light}%)`;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(0, 0%, ${light + 8}%)`;
          ctx.fill();
        } else {
          const hue = (p.hue + speed * 4) % 360;
          ctx.shadowColor = `hsl(${hue}, 85%, 62%)`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${hue}, 80%, 65%)`;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // Subtle watermark
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.font = `${Math.max(11, Math.round(12 * dpr))}px system-ui, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.textAlign = "right";
      ctx.fillText("UtiliHub · Firma Visual", w - 12 * dpr, h - 12 * dpr);

      const slug = (text.trim() || "firma").slice(0, 24).replace(/\s+/g, "-").toLowerCase();
      const a = document.createElement("a");
      a.download = `firma-visual-${slug}-${moodId}.png`;
      a.href = off.toDataURL("image/png");
      a.click();
    } finally {
      setTimeout(() => setDownloading(false), 400);
    }
  };

  return (
    <div className="space-y-4">
      {entryMode && (
        <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-50/50 p-4 dark:from-violet-950/40 dark:via-background dark:to-fuchsia-950/20">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-foreground">{t.text}</span>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
              className="rounded-xl border border-border bg-background px-4 py-3 text-base shadow-sm outline-none ring-primary/30 focus:ring-2"
              maxLength={40}
              autoComplete="off"
              enterKeyHint="done"
            />
          </label>
          <p className="mt-2 text-xs text-muted-foreground">{t.tip}</p>
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#080c1c] shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-[min(52vh,420px)] w-full touch-none sm:h-[520px]"
          style={{ display: "block" }}
          aria-label={locale === "es" ? "Canvas de firma de partículas" : "Particle signature canvas"}
        />
        {!hasSignature && !text.trim() && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <p className="max-w-xs text-center text-sm font-medium text-white/70">{t.emptyHint}</p>
          </div>
        )}
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-surface/40 p-4">
        {!entryMode && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{t.text}</span>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
              className="rounded-lg border border-border bg-background px-3 py-2"
              maxLength={40}
            />
          </label>
        )}

        {/* Color presets */}
        <div className="space-y-2">
          <p className="text-sm font-medium">{t.mood}</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const active = moodId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMoodId(m.id)}
                  title={m.label[locale]}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10 shadow-inner"
                    style={{ background: m.swatch }}
                    aria-hidden
                  />
                  {m.label[locale]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">
              {t.count} ({count})
            </span>
            <input
              type="range"
              min={60}
              max={350}
              step={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="accent-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">
              {t.gravity} ({gravity.toFixed(2)})
            </span>
            <input
              type="range"
              min={0.3}
              max={2.2}
              step={0.05}
              value={gravity}
              onChange={(e) => setGravity(Number(e.target.value))}
              className="accent-primary"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onGenerate}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold"
          >
            {t.generate}
          </button>
          <button
            type="button"
            onClick={share}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
          >
            {copied ? t.shared : t.share}
          </button>
          <button
            type="button"
            onClick={downloadPng}
            disabled={downloading}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {downloading ? t.downloading : t.download}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{t.help}</p>
      </div>
    </div>
  );
}
