#!/usr/bin/env python3
from pathlib import Path
path = Path("src/components/general/PixelArtStudio.tsx")
text = path.read_text()
def must_replace(old, new, label):
    global text
    if old not in text:
        raise SystemExit("missing marker: " + label)
    text = text.replace(old, new, 1)
must_replace(
    "  /* touch-v1 */\n  const lastPaintCell = useRef<{ x: number; y: number } | null>(null);",
    "  /* touch-v1 */\n  const lastPaintCell = useRef<{ x: number; y: number } | null>(null);\n  const bodyScrollLock = useRef(0);",
    "refs",
)
old_wrap = (
    'className="flex h-full min-h-[280px] items-center justify-center overflow-auto p-3 touch-pan-y md:touch-auto"\n'
    '            style={{ WebkitUserSelect: "none", userSelect: "none" }}'
)
new_wrap = (
    'className="flex h-full min-h-[280px] items-center justify-center overflow-auto p-3 touch-none overscroll-none"\n'
    '            style={{ WebkitUserSelect: "none", userSelect: "none", touchAction: "none", overscrollBehavior: "none" }}'
)
must_replace(old_wrap, new_wrap, "wrapper")
old_root = 'className="/* sticky-mobile-v1 */ relative -m-1 overflow-x-hidden rounded-xl border border-zinc-700/80 bg-[#1a1a1f] text-zinc-100 shadow-inner sm:-m-2"'
new_root = 'className="/* sticky-mobile-v1 touch-draw-v2 */ relative -m-1 overflow-x-hidden overscroll-none rounded-xl border border-zinc-700/80 bg-[#1a1a1f] text-zinc-100 shadow-inner sm:-m-2" style={{ overscrollBehavior: "none" }}'
must_replace(old_root, new_root, "root")
path.write_text(text)
print("ok", len(text), "touch-draw-v2" in text, "touch-pan-y" not in text)
