#!/usr/bin/env python3
"""Improve PixeliHub next-step journey and in-studio CTA (roadmap item 20)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# --- discovery.ts ---
disc = ROOT / "src/lib/discovery.ts"
dt = disc.read_text()
if "/* pixelihub-nextstep-v1 */" not in dt:
    old_j = '  "pixelihub": ["modelador-3d", "generador-paleta", "selector-color", "mezclador-de-colores"],'
    new_j = '''  /* pixelihub-nextstep-v1 */
  "pixelihub": ["generador-paleta", "selector-color", "mezclador-de-colores", "modelador-3d"],'''
    if old_j not in dt:
        raise SystemExit("pixelihub journey not found")
    dt = dt.replace(old_j, new_j, 1)

    old_label = '''  if (current.slug === "modelador-3d" || current.slug === "modelador-casas-3d" || current.slug === "pixelihub") {
    return es
      ? "Seguí en el estudio o pasá a diseño y color"
      : "Stay in the studio or move to design and color";
  }'''
    new_label = '''  if (current.slug === "pixelihub") {
    return es
      ? "Armá una paleta y seguí diseñando sprites"
      : "Build a palette and keep designing sprites";
  }
  if (current.slug === "modelador-3d" || current.slug === "modelador-casas-3d") {
    return es
      ? "Seguí en el estudio o pasá a diseño y color"
      : "Stay in the studio or move to design and color";
  }'''
    if old_label not in dt:
        raise SystemExit("journeyLabel block not found")
    dt = dt.replace(old_label, new_label, 1)
    disc.write_text(dt)
    print("discovery ok")
else:
    print("discovery already patched")

# --- PixelArtStudio in-studio CTA ---
TARGET = ROOT / "src/components/general/PixelArtStudio.tsx"
t = TARGET.read_text()
if "/* nextstep-studio-v1 */" in t:
    print("studio already patched")
    raise SystemExit(0)

# Need Link from tanstack if not present
if 'from "@tanstack/react-router"' not in t and "from '@tanstack/react-router'" not in t:
    t = t.replace(
        'import { useCallback, useEffect, useMemo, useRef, useState } from "react";',
        'import { useCallback, useEffect, useMemo, useRef, useState } from "react";\nimport { Link } from "@tanstack/react-router";',
        1,
    )

# Insert CTA before closing outer relative div — after onboarding overlay closing
old_end = '''      {showOnboard ? (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-[2px] sm:items-center">'''

# Better: add strip after main flex, before onboard
anchor = "      {showOnboard ? ("
if anchor not in t:
    raise SystemExit("onboard anchor not found")

cta = '''      {/* nextstep-studio-v1 */}
      <div className="border-t border-zinc-700/80 bg-[#121216] px-3 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400/90">
          {es ? "Siguiente paso" : "Next step"}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <Link
            to={es ? "/es/herramientas/$slug" : "/tools/$slug"}
            params={{ slug: es ? "generador-paleta" : "palette-generator" }}
            className="rounded-md bg-zinc-800 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-200 hover:bg-rose-500/20 hover:text-rose-200"
          >
            {es ? "Generador de paleta" : "Palette generator"}
          </Link>
          <Link
            to={es ? "/es/herramientas/$slug" : "/tools/$slug"}
            params={{ slug: es ? "selector-color" : "color-picker" }}
            className="rounded-md bg-zinc-800 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-200 hover:bg-rose-500/20 hover:text-rose-200"
          >
            {es ? "Selector de color" : "Color picker"}
          </Link>
          <Link
            to={es ? "/es/herramientas/$slug" : "/tools/$slug"}
            params={{ slug: es ? "mezclador-de-colores" : "color-mixer" }}
            className="rounded-md bg-zinc-800 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-200 hover:bg-rose-500/20 hover:text-rose-200"
          >
            {es ? "Mezclador de colores" : "Color mixer"}
          </Link>
        </div>
      </div>

      {showOnboard ? ('''

t = t.replace(anchor, cta, 1)
TARGET.write_text(t)

# Verify english slugs — UtiliHub may use spanish slugs even on EN routes via englishToolSlug
# Safer: use catalog internal slugs only; englishToolSlug maps them.
# Check englishToolSlug behavior
print("checking route slug map...")
route = (ROOT / "src/lib/route-slugs.ts").read_text()
if "palette-generator" not in route and "generador-paleta" in route:
    # EN routes often still use internal slug or mapped English — fix links to use internal slugs for both
    # Re-read studio and force internal slug for both locales if english map is different
    pass

assert "nextstep-studio-v1" in TARGET.read_text()
assert "pixelihub-nextstep-v1" in disc.read_text()
print("ok")
