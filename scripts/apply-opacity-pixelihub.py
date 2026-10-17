#!/usr/bin/env python3
"""Add per-layer opacity to PixeliHub (roadmap item 9)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* opacity-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) State
old_vis = '  const [layerVisible, setLayerVisible] = useState([true, true, true, true]);'
new_vis = '''  const [layerVisible, setLayerVisible] = useState([true, true, true, true]);
  /* opacity-v1 */
  const [layerOpacity, setLayerOpacity] = useState([100, 100, 100, 100]);'''
if old_vis not in t:
    raise SystemExit("layerVisible state not found")
t = t.replace(old_vis, new_vis, 1)

# 2) Label
old_lab = '    layers: es ? "Capas" : "Layers", add: es ? "Añadir" : "Add", clear: es ? "Limpiar" : "Clear",'
new_lab = '    layers: es ? "Capas" : "Layers", opacity: es ? "Opacidad" : "Opacity", add: es ? "Añadir" : "Add", clear: es ? "Limpiar" : "Clear",'
if old_lab not in t:
    raise SystemExit("labels not found")
t = t.replace(old_lab, new_lab, 1)

# 3) hex helper + compositeColor with alpha blend (bottom → top)
old_comp = '''  const compositeColor = useCallback((i: number) => {
    for (let li = layers.length - 1; li >= 0; li--) {
      if (!layerVisible[li]) continue;
      const c = layers[li]?.[i];
      if (c) return c;
    }
    return "";
  }, [layers, layerVisible]);'''

new_comp = '''  const compositeColor = useCallback((i: number) => {
    let r = 0, g = 0, b = 0, a = 0;
    for (let li = 0; li < layers.length; li++) {
      if (!layerVisible[li]) continue;
      const c = layers[li]?.[i];
      if (!c) continue;
      const oa = Math.max(0, Math.min(1, (layerOpacity[li] ?? 100) / 100));
      if (oa <= 0) continue;
      const m = /^#?([0-9a-fA-F]{6})$/.exec(c.trim());
      if (!m) continue;
      const n = parseInt(m[1], 16);
      const cr = (n >> 16) & 255, cg = (n >> 8) & 255, cb = n & 255;
      const outA = oa + a * (1 - oa);
      if (outA > 0) {
        r = (cr * oa + r * a * (1 - oa)) / outA;
        g = (cg * oa + g * a * (1 - oa)) / outA;
        b = (cb * oa + b * a * (1 - oa)) / outA;
      }
      a = outA;
    }
    if (a <= 0.001) return "";
    return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
  }, [layers, layerVisible, layerOpacity]);'''

if old_comp not in t:
    raise SystemExit("compositeColor not found")
t = t.replace(old_comp, new_comp, 1)

# 4) Eyedropper: sample topmost layer hex (not rgba composite)
old_eye = '''      if (tool === "eyedropper") {
        const c = compositeColor(y * size + x);
        if (c) setColor(c);
        return prev;
      }'''
new_eye = '''      if (tool === "eyedropper") {
        for (let li = layers.length - 1; li >= 0; li--) {
          if (!layerVisible[li]) continue;
          const c = layers[li]?.[y * size + x];
          if (c) { setColor(c); break; }
        }
        return prev;
      }'''
if old_eye not in t:
    raise SystemExit("eyedropper not found")
t = t.replace(old_eye, new_eye, 1)

# 5) Swap opacity on up
old_up_vis = '''                    setLayerVisible((v) => {
                      const n = v.slice();
                      [n[i - 1], n[i]] = [n[i], n[i - 1]];
                      return n;
                    });
                    setActiveLayer((a) => (a === i ? i - 1 : a === i - 1 ? i : a));'''
new_up_vis = '''                    setLayerVisible((v) => {
                      const n = v.slice();
                      [n[i - 1], n[i]] = [n[i], n[i - 1]];
                      return n;
                    });
                    setLayerOpacity((v) => {
                      const n = v.slice();
                      [n[i - 1], n[i]] = [n[i], n[i - 1]];
                      return n;
                    });
                    setActiveLayer((a) => (a === i ? i - 1 : a === i - 1 ? i : a));'''
if old_up_vis not in t:
    raise SystemExit("up visibility swap not found")
t = t.replace(old_up_vis, new_up_vis, 1)

# 6) Swap opacity on down
old_dn_vis = '''                    setLayerVisible((v) => {
                      const n = v.slice();
                      [n[i + 1], n[i]] = [n[i], n[i + 1]];
                      return n;
                    });
                    setActiveLayer((a) => (a === i ? i + 1 : a === i + 1 ? i : a));'''
new_dn_vis = '''                    setLayerVisible((v) => {
                      const n = v.slice();
                      [n[i + 1], n[i]] = [n[i], n[i + 1]];
                      return n;
                    });
                    setLayerOpacity((v) => {
                      const n = v.slice();
                      [n[i + 1], n[i]] = [n[i], n[i + 1]];
                      return n;
                    });
                    setActiveLayer((a) => (a === i ? i + 1 : a === i + 1 ? i : a));'''
if old_dn_vis not in t:
    raise SystemExit("down visibility swap not found")
t = t.replace(old_dn_vis, new_dn_vis, 1)

# 7) Delete opacity entry
old_del = '''                    setLayerVisible((v) => {
                      const n = v.slice();
                      n.splice(i, 1);
                      while (n.length < MAX_LAYERS) n.push(true);
                      return n;
                    });'''
new_del = '''                    setLayerVisible((v) => {
                      const n = v.slice();
                      n.splice(i, 1);
                      while (n.length < MAX_LAYERS) n.push(true);
                      return n;
                    });
                    setLayerOpacity((v) => {
                      const n = v.slice();
                      n.splice(i, 1);
                      while (n.length < MAX_LAYERS) n.push(100);
                      return n;
                    });'''
if old_del not in t:
    raise SystemExit("delete visibility not found")
t = t.replace(old_del, new_del, 1)

# 8) Add layer: ensure opacity slot (state already has 4 slots; new layers use index with default 100)
# When adding, if we had fewer layers, opacity[newIndex] should be 100 - already initialized to 100

# 9) Opacity slider under layer list (active layer)
old_clear = '''            <button type="button" className="mt-1 w-full rounded py-1 text-[11px] text-zinc-500"
              onClick={() => { pushHistory(layers); setLayers((L) => { const n = cloneLayers(L); n[activeLayer] = emptyLayer(size); return n; }); }}>{t.clear}</button>
          </div>'''

new_clear = '''            <label className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
              {t.opacity}
              <input
                type="range"
                min={0}
                max={100}
                value={layerOpacity[activeLayer] ?? 100}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLayerOpacity((op) => {
                    const n = op.slice();
                    while (n.length < MAX_LAYERS) n.push(100);
                    n[activeLayer] = val;
                    return n;
                  });
                }}
                className="h-1 flex-1 accent-rose-500"
              />
              <span className="w-8 font-mono text-zinc-400">{layerOpacity[activeLayer] ?? 100}%</span>
            </label>
            <button type="button" className="mt-1 w-full rounded py-1 text-[11px] text-zinc-500"
              onClick={() => { pushHistory(layers); setLayers((L) => { const n = cloneLayers(L); n[activeLayer] = emptyLayer(size); return n; }); }}>{t.clear}</button>
          </div>'''

if old_clear not in t:
    raise SystemExit("clear button block not found")
t = t.replace(old_clear, new_clear, 1)

TARGET.write_text(t)
assert "opacity-v1" in TARGET.read_text()
assert "layerOpacity" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
