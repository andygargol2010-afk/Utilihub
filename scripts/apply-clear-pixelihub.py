#!/usr/bin/env python3
"""Polish clear active layer + clear all for PixeliHub (roadmap item 19)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* clear-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) Labels
old_lab = '    layers: es ? "Capas" : "Layers", opacity: es ? "Opacidad" : "Opacity", add: es ? "Añadir" : "Add", clear: es ? "Limpiar" : "Clear",'
new_lab = '    layers: es ? "Capas" : "Layers", opacity: es ? "Opacidad" : "Opacity", add: es ? "Añadir" : "Add", clear: es ? "Limpiar capa" : "Clear layer", clearAll: es ? "Limpiar todo" : "Clear all",'
if old_lab not in t:
    raise SystemExit("labels not found")
t = t.replace(old_lab, new_lab, 1)

# 2) Helpers before return / finishOnboard — insert after onboardSteps block is fragile; put before finishOnboard
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

# 3) Replace simple clear button
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

# 4) Keyboard: Delete clears active layer when not typing in input
# Find keydown handler
if "onKey" in t and "keydown" in t:
    # try inject Delete handling into existing switch/if chain
    old_key_anchor = None
    for cand in [
        'if (e.key === "z" && (e.ctrlKey || e.metaKey))',
        "if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey))",
        'e.key === "z"',
    ]:
        if cand in t:
            old_key_anchor = cand
            break
    if old_key_anchor and "/* clear-key-v1 */" not in t:
        # insert before first key handling inside onKey
        idx = t.find("const onKey")
        if idx < 0:
            idx = t.find("function onKey")
        if idx >= 0:
            # find opening of handler body after onKey
            brace = t.find("{", idx)
            # skip if target is input
            insert = '''\n      /* clear-key-v1 */\n      const tag = (e.target as HTMLElement)?.tagName;\n      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;\n      if (e.key === "Delete" || e.key === "Backspace") {\n        if (e.shiftKey) { e.preventDefault(); clearAllLayers(); return; }\n        // plain Delete/Backspace only if not focused elsewhere — clear active\n        if (!(e.target as HTMLElement)?.closest?.("input, textarea, [contenteditable]")) {\n          e.preventDefault();\n          clearActiveLayer();\n          return;\n        }\n      }\n'''
            # Only insert if not already
            if "clear-key-v1" not in t:
                t = t[: brace + 1] + insert + t[brace + 1 :]

TARGET.write_text(t)
assert "clear-v1" in TARGET.read_text()
assert "clearAllLayers" in TARGET.read_text()
assert "clearActiveLayer" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
