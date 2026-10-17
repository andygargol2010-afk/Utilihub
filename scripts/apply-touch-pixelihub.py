#!/usr/bin/env python3
"""Improve touch drawing on PixeliHub (roadmap item 17)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* touch-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

old_snap = "  const snapshot = useRef<string[][] | null>(null);"
new_snap = '''  const snapshot = useRef<string[][] | null>(null);
  /* touch-v1 */
  const lastPaintCell = useRef<{ x: number; y: number } | null>(null);'''
if old_snap not in t:
    raise SystemExit("snapshot ref not found")
t = t.replace(old_snap, new_snap, 1)

old_handlers = '''  const onPointerDown = (e: React.PointerEvent) => {
    const cell = cellFromEvent(e);
    if (!cell) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    startCell.current = cell;
    snapshot.current = cloneLayers(layers);
    if (tool === "pencil" || tool === "eraser" || tool === "fill" || tool === "eyedropper") applyTool(cell.x, cell.y);
    else applyTool(cell.x, cell.y, cell.x, cell.y);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const cell = cellFromEvent(e);
    setHoverCell(cell);
    if (!drawing.current || !cell) return;
    if (tool === "pencil" || tool === "eraser") applyTool(cell.x, cell.y);
    else if (tool === "line" || tool === "rect" || tool === "circle") applyTool(cell.x, cell.y, cell.x, cell.y);
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    // One stroke = one undo: store state from before the stroke began.
    if (tool !== "eyedropper" && tool !== "fill" && snapshot.current) {
      pushHistory(snapshot.current);
    }
    startCell.current = null;
    snapshot.current = null;
  };'''

new_handlers = '''  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") e.preventDefault();
    const cell = cellFromEvent(e);
    if (!cell) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    startCell.current = cell;
    lastPaintCell.current = cell;
    snapshot.current = cloneLayers(layers);
    if (tool === "pencil" || tool === "eraser" || tool === "fill" || tool === "eyedropper") applyTool(cell.x, cell.y);
    else applyTool(cell.x, cell.y, cell.x, cell.y);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (drawing.current && e.pointerType === "touch") e.preventDefault();
    const cell = cellFromEvent(e);
    setHoverCell(cell);
    if (!drawing.current || !cell) return;
    if (tool === "pencil" || tool === "eraser") {
      const prev = lastPaintCell.current;
      if (prev && (prev.x !== cell.x || prev.y !== cell.y)) {
        setLayers((prevLayers) => {
          const next = cloneLayers(prevLayers);
          const data = next[activeLayer];
          if (!data) return prevLayers;
          const col = tool === "eraser" ? "" : color;
          plotLine(prev.x, prev.y, cell.x, cell.y, (px, py) => paintAt(data, px, py, col));
          return next;
        });
      } else {
        applyTool(cell.x, cell.y);
      }
      lastPaintCell.current = cell;
    } else if (tool === "line" || tool === "rect" || tool === "circle") {
      applyTool(cell.x, cell.y, cell.x, cell.y);
    }
  };

  const onPointerUp = (e?: React.PointerEvent) => {
    if (e && drawing.current) {
      try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch { /* ignore */ }
    }
    if (!drawing.current) return;
    drawing.current = false;
    if (tool !== "eyedropper" && tool !== "fill" && snapshot.current) {
      pushHistory(snapshot.current);
    }
    startCell.current = null;
    snapshot.current = null;
    lastPaintCell.current = null;
  };'''

if old_handlers not in t:
    raise SystemExit("pointer handlers not found")
t = t.replace(old_handlers, new_handlers, 1)

old_canvas_block = '''          <div className="flex h-full min-h-[280px] items-center justify-center overflow-auto p-3"
            onWheel={(e) => { e.preventDefault(); setZoom((z) => Math.min(32, Math.max(4, z + (e.deltaY > 0 ? -1 : 1)))); }}>
            <canvas ref={canvasRef} className={`touch-none rounded-sm ${tool === "eyedropper" ? "cursor-copy" : tool === "fill" ? "cursor-cell" : "cursor-none"}`}
              style={{ imageRendering: "pixelated" }}
              onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
              onPointerLeave={() => { onPointerUp(); setHoverCell(null); }} />
          </div>'''

new_canvas_block = '''          <div
            className="flex h-full min-h-[280px] items-center justify-center overflow-auto p-3 touch-pan-y md:touch-auto"
            style={{ WebkitUserSelect: "none", userSelect: "none" }}
            onWheel={(e) => { e.preventDefault(); setZoom((z) => Math.min(32, Math.max(4, z + (e.deltaY > 0 ? -1 : 1)))); }}
          >
            <canvas
              ref={canvasRef}
              className={`touch-none select-none rounded-sm ${tool === "eyedropper" ? "cursor-copy" : tool === "fill" ? "cursor-cell" : "cursor-none"}`}
              style={{ imageRendering: "pixelated", touchAction: "none", WebkitUserSelect: "none", userSelect: "none" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onContextMenu={(e) => e.preventDefault()}
              onPointerLeave={() => { onPointerUp(); setHoverCell(null); }}
            />
          </div>'''

if old_canvas_block not in t:
    raise SystemExit("canvas block not found")
t = t.replace(old_canvas_block, new_canvas_block, 1)

old_tool_btn = 'className={`flex size-9 shrink-0 items-center justify-center rounded-md text-base ${tool === tb.id ? "bg-rose-500/90 text-white shadow" : "text-zinc-400 hover:bg-zinc-800"}`}'
new_tool_btn = 'className={`flex size-10 shrink-0 items-center justify-center rounded-md text-base md:size-9 ${tool === tb.id ? "bg-rose-500/90 text-white shadow" : "text-zinc-400 hover:bg-zinc-800"}`}'
if old_tool_btn in t:
    t = t.replace(old_tool_btn, new_tool_btn, 1)

TARGET.write_text(t)
assert "touch-v1" in TARGET.read_text()
assert "lastPaintCell" in TARGET.read_text()
assert "onPointerCancel" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
