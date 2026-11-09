#!/usr/bin/env python3
"""Add hover brush/tool cursor preview on PixeliHub canvas (roadmap item 6)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* cursor-preview-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

old_redraw = '''  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const px = zoom;
    canvas.width = size * px;
    canvas.height = size * px;
    ctx.imageSmoothingEnabled = false;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#2a2a32" : "#1e1e24";
        ctx.fillRect(x * px, y * px, px, px);
        const c = compositeColor(y * size + x);
        if (c) { ctx.fillStyle = c; ctx.fillRect(x * px, y * px, px, px); }
      }
    }
  }, [size, zoom, compositeColor]);'''

new_redraw = '''  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const px = zoom;
    canvas.width = size * px;
    canvas.height = size * px;
    ctx.imageSmoothingEnabled = false;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#2a2a32" : "#1e1e24";
        ctx.fillRect(x * px, y * px, px, px);
        const c = compositeColor(y * size + x);
        if (c) { ctx.fillStyle = c; ctx.fillRect(x * px, y * px, px, px); }
      }
    }
    /* cursor-preview-v1 */
    if (hoverCell && tool !== "eyedropper") {
      const hx = hoverCell.x;
      const hy = hoverCell.y;
      if (tool === "pencil" || tool === "eraser") {
        const half = Math.floor((brushSize - 1) / 2);
        ctx.save();
        ctx.globalAlpha = tool === "eraser" ? 0.35 : 0.45;
        ctx.fillStyle = tool === "eraser" ? "#ffffff" : color;
        ctx.strokeStyle = tool === "eraser" ? "#f43f5e" : "#ffffff";
        ctx.lineWidth = Math.max(1, px * 0.12);
        for (let oy = 0; oy < brushSize; oy++) {
          for (let ox = 0; ox < brushSize; ox++) {
            const cx = hx - half + ox;
            const cy = hy - half + oy;
            if (cx < 0 || cy < 0 || cx >= size || cy >= size) continue;
            ctx.fillRect(cx * px, cy * px, px, px);
            ctx.strokeRect(cx * px + 0.5, cy * px + 0.5, px - 1, px - 1);
          }
        }
        ctx.restore();
      } else {
        ctx.save();
        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = Math.max(1, px * 0.15);
        ctx.strokeRect(hx * px + 0.5, hy * px + 0.5, px - 1, px - 1);
        ctx.restore();
      }
    }
  }, [size, zoom, compositeColor, hoverCell, tool, brushSize, color]);'''

if old_redraw not in t:
    raise SystemExit("redraw block not found")
t = t.replace(old_redraw, new_redraw, 1)

old_canvas = '''            <canvas ref={canvasRef} className="touch-none cursor-crosshair rounded-sm"'''
new_canvas = '''            <canvas ref={canvasRef} className={`touch-none rounded-sm ${tool === "eyedropper" ? "cursor-copy" : tool === "fill" ? "cursor-cell" : "cursor-none"}`}'''

if old_canvas not in t:
    raise SystemExit("canvas class not found")
t = t.replace(old_canvas, new_canvas, 1)

TARGET.write_text(t)
assert "cursor-preview-v1" in TARGET.read_text()
assert "cursor-none" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
