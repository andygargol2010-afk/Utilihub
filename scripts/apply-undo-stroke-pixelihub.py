#!/usr/bin/env python3
"""Fix PixeliHub undo so one stroke = one undo step (save pre-stroke state)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* stroke-undo-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) Fill: pushHistory(prev) not next
old_fill = 'if (tool === "fill") { floodFill(data, size, x, y, data[y * size + x] ?? "", col); pushHistory(next); return next; }'
new_fill = 'if (tool === "fill") { /* stroke-undo-v1 */ floodFill(data, size, x, y, data[y * size + x] ?? "", col); pushHistory(prev); return next; }'
if old_fill not in t:
    raise SystemExit("fill block not found")
t = t.replace(old_fill, new_fill, 1)

# 2) Pointer up: commit pre-stroke snapshot, not post-stroke layers
old_up = '''  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (tool !== "eyedropper") setLayers((curr) => { pushHistory(curr); return curr; });
    startCell.current = null;
    snapshot.current = null;
  };'''

new_up = '''  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    // One stroke = one undo: store state from before the stroke began.
    if (tool !== "eyedropper" && tool !== "fill" && snapshot.current) {
      pushHistory(snapshot.current);
    }
    startCell.current = null;
    snapshot.current = null;
  };'''

if old_up not in t:
    raise SystemExit("onPointerUp block not found")
t = t.replace(old_up, new_up, 1)

TARGET.write_text(t)
assert "stroke-undo-v1" in TARGET.read_text()
assert "pushHistory(snapshot.current)" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
