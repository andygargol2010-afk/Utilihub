"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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

const labels = {
  en: {
    text: "Your name or phrase",
    placeholder: "e.g. Alex, UtiliHub, good vibes…",
    count: "Particles",
    gravity: "Gravity",
    generate: "Regenerate",
    share: "Share signature",
    copied: "Link copied!",
    shared: "Shared!",
    help: "Type anything — particles form a unique orbit. Tap the canvas to add attractors. Share the link so others see your signature.",
    emptyHint: "Type your name above to generate your visual signature",
    tip: "Tip: shorter names look sharper. Try your nickname.",
  },
  es: {
    text: "Tu nombre o frase",
    placeholder: "ej. Sofía, UtiliHub, buenas vibras…",
    count: "Partículas",
    gravity: "Gravedad",
    generate: "Regenerar",
    share: "Compartir firma",
    copied: "¡Enlace copiado!",
    shared: "¡Compartido!",
    help: "Escribí cualquier cosa — las partículas forman una órbita única. Tocá el canvas para sumar atrayentes. Compartí el enlace para que vean tu firma.",
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

export function ParticleSignaturePlayground({
  locale,
  entryMode = false,
}: {
  locale: Locale;
  /** Softer defaults + stronger share UX for entry landings */
  entryMode?: boolean;
}) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const attractorsRef = useRef<Attractor[]>([]);
  const nextId = useRef(1);
  const paramsRef = useRef({ count: 180, gravity: 1.0, text: "" });
  const [text, setText] = useState("");
  const [count, setCount] = useState(entryMode ? 200 : 180);
  const [gravity, setGravity] = useState(entryMode ? 1.15 : 1.0);
  const [copied, setCopied] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const seededFromUrl = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txt = params.get("sig") || "";
    const c = parseInt(params.get("count") || String(entryMode ? 200 : 180), 10);
    const g = parseFloat(params.get("g") || String(entryMode ? 1.15 : 1.0));
    if (txt) {
      setText(txt);
      seededFromUrl.current = true;
      setHasSignature(true);
    }
    if (!isNaN(c) && c >= 50 && c <= 400) setCount(c);
    if (!isNaN(g) && g >= 0.2 && g <= 2.5) setGravity(g);
    if (txt) {
      setTimeout(() => generateFromText(txt), 60);
    } else if (entryMode) {
      // Soft demo so the canvas is never empty on first paint
      setTimeout(() => generateFromText(locale === "es" ? "Firma" : "Signature"), 80);
    }
    // Focus input on entry landings (desktop)
    if (entryMode && !txt) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [entryMode, locale]);

  useEffect(() => {
    paramsRef.current = { count, gravity, text };
  }, [count, gravity, text]);

  const generateFromText = useCallback((str: string) => {
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
    const ps: Particle[] = [];
    const baseHue = seed % 360;
    const nParticles = paramsRef.current.count;
    for (let i = 0; i < nParticles; i++) {
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: 1.4 + Math.random() * 2,
        hue: (baseHue + Math.random() * 40) % 360,
      });
    }
    particlesRef.current = ps;
    if (str.trim()) setHasSignature(true);
  }, []);

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

      ctx.fillStyle = "rgba(8, 12, 28, 0.2)";
      ctx.fillRect(0, 0, w, h);

      for (const a of attrs) {
        const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 36);
        grad.addColorStop(0, "rgba(190, 150, 255, 0.95)");
        grad.addColorStop(0.35, "rgba(120, 80, 255, 0.35)");
        grad.addColorStop(1, "rgba(80, 40, 200, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(a.x, a.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#f5f3ff";
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
        const hue = (p.hue + speed * 4) % 360;
        ctx.shadowColor = `hsl(${hue}, 85%, 62%)`;
        ctx.shadowBlur = 4 + speed * 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, 80%, 65%)`;
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
      /* user cancelled or share failed → fall through to clipboard */
    }
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
      {/* Input first on entry landings so the path is obvious */}
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
            {copied ? (typeof navigator !== "undefined" && "share" in navigator ? t.shared : t.copied) : t.share}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{t.help}</p>
      </div>
    </div>
  );
}
