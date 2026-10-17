#!/usr/bin/env python3
"""Add share-by-link (hash payload) to PixeliHub (roadmap item 13)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* share-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) Helpers after cloneLayers
old_clone = "function cloneLayers(layers: string[][]) { return layers.map((l) => l.slice()); }"
new_clone = '''function cloneLayers(layers: string[][]) { return layers.map((l) => l.slice()); }

/* share-v1 */
function toBase64Url(str: string) {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromBase64Url(s: string) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return decodeURIComponent(escape(atob(b64)));
}
function encodeSharePayload(size: number, layers: string[][]) {
  const L = layers.map((layer) => {
    const sparse: string[] = [];
    for (let i = 0; i < layer.length; i++) {
      const c = layer[i];
      if (c && c.startsWith("#") && c.length === 7) sparse.push(`${i}:${c.slice(1)}`);
    }
    return sparse;
  });
  return toBase64Url(JSON.stringify({ v: 1, s: size, L }));
}
function decodeSharePayload(encoded: string): { size: number; layers: string[][] } | null {
  try {
    const data = JSON.parse(fromBase64Url(encoded)) as { v?: number; s?: number; L?: string[][] };
    if (!data || data.v !== 1 || !data.s || !Array.isArray(data.L)) return null;
    const size = data.s;
    if (![8, 16, 32, 64, 128, 256].includes(size)) return null;
    const layers = data.L.slice(0, 4).map((sparse) => {
      const layer = emptyLayer(size);
      if (!Array.isArray(sparse)) return layer;
      for (const entry of sparse) {
        const [idxStr, hex] = entry.split(":");
        const idx = Number(idxStr);
        if (!Number.isFinite(idx) || idx < 0 || idx >= size * size) continue;
        if (!hex || !/^[0-9a-fA-F]{6}$/.test(hex)) continue;
        layer[idx] = `#${hex.toLowerCase()}`;
      }
      return layer;
    });
    if (!layers.length) layers.push(emptyLayer(size));
    return { size, layers };
  } catch {
    return null;
  }
}'''

if old_clone not in t:
    raise SystemExit("cloneLayers not found")
t = t.replace(old_clone, new_clone, 1)

# 2) Load: prefer hash over localStorage
old_load = '''  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { size?: number; layers?: string[][] };
        if (data.size && data.layers) { setSize(data.size); setLayers(data.layers); }
      }
    } catch { /* ignore */ }
  }, []);'''

new_load = '''  useEffect(() => {
    try {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const m = /^#ph=([A-Za-z0-9_-]+)/.exec(hash);
      if (m) {
        const decoded = decodeSharePayload(m[1]);
        if (decoded) {
          setSize(decoded.size);
          setLayers(decoded.layers);
          setActiveLayer(0);
          setStatus(es ? "Enlace cargado" : "Link loaded");
          return;
        }
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { size?: number; layers?: string[][] };
        if (data.size && data.layers) { setSize(data.size); setLayers(data.layers); }
      }
    } catch { /* ignore */ }
  }, [es]);'''

if old_load not in t:
    raise SystemExit("localStorage load effect not found")
t = t.replace(old_load, new_load, 1)

# 3) shareProject function before tools array (after importImage)
old_tools = "  const tools: { id: ToolId; icon: string; label: string }[] = ["
if old_tools not in t:
    raise SystemExit("tools not found")

share_fn = '''  const shareProject = async () => {
    try {
      const encoded = encodeSharePayload(size, layers);
      const url = `${window.location.origin}${window.location.pathname}${window.location.search}#ph=${encoded}`;
      if (navigator.share) {
        try {
          await navigator.share({ title: "PixeliHub", url });
          setStatus(es ? "Compartido" : "Shared");
          return;
        } catch {
          /* fall through to clipboard */
        }
      }
      await navigator.clipboard.writeText(url);
      setStatus(es ? "Enlace copiado" : "Link copied");
    } catch {
      setStatus("Error");
    }
  };

  const tools: { id: ToolId; icon: string; label: string }[] = ['''

t = t.replace(old_tools, share_fn, 1)

# 4) Share button after copy
old_copy = '''        <button type="button" onClick={() => exportPng(true)} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">{t.copy}</button>'''
new_copy = '''        <button type="button" onClick={() => exportPng(true)} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">{t.copy}</button>
        <button type="button" onClick={() => void shareProject()} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↗ {t.share}</button>'''
if old_copy not in t:
    raise SystemExit("copy button not found")
t = t.replace(old_copy, new_copy, 1)

TARGET.write_text(t)
assert "share-v1" in TARGET.read_text()
assert "encodeSharePayload" in TARGET.read_text()
assert "shareProject" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
