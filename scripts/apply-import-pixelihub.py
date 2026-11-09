#!/usr/bin/env python3
"""Add image import into active layer for PixeliHub (roadmap item 11)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* import-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) file input ref near canvasRef
old_ref = "  const canvasRef = useRef<HTMLCanvasElement>(null);"
new_ref = '''  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* import-v1 */
  const fileInputRef = useRef<HTMLInputElement>(null);'''
if old_ref not in t:
    raise SystemExit("canvasRef not found")
t = t.replace(old_ref, new_ref, 1)

# 2) labels
old_lab = '    export: "PNG", copy: es ? "Copiar" : "Copy", share: es ? "Enlace" : "Link",'
new_lab = '    export: "PNG", import: es ? "Importar" : "Import", copy: es ? "Copiar" : "Copy", share: es ? "Enlace" : "Link",'
if old_lab not in t:
    raise SystemExit("export labels not found")
t = t.replace(old_lab, new_lab, 1)

# 3) import function after exportPng
old_tools = "  const tools: { id: ToolId; icon: string; label: string }[] = ["
if old_tools not in t:
    raise SystemExit("tools anchor not found")

import_fn = '''  const importImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatus(es ? "No es imagen" : "Not an image");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const off = document.createElement("canvas");
        off.width = size;
        off.height = size;
        const ctx = off.getContext("2d");
        if (!ctx) return;
        ctx.imageSmoothingEnabled = false;
        // Cover-fit: scale to fill canvas, center crop
        const scale = Math.max(size / img.width, size / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = (size - dw) / 2;
        const dy = (size - dh) / 2;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, dx, dy, dw, dh);
        const data = ctx.getImageData(0, 0, size, size).data;
        const layer = emptyLayer(size);
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            const a = data[i + 3];
            if (a < 16) continue;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            layer[y * size + x] = hex;
          }
        }
        pushHistory(layers);
        setLayers((L) => {
          const next = cloneLayers(L);
          next[activeLayer] = layer;
          return next;
        });
        setStatus(es ? "Importado" : "Imported");
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setStatus("Error");
    };
    img.src = url;
  };

  const tools: { id: ToolId; icon: string; label: string }[] = ['''

t = t.replace(old_tools, import_fn, 1)

# 4) Toolbar button + hidden file input
old_btn = '''        <button type="button" onClick={() => exportPng(false)} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↓ {t.export}</button>
        <button type="button" onClick={() => exportPng(true)} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">{t.copy}</button>'''

new_btn = '''        <button type="button" onClick={() => exportPng(false)} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↓ {t.export}</button>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↑ {t.import}</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importImage(f);
            e.target.value = "";
          }}
        />
        <button type="button" onClick={() => exportPng(true)} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">{t.copy}</button>'''

if old_btn not in t:
    raise SystemExit("export buttons not found")
t = t.replace(old_btn, new_btn, 1)

TARGET.write_text(t)
assert "import-v1" in TARGET.read_text()
assert "importImage" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
