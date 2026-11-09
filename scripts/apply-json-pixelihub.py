#!/usr/bin/env python3
"""Add JSON project export/import to PixeliHub (roadmap item 14)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* json-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) json file input ref
old_ref = '''  /* import-v1 */
  const fileInputRef = useRef<HTMLInputElement>(null);'''
new_ref = '''  /* import-v1 */
  const fileInputRef = useRef<HTMLInputElement>(null);
  /* json-v1 */
  const jsonInputRef = useRef<HTMLInputElement>(null);'''
if old_ref not in t:
    raise SystemExit("fileInputRef not found")
t = t.replace(old_ref, new_ref, 1)

# 2) labels
old_lab = '    export: "PNG", import: es ? "Importar" : "Import", copy: es ? "Copiar" : "Copy", share: es ? "Enlace" : "Link",'
new_lab = '    export: "PNG", import: es ? "Importar" : "Import", json: "JSON", copy: es ? "Copiar" : "Copy", share: es ? "Enlace" : "Link",'
if old_lab not in t:
    raise SystemExit("labels not found")
t = t.replace(old_lab, new_lab, 1)

# 3) functions before shareProject
old_share = "  const shareProject = async () => {"
if old_share not in t:
    raise SystemExit("shareProject not found")

json_fns = '''  const exportJson = () => {
    const payload = {
      v: 1,
      app: "pixelihub",
      size,
      layers,
      layerVisible: layerVisible.slice(0, layers.length),
      layerOpacity: layerOpacity.slice(0, layers.length),
      activeLayer,
    };
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pixelihub-${size}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setStatus("JSON");
  };

  const importJson = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as {
        v?: number;
        size?: number;
        layers?: string[][];
        layerVisible?: boolean[];
        layerOpacity?: number[];
        activeLayer?: number;
      };
      if (!data || data.v !== 1 || !data.size || !Array.isArray(data.layers) || !data.layers.length) {
        setStatus(es ? "JSON inválido" : "Invalid JSON");
        return;
      }
      const sizeN = data.size;
      if (![8, 16, 32, 64, 128, 256].includes(sizeN)) {
        setStatus(es ? "Tamaño inválido" : "Invalid size");
        return;
      }
      const nextLayers = data.layers.slice(0, 4).map((layer) => {
        const out = emptyLayer(sizeN);
        if (!Array.isArray(layer)) return out;
        const n = Math.min(layer.length, sizeN * sizeN);
        for (let i = 0; i < n; i++) {
          const c = layer[i];
          if (typeof c === "string" && (c === "" || /^#[0-9a-fA-F]{6}$/.test(c))) out[i] = c;
        }
        return out;
      });
      pushHistory(layers);
      setSize(sizeN);
      setLayers(nextLayers);
      setLayerVisible(() => {
        const vis = (data.layerVisible ?? []).slice(0, nextLayers.length);
        while (vis.length < MAX_LAYERS) vis.push(true);
        return vis.map(Boolean);
      });
      setLayerOpacity(() => {
        const op = (data.layerOpacity ?? []).slice(0, nextLayers.length);
        while (op.length < MAX_LAYERS) op.push(100);
        return op.map((n) => Math.max(0, Math.min(100, Number(n) || 100)));
      });
      setActiveLayer(Math.max(0, Math.min(nextLayers.length - 1, data.activeLayer ?? 0)));
      setStatus(es ? "JSON cargado" : "JSON loaded");
    } catch {
      setStatus(es ? "JSON inválido" : "Invalid JSON");
    }
  };

  const shareProject = async () => {'''

t = t.replace(old_share, json_fns, 1)

# 4) Toolbar buttons after share
old_share_btn = '''        <button type="button" onClick={() => void shareProject()} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↗ {t.share}</button>'''
new_share_btn = '''        <button type="button" onClick={() => void shareProject()} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↗ {t.share}</button>
        <button type="button" onClick={exportJson} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↓ {t.json}</button>
        <button type="button" onClick={() => jsonInputRef.current?.click()} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↑ {t.json}</button>
        <input
          ref={jsonInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void importJson(f);
            e.target.value = "";
          }}
        />'''
if old_share_btn not in t:
    raise SystemExit("share button not found")
t = t.replace(old_share_btn, new_share_btn, 1)

TARGET.write_text(t)
assert "json-v1" in TARGET.read_text()
assert "exportJson" in TARGET.read_text()
assert "importJson" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
