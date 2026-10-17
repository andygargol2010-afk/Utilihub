#!/usr/bin/env python3
"""Improve touch drawing on PixeliHub (roadmap item 17)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()

if "/* touch-v1 */" in t:
    print("already patched")
    raise SystemExit(0)

# 1) lastPaintCell ref near drawing refs — find drawing.current usage / startCell
# Look for refs block
old_refs = "  const canvasRef = useRef<HTMLCanvasElement>(null);"
if old_refs not in t:
    raise SystemExit("canvasRef not found")
# fileInput may already be after — keep simple
if "const drawing" in t or "drawing.current" in t:
    pass

# Find startCell / drawing refs
import re
m = re.search(r"const (drawing|startCell|snapshot)\s*=\s*useRef", t)
print("ref sample:", m.group(0) if m else None)

# Search for typical pattern
for pattern in [
    "const drawing = useRef",
    "drawing = useRef",
    "startCell = useRef",
]:
    if pattern in t:
        print("found", pattern)

# Read a chunk around refs by finding snapshot
idx = t.find("startCell")
print(t[idx-200:idx+200] if idx>=0 else "no startCell")
