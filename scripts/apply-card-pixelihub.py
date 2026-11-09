#!/usr/bin/env python3
"""Add PixeliHub premium showcase card + stronger home featured card (roadmap item 21)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# --- tool-showcase.ts ---
ts = ROOT / "src/lib/tool-showcase.ts"
t = ts.read_text()
if '"pixelihub"' not in t or '"pixelihub": {' not in t:
    # insert before closing of TOOL_SHOWCASE
    needle = '  "combustible-viaje": { badge: "Travel", badgeEs: "Viajes", tagline: "Fuel cost estimate for a trip with distance, MPG/L/100km, and price.", taglineEs: "Estimación de combustible del viaje: distancia, consumo y precio.", fromLabel: "TRIP", toLabel: "COST", accent: "violet" },\n};'
    entry = '''  "combustible-viaje": { badge: "Travel", badgeEs: "Viajes", tagline: "Fuel cost estimate for a trip with distance, MPG/L/100km, and price.", taglineEs: "Estimación de combustible del viaje: distancia, consumo y precio.", fromLabel: "TRIP", toLabel: "COST", accent: "violet" },

  // —— Advanced studio: PixeliHub ——
  "pixelihub": {
    badge: "Pixel art",
    badgeEs: "Pixel art",
    tagline: "Free browser pixel-art studio: layers, palettes, Nx PNG export, spritesheets, and shareable links.",
    taglineEs: "Estudio de pixel art gratis en el navegador: capas, paletas, export PNG Nx, spritesheets y enlaces para compartir.",
    fromLabel: "8×8",
    toLabel: "256",
    accent: "rose",
  },
};'''
    if needle not in t:
        # try simpler end
        if '  "combustible-viaje":' in t and t.rstrip().endswith('};') is False:
            pass
        # find last entry before };
        idx = t.rfind("\n};\n\nexport function getToolShowcase")
        if idx < 0:
            idx = t.rfind("\n};\n\nexport function getToolShowcase")
        if idx < 0:
            raise SystemExit("TOOL_SHOWCASE end not found")
        insert = '''

  // —— Advanced studio: PixeliHub ——
  "pixelihub": {
    badge: "Pixel art",
    badgeEs: "Pixel art",
    tagline: "Free browser pixel-art studio: layers, palettes, Nx PNG export, spritesheets, and shareable links.",
    taglineEs: "Estudio de pixel art gratis en el navegador: capas, paletas, export PNG Nx, spritesheets y enlaces para compartir.",
    fromLabel: "8×8",
    toLabel: "256",
    accent: "rose",
  },'''
        t = t[:idx] + insert + t[idx:]
    else:
        t = t.replace(needle, entry, 1)
    ts.write_text(t)
    print("showcase entry ok")
else:
    print("showcase entry already present")

# --- showcase-slugs.ts ---
ss = ROOT / "src/lib/showcase-slugs.ts"
st = ss.read_text()
if '"pixelihub"' not in st:
    # add before closing ]);
    if '  "combustible-viaje",\n]);' in st:
        st = st.replace(
            '  "combustible-viaje",\n]);',
            '  "combustible-viaje",\n  "pixelihub",\n]);',
            1,
        )
    else:
        idx = st.rfind("\n]);")
        if idx < 0:
            raise SystemExit("SHOWCASE_SLUGS end not found")
        st = st[:idx] + '\n  "pixelihub",' + st[idx:]
    ss.write_text(st)
    print("showcase-slugs ok")
else:
    print("showcase-slugs already has pixelihub")

# --- HomeFeaturedSection: richer card for pixelihub ---
hf = ROOT / "src/components/HomeFeaturedSection.tsx"
h = hf.read_text()
if "/* pixelihub-card-v1 */" in h:
    print("home card already patched")
else:
    old_body = '''              const body = (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-primary">{copy.studioBadge}</span>
                  <h3 className="mt-1 font-bold group-hover:text-primary">{name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.summary}</p>
                </>
              );
              const className =
                "card-hover group block rounded-xl border border-border/60 bg-background/80 p-3.5 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md";'''
    new_body = '''              /* pixelihub-card-v1 */
              const isPixel = tool.slug === "pixelihub";
              const body = (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isPixel ? "text-rose-500" : "text-primary"}`}>
                      {isPixel ? (es ? "Pixel art" : "Pixel art") : copy.studioBadge}
                    </span>
                    {isPixel ? (
                      <span className="font-mono text-[9px] text-rose-400/80" aria-hidden>
                        ▦ 32×32
                      </span>
                    ) : null}
                  </div>
                  <h3 className={`mt-1 font-bold group-hover:text-primary ${isPixel ? "group-hover:text-rose-500" : ""}`}>{name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.summary}</p>
                </>
              );
              const className = isPixel
                ? "card-hover group block rounded-xl border border-rose-500/35 bg-gradient-to-br from-rose-500/10 via-background/90 to-background/80 p-3.5 hover:-translate-y-0.5 hover:border-rose-500/50 hover:shadow-md"
                : "card-hover group block rounded-xl border border-border/60 bg-background/80 p-3.5 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md";'''
    if old_body not in h:
        raise SystemExit("home featured body not found")
    h = h.replace(old_body, new_body, 1)
    hf.write_text(h)
    print("home card ok")

# verify
assert '"pixelihub"' in (ROOT / "src/lib/tool-showcase.ts").read_text()
assert '"pixelihub"' in (ROOT / "src/lib/showcase-slugs.ts").read_text()
assert "pixelihub-card-v1" in (ROOT / "src/components/HomeFeaturedSection.tsx").read_text()
print("ok")
