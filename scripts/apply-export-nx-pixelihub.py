#!/usr/bin/env python3
"""Add Nx scaled PNG export to PixeliHub (roadmap item 12)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* export-nx-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) State near brushSize or zoom
old_brush = "  const [brushSize, setBrushSize] = useState(1);"
new_brush = '''  const [brushSize, setBrushSize] = useState(1);
  /* export-nx-v1 */
  const [exportScale, setExportScale] = useState(4);'''
if old_brush not in t:
    raise SystemExit("brushSize state not found")
t = t.replace(old_brush, new_brush, 1)

# 2) Replace exportPng body
old_export = '''  const exportPng = async (copy: boolean) => {
    const off = document.createElement("canvas");
    off.width = size; off.height = size;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    for (let i = 0; i < size * size; i++) {
      const c = compositeColor(i);
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(i % size, Math.floor(i / size), 1, 1);
    }
    if (copy) {
      try {
        const blob = await new Promise<Blob | null>((res) => off.toBlob(res, "image/png"));
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setStatus(es ? "Copiado" : "Copied");
        }
      } catch { setStatus("Error"); }
      return;
    }
    const a = document.createElement("a");
    a.href = off.toDataURL("image/png");
    a.download = `pixelihub-${size}.png`;
    a.click();
    setStatus("PNG");
  };'''

new_export = '''  const exportPng = async (copy: boolean) => {
    const s = Math.max(1, Math.min(32, exportScale));
    const off = document.createElement("canvas");
    off.width = size * s;
    off.height = size * s;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    for (let i = 0; i < size * size; i++) {
      const c = compositeColor(i);
      if (!c) continue;
      ctx.fillStyle = c;
      const x = (i % size) * s;
      const y = Math.floor(i / size) * s;
      ctx.fillRect(x, y, s, s);
    }
    if (copy) {
      try {
        const blob = await new Promise<Blob | null>((res) => off.toBlob(res, "image/png"));
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setStatus(es ? `Copiado ${s}×` : `Copied ${s}×`);
        }
      } catch { setStatus("Error"); }
      return;
    }
    const a = document.createElement("a");
    a.href = off.toDataURL("image/png");
    a.download = `pixelihub-${size}-${s}x.png`;
    a.click();
    setStatus(`PNG ${s}×`);
  };'''

if old_export not in t:
    raise SystemExit("exportPng not found")
t = t.replace(old_export, new_export, 1)

# 3) Toolbar: scale chips before export button
old_btn = '''        <button type="button" onClick={() => exportPng(false)} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↓ {t.export}</button>'''
new_btn = '''        <div className="flex items-center gap-0.5 rounded bg-zinc-800/80 p-0.5">
          {[1, 2, 4, 8, 16].map((n) => (
            <button
              key={n}
              type="button"
              title={`${n}×`}
              onClick={() => setExportScale(n)}
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${exportScale === n ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              {n}×
            </button>
          ))}
        </div>
        <button type="button" onClick={() => exportPng(false)} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↓ {t.export}</button>'''

if old_btn not in t:
    raise SystemExit("export button not found")
t = t.replace(old_btn, new_btn, 1)

TARGET.write_text(t)
assert "export-nx-v1" in TARGET.read_text()
assert "exportScale" in TARGET.read_text()
assert "size * s" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
