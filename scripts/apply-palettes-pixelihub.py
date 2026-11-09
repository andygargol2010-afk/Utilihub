#!/usr/bin/env python3
"""Add palette presets + custom slot to PixeliHub (roadmap item 10)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* palettes-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) Replace single PALETTE with named presets
old_pal = '''const PALETTE = [
  "#000000", "#1a1a2e", "#16213e", "#0f3460", "#e94560", "#ff6b6b", "#feca57", "#ff9ff3",
  "#54a0ff", "#5f27cd", "#01a3a4", "#10ac84", "#ffffff", "#c8d6e5", "#8395a7", "#576574",
  "#222f3e", "#ee5a24", "#f79f1f", "#a3cb38", "#1289a7", "#d980fa", "#bdc3c7", "#6c5ce7",
];'''

new_pal = '''/* palettes-v1 */
const PALETTE_PRESETS: { id: string; labelEn: string; labelEs: string; colors: string[] }[] = [
  {
    id: "default",
    labelEn: "Default",
    labelEs: "Default",
    colors: [
      "#000000", "#1a1a2e", "#16213e", "#0f3460", "#e94560", "#ff6b6b", "#feca57", "#ff9ff3",
      "#54a0ff", "#5f27cd", "#01a3a4", "#10ac84", "#ffffff", "#c8d6e5", "#8395a7", "#576574",
      "#222f3e", "#ee5a24", "#f79f1f", "#a3cb38", "#1289a7", "#d980fa", "#bdc3c7", "#6c5ce7",
    ],
  },
  {
    id: "pico",
    labelEn: "Retro 16",
    labelEs: "Retro 16",
    colors: [
      "#000000", "#1d2b53", "#7e2553", "#008751", "#ab5236", "#5f574f", "#c2c3c7", "#fff1e8",
      "#ff004d", "#ffa300", "#ffec27", "#00e436", "#29adff", "#83769c", "#ff77a8", "#ffccaa",
    ],
  },
  {
    id: "earth",
    labelEn: "Earth",
    labelEs: "Tierra",
    colors: [
      "#1a120b", "#3d2914", "#6b4226", "#a67c52", "#d4a574", "#f5e6d3", "#2d4a22", "#4a7c3f",
      "#8fbc8f", "#c4e0c4", "#4a3728", "#8b6914", "#c9a227", "#5c4033", "#ffffff", "#000000",
    ],
  },
  {
    id: "pastel",
    labelEn: "Pastel",
    labelEs: "Pastel",
    colors: [
      "#f8f1f1", "#ffe5ec", "#ffc2d1", "#ffb3c6", "#ff8fab", "#fb6f92", "#e0aaff", "#c77dff",
      "#9b5de5", "#a0c4ff", "#bdb2ff", "#caffbf", "#fdffb6", "#ffd6a5", "#ffadad", "#2b2d42",
    ],
  },
  {
    id: "mono",
    labelEn: "Mono",
    labelEs: "Mono",
    colors: [
      "#000000", "#111111", "#222222", "#333333", "#555555", "#777777", "#999999", "#bbbbbb",
      "#dddddd", "#ffffff", "#1a1a1a", "#2e2e2e", "#424242", "#616161", "#9e9e9e", "#e0e0e0",
    ],
  },
  {
    id: "neon",
    labelEn: "Neon",
    labelEs: "Neón",
    colors: [
      "#0d0d0d", "#1a0033", "#ff00ff", "#00ffff", "#39ff14", "#ff073a", "#fff01f", "#ff6ec7",
      "#7df9ff", "#b6ff00", "#fe019a", "#0ff0fc", "#ccff00", "#ff3131", "#ffffff", "#222222",
    ],
  },
];'''

if old_pal not in t:
    raise SystemExit("PALETTE const not found")
t = t.replace(old_pal, new_pal, 1)

# 2) State after color
old_color = '  const [color, setColor] = useState("#e94560");'
new_color = '''  const [color, setColor] = useState("#e94560");
  const [paletteId, setPaletteId] = useState("default");
  const [customColors, setCustomColors] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("utilihub-pixelihub-custom-colors");
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed)) return parsed.filter((c) => typeof c === "string").slice(0, 16);
      }
    } catch { /* ignore */ }
    return [];
  });'''
if old_color not in t:
    raise SystemExit("color state not found")
t = t.replace(old_color, new_color, 1)

# 3) Labels
old_lab = '    size: es ? "Tamaño" : "Size", zoom: "Zoom", brush: es ? "Grosor" : "Brush", color: es ? "Color" : "Color",'
new_lab = '    size: es ? "Tamaño" : "Size", zoom: "Zoom", brush: es ? "Grosor" : "Brush", color: es ? "Color" : "Color", palette: es ? "Paleta" : "Palette", addColor: es ? "+ color" : "+ color",'
if old_lab not in t:
    raise SystemExit("labels not found")
t = t.replace(old_lab, new_lab, 1)

# 4) Persist custom colors — insert after layers localStorage effect if possible, or after color state usage
# Find localStorage set for size/layers and add another effect nearby
old_ls = '''  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ size, layers })); } catch { /* ignore */ }
  }, [size, layers]);'''
new_ls = '''  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ size, layers })); } catch { /* ignore */ }
  }, [size, layers]);

  useEffect(() => {
    try { localStorage.setItem("utilihub-pixelihub-custom-colors", JSON.stringify(customColors)); } catch { /* ignore */ }
  }, [customColors]);

  const activePalette = useMemo(
    () => PALETTE_PRESETS.find((p) => p.id === paletteId) ?? PALETTE_PRESETS[0],
    [paletteId],
  );
  const paletteColors = activePalette.colors;'''
if old_ls not in t:
    raise SystemExit("localStorage effect not found")
t = t.replace(old_ls, new_ls, 1)

# 5) UI color panel
old_ui = '''          <div className="border-b border-zinc-700/60 p-2">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.color}</p>
            <div className="grid grid-cols-8 gap-0.5">
              {PALETTE.map((c) => (
                <button key={c} type="button" title={c} onClick={() => setColor(c)}
                  className={`aspect-square rounded-sm ${color === c ? "ring-2 ring-rose-400 ring-offset-1 ring-offset-[#141418]" : ""}`}
                  style={{ background: c }} />
              ))}
            </div>
            <input type="color" value={color.length === 7 ? color : "#e94560"} onChange={(e) => setColor(e.target.value)}
              className="mt-2 h-6 w-10 cursor-pointer rounded border border-zinc-600 bg-transparent" />
          </div>'''

new_ui = '''          <div className="border-b border-zinc-700/60 p-2">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.palette}</p>
            <div className="mb-2 flex flex-wrap gap-1">
              {PALETTE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaletteId(p.id)}
                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${paletteId === p.id ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                >
                  {es ? p.labelEs : p.labelEn}
                </button>
              ))}
            </div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.color}</p>
            <div className="grid grid-cols-8 gap-0.5">
              {paletteColors.map((c) => (
                <button key={`${paletteId}-${c}`} type="button" title={c} onClick={() => setColor(c)}
                  className={`aspect-square rounded-sm ${color === c ? "ring-2 ring-rose-400 ring-offset-1 ring-offset-[#141418]" : ""}`}
                  style={{ background: c }} />
              ))}
            </div>
            {customColors.length > 0 ? (
              <div className="mt-1.5 grid grid-cols-8 gap-0.5">
                {customColors.map((c, idx) => (
                  <button
                    key={`custom-${idx}-${c}`}
                    type="button"
                    title={c}
                    onClick={() => setColor(c)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setCustomColors((arr) => arr.filter((_, j) => j !== idx));
                    }}
                    className={`aspect-square rounded-sm ${color === c ? "ring-2 ring-rose-400 ring-offset-1 ring-offset-[#141418]" : ""}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            ) : null}
            <div className="mt-2 flex items-center gap-2">
              <input type="color" value={color.length === 7 ? color : "#e94560"} onChange={(e) => setColor(e.target.value)}
                className="h-6 w-10 cursor-pointer rounded border border-zinc-600 bg-transparent" />
              <button
                type="button"
                className="rounded bg-zinc-800 px-2 py-1 text-[10px] font-semibold text-zinc-300 hover:bg-zinc-700"
                onClick={() => {
                  const c = color.length === 7 ? color : "#e94560";
                  setCustomColors((arr) => {
                    if (arr.includes(c)) return arr;
                    return [...arr, c].slice(-16);
                  });
                }}
              >
                {t.addColor}
              </button>
            </div>
          </div>'''

if old_ui not in t:
    raise SystemExit("color UI block not found")
t = t.replace(old_ui, new_ui, 1)

TARGET.write_text(t)
assert "palettes-v1" in TARGET.read_text()
assert "PALETTE_PRESETS" in TARGET.read_text()
assert "paletteColors" in TARGET.read_text()
# Ensure no leftover PALETTE. references
if "PALETTE.map" in TARGET.read_text() or "const PALETTE =" in TARGET.read_text():
    raise SystemExit("leftover PALETTE reference")
print("ok", TARGET.stat().st_size)
