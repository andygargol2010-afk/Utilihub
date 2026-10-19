#!/usr/bin/env python3
"""Add starter example sprites to PixeliHub (roadmap item 22)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"

t = TARGET.read_text(encoding="utf-8")
if "/* examples-v1 */" in t:
    print("examples already present")
    raise SystemExit(0)

EXAMPLES_FN = r'''
/* examples-v1 */
function exampleLayers(id: string, size: number): string[][] {
  const layer = emptyLayer(size);
  const set = (x: number, y: number, c: string) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    layer[y * size + x] = c;
  };
  const mid = Math.floor(size / 2);
  const s = size / 32;
  if (id === "heart") {
    const pts: [number, number][] = [
      [8, 6], [9, 5], [10, 5], [11, 6], [12, 7], [13, 8], [14, 9], [15, 10],
      [16, 10], [17, 9], [18, 8], [19, 7], [20, 6], [21, 5], [22, 5], [23, 6],
      [23, 7], [22, 8], [21, 10], [20, 12], [18, 15], [16, 18], [15, 20], [14, 18],
      [12, 15], [10, 12], [9, 10], [8, 8], [8, 7],
    ];
    for (const [x, y] of pts) set(Math.floor(x * s), Math.floor(y * s), "#e94560");
  } else if (id === "smiley") {
    const r = Math.floor(size * 0.35);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - mid, dy = y - mid;
        if (dx * dx + dy * dy <= r * r) set(x, y, "#feca57");
      }
    }
    const eye = Math.max(1, Math.floor(size / 16));
    for (let dy = -eye; dy <= eye; dy++) {
      for (let dx = -eye; dx <= eye; dx++) {
        set(mid - Math.floor(size / 6) + dx, mid - Math.floor(size / 8) + dy, "#1a1a2e");
        set(mid + Math.floor(size / 6) + dx, mid - Math.floor(size / 8) + dy, "#1a1a2e");
      }
    }
    for (let a = 0.25; a < Math.PI - 0.25; a += 0.08) {
      set(mid + Math.floor(Math.cos(a) * r * 0.55), mid + Math.floor(Math.sin(a) * r * 0.55), "#1a1a2e");
    }
  } else if (id === "sword") {
    for (let y = Math.floor(4 * s); y < Math.floor(22 * s); y++) set(mid, y, "#c8d6e5");
    for (let x = mid - Math.floor(3 * s); x <= mid + Math.floor(3 * s); x++) set(x, Math.floor(22 * s), "#ab5236");
    set(mid, Math.floor(3 * s), "#fff1e8");
    set(mid - 1, Math.floor(4 * s), "#c8d6e5");
    set(mid + 1, Math.floor(4 * s), "#c8d6e5");
  } else if (id === "tree") {
    for (let y = Math.floor(18 * s); y < Math.floor(28 * s); y++) {
      for (let x = mid - Math.floor(1 * s); x <= mid + Math.floor(1 * s); x++) set(x, y, "#6b4226");
    }
    for (let y = Math.floor(6 * s); y < Math.floor(18 * s); y++) {
      const w = Math.floor((18 * s - y) * 0.45) + Math.floor(2 * s);
      for (let x = mid - w; x <= mid + w; x++) set(x, y, "#10ac84");
    }
  } else if (id === "letter") {
    for (let y = Math.floor(6 * s); y < Math.floor(26 * s); y++) {
      set(Math.floor(10 * s), y, "#54a0ff");
      set(Math.floor(11 * s), y, "#54a0ff");
    }
    for (let x = Math.floor(10 * s); x < Math.floor(20 * s); x++) {
      set(x, Math.floor(6 * s), "#54a0ff");
      set(x, Math.floor(7 * s), "#54a0ff");
      set(x, Math.floor(14 * s), "#54a0ff");
      set(x, Math.floor(15 * s), "#54a0ff");
    }
    for (let y = Math.floor(6 * s); y <= Math.floor(15 * s); y++) {
      set(Math.floor(19 * s), y, "#54a0ff");
      set(Math.floor(20 * s), y, "#54a0ff");
    }
  } else {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if ((x + y) % 2 === 0) set(x, y, "#e94560");
      }
    }
  }
  return [layer, emptyLayer(size)];
}

'''

anchor = "function cloneLayers(layers: string[][]) { return layers.map((l) => l.slice()); }\n"
if anchor not in t:
    raise SystemExit("cloneLayers anchor not found")
t = t.replace(anchor, anchor + "\n" + EXAMPLES_FN, 1)

old_labels = '    sym: es ? "Simetr\u00eda" : "Symmetry", none: es ? "No" : "None",'
# handle both escaped and real
if old_labels not in t:
    old_labels = '    sym: es ? "Simetría" : "Symmetry", none: es ? "No" : "None",'
if old_labels not in t:
    raise SystemExit("labels anchor not found")
new_labels = old_labels + '\n    examples: es ? "Ejemplos" : "Examples",'
t = t.replace(old_labels, new_labels, 1)

load_fn = '''
  const loadExample = (id: string) => {
    pushHistory(layers);
    const n = size >= 32 ? size : 32;
    if (n !== size) setSize(n);
    setLayers(exampleLayers(id, n));
    setActiveLayer(0);
    setStatus(es ? `Ejemplo: ${id}` : `Example: ${id}`);
  };

'''

if "const loadExample" not in t:
    idx = t.find("  const undo")
    if idx < 0:
        raise SystemExit("undo idx not found")
    t = t[:idx] + load_fn + t[idx:]

old_ui = '''            <p className="mt-2 text-[10px] text-zinc-600">{t.tip}</p>
            <p className="mt-1 font-mono text-[9px] leading-relaxed text-zinc-500">'''
new_ui = '''            <p className="mb-1.5 mt-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.examples}</p>
            <div className="mb-2 flex flex-wrap gap-1">
              {(["heart", "smiley", "sword", "tree", "letter"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => loadExample(id)}
                  className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold capitalize text-zinc-300 hover:bg-rose-500/30 hover:text-rose-100"
                >
                  {id === "heart" ? (es ? "coraz\u00f3n" : "heart")
                    : id === "smiley" ? (es ? "cara" : "smiley")
                    : id === "sword" ? (es ? "espada" : "sword")
                    : id === "tree" ? (es ? "\u00e1rbol" : "tree")
                    : (es ? "letra" : "letter")}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-zinc-600">{t.tip}</p>
            <p className="mt-1 font-mono text-[9px] leading-relaxed text-zinc-500">'''
# fix unicode in new_ui for real chars
new_ui = new_ui.replace("\\u00f3", "ó").replace("\\u00e1", "á")
if old_ui not in t:
    raise SystemExit("UI tip anchor not found")
t = t.replace(old_ui, new_ui, 1)

TARGET.write_text(t, encoding="utf-8")
assert "/* examples-v1 */" in TARGET.read_text()
assert "loadExample" in TARGET.read_text()
print("ok examples-v1")
