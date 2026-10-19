#!/usr/bin/env python3
"""Assemble PixelArtStudio examples-v1 from part*.b64"""
from pathlib import Path
import base64
ROOT = Path(__file__).resolve().parents[1]
parts_dir = ROOT / "scripts" / "pixelihub-examples-parts"
data = "".join((parts_dir / f"part{i}.b64").read_text().strip() for i in range(4))
raw = base64.b64decode(data)
TARGET = ROOT / "src" / "components" / "general" / "PixelArtStudio.tsx"
TARGET.write_bytes(raw)
assert b"examples-v1" in raw
print("ok", len(raw))
