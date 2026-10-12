import { useCallback, useEffect, useRef, useState } from "react";

type Star = { id: number; x: number; y: number; name?: string };
type Connection = [number, number];

type Preset = {
  id: string;
  nameEn: string;
  nameEs: string;
  stars: { x: number; y: number; name?: string }[];
  connections: Connection[];
};

const PRESETS: Preset[] = [
  {
    id: "orion",
    nameEn: "Orion",
    nameEs: "Orión",
    stars: [
      { x: 0.5, y: 0.15, name: "Betelgeuse" },
      { x: 0.35, y: 0.35 },
      { x: 0.65, y: 0.35 },
      { x: 0.5, y: 0.5, name: "Alnilam" },
      { x: 0.4, y: 0.55 },
      { x: 0.6, y: 0.55 },
      { x: 0.45, y: 0.75 },
      { x: 0.55, y: 0.75 },
      { x: 0.3, y: 0.85, name: "Rigel" },
      { x: 0.7, y: 0.85 },
    ],
    connections: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [3, 5],
      [4, 6],
      [5, 7],
      [6, 8],
      [7, 9],
    ],
  },
  {
    id: "dipper",
    nameEn: "Big Dipper",
    nameEs: "Osa Mayor",
    stars: [
      { x: 0.2, y: 0.6 },
      { x: 0.35, y: 0.45 },
      { x: 0.5, y: 0.4 },
      { x: 0.65, y: 0.5 },
      { x: 0.75, y: 0.35 },
      { x: 0.85, y: 0.45 },
      { x: 0.9, y: 0.3 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    id: "cassiopeia",
    nameEn: "Cassiopeia",
    nameEs: "Casiopea",
    stars: [
      { x: 0.2, y: 0.4 },
      { x: 0.35, y: 0.6 },
      { x: 0.5, y: 0.35 },
      { x: 0.65, y: 0.55 },
      { x: 0.8, y: 0.3 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
];

function encodeState(stars: Star[], connections: Connection[]): string {
  const payload = {
    s: stars.map((st) => [Math.round(st.x * 1000) / 1000, Math.round(st.y * 1000) / 1000]),
    c: connections,
  };
  return btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeState(hash: string): { stars: Star[]; connections: Connection[] } | null {
  try {
    let b = hash.replace(/-/g, "+").replace(/_/g, "/");
    while (b.length % 4) b += "=";
    const payload = JSON.parse(atob(b));
    if (!payload.s || !Array.isArray(payload.s)) return null;
    const stars: Star[] = payload.s.map((p: number[], i: number) => ({
      id: i,
      x: p[0],
      y: p[1],
    }));
    const connections: Connection[] = Array.isArray(payload.c) ? payload.c : [];
    return { stars, connections };
  } catch {
    return null;
  }
}

export function ConstellationStudio({ locale = "en" }: { locale?: "en" | "es" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [mode, setMode] = useState<"drag" | "connect">("drag");
  const [selected, setSelected] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const labels = {
    en: {
      drag: "Drag stars",
      connect: "Connect",
      clear: "Clear",
      share: "Copy share link",
      copied: "Copied!",
      presets: "Myth presets",
      addStar: "Click to add star",
    },
    es: {
      drag: "Arrastrar estrellas",
      connect: "Conectar",
      clear: "Limpiar",
      share: "Copiar enlace",
      copied: "¡Copiado!",
      presets: "Presets mitológicos",
      addStar: "Clic para añadir estrella",
    },
  }[locale];

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const h = params.get("c");
    if (h) {
      const decoded = decodeState(h);
      if (decoded) {
        setStars(decoded.stars);
        setConnections(decoded.connections);
      }
    } else if (stars.length === 0) {
      // Default empty or small demo
      setStars([
        { id: 0, x: 0.4, y: 0.4 },
        { id: 1, x: 0.6, y: 0.5 },
      ]);
    }
  }, []);

  // Update share URL
  useEffect(() => {
    if (stars.length === 0) {
      setShareUrl(window.location.pathname);
      return;
    }
    const encoded = encodeState(stars, connections);
    const url = `${window.location.pathname}?c=${encoded}`;
    setShareUrl(url);
    // Update history without reload
    window.history.replaceState(null, "", url);
  }, [stars, connections]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Sky background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#0a0a1a");
    grad.addColorStop(1, "#1a1a3a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Stars background dots
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    for (let i = 0; i < 80; i++) {
      const x = (i * 37) % w;
      const y = (i * 53) % h;
      ctx.beginPath();
      ctx.arc(x, y, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Connections
    ctx.strokeStyle = "rgba(180,200,255,0.7)";
    ctx.lineWidth = 1.5;
    connections.forEach(([a, b]) => {
      const sa = stars.find((s) => s.id === a);
      const sb = stars.find((s) => s.id === b);
      if (!sa || !sb) return;
      ctx.beginPath();
      ctx.moveTo(sa.x * w, sa.y * h);
      ctx.lineTo(sb.x * w, sb.y * h);
      ctx.stroke();
    });

    // Stars
    stars.forEach((star) => {
      const x = star.x * w;
      const y = star.y * h;
      ctx.beginPath();
      ctx.arc(x, y, selected === star.id ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle = selected === star.id ? "#fbbf24" : "#fff";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 1;
      ctx.stroke();
      if (star.name) {
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "11px sans-serif";
        ctx.fillText(star.name, x + 8, y - 6);
      }
    });
  }, [stars, connections, selected]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = Math.min(480, window.innerHeight * 0.55);
        draw();
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  };

  const findStarAt = (pos: { x: number; y: number }) => {
    const canvas = canvasRef.current!;
    const threshold = 20 / canvas.width;
    return stars.find(
      (s) => Math.hypot(s.x - pos.x, s.y - pos.y) < threshold,
    );
  };

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPos(e);
    const hit = findStarAt(pos);
    if (mode === "connect" && hit) {
      if (selected === null) {
        setSelected(hit.id);
      } else if (selected !== hit.id) {
        const exists = connections.some(
          ([a, b]) => (a === selected && b === hit.id) || (a === hit.id && b === selected),
        );
        if (!exists) {
          setConnections((c) => [...c, [selected, hit.id]]);
        }
        setSelected(null);
      }
    } else if (hit) {
      setDragging(hit.id);
      setSelected(hit.id);
    } else if (mode === "drag") {
      // Add new star
      const id = stars.length ? Math.max(...stars.map((s) => s.id)) + 1 : 0;
      setStars((s) => [...s, { id, x: pos.x, y: pos.y }]);
    }
  };

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragging === null) return;
    e.preventDefault();
    const pos = getPos(e);
    setStars((prev) =>
      prev.map((s) => (s.id === dragging ? { ...s, x: Math.max(0.02, Math.min(0.98, pos.x)), y: Math.max(0.02, Math.min(0.98, pos.y)) } : s)),
    );
  };

  const onPointerUp = () => {
    setDragging(null);
  };

  const loadPreset = (preset: Preset) => {
    const newStars: Star[] = preset.stars.map((s, i) => ({ ...s, id: i }));
    setStars(newStars);
    setConnections(preset.connections);
    setSelected(null);
  };

  const clearAll = () => {
    setStars([]);
    setConnections([]);
    setSelected(null);
  };

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("drag")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            mode === "drag" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {labels.drag}
        </button>
        <button
          type="button"
          onClick={() => setMode("connect")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            mode === "connect" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {labels.connect}
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground"
        >
          {labels.clear}
        </button>
        <button
          type="button"
          onClick={copyShare}
          className="ml-auto rounded-full bg-sky-600 px-4 py-1.5 text-sm font-medium text-white"
        >
          {copied ? labels.copied : labels.share}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950">
        <canvas
          ref={canvasRef}
          className="w-full touch-none cursor-crosshair"
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        />
        <p className="absolute bottom-2 left-3 text-xs text-slate-400">
          {mode === "drag" ? labels.addStar : labels.connect}
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {labels.presets}
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPreset(p)}
              className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              {locale === "es" ? p.nameEs : p.nameEn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
