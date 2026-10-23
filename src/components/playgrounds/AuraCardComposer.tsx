import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Particle = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

type ColorScheme = "aurora" | "neon" | "sunset" | "cosmic" | "ocean" | "magma";

const SCHEMES: Record<ColorScheme, string[]> = {
  aurora: ["#00ffcc", "#66ffcc", "#00ccff", "#99ffee", "#33aaff"],
  neon: ["#ff00ff", "#00ffff", "#ff073a", "#39ff14", "#bc13fe"],
  sunset: ["#ff6b35", "#f7c59f", "#ef476f", "#ffd166", "#06d6a0"],
  cosmic: ["#9d4edd", "#c77dff", "#e0aaff", "#7b2cbf", "#5a189a"],
  ocean: ["#0077be", "#00a8e8", "#00c9ff", "#48cae4", "#90e0ef"],
  magma: ["#ff4500", "#ff6b35", "#f7b801", "#ff8c42", "#d00000"],
};

const RANDOM_QUOTES_EN = [
  "My personal aura",
  "Radiate your light",
  "Stay curious",
  "Create joy",
  "Glow on",
  "Breathe magic",
  "Own your vibe",
  "Shine bright",
  "Feel the energy",
];

const RANDOM_QUOTES_ES = [
  "Mi aura personal",
  "Irradiá tu luz",
  "Mantené la curiosidad",
  "Creá alegría",
  "Seguí brillando",
  "Respirá magia",
  "Apropiate de tu vibra",
  "Brillá fuerte",
  "Sentí la energía",
];

function shortId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).slice(0, 8);
}

export function AuraCardComposer({ locale = "en" }: { locale?: "en" | "es" }) {
  useEffect(() => {
    trackEvent("playground_open", { id: "aura-card-share", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [scheme, setScheme] = useState<ColorScheme>("aurora");
  const [density, setDensity] = useState(40);
  const [bloom, setBloom] = useState(12);
  const [bgGradient, setBgGradient] = useState(0);
  const [quote, setQuote] = useState(locale === "es" ? "Mi aura personal" : "My personal aura");
  const [exporting, setExporting] = useState(false);
  const animRef = useRef<number>(0);

  const colors = SCHEMES[scheme];

  const labels = {
    en: {
      scheme: "Color scheme",
      density: "Particle density",
      bloom: "Bloom",
      bg: "Background",
      quote: "Quote or name",
      export: "Download PNG",
      share: "Share",
      randomize: "Randomize",
      hint: "Design your aura card — particles swirl with trails around your text. URL is shareable.",
      schemes: { aurora: "Aurora", neon: "Neon", sunset: "Sunset", cosmic: "Cosmic", ocean: "Ocean", magma: "Magma" } as Record<ColorScheme, string>,
    },
    es: {
      scheme: "Esquema de color",
      density: "Densidad de partículas",
      bloom: "Bloom",
      bg: "Fondo",
      quote: "Cita o nombre",
      export: "Descargar PNG",
      share: "Compartir",
      randomize: "Aleatorizar",
      hint: "Diseñá tu tarjeta de aura — las partículas giran con estelas alrededor de tu texto. La URL es compartible.",
      schemes: { aurora: "Aurora", neon: "Neón", sunset: "Atardecer", cosmic: "Cósmico", ocean: "Océano", magma: "Magma" } as Record<ColorScheme, string>,
    },
  }[locale];

  // Restore from URL deep-link
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const c = p.get("c") as ColorScheme | null;
      const d = p.get("d");
      const b = p.get("b");
      const g = p.get("g");
      const q = p.get("q");
      if (c && SCHEMES[c]) setScheme(c);
      if (d && !isNaN(Number(d))) setDensity(Math.max(10, Math.min(80, Number(d))));
      if (b && !isNaN(Number(b))) setBloom(Math.max(0, Math.min(30, Number(b))));
      if (g && !isNaN(Number(g))) setBgGradient(Math.max(0, Math.min(10, Number(g))));
      if (q) setQuote(decodeURIComponent(q).slice(0, 120));
    } catch {}
  }, []);

  // Persist to URL (shareable deep-link + short id)
  useEffect(() => {
    const p = new URLSearchParams();
    p.set("c", scheme);
    p.set("d", String(density));
    p.set("b", String(bloom));
    p.set("g", String(bgGradient));
    if (quote.trim()) p.set("q", encodeURIComponent(quote.trim().slice(0, 120)));
    p.set("id", shortId(`${scheme}${density}${bloom}${bgGradient}${quote}`));
    const next = `${window.location.pathname}?${p.toString()}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [scheme, density, bloom, bgGradient, quote]);

  const spawnParticles = useCallback(() => {
    const count = Math.round(density * 0.8);
    particlesRef.current = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.22 + Math.random() * 0.28;
      const x = 0.5 + Math.cos(angle) * radius;
      const y = 0.5 + Math.sin(angle) * radius;
      particlesRef.current.push({
        x,
        y,
        prevX: x,
        prevY: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 1,
        maxLife: 2.5 + Math.random() * 3.5,
        size: 1.8 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }, [density, colors]);

  useEffect(() => {
    spawnParticles();
  }, [spawnParticles]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const t = Date.now() / 1000;

    // Background gradient
    const g = ctx.createLinearGradient(0, 0, w, h);
    const hue = (bgGradient * 60 + 200) % 360;
    g.addColorStop(0, `hsl(${hue}, 45%, 9%)`);
    g.addColorStop(1, `hsl(${(hue + 50) % 360}, 35%, 5%)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Pulsing soft aura halo
    const pulse = 0.75 + Math.sin(t * 1.8) * 0.25;
    const halo = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.48);
    halo.addColorStop(0, colors[0] + Math.round(0x44 * pulse).toString(16).padStart(2, "0"));
    halo.addColorStop(0.4, colors[1] + "22");
    halo.addColorStop(0.7, colors[2] + "10");
    halo.addColorStop(1, "transparent");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);

    // Card area
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.fillRect(w * 0.12, h * 0.18, w * 0.76, h * 0.64);

    // Particle trails + bloom
    particlesRef.current.forEach((p) => {
      const alpha = Math.max(0, p.life / p.maxLife);
      // Trail
      ctx.globalAlpha = alpha * 0.55;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(1, p.size * alpha * 0.45);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p.prevX * w, p.prevY * h);
      ctx.lineTo(p.x * w, p.y * h);
      ctx.stroke();
      // Head
      ctx.globalAlpha = alpha * 0.95;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = bloom * pulse * 0.85;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.size * alpha * 1.05, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Text overlay with scheme glow
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.min(w, h) * 0.055}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = colors[0];
    ctx.shadowBlur = 14 * pulse;
    const lines = quote.split("\n").slice(0, 3);
    const lineH = Math.min(w, h) * 0.075;
    lines.forEach((line, i) => {
      ctx.fillText(line.slice(0, 42), w / 2, h / 2 + (i - (lines.length - 1) / 2) * lineH);
    });
    ctx.shadowBlur = 0;
  }, [bloom, bgGradient, quote, colors]);

  useEffect(() => {
    const loop = () => {
      particlesRef.current = particlesRef.current
        .map((p) => {
          const prevX = p.x;
          const prevY = p.y;
          let nx = p.x + p.vx * 0.004;
          let ny = p.y + p.vy * 0.004;
          const dx = 0.5 - nx;
          const dy = 0.5 - ny;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
          // Attraction + tangential swirl
          p.vx += (dx / dist) * 0.016;
          p.vy += (dy / dist) * 0.016;
          p.vx += (-dy / dist) * 0.012;
          p.vy += (dx / dist) * 0.012;
          p.vx *= 0.972;
          p.vy *= 0.972;
          return {
            ...p,
            prevX,
            prevY,
            x: Math.max(0.04, Math.min(0.96, nx)),
            y: Math.max(0.04, Math.min(0.96, ny)),
            life: p.life - 0.0035,
          };
        })
        .filter((p) => p.life > 0);

      if (particlesRef.current.length < density * 0.55) {
        spawnParticles();
      }
      // Cap for mobile CWV
      if (particlesRef.current.length > 110) {
        particlesRef.current = particlesRef.current.slice(-95);
      }

      redraw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [redraw, spawnParticles, density]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const sizePx = Math.min(rect.width, Math.min(window.innerWidth - 24, 640));
      canvas.width = sizePx;
      canvas.height = sizePx * 0.75;
      redraw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [redraw]);

  const randomize = () => {
    const schemes = Object.keys(SCHEMES) as ColorScheme[];
    setScheme(schemes[Math.floor(Math.random() * schemes.length)]);
    setDensity(15 + Math.floor(Math.random() * 60));
    setBloom(4 + Math.floor(Math.random() * 24));
    setBgGradient(Math.floor(Math.random() * 11));
    const quotes = locale === "es" ? RANDOM_QUOTES_ES : RANDOM_QUOTES_EN;
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    trackEvent("randomize_click", { id: "aura-card-share", locale });
  };

  const exportPng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    try {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `aura-card-utilihub-${Date.now()}.png`;
      a.click();
      trackEvent("share_png", { id: "aura-card-share", locale });
    } finally {
      setTimeout(() => setExporting(false), 400);
    }
  };

  const share = async () => {
    trackEvent("share_click", { id: "aura-card-share", locale });
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!blob) return;
      const file = new File([blob], "aura-card.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Aura Card Composer UtiliHub",
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
      <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <label className="flex items-center gap-2">
          {labels.scheme}
          <select
            value={scheme}
            onChange={(e) => setScheme(e.target.value as ColorScheme)}
            className="rounded border bg-background px-2 py-1 text-foreground"
          >
            {Object.entries(labels.schemes).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          {labels.density}
          <input
            type="range"
            min={10}
            max={80}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-24 accent-cyan-500"
          />
          <span className="w-6 text-right">{density}</span>
        </label>
        <label className="flex items-center gap-2">
          {labels.bloom}
          <input
            type="range"
            min={0}
            max={30}
            value={bloom}
            onChange={(e) => setBloom(Number(e.target.value))}
            className="w-24 accent-pink-500"
          />
          <span className="w-6 text-right">{bloom}</span>
        </label>
        <label className="flex items-center gap-2">
          {labels.bg}
          <input
            type="range"
            min={0}
            max={10}
            value={bgGradient}
            onChange={(e) => setBgGradient(Number(e.target.value))}
            className="w-24 accent-violet-500"
          />
        </label>
        <button
          type="button"
          onClick={randomize}
          className="min-h-[36px] rounded-md border border-primary/50 bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20"
        >
          {labels.randomize}
        </button>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.quote}
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={2}
            maxLength={120}
            className="mt-1 w-full rounded border bg-background px-3 py-2 text-sm text-foreground"
            placeholder={locale === "es" ? "Escribí tu frase o nombre" : "Type your quote or name"}
          />
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportPng}
            disabled={exporting}
            className="min-h-[44px] rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {labels.export}
          </button>
          <button
            type="button"
            onClick={share}
            className="min-h-[44px] rounded-lg border border-primary px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10"
          >
            {labels.share}
          </button>
        </div>
      </div>
      <div className="relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-2xl border border-border/60 bg-black">
        <canvas ref={canvasRef} className="h-full w-full touch-none" aria-label={labels.hint} />
      </div>
      <p className="text-xs text-muted-foreground">{labels.hint}</p>
    </div>
  );
}
