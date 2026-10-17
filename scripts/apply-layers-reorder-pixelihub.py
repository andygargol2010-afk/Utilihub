#!/usr/bin/env python3
"""Add layer reorder + delete to PixeliHub (roadmap item 8)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* layers-reorder-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

old_block = '''          <div className="border-b border-zinc-700/60 p-2">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.layers}</p>
            {layers.map((_, i) => (
              <div key={i} className="mb-1 flex items-center gap-1">
                <button type="button" onClick={() => setActiveLayer(i)}
                  className={`flex-1 rounded px-2 py-1 text-left text-[11px] font-semibold ${activeLayer === i ? "bg-rose-500/20 text-rose-300" : "bg-zinc-800 text-zinc-400"}`}>
                  {es ? `Capa ${i + 1}` : `Layer ${i + 1}`}
                </button>
                <button type="button" className="px-1 text-[11px] text-zinc-500"
                  onClick={() => setLayerVisible((v) => { const n = v.slice(); n[i] = !n[i]; return n; })}>
                  {layerVisible[i] ? "◉" : "○"}
                </button>
              </div>
            ))}
            {layers.length < MAX_LAYERS ? (
              <button type="button" className="mt-1 w-full rounded bg-zinc-800 py-1 text-[11px] text-zinc-300"
                onClick={() => { pushHistory(layers); setLayers((L) => [...L, emptyLayer(size)]); }}>+ {t.add}</button>
            ) : null}
            <button type="button" className="mt-1 w-full rounded py-1 text-[11px] text-zinc-500"
              onClick={() => { pushHistory(layers); setLayers((L) => { const n = cloneLayers(L); n[activeLayer] = emptyLayer(size); return n; }); }}>{t.clear}</button>
          </div>'''

new_block = '''          <div className="border-b border-zinc-700/60 p-2">
            {/* layers-reorder-v1 */}
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.layers}</p>
            {layers.map((_, i) => (
              <div key={i} className="mb-1 flex items-center gap-0.5">
                <button type="button" onClick={() => setActiveLayer(i)}
                  className={`min-w-0 flex-1 rounded px-1.5 py-1 text-left text-[11px] font-semibold ${activeLayer === i ? "bg-rose-500/20 text-rose-300" : "bg-zinc-800 text-zinc-400"}`}>
                  {es ? `Capa ${i + 1}` : `Layer ${i + 1}`}
                </button>
                <button type="button" title={es ? "Visible" : "Visible"} className="px-1 text-[11px] text-zinc-500"
                  onClick={() => setLayerVisible((v) => { const n = v.slice(); n[i] = !n[i]; return n; })}>
                  {layerVisible[i] ? "◉" : "○"}
                </button>
                <button type="button" title="Up" disabled={i === 0}
                  className="px-0.5 text-[10px] text-zinc-500 hover:text-zinc-200 disabled:opacity-25"
                  onClick={() => {
                    if (i === 0) return;
                    pushHistory(layers);
                    setLayers((L) => {
                      const n = cloneLayers(L);
                      [n[i - 1], n[i]] = [n[i], n[i - 1]];
                      return n;
                    });
                    setLayerVisible((v) => {
                      const n = v.slice();
                      [n[i - 1], n[i]] = [n[i], n[i - 1]];
                      return n;
                    });
                    setActiveLayer((a) => (a === i ? i - 1 : a === i - 1 ? i : a));
                  }}>↑</button>
                <button type="button" title="Down" disabled={i >= layers.length - 1}
                  className="px-0.5 text-[10px] text-zinc-500 hover:text-zinc-200 disabled:opacity-25"
                  onClick={() => {
                    if (i >= layers.length - 1) return;
                    pushHistory(layers);
                    setLayers((L) => {
                      const n = cloneLayers(L);
                      [n[i + 1], n[i]] = [n[i], n[i + 1]];
                      return n;
                    });
                    setLayerVisible((v) => {
                      const n = v.slice();
                      [n[i + 1], n[i]] = [n[i], n[i + 1]];
                      return n;
                    });
                    setActiveLayer((a) => (a === i ? i + 1 : a === i + 1 ? i : a));
                  }}>↓</button>
                <button type="button" title={es ? "Eliminar" : "Delete"} disabled={layers.length <= 1}
                  className="px-0.5 text-[11px] text-zinc-500 hover:text-rose-400 disabled:opacity-25"
                  onClick={() => {
                    if (layers.length <= 1) return;
                    pushHistory(layers);
                    setLayers((L) => L.filter((_, j) => j !== i));
                    setLayerVisible((v) => {
                      const n = v.slice();
                      n.splice(i, 1);
                      while (n.length < MAX_LAYERS) n.push(true);
                      return n;
                    });
                    setActiveLayer((a) => {
                      if (a > i) return a - 1;
                      if (a === i) return Math.max(0, i - 1);
                      return a;
                    });
                  }}>×</button>
              </div>
            ))}
            {layers.length < MAX_LAYERS ? (
              <button type="button" className="mt-1 w-full rounded bg-zinc-800 py-1 text-[11px] text-zinc-300"
                onClick={() => { pushHistory(layers); setLayers((L) => [...L, emptyLayer(size)]); }}>+ {t.add}</button>
            ) : null}
            <button type="button" className="mt-1 w-full rounded py-1 text-[11px] text-zinc-500"
              onClick={() => { pushHistory(layers); setLayers((L) => { const n = cloneLayers(L); n[activeLayer] = emptyLayer(size); return n; }); }}>{t.clear}</button>
          </div>'''

if old_block not in t:
    raise SystemExit("layers block not found")
t = t.replace(old_block, new_block, 1)
TARGET.write_text(t)
assert "layers-reorder-v1" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
