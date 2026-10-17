#!/usr/bin/env python3
"""Restore PixelArtStudio from blob 1b87a106 and add brush size 1-8."""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
BLOB = "1b87a106d9edd1b81316bc80abb5e4c82a7cd031"

subprocess.check_call(
    ["git", "show", f"{BLOB}:src/components/general/PixelArtStudio.tsx"],
    cwd=ROOT,
    stdout=open(TARGET, "w"),
)
t = TARGET.read_text()
if "PIXELIHUB" not in t:
    raise SystemExit("restore failed: no PIXELIHUB")

if "brushSize" not in t:
    t = t.replace(
        "  const [zoom, setZoom] = useState(12);\n",
        "  const [zoom, setZoom] = useState(12);\n  const [brushSize, setBrushSize] = useState(1);\n",
    )
    t = t.replace(
        '    size: es ? "Tamaño" : "Size", zoom: "Zoom", color: es ? "Color" : "Color",\n',
        '    size: es ? "Tamaño" : "Size", zoom: "Zoom", brush: es ? "Grosor" : "Brush", color: es ? "Color" : "Color",\n',
    )
    old_paint = """  const paintAt = (data: string[], x: number, y: number, col: string) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    data[y * size + x] = col;
    const mir = (mx: number, my: number) => {
      if (mx >= 0 && my >= 0 && mx < size && my < size) data[my * size + mx] = col;
    };
    if (symmetry === "x" || symmetry === "xy") mir(size - 1 - x, y);
    if (symmetry === "y" || symmetry === "xy") mir(x, size - 1 - y);
    if (symmetry === "xy") mir(size - 1 - x, size - 1 - y);
  };"""
    new_paint = """  const putPixel = (data: string[], x: number, y: number, col: string) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    data[y * size + x] = col;
    const mir = (mx: number, my: number) => {
      if (mx >= 0 && my >= 0 && mx < size && my < size) data[my * size + mx] = col;
    };
    if (symmetry === "x" || symmetry === "xy") mir(size - 1 - x, y);
    if (symmetry === "y" || symmetry === "xy") mir(x, size - 1 - y);
    if (symmetry === "xy") mir(size - 1 - x, size - 1 - y);
  };

  const paintAt = (data: string[], x: number, y: number, col: string) => {
    const half = Math.floor((brushSize - 1) / 2);
    for (let oy = 0; oy < brushSize; oy++) {
      for (let ox = 0; ox < brushSize; ox++) {
        putPixel(data, x - half + ox, y - half + oy, col);
      }
    }
  };"""
    if old_paint not in t:
        raise SystemExit("paintAt block not found")
    t = t.replace(old_paint, new_paint)
    t = t.replace(
        "const plot = (px: number, py: number) => paintAt(data, px, py, col);",
        "const plot = (px: number, py: number) => putPixel(data, px, py, col);",
    )
    old_ui = """            <label className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
              {t.zoom}
              <input type="range" min={4} max={32} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="h-1 flex-1 accent-rose-500" />
              <span className="w-6 font-mono text-zinc-400">{zoom}</span>
            </label>
          </div>"""
    new_ui = """            <label className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
              {t.zoom}
              <input type="range" min={4} max={32} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="h-1 flex-1 accent-rose-500" />
              <span className="w-6 font-mono text-zinc-400">{zoom}</span>
            </label>
            <label className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
              {t.brush}
              <input type="range" min={1} max={8} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="h-1 flex-1 accent-rose-500" />
              <span className="w-6 font-mono text-zinc-400">{brushSize}px</span>
            </label>
            <div className="mt-1 flex flex-wrap gap-1">
              {[1, 2, 3, 4, 6, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBrushSize(n)}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${brushSize === n ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>"""
    if old_ui not in t:
        raise SystemExit("ui block not found")
    t = t.replace(old_ui, new_ui)
    TARGET.write_text(t)
    print("patched", len(t))
else:
    print("already has brushSize")

final = TARGET.read_text()
assert "brushSize" in final and "PIXELIHUB" in final
print("ok", TARGET.stat().st_size)
