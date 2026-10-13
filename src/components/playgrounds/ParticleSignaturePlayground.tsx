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
    text: "Your signature text",
    placeholder: "Type a name or phrase...",
    count: "Particle count",
    gravity: "Gravity strength",
    generate: "Generate signature",
    share: "Copy share link",
    copied: "Copied!",
    help: "Type text to generate a unique particle signature. Particles orbit the seeded attractors. Click to add more. Share the link to show your signature.",
  },
  es: {
    text: "Texto de tu firma",
    placeholder: "Escribí un nombre o frase...",
    count: "Cantidad de partículas",
    gravity: "Fuerza de gravedad",
    generate: "Generar firma",
    share: "Copiar enlace",
    copied: "¡Copiado!",
    help: "Escribí texto para generar una firma única de partículas. Orbitan los atrayentes generados. Clic para agregar más. Compartí el enlace para mostrar tu firma.",
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

export function ParticleSignaturePlayground({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const attractorsRef = useRef<Attractor[]>([]);
  const nextId = useRef(1);
  const paramsRef = useRef({ count: 180, gravity: 1.0, text: "" });
  const [text, setText] = useState("");
  const [count, setCount] = useState(180);
  const [gravity, setGravity] = useState(1.0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txt = params.get("sig") || "";
    const c = parseInt(params.get("count") || "180", 10);
    const g = parseFloat(params.get("g") || "1.0");
    if (txt) setText(txt);
    if (!isNaN(c) && c >= 50 && c <= 400) setCount(c);
    if (!isNaN(g) && g >= 0.2 && g <= 2.5) setGravity(g);
    if (txt) generateFromText(txt);
  }, []);

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
      const r = 60 + (seed % 80);
      attrs.push({
        x: w / 2 + Math.cos(angle) * r,
        y: h / 2 + Math.sin(angle) * r,
        id: nextId.current++,
      });
    }
    attractorsRef.current = attrs;
    // reset particles with hue based on seed
    const ps: Particle[] = [];
    const baseHue = seed % 360;
    for (let i = 0; i < paramsRef.current.count; i++) {
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
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.scale(dpr, dpr);
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
    };

    canvas.addEventListener("pointerdown", onPointerDown);

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { gravity: g } = paramsRef.current;
      const attrs = attractorsRef.current;
      const ps = particlesRef.current;

      ctx.fillStyle = "rgba(8, 12, 28, 0.18)";
      ctx.fillRect(0, 0, w, h);

      for (const a of attrs) {
        const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 32);
        grad.addColorStop(0, "rgba(180, 140, 255, 0.95)");
        grad.addColorStop(0.4, "rgba(120, 80, 255, 0.4)");
        grad.addColorStop(1, "rgba(80, 40, 200, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(a.x, a.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#f5f3ff";
        ctx.fill();
      }

      const damp = 0.992;
      for (const p of ps) {
        let ax = 0, ay = 0;
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
        ctx.shadowBlur = 5 + speed * 1.5;
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
    if (rect.width > 0) initParticles(count, rect.width, rect.height);
  }, [count, initParticles]);

  const onGenerate = () => generateFromText(text);

  const share = async () => {
    const params = new URLSearchParams();
    if (text) params.set("sig", text);
    params.set("count", String(count));
    params.set("g", gravity.toFixed(2));
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
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#080c1c] shadow-inner">
        <canvas ref={canvasRef} className="h-[420px] w-full touch-none sm:h-[520px]" style={{ display: "block" }} />
      </div>
      <div className="grid gap-4 rounded-2xl border border-border/60 bg-surface/40 p-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.text}</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.placeholder}
            className="rounded-lg border border-border bg-background px-3 py-2"
            maxLength={40}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{t.count} ({count})</span>
            <input type="range" min={60} max={350} step={10} value={count} onChange={(e) => setCount(Number(e.target.value))} className="accent-primary" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{t.gravity} ({gravity.toFixed(2)})</span>
            <input type="range" min={0.3} max={2.2} step={0.05} value={gravity} onChange={(e) => setGravity(Number(e.target.value))} className="accent-primary" />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onGenerate} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            {t.generate}
          </button>
          <button type="button" onClick={share} className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold">
            {copied ? t.copied : t.share}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{t.help}</p>
      </div>
    </div>
  );
}
