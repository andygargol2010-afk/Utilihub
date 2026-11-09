#!/usr/bin/env python3
"""Polish clear active layer + clear all for PixeliHub (roadmap item 19)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* clear-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

old_lab = '    layers: es ? "Capas" : "Layers", opacity: es ? "Opacidad" : "Opacity", add: es ? "Añadir" : "Add", clear: es ? "Limpiar" : "Clear",'
new_lab = '    layers: es ? "Capas" : "Layers", opacity: es ? "Opacidad" : "Opacity", add: es ? "Añadir" : "Add", clear: es ? "Limpiar capa" : "Clear layer", clearAll: es ? "Limpiar todo" : "Clear all",'
if old_lab not in t:
    raise SystemExit("labels not found")
t = t.replace(old_lab, new_lab, 1)

old_finish = "  const finishOnboard = () => {"
if old_finish not in t:
    raise SystemExit("finishOnboard not found")

clear_fns = '''  /* clear-v1 */
  const layerHasPixels = (layer: string[] | undefined) =>
    !!layer && layer.some((c) => typeof c === "string" && c.length > 0);

  const clearActiveLayer = () => {
    const layer = layers[activeLayer];
    if (layerHasPixels(layer)) {
      const ok = window.confirm(es ? "¿Limpiar la capa activa?" : "Clear the active layer?");
      if (!ok) return;
    }
    pushHistory(layers);
    setLayers((L) => {
      const n = cloneLayers(L);
      n[activeLayer] = emptyLayer(size);
      return n;
    });
    setStatus(es ? "Capa limpia" : "Layer cleared");
  };

  const clearAllLayers = () => {
    const any = layers.some(layerHasPixels);
    if (any) {
      const ok = window.confirm(es ? "¿Limpiar todas las capas?" : "Clear all layers?");
      if (!ok) return;
    }
    pushHistory(layers);
    setLayers((L) => L.map(() => emptyLayer(size)));
    setStatus(es ? "Todo limpio" : "All cleared");
  };

  const finishOnboard = () => {'''

t = t.replace(old_finish, clear_fns, 1)

old_btn = '''            <button type="button" className="mt-1 w-full rounded py-1 text-[11px] text-zinc-500"
              onClick={() => { pushHistory(layers); setLayers((L) => { const n = cloneLayers(L); n[activeLayer] = emptyLayer(size); return n; }); }}>{t.clear}</button>'''

new_btn = '''            <div className="mt-1 flex gap-1">
              <button
                type="button"
                className="flex-1 rounded bg-zinc-800/80 py-1.5 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white"
                onClick={clearActiveLayer}
              >
                {t.clear}
              </button>
              <button
                type="button"
                className="flex-1 rounded bg-zinc-800/80 py-1.5 text-[11px] font-semibold text-zinc-400 hover:bg-rose-500/20 hover:text-rose-300"
                onClick={clearAllLayers}
              >
                {t.clearAll}
              </button>
            </div>'''

if old_btn not in t:
    raise SystemExit("clear button not found")
t = t.replace(old_btn, new_btn, 1)

TARGET.write_text(t)
assert "clear-v1" in TARGET.read_text()
assert "clearAllLayers" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
