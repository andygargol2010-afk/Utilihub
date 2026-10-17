#!/usr/bin/env python3
"""Add spritesheet PNG export (layers as frames) to PixeliHub (roadmap item 15)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* spritesheet-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) label
old_lab = '    export: "PNG", import: es ? "Importar" : "Import", json: "JSON", copy: es ? "Copiar" : "Copy", share: es ? "Enlace" : "Link",'
new_lab = '    export: "PNG", import: es ? "Importar" : "Import", json: "JSON", sheet: es ? "Hoja" : "Sheet", copy: es ? "Copiar" : "Copy", share: es ? "Enlace" : "Link",'
if old_lab not in t:
    raise SystemExit("labels not found")
t = t.replace(old_lab, new_lab, 1)

# 2) function after exportJson — find exportJson end by anchoring on importJson
old_import_json = "  const importJson = async (file: File) => {"
if old_import_json not in t:
    raise SystemExit("importJson not found")

sheet_fn = '''  /* spritesheet-v1 */
  const exportSpritesheet = () => {
    const s = Math.max(1, Math.min(32, exportScale));
    const frames = layers.length ? layers : [emptyLayer(size)];
    const cols = frames.length;
    const off = document.createElement("canvas");
    off.width = size * s * cols;
    off.height = size * s;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    for (let fi = 0; fi < frames.length; fi++) {
      const layer = frames[fi];
      const ox = fi * size * s;
      for (let i = 0; i < size * size; i++) {
        const c = layer[i];
        if (!c) continue;
        ctx.fillStyle = c;
        const x = ox + (i % size) * s;
        const y = Math.floor(i / size) * s;
        ctx.fillRect(x, y, s, s);
      }
    }
    const a = document.createElement("a");
    a.href = off.toDataURL("image/png");
    a.download = `pixelihub-${size}-sheet-${cols}f-${s}x.png`;
    a.click();
    setStatus(es ? `Hoja ${cols}f ${s}×` : `Sheet ${cols}f ${s}×`);
  };

  const importJson = async (file: File) => {'''

t = t.replace(old_import_json, sheet_fn, 1)

# 3) button after ↓ JSON export
old_btn = '''        <button type="button" onClick={exportJson} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↓ {t.json}</button>'''
new_btn = '''        <button type="button" onClick={exportJson} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↓ {t.json}</button>
        <button type="button" onClick={exportSpritesheet} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">▦ {t.sheet}</button>'''
if old_btn not in t:
    raise SystemExit("json export button not found")
t = t.replace(old_btn, new_btn, 1)

TARGET.write_text(t)
assert "spritesheet-v1" in TARGET.read_text()
assert "exportSpritesheet" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
