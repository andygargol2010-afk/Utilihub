#!/usr/bin/env python3
"""Make PixeliHub toolbar + tools sticky on mobile (roadmap item 16)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* sticky-mobile-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) Outer shell — overflow-x only so position:sticky can work on Y
old_outer = '<div className="-m-1 overflow-hidden rounded-xl border border-zinc-700/80 bg-[#1a1a1f] text-zinc-100 shadow-inner sm:-m-2">'
new_outer = '<div className="/* sticky-mobile-v1 */ -m-1 overflow-x-hidden rounded-xl border border-zinc-700/80 bg-[#1a1a1f] text-zinc-100 shadow-inner sm:-m-2">'
if old_outer not in t:
    raise SystemExit("outer shell not found")
t = t.replace(old_outer, new_outer, 1)

# 2) Top toolbar sticky
old_top = '<div className="flex flex-wrap items-center gap-1 border-b border-zinc-700/80 bg-[#121216] px-2 py-1.5">'
new_top = '<div className="sticky top-0 z-30 flex flex-wrap items-center gap-1 border-b border-zinc-700/80 bg-[#121216]/95 px-2 py-1.5 backdrop-blur-sm supports-[backdrop-filter]:bg-[#121216]/80">'
if old_top not in t:
    raise SystemExit("top toolbar not found")
t = t.replace(old_top, new_top, 1)

# 3) Main flex: on mobile put tools after canvas for bottom sticky thumb zone
old_main = '<div className="flex min-h-[min(70vh,560px)] flex-col md:flex-row">'
new_main = '<div className="flex min-h-[min(70vh,560px)] flex-col md:flex-row">'
# keep same — use order on children instead

old_tools = '<div className="flex shrink-0 flex-row gap-0.5 overflow-x-auto border-b border-zinc-700/80 bg-[#141418] p-1.5 md:w-12 md:flex-col md:border-b-0 md:border-r">'
new_tools = '<div className="order-2 flex shrink-0 flex-row gap-0.5 overflow-x-auto border-t border-zinc-700/80 bg-[#141418]/95 p-1.5 backdrop-blur-sm sticky bottom-0 z-20 md:order-none md:sticky-auto md:bottom-auto md:w-12 md:flex-col md:border-b-0 md:border-t-0 md:border-r md:bg-[#141418] md:backdrop-blur-none">'
if old_tools not in t:
    raise SystemExit("tools strip not found")
t = t.replace(old_tools, new_tools, 1)

# 4) Canvas order-1 on mobile so tools sit under it / sticky bottom
old_canvas_wrap = '<div className="relative min-w-0 flex-1 bg-[#0e0e12">'
# fix typo - need exact
if 'className="relative min-w-0 flex-1 bg-[#0e0e12]"' not in t:
    raise SystemExit("canvas wrap not found")
t = t.replace(
    'className="relative min-w-0 flex-1 bg-[#0e0e12]"',
    'className="relative order-1 min-w-0 flex-1 bg-[#0e0e12] md:order-none"',
    1,
)

# 5) Aside order-3 on mobile
if 'aside className="flex w-full shrink-0 flex-col border-t border-zinc-700/80 bg-[#141418] md:w-52 md:border-l md:border-t-0"' not in t:
    # try find aside
    import re
    m = re.search(r'<aside className="[^"]+"', t)
    print("aside sample:", m.group(0) if m else None)
    raise SystemExit("aside not found")
t = t.replace(
    'aside className="flex w-full shrink-0 flex-col border-t border-zinc-700/80 bg-[#141418] md:w-52 md:border-l md:border-t-0"',
    'aside className="order-3 flex w-full shrink-0 flex-col border-t border-zinc-700/80 bg-[#141418] md:order-none md:w-52 md:border-l md:border-t-0"',
    1,
)

# Tailwind doesn't have sticky-auto — use md:static instead
t = t.replace("md:sticky-auto", "md:static", 1)

TARGET.write_text(t)
assert "sticky-mobile-v1" in TARGET.read_text()
assert "sticky top-0" in TARGET.read_text()
assert "sticky bottom-0" in TARGET.read_text()
print("ok", TARGET.stat().st_size)
