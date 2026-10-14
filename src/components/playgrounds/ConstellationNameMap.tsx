"use client";
// Constellation Name Map — export restored (max 10 chars)
import { useEffect, useRef, useState, useCallback } from "react";

type Locale = "en" | "es";
const MAX_CHARS = 10;

export function ConstellationNameMap({ locale }: { locale: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("UtiliHub".slice(0, MAX_CHARS));

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;
    ctx.fillStyle = "#050810";
    ctx.fillRect(0, 0, w, h);
    // sample glyph targets
    const off = document.createElement("canvas");
    off.width = Math.floor(w); off.height = Math.floor(h);
    const octx = off.getContext("2d");
    if (!octx || !text.trim()) return;
    octx.fillStyle = "#000"; octx.fillRect(0, 0, w, h);
    octx.fillStyle = "#fff";
    octx.font = `bold ${Math.min(h * 0.4, 88)}px system-ui, sans-serif`;
    octx.textAlign = "center"; octx.textBaseline = "middle";
    octx.fillText(text.trim().slice(0, MAX_CHARS), w / 2, h / 2);
    const data = octx.getImageData(0, 0, w, h).data;
    const pts: { x: number; y: number }[] = [];
    for (let y = 0; y < h; y += 6) {
      for (let x = 0; x < w; x += 6) {
        if (data[(y * w + x) * 4] > 120) pts.push({ x, y });
      }
    }
    // stars + lines
    ctx.fillStyle = "#e8f0ff";
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(180,200,255,0.35)";
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length - 1; i += 3) {
      const a = pts[i], b = pts[Math.min(i + 2, pts.length - 1)];
      if (Math.hypot(a.x - b.x, a.y - b.y) < 48) {
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  }, [text]);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  return (
    <div className="space-y-4">
      <input type="text" value={text} maxLength={MAX_CHARS} onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base" placeholder={locale === "es" ? "Tu nombre" : "Your name"} />
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-[#050810]">
        <canvas ref={canvasRef} className="h-[min(52vh,420px)] w-full" />
      </div>
    </div>
  );
}
